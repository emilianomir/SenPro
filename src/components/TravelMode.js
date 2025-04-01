// the idea of this component is to allow the user to select a starting location and a destination and then display the route between the two points
// the user can also select the travel mode (driving, walking, transit)
// the component will display the route on the map and the distance and time it will take to travel between the two points 
// the component will also display the distance and time it will take to travel between the two points in a table
import { useEffect, useRef, useState } from 'react';
import '../app/css/TravelMode.css';
import TrafficCongestionPanel from './TrafficCongestionPanel';

const TravelMode = ({ origin, destination, originAddress, destinationAddress }) => {
    // Only use defaults if no coordinates are provided
    const defaultOrigin = {
        lat: 26.304225,
        lng: -98.163751
    };
    const defaultDestination = {
        lat: 26.3017,
        lng: -98.1633
    };

    const mapRef = useRef(null); // dom where the map will be rendered
    const googleMapRef = useRef(null); // ref for the Google Map instance
    const trafficLayerRef = useRef(null); // erf for the traffic layer instance
    const [location, setLocation] = useState(origin || defaultOrigin);
    const [travelInfo, setTravelInfo] = useState({ distance: '', duration: '' }); // travel info is the distance and time it will take to travel between the two points
    const [showTraffic, setShowTraffic] = useState(true); // show traffic is a boolean that determines if the traffic layer is shown with btn
    
    // create state for addresses that can be swapped
    const [addresses, setAddresses] = useState({
        origin: originAddress, 
        destination: destinationAddress,
        originCoords: origin || defaultOrigin,
        destCoords: destination || defaultDestination
    });

    useEffect(() => {
        // Update addresses state when props change
        setAddresses({
            origin: originAddress,
            destination: destinationAddress,
            originCoords: origin || defaultOrigin,
            destCoords: destination || defaultDestination
        });
    }, [origin, destination, originAddress, destinationAddress]);

    //! ------------------------------------------------------------------------------------------------ 
    //! load the google maps script and initialize the map
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
            const directionsRenderer = new google.maps.DirectionsRenderer(); //
            const directionsService = new google.maps.DirectionsService();
            
            const map = new google.maps.Map(mapRef.current, {
                zoom: 14,
                center: addresses.originCoords,
            });

            googleMapRef.current = map; // Store map instance in ref

            // TRAFFIC LAYER and store it in ref by passing the map instance
            if (showTraffic) {
                const trafficLayer = new google.maps.TrafficLayer();
                trafficLayer.setMap(map);
                trafficLayerRef.current = trafficLayer; // Store traffic layer in ref
            }

            directionsRenderer.setMap(map);
            calculateAndDisplayRoute(directionsService, directionsRenderer);

            document.getElementById("mode").addEventListener("change", () => { // when transport mode changes, calculate and display route
                calculateAndDisplayRoute(directionsService, directionsRenderer);
            });
        };

        // calcluate route between origin and destination useing the directions service and renderer and display it on the map
        const calculateAndDisplayRoute = async (directionsService, directionsRenderer) => {
            const selectedMode = document.getElementById("mode").value;

            // create a geocoder instance
            const geocoder = new google.maps.Geocoder();


            //! this is the function to get a latlng object from an address which is used in the calculateAndDisplayRoute function by checking if the address is a string or a coordinates object
            const geocodeAddress = (address) => {
                return new Promise((resolve, reject) => { // return a promise so that the function can be used in the calculateAndDisplayRoute function
                    console.log('geocoding address input:', address);
                    
                    // if address is coordinates object
                    if (address && typeof address === 'object' && 'lat' in address && 'lng' in address) { // check if the address is a coordinates object
                        console.log('using coordinates directly:', address);
                        const latLng = new google.maps.LatLng(address.lat, address.lng); // create a latlng object
                        resolve(latLng); // resolve the promise with the latlng object
                    }
                    // if address is a string
                    else if (typeof address === 'string' && address !== "Starting Point" && address !== "Destination") {
                        console.log('geocoding string address:', address);
                        geocoder.geocode({ address }, (results, status) => { // geocode the address which is a string
                            if (status === 'OK') {
                                console.log('geocoding successful:', results[0].formatted_address);
                                resolve(results[0].formatted_address); // resolve the promise with the formatted address
                            } else {
                                // don't reject if we have coordinates as fallback
                                console.log('geocoding failed for:', address, 'Status:', status);
                                if (addresses.originCoords || addresses.destCoords) {
                                    console.log('using fallback coordinates');
                                    resolve(addresses.originCoords || addresses.destCoords);
                                } else {
                                    reject(new Error(`Could not geocode address: ${address}`));
                                }
                            }
                        });
                    }
                    // if we have coordinates as fallback
                    else if (addresses.originCoords || addresses.destCoords) {
                        console.log('using fallback coordinates for invalid string address');
                        resolve(addresses.originCoords || addresses.destCoords);
                    }
                    // if neither, reject
                    else {
                        reject(new Error('Invalid address format and no coordinates available'));
                    }
                });
            }; //! end of geocoding function

            try {
                // determine which value to use for origin and destination
                const originToUse = addresses.origin !== "Starting Point" ? addresses.origin : addresses.originCoords;
                const destinationToUse = addresses.destination !== "Destination" ? addresses.destination : addresses.destCoords;

                console.log('Processing route from:', originToUse, 'to:', destinationToUse);

                // validate both addresses
                const validatedOrigin = await geocodeAddress(originToUse);
                const validatedDestination = await geocodeAddress(destinationToUse);

                console.log('validated addresses:', { origin: validatedOrigin, destination: validatedDestination });

                const routeOptions = {
                    origin: validatedOrigin,
                    destination: validatedDestination,
                    travelMode: google.maps.TravelMode[selectedMode],
                };

                const response = await directionsService.route(routeOptions);
                directionsRenderer.setDirections(response);
                const { distance, duration } = response.routes[0].legs[0];
                setTravelInfo({ distance: distance.text, duration: duration.text });
            } catch (e) {
                console.error("directions error:", e);
                // only show alert if the route actually failed
                if (!directionsRenderer.getDirections()) {
                    window.alert("directions request failed: " + e.message + "\nplease ensure both addresses are valid and specific enough.\nlook at the geocoding function in TravelMode.js");
                }
            }
        };

        //with every prop change, change map ref
        if (window.google && window.google.maps) {
            initMap();
        } else {
            loadGoogleMapsScript();
        }
    }, [addresses, showTraffic]); // add addresses to the dependency array

    //! ------------------------------------------------------------------------------------------------

    //! toggle traffic layer
    const toggleTraffic = () => {
        if (googleMapRef.current) {
            if (showTraffic) {
                // renew the traffic layer
                if (trafficLayerRef.current) {
                    trafficLayerRef.current.setMap(null);
                }
            } else {
                // add the traffic layer if null
                const trafficLayer = new google.maps.TrafficLayer();
                trafficLayer.setMap(googleMapRef.current);
                trafficLayerRef.current = trafficLayer; // store the traffic layer
            }
        }
        setShowTraffic(!showTraffic);
    };

    //! swap origin and destination locations
    const swapLocations = () => {
        setAddresses(prev => ({
            origin: prev.destination,
            destination: prev.origin,
            originCoords: prev.destCoords,
            destCoords: prev.originCoords
        }));
    };

    return (
        <div className="container">
            <div className="route-header">
                <h2 className="route-title">Route Directions</h2>
                <div className="addresses-container">
                    <div className="address-card">
                        <div className="address-marker">A</div>
                        <div className="address-content">
                            <div className="address-label">From:</div>
                            <div className="address-value">{addresses.origin}</div>
                        </div>
                    </div>
                    <div className="route-connector">
                        <div className="connector-line"></div>
                        <button className="swap-button" onClick={swapLocations} title="Swap locations">
                            <span className="swap-icon">⇄</span>
                        </button>
                    </div>
                    <div className="address-card">
                        <div className="address-marker">B</div>
                        <div className="address-content">
                            <div className="address-label">To:</div>
                            <div className="address-value">{addresses.destination}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`content-wrapper ${showTraffic ? 'with-traffic-panel' : ''}`}>
                <div className="main-content">
                    <div 
                        ref={mapRef} 
                        className="map"
                        role="region"
                    />

                    <div className="controls">
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
                        <div className="control-group">
                            <label className="label">
                                Traffic
                            </label>
                            <button 
                                onClick={toggleTraffic}
                                className={`traffic-toggle-btn ${showTraffic ? 'active' : ''}`}
                            >
                                {showTraffic ? 'Hide Traffic' : 'Show Traffic'}
                            </button>
                        </div>
                    </div>

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

                {/* traffic insights panel will fully replace the map */}
                {showTraffic && (
                    <div className="traffic-container">
                        <div className="back-to-map">
                            <button 
                                onClick={toggleTraffic}
                                className="back-button"
                            >
                                Back to Map
                            </button>
                        </div>
                        <TrafficCongestionPanel 
                            origin={addresses.originCoords}
                            destination={addresses.destCoords}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelMode;