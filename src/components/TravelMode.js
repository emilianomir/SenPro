// the idea of this component is to allow the user to select a starting location and a destination and then display the route between the two points
// the user can also select the travel mode (driving, walking, transit)
// the component will display the route on the map and the distance and time it will take to travel between the two points 
// the component will also display the distance and time it will take to travel between the two points in a table
import { useEffect, useRef, useState } from 'react';
import '../app/css/TravelMode.css';

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
    const [trafficInfo, setTrafficInfo] = useState({ // dummy data for the traffic info, placeholder for the real data
        congestion: 'Moderate',
        congestionPercentage: 65,
        bestTravelTime: '10:30 AM',
        worstTravelTime: '5:45 PM',
        alternativeRouteTime: '',
        incidents: []
    });
    const [directionsResponse, setDirectionsResponse] = useState(null); // State for directions response

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
                center: location,
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

            // Use actual addresses if available, otherwise use coordinates
            const routeOptions = {
                travelMode: google.maps.TravelMode[selectedMode], // from the google.maps object from api, set the travel mode to the selected mode
            };

            //! EXAMPLE OF ROUTE OPTIONS
            // const routeOptions = {
            //     travelMode: google.maps.TravelMode.DRIVING,
            //     origin: "Edinburg, TX",
            //     destination: "Rio Grande City, TX",
            //     waypoints: [
            //         {
            //             location: "San Antonio, TX",
            //             stopover: true,
            //         },
            //         {
            //             location: "Austin, TX",
            //             stopover: true,
            //         },
            //     ],
            // };


            //! FALL BACK FOR TEXT ADDRESS OR COORDINATES
            // in case of text address, not coordinates
            if (originAddress && destinationAddress) {
                routeOptions.origin = originAddress;
                routeOptions.destination = destinationAddress;
            } else {
                // if there is no text address, use the coordinates
                routeOptions.origin = location;
                routeOptions.destination = destination || defaultDestination;
            }

            try {
                const response = await directionsService.route(routeOptions); // request the route from the directions service (google maps api)
                directionsRenderer.setDirections(response); // render the route on the map
                const { distance, duration } = response.routes[0].legs[0]; // legs are the route segments between the origin and destination
                setTravelInfo({ distance: distance.text, duration: duration.text }); // set the distance and duration in the travel info state
                setDirectionsResponse(response); // Store response in state
            } catch (e) {
                window.alert("Directions request failed because " + e);
            }
        };

        //with every prop change, change map ref
        if (window.google && window.google.maps) {
            initMap();
        } else {
            loadGoogleMapsScript();
        }
    }, [location, destination, originAddress, destinationAddress, showTraffic]);

    //if origin changes, change location
    useEffect(() => {
        if (origin) {
            setLocation(origin);
        }
    }, [origin]);

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
                
                // default traffic info
                setTrafficInfo({
                    congestion: 'Moderate',
                    congestionPercentage: 65,
                    bestTravelTime: '10:30 AM',
                    worstTravelTime: '5:45 PM',
                    alternativeRouteTime: '5 minutes faster',
                    incidents: [
                        { type: 'Heavy traffic', location: 'Midway through route', delay: '8 minutes' }
                    ]
                });
            }
        }
        setShowTraffic(!showTraffic);
    };



    return (
        <div className="container">
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

                {/* New Traffic Information Panel */}
                {showTraffic && (
                    <div className="traffic-panel">
                        <h3 className="panel-title">Traffic Insights</h3>
                        
                        <div className="traffic-congestion">
                            <h4>Current Traffic Congestion</h4>
                            <div className="congestion-meter">
                                <div 
                                    className="congestion-level" 
                                    style={{width: `${trafficInfo.congestionPercentage}%`}}
                                ></div>
                            </div>
                            <p className="congestion-label">{trafficInfo.congestion} ({trafficInfo.congestionPercentage}%)</p>
                        </div>
                        
                        <div className="traffic-timing">
                            <h4>Best Times to Travel</h4>
                            <div className="time-info">
                                <div>
                                    <span className="time-label">Best time:</span>
                                    <span className="time-value">{trafficInfo.bestTravelTime}</span>
                                </div>
                                <div>
                                    <span className="time-label">Worst time:</span>
                                    <span className="time-value">{trafficInfo.worstTravelTime}</span>
                                </div>
                            </div>
                        </div>
                        
                        {trafficInfo.alternativeRouteTime && (
                            <div className="alternative-route">
                                <h4>Alternative Route</h4>
                                <p>An alternative route is available that could be {trafficInfo.alternativeRouteTime}.</p>
                                <button className="alt-route-btn">View Alternative</button>
                            </div>
                        )}
                        
                        {trafficInfo.incidents.length > 0 && (
                            <div className="traffic-incidents">
                                <h4>Traffic Incidents</h4>
                                {trafficInfo.incidents.map((incident, index) => (
                                    <div key={index} className="incident">
                                        <p className="incident-type">{incident.type}</p>
                                        <p className="incident-location">{incident.location}</p>
                                        <p className="incident-delay">Expected delay: {incident.delay}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelMode;