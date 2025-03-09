export async function POST(req) {
    const {userInput, userSelection} = await req.json();
    if (userSelection == "zipCode"){
        try {
            const zipApiKey = process.env.ZIP_CODE_API_KEY;

            const url = new URL(
                "https://api.zipcodestack.com/v1/search"
            );
            
            const params = {
                "codes": userInput,
                "country": "us"
            };
            Object.keys(params)
                .forEach(key => url.searchParams.append(key, params[key]));
            
            const headers = {
                "apikey": zipApiKey,
                "Accept": "application/json",
            };

            const response = await fetch(url, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            let result;
            if (data.results.length == 0) {
                result = false;
            }
            else {
                result = true;
            }
 
            return new Response(JSON.stringify({ message: "API is working!", info: data, isValid: result }), {
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
    else if (userSelection == "address"){
        try {
            const url = "https://addressvalidation.googleapis.com/v1:validateAddress?key=" + process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "address": {
                        "regionCode": "US",
                        "addressLines": [userInput]
                    }
                })
    
            })
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            let result;
            if (data.result.verdict.validationGranularity == "PREMISE" || data.result.verdict.validationGranularity == "SUB_PREMISE") {
                result = true;
            }

            else {
                result = false;
            }


            return new Response(JSON.stringify({ message: "API is working!", info: data, isValid: result }), {
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


}
 
