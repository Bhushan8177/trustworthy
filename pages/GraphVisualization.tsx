import React from 'react';

interface GraphVisualizationProps {
  highlightedPath?: string[];
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ highlightedPath = [] }) => {
  const isHighlighted = (node: string) => highlightedPath.includes(node);
  const isEdgeHighlighted = (start: string, end: string) => {
    return highlightedPath.indexOf(start) !== -1 && 
           highlightedPath.indexOf(end) !== -1 && 
           Math.abs(highlightedPath.indexOf(start) - highlightedPath.indexOf(end)) === 1;
  };

  return (
    <div className="flex justify-center items-center w-full h-96">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="w-full h-full max-w-lg">
        <style>
          {`
          .node { fill: #b0c4de; stroke: #4682b4; stroke-width: 2; }
          .edge { stroke: #4682b4; stroke-width: 2; }
          text { font-family: Arial, sans-serif; font-size: 14px; fill: #333; }
          .node-label { font-weight: bold; }
          .edge-label { font-size: 12px; fill: #666; }
          .highlighted { fill: #ff7f50; stroke: #ff4500; }
          .edge.highlighted { stroke: #ff4500; stroke-width: 3; }
          `}
        </style>
        
        {/* Edges */}
        <line x1="200" y1="50"  x2="350" y2="150" className={`edge ${isEdgeHighlighted('A', 'B') ? 'highlighted' : ''}`} />
        <line x1="200" y1="50"  x2="50"  y2="150" className={`edge ${isEdgeHighlighted('A', 'C') ? 'highlighted' : ''}`} />
        <line x1="350" y1="150" x2="350" y2="250" className={`edge ${isEdgeHighlighted('B', 'D') ? 'highlighted' : ''}`} />
        <line x1="50"  y1="150" x2="50"  y2="250" className={`edge ${isEdgeHighlighted('C', 'E') ? 'highlighted' : ''}`} />
        <line x1="200" y1="350" x2="350" y2="250" className={`edge ${isEdgeHighlighted('F', 'D') ? 'highlighted' : ''}`} />
        <line x1="200" y1="350" x2="50"  y2="250" className={`edge ${isEdgeHighlighted('F', 'E') ? 'highlighted' : ''}`} />
        <line x1="50"  y1="150" x2="350" y2="250" className={`edge ${isEdgeHighlighted('C', 'D') ? 'highlighted' : ''}`} />
        <line x1="350" y1="150" x2="50"  y2="250" className={`edge ${isEdgeHighlighted('B', 'E') ? 'highlighted' : ''}`} />
        
        {/* Nodes */}
        <circle cx="200" cy="50"  r="20" className={`node ${isHighlighted('A') ? 'highlighted' : ''}`} />
        <circle cx="350" cy="150" r="20" className={`node ${isHighlighted('B') ? 'highlighted' : ''}`} />
        <circle cx="350" cy="250" r="20" className={`node ${isHighlighted('D') ? 'highlighted' : ''}`} />
        <circle cx="200" cy="350" r="20" className={`node ${isHighlighted('F') ? 'highlighted' : ''}`} />
        <circle cx="50"  cy="250" r="20" className={`node ${isHighlighted('E') ? 'highlighted' : ''}`} />
        <circle cx="50"  cy="150" r="20" className={`node ${isHighlighted('C') ? 'highlighted' : ''}`} />
        
        {/* Node Labels */}
        <text x="200" y="55"  textAnchor="middle" className="node-label">A</text>
        <text x="350" y="155" textAnchor="middle" className="node-label">B</text>
        <text x="350" y="255" textAnchor="middle" className="node-label">D</text>
        <text x="200" y="355" textAnchor="middle" className="node-label">F</text>
        <text x="50"  y="255" textAnchor="middle" className="node-label">E</text>
        <text x="50"  y="155" textAnchor="middle" className="node-label">C</text>
        
        {/* Edge Labels */}
        <text x="285" y="85"  textAnchor="middle" className="edge-label">5 min</text>
        <text x="115" y="85"  textAnchor="middle" className="edge-label">7 min</text>
        <text x="365" y="200" textAnchor="start"  className="edge-label">15 min</text>
        <text x="35"  y="200" textAnchor="end"    className="edge-label">35 min</text>
        <text x="285" y="315" textAnchor="middle" className="edge-label">20 min</text>
        <text x="115" y="315" textAnchor="middle" className="edge-label">10 min</text>
        <text x="200" y="170" textAnchor="middle" className="edge-label">20 min</text>
        <text x="200" y="230" textAnchor="middle" className="edge-label">5 min</text>
      </svg>
    </div>
  );
};

export default GraphVisualization;