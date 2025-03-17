"use server";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { eq, and, sql} from "drizzle-orm";

import { userAgentFromString } from "next/server.js";
import { questions } from "../db/schema/questions.js";
import { services } from "../db/schema/services.js";
import { favorites } from "../db/schema/favorites.js";
import { history } from "../db/schema/history.js";
import bcrypt from "bcryptjs";

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

    const value = await db.select({ info: services.info })
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