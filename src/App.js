import React, { useState, useEffect } from 'react';
import MapEditor from './components/MapEditor';
import MapDisplay from './components/MapDisplay';
import SimulationControls from './components/SimulationControls';
import AlgorithmStats from './components/AlgorithmStats';
import './App.css';
import Footer from './components/Footer';

function App() {
  const [locations, setLocations] = useState([]);
  const [roads, setRoads] = useState([]);
  const [editMode, setEditMode] = useState('location'); // 'location', 'road', or 'view'
  const [selectedStartPoint, setSelectedStartPoint] = useState(null);
  const [selectedEndPoint, setSelectedEndPoint] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [ants, setAnts] = useState([]);
  const [bestRoute, setBestRoute] = useState(null);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationStats, setSimulationStats] = useState({
    iterations: 0,
    routesExplored: 0,
    pheromoneUpdates: 0,
    bestRouteCost: Infinity
  });

  // Handle adding a new location
  const handleAddLocation = (x, y) => {
    if (editMode !== 'location') return;
    
    const newLocation = {
      id: `L${locations.length + 1}`,
      name: `Location ${locations.length + 1}`,
      x,
      y
    };
    
    setLocations([...locations, newLocation]);
  };

  // Handle adding a new road
  const handleAddRoad = (locationId) => {
    if (editMode !== 'road') return;
    
    if (!selectedStartPoint) {
      setSelectedStartPoint(locationId);
    } else if (selectedStartPoint !== locationId) {
      // Calculate distance between points
      const startLoc = locations.find(loc => loc.id === selectedStartPoint);
      const endLoc = locations.find(loc => loc.id === locationId);
      
      const distance = Math.sqrt(
        Math.pow(startLoc.x - endLoc.x, 2) + 
        Math.pow(startLoc.y - endLoc.y, 2)
      );
      
      const trafficOptions = ['Low', 'Medium', 'High'];
      const randomTraffic = trafficOptions[Math.floor(Math.random() * trafficOptions.length)];
      
      // Create new road
      const newRoad = {
        id: `R${roads.length + 1}`,
        from: selectedStartPoint,
        to: locationId,
        distance: Math.round(distance * 10) / 10,
        traffic: randomTraffic,
        fuelCost: Math.round((distance * (0.8 + Math.random() * 0.4)) * 10) / 10
      };
      
      setRoads([...roads, newRoad]);
      setSelectedStartPoint(null);
    }
  };

  // Start simulation
  const startSimulation = () => {
    if (!selectedStartPoint || !selectedEndPoint) {
      alert('Please select start and end points');
      return;
    }
    
    setSimulationRunning(true);
    setSimulationStep(0);
    setAnts([]);
    setBestRoute(null);
    
    // Initialize 10 ants at the start point
    const initialAnts = Array(10).fill().map((_, i) => ({
      id: i,
      currentLocation: selectedStartPoint,
      visitedLocations: [selectedStartPoint],
      totalDistance: 0,
      totalFuelCost: 0,
      done: false
    }));
    
    setAnts(initialAnts);
  };

  // Stop simulation
  const stopSimulation = () => {
    setSimulationRunning(false);
  };

  // Reset everything
  const resetSimulation = () => {
    setSimulationRunning(false);
    setAnts([]);
    setBestRoute(null);
    setSimulationStep(0);
    setSimulationStats({
      iterations: 0,
      routesExplored: 0,
      pheromoneUpdates: 0,
      bestRouteCost: Infinity
    });
  };

  // Run simulation steps
  useEffect(() => {
    if (!simulationRunning) return;
    
    const timer = setTimeout(() => {
      // Move each ant to next location
      const updatedAnts = ants.map(ant => {
        // If ant is already done or reached destination
        if (ant.done || ant.currentLocation === selectedEndPoint) {
          // Mark as done if reached destination
          if (ant.currentLocation === selectedEndPoint && !ant.done) {
            setSimulationStats(prev => ({
              ...prev,
              routesExplored: prev.routesExplored + 1
            }));
            
            // Check if this is the best route so far
            const totalCost = ant.totalDistance + ant.totalFuelCost;
            if (totalCost < simulationStats.bestRouteCost) {
              setBestRoute(ant.visitedLocations);
              setSimulationStats(prev => ({
                ...prev,
                bestRouteCost: totalCost,
                pheromoneUpdates: prev.pheromoneUpdates + 1
              }));
            }
          }
          
          return { ...ant, done: true };
        }
        
        // Get possible next locations (connected by roads and not visited)
        const possibleRoads = roads.filter(road => 
          road.from === ant.currentLocation && 
          !ant.visitedLocations.includes(road.to)
        );
        
        // If no possible moves, mark as done
        if (possibleRoads.length === 0) {
          return { ...ant, done: true };
        }
        
        // Choose next location (simplified - would use pheromones in real ACO)
        const randomIndex = Math.floor(Math.random() * possibleRoads.length);
        const chosenRoad = possibleRoads[randomIndex];
        
        // Update ant
        return {
          ...ant,
          currentLocation: chosenRoad.to,
          visitedLocations: [...ant.visitedLocations, chosenRoad.to],
          totalDistance: ant.totalDistance + chosenRoad.distance,
          totalFuelCost: ant.totalFuelCost + chosenRoad.fuelCost
        };
      });
      
      setAnts(updatedAnts);
      setSimulationStep(prev => prev + 1);
      
      // Check if all ants are done
      if (updatedAnts.every(ant => ant.done)) {
        // Create new generation of ants
        if (simulationStep < 50) { // Limit to 50 iterations
          const newAnts = Array(10).fill().map((_, i) => ({
            id: i + simulationStep * 10,
            currentLocation: selectedStartPoint,
            visitedLocations: [selectedStartPoint],
            totalDistance: 0,
            totalFuelCost: 0,
            done: false
          }));
          
          setAnts(newAnts);
          setSimulationStats(prev => ({
            ...prev,
            iterations: prev.iterations + 1
          }));
        } else {
          // End simulation after 50 iterations
          setSimulationRunning(false);
        }
      }
    }, 1000 / simulationSpeed);
    
    return () => clearTimeout(timer);
  }, [simulationRunning, ants, simulationStep, simulationSpeed, roads, selectedStartPoint, selectedEndPoint, simulationStats.bestRouteCost]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Ant Colony Traffic Optimizer
          
        </h1>
        
        <div className="mode-selector">
          <button 
            className={editMode === 'location' ? 'active' : ''}
            onClick={() => setEditMode('location')}
          >
            Add Locations
          </button>
          <button 
            className={editMode === 'road' ? 'active' : ''}
            onClick={() => setEditMode('road')}
          >
            Add Roads
          </button>
          <button 
            className={editMode === 'view' ? 'active' : ''}
            onClick={() => setEditMode('view')}
          >
            Simulation
          </button>
        </div>
      </header>
      
      <div className="main-content">
        <div className="map-container">
          <MapDisplay 
            locations={locations}
            roads={roads}
            ants={ants}
            bestRoute={bestRoute}
            selectedStartPoint={selectedStartPoint}
            selectedEndPoint={selectedEndPoint}
            onMapClick={handleAddLocation}
            onLocationClick={(editMode === 'road') ? handleAddRoad : 
              (editMode === 'view') ? (locationId) => {
                if (!selectedStartPoint) {
                  setSelectedStartPoint(locationId);
                } else if (!selectedEndPoint) {
                  setSelectedEndPoint(locationId);
                }
              } : null}
          />
        </div>
        
        <div className="sidebar">
          {editMode === 'view' ? (
            <>
              <SimulationControls 
                running={simulationRunning}
                startPoint={selectedStartPoint}
                endPoint={selectedEndPoint}
                onStart={startSimulation}
                onStop={stopSimulation}
                onReset={resetSimulation}
                speed={simulationSpeed}
                onSpeedChange={setSimulationSpeed}
              />
              <AlgorithmStats stats={simulationStats} />
            </>
          ) : (
            <MapEditor 
              locations={locations}
              roads={roads}
              editMode={editMode}
              onUpdateLocationName={(id, name) => {
                setLocations(locations.map(loc => 
                  loc.id === id ? {...loc, name} : loc
                ));
              }}
              onUpdateRoadTraffic={(id, traffic) => {
                setRoads(roads.map(road => 
                  road.id === id ? {...road, traffic} : road
                ));
              }}
              onDeleteLocation={(id) => {
                setLocations(locations.filter(loc => loc.id !== id));
                setRoads(roads.filter(road => 
                  road.from !== id && road.to !== id
                ));
              }}
              onDeleteRoad={(id) => {
                setRoads(roads.filter(road => road.id !== id));
              }}
            />
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;