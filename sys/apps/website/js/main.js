

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///
/// creation helper
///

class OrbitalCreateForm extends HTMLElement {

	constructor() {
		super()
		this.paint()
	}

	paint(item) {
		this.innerHTML = `

				<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				  <div class="modal-dialog">
				    <div class="modal-content">
				      <div class="modal-header">
				        <h1 class="modal-title fs-5" id="exampleModalLabel">Please enter a name for your new zone</h1>
				        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				      </div>

				      <div class="modal-body">

						<form>
						  <div class="mb-3">
						    <label for="name" class="form-label">Name</label>
						    <input class="form-control" id="name" aria-describedby="namehelp">
						    <div id="namehelp" class="form-text">New zones must have unique names.</div>
						  </div>
						  <div class="mb-3">
						    <label for="description" class="form-label">Description</label>
						    <input class="form-control" id="description">
						  </div>
						  <div class="mb-3 form-check">
						    <input type="checkbox" class="form-check-input" id="exampleCheck1">
						    <label class="form-check-label" for="exampleCheck1">Mark as private</label>
						  </div>
						</form>

				      </div>
				      <div class="modal-footer">
				        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				        <button type="button" class="btn btn-primary">Save changes</button>
				      </div>
				    </div>
				  </div>
				</div>
			`
	}
}
customElements.define('orbital-create-form', OrbitalCreateForm )

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///
/// A programmatically generated header that does some simple login support and routing
/// An improvement would be to catch browser page transitions and bring up the right sub page given any url
/// Also cookies might be nice - but by avoiding cookies I avoid some of the GDPR stuff
///

class OrbitalHeaderElement extends HTMLElement {

	constructor() {
		super()
		this.paint()
	}

	paint() {
		this.innerHTML = `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a class="navbar-brand" href="https://orbital.foundation">Orbital Ecosystem</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">

            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            </ul>

			<ul class="navbar-nav">
                <li class="nav-item">
					<div class="input-group rounded col-xs-2">
					  <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
					</div>
                </li>
                &nbsp;
			</ul>

            <ul id="signin" class="navbar-nav mb-1 mb-lg-0">
                <li class="nav-item">
	                <a class="nav-link" href="#">Sign in</a>
                </li>
            </ul>

<!--
            <ul class="navbar-nav mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" href="https://docs.orbital.foundation">docs</a>
                </li>
                <li class="nav-item">
                    <a id="signin" class="nav-link" href="#">Signin</a>
                </li>
            </ul>
-->
            <ul id="menu" class="navbar-nav d-none">
                <li class="nav-item dropdown">
                    <a class="nav-link data-toggle" style="transform:scale(2.0)" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">☰</a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a id="create" class="dropdown-item" href="#">Create</a></li>
                        <li><a id="profile" class="dropdown-item" href="#">Profile</a></li>
                        <li><a id="settings" class="dropdown-item" href="#">Settings</a></li>
                        <li><a id="logout" class="dropdown-item" href="#">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>
<orbital-create-form></orbital-create-form>
`

		this.querySelector("#profile").onclick = this.profile.bind(this)
		this.querySelector("#settings").onclick = this.settings.bind(this)
		this.querySelector("#create").onclick = this.create.bind(this)
		this.querySelector("#logout").onclick = this.logout.bind(this)
		this.querySelector("#signin").onclick = this.signin.bind(this)

		/*
		this.items = {
			create:{active:false},
			profile:{active:false},
			settings:{active:false},
			logout:{active:false},
			signin:{active:true}
		}
		let menu = this.querySelector("#menu")
		for (const [name,props] of Object.entries(this.items)) {
			let node = document.createElement("span")
			node.id=name
			node.className = "menuitem"
			node.style=`margin-left:auto;margin-top:auto;display:${props.active==undefined||!props.active?"none":"block"};`
			node.innerHTML=name.charAt(0).toUpperCase()+name.slice(1)
			node.onclick = this[name].bind(this)
			props.node = node
			menu.appendChild(node)
		}
		*/
	}
	profile() {
		// show your zones
	}
	settings() {
		// allow people to set their name
	}
	create() {
		//let thing = this.querySelector('#exampleModal')
		$('#exampleModal').modal('show')
	}
	logout() {
		this.account = 0
		this.querySelector("#signin").classList.remove("d-none")
		this.querySelector("#menu").classList.add("d-none")
		this.querySelector("#create").classList.add("d-none")
		//for (const [name,props] of Object.entries(this.items)) {
		//	props.node.style.display=props.active?"block":"none"
		//}
	}
	async signin() {

		if (!window.keplr) {
			alert("Please install or enable keplr.app")
			return
		}

		const chainId = "cosmoshub-4";
		await window.keplr.enable(chainId);
		const offlineSigner = window.keplr.getOfflineSigner(chainId);
		const accounts = await offlineSigner.getAccounts();

		if(accounts.length < 1 ) {
			alert("No keplr accounts found")
			return
		}

		this.account = accounts[0]

		this.querySelector("#signin").classList.add("d-none")
		this.querySelector("#menu").classList.remove("d-none")
		this.querySelector("#create").classList.remove("d-none")

		//for (const [name,props] of Object.entries(this.items)) {
		//	props.node.style.display=props.active?"none":"block"
		//}

	}
}
customElements.define('orbital-header-element', OrbitalHeaderElement )

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import {popular_data, tutorials_data, yours_data } from "./data.js"
import {CardSmall, CardSmallCollection} from './cards.js'


