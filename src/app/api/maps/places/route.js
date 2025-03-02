
export async function POST(req){
    console.log("I ran!");
    const {userResponses} = await req.json();
    if (userResponses)
        console.log("User response in PLACES API call: " + userResponses);
    else 
        console.log("Value is null. ABORT!!!")

    try {
        const address = "Weslaco, TX 78599";
        const api_key = process.env.GOOGLE_API_KEY;
        const url = "https://places.googleapis.com/v1/places:searchText"

        const textBody = {
            textQuery: userResponses.category ?  `${userResponses.category} ${userResponses.types} near ${address}`: `${userResponses.main_category} near ${address}`,
            openNow: true,
            regionCode: "US",
            languageCode: "en",
            pageSize: 10,
            rankPreference: "DISTANCE"
        }
        userResponses.rating ? textBody.minRating = userResponses.rating : null;
        userResponses.priceLevel ? textBody.priceLevels = [userResponses.priceLevel]: null;
        if (userResponses.types){
            textBody.includedType = userResponses.types;
            textBody.strictTypeFiltering = true;
        }
        console.log("The textBody: ")
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
        console.log("The response:")
        console.log(response);
        if (!response.ok) {
            const errorText = await response.text(); // Read error message
            console.log("Error:", response.status, errorText);
        } 
        const data = await response.json();
        console.log("The data: ")
        console.log(data);
        if (data.places){
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
                            eachService.photo_image = theImage;
                        }
                    }
                    else 
                        eachService.photo_image = "https://static.vecteezy.com/system/resources/thumbnails/005/720/408/small_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg";
                }
                else {
                    eachService.photo_image = "https://static.vecteezy.com/system/resources/thumbnails/005/720/408/small_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg";
                }
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







    // console.log("Status: " + status);

    // const { Place } = await google.maps.importLibrary("places");


   
    
   
    
    // const request = {

    //   };
    //   if (theTest.types){
    //     for (const [index, value] of theTest.types.entries())
    //         if (index != theTest.types.length-1)
    //             request.includedType += `, ${value}` ;
    //         else 
    //             request.includedType += value;
    //   }
    
    //   if (theTest.priceLevel)
    //     request.priceLevel = theTest.priceLevel;
    
    //   if (theTest.rating)
    //     request.rating = theTest.rating;
    
    
    //   request.useStrictTypeFiltering = true;
    //   const { places } = await Place.searchByText(request);
    
    //   for (let i of places){
    //     console.log(i);
    //   }
