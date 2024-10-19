import { PriorityQueue } from "./PriorityQueue";

interface GraphNode {
  [key: string]: { [key: string]: number };
}

export class Graph {
  private graph: GraphNode;

  constructor() {
    this.graph = {};
  }

  addEdge(source: string, destination: string, time: number) {
    if (!this.graph[source]) this.graph[source] = {};
    if (!this.graph[destination]) this.graph[destination] = {};

    this.graph[source][destination] = time;
    this.graph[destination][source] = time;
  }

  shortestPath(start: string, end: string): { path: string[]; time: number } {
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const pq = new PriorityQueue<string>();

    // Initialize distances
    for (let vertex in this.graph) {
      if (vertex === start) {
        distances[vertex] = 0;
        pq.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        pq.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }

    while (!pq.isEmpty()) {
      const current = pq.dequeue()!.element;

      if (current === end) break;

      if (!this.graph[current]) continue;

      for (let neighbor in this.graph[current]) {
        const alt = distances[current] + this.graph[current][neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = current;
          pq.enqueue(neighbor, alt);
        }
      }
    }

    // Reconstruct path
    const path: string[] = [];
    let current: string | null = end;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    return { path, time: distances[end] };
  }
}

export const createGraphFromImage = (): Graph => {
  const graph = new Graph();
  graph.addEdge("A", "B", 5);
  graph.addEdge("A", "C", 7);
  graph.addEdge("B", "D", 15);
  graph.addEdge("B", "A", 5);
  graph.addEdge("B", "E", 20);
  graph.addEdge("C", "D", 5);
  graph.addEdge("C", "A", 7);
  graph.addEdge("C", "E", 35);
  graph.addEdge("D", "F", 20);
  graph.addEdge("D", "B", 15);
  graph.addEdge("D", "C", 5);
  graph.addEdge("E", "F", 10);
  graph.addEdge("E", "C", 35);
  graph.addEdge("E", "B", 20);
  graph.addEdge("F", "D", 20);
  graph.addEdge("F", "E", 10);
  return graph;
};
