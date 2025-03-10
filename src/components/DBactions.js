"use server";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { eq, and} from "drizzle-orm";

import { userAgentFromString } from "next/server.js";
import { questions } from "../db/schema/questions.js";
import { services } from "../db/schema/services.js";
import { favorites } from "../db/schema/favorites.js";
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





 export async function addFavoriteService(primaryKey, info, email) {
  try {
    console.log("adding service to db:", {
      primaryKey,
      info,
    });


    await db.insert(services).values({
      address: primaryKey,
      info: JSON.stringify(info),
    });
    await db.insert(favorites).values({
      userEmail: email,
      sAddress:  primaryKey,
    })
  } catch (e) {
    console.error("error in in service adding:", e);
    throw e;
  }
 }

 export async function checkService(primaryKey){
  const data = await db.select().from(services).where(eq(services.address, primaryKey));
  return data.length === 0;
 }



 export async function removeFavoriteService(primaryKey, email) {
  try {
    console.log("deleting service to db:", {
      primaryKey,
    });

    await db.delete(favorites).where(and(eq(favorites.sAddress, primaryKey), eq(favorites.userEmail, email)));
    await db.delete(services).where(eq(services.address, primaryKey));
  } catch (e) {
    console.error("error in in service deletion:", e);
    throw e;
  }
 }

