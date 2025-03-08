"use server"
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { eq, and } from "drizzle-orm";
import bcrypt from 'bcryptjs'
import { userAgentFromString } from "next/server.js";


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
export async function addUser (email, username, password, address = '', type = 'user'){
    const pass = await bcrypt.hash(password, 10);

    await db.insert( users ).values({
        email: email,
        username: username,
        password: pass,
        address: address,
        type: type,
    })
}

//bcrypt.compare(password, users.password)
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


 // get user attrributes
 export async function getUser(email)
 {
    return await db.select({
        email: users.email,
        username: users.username,
        address: users.address,
    }).from(users).where(eq(users.email, email));
 }


 //change password
 export async function changePass(email, newpass)
 {
    const pass = await bcrypt.hash(newpass, 10);

    await db.update( users )
    .set({password: pass})
    .where(eq(users.email, email));
 }

