"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TravelMode from '@/components/TravelMode';

export default function RoutePage() {
  const searchParams = useSearchParams();
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  useEffect(() => {
    // Get addresses from URL parameters
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const originLat = searchParams.get('originLat');
    const originLng = searchParams.get('originLng');
    const destLat = searchParams.get('destLat');
    const destLng = searchParams.get('destLng');

    if (origin) setOriginAddress(origin);
    if (destination) setDestinationAddress(destination);
    
    // If coordinates are provided, use them
    if (originLat && originLng) {
      setOriginCoords({
        lat: parseFloat(originLat),
        lng: parseFloat(originLng)
      });
    }
    
    if (destLat && destLng) {
      setDestinationCoords({
        lat: parseFloat(destLat),
        lng: parseFloat(destLng)
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Route Directions
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">From:</h2>
              <p className="text-gray-700">{originAddress}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">To:</h2>
              <p className="text-gray-700">{destinationAddress}</p>
            </div>
          </div>
        </div>
        
        {/* The TravelMode component will show the map with directions */}
        <TravelMode 
          origin={originCoords} 
          destination={destinationCoords}
          originAddress={originAddress}
          destinationAddress={destinationAddress}
        />
        
        <div className="text-center mt-8">
          <button 
            onClick={() => window.history.back()} 
            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Service
          </button>
        </div>
      </div>
    </div>
  );
} 