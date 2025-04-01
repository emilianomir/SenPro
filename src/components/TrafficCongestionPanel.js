import { useEffect, useState } from 'react';
import '../app/css/TrafficCongestionPannel.css';
import TrafficIncident from './TrafficIncident';

const TrafficCongestionPanel = ({ origin, destination }) => {
    const [trafficInfo, setTrafficInfo] = useState({
        congestion: '', // set up initial states
        congestionPercentage: 0,
        currentSpeed: 0,
        freeFlowSpeed: 0,
        incidents: []
    });
    const [isLoading, setIsLoading] = useState(true); // to render traffic panel only when data is loaded, for just ux purposes

    useEffect(() => {
        const fetchTrafficData = async () => { // if no props, then no traffic data
            if (!origin || !destination) {
                console.log("no origin or destination, or both, try again");
                return;
            }

            try {
                console.log("Fetching traffic data for:", {origin, destination});
                
                // tom tom traffic flow api
                const flowResponse = await fetch(
                    `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?` +
                    `point=${origin.lat},${origin.lng}&` +
                    `key=${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}`
                );
                const flowData = await flowResponse.json();
                console.log("Flow API response:", flowData);
                 // tom tom traffic incidents api
                // const incidentsResponse = await fetch(
                //     `https://api.tomtom.com/traffic/services/5/incidentDetails?` +
                //     `bbox=${origin.lng},${origin.lat},${destination.lng},${destination.lat}&` +
                //     `fields={incidents{type,geometry,properties}}&` +
                //     `key=${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}`
                // );

                // calculate the bounding box of the origin and destination, bbox parameter for incidents api, coordinates are in degrees
                const west  = Math.min(origin.lng, destination.lng);
                const east  = Math.max(origin.lng, destination.lng);
                const south = Math.min(origin.lat, destination.lat);
                const north = Math.max(origin.lat, destination.lat);
                
                // Calculate the area of the bounding box in square kilometers
                // Formula: Area ≈ 111.32 * (lat2 - lat1) * 111.32 * (lon2 - lon1) * cos((lat1 + lat2) / 2) // this is to convert the area to km
                const latDistance = north - south;
                const lngDistance = east - west;
                const middleLat = (north + south) / 2; // this is the earth curvature factor, needed to keep the km accurate
                const latDifference = latDistance * 111; //convert to km, doesnt use the earth curvature factor because lat lines are parallel and evenly spaced
                const lngDifference = lngDistance * 111 * Math.cos(middleLat * Math.PI / 180); //convert to km, uses the earth curvature factor because lng lines are curved
                const area = latDifference * lngDifference; // this is the area of the bounding box in square kilometers
                
                console.log("latDistance:", latDistance, "km");
                
                // If the area is too large, create a smaller bounding box around the origin
                let bbox;
                if (area > 10000) {
                    console.log("area too large, creating smaller bounding box");
                    const shrinkFactor = Math.sqrt(10000 / area); // this is to shrink the bounding box to 10000 km^2
                    const newLatRangeKm = latDifference * shrinkFactor;
                    const newLonRangeKm = lngDifference * shrinkFactor;
                    
                    // convert back to degrees for coordinates calculation
                    const newLatRangeDeg = newLatRangeKm / 111; // this is to convert the km to degrees
                    const newLonRangeDeg = newLonRangeKm / (111 * Math.cos(middleLat * Math.PI / 180));
                    
                    // re-center the bounding box around the midpoint
                    const centerLat = (north + south) / 2;
                    const centerLng = (east + west) / 2;
                    
                    // update the bbox
                    const newSouth = centerLat - newLatRangeDeg / 2;
                    const newNorth = centerLat + newLatRangeDeg / 2;
                    const newWest  = centerLng - newLonRangeDeg / 2;
                    const newEast  = centerLng + newLonRangeDeg / 2;
                    bbox = `${newWest},${newSouth},${newEast},${newNorth}`;
                } else { // if area is not too large, use the original bbox
                    bbox = `${west},${south},${east},${north}`;
                }
                
                // get the incidents data from tomtom incidents api
                const incidentsResponse = await fetch(
                    `https://api.tomtom.com/traffic/services/5/incidentDetails?` +
                    `bbox=${bbox}&` + // this is the bounding box of the origin and destination
                    //! NEED TO FIX THIS, the fields property is not workin, sytnax is wrong
                    `fields=incidents(type,geometry(type,coordinates),properties(iconCategory,location,delay,severity,status,startTime,endTime,length))&` + // fields is the things/properties we want to get from the api
                    // `fields=incidents(type,properties)&` +
                    // `fields=incidents{type,properties}&` +
                    `key=${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}`
                );
                
                const incidentsData = await incidentsResponse.json();
                console.log("Incidents API response:", incidentsData);

                // FLOW DATA BELOW THe traffic congestion
                const currentSpeed = flowData.flowSegmentData.currentSpeed;
                const freeFlowSpeed = flowData.flowSegmentData.freeFlowSpeed;
                // const congestionPercentage = Math.round((currentSpeed / freeFlowSpeed) * 100);
                const congestionPercentage = Math.round((1 - currentSpeed / freeFlowSpeed) * 100); // for the ratio, of currspeed/freeflow 
                
                // calculate the congestion level
                let congestionLevel = 'Low';
                if (congestionPercentage < 30) {
                    congestionLevel = 'Low';
                } else if (congestionPercentage < 70) {
                    congestionLevel = 'Moderate';
                } else {
                    congestionLevel = 'High';
                }

                // get more info on the incdents... but not working yet as a whole
                const processedIncidents = incidentsData.incidents?.map(incident => ({
                    type: incident.properties.type,
                    location: incident.properties.location.description,
                    delay: incident.properties.delay?.seconds || 0,
                    length: incident.properties.length || 0, // Length of affected area
                    severity: incident.properties.severity || 'Unknown',
                })) || []; // or empty array

                console.log("Processed incidents:", processedIncidents);
                
                setTrafficInfo({
                    congestion: congestionLevel,
                    congestionPercentage: congestionPercentage,
                    currentSpeed: currentSpeed.toFixed(1),
                    freeFlowSpeed: freeFlowSpeed.toFixed(1),
                    incidents: processedIncidents
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Error getting traffic data:', error);
                setIsLoading(false);
            }
        };

        fetchTrafficData();
    }, [origin, destination]);

    if (isLoading) {
        return <div>Loading traffic data...</div>;
    }

    return (
        <div className="traffic-panel">
            <h3 className="panel-title">Traffic Insights</h3>
            
            <div className="traffic-congestion">
                <h4>Current Traffic Congestion</h4>
                <div className="congestion-meter">
                    <div 
                        className={`congestion-level ${
                            trafficInfo.congestionPercentage < 30 ? 'low' : 
                            trafficInfo.congestionPercentage < 70 ? 'moderate' : 
                            'high'
                        }`}
                        style={{ 
                            // the width according to the width of parnet but maxes at 100
                            width: `${Math.min(trafficInfo.congestionPercentage, 100)}%` 
                        }}
                    ></div>
                </div>
                <p className="congestion-label">
                    {trafficInfo.congestion} ({trafficInfo.congestionPercentage}%)
                </p>
                
                <div className="traffic-details">
                    <p className="detail-item">
                        <span className="detail-label">Current Speed:</span>
                        <span className="detail-value">{trafficInfo.currentSpeed} km/h</span>
                    </p>
                    <p className="detail-item">
                        <span className="detail-label">Free Flow Speed:</span>
                        <span className="detail-value">{trafficInfo.freeFlowSpeed} km/h</span>
                    </p>
                </div>
            </div>
            
            <div className="debug-info" style={{marginTop: '10px', fontSize: '0.8rem', color: '#666'}}>
                <p>Incidents data available: {trafficInfo.incidents.length}</p>
            </div>
            
            {trafficInfo.incidents.length > 0 ? (
                <div className="traffic-incidents">
                    <h4>Traffic Incidents ({trafficInfo.incidents.length})</h4>
                    {trafficInfo.incidents.map((incident, index) => (
                        <TrafficIncident key={index} incident={incident} />
                    ))}
                </div>
            ) : (
                <div className="no-incidents">
                    <p>No traffic incidents reported in this area.</p>
                </div>
            )}
        </div>
    );
};

export default TrafficCongestionPanel; 