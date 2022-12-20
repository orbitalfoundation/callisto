/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///
/// SCENE 1
///
/// This app has two scenes. This scene is for the 3d avatars and default assets.
/// This scene is declared in my own platform neutral "scenario definition language".
/// The goal of this grammar is to have a portable, reasonably expressive way to describe 3d layouts.
/// These assets are poured into a shared database that the view observes and that the server interacts with.
/// Because the server is persistent, it may ignore these (older) assets when the assets arrive at the server.
/// The server distinguishes between older and newer assets by looking the "created" and "updated" timecode if set.
///
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//
// camera - avatar will take over camera
// - todo we do not want to network the cam at all really
//

let mycamera = {
	      uuid: "/mycamera",
	      kind: "camera",
	       xyz: [2,2,5],
	    lookat: [0,0,0],
	networking: false,
	 universal: true
}

//
// lights
//

let mylight_positional = {
	     uuid: "/mylight1",
	     kind: "light",
	  network: "static",
	      xyz: [4,4,4],
	      dir: [0,-1,1],
	intensity: 1.0,
	  shadows: true,
}

//
// ground
//

let myground = {
	uuid: "/myground",
	kind:"box",
	network:"static",
	physics:{shape:"box",mass:0},
	shadows: true,
	xyz:[0,0,0],
	whd:[4,0.01,4],
	walkable:true,
	xmaterial: {
//		rgba:0xffffffff,
//		alpha: 0.5,
		heightmap: "/sys/assets/textures/heightMap.png",
		art: "/sys/assets/textures/ground.jpg",
	},
}

//
// a sign - a 3d primitive with 2d elements
//

let mysign = {
	uuid: "/mysign",
	kind:"box",
	network:"static",
	//physics:{shape:"box",mass:0.1},
	shadow:1,
	//ypr:[-1.5707,1.5707,0],
	xyz:[1,1,0],
	whd:[1,1,1],
	pickable:true,
	material: {
		alpha:0.5,
		rgba:0x964b00,
		children:[
			{
				uuid: "/mysign/material/text",
				kind:"text",
				text:"hello",
				font:"bold 44px monospace",
				rgba:0xffff00ff
			}
		]
	},
}

//
// tree - a 3d primitive
// TODO would be fun to have many copies of this tree
//

let mytree = {
	    uuid: "/mytree",
	    kind: "group",
	 network: "static",
	     xyz: [3,0,0],
	pickable: true,
	children: [
		{
			  id: "/mytree/trunk",
			kind: "box",
			network:"static",
			shadow:true,
			whd:[0.1,1,0.1],
			xyz:[0,0,0],
			material: { rgba:0xff20f020, },
		},
		{
			id: "/mytree/crown",
			kind: "sphere",
			network:"static",
			shadow:true,
			whd:[1,0.5,1],
			xyz:[0,0.7,0],
			material: { rgba:0xff20f020, },
		}
	],
}

//
// avatar - since each player brings this - it should be locally unique
// TODO - is it a bad hack to peek at the pool for this?
//

let myavatar = {
	    uuid: "/myavatar",
	    kind: "gltf",
	 network: "dynamic",
//	     art: "/sys/assets/llama/scene.gltf",
	     art: "/sys/assets/lowpolyman/scene.gltf",
	  adjust: {xyz:[0,-0.5,0],ypr:[0,1.9,0]},
	     whd: [1,1,1],
	     xyz: [0,1,0],
	    xyzd: [0,1,0],
	     ypr: [0,0,0],
	    yprd: [0,0,0],
	pickable: true,
	//physics:{shape:"box",mass:0.1},
	//debugbox: "/sys/assets/textures/ground.jpg",
	//speculative_networking:true
}

//let myparticle_fx = {
//}

let myux = {
	    uuid: "/myux/",
	    kind: "textarea",
	 network: "dynamic",
}


let myplanet = {
	    uuid: "/myplanet",
	    kind: "gltf",
	     xyz: [0,2,0],
	     art: "/sys/assets/hexagon_planet/scene.gltf",
	pickable: true,
}

