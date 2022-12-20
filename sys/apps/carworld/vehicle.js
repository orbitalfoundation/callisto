
import Nav from '/sys/services/view/nav.js'

let nav = new Nav([

	// left road bottom to top
	{ xyz:[  0,  0,   -5], uuid: "1000", c: ["1010"] },
	{ xyz:[  0,  0,  -15], uuid: "1010", c: ["1020"] },
	{ xyz:[  0,  0,  -35], uuid: "1020", c: ["1030"] },
	{ xyz:[  0,  0,  -55], uuid: "1030", c: ["1040"] },
	{ xyz:[  0,  0,  -60], uuid: "1040", c: ["1050"] },
	{ xyz:[  0,  0,  -70], uuid: "1050", c: ["1060","3000"] },
	{ xyz:[  0,  0,  -75], uuid: "1060", c: ["1070"] },
	{ xyz:[  0,  0,  -80], uuid: "1070", c: ["1080"] },
	{ xyz:[  0,  0,  -90], uuid: "1080", c: ["1090"] },
	{ xyz:[  0,  0, -100], uuid: "1090", c: ["1100"] },
	{ xyz:[  0,  0, -110], uuid: "1100", c: ["5000"] },

	// bottom from right to left
	{ xyz:[-10,  0,   -5], uuid: "4000", c: ["1000"] },
	{ xyz:[-30,  0,   -5], uuid: "4010", c: ["4000"] },
	{ xyz:[-50,  0,   -5], uuid: "4020", c: ["4010"] },
	{ xyz:[-55,  0,   -5], uuid: "4030", c: ["4020"] },

	// top road from left to right
	{ xyz:[-10,  0, -110], uuid: "5000", c: ["5010"] },
	{ xyz:[-25,  0, -110], uuid: "5010", c: ["5020"] },
	{ xyz:[-45,  0, -110], uuid: "5020", c: ["5030"] },
	{ xyz:[-55,  0, -110], uuid: "5030", c: ["2100"] },

	// middle road from left to right
	{ xyz:[-10,  0,  -70], uuid: "3000", c: ["3010"] },
	{ xyz:[-25,  0,  -70], uuid: "3010", c: ["3020"] },
	{ xyz:[-45,  0,  -70], uuid: "3020", c: ["3030"] },
	{ xyz:[-55,  0,  -70], uuid: "3030", c: ["2050"] },

	// middle road from right to left
	{ xyz:[-10,  0,  -75], uuid: "6000", c: ["1060"] },
	{ xyz:[-25,  0,  -75], uuid: "6010", c: ["6000"] },
	{ xyz:[-45,  0,  -75], uuid: "6020", c: ["6010"] },
	{ xyz:[-55,  0,  -75], uuid: "6030", c: ["6020"] },

	// right road top to bottom
	{ xyz:[-65,  0,   -5], uuid: "2000", c: ["4030"] },
	{ xyz:[-65,  0,  -15], uuid: "2010", c: ["2000"] },
	{ xyz:[-65,  0,  -35], uuid: "2020", c: ["2010"] },
	{ xyz:[-65,  0,  -55], uuid: "2030", c: ["2020"] },
	{ xyz:[-65,  0,  -60], uuid: "2040", c: ["2030"] },
	{ xyz:[-65,  0,  -70], uuid: "2050", c: ["2040"] },
	{ xyz:[-65,  0,  -75], uuid: "2060", c: ["2050","6030"] },
	{ xyz:[-65,  0,  -80], uuid: "2070", c: ["2060"] },
	{ xyz:[-65,  0,  -90], uuid: "2080", c: ["2070"] },
	{ xyz:[-65,  0, -100], uuid: "2090", c: ["2080"] },
	{ xyz:[-65,  0, -110], uuid: "2100", c: ["2090"] },
])

export default class Vehicle {

	constructor(blob) {
		this.pool = blob.pool
		setInterval(this.update.bind(this),10)
	}

	route(route) {
		console.log("vehicle: got route")
		console.log(route)
	}

