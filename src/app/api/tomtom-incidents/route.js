import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const centerLat = parseFloat(searchParams.get('centerLat'));
    const centerLng = parseFloat(searchParams.get('centerLng'));
    // radius is now in miles, convert to meters (1 mile = 1609.34 meters)
    const radiusInMiles = Number(searchParams.get('radius')) || 5;
    const radius = radiusInMiles * 1609.34;
  
    if (!centerLat || !centerLng) {
      return NextResponse.json({ success: false, error: 'missing required parameters' }, { status: 400 });
    }
  
    const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
  
    // calculate bounding box (~1 degree ≈ 111km)
    const latDelta = radius / 111000;
    const lngDelta = radius / (111000 * Math.cos(centerLat * (Math.PI / 180)));
  
    const top = centerLat + latDelta;
    const bottom = centerLat - latDelta;
    const left = centerLng - lngDelta;
    const right = centerLng + lngDelta;
  
    const bbox = `${top},${left},${bottom},${right}`;
    const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${apiKey}&bbox=${bbox}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("tomtom api error:", errorText);
        throw new Error(`tomtom error: ${response.status}`);
      }
  
      const data = await response.json();
      const incidents = data.incidents || [];
  
      return NextResponse.json({ success: true, incidents });
    } catch (err) {
      console.error("tomtom incidents fetch failed, look at the tomtom-incidents/route.js file:", err);
      return NextResponse.json({ success: false, incidents: [], error: err.message });
    }
  }