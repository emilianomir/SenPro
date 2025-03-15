export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url); // get the searchParams prop from url
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");

    if (!origin || !destination) {
      return Response.json({ error: "missing" }, { status: 400 });
    }
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&units=imperial&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.rows || !data.rows[0] || !data.rows[0].elements) {
      console.error("something is wrong, invalid");
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const { origins, destinations } = await req.json();
    
    const destinationsString = Array.isArray(destinations) ? destinations.join('|') : destinations; // join the destinations with |, required by google maps api
    
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinationsString)}&units=imperial&key=${process.env.GOOGLE_API_KEY}`; // create the url for the api call with the origins and destinations separated by |
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('api response:', data);

    if (!data || !data.rows || !data.rows[0] || !data.rows[0].elements) { // if the data is not valid someway, return an error
      console.error("invalid response structure");
      return new Response(JSON.stringify({ error: "Invalid response structure" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}