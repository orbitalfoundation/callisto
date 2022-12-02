

// babylon import is needed purely for the math primitives
import "/sys/libs/babylon.js"

export default class Avatar {

	constructor(db) {
		this.db = db
		this.nodes = 0
		document.addEventListener("keydown",this.apply.bind(this) )
	}

	update(db,nodes) {
		this.nodes = nodes
	}

	apply(args) {
		if(!this.nodes) return
		this.nodes.forEach( node => { this.one(args,node) } )
	}

	one(args,node) {

		let uuid = node.uuid
		let xyz = node.xyz
		let ypr = node.ypr

		// get user events and homogenously update orientation and translation

		let m = 0
		switch(args.key) {
			case 'a': ypr[1] -=0.1; break;
			case 'd': ypr[1] +=0.1; break;
			case 's': m = 0.1; break;
			case 'w': m = -0.1; break;
		}

		// get current orientation as euler and use to estimate translation target
		let rot = BABYLON.Quaternion.FromEulerAngles(...ypr)
		let vec = new BABYLON.Vector3(0,0,m).rotateByQuaternionToRef(rot,BABYLON.Vector3.Zero())

		// translate as a function of direction
		if(m) {
			xyz[0] += vec.x
			xyz[1] += vec.y
			xyz[2] += vec.z
		}

		// put camera behind translation target
		vec = new BABYLON.Vector3(0,0,5).rotateByQuaternionToRef(rot,BABYLON.Vector3.Zero())
		vec.x += xyz[0]
		vec.y += xyz[1] + 2
		vec.z += xyz[2]

		// todo examine:
		// in some senses the raw data was simply to populate the database ... arguably we should fetch state from there?
		// it is convenient however in the pre-amble to write to local transient state...

		node.xyz = xyz
		node.ypr = ypr
		node.dirty = node.updated = Date.now()

		let cameras = this.db.queryFastByUuid(node.camera)
		let camera = cameras.length ? cameras[0] : 0
		if(camera) {
			camera.xyz = [vec.x,vec.y,vec.z]
			camera.lookat = xyz
			camera.dirty = camera.updated = Date.now()
		}
	}
}
