
import { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function GenericMap({ address, isLoaded }) {
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    if (window.google) {
      loadGenericMap();
    }
  }, [isLoaded]);

  async function loadGenericMap() {
    const { Map } = await window.google.maps.importLibrary("maps");
    geocoderRef.current = new google.maps.Geocoder();
    try {
      mapRef.current = new Map(document.getElementById("map"), {
        center: { lat: 26.304225, lng: -98.163751 }, //default
        zoom: 13,
      });
      if (address) {
        geocodeTheAddress(address);
      }
    } catch (e) {
      console.log("mmap didnt load: ", e);
    }
  }

  async function geocodeTheAddress(userAddress) {
    if (!userAddress || !mapRef.current) {
      console.log("address didnt go through or bad map");
      return;
    }

    try {
      geocoderRef.current.geocode(
        { address: userAddress },
        (results, status) => {
          if (status === "OK") {
            const geoCodedLocation = results[0].geometry.location;
            mapRef.current.setCenter(geoCodedLocation);
            setTimeout(() => {
              mapRef.current.setZoom(11);
            }, 200);

            new google.maps.Marker({
              map: mapRef.current,
              position: geoCodedLocation,
              title: userAddress,
            });
          } else {
            console.log("geocoding didnt work via inner status: ", status);
          }
        }
      );
    } catch (e) {
      console.log("geocode error, try no work:", e);
    }
  }

  // loop over new input of address
  useEffect(() => {
    if (address && mapRef.current && isLoaded) {
      geocodeTheAddress(address);
    }
  }, [address, isLoaded]); // dependency arr, when this value changes, useeffecthook runs again

  return (
    <div>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        onLoad={() => loadGenericMap()}
        strategy="lazyOnload"
      />
      <div id="map" style={{ width: "400px", height: "400px" }}></div>
    </div>
  );
}