	async update() {

		// must have db
		if(!this.db) {
			this.db = await this.pool.resolve({urn:'*:/sys/services/db',uuid:"/myusername/apps/basic001/mydb"})
			if(!this.db) {
				console.warn("no db")
				return
			}
		}

		let nodes = this.db.queryFastByHash({collide:1000})
		if(!nodes.length) {
			console.warn("no vehicles")
			return
		}

		nodes.forEach( node => {
			if(this.solve_one(this.db,node)) {
				this.db.write(node)
			}
		})
	}

	collide(db,uuid,xyz,size=2) {
		// move collision system down to be a core service - todo
		// db could memoize these queries
		// todo there are vastly more elegant spatial hashes than this

		if(!this.colliders) {
			this.colliders = db.queryFastByHash({collide: 1000})
			//console.log("car: got colliders " + this.colliders.length)
		}
		if(!this.colliders) return

		for(let c of this.colliders) {
			if(c.uuid == uuid) continue

			if(c.xyz[0] + size > xyz[0] )
			if(c.xyz[0] - size < xyz[0] )
			if(c.xyz[2] + size > xyz[2] )
			if(c.xyz[2] - size < xyz[2] )
				return true

			//let dist = [ n.xyz[0]+step[0]-c.xyz[0], n.xyz[1]+step[1]-c.xyz[1], n.xyz[2]+step[2]-c.xyz[2] ]
			//if( dist[0]*dist[0] + dist[1]*dist[1] + dist[2]*dist[2] < 25 ) return true
		}

		return false
	}

	solve_one(db,node) {

		// initialize car?
		if(!node.nav_current) {
			for(let c = 0; c < 16; c++) {
				node.nav_current = nav.get_random_item()
				node.xyz = node.nav_current.xyz.slice()
				node.dirty = Date.now()
				node.nav_route = []
				if(!this.collide(db,node.uuid,node.xyz,5) ) break
				else console.log("car: collided on startup - trying again")
			}
		}

		// pick a new goal if no goal list
		if(!node.nav_route || node.nav_route.length < 1) {
			let item = nav.get_random_item()
			let route = nav.get_shortest_path(node.nav_current.uuid,item.uuid)
			if(route && route.path.length > 1) {
				let temp = route.path.slice()
				temp.shift()
	 			node.nav_route = temp
				//console.log("car is going to " + item.uuid," via route ", ...(node.nav_route) )
			}
 		}

		// make sure there are goals
		if(!node.nav_route || node.nav_route.length < 1) {
			//console.warn("car has no goals atm")
			return false
		}

		// get goal
		let target = nav.get_path( node.nav_route[0] )
		if(!target) return false

		// get a vector that faces target
		let dir = [ target.xyz[0]-node.nav_current.xyz[0],
					target.xyz[1]-node.nav_current.xyz[1],
					target.xyz[2]-node.nav_current.xyz[2],
					]

		// get distance
		let dist = [ (target.xyz[0]-node.xyz[0]),
					(target.xyz[1]-node.xyz[1]),
					(target.xyz[2]-node.xyz[2]) ]

		// get amount to move - linear for now
		let step = [ Math.sign(dir[0])/2.5, 0, Math.sign(dir[2])/2.5 ]

		// avoid collisions - simply don't move for now - later could have softer collision system
		if( this.collide(db, node.uuid, [ node.xyz[0]+step[0], node.xyz[1]+step[1], node.xyz[2]+step[2] ], 4 )) {
			if(!node.honked) {
//				audio.play()
				node.honked = 1
			}
			return false
		}
		node.honked = 0

		// move
		node.xyz[0] += step[0]
		node.xyz[1] += step[1]
		node.xyz[2] += step[2]

		// orient
		let v = new BABYLON.Vector3(dir[0],dir[1],dir[2])
		v.normalize()
		node.ypr[1] = Math.atan2(v.x,v.z)

		// mark for update
		node.updated = node.dirty = Date.now()

		// be at target if close to target
		if( dist[0]*dist[0]+dist[1]*dist[1]+dist[2]*dist[2] < 1) {
			node.nav_route.shift()
			node.nav_current = target
		}

		return true
	}
}


