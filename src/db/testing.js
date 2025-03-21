
import { db } from "./index.js";
import { users} from "./schema/users.js";
import { favorites } from "./schema/favorites.js";
import { services } from "./schema/services.js";
import { history } from "./schema/history.js";
import { eq, sql } from "drizzle-orm";
import { addUser, checkLogin, testExistingUser, getUser, getFavorites} from '../components/DBactions.js'
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


/* 

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

*/
//addService("test email", "TEST:tewewfeww");

//removeService("test email");

/*
const values =  await db
.select({
    time: sql`time(created_at)` 
})
.from(users);

const val2 = await db
.select({
    time: sql`time(CURRENT_TIMESTAMP)`
})
.from(users)
.where(eq(users.email, 'gaelg@gmail.com'));

let [hour1, min1, sec1] = val2[0].time.split(':')
let [hour2, min2, sec2] =  values[0].time.split(':')

const difference = sec1 - sec2;

if(difference >= 30)
{
    console.log("its greater")
}
else
{
    console.log("it isnt")
}
console.log(values[0].time);
console.log(val2[0].time);
console.log(difference)


*/

/*
  //eq(history.createdAt, sql`(CURRENT_TIMESTAMP)`)
  const data = await db.select({time: sql`time(created_at)`, date: sql`date(created_at)`}).from(users);
  const d1 = await db.select({time: sql`time(CURRENT_TIMESTAMP)`, date: sql`date(CURRENT_TIMESTAMP)`}).from(users).where(eq(users.email, 'test@gmail.com'));
  const d2 = await db.select({time: sql`time(CURRENT_TIMESTAMP)`, date: sql`date(CURRENT_TIMESTAMP)`}).from(users).where(eq(users.email, 'test@gmail.com'));
  console.log(data);
  console.log(d2);
  
  data.forEach(element => {
    let [h1, m1, s1] = d1[0].time.split(':');
    let [h2, m2, s2] =  d2[0].time.split(':');
    let val1 = (m2*60) + s2;
    let val2 = (m1*60) + s1;
    let difference = val2-val1;
    if(d1[0].date == d2[0].date)
        console.log("IT WORKS")
    console.log(val1)
    console.log(val2);
    console.log(difference)
  });

*/

/*
const val = await getFavorites("test@gmail.com")

const val2 = [];
val.forEach(element => {
    const testVal = JSON.parse(element.info);
    val2.push(testVal)
})

*/

const fullArray = []
const val1 = await db.select({services: history.sAddress, date: history.createdAt }).from(history).where(eq(history.userEmail, "test@gmail.com"));
for (const element of val1){
    const val2 = JSON.parse(element.services)
    const val3 = [];
    for(const element of val2){
        let service = await db.select({ info: services.info } ).from(services).where(eq(services.address, element));
        service = JSON.parse(service[0].info);
        val3.push(service);
    }
    let valMap = { "date": new Date (element.date), "services": val3 };
    fullArray.push(valMap);
}

console.log(fullArray)
