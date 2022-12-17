
export default class Boid {

	update(db) {
		let nodes = db.queryFastByHash({mobile:true})
		nodes.forEach( node => { this.solve_one(db,node)})
	}

	solve_one(db,node) {

		if(!node.xyz) {
			let x = Math.random()*5-10
			let y = Math.random()*5-10
			let z = Math.random()*5-10
			node.xyz = [x,y,z]			
		}

		if(!node.target) {
			let x = Math.random()*5-10
			let y = Math.random()*5-10
			let z = Math.random()*5-10
			node.target = {xyz:[x,y,z]}
		}

		let target = node.target

		// get a vector that faces target
		let dir = [ target.xyz[0]-node.xyz[0],
					target.xyz[1]-node.xyz[1],
					target.xyz[2]-node.xyz[2],
					]

		// get distance
		let dist = [ (target.xyz[0]-node.xyz[0]),
					(target.xyz[1]-node.xyz[1]),
					(target.xyz[2]-node.xyz[2]) ]

		// get amount to move - linear for now
		let step = [ Math.sign(dir[0])/2.5, 0, Math.sign(dir[2])/2.5 ]

		// move
		node.xyz[0] += step[0]
		node.xyz[1] += step[1]
		node.xyz[2] += step[2]

		// orient
		//let v = new BABYLON.Vector3(dir[0],dir[1],dir[2])
		//v.normalize()
		//node.ypr[1] = Math.atan2(v.x,v.z)

		// mark for update
		node.dirty = Date.now()
	}
}
