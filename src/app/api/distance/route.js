export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");

    if (!origin || !destination) {
      return Response.json({ error: "missing" }, { status: 400 });
    }
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
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
