import React from 'react';
import './SimulationControls.css';

const SimulationControls = ({ 
  running, 
  startPoint, 
  endPoint,
  onStart,
  onStop,
  onReset,
  speed,
  onSpeedChange
}) => {
  return (
    <div className="simulation-controls">
      <h2>Simulation Controls</h2>
      
      <div className="route-selection">
        <div className="route-info">
          <div className="point-display">
            <div className="point-label">Start Point</div>
            <div className={`point-value start ${!startPoint ? 'not-selected' : ''}`}>
              {startPoint || 'Not Selected'}
            </div>
          </div>
          
          <div className="point-display">
            <div className="point-label">End Point</div>
            <div className={`point-value end ${!endPoint ? 'not-selected' : ''}`}>
              {endPoint || 'Not Selected'}
            </div>
          </div>
        </div>
        
        {!startPoint || !endPoint ? (
          <div className="simulation-message">
            Please select start and end points on the map
          </div>
        ) : null}
      </div>
      
      <div className="speed-control">
        <label>Simulation Speed: {speed}x</label>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={speed} 
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
        />
      </div>
      
      <div className="control-buttons">
        {!running ? (
          <button 
            className="start-button"
            onClick={onStart}
            disabled={!startPoint || !endPoint}
          >
            Start Simulation
          </button>
        ) : (
          <>
            <button 
              className="stop-button"
              onClick={onStop}
            >
              Stop
            </button>
            <button 
              className="reset-button"
              onClick={onReset}
            >
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SimulationControls;