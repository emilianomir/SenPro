class Responses{
    constructor(){
        this.category = null;
        this.types = null;
        this.priceLevel = null;
        this.rating = null;
    }
}


export async function POST(req){
    console.log("I ran!");
    const theTest = new Responses();
    theTest.category = "Mexican food";
    theTest.types = ["fast_food_restaurant"];
    theTest.priceLevel = ["PRICE_LEVEL_INEXPENSIVE", "PRICE_LEVEL_MODERATE"];
    theTest.rating = 3.5;
    const address = "1310 N Texas Blvd, Weslaco, TX 78599";

     
    const api_key = process.env.GOOGLE_API_KEY;
    const url = "https://places.googleapis.com/v1/places:searchText"

    const textBody = {
        textQuery: `${theTest.category} near ${address}`,
        openNow: true,
        regionCode: "US",
        languageCode: "en",
        pageSize: 10,
        rankPreference: "DISTANCE"
    }
    textBody.minRating = theTest.rating;
    textBody.priceLevels = theTest.priceLevel;
    textBody.includedType = theTest.types[0];
    textBody.strictTypeFiltering = true;

    const headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating"
    };
    
    // const response = await fetch(url, {
    //     method: "POST",
    //     headers: headers,
    //     body: JSON.stringify(textBody)

    // });
    // if (!response.ok) {
    //     const errorText = await response.text(); // Read error message
    //     console.log("Error:", response.status, errorText);
    // } else {
    //     const data = await response.json();
    //     for (let i of data.places){
    //         console.log("Address: " + i.formattedAddress);
    //         console.log("Rating: " + i.rating);
    //         console.log("Display Name: " + i.displayName.text)
    //     }
    // }

    
    return new Response(JSON.stringify({ message: "API is working!"}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    });
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
