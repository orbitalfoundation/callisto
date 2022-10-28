
/// OBSOLETE
///
/// View is performing several roles:
///
/// + It "pretends" to be a rust/wasm service that is only accessible over a socket or message channel - ie: an asynchronous arms length relationship.
///
/// + It receives commands or requests with a 'fragment' of a scene graph - this will be painted or updated persistently to a display. This is the key role.
///
/// + The design intent is that important events such as mouse movement or touch events can be piped back to a caller if they specify an event return channel.
///
/// + If this is written well, it should be swappable for a native rust/wasm or other rasterizer and event handler.
///
/// + Right now it is a singleton; this is subject to revision
///
///	+ I render to electron for fun and profit - basically it pretends to be a feature rich rasterization layer
///


const path = require('path')
const { app, BrowserWindow, contextBridge, ipcMain, ipcRenderer } = require( 'electron' );
let electron = 0

export default class View {

	constructor(command) {
		// all services in general get a back channel as a way to pass messages to other services
		this.poolchannel = command ? command.poolchannel : null
		this.nodes = []
		this.uuid = 0
		this.scene = 0
	}

	async channel(command) {
		let c = command && command.command ? command.command : "fragment"
		switch(c) {
			case "fragment":
				await this.electron_start();
				// TODO - this isn't really very flexible; it's requiring a fragment to be passed once only
				this.grant_uuids(command.fragment)
				// make fragment hierarchy
				this.fragment_recurse(command.fragment)
				// memorize for now = TODO we need to track this more flexibly to allow more than once
				this.scene = command.fragment
			default:
				console.error("View: no valid command")
				console.error(command)
				break
		}
	}

	// TODO I think I want to force callers to grant uuids - not the system
	grant_uuids(fragment,parent=null) {
		if(!fragment.uuid) {
			fragment.uuid = ++this.uuid
		}
		fragment.parent_uuid = parent ? parent.uuid : 0
		if(fragment.children) {
			fragment.children.forEach((child)=>{
				this.grant_uuids(child,fragment)
			})
		}
	}


	async electron_start() {

		// stuff
		if(!electron) {

			await app.whenReady()

 			let preload = path.join(__dirname,'view_electron_bridge.js')
 			console.log("Loading preload at " + preload)

			electron = new BrowserWindow({
				width: 1200,
				height: 800,
				webPreferences: {
					preload:preload,
					nodeIntegration: true,
					contextIsolation: true,
				}
			})

			electron.webContents.openDevTools()

			// in general catch events coming back up here - see https://www.electronjs.org/docs/latest/api/ipc-main
			ipcMain.on('view-command-async', this.view_command_async.bind(this) );

			// load boilerplate
			await electron.loadFile( './public/index.html' )
		}

	}

	fragment_recurse(fragment) {

		if(!fragment || !fragment.uuid) {
			console.error("view: bad fragment")
			return
		}

		// don't pass the children portion of the graph
		let children = fragment.children
		delete fragment.children

		// pass to renderer
		let args = JSON.stringify(fragment)
		electron.webContents.executeJavaScript(`babylon_mirror(${args})`)

		// visit children
		if(children) {
			children.forEach(child=>{
				this.fragment_recurse(child)
			})
		}

		// allow the children to return to the fragment for general reference
		fragment.children = children

		// remember fragments here also
		this.nodes[fragment.uuid]=fragment
	}

	view_command_async(event,args) {

		console.log("got event")
		console.log(args)

		console.log(this.scene)

		this.scene.channel()

		// - find the best target if any
		// - else send to scene

/*

handle view related events only

- events could be piped up to flo
	to accomplish that then flo would have to understand the view grammar, which seems wrong
	so i think as a compromise it is best if the view layer understands the scripting and handles stuff

- events could be handled here
	it does mean losing some generality, now events are not really chewed up by flo
	at the same time, it does mean that flo doesn't need to be as smart arguably

- a third approach would be to register channel handlers, but then somebody has to handle it - a new flo thread?



*/


	}

}


