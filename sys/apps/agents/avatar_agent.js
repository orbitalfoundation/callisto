
// babylon import is needed purely for the math primitives
import "/sys/libs/babylon.js"

export default class Avatar {

	db = 0
	avatar = 0

	constructor(blob) {
		this.pool = blob ? blob.pool : 0
	}

	apply(args) {

		let nodes = this.db.queryFastByUuid(this.avatar.uuid)
		if(!nodes || !nodes.length) {
			console.warn("Avatar: not found")
			return
		}
		let node = nodes[0]
		let uuid = node.uuid
		let xyz = node.xyz
		let ypr = node.ypr

		// get user events and homogenously update orientation and translation

		let m = 0
		switch(args.key) {
			case 'a': ypr[1] -=0.1; break;
			case 'd': ypr[1] +=0.1; break;
			case 's': m = -0.1; break;
			case 'w': m = 0.1; break;
			case 't': m = 0.0001; break;
			default: return
		}

		// get current orientation as euler and use to estimate translation target
		let rot = BABYLON.Quaternion.FromEulerAngles(...ypr)
		let vec = new BABYLON.Vector3(0,0,m).rotateByQuaternionToRef(rot,BABYLON.Vector3.Zero())


		// translate as a function of direction
		xyz[0] += vec.x
		xyz[1] += vec.y
		xyz[2] += vec.z

		// write changes
		node.xyz = xyz
		node.ypr = ypr

		//node.dirty = node.updated = Date.now()
		this.db.write(node)

		let cameras = this.db.queryFastByUuid(node.camera)
		let camera = cameras.length ? cameras[0] : 0
		if(!camera) {
			console.warn("avatar: no camera")
		} else {

			// put camera behind translation target
			vec = new BABYLON.Vector3(0,2,-10).rotateByQuaternionToRef(rot,BABYLON.Vector3.Zero())
			vec.x += xyz[0]
			vec.y += xyz[1]
			vec.z += xyz[2]

			camera.xyz = [vec.x,vec.y,vec.z]
			camera.lookat = xyz
			//camera.dirty = camera.updated = Date.now()
			this.db.write(camera)
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////
	///
	/// resolve()
	///
	///////////////////////////////////////////////////////////////////////////////////////

	latch = 0

	async resolve(blob) {

console.log("avatar resolve called")

		// only handle the one command to setup the avatar
		if(this.latch) return
		this.latch = 1

		// client only
		if(typeof document === 'undefined') {
			let err = "avatar: should run on client not server"
			console.error(err)
			throw err
		}

		// must have db
		this.db = await this.pool.fetch({uuid:blob.dest})
		if(!this.db) {
			let err = "avatar: requires db"
			throw err
		}

		// must have avatar
		this.avatar = blob.data
		this.avatar.uuid += this.pool.uuid + "_network"

		// write avatar to db once
		await this.db.write(this.avatar)

		// bind controls and also a hack to force an initial update - also the vector is slightly different otherwise for arcrotatecamera only
		document.addEventListener("keydown",this.apply.bind(this))
		this.apply({key:"t"})

	}

}
