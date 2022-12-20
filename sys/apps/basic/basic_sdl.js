
////////////////////////////////////////////////////////////////////////////////////////////////
// a 3d scene - orbital has a 'throw data over the wall' philosophy of defining 3d scenes
////////////////////////////////////////////////////////////////////////////////////////////////

let mycamera = {
	uuid: "/myusername/apps/basic001/camera1",
	kind: "camera",
	latitude: 0,
	longitude: -Math.PI/2,
	radius: 5,
	xyz: [0,2,-15],
	lookat: [0,0,0],
	radiusmin: 2,
	radiusmax: 500,
	//arcrotatecamera: true,
	universal: true, // type of mouse control
}

let mylight1 = {
	uuid: "/myusername/apps/basic001/light1",
	kind: "directionallight",
	xyz: [0,0,0],
	dir: [0,-1,-1],
	intensity: 0.5,
}

let mylight2 = {
	uuid: "/myusername/apps/basic001/light2",
	kind: "hemisphericlight",
	intensity: 5.0,
}


let mylights = {
	uuid: "/myusername/apps/basic001/lights",
	kind: "group",
	children: [ mylight1, mylight2 ],
}

let mything1 = {
	uuid:"/myusername/apps/basic001/thing1_network",
	kind:"box",
	xyz:[0,0,0],
	whd:[1,0.01,1],
	ypr:[0,0,0],
	material: { rgba:0xff0000ff, emissive:0xffff0000, alpha:1.0 },
}

let mything2 = {
	uuid:"/myusername/apps/basic001/thing2_network",
	kind:"sphere",
	xyz:[1,0,1],
	whd:[1,0.01,1],
	ypr:[0,0,0],
}

let mything3 = {
	uuid:"/myusername/apps/basic001/thing3_network",
	kind:"box",
	xyz:[3,0,3],
	ypr:[0,0,0],
}

let myux = {
	uuid: "/myusername/apps/basic001/myux",
	kind: "textarea",
}

let myavatar = {
	uuid: "/myusername/apps/basic001/myavatar_network",
	avatar: true,
	camera: "/myusername/apps/basic001/camera1",
	kind: "gltf",
	art: "/sys/assets/female.glb",
	adjust: {xyz:[0,0,0],ypr:[0,3.1459,0]},
	whd: [1,1,1],
	xyz: [0,0,0],
	ypr: [0,0,0],
	pickable: true,
}

let myscene = {
	uuid: "/myusername/apps/basic001/scene",
	kind: "scene",
	children: [ mycamera, mylights, mything1, myux ],
}

////////////////////////////////////////////////////////////////////////////////////////////////
// an application - orbital allows you to declare and wire components up in a manifest
////////////////////////////////////////////////////////////////////////////////////////////////


let myapp = [

	///////////////////////////////////////////////////////////////////////////////////////
	// setup a basic database backed view
	///////////////////////////////////////////////////////////////////////////////////////

	// make a database
	{
		urn: "*:/sys/services/db",
		uuid: "/myusername/apps/basic001/mydb",
		command: "write",
		data: myscene,
	},

	// make a view
	{
		uuid: "/myusername/apps/basic001/myview",
		kind: "service",
		urn: "*:/sys/services/view/view",
	},

	// wire db traffic -> view
	{
		uuid:"/myusername/apps/basic001/mydb",
		dest:"/myusername/apps/basic001/myview",
		command:"route",
	},

	///////////////////////////////////////////////////////////////////////////////////////
	// setup networking
	///////////////////////////////////////////////////////////////////////////////////////

	// make a network and tack in some filtering on traffic - filter can be a function
	{
		urn: "*:/sys/services/netclient",
		uuid: "/myusername/apps/basic001/mynet",
		command: "filter",
		data:{filter:["network"]},
	},

	// wire db traffic -> net
	{
		uuid:"/myusername/apps/basic001/mydb",
		dest:"/myusername/apps/basic001/mynet",
		command:"route",
	},

	// wire net traffic -> db
	{
		uuid:"/myusername/apps/basic001/mynet",
		dest:"/myusername/apps/basic001/mydb",
		command:"route",
	},

	///////////////////////////////////////////////////////////////////////////////////////
	// add an handler for us to move around a puppet with - each player gets a puppet
	///////////////////////////////////////////////////////////////////////////////////////

	// make a handler for our avatar
	{
		urn:"*:/sys/apps/agents/avatar_agent",
		uuid: "/myusername/apps/basic001/my_agent",
		dest:"/myusername/apps/basic001/mydb",
		command:"route",
		data: myavatar,
	},


	///////////////////////////////////////////////////////////////////////////////////////
	// a bit of a hack for now - kick the server and tell it to echo all state to new connections
	// later propagate new connection event to listeners and they can respond as they wish
	// may want to better evaluate the forward casting strategy
	///////////////////////////////////////////////////////////////////////////////////////

	{
		uuid:"/myusername/apps/basic001/mynet", // send msg to net
		urn:"*:/services/db", // it will route to db
		command:"sync",
	},

];



export { myscene, myavatar, myapp }
