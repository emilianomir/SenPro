"use server";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { eq, and, sql} from "drizzle-orm";

import { userAgentFromString } from "next/server.js";

// databases
import { questions } from "../db/schema/questions.js";
import { services } from "../db/schema/services.js";
import { favorites } from "../db/schema/favorites.js";
import { history } from "../db/schema/history.js";
import { sessions } from "../db/schema/sessions.js";

// encryption
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
// Sessions
import { cookies } from "next/headers.js";

// testing for existing emails in singup
export async function testExistingUser(email){
   const data = await db.select().from(users).where(eq(users.email, email));
   if(data.length === 0)
   {
    return false
   }
   else
   {
    return true
   }
  }

// Adding User for Sign up
export async function addUser(
  email,
  username,
  password,
  address = "",
  type = "user"
) {
  console.log("Adding user to db:", {
    email,
    username,
    password,
    address,
    type
  });
  const pass = await bcrypt.hash(password, 10);
  try{
    await db.insert(users).values({
      email: email,
      username: username,
      password: password,
      address: address,
      type: type,
    });
    console.log("user added successfully");
  } catch (e) {
    console.error("error in adding user:", e);
    throw e;
  }
}

// Checking Login
export async function checkLogin(email, password){
    
    const data = await db.select().from(users).where(eq(users.email, email));
    if(data.length === 0)
    {

     return false
    }
    else
    {
        return await bcrypt.compare(password, data[0].password)
    }
 }

export async function updateUserAddress(email, address) {
  try {
    await db
      .update(users)
      .set({ address: address })
      .where(eq(users.email, email));
    console.log("address updated successfully");
  } catch (e) {
    console.error("error updating address:", e);
    throw e;
  }
}

export async function addQuestion(userEmail, question, answer) {
  try {
    console.log("adding question to db:", {
      userEmail,
      question,
      answer,
    });


    await db.insert(questions).values({
      userEmail: userEmail,
      question: question,
      answer: answer,
    });
  } catch (e) {
    console.error("error in in question adding:", e);
    throw e;
  }
}

export async function getUserQuestions(userEmail) {
    try {
        const data = await db.select().from(questions).where(eq(questions.userEmail, userEmail));
        return data;
    } catch (e) {
        console.error("error getting questions and answers:", e);
        throw e;
    }
}

// export async function checkLogin(email, password) {
//   const data = await db.select().from(users).where(eq(users.email, email));
//   if (data.length === 0) {
//     return false;
//   } else {
//     return await bcrypt.compare(password, data[0].password);
//   }
// }

// get user attrributes
export async function getUser(email) {
  return await db
    .select({
      email: users.email,
      username: users.username,
      address: users.address,
    })
    .from(users)
    .where(eq(users.email, email));
  }


//change password
export async function changePass(email, newpass)
{
  const pass = await bcrypt.hash(newpass, 10);

  await db.update( users )
  .set({password: pass})
  .where(eq(users.email, email));
}





// API Call
async function getAPI(id) {
  try{
    const api_key = process.env.GOOGLE_API_KEY;
    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": api_key,
      "X-Goog-FieldMask": "displayName,formattedAddress,rating,photos,priceRange,userRatingCount,websiteUri,regularOpeningHours"
    };
    const response = await fetch(`https://places.googleapis.com/v1/places/${id}`,{
        method: "GET",
        headers: headers
    });
    
    if (response.ok) {

      var temp = new Response(JSON.stringify({ service_result:  await response.json()}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }); 
      const {service_result} = await temp.json();
      if (service_result.photos)
      try {
          const image_url = `https://places.googleapis.com/v1/${service_result.photos[0].name}/media?key=${api_key}&maxHeightPx=400&maxWidthPx=400`; //(`/api/maps/places?thePhoto=` + service_result.photos[0].name);
          const image_response = await fetch(image_url);
          service_result.photoURL = image_response.url;
          
      }catch(error) {
          console.error("Error fetching image for id " + id + ":", error);
      }
      service_result.id = id;
      return service_result;
    }
  }catch(error) {
    console.error("Error fetching service " + id + ":", error);
  }
}










// Service Calls
  // Check
export async function checkService(primaryKey) {
const data = await db.select().from(services).where(eq(services.address, primaryKey));
return data.length === 0;
}

  // Add
export async function addService(primaryKey, info) {
  try {
  console.log("adding service to db:", {
    primaryKey,
    info,
  });

  if(await checkService(primaryKey)){
    await db.insert(services).values({
      address: primaryKey,
      info: JSON.stringify(info),
    });
  }

} catch (e) {
  console.error("error in in service adding:", e);
  throw e;
}
}



// Favorite Calls
  // Check
export async function checkFavoriteService(primaryKey, email){
const data = await db.select().from(favorites).where(and(eq(favorites.sAddress, primaryKey), eq(favorites.userEmail, email)));
return data.length === 0;
}

  // Add
