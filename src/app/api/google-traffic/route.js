import { NextResponse } from 'next/server'; // useful for sending responses to client

// handle get request to google traffic api
export async function GET(request) {
  // get search params from request url
  const { searchParams } = new URL(request.url);
  const originLat = searchParams.get('originLat');
  const originLng = searchParams.get('originLng');
  const destinationLat = searchParams.get('destinationLat');
  const destinationLng = searchParams.get('destinationLng');

  // validate required parameters
  if (!originLat || !originLng || !destinationLat || !destinationLng) {
    return NextResponse.json({ // send error response if missing required parameters back to client
      success: false, 
      error: 'Missing required parameters' 
    }, { status: 400 });
  }

  try {
    // call google maps distance matrix api
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?` +
      `origins=${originLat},${originLng}&` +
      `destinations=${destinationLat},${destinationLng}&` +
      `departure_time=now&` +
      `mode=driving&` +
      `traffic_model=best_guess&` +
      `key=${process.env.GOOGLE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Error from Google API: ${response.status}`);
    }

    const data = await response.json();// parse response as json
    if (data.status !== 'OK' || !data.rows?.[0]?.elements?.[0]) { // are there rows? are there elements?
      return NextResponse.json({ // so send client error response
        success: false,
        error: `Google API error: ${data.status || 'No valid response'}`
      }, { status: 500 });
    }

    const element = data.rows[0].elements[0]; // get first element from first row, first stop
    
    if (element.status !== 'OK') {
      return NextResponse.json({
        success: false,
        error: `Route error: ${element.status}`
      }, { status: 400 });
    }

    // get traffic information from response
    const trafficInfo = {
      success: true,
      distance: element.distance.value, // in meters
      duration: element.duration.value, // in seconds
      durationInTraffic: element.duration_in_traffic.value, // in seconds
      incidents: []
    };
    
    return NextResponse.json(trafficInfo); // send traffic info back to client
    
  } catch (error) {
    console.error('Google Traffic API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch traffic data'
    }, { status: 500 });
  }
} 