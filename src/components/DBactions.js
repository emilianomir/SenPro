import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";


import { eq } from "drizzle-orm";
import { questions } from "../db/schema/questions.js";
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
// testing for existing emails
export async function testExistingUser(email) {
  const data = await db.select().from(users).where(eq(users.email, email));
  if (data.length === 0) {
    return false;
  } else {
    return true;
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
  const pass = await bcrypt.hash(password, 10);
  await db.insert(users).values({
    email: email,
    username: username,
    password: password,
    address: address,
    type: type,
  });
}



// Checking Login
export async function checkLogin(email, password){
    const data = await db.select().from(users).where(and(eq(users.email, email), eq(users.password, password)));
    if(data.length === 0)
    {
     return false
    }
    else
    {
     return true
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
<<<<<<< HEAD
    try {
        const data = await db.select().from(questions).where(eq(questions.userEmail, userEmail));
        return data;
    } catch (e) {
        console.error("error getting questions and answers:", e);
        throw e;
    }
=======
  try {
    const data = await db
      .select()
      .from(questions)
      .where(eq(questions.userEmail, userEmail));
    return data;
  } catch (e) {
    console.error("error getting questions and answers:", e);
    throw e;
  }
}

export async function checkLogin(email, password) {
  const data = await db.select().from(users).where(eq(users.email, email));
  if (data.length === 0) {
    return false;
  } else {
    return await bcrypt.compare(password, data[0].password);
  }
}

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
<<<<<<< HEAD
>>>>>>> 8f25892 (add bycript)
}
=======
}

// Checking Login
// export async function checkLogin(email, password) {
//   const data = await db
//     .select()
//     .from(users)
//     .where(and(eq(users.email, email), eq(users.password, password)));
//   if (data.length === 0) {
//     return false;
//   } else {
//     return true;
//   }
// }
>>>>>>> 5552ca5 (fix, add: enabled google api, question and answer to db)
