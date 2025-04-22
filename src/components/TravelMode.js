// the idea of this component is to allow the user to select a starting location and a destination and then display the route between the two points
// the user can also select the travel mode (driving, walking, transit)
// the component will display the route on the map and the distance and time it will take to travel between the two points 
// the component will also display the distance and time it will take to travel between the two points in a table
import { useEffect, useRef, useState } from 'react';
import '../app/css/TravelMode.css';
import TrafficCongestionPanel from './TrafficCongestionPanel';

// MOCKING GOOGLE MAPS
import { loadGoogleMapsScript } from '../utils/loadGoogleMaps';

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
    const [travelInfo, setTravelInfo] = useState({ distance: '', duration: '', startAddress: '', endAddress: '' }); // travel info includes distance, time, and formatted start/end addresses
    const [showTraffic, setShowTraffic] = useState(true); // show traffic is a boolean that determines if the traffic layer is shown with btn
    const [showWeather, setShowWeather] = useState(false); // show weather is a boolean that determines if weather info is shown
    
    // wind alert button is a boolean that determines if the wind alert modal is shown with btn
    const [showWindAlert, setShowWindAlert] = useState(false);
    const [windAlertInfo, setWindAlertInfo] = useState({
        level: '',
        speed: '',
        description: '',
        advice: '',
        className: ''
    });
    
    // ice alert button is a boolean that determines if the ice alert modal is shown with btn
    const [showIceAlert, setShowIceAlert] = useState(false);
    const [iceAlertInfo, setIceAlertInfo] = useState({
        level: '',
        description: '',
        advice: '',
        className: ''
    });
    
    // create state for addresses that can be swapped
    const [addresses, setAddresses] = useState({
        origin: originAddress, 
        destination: destinationAddress,
        originCoords: origin || defaultOrigin,
        destCoords: destination || defaultDestination
    });

    const [weatherInfo, setWeatherInfo] = useState(null);
    useEffect(() => {
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
        //! original code but now used in utils/loadGoogleMaps.js for also use in mock testing
        // const loadGoogleMapsScript = () => {
        //     const script = document.createElement('script'); // create a script element
        //     script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`; // load the google maps script
        //     script.async = true; // load the script async
        //     script.defer = true; // load the script after the page has loaded
        //     script.onload = initMap; // init the map
        //     document.head.appendChild(script); // add the script to the head of the document so it can be used in the initMap function
        // };

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
                const leg = response.routes[0].legs[0]; // legs refers to the legs of the route, which is the distance and time it will take to travel between the two points, the two legs are the origin and destination, leg 1 is the origin and leg 2 is the destination
                directionsRenderer.setDirections(response);
                setTravelInfo({ distance: leg.distance.text, duration: leg.duration.text, startAddress: leg.start_address, endAddress: leg.end_address }); // set the travel info to the distance and time it will take to travel between the two points
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
            // loadGoogleMapsScript();
            loadGoogleMapsScript(initMap);
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

    //! toggle weather information
    const toggleWeather = () => {
        setShowWeather(!showWeather);
        
        // if toggling on and we don't have weather data yet, fetch it
        if (!showWeather && !weatherInfo && addresses.destCoords) {
            fetchWeatherData(addresses.destCoords.lat, addresses.destCoords.lng);
        }
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

    //! WEATHER DATA FETCHING ______________________________________________________________________________
    // SAMPLE DATA ------------------------------------------------------------------------------------------------
    // current weather object, data.current_weather
    // {
    //     temperature: 22.5,
    //     windspeed: 18.4,
    //     winddirection: 270,
    //     weathercode: 2,
    //     is_day: 1,
    //     time: "2025-04-08T14:00"
    //   }
    // daily weather object, data.daily
    // {
    //     time: ["2025-04-01", "2025-04-02", "2025-04-03", ...],
    //     weathercode: [2, 61, 0, ...],
    //     temperature_2m_max: [26.3, 24.1, 27.8, ...],
    //     temperature_2m_min: [17.5, 18.2, 16.0, ...],
    //     precipitation_probability_max: [10, 85, 5, ...]
    //   }
    // END OF SAMPLE DATA------------------------------------------------------------------------------------------------
    const fetchWeatherData = async (lat, lng) => {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&current_weather=true&timezone=auto`);
            const data = await response.json();
            setWeatherInfo({
                current: data.current_weather,
                daily: data.daily
            });
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };
    //! END OF WEATHER DATA FETCHING ______________________________________________________________________________


    useEffect(() => { // only fetch weather data when weather is visible and we change destination
        if (showWeather && addresses.destCoords) {
            fetchWeatherData(addresses.destCoords.lat, addresses.destCoords.lng);
        }
    }, [addresses.destCoords, showWeather]);

    //! WEATHER DESCRIPTION AND ICON ______________________________________________________________________________
    const getWeatherDescription = (code) => { // takes in a weather code and returns a description of the weather
        if ([0, 1].includes(code)) return "Clear";
        if ([2, 3].includes(code)) return "Cloudy";
        if ([45, 48].includes(code)) return "Foggy";
        if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
        if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
        if ([95, 96, 99].includes(code)) return "Stormy";
        return "Unknown";
    };

    const getWeatherIcon = (code, isDay) => { // takes in a weather code and returns an icon of the weather
        if ([0, 1].includes(code)) return isDay ? "☀️" : "🌙"; // isDay checks from api is_day, 1 is daytime, 0 is nighttime
        if ([2, 3].includes(code)) return "☁️";
        if ([45, 48].includes(code)) return "🌫️";
        if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
        if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
        if ([95, 96, 99].includes(code)) return "⛈️";
        return;
    };


    // 0 - North (N)
    // 90 - East (E)
    // 180 - South (S)
    // 270 - West (W)
    // 45 - Northeast (NE)
    // 135 - Southeast (SE)
    // 225 - Southwest (SW)
    // 315 - Northwest (NW)

    //! WIND STUFF ===========================================================================================================================
    const getWindDirection = (degrees) => { // takes in a degree which is from API and returns the direction of the wind
        const directions = [
            'N', 'NNE', 'NE', 'ENE', 
            'E', 'ESE', 'SE', 'SSE', 
            'S', 'SSW', 'SW', 'WSW', 
            'W', 'WNW', 'NW', 'NNW'
        ];
        const index = Math.round(degrees / 22.5) % 16; // rounds to the nearest 22.5 degrees and returns the direction of the wind
        return directions[index];
    };

    const kmhToMph = (kmh) => { // convert to mph
        return (kmh * 0.621371).toFixed(1);
    };

    const getWindSpeedClass = (speedMph) => { // arbritary danger levels for wind speed
        if (speedMph < 10) return 'wind-safe';
        if (speedMph < 20) return 'wind-moderate';
        if (speedMph < 30) return 'wind-warning';
        if (speedMph < 40) return 'wind-danger';
        return 'wind-severe';
    };

    const getWindSpeedDescription = (speedMph) => {
        if (speedMph < 10) return 'Safe driving conditions';
        if (speedMph < 20) return 'Use caution while driving';
        if (speedMph < 30) return 'Potential difficulty for high-profile vehicles';
        if (speedMph < 40) return 'Dangerous for high-profile vehicles';
        return 'Extremely dangerous, travel not recommended';
    };

    const getWindAlertLevel = (speedMph) => {
        if (speedMph < 10) return 'Safe';
        if (speedMph < 20) return 'Caution';
        if (speedMph < 30) return 'Warning';
        if (speedMph < 40) return 'Danger';
        return 'Severe';
    };

    const getWindAdvice = (speedMph) => {
        if (speedMph < 10) {
            return 'No special precautions needed. Safe for all vehicles.';
        }
        if (speedMph < 20) {
            return 'Be aware of occasional gusts. Drive normally but stay alert, especially in open areas.';
        }
        if (speedMph < 30) {
            return 'Reduced stability for high-sided vehicles. Maintain a firm grip on the steering wheel and reduce speed on bridges and open highways.';
        }
        if (speedMph < 40) {
            return 'Difficult driving conditions for high-sided vehicles. Consider using alternative routes that are less exposed. Reduce speed and maintain extra distance from other vehicles.';
        }
        return 'Extremely hazardous driving conditions. Travel not recommended. Risk of vehicles being blown over.';
    };

    const openWindAlert = (speedMph) => {
        const speed = parseFloat(speedMph);
        const level = getWindAlertLevel(speed);
        const description = getWindSpeedDescription(speed);
        const advice = getWindAdvice(speed);
        const className = getWindSpeedClass(speed);
        
        setWindAlertInfo({
            level,
            speed,
            description,
            advice,
            className
        });
        
        setShowWindAlert(true);
    };

    // toggle for wind ui
    const closeWindAlert = () => {
        setShowWindAlert(false);
    };

    const celsiusToFahrenheit = (celsius) => (celsius * 9/5) + 32;

    //! FOG STUFF ===========================================================================================================================
    const getFogDescription = (code) => {
        if ([45, 48].includes(code)) return 'Foggy conditions, reduce speed and use headlights.';
        return 'Clear visibility';
    };

    const getFogCautionLevel = (code) => {
        if ([45, 48].includes(code)) return 'Caution';
        return 'Safe';
    };

    //! ICE STUFF ===========================================================================================================================
    const getIceRiskLevel = (code, tempF) => { // you need precep and cold for ice
        const precipCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99];
        
        if ([56, 57, 66, 67].includes(code)) return 'High'; // freezing rain or snow
        if (tempF <= 36 && precipCodes.includes(code)) return 'Moderate'; // both low temp and precip from codes
        if (tempF <= 32) return 'Moderate'; // low temp
        return 'Low'; // no ice or low temp, so low risk
    };

    const getIceDescription = (riskLevel) => {
        switch (riskLevel) {
            case 'High':
                return 'High risk of ice on roads. Extreme caution advised.';
            case 'Moderate':
                return 'Possible icy patches on roads, especially bridges and overpasses.';
            case 'Low':
            default:
                return 'Low risk of ice on roads.';
        }
    };

    const getIceCautionClass = (riskLevel) => {
        switch (riskLevel) {
            case 'High':
                return 'ice-high';
            case 'Moderate':
                return 'ice-moderate';
            case 'Low':
            default:
                return 'ice-low';
        }
    };
    const getIceAdvice = (riskLevel) => {
        switch (riskLevel) {
            case 'High':
                return 'Caution required. Avoid travel if possible. If you must drive, significantly reduce speed, and avoid sudden braking or turns.';
            case 'Moderate':
                return 'Drive with caution. Reduce speed, leave extra space between vehicles, and be alert for black ice on road.';
            case 'Low':
            default:
                return 'Normal driving conditios, but remain alert for isolated icy spots. Maintain regular following distance and normal speeds.';
        }
    };

    const openIceAlert = (riskLevel) => {
        const level = riskLevel;
        const description = getIceDescription(riskLevel);
        const advice = getIceAdvice(riskLevel);
        const className = getIceCautionClass(riskLevel);
        
        setIceAlertInfo({
            level,
            description,
            advice,
            className
        });
        
        setShowIceAlert(true);
    };

    // close ice ui
    const closeIceAlert = () => {
        setShowIceAlert(false);
    }; //! END OF ICE UI

    return (
        <div className="container">
            <div className="route-header">
                <h2 className="route-title">Route Directions</h2>
                <div className="addresses-container">
                    <div className="address-card">
                        <div className="address-marker">A</div>
                        <div className="address-content">
                            <div className="address-label">From:</div>
                            <div className="address-value">{travelInfo.startAddress || addresses.origin}</div>
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
                            <div className="address-value">{travelInfo.endAddress || addresses.destination}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`content-wrapper ${showTraffic ? 'with-traffic-panel' : ''} ${showWeather ? 'with-weather-panel' : ''}`}>
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
                                Display Options
                            </label>
                            <div className="button-group">
                                <button 
                                    onClick={toggleTraffic}
                                    className={`toggle-btn ${showTraffic ? 'active' : ''}`}
                                >
                                    {showTraffic ? 'Hide Traffic' : 'Show Traffic'}
                                </button>
                                <button 
                                    onClick={toggleWeather}
                                    className={`toggle-btn ${showWeather ? 'active' : ''}`}
                                >
                                    {showWeather ? 'Hide Weather' : 'Show Weather'}
                                </button>
                            </div>
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
                {showWeather && (
                    <div className="weather-container-panel">
                        <div className="back-to-map">
                            <button 
                                onClick={toggleWeather}
                                className="back-button"
                            >
                                Back to Map
                            </button>
                        </div>
                        <h3 className="panel-title">Weather at Destination</h3>
                        
                        {weatherInfo ? (
                            <div className="weather-content">
                                {/* current weather ui */}
                                <div className="weather-header">
                                    <div className="weather-icon">
                                        {getWeatherIcon(weatherInfo.current.weathercode, weatherInfo.current.is_day === 1)} {/* takes in a weather code and returns an icon of the weather, 1 is daytime, 0 is nighttime */}
                                    </div>
                                    <div className="weather-main">
                                        <div className="weather-temp">{Math.round(celsiusToFahrenheit(weatherInfo.current.temperature))}°F</div>
                                        <div className="weather-desc">{getWeatherDescription(weatherInfo.current.weathercode)}</div>
                                    </div>
                                </div>
                                <div className="weather-details-grid">
                                    <div className="weather-detail-item">
                                        <span className="weather-detail-label" title="The current wind speed at destination location">
                                            Wind Speed
                                            <span className="tooltip-icon">ⓘ</span>
                                        </span>
                                        <div className="wind-speed-container">
                                            <span className={`weather-detail-value ${getWindSpeedClass(kmhToMph(weatherInfo.current.windspeed))}`} 
                                                title={getWindSpeedDescription(kmhToMph(weatherInfo.current.windspeed))}>
                                                {kmhToMph(weatherInfo.current.windspeed)} mph
                                            </span>
                                            <div 
                                                className={`wind-alert-badge ${getWindSpeedClass(kmhToMph(weatherInfo.current.windspeed))}`}
                                                onClick={() => openWindAlert(kmhToMph(weatherInfo.current.windspeed))}
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Wind alert: ${getWindAlertLevel(kmhToMph(weatherInfo.current.windspeed))}`}
                                            >
                                                {getWindAlertLevel(kmhToMph(weatherInfo.current.windspeed))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="weather-detail-item">
                                        <span className="weather-detail-label" title="The direction from which the wind is blowing">
                                            Wind Direction
                                            <span className="tooltip-icon">ⓘ</span>
                                        </span>
                                        <span className="weather-detail-value">
                                            {getWindDirection(weatherInfo.current.winddirection)} ({weatherInfo.current.winddirection}°) {/* takes in a degree and returns the direction of the wind */}
                                        </span>
                                    </div>
                                    <div className="weather-detail-item">
                                        <span className="weather-detail-label" title="Fog conditions at destination location">
                                            Fog Conditions
                                            <span className="tooltip-icon">ⓘ</span>
                                        </span>
                                        <div className="fog-condition-container">
                                            <span className="weather-detail-value" 
                                                title={getFogDescription(weatherInfo.current.weathercode)}>
                                                {getFogCautionLevel(weatherInfo.current.weathercode)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="weather-detail-item">
                                        <span className="weather-detail-label" title="Risk of ice on roads at destination location">
                                            Ice Risk
                                            <span className="tooltip-icon">ⓘ</span>
                                        </span>
                                        <div className="ice-risk-container">
                                            <span 
                                                className={`weather-detail-value ${getIceCautionClass(getIceRiskLevel(weatherInfo.current.weathercode, Math.round(celsiusToFahrenheit(weatherInfo.current.temperature))))}`}
                                                title={getIceDescription(getIceRiskLevel(weatherInfo.current.weathercode, Math.round(celsiusToFahrenheit(weatherInfo.current.temperature))))}
                                            >
                                                {getIceRiskLevel(weatherInfo.current.weathercode, Math.round(celsiusToFahrenheit(weatherInfo.current.temperature)))}
                                            </span>
                                            <div 
                                                className={`ice-alert-badge ${getIceCautionClass(getIceRiskLevel(weatherInfo.current.weathercode, Math.round(celsiusToFahrenheit(weatherInfo.current.temperature))))}`}
                                                onClick={() => openIceAlert(getIceRiskLevel(weatherInfo.current.weathercode, Math.round(celsiusToFahrenheit(weatherInfo.current.temperature))))}
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Ice Risk: ${getIceRiskLevel(weatherInfo.current.weathercode, Math.round(celsiusToFahrenheit(weatherInfo.current.temperature)))}`}
                                            >
                                                {getIceRiskLevel(weatherInfo.current.weathercode, Math.round(celsiusToFahrenheit(weatherInfo.current.temperature)))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h4 className="forecast-title">3-Day Forecast</h4>
                                <div className="forecast-container"> 
                                    {/* //! slice the first 3 days of the forecast, can change the number of days */}
                                    {weatherInfo.daily.time.slice(0, 3).map((date, index) => (
                                        <div key={date} className="forecast-day">
                                            <div className="forecast-date">
                                                {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="forecast-icon">
                                                {getWeatherIcon(weatherInfo.daily.weathercode[index], true)}
                                            </div>
                                            <div className="forecast-temp">
                                                <span className="forecast-temp-max">{Math.round(celsiusToFahrenheit(weatherInfo.daily.temperature_2m_max[index]))}°F</span>
                                                <span className="forecast-temp-min">{Math.round(celsiusToFahrenheit(weatherInfo.daily.temperature_2m_min[index]))}°F</span>
                                            </div>
                                            <div className="forecast-precip">
                                                <span className="forecast-precip-prob">{weatherInfo.daily.precipitation_probability_max[index]}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="loading-weather">
                                <p>Loading weather information...</p>
                            </div>
                        )}
                    </div>
                )}
                {showWindAlert && (
                    <div className="wind-alert-modal-overlay" onClick={closeWindAlert}>
                        <div className="wind-alert-modal" onClick={e => e.stopPropagation()}>
                            <div className={`wind-alert-modal-header ${windAlertInfo.className}`}>
                                <h3 className="wind-alert-modal-title">
                                    Wind Alert: {windAlertInfo.level}
                                </h3>
                                <button className="wind-alert-close-btn" onClick={closeWindAlert} aria-label="Close">
                                    &times;
                                </button>
                            </div>
                            
                            <div className="wind-alert-modal-content">
                                <div className="wind-alert-info-row">
                                    <span className="wind-alert-info-label">Current Wind Speed:</span>
                                    <span className={`wind-alert-info-value ${windAlertInfo.className}`}>
                                        {windAlertInfo.speed} mph
                                    </span>
                                </div>
                                
                                <div className="wind-alert-info-row">
                                    <span className="wind-alert-info-label">Conditions:</span>
                                    <span className="wind-alert-info-value">
                                        {windAlertInfo.description}
                                    </span>
                                </div>
                                
                                <div className="wind-alert-advice">
                                    <h4 className="wind-alert-advice-title">Driving Recommendations:</h4>
                                    <p className="wind-alert-advice-text">{windAlertInfo.advice}</p>
                                </div>
                                
                                <div className="wind-alert-footer">
                                    <button className="wind-alert-action-btn" onClick={closeWindAlert}>
                                        Got it
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ice alert ui */}
                {showIceAlert && (
                    <div className="alert-modal-overlay" onClick={closeIceAlert}>
                        <div className="alert-modal" onClick={e => e.stopPropagation()}>
                            <div className={`alert-modal-header ${iceAlertInfo.className}`}>
                                <h3 className="alert-modal-title">
                                    Ice Risk: {iceAlertInfo.level}
                                </h3>
                                <button className="alert-close-btn" onClick={closeIceAlert} aria-label="Close">
                                    &times;
                                </button>
                            </div>
                            
                            <div className="alert-modal-content">
                                <div className="alert-info-row">
                                    <span className="alert-info-label">Road Conditions:</span>
                                    <span className={`alert-info-value ${iceAlertInfo.className}`}>
                                        {iceAlertInfo.description}
                                    </span>
                                </div>
                                
                                <div className="alert-advice">
                                    <h4 className="alert-advice-title">Driving Recommendations:</h4>
                                    <p className="alert-advice-text">{iceAlertInfo.advice}</p>
                                </div>
                                
                                <div className="alert-footer">
                                    <button className="alert-action-btn" onClick={closeIceAlert}>
                                        Got it
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelMode;