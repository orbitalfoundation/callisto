
//////////////////////////////////////////////////////////////

const dijkstra = (startNode, stopNode) => {
	const distances = new Map()
	const previous = new Map()
	const remaining = createPriorityQueue(n => distances.get(n));
	for (let node of adjacencyList.keys()) {
		distances.set(node, Number.MAX_VALUE);
		remaining.insert(node);
	}
	distances.set(startNode, 0);
	while (!remaining.isEmpty()) {
		const n = remaining.extractMin();
		for (let neighbour of adjacencyList.get(n)) {
			const newPathLength = distances.get(n) + edgeWeights.get(n).get(neighbour);
			const oldPathLength = distances.get(neighbour);
			if (newPathLength < oldPathLength) {
				distances.set(neighbour, newPathLength);
				previous.set(neighbour, n);
			}
		}
	}
	return { distance: distances.get(stopNode), path: previous };
}

const shortestDistanceNode = (distances, visited) => {
	let shortest = null;

	for (let node in distances) {
		let currentIsShortest =
			shortest === null || distances[node] < distances[shortest];
		if (currentIsShortest && !visited.includes(node)) {
			shortest = node;
		}
	}
	return shortest;
};

const findShortestPath = (graph, startNode, endNode) => {
	// establish object for recording distances from the start node
	let distances = {};
	distances[endNode] = "Infinity";
	distances = Object.assign(distances, graph[startNode]);

	// track paths
	let parents = { endNode: null };
	for (let child in graph[startNode]) {
		parents[child] = startNode;
	}

	// track nodes that have already been visited
	let visited = [];

	// find the nearest node
	let node = shortestDistanceNode(distances, visited);

	// for that node
	while (node) {
		// find its distance from the start node & its child nodes
		let distance = distances[node];
		let children = graph[node];
		// for each of those child nodes
		for (let child in children) {
			// make sure each child node is not the start node
			if (String(child) === String(startNode)) {
				continue;
			} else {
				// save the distance from the start node to the child node
				let newdistance = distance + children[child];
				// if there's no recorded distance from the start node to the child node in the distances object
				// or if the recorded distance is shorter than the previously stored distance from the start node to the child node
				// save the distance to the object
				// record the path
				if (!distances[child] || distances[child] > newdistance) {
					distances[child] = newdistance;
					parents[child] = node;
				}
			}
		}
		// move the node to the visited set
		visited.push(node);
		// move to the nearest neighbor node
		node = shortestDistanceNode(distances, visited);
	}

	// using the stored paths from start node to end node
	// record the shortest path
	let shortestPath = [endNode];
	let parent = parents[endNode];
	while (parent) {
		shortestPath.push(parent);
		parent = parents[parent];
	}
	shortestPath.reverse();

	// return the shortest path from start node to end node & its distance
	let results = {
		distance: distances[endNode],
		path: shortestPath,
	};

	return results;
};

export default class Nav {

	constructor(pathways) {
		this.pathways = pathways
		this.pathways_indexed = {}
		pathways.forEach(path => {
			path.xyz[0]-=2.5
			path.xyz[2]-=2.5
			this.pathways_indexed[path.uuid] = path
		})
		this.pathways_graph = {}
		pathways.forEach(path => {
			let routes = {}
			path.c.forEach(c=>{ routes[c] = 1 })
			this.pathways_graph[path.uuid] = routes
		})
	}

	get_path(a) {
		return this.pathways_indexed[a]
	}

	get_random_item() {
		return this.pathways[Math.floor(Math.random()*this.pathways.length)]	
	}

	get_shortest_path(a,b) {
		return findShortestPath(this.pathways_graph,a,b)	
	}
}
