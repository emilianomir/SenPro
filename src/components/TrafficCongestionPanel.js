import { useEffect, useState } from 'react';
import '../app/css/TrafficCongestionPannel.css';
import TrafficIncidentsPanel from './TrafficIncidentsPanel';

const TrafficCongestionPanel = ({ origin, destination }) => {
    const [trafficInfo, setTrafficInfo] = useState({
        congestion: '', // set up initial states
        congestionPercentage: 0,
        currentSpeed: 0,
        freeFlowSpeed: 0
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
                
                // Google Maps Distance Matrix API for traffic data
                const distanceMatrixResponse = await fetch(
                    `/api/google-traffic?` +
                    `originLat=${origin.lat}&originLng=${origin.lng}&` +
                    `destinationLat=${destination.lat}&destinationLng=${destination.lng}`
                );
                
                const trafficData = await distanceMatrixResponse.json(); // parse response from json to js object
                console.log("Google Traffic API response:", trafficData);
                
                if (!trafficData.success) {
                    throw new Error(trafficData.error || "Failed to fetch traffic data");
                }

                //! example of trafficData object:
                // {
                //     success: true,
                //     distance: 10000,
                //     duration: 3600,
                //     durationInTraffic: 4200
                // }
                //! end of example

                // get traffic data from google response
                const currentDuration = trafficData.durationInTraffic;
                const normalDuration = trafficData.duration;
                
                // calculate congestion percentage based on duration difference
                const congestionPercentage = Math.round(
                    ((currentDuration - normalDuration) / normalDuration) * 100
                );

                // estimate speeds based on distance and durations
                const distanceInKm = trafficData.distance / 1000; // meters to km
                const kmhToMph = (kmh) => (kmh * 0.621371).toFixed(1);
                const distanceInMiles = distanceInKm * 0.621371;
                const currentSpeedKmh = (distanceInKm / (currentDuration / 3600)).toFixed(1);
                const freeFlowSpeedKmh = (distanceInKm / (normalDuration / 3600)).toFixed(1);
                const currentSpeed = kmhToMph(currentSpeedKmh);
                const freeFlowSpeed = kmhToMph(freeFlowSpeedKmh);
                
                // calculate the congestion level, arbitrary values
                let congestionLevel = 'Low';
                if (congestionPercentage < 30) {
                    congestionLevel = 'Low';
                } else if (congestionPercentage < 70) {
                    congestionLevel = 'Moderate';
                } else {
                    congestionLevel = 'High';
                }
                
                setTrafficInfo({
                    congestion: congestionLevel,
                    congestionPercentage: Math.max(0, congestionPercentage), // ensure non-negative
                    currentSpeed: currentSpeed,
                    freeFlowSpeed: freeFlowSpeed
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Error getting traffic data:', error);
                // set default values in case of error
                setTrafficInfo({
                    congestion: 'Unknown',
                    congestionPercentage: 0,
                    currentSpeed: 0,
                    freeFlowSpeed: 0
                });
                setIsLoading(false);
            }
        };

        fetchTrafficData();
    }, [origin, destination]);

    if (isLoading) {
        return <div>Loading traffic data...</div>;
    }

    return (
        <div className="traffic-container">
            <div className="traffic-panel">
                <h3 className="panel-title">Traffic Insights</h3>
                
                <div className="traffic-congestion">
                    <div className="congestion-header">
                        <h4>Traffic Congestion</h4>
                        <span className={`congestion-badge ${
                            trafficInfo.congestionPercentage < 30 ? 'low' : 
                            trafficInfo.congestionPercentage < 70 ? 'moderate' : 
                            'high'
                        }`}>
                            {trafficInfo.congestion}
                        </span>
                    </div>
                    
                    <div className="congestion-meter-container">
                        <div className="congestion-meter">
                            <div 
                                className={`congestion-level ${
                                    trafficInfo.congestionPercentage < 30 ? 'low' : 
                                    trafficInfo.congestionPercentage < 70 ? 'moderate' : 
                                    'high'
                                }`}
                                style={{ 
                                    width: `${Math.min(trafficInfo.congestionPercentage, 100)}%` 
                                }}
                            ></div>
                        </div>
                        <div className="congestion-percentage">
                            {trafficInfo.congestionPercentage}%
                        </div>
                    </div>
                    
                    <div className="speeds-container">
                        <div className="speed-item">
                            <div className="speed-value">{trafficInfo.currentSpeed}</div>
                            <div className="speed-label" title="The current average speed with traffic conditions">
                                Current mph
                                <span className="tooltip-icon">ⓘ</span>
                            </div>
                        </div>
                        <div className="speed-divider"></div>
                        <div className="speed-item">
                            <div className="speed-value">{trafficInfo.freeFlowSpeed}</div>
                            <div className="speed-label" title="The expected speed without any traffic">
                                Normal mph
                                <span className="tooltip-icon">ⓘ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* traffic incidents around destination using tomtomAPI */}
            <TrafficIncidentsPanel key={`${destination.lat}-${destination.lng}`} location={destination} />
        </div>
    );
};

export default TrafficCongestionPanel; 