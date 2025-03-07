
export async function POST(req){
    const {userResponses} = await req.json();
    try {
        const address = "Houston, TX 77015";
        const api_key = process.env.GOOGLE_API_KEY;
        const url = "https://places.googleapis.com/v1/places:searchText"

        const textBody = {
            textQuery: `${userResponses.name ? userResponses.name : userResponses.textQuery} near ${address}`,
            openNow: true,
            regionCode: "US",
            languageCode: "en",
            pageSize: 7, //this is to limit the max services sent by response. High numbers causing images not to load due to many requests 
            rankPreference: "DISTANCE"
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
        console.log("The textBody: ") ///debugging purposes
        console.log(textBody);
    

        const headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.photos,places.priceRange"
        };
        
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
        if (data.places){ //this section is to get the photos to be able to display. Each photo is a get request
            await Promise.all(data.places.map(async (eachService) =>{
                if (eachService.photos){
                    const image_url = `https://places.googleapis.com/v1/${eachService.photos[0].name}/media?key=${api_key}&maxHeightPx=400&maxWidthPx=400`;
                    const image_response = await fetch(image_url, {
                        method: "GET",
                        headers: {"Content-Type": "application/json"}
                    });
                    if (image_response.ok) {
                        const theImage= image_response.url;
                        if (theImage){
                            eachService.photo_image = theImage; //added a new property to data.places objects for easier retrieval
                        }
                    }
                    else 
                        eachService.photo_image = "https://static.vecteezy.com/system/resources/thumbnails/005/720/408/small_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg";
                }
                else {
                    eachService.photo_image = "https://static.vecteezy.com/system/resources/thumbnails/005/720/408/small_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg";
                } //these are placeholders photos in case an image can't be retrived. This does not work if a 429 occurs for some reason.
            }));
        }


        return new Response(JSON.stringify({ services_result: data.places}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
        });

    }catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

}

