
import { db } from "./index.js";
import { users } from "./schema/users.js";
import { eq } from "drizzle-orm";
import { addUser, checkLogin, testExistingUser, getUser} from "/workspaces/SenPro/src/components/DBactions.js";
// import { addUser, testExistingUser } from "@/components/DBactions.js";
import bcrypt from "bcrypt"
import { getModifiedCookieValues } from "next/dist/server/web/spec-extension/adapters/request-cookies.js";

/*
await db.insert( users ).values({
    email: "gaelg@gmail.com",
    username: "gaelg",
    password: "testingpass",
    type: "admin",
    address: "78574",
})
*/




await addUser("test@gmail.com", "John Doe", "123", "Mcallen Tx")
//addUser("gaelg@gmail.com", "gaelg", "testingpass", "78574", "admin");
testExistingUser("gaelg@gmail.com").then((data) =>
{
    if(data)
        console.log("This is true")
    else
        console.log("This is false")
}) // get past awaits
 

checkLogin("gaelg@gmail.com", "testingpass").then((data) =>
    {
        if(data)
            console.log("This is true")
        else
            console.log("This is false")
    }) // get past awaits



const values = await getUser("gaelg@gmail.com")
console.log(values[0].username);

const test = await db.select({email: users.email}).from(users).where(eq(users.email, 'gaelg@gmail.com')) 
//console.log(test.length)

