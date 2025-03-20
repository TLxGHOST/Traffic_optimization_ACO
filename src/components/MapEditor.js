import React from 'react';
import './MapEditor.css';

const MapEditor = ({ 
  locations, 
  roads, 
  editMode,
  onUpdateLocationName,
  onUpdateRoadTraffic, 
  onDeleteLocation,
  onDeleteRoad
}) => {
  return (
    <div className="map-editor">
      <h2>{editMode === 'location' ? 'Locations' : 'Roads'}</h2>
      
      {editMode === 'location' ? (
        <>
          <p className="editor-instructions">
            Click on the map to add new locations. Edit existing locations below.
          </p>
          <div className="editor-list">
            {locations.map(location => (
              <div key={location.id} className="editor-item">
                <span className="item-id">{location.id}</span>
                <input 
                  type="text" 
                  value={location.name} 
                  onChange={(e) => onUpdateLocationName(location.id, e.target.value)}
                  className="location-name-input"
                />
                <span className="item-coords">
                  ({location.x.toFixed(0)}, {location.y.toFixed(0)})
                </span>
                <button 
                  className="delete-button"
                  onClick={() => onDeleteLocation(location.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="editor-instructions">
            Click on two locations to create a road between them. Edit road properties below.
          </p>
          <div className="editor-list">
            {roads.map(road => {
              const fromLocation = locations.find(loc => loc.id === road.from);
              const toLocation = locations.find(loc => loc.id === road.to);
              
              return (
                <div key={road.id} className="editor-item">
                  <span className="item-id">{road.id}</span>
                  <span className="road-locations">
                    {fromLocation?.name || road.from} → {toLocation?.name || road.to}
                  </span>
                  <span className="road-distance">
                    {road.distance} miles
                  </span>
                  <select 
                    value={road.traffic} 
                    onChange={(e) => onUpdateRoadTraffic(road.id, e.target.value)}
                    className="traffic-select"
                  >
                    <option value="Low">Low Traffic</option>
                    <option value="Medium">Medium Traffic</option>
                    <option value="High">High Traffic</option>
                  </select>
                  <button 
                    className="delete-button"
                    onClick={() => onDeleteRoad(road.id)}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MapEditor;