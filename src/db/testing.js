
import { db } from "./index.js";
import { users } from "./schema/users.js";
import { eq } from "drizzle-orm";
import { addUser, testExistingUser} from "/workspaces/SenPro/src/components/DBactions.js";

/*
return db.insert( users ).values({
    email: "gaelg@gmail.com",
    username: "gaelg",
    password: "testingpass",
    type: "admin",
    address: "78574",
})
}
*/

//addUser("testEmail@gmail.com", "testuseer", "password");
testExistingUser("gaelg@gmail.com").then((data) =>
{
    if(data)
        console.log("This is true")
    else
        console.log("This is false")
}) // get past awaits
 
const test = await db.select({email: users.email}).from(users).where(eq(users.email, 'gaelg@gmail.com')) 
//console.log(test.length)