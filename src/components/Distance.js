import { useEffect, useState } from "react";

export default function Distance() {
  const ep = `https://maps.googleapis.com/maps/api/distancematrix/json`;
  const origins = encodeURIComponent("Edinburg, TX");
  const destinations = encodeURIComponent("Rio Grande City, TX");

  //   const url = `${ep}?origins=${origins}&destinations=${destinations}&units=imperial&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

  const [distance, setDistance] = useState(null);

  useEffect(() => {
    async function fetchDistance() {
      try {
        const response = await fetch(
          `/api/distance?origin=Edinburg,TX&destination=RioGrandeCity,TX`
        );
        const data = await response.json();
        console.log("response:", data);
        setDistance(data.rows[0].elements[0].distance.text);
      } catch (error) {
        console.log("there was an error:", error);
      }
    }

    fetchDistance();
  }, []);

  return (
    <div>
      <h2>{distance ? `Distance: ${distance}` : "loading still..."}</h2>
    </div>
  );
}
