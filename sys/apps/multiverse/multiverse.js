
import { myscene, myavatar } from './multiverse_sdl.js'

export default class MyApp {

	constructor(args) {
		this.init(args)
	}

	async init(args) {

		// remember pool
		let pool = this.pool = args.pool

		// get db
		let db = this.db = await pool.resolve({urn:'*:/sys/services/db',uuid:"/myusername/apps/basic001/mydb"})

		// get view
		let view = this.view = await pool.resolve({urn:"*:/sys/services/view/view"})

		// echo db traffic to view; a key design feature of orbital is to dynamically bind services together
		db.route(view)

		// write scene
		db.write(myscene)

		// make a local avatar controller
		let avatar = await this.pool.resolve({
			urn:"*:/sys/apps/agents/avatar_agent",
			uuid: "/myusername/apps/basic001/my_agent",
			dest:"/myusername/apps/basic001/mydb",
			command:"route",
			data: myavatar,
		})
	}

}
