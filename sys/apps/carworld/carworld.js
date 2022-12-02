
// entities describing the initial scene with associated ecs handlers - these are datestamped as 0 for the db

import mydata from './mydata.js'

// an applicaton or orbital 'service' that does some work - in this case a car simulation scenario

export default class MyApp {

	constructor(args) {
		this.init(args)
	}

	async init(args) {

		// remember pool
		let pool = this.pool = args._pool

		// This is a pretend location for the namespace of the particular "room" a set of participants are in.
		this.domain = "sharespace001.someuniquedomain.com:"

		// get db
		let db = this.db = await pool.load({urn:'*:/sys/services/db'})

		// get view
		let view = this.view = await pool.load({urn:"*:/sys/services/view/view"})

		// echo db traffic to view
		// todo nov 15 2022 -> note it may make sense to register 'viewable' as a handler with db rather than loading view here
		// in the that model the data itself says it needs to render to a view
		// some thought is needed re server side handlers versus client side
		db.route(view)

		// synchronize to server state; basically ask database to publish fresh copy of all state
		// todo - i would like the db to automatically do this when it gets a view route above
		// db.synchronize()

		// push local initial state to db (these objects may be superceded based on datestamps)
		// note that this data itself could be loaded by the db rather than here - todo
		db.merge(mydata,true,this.domain)
	}
}

