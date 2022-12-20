

import { myscene, myavatar } from './carworld_sdl.js'

export default class MyApp {

	constructor(args) {
		this.init(args)
	}

	async init(args) {

		let pool = this.pool = args.pool

		let db = this.db = await pool.resolve({urn:'*:/sys/services/db',uuid:"/myusername/apps/basic001/mydb"})

		let view = this.view = await pool.resolve({urn:"*:/sys/services/view/view"})

		db.route(view)

		let net = await this.pool.resolve({urn:"*:/sys/services/netclient"})

		net.route(db)

		db.route(net)

		db.write(myscene)

		await this.pool.resolve({
			urn:"*:/sys/apps/agents/avatar_agent",
			uuid: "/myusername/apps/basic001/my_agent",
			dest:"/myusername/apps/basic001/mydb",
			command:"route",
			data: myavatar,
		})

		net.resolve({urn:"*:/sys/services/db",command:"sync"})
	}

}