export async function addFavoriteService(primaryKey, info, email) {
try {
  console.log("adding service to db:", {
    primaryKey,
    info,
  });

  if(await checkService(primaryKey)){
    await db.insert(services).values({
      address: primaryKey,
      info: JSON.stringify(info),
    });
  }
  await db.insert(favorites).values({
    userEmail: email,
    sAddress:  primaryKey,
  })
} catch (e) {
  console.error("error in in service adding:", e);
  throw e;
}
}

  // Remove
export async function removeFavoriteService(primaryKey, email) {
try {
  console.log("deleting service to db:", {
    primaryKey,
  });

  await db.delete(favorites).where(and(eq(favorites.sAddress, primaryKey), eq(favorites.userEmail, email)));
} catch (e) {
  console.error("error in in service deletion:", e);
  throw e;
}
}

  // Get
export async function getFavorites(email)
{
  try {
    console.log("getting Favorite services from db given email:", {
      email,
    });

    const value = await db.select({ info: services.address, response: services.info })
    .from(services)
    .fullJoin(favorites, eq(favorites.sAddress, services.address))
    .where(eq(favorites.userEmail, email));

    return value;

  } catch (e) {
    console.error("error in in service selection:", e);
    throw e;
  }
}


// History Calls
  // Check
export async function checkHistoryService(primaryKey, email, d2) {
const data = await db.select({time: sql`time(created_at)`, date: sql`date(created_at)`}).from(history).where(and(eq(history.sAddress, primaryKey), eq(history.userEmail, email)));
if (data.length == 0){
  return true
}
else{
  data.forEach(element => {
    if(d2[0].date == element.date)
    {
      let [h1, m1, s1] = element.time.split(':');
      let [h2, m2, s2] =  d2[0].time.split(':');
      let val1 = ((h1*60)*60) + (m1*60) + s1;
      let val2 = ((h2*60)*60) + (m2*60) + s2;    

      difference = val1 - val2;
      if (difference <= 10)
        return false;
    }
  });
  return true;
}
}

  // Add
export async function addHistoryService(services, email) {
try {
  console.log("adding service to db:", {
    services,
    email,
  });
  const d2 = await db.select({total: sql`(CURRENT_TIMESTAMP)`, time: sql`time(CURRENT_TIMESTAMP)`, date: sql`date(CURRENT_TIMESTAMP)`}).from(users).where(eq(users.email, email));
  if(await checkHistoryService(services, email, d2)) {
  await db.insert(history).values({
    userEmail: email,
    sAddress:  JSON.stringify(services),
    createdAt: d2.total,
  })
}
} catch (e) {
  console.error("error in in service adding:", e);
  throw e;
}
}

  // Select
export async function selectHistory(email)
{
  try {
    console.log("selecting History services:", {
      email,
    });
  const fullArray = []
  const val1 = await db.select({services: history.sAddress, date: history.createdAt }).from(history).where(eq(history.userEmail, email));
  for (const element of val1){
      const val2 = JSON.parse(element.services)
      const val3 = [];
      for(const element of val2){
          let service = await db.select({ info: services.address } ).from(services).where(eq(services.address, element));
          service =  await getAPI(service[0].info);
          val3.push(service);
      }
      let valMap = { "date": new Date (element.date), "services": val3 };
      fullArray.push(valMap);
  }
  return fullArray;

  } catch (e) {
    console.error("error in in service adding:", e);
    throw e;
  }
}



const secretKey = '12345'; // will be a random env variable later: For ease of use.
const encodedKey = new TextEncoder().encode(secretKey);




// Sessions
  // Encryption : Decryption
export async function encrypt(payload){
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}

// Deleting a Session
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}


// Testing if in session
export async function hasSession(email)
{
  let data = await db.select().from(sessions).where(eq(sessions.userEmail, email));
  return !(data.length == 0);
}

// Creating Sessions
export async function createSession (id) {
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // Holds for 30 minutes

  // inserting sessions into the DB
  try {
    console.log("adding session to the DB:", {
      id,
      expiresAt,
    });
    const idval = await bcrypt.hash(id, 5);
    if(await getUser(id)){
      if(await hasSession(id))
      {
        await db.delete(sessions).where(eq(sessions.userEmail, id))
      }

      await db.insert(sessions).values({
        userEmail: id,
        expiresAt: expiresAt,
        id: idval,
      });
    }
    const session = await encrypt({idval, expiresAt});

    const cookieStore = await cookies()
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    })

  } catch (e) {
    console.error("error adding session: ", e);
    throw e;
  }
}


// Getting Session 
export async function getSession(){
  const theCookie = await cookies();
  const session = theCookie.get('session')?.value;
  if(!session) return null;
  return await decrypt(session);
}

// getting User from session
export async function getUserFS(hashedEmail) {
  return await db.select({email: users.email })
  .from(users)
  .fullJoin(sessions, eq(users.email,sessions.userEmail))
  .where(eq(sessions.id, hashedEmail));
}