import React from 'react';
import './PathfindingVisualizer.css';

export default function Node(props) {
  const {
    row,
    col,
    isStart,
    isFinish,
    isWall,
    isVisited,
    isShortestPath,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
  } = props;

  let className = 'node';

  if (isStart) {
    className += ' node-start';
  } else if (isFinish) {
    className += ' node-finish';
  } else if (isWall) {
    className += ' node-wall';
  } else if (isShortestPath) {
    className += ' node-shortest-path';
  } else if (isVisited) {
    className += ' node-visited';
  }

  return (
    <td
      id={`node-${row}-${col}`}
      className={className}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp(row, col)}
    ></td>
  );
}
