import { useEffect, useRef } from "react";
import Script from "next/script";

export default function GoogleMap2() {
  const mapRef = useRef();

  async function loadMap() {
    const { Map } = await window.google.maps.importLibrary("maps"); // create usable Map from namespace google.maps
    try {
      const myMap = new Map(mapRef.current, {
        center: { lat: 26.304225, lng: -98.163751 },
        zoom: 8, // more settings , can add more
      });
      var request = {
        //im requesting this from the the api
        location: myMap.getCenter(),
        query: "restaurants near me",
        fields: ["name", "geometry", "place_id"],
      };
      var placesService = new google.maps.places.PlacesService(myMap); // store the PLACE ID from the given myMap

      // with the id, search for the ids and
      placesService.textSearch(request, (results, status) => {
        // results comes from Google, results is each obj == place
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          results.forEach((place) => {
            new google.maps.Marker({
              map: myMap,
              position: place.geometry.location,
              title: place.name,
            });
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (window.google) {
      loadMap();
    }
  }, []);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={() => {
          console.log(window.google.maps.Map);
          if (mapRef.current) {
            loadMap();
          }
        }}
        onError={() => console.error("no load")}
      />
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "500px",
          border: "2px solid red",
          minWidth: "500px",
          minHeight: "500px",
        }}
      />
    </>
  );
}