class OrbitalBrowseElement extends HTMLElement {

	constructor() {
		super()
		this.items = { popular:{active:false}, newest:{active:false}, examples:{active:false}, subscribed:{active:false} }
		this.paint()
	}

	paint(item) {
		this.innerHTML = `
			<div id="menu"></div>
			<div id="body">
				<div id="spinner" class="loader">Loading...</div>
			</div>
		`

		let menu = this.querySelector("#menu")
		for (const [name,props] of Object.entries(this.items)) {
			let node = document.createElement("h3")
			node.id=name
			node.className = "btn btn-light menuitem"
			node.innerHTML=name.charAt(0).toUpperCase()+name.slice(1)
			node.onclick = this[name].bind(this)
			props.node = node
			menu.appendChild(node)
		}

		this.popular()
	}

	popular() {
		this.update()
	}
	update() {
		Object.values(this.items).forEach(item=>item.active=false)
//		this.items["popular"].node.style.color="white"
		let query = { observe: (callback => { callback(popular_data) }) }
		this.querySelector("#spinner").remove()
		this.querySelector("#body").appendChild(new CardSmallCollection(query))
	}
	newest() {}
	examples() {}
	subscribed() {}

}

customElements.define('orbital-browse-element', OrbitalBrowseElement )


/*

docs:

how to wire together orbital services and what they can do

	- a service is a blob of code in orbital

	- they can be loaded by the pool manager (or even by hand but that circumvents orbital features)

	- they can be wired together in a variety of ways

		- message passing

		- explicit methods

		- asynchronous methods

		- methods with callbacks

		- promises







- routing traffic between an http and a database -> phrased as simply as possible for chatgpt

	- let people being able to post to it
	- having a reply path
	- a general philosophy around modules




- server side work: the list view support requires the following on the server

	- database exposure

		- 1) i can either pass http to the database

		- 2) or i can globally wire the two together in the main routine

		- either way the database needs to be able to receive http traffic and then respond ...

			- so basically http catches a request, it routes it to the db, it waits for a response and returns it

	- then i have to write some database powers that can return nice query results


- client side current selection work:

	- i can tear down and rebuild the display for each view for now

	- i can either post a query to my own database instance (which is pleasant)

	- or i can directly hammer on the remote service as a test

	- paint the right mode

	- 


- showing the current selections

	- have a database on the server -> i should have this
	- be able to query that server

	- i need global state somewhere
	- and i need to be able to order the browser element to update


- show only current mode
- have global state


my goal here is to let people make their own zones, copy, cut paste
and see what they made, and visit them
	- so there are some ux elements to write; sign in, actually create a zone...
	- but also i have database query logic
	- and a bit of auth logic
	- and dupe testing
	- and it manifests the idea of zones on the server

- create button

	- make create work
	- some popup ux
	- see if name is taken
	- push new area
	- add area to list of areas
	- send you to new area or at least to your zones
	-

	- i then want a shell interface to talk to the server and be able to populate them


*/

