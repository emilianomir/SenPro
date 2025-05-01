import { db } from "../db/index.js";
import { eq, and, sql, min, max, count} from "drizzle-orm";


// databases
import { users } from "../db/schema/users.js";
import { services } from "../db/schema/services.js";
import { favorites } from "../db/schema/favorites.js";


// testuser 
// Favorites list = 1
// Address = ChIJidI0mPxgP4YRjG5J-fD6ZrY


// replacing fetch with Mock
global.fetch = jest.fn(() => 
    Promise.resolve({
        ok: true,
        displayName: {text: "Sylvan Beach, La Porte"},
        formattedAddress: "Unnamed Road, La Porte, TX 77571, USA",
    }),

);


async function getFavorites(email) {
    const value = await db.select({ info: services.address, response: services.info })
    .from(services)
    .fullJoin(favorites, eq(favorites.sAddress, services.address))
    .where(eq(favorites.userEmail, email));

    return value;
}

async function checkService(primaryKey) {
const data = await db.select().from(services).where(eq(services.address, primaryKey));
return data.length === 0;
}
async function addFavoriteService(primaryKey, info, email) {
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
}


async function removeFavoriteService(primaryKey, email) {
    await db.delete(favorites).where(and(eq(favorites.sAddress, primaryKey), eq(favorites.userEmail, email)));
}


async function getFavorites(email)
{
    const value = await db.select({ info: services.address, response: services.info })
    .from(services)
    .fullJoin(favorites, eq(favorites.sAddress, services.address))
    .where(eq(favorites.userEmail, email));

    return value;
}


// api to be mocked
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
        var temp = new Response(JSON.stringify({ service_result:  response}), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }); 
        const {service_result} = await temp.json();
        if (service_result.photos)
        try {
            const image_url = `https://places.googleapis.com/v1/${service_result.photos[0].name}/media?key=${api_key}&maxHeightPx=400&maxWidthPx=400`; //(`/api/maps/places?thePhoto=` + service_result.photos[0].name);
            const image_response = await fetch(image_url);
            service_result.photoURL = image_response.url;
            service_result.photo_image = image_response.url;
            
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






describe('Favorites DB Calls', () => {


    afterAll(async ()=>{
        await db.delete(services).where(eq("TestService", services.address));
    })

    it('should return favorites when calling getFavorites', async () => {
       const result =  await getFavorites("testuser")

       expect(result).not.toStrictEqual([]);
       expect(result[0].info).toBe('ChIJidI0mPxgP4YRjG5J-fD6ZrY');
       expect(result[0].response).toBe('"{\\"main_category\\":\\"Beach\\",\\"types\\":null,\\"priceLevel\\":null,\\"rating\\":null,\\"name\\":null,\\"textQuery\\":\\"Beach\\",\\"fuel_type\\":null}"');
    });

    it('should properly add and check for a given favorite service', async () => {
        const beforeAdding = await db.select({userEmail:favorites.userEmail, count:sql`count(${favorites.sAddress})`}).from(favorites).where(eq(favorites.userEmail, 'testuser')).groupBy(favorites.userEmail);
        console.log(beforeAdding)
        await addFavoriteService("TestService", {noinfo:"null"}, 'testuser');
        const favoritesResult = await db.select({userEmail:favorites.userEmail, count:sql`count(${favorites.sAddress})`})
        
        .from(favorites)
        .where(eq(favorites.userEmail, 'testuser'))
        .groupBy(favorites.userEmail)
        .having(sql`count(${favorites.sAddress}) > ${beforeAdding[0].count}`);
        console.log(favoritesResult)

        expect(favoritesResult).not.toStrictEqual([]);
    });

    it('should delete a favorite service', async() =>{
        await removeFavoriteService("TestService", 'testuser');
        const result = await db.select().from(favorites).where(eq(favorites.sAddress, "TestService"));

        expect(result).toStrictEqual([]);
    });


    it('should call api for favorite service', async()  => {
        const id = "ChIJidI0mPxgP4YRjG5J-fD6ZrY"
        const result = await getAPI(id);   

        expect(result).not.toStrictEqual([]);
        expect(result.formattedAddress).toBe('Unnamed Road, La Porte, TX 77571, USA');
        expect(result.displayName.text).toBe('Sylvan Beach, La Porte');
        expect(result.id).toBe(id);

    })

});



