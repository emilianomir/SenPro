import { useEffect, useState } from 'react';
import '../app/css/TrafficIncidentsPanel.css';
import TrafficIncident from './TrafficIncident';

const TrafficIncidentsPanel = ({ location }) => { // this object will have latitude and long values
    const [incidents, setIncidents] = useState([]); // state for the incidents
    const [isLoading, setIsLoading] = useState(true); // state for the loading
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIncidents = async () => {
            // reset state when location changes
            setIsLoading(true);
            setError(null);
            
            // if no location, don't fetch incidents
            if (!location || !location.lat || !location.lng) {
                console.log("no location coordinates provided for incidents");
                setIsLoading(false);
                return;
            }

            try {
                console.log("fetching traffic incidents for:", location);
                
                // call our tomtom incidents api
                const response = await fetch(
                    `/api/tomtom-incidents?` +
                    `centerLat=${location.lat}&centerLng=${location.lng}&` + //! construct URL with lat and lng to pass to server
                    `radius=5` // 5 miles radius
                );
                
                if (!response.ok) {
                    throw new Error(`error fetching incidents: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("tomtom incidents api response:", data);
                
                // even if we get an error from tomtom, the api returns success: true and empty incidents
                setIncidents(data.incidents || []);
                
                // if there was an error but we got a response, show it as a warning
                if (data.error) {
                    console.warn("tomtom api warning, look at the TrafficIncidentsPanel.js file:", data.error);
                    setError(data.error);
                } else {
                    setError(null);
                }
                
                setIsLoading(false);
                
            } catch (error) {
                console.error('error getting traffic incidents, look at the TrafficIncidentsPanel.js file:', error);
                setError("couldn't load traffic incidents");
                setIncidents([]);
                setIsLoading(false);
            }
        };

        fetchIncidents();
    }, [location]);

    if (isLoading) {
        return <div className="incidents-panel loading">Loading traffic incidents...</div>;
    }

    return (
        <div className="incidents-panel">
            <h3 className="panel-title">Traffic Incidents</h3>
            
            {error && (
                <div className="incidents-warning">
                    <p>{error}</p>
                </div>
            )}
            
            {incidents.length > 0 ? (
                <div className="traffic-incidents-list">
                    <h4>Incidents ({incidents.length})</h4>
                    {incidents.map((incident, index) => (
                        <TrafficIncident key={incident.id || index} incident={incident} />
                    ))}
                </div>
            ) : (
                <div className="no-incidents">
                    <p>{error ? "Unable to retrieve incidents" : "No traffic incidents reported in this area."}</p>
                </div>
            )}
        </div>
    );
};

export default TrafficIncidentsPanel; 