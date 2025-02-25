import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { eq } from "drizzle-orm";


// testing for existing emails
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
    await db.insert( users ).values({
        email: email,
        username: username,
        password: password,
        address: address,
        type: type,
    })
}