
import http from 'http'
import express from 'express'

import path from 'path';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

export default class Http {

	constructor(blob) {

		// peel out a few useful args
		if(blob) {
			this.uid = blob.uid
			this.uuid = blob.uuid
			this.urn = blob.urn
			this.pool = blob.pool
			let a = blob.blob
			this.resources = a ? a.resources : []
			this.port = a ? a.port : 8080
			console.log("HTTP: system uuid is: " + this.uuid + " with resources at: " + this.resources )
		}

		this._initialize()
	}

	getHttpServer() {
		return this.http
	}

	_initialize() {

		// start expressjs
		this.app = express()
		this.http = http.createServer(this.app)

		// always use json
		this.app.use(express.json())

		// serve desired folders

		for(let r of this.resources) {

			if(r.startsWith("file://")) {
				r = dirname(fileURLToPath(this.resources))
			}

			this.app.use(express.static(r))
		}

		// always serve this file as the index by default (actually this does not have to be explicitly set)
		//app.get('/', (req, res) => { res.sendFile(app_files + '/index.html') })

		// catch other unresolved paths ... appears that this can be added first
		this.app.use(function(err, req, res, next) {
			console.error("http: cannot find resource ",req)
			console.error(err)
			next(err)
		})

		this.start()
	}

	async start() {
		console.log("HTTP: running http server on port " + this.port)
		this.http.listen(this.port)
	}

	///
	/// route()
	///
	/// http routes are a bit different from usual, they require a channel (an object with a .resolve method) and a url to attach to
	///

	route(route=null,path=null) {
		if(!route || !path) {
			let err = "http: must specify a filter"
			console.error(err)
			throw err
		}

		if(typeof route === 'object' && route.resolve) {
			route = route.resolve.bind(route)
		} else if(typeof route === 'function') {
			// fine
		} else {
			let err = "http: bad route"
			console.error(err)
			throw err
		}

		this.app.post(path, async (req,res) => {
			try {
				let json = await route(req.body)
				res.json(json)
			} catch(err) {
				console.error(err)
				return res.json({err})
			}
		})
	}

	async resolve(command) {
		// this service doesn't do anything with traffic directly sent to it yet 
	}
}

