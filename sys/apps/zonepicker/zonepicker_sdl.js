
// first one is lat and minus is up, with =pi being the pole
// second one is long, and pi is half way around
// zero zero should have 3.1459/2 added to it

function lltoxyz(l2=0,l1=0,R=0.5) {
	l1 = l1*3.1459/180 + 3.1459/2 // adjust longitude for this specific map
	l2 = l2*3.1459/180 // adjust latitude
	console.log(l2)
	let xyz = [ R * Math.cos(l1) * Math.cos(l2), R * Math.cos(l1) * Math.sin(l2), R * Math.sin(l1) ]
	console.log(xyz)
	return xyz
}

export let myscene = {

	kind:"scene",
	uuid: "/myusername/apps/basic001",

	children:[

	{
		      uuid: "/myusername/apps/basic001/mycamera",
		      kind: "camera",
		       xyz: [0,0,2],
		    lookat: [0,0,0],
		arcrotatecamera: true,
		lookat: [0,0,0],
		radiusmin: 2,
		radiusmax: 10,
		rot:0
	},

	{
		uuid: "/myusername/apps/basic001/light1",
		kind: "directionallight",
		xyz: [0,0,0],
		dir: [0,-1,-1],
		intensity: 0.5,
	},

	{
		uuid: "/myusername/apps/basic001/light2",
		kind: "hemisphericlight",
		intensity: 5.0,
	},

	{
		    uuid: "/myusername/apps/basic001/myplanet",
		    kind: "gltf",
		     xyz: [0,0,0],
		     ypr: [0,0,0],
		     recenter: true,
		     rescale: true,
		     art: "/sys/assets/hexagon_planet/scene.gltf",
		pickable: true,
		children: [

			{
				    uuid: "/myusername/apps/basic001/newyork",
				    kind: "sphere",
				    material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff },
				     xyz: lltoxyz(40,-74,0.5),
				     ypr: [0,0,0],
				     whd: [0.1,0.1,0.1],
//					 urn: "/sys/apps/newyork",
				pickable: true,
			},
			{
				    uuid: "/myusername/apps/basic001/venice",
				    kind: "sphere",
				    material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff },
				     xyz: lltoxyz(-45,12),
				     ypr: [0,0,0],
				     whd: [0.1,0.1,0.1],
					 urn: "/sys/apps/venice",
				pickable: true,
			},
/*
			{
				    id: "/myusername/apps/basic001/myplanet/malta",
				    kind: "sphere",
				    material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff },
				     xyz: lltoxyz(-35,14,0.5),
				     ypr: [0,0,0],
				     whd: [0.1,0.1,0.1],
//					 urn: "/sys/apps/malta",
				pickable: true,
			},
*/
			{
				    uuid: "/myusername/apps/basic001/myplanet/arctic",
				    kind: "sphere",
				    material: { rgba:0xffffff88,alpha: 0.5, emissive:0xffffffff },
				     xyz: lltoxyz(30,0,0.5),
				     ypr: [0,90,0],
				     whd: [0.1,0.1,0.1],
//					 urn: "/sys/apps/arctic",
				pickable: true,
			},

			{
				    uuid: "/myusername/apps/basic001/myplanet/antarctic",
				    kind: "sphere",
				    material: { rgba:0xff88ffff,alpha: 0.5, emissive:0xffffffff },
				     xyz: lltoxyz(-30,0,0.5),
				     ypr: [0,-90,0],
				     whd: [0.1,0.1,0.1],
//					 urn: "/sys/apps/antarctic",
				pickable: true,
			},

		]
	}

	]


}