////////////////////////////////////////////////////////////////////////////////////////////////
///
/// SCENE 2
///
/// This scene is using a 3d layout to produce a 2d view using an orthogonal camera.
/// It has buttons and other interactions that users can click on.
///
///
///
////////////////////////////////////////////////////////////////////////////////////////////////

let scene2_camera = {
	      uuid: "/scene2_camera",
	      kind: "camera",
	       xyz: [0,0,5],
	    lookat: [0,0,0],
	     scene: "scene2",
	     ortho: true,
}

let scene2_fish = {
	    uuid: "/scene2_fish0",
	    kind: "group",
	   scene: "scene2",
	     xyz: [-4.2,3.8,0],
	children: [
    	{
			      id: "model",
			    kind: "gltf",
			     ypr: [0,1.6,0],
			     xyz: [0,0,0],
			     art: "/sys/assets/pomacanthus/scene.gltf",
			pickable: true,
			   scene: "scene2",
		},
		{
			      id: "backdrop",
			    kind: "box",
			 network: "static",
		         xyz: [0,0,-0.1],
			     whd: [1.1,1.1,0.02],
			pickable: true,
			   scene: "scene2",
			material: { rgba:0xffffffff },
		},
		{
			      id: "border",
			    kind: "box",
			 network: "static",
		         xyz: [0,0,-0.1],
			     whd: [1.2,1.2,0.01],
			pickable: true,
			   scene: "scene2",
			material: { rgba:0xffff00ff },
		}
   ]
}

let scene2_car = {
	    uuid: "/scene2_car",
	    kind: "group",
	   scene: "scene2",	// TODO can we inherit this or not specify?
	     xyz: [-4.2,2.5,0],
	children: [
		{
			      id: "model",
			    kind: "glb",
			     ypr: [0,0,0],
			     xyz: [0,0,0],
			     art: "/sys/assets/lowpolytruck/model.glb",
			pickable: true,
			   scene: "scene2",
		},
		{
			      id: "backdrop",
			    kind: "box",
			 network: "static",
		         xyz: [0,0,0],
			     whd: [1.1,1.1,0.02],
			pickable: true,
			   scene: "scene2",
			material: { rgba:0xffffffff },
		},
		{
			      id: "border",
			    kind: "box",
			 network: "static",
		         xyz: [0,0,0],
			     whd: [1.2,1.2,0.01],
			pickable: true,
			   scene: "scene2",
			material: { rgba:0xffff00ff },
		}
   ]
}

let scene2_globe = {
	    uuid: "/scene2_globe",
	    kind: "group",
	   scene: "scene2",	// TODO can we inherit this or not specify?
	     xyz: [-4.2,1.2,0],
	children: [
		{
			      id: "model",
			    kind: "glb",
			     ypr: [0,0,0],
			     xyz: [0,0,0],
			     art: "/sys/assets/hexagon_planet/scene.gltf",
			pickable: true,
			   scene: "scene2",
		},
		{
			      id: "backdrop",
			    kind: "box",
			 network: "static",
		         xyz: [0,0,0],
			     whd: [1.1,1.1,0.02],
			pickable: true,
			   scene: "scene2",
			material: { rgba:0xffffffff },
		},
		{
			      id: "border",
			    kind: "box",
			 network: "static",
		         xyz: [0,0,0],
			     whd: [1.2,1.2,0.01],
			pickable: true,
			   scene: "scene2",
			material: { rgba:0xffff00ff },
		}
   ]
}


let scene2_light = {
	     uuid: "/scene2_light",
	     kind: "light",
	  network: "static",
	      xyz: [0,0,0],
	      dir: [0,0,-1],
	intensity: 1.0,
	    scene: "scene2",
}

///////////////////////////////////////////////////////////////////////////////////////

let mylayout = [

	{ kind:"scene", uuid:"scene1", },

	mycamera,
	mylight_positional,
	myground,
	mytree,
	myplanet,
	myux,

	{ kind:"scene", uuid:"scene2", },

	scene2_camera,
    scene2_light,
    scene2_fish,
    scene2_car,
    scene2_globe,

	]



export default { mylayout, myavatar }
