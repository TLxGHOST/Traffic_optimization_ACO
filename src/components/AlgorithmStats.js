import React from 'react';
import './AlgorithmStats.css';

const AlgorithmStats = ({ stats }) => {
  return (
    <div className="algorithm-stats">
      <h2>Algorithm Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{stats.iterations}</div>
          <div className="stat-label">Iterations</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.routesExplored}</div>
          <div className="stat-label">Routes Explored</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.pheromoneUpdates}</div>
          <div className="stat-label">Pheromone Updates</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">
            {stats.bestRouteCost === Infinity ? '—' : stats.bestRouteCost.toFixed(1)}
          </div>
          <div className="stat-label">Best Cost</div>
        </div>
      </div>
      
      <div className="algorithm-explanation">
        <h3>How It Works:</h3>
        <p>
          Ant Colony Optimization (ACO) mimics how ants find the shortest path to food. 
          Virtual ants explore different routes and leave "pheromones" on good paths.
        </p>
        <ul>
          <li>Ants start at the origin and make probabilistic moves</li>
          <li>Better routes receive more pheromone deposits</li>
          <li>Over time, pheromones guide ants to optimal solutions</li>
          <li>The algorithm balances exploration and exploitation</li>
        </ul>
      </div>
    </div>
  );
};

export default AlgorithmStats;