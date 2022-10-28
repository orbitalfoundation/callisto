
import http from 'http'
import express from 'express'

import path from 'path';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

export default class Http {

	constructor(args) {

		// peel out a few useful args
		if(args) {
			this.uid = args.uid
			this.uuid = args.uuid
			this.urn = args.urn
			this._pool = args._pool
			this.resources = args.resources || 0
			this.port = args.port || 8080
			console.log("HTTP: system uuid is: " + this.uuid + " with resources at: " + this.resources )
		}

		this._initialize()
	}

	_initialize() {
		if(this.app) return

		// start expressjs
		this.app = express()
		this.http = http.createServer(this.app)

		// json
		this.app.use(express.json())

		// serve the entire orbital folder as the root of http
		if(typeof process !== 'undefined') {
			let orbital_resources = process.cwd()
			this.app.use(express.static(orbital_resources))
			console.log("HTTP: serving orbital resources under path = " + orbital_resources)
		}

		// serve a local folder for secondary resources - these get clobbered by other paths above
		if(this.resources) {
			let web_resources = dirname(fileURLToPath(this.resources)) + "/public";
			this.app.use(express.static(web_resources))
			console.log("HTTP: serving clobberable web specific resources at path = " + web_resources )
		}

		// always serve this file as the index by default (actually this does not have to be explicitly set)
		//app.get('/', (req, res) => { res.sendFile(app_files + '/index.html') })

		// catch other unresolved paths
		this.app.use(function(err, req, res, next) {
			console.log("http: cannot find file!")
			console.error(err)
			next(err)
		})
	}

	runforever() {
		// run forever
		console.log("HTTP: running http server on port " + this.port)
		this.http.listen(this.port,"localhost")
	}

	async resolve(args) {}
}

