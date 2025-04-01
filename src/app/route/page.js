"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TravelMode from '@/components/TravelMode';

// this page is to get data from url paramters and passes it to the travel mode component, the travel mode component is a child of this page

export default function RoutePage() {
  const searchParams = useSearchParams();
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  useEffect(() => {
    // get the addresses from the url parameters
    const origin = searchParams.get('origin'); // houston, tx 77015
    const destination = searchParams.get('destination'); // the service address
    const originLat = searchParams.get('originLat'); // 29.7604
    const originLng = searchParams.get('originLng'); // -95.3698
    const destLat = searchParams.get('destLat'); // the service latitude
    const destLng = searchParams.get('destLng'); // the service longitude

    if (origin) setOriginAddress(origin); // safe guard to make sure the address is not null
    if (destination) setDestinationAddress(destination);
    if (originLat && originLng) { 
      setOriginCoords({
        lat: parseFloat(originLat),
        lng: parseFloat(originLng)
      });
    }
    
    if (destLat && destLng) { //
      setDestinationCoords({
        lat: parseFloat(destLat),
        lng: parseFloat(destLng)
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* <h1 className="text-3xl font-bold text-center mb-8">
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
        </div> */}
        
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