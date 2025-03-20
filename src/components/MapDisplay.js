import React, { useRef, useEffect } from 'react';
import './MapDisplay.css';

const MapDisplay = ({ 
  locations, 
  roads, 
  ants, 
  bestRoute,
  selectedStartPoint,
  selectedEndPoint,
  onMapClick,
  onLocationClick
}) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw roads
    roads.forEach(road => {
      const fromLocation = locations.find(loc => loc.id === road.from);
      const toLocation = locations.find(loc => loc.id === road.to);
      
      if (fromLocation && toLocation) {
        // Draw road
        ctx.beginPath();
        ctx.moveTo(fromLocation.x, fromLocation.y);
        ctx.lineTo(toLocation.x, toLocation.y);
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw traffic indicator
        const midX = (fromLocation.x + toLocation.x) / 2;
        const midY = (fromLocation.y + toLocation.y) / 2;
        
        ctx.beginPath();
        ctx.arc(midX, midY, 8, 0, 2 * Math.PI);
        
        // Color based on traffic
        let trafficColor;
        switch(road.traffic) {
          case 'Low':
            trafficColor = '#4CAF50'; // Green
            break;
          case 'Medium':
            trafficColor = '#FFC107'; // Yellow
            break;
          case 'High':
            trafficColor = '#F44336'; // Red
            break;
          default:
            trafficColor = '#aaa';
        }
        
        ctx.fillStyle = trafficColor;
        ctx.fill();
        
        // Draw distance label
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(`${road.distance} mi`, midX + 12, midY - 4);
      }
    });
    
    // Draw best route if available
    if (bestRoute && bestRoute.length > 1) {
      for (let i = 0; i < bestRoute.length - 1; i++) {
        const fromLocation = locations.find(loc => loc.id === bestRoute[i]);
        const toLocation = locations.find(loc => loc.id === bestRoute[i + 1]);
        
        if (fromLocation && toLocation) {
          ctx.beginPath();
          ctx.moveTo(fromLocation.x, fromLocation.y);
          ctx.lineTo(toLocation.x, toLocation.y);
          ctx.strokeStyle = '#9c27b0';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }
    }
    
    // Draw locations
    locations.forEach(location => {
      ctx.beginPath();
      ctx.arc(location.x, location.y, 15, 0, 2 * Math.PI);
      
      // Different colors for start, end, and regular locations
      if (location.id === selectedStartPoint) {
        ctx.fillStyle = '#4CAF50'; // Green for start
      } else if (location.id === selectedEndPoint) {
        ctx.fillStyle = '#F44336'; // Red for end
      } else if (bestRoute && bestRoute.includes(location.id)) {
        ctx.fillStyle = '#9c27b0'; // Purple for best route
      } else {
        ctx.fillStyle = '#3498db'; // Blue for regular
      }
      
      ctx.fill();
      
      // Draw location ID
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(location.id, location.x, location.y);
      
      // Draw location name
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText(location.name, location.x, location.y + 25);
    });
    
    // Draw ants
    ants.forEach(ant => {
      if (ant.done) return; // Don't draw ants that are done
      
      const location = locations.find(loc => loc.id === ant.currentLocation);
      if (location) {
        ctx.beginPath();
        ctx.arc(location.x, location.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#000';
        ctx.fill();
      }
    });
    
  }, [locations, roads, ants, bestRoute, selectedStartPoint, selectedEndPoint]);
  
  const handleCanvasClick = (e) => {
    if (!onMapClick) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicked on a location
    const clickedLocation = locations.find(loc => {
      const distance = Math.sqrt(
        Math.pow(loc.x - x, 2) + Math.pow(loc.y - y, 2)
      );
      return distance <= 15; // 15px radius
    });
    
    if (clickedLocation && onLocationClick) {
      onLocationClick(clickedLocation.id);
    } else {
      onMapClick(x, y);
    }
  };
  
  return (
    <div className="map-display">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={500} 
        onClick={handleCanvasClick}
      />
      <div className="map-legend">
        <div className="legend-item">
          <span className="traffic-dot low"></span> Low Traffic
        </div>
        <div className="legend-item">
          <span className="traffic-dot medium"></span> Medium Traffic
        </div>
        <div className="legend-item">
          <span className="traffic-dot high"></span> Heavy Traffic
        </div>
        {selectedStartPoint && (
          <div className="legend-item">
            <span className="location-dot start"></span> Start Point
          </div>
        )}
        {selectedEndPoint && (
          <div className="legend-item">
            <span className="location-dot end"></span> End Point
          </div>
        )}
        {bestRoute && (
          <div className="legend-item">
            <span className="route-line"></span> Best Route
          </div>
        )}
      </div>
    </div>
  );
};

export default MapDisplay;