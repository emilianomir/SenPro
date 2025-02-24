"use client";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";

export default function Places() {
  const mapRef = useRef(null); // box to store map
  const serviceRef = useRef(null); // box for the places
  const [place, setPlace] = useState(null);

  async function loadPlacesInstance() {
    try {
      const { Map } = await window.google.maps.importLibrary("maps");
      const map = new Map(document.createElement("div")); // diov not placed in dom

      const { PlacesService } = await window.google.maps.importLibrary(
        "places"
      );
      const service = new PlacesService(map);

      serviceRef.current = service;
    } catch (e) {
      console.error("some problem", e);
    }
  }

  function searchPlace(placeName) {
    const request = {
      query: placeName,
      fields: [
        "name",
        "formatted_address",
        "geometry",
        "opening_hours",
        "rating",
        "price_level",
        "types",
      ],
    };
    try {
      serviceRef.current.findPlaceFromQuery(request, (results) => {
        setPlace(results[0]);
      });
    } catch (e) {
      console.error(e);
    }
  }

  function getPlaceDetails(placeId) {
    const detailsRequest = {
      placeId: placeId,
      fields: [
        "name",
        "formatted_address",
        "geometry",
        "opening_hours",
        "rating",
        "price_level",
        "types",
      ],
    };

    instance.getDetails(detailsRequest, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log("Full Place Details:", place);
      } else {
        console.error("Failed to get place details:", status);
      }
    });
  }

  useEffect(() => {
    if (window.google) {
      loadPlacesInstance();
    }
  }, []);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={() => {
          loadPlacesInstance();
        }}
        onError={() => console.error("the script didnt work for some reason")}
      />

      {/* ✅ Map Container (Not Used Here, but Ready for Future Integration) */}
      <div ref={mapRef} style={{ display: "none" }} />

      {/* ✅ Search Button */}
      <button
        style={{ border: "2px solid black" }}
        onClick={() => searchPlace("Taco")}
      >
        Find Place
      </button>

      {/* ✅ Display Place Info */}
      {place && (
        <div>
          <h2>{place.name}</h2>
          <p>{place.formatted_address}</p>
        </div>
      )}
    </>
  );
}
