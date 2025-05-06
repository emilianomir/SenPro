import { db } from "../db/index.js";
import { eq, and, sql, min, max, count, between} from "drizzle-orm";


// databases
import { users } from "../db/schema/users.js";
import { history } from "../db/schema/history.js";



// Checking if a history  service can be added.. also checks if one within 10 seconds is also trying to be added.
export async function checkHistoryService(primaryKey, email, d2) {
    var notfalse = true
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

        const difference = val1 - val2;
        if (difference <= 10){
            notfalse = false;
            return false;
        }
        }
    });
    if(notfalse)
    return true;
    else
    return false
    }
}


// 
export async function removeOldestService(email)
{
  const latestHistory = await db.select({createdAt: min(history.createdAt)}).from(history).where(eq(history.userEmail, email));
  await db.delete(history).where(and(eq(history.createdAt,latestHistory[0].createdAt), eq(history.userEmail, email)));

}


// check remove
export async function checkRemoveOldest(email)
{
  const limiter = 1;
  const checkRemove = await db.select({email: history.userEmail , count: sql`count(${history.sAddress})`})
  .from(history)
  .where(eq(history.userEmail, email))
  .groupBy(sql`${history.userEmail}`)
  .having(sql`count(${history.sAddress}) > ${limiter}`);
  if(checkRemove.length > 0)
  {
    return(await removeOldestService(checkRemove[0].email));
  }
}


  // Add
export async function addHistoryService(services, email) {

  const d2 = await db.select({total: sql`(CURRENT_TIMESTAMP)`, time: sql`time(CURRENT_TIMESTAMP)`, date: sql`date(CURRENT_TIMESTAMP)`}).from(users).where(eq(users.email, email));
  if(await checkHistoryService(services, email, d2)) {
  await db.insert(history).values({
    userEmail: email,
    sAddress:  JSON.stringify(services),
    createdAt: d2.total,
  })
}
}

// testuser 
// "[\"ChIJxVOO0r2gZYYRjgQklz1c_0U\",\"ChIJ86jlq6agZYYR3AKUQNOtBxA\"]" - Test History List
describe('History DB Calls', () => {
    
    const user = "testuser"
    const services = ["ChIJxVOO0r2gZYYRjgQklz1c_0U", "ChIJ86jlq6agZYYR3AKUQNOtBxA"];

    afterAll(async ()=>{
        await db.delete(history).where(eq("testuser", history.userEmail));
    })

    
    it('should properly add a history service', async () => {    
        await addHistoryService(services, user);
        const result = await db.select().from(history).where(eq(user, history.userEmail))

        expect(result).not.toStrictEqual([]);
        expect(JSON.parse(result[0].sAddress)).toStrictEqual(services)
        expect(result[0].userEmail).toStrictEqual(user)
     });

    it('should properly check if a service can be added, rejecting when attempting to add a duplicate within a 10 second time frame', async () =>
    {
        // wanting to add a service that is not in the db
        const beTrue = await checkHistoryService("[test1,test2]", user, new Date())


        // checking if tryring to add a duplicaate
        const duplicate  = await db.select().from(history).where(eq(user, history.userEmail))
        var date = duplicate[0].createdAt.split(" ")
        date = [{date: date[0], time: date[1]}]
        const fast = await checkHistoryService(duplicate[0].sAddress, user, date)



        expect(beTrue).toBe(true)
        expect(fast).toBe(false)
    });


    it('should properly remove the oldest service', async () => {
        const oldDate = new Date("December 17, 1995 03:24:00")
        await db.insert(history).values({
            userEmail: user,
            sAddress:  JSON.stringify(services),
            createdAt: oldDate,
          })
        await checkRemoveOldest(user)
        const result = await db.select().from(history).where(eq(user, history.userEmail))

        expect(result).not.toStrictEqual([])
        expect(result.length).toBe(1)
        expect(result[0].createdAt).not.toStrictEqual(oldDate)
    });





});