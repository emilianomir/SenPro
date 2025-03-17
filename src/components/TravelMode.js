// the idea of this component is to allow the user to select a starting location and a destination and then display the route between the two points
// the user can also select the travel mode (driving, walking, transit)
// the component will display the route on the map and the distance and time it will take to travel between the two points 
// the component will also display the distance and time it will take to travel between the two points in a table
import { useEffect, useRef, useState } from 'react';
import '../app/css/TravelMode.css';

const TravelMode = ({ origin, destination, originAddress, destinationAddress }) => {
    // Default values if props aren't provided
    const defaultOrigin = {
        lat: 26.304225,
        lng: -98.163751
    };
    const defaultDestination = {
        lat: 26.3017,
        lng: -98.1633
    };

    const mapRef = useRef(null);
    const [location, setLocation] = useState(defaultOrigin);
    const [defaultPlace, setDefaultPlace] = useState(originAddress || "Rio Grande City, TX");
    const [travelInfo, setTravelInfo] = useState({ distance: '', duration: '' });

    useEffect(() => {
        // load the google maps script on top of the page
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script'); // create a script element
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`; // load the google maps script
            script.async = true; // load the script async
            script.defer = true; // load the script after the page has loaded
            script.onload = initMap; // init the map
            document.head.appendChild(script); // add the script to the head of the document so it can be used in the initMap function
        };

        const initMap = () => {
            const directionsRenderer = new google.maps.DirectionsRenderer();
            const directionsService = new google.maps.DirectionsService();
            
            const map = new google.maps.Map(mapRef.current, {
                zoom: 14,
                center: location,
            });

            directionsRenderer.setMap(map);
            calculateAndDisplayRoute(directionsService, directionsRenderer);

            document.getElementById("mode").addEventListener("change", () => {
                calculateAndDisplayRoute(directionsService, directionsRenderer);
            });
        };

        const calculateAndDisplayRoute = (directionsService, directionsRenderer) => {
            const selectedMode = document.getElementById("mode").value;

            directionsService
                .route({
                    origin: location,
                    destination: destination || defaultDestination,
                    travelMode: google.maps.TravelMode[selectedMode],
                })
                .then((response) => {
                    directionsRenderer.setDirections(response);
                    const { distance, duration } = response.routes[0].legs[0];
                    setTravelInfo({ distance: distance.text, duration: duration.text });
                })
                .catch((e) => window.alert("Directions request failed due to " + e));
        };

        const geocodePlace = (place) => {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: place }, (results, status) => {
                if (status === 'OK') {
                    const newLocation = results[0].geometry.location;
                    setLocation({ lat: newLocation.lat(), lng: newLocation.lng() });
                } else {
                    window.alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        };

        loadGoogleMapsScript();

        // Set the default value for the input field if it exists
        const inputElement = document.getElementById('place-input');
        if (inputElement) {
            inputElement.value = defaultPlace;
        }

        return () => {
            const script = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
            if (script) {
                script.remove();
            }
        };
    }, [location, defaultPlace, destination]);

    return (
        <div className="container">
            {/* Map Container */}
            <div 
                ref={mapRef} 
                className="map"
                role="region"
            />

            {/* Controls Container */}
            <div className="controls">
                {/* Left Column - Travel Mode Selection */}
                <div className="control-group">
                    <label className="label">
                        Travel Mode
                    </label>
                    <select 
                        id="mode"
                        className="select"
                    >
                        <option value="DRIVING">Driving</option>
                        <option value="WALKING">Walking</option>
                        <option value="TRANSIT">Transit</option>
                    </select>
                </div>

                {/* Right Column - Location Input */}
                {!originAddress && (
                    <div className="control-group">
                        <label className="label">
                            Enter Location
                        </label>
                        <input 
                            type="text" 
                            id="place-input"
                            placeholder="Enter a place" 
                            className="input"
                        />
                        <button 
                            onClick={() => geocodePlace(document.getElementById('place-input').value)}
                            className="button"
                        >
                            Set Location
                        </button>
                    </div>
                )}
            </div>

            {/* Travel Information Card */}
            <div className="info">
                <h3 className="info-title">
                    Travel Information
                </h3>
                <div className="info-grid">
                    <div>
                        <p className="info-label">Distance</p>
                        <p className="info-value">
                            {travelInfo.distance || 'Calculating...'}
                        </p>
                    </div>
                    <div>
                        <p className="info-label">Duration</p>
                        <p className="info-value">
                            {travelInfo.duration || 'Calculating...'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelMode;