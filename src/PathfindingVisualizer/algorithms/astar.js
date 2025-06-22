export function astar(grid, startNode, finishNode) {
    const openSet = [];
    startNode.distance = 0;
    startNode.heuristic = manhattanDistance(startNode, finishNode);
    openSet.push(startNode);
  
    while (openSet.length > 0) {
      openSet.sort((a, b) => (a.distance + a.heuristic) - (b.distance + b.heuristic));
      const current = openSet.shift();
  
      if (current.isWall) continue;
      if (current.isVisited) continue;
      current.isVisited = true;
  
      if (current === finishNode) return;
  
      const neighbors = getUnvisitedNeighbors(current, grid);
      for (const neighbor of neighbors) {
        const tentativeG = current.distance + 1;
        if (tentativeG < neighbor.distance) {
          neighbor.distance = tentativeG;
          neighbor.heuristic = manhattanDistance(neighbor, finishNode);
          neighbor.previousNode = current;
          openSet.push(neighbor);
        }
      }
    }
  }
  
  function manhattanDistance(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(n => !n.isVisited);
  }
  