import React from 'react';
import '../app/css/TrafficIncident.css';
// this is for each incident card, the incident card is a child of the traffic congestion panel
// so for each incident, there will be an card
const TrafficIncident = ({ incident }) => {
  // convert km to miles
  const kmToMiles = (km) => (km * 0.621371).toFixed(1);
  
  return (
    <div className="incident-card">
      <div className="incident-header ">
        <span className={`incident-severity ${incident.severity.toLowerCase()}`}>
          {incident.severity}
        </span>
        <span className="incident-type">{incident.type}</span>
      </div>
      <div className="incident-details">
        <p className="incident-location">{incident.location}</p>
        <p className="incident-delay">
          Delay: {Math.round(incident.delay / 60)} minutes
        </p>
        <p className="incident-length">
          Affected Area: {kmToMiles(incident.length)} miles
        </p>
        <div className="incident-timing">
          <p>Start: {incident.startTime}</p>
          <p>End: {incident.endTime}</p>
        </div>
        <p className="incident-status">Status: {incident.status}</p>
      </div>
    </div>
  );
};

export default TrafficIncident; 