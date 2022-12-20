
import { myscene } from './zonepicker_sdl.js'

import "/sys/libs/babylon.js"

export default class MyApp {

	constructor(args) {
		this.init(args)
	}

	async init(args) {

		this.planet = myscene.children[3]

		// remember pool
		let pool = this.pool = args.pool

		// get db
		let db = this.db = await pool.resolve({urn:'*:/sys/services/db'})

		// get view
		let view = this.view = await pool.resolve({urn:"*:/sys/services/view/view"})

		// echo db traffic to view; a key design feature of orbital is to dynamically bind services together
		db.route(view)

		// publish scene
		db.write(myscene)

		// get view events
		this.view.route(this)

		// rotate camera
		setInterval(this.rotator.bind(this),100)
	}

	resolve(e) {
		console.log(e)
		if(e.event == "pick") {
			console.log("picking " + e.fragment.uuid)
			if(e.fragment.urn && e.fragment.kind == "sphere") {
				// for now move entire system over - later just load the app
				location.href = "/sys/apps/venice"
			} else if(e.fragment.kind == "sphere") {
				alert(`${e.fragment.id} does not resolve yet`)
			}
		}
	}


	rotator() {

		this.planet.ypr[1] += 0.003
		this.planet.updated = Date.now()
		this.db.write(this.planet)

		/*
		let camera = mylayout[1]

		camera.rot = camera.rot + 0.1
		let rot = BABYLON.Quaternion.FromEulerAngles(0,0,camera.rot)
		let vec = new BABYLON.Vector3(3,0,3).rotateByQuaternionToRef(rot,BABYLON.Vector3.Zero())
		camera.xyz = [vec.x,vec.y,vec.z]
		camera.updated = Date.now()
		this.db.merge(camera,true,this.domain)
		*/
	}


}
