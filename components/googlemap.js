import { useEffect, useRef } from "react";
import Script from "next/script";

export default function GoogleMap() {
  const mapRef = useRef(); // map box
  useEffect(() => {
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    }
  }, []);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=maps`}
        strategy="lazyOnload"
        onLoad={() => {
          console.log("it worked");
          console.log(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
          if (mapRef.current) {
            const map = new window.google.maps.Map(mapRef.current, {
              center: { lat: -34.397, lng: 150.644 },
              zoom: 8,
            });
          }
        }}
        onError={() => console.error("something wrong")}
      />
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "500px",
        }}
      ></div>
    </>
  );
}
