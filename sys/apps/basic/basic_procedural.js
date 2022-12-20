

/*

This is a procedural way to define a simple multiplayer demo showing off basic scripting in typical scenarios.

Generally the flow is something like this:

	1) I get a handle on a shared database; the database is a singleton but returns me a 'context' which is helpful later on.

	2) I also get a handle on a view - the view is also a singleton; the idea being that AR apps all paint to the same display.

	3) I route all the database traffic (that my context sees) to the view to paint a pretty display.

	4) Then make a long sockets style network connection to an upstream server as a client.

	5) I go ahead and route all any traffic coming from the network directly to my database.

	6) Then I also go ahead and route all locally created traffic to the network.

	7) Finally I push some starting state to the database...

	8) And I also add an avatar that I can drive around as a standalone service

It's worth noting that there is some hidden logic in the networking layer that explicitly prevents loopbacks - like so:

	1) Any state that arrives from the network is marked up as being of network based origin

	2) The database typically (and blindly) echoes any state changes back to the network ...

	3) But the network notices the marked up flag and avoids re-echoing it back to the server

	4) It would be more elegant to stop the loopback earlier - you can build more fine-grained routes handlers if you wish

The server side also has a similar loopback prevention mechanic:

	1) Traffic coming from any given socket is marked up with that socket id

	2) Traffic headed back out is typically not echoed to a socket that the data arrived from

	3) While there are some cases where we may want to re-echo changes back to socket; by default this is not supported

To improve:

	- i could detect the connection and then do something intelligent...
	- it might make sense to have a lightweight message bus like that...

*/

import { myscene, myavatar } from './basic_sdl.js'

export default class MyBasicApp {

	constructor(blob) {

		this.uuid = blob.uuid ? blob.uuid : "local"
		console.log("Basic demo app starting with uuid="+this.uuid)

		// remember pool
		this.pool = blob.pool

		this.init()
	}

	async init() {

		// adjust the uuid for the avatar so that it is unique over network
		let avatar_uuid = myavatar.uuid += this.pool.uuid

		// make a channel to a local db that is shared between users
		let db = await this.pool.fetch({urn:'*:/sys/services/db'})

		// make a channel to a local view that is shared between users
		let view = await this.pool.fetch({urn:"*:/sys/services/view/view"})

		// forward all of our own database writes to the view
		db.route(view)

		// make a network traffic channel
		let net = await this.pool.fetch({urn:"*:/sys/services/netclient"})

		// traffic from network is sent to local db
		net.route(db)

		// traffic from local db is sent to network; there is some loopback prevention in the net logic
		db.route(net)

		// push some starting state to the database by hand
		await db.write(myscene)

		// make a local avatar controller
		this.pool.fetch({
			urn:"*:/sys/apps/agents/avatar_agent",
			uuid: "/myusername/apps/basic001/my_agent",
			dest:"/myusername/apps/basic001/mydb",
			command:"route",
			data: myavatar,
		},

		// ask the server db to publish a fresh copy of all state back to us
		net.resolve({urn:"*:/sys/services/db",command:"sync"})
	}

}
