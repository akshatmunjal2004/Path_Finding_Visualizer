import React, { Component } from 'react';
import Node from './Node';
import { dijkstra } from './algorithms/dijkstra';
import { dfs } from './algorithms/dfs';
import { bfs } from './algorithms/bfs';
import { astar } from './algorithms/astar';
import { Button } from '@mui/material';
import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      START_NODE_ROW: 5,
      FINISH_NODE_ROW: 20,
      START_NODE_COL: 5,
      FINISH_NODE_COL: 25,
      mouseIsPressed: false,
      ROW_COUNT: 25,
      COLUMN_COUNT: 35,
      isRunning: false,
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < this.state.ROW_COUNT; row++) {
      const currentRow = [];
      for (let col = 0; col < this.state.COLUMN_COUNT; col++) {
        currentRow.push(this.createNode(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL,
      isFinish: row === this.state.FINISH_NODE_ROW && col === this.state.FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      isShortestPath: false,
    };
  };

  handleMouseDown(row, col) {
    if (this.state.isRunning) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed || this.state.isRunning) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  clearGrid() {
    const { START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL } = this.state;

    const newGrid = this.state.grid.map((row, rowIdx) =>
      row.map((node, colIdx) => {
        const isStart = rowIdx === START_NODE_ROW && colIdx === START_NODE_COL;
        const isFinish = rowIdx === FINISH_NODE_ROW && colIdx === FINISH_NODE_COL;

        return {
          ...node,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          isWall: false,
          isStart,
          isFinish,
        };
      })
    );

    this.setState({ grid: newGrid });

    document.querySelectorAll('.node').forEach(cell => {
      const id = cell.id;
      if (id.includes('node-')) {
        if (cell.classList.contains('node-start') || cell.classList.contains('node-finish')) return;
        cell.className = 'node';
      }
    });
  }

  clearWalls() {
    const newGrid = this.state.grid.map(row =>
      row.map(node => ({
        ...node,
        isWall: false,
      }))
    );
    this.setState({ grid: newGrid });

    document.querySelectorAll('.node-wall').forEach(cell => {
      cell.classList.remove('node-wall');
      cell.classList.add('node');
    });
  }

  resetVisitedPath() {
    const newGrid = this.state.grid.map(row =>
      row.map(node => {
        return {
          ...node,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          isShortestPath: false,
        };
      })
    );
    this.setState({ grid: newGrid });

    document.querySelectorAll('.node').forEach(cell => {
      if (!cell.classList.contains('node-wall') &&
          !cell.classList.contains('node-start') &&
          !cell.classList.contains('node-finish')) {
        cell.className = 'node';
      }
    });
  }

  visualize(algo) {
    if (this.state.isRunning) return;
    this.resetVisitedPath();
    this.setState({ isRunning: true });

    const { grid, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    let visitedNodesInOrder = [];

    switch (algo) {
      case 'Dijkstra':
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        break;
      case 'BFS':
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
        break;
      case 'DFS':
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
        break;
      case 'AStar':
        astar(grid, startNode, finishNode);
        visitedNodesInOrder = getAllVisitedNodes(grid);
        break;
      default:
        visitedNodesInOrder = [];
    }

    const pathNodes = getNodesInShortestPathOrder(finishNode);
    this.animate(visitedNodesInOrder, pathNodes);
  }

  animate(visited, path) {
    for (let i = 0; i <= visited.length; i++) {
      if (i === visited.length) {
        setTimeout(() => this.animateShortestPath(path), 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visited[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited futuristic-wave';
        }
      }, 10 * i);
    }
  }

  animateShortestPath(path) {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const node = path[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
        }
        if (i === path.length - 1) {
          this.setState({ isRunning: false });
        }
      }, 50 * i);
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <div className="visualizer-container">
        <h2 className="title">PathFinding Visualizer</h2>
        <div className="controls">
          <Button variant="contained" onClick={() => this.visualize('Dijkstra')}>Dijkstra</Button>
          <Button variant="contained" onClick={() => this.visualize('BFS')}>BFS</Button>
          <Button variant="contained" onClick={() => this.visualize('DFS')}>DFS</Button>
          <Button variant="contained" onClick={() => this.visualize('AStar')}>A*</Button>
          <Button variant="contained" color="secondary" onClick={() => this.clearGrid()}>Clear Grid</Button>
          <Button variant="contained" color="secondary" onClick={() => this.clearWalls()}>Clear Walls</Button>
        </div>
        <div className="grid-wrapper">
          <table className="grid">
            <tbody>
              {grid.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((node, nodeIdx) => (
                    <Node
                      key={nodeIdx}
                      col={node.col}
                      row={node.row}
                      isFinish={node.isFinish}
                      isStart={node.isStart}
                      isWall={node.isWall}
                      isVisited={node.isVisited}
                      isShortestPath={node.isShortestPath}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={() => this.handleMouseDown(node.row, node.col)}
                      onMouseEnter={() => this.handleMouseEnter(node.row, node.col)}
                      onMouseUp={() => this.handleMouseUp()}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = { ...node, isWall: !node.isWall };
  newGrid[row][col] = newNode;
  return newGrid;
};

function getNodesInShortestPathOrder(finishNode) {
  const path = [];
  let current = finishNode;
  while (current !== null) {
    path.unshift(current);
    current = current.previousNode;
  }
  return path;
}

function getAllVisitedNodes(grid) {
  const visited = [];
  for (const row of grid) {
    for (const node of row) {
      if (node.isVisited) visited.push(node);
    }
  }
  return visited;
}
