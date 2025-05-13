export async function POST(req){
    const {userResponses, userAddress, location} = await req.json();

    try {
        // const api_key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
        const api_key = process.env.GOOGLE_API_KEY;
        const url = "https://places.googleapis.com/v1/places:searchText"

        const textBody = {
            textQuery: `${userResponses.name ? userResponses.name : userResponses.textQuery} near ${userAddress}`,
            openNow: true, //we can change to false to show more services. But then we would need to ask for the business operations of each place to help user see time 
            regionCode: "US",
            languageCode: "en",
            pageSize: 10, //this is to limit the max services sent by response. High numbers causing images not to load due to many requests 
            rankPreference: "DISTANCE",
            //enter the location restriction inside here for the API calls
        }

        //this is how object can help with the API calls
        //Its basically saying if the object has some value, that means the user agreed to a value and I want to modify the search to accomodate for that
        //Otherwise, it would go with the default value. 
        userResponses.rating ? textBody.minRating = userResponses.rating : null;
        userResponses.priceLevel ? textBody.priceLevels = [userResponses.priceLevel]: null;
        if (userResponses.types){
            textBody.includedType = userResponses.types;
            textBody.strictTypeFiltering = true;
        }
        if (location){
            textBody.locationBias = 
            {
                "circle": {
                    "center": {
                    "latitude": location.latitude,
                    "longitude": location.longitude
                    },
                    "radius": 1000.0
                }
            }
        }
        console.log("The textBody: ") ///debugging purposes
        console.log(textBody);


        const headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.photos,places.userRatingCount,places.id,places.attributions,places.location"
        };
        if (textBody.includedType === "gas_station" || textBody.textQuery.toLowerCase().includes("gas station")) //would only ask for a this field if the places the user is looking for is gas station
            headers["X-Goog-FieldMask"] += ",places.fuelOptions";
        if (userResponses.main_category == "Food and Drink"){
            headers["X-Goog-FieldMask"] += ",places.priceRange";
        }

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(textBody)

        });
        if (!response.ok) {
            const errorText = await response.text(); // Read error message
            console.log("Error:", response.status, errorText);
        } 
        const data = await response.json();

    return new Response(JSON.stringify({ services_result: data.places }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET (req) {
    // const start = Date.now();
    const {searchParams} = new URL(req.url);
    const theName = searchParams.get("thePhoto");
    const places_id = searchParams.get("id");
    const part = searchParams.get("partial");
    const basic=searchParams.get('basic');
    const api_key = process.env.GOOGLE_API_KEY;
    if (places_id) {
        try {
            const headers = {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": api_key,
                "X-Goog-FieldMask": basic ? "displayName,formattedAddress,rating":  part ? "websiteUri,regularOpeningHours": "displayName,formattedAddress,rating,photos,priceRange,userRatingCount,websiteUri,regularOpeningHours,location"
            };
            const resp = await fetch(`https://places.googleapis.com/v1/places/${places_id}`,{
                method: "GET",
                headers: headers
            });
            if (!resp.ok) {
                const errorText = await resp.text(); // Read error message
                console.log("Error:", resp.status, errorText);
                return new Response(JSON.stringify({ error: "Failed to fetch image" }), {
                    status: image_response.status,
                    headers: { "Content-Type": "application/json" },
                });
            }
            else {
                const obj_data = await resp.json();
                return new Response(JSON.stringify({ service_result:  obj_data}), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            }

        }catch {
            return new Response(JSON.stringify({ error: "Internal Server Error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
              });
        }
    }
    try {
        const image_url = `https://places.googleapis.com/v1/${theName}/media?key=${api_key}&maxHeightPx=400&maxWidthPx=400`;
        const image_response = await fetch(image_url);
        
        if (!image_response.ok) {
            return new Response(JSON.stringify({ error: "Failed to fetch image" }), {
                status: image_response.status,
                headers: { "Content-Type": "application/json" },
            });
        }
        // console.log("The image responses: "); //debugging
        // console.log(image_response);
        const data = await image_response.arrayBuffer();
        // console.log(data);
        // console.log("JSON:")
        // const data = await image_response.json();
        // const end = Date.now();  //debugging
        // console.log(`API response time: ${end - start}ms`);
        return new Response( data, {
            status: 200,
            headers: {
                "Content-Type":  image_response.headers.get("content-type"),
            }
            });

    
    }catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
    }

}