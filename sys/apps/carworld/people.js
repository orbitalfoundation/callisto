
import Nav from '/sys/services/view/nav.js'

let paths_old = [
	{ xyz:[ -5,  0,  -10], subkind:"bldg:office", uuid: "9000", c: ["9010","9060"] },
	{ xyz:[-35,  0,  -10], subkind:"bldg:path1",  uuid: "9010", c: ["9000","9020","9030"] },
	{ xyz:[-35,  0,  -20], subkind:"bldg:home",   uuid: "9020", c: ["9010"] },
	{ xyz:[-45,  0,  -10], subkind:"bldg:path2",  uuid: "9030", c: ["9040","9020"] },
	{ xyz:[-60,  0,  -10], subkind:"bldg:store",  uuid: "9040", c: ["9050","9030"] },
	{ xyz:[-60,  0,  -65], subkind:"bldg:park2",  uuid: "9050", c: ["9060","9040"] },
	{ xyz:[ -5,  0,  -65], subkind:"bldg:park",   uuid: "9060", c: ["9050","9000"] },
]

let paths =
[
  {
	subkind:"bldg:office",
    "xyz": [
      -117.50000544940288,
      0.08029914914893022,
      -2.5000062150226228
    ],
    "uuid": "805",
    "c": [
      "810",
      "806",
      "800"
    ]
  },
  {
	subkind:"bldg:path1",
    "xyz": [
      55,
      0,
      0
    ],
    "uuid": "131",
    "c": [
      "132",
      "130"
    ]
  },
  {
  	 subkind:"bldg:home",
    "xyz": [
      65,
      0,
      0
    ],
    "uuid": "161",
    "c": [
      "162",
      "160"
    ]
  },
  {
  	subkind:"bldg:path2",
    "xyz": [
      55,
      0,
      0
    ],
    "uuid": "171",
    "c": [
      "172",
      "170"
    ]
  },
  {
  	subkind:"bldg:store",
    "xyz": [
      45,
      0,
      0
    ],
    "uuid": "181",
    "c": [
      "182",
      "180"
    ]
  },
  {
  	subkind:"bldg:park2",
    "xyz": [
      35,
      0,
      0
    ],
    "uuid": "191",
    "c": [
      "192",
      "190"
    ]
  },
  {
	subkind:"bldg:park",
    "xyz": [
      55,
      0,
      0
    ],
    "uuid": "132",
    "c": [
      "131"
    ]
  },
  {
    "xyz": [
      65,
      0,
      0
    ],
    "uuid": "162",
    "c": [
      "161"
    ]
  },
  {
    "xyz": [
      55,
      0,
      0
    ],
    "uuid": "172",
    "c": [
      "171"
    ]
  },
  {
    "xyz": [
      45,
      0,
      0
    ],
    "uuid": "182",
    "c": [
      "181"
    ]
  },
  {
    "xyz": [
      35,
      0,
      0
    ],
    "uuid": "192",
    "c": [
      "191"
    ]
  },
  {
    "xyz": [
      12.499995793526834,
      0.08029914438055874,
      -2.499996465320095
    ],
    "uuid": "100",
    "c": [
      "110",
      "190",
      "320",
      "830"
    ]
  },
  {
    "xyz": [
      57.49999872473902,
      0.08029915153311595,
      -2.499983354175882
    ],
    "uuid": "130",
    "c": [
      "140",
      "131",
      "120"
    ]
  },
  {
    "xyz": [
      77.49999169138175,
      0.0802991610698589,
      -2.4999877649050433
    ],
    "uuid": "140",
    "c": [
      "150",
      "130"
    ]
  },
  {
    "xyz": [
      57.49999169138175,
      0.0802991610698589,
      -2.4999877649050433
    ],
    "uuid": "120",
    "c": [
      "130",
      "110"
    ]
  },
  {
    "xyz": [
      17.500005440156492,
      0.08029914438055874,
      -2.4999976990034227
    ],
    "uuid": "110",
    "c": [
      "120",
      "100",
      "220"
    ]
  },
  {
    "xyz": [
      72.49999612942347,
      0.08029914438055874,
      2.499996129423465
    ],
    "uuid": "150",
    "c": [
      "160",
      "140",
      "200"
    ]
  },
  {
    "xyz": [
      42.500000821501,
      0.08029914914893022,
      2.4999999441206455
    ],
    "uuid": "180",
    "c": [
      "190",
      "181",
      "170"
    ]
  },
  {
    "xyz": [
      52.500000821501,
      0.08029914914893022,
      2.4999999441206455
    ],
    "uuid": "170",
    "c": [
      "180",
      "171",
      "160"
    ]
  },
  {
    "xyz": [
      62.500000821501,
      0.08029914914893022,
      2.4999999441206455
    ],
    "uuid": "160",
    "c": [
      "170",
      "161",
      "150"
    ]
  },
  {
    "xyz": [
      32.500000821501,
      0.08029914914893022,
      2.4999999441206455
    ],
    "uuid": "190",
    "c": [
      "100",
      "191",
      "180"
    ]
  },
  {
    "xyz": [
      122.49999612942347,
      0.08029914438055874,
      2.499996129423465
    ],
    "uuid": "250",
    "c": [
      "200",
      "240",
      "699"
    ]
  },
  {
    "xyz": [
      127.5000035346799,
      0.08029914438055874,
      2.4999957935268355
    ],
    "uuid": "240",
    "c": [
      "250",
      "230",
      "490",
      "690"
    ]
  },
  {
    "xyz": [
      17.500005440156492,
      0.08029914438055874,
      -2.4999976990034156
    ],
    "uuid": "230",
    "c": [
      "240",
      "220",
      "400",
      "820"
    ]
  },
  {
    "xyz": [
      12.499995793526834,
      0.08029914438055874,
      -2.499996465320095
    ],
    "uuid": "220",
    "c": [
      "230",
      "110",
      "210"
    ]
  },
  {
    "xyz": [
      92.49999612942347,
      0.08029915153311595,
      2.4999885000291044
    ],
    "uuid": "210",
    "c": [
      "220",
      "200"
    ]
  },
  {
    "xyz": [
      92.49999579352684,
      0.08029914438055874,
      -2.499996465320095
    ],
    "uuid": "200",
    "c": [
      "210",
      "150",
      "250"
    ]
  },
  {
    "xyz": [
      137.50000583065608,
      0.08029914438055874,
      2.4999985551635917
    ],
    "uuid": "330",
    "c": [
      "340",
      "320"
    ]
  },
  {
    "xyz": [
      137.5000132499407,
      0.0802991610698589,
      2.500009323459352
    ],
    "uuid": "340",
    "c": [
      "300",
      "330"
    ]
  },
  {
    "xyz": [
      22.499997057930262,
      0.08029914438055874,
      -2.499995200916665
    ],
    "uuid": "300",
    "c": [
      "310",
      "340"
    ]
  },
  {
    "xyz": [
      24.999998542173962,
      0.08029914914893022,
      -2.5000006196531217
    ],
    "uuid": "310",
    "c": [
      "320",
      "300"
    ]
  },
  {
    "xyz": [
      17.500005440156492,
      0.08029914438055874,
      -2.499997699003423
    ],
    "uuid": "320",
    "c": [
      "330",
      "100",
      "310",
      "775"
    ]
  },
  {
    "xyz": [
      122.49999612942347,
      0.08029914438055874,
      2.499996129423465
    ],
    "uuid": "490",
    "c": [
      "450",
      "240",
      "480",
      "680"
    ]
  },
  {
    "xyz": [
      127.50000583065608,
      0.08029914438055874,
      2.499998555163586
    ],
    "uuid": "480",
    "c": [
      "490",
      "470",
      "570"
    ]
  },
  {
    "xyz": [
      87.50000230099658,
      0.08029914438055874,
      -2.4999945598435147
    ],
    "uuid": "470",
    "c": [
      "480",
      "460"
    ]
  },
  {
    "xyz": [
      82.49998053473777,
      0.08029914438055874,
      -2.499996465320095
    ],
    "uuid": "450",
    "c": [
      "460",
      "490"
    ]
  },
  {
    "xyz": [
      67.50000583065608,
      0.08029914438055874,
      2.499998555163586
    ],
    "uuid": "420",
    "c": [
      "430",
      "410"
    ]
  },
  {
    "xyz": [
      17.500005440156492,
      0.08029914438055874,
      -2.4999976990034156
    ],
    "uuid": "410",
    "c": [
      "420",
      "400"
    ]
  },
  {
    "xyz": [
      12.499995793526834,
      0.08029914438055874,
      -2.499996465320095
    ],
    "uuid": "400",
    "c": [
      "410",
      "230",
      "440"
    ]
  },
  {
    "xyz": [
      62.499996129423465,
      0.08029914438055874,
      2.499996129423465
    ],
    "uuid": "440",
    "c": [
      "400",
      "430"
    ]
  },
  {
    "xyz": [
      82.49999197882914,
      0.08029914438055874,
      -2.5000002800167636
    ],
    "uuid": "460",
    "c": [
      "470",
      "430",
      "450"
    ]
  },
  {
    "xyz": [
      67.50000734937657,
      0.08029914438055874,
      2.4999996082245275
    ],
    "uuid": "430",
    "c": [
      "440",
      "420",
      "460"
    ]
  },
  {
    "xyz": [
      12.499991978828628,
      0.0802991610698589,
      -2.500004094713944
    ],
    "uuid": "510",
    "c": [
      "520",
      "500"
    ]
  },
  {
    "xyz": [
      12.499995793526834,
      0.08029914438055874,
      -2.499996465320095
    ],
    "uuid": "500",
    "c": [
      "510",
      "570"
    ]
  },
  {
    "xyz": [
      152.49999612942347,
      0.08029915153311595,
      2.4999885000291044
    ],
    "uuid": "560",
    "c": [
      "570",
      "550"
    ]
  },
  {
    "xyz": [
      152.49999579352684,
      0.08029914438055874,
      -2.499996465320095
    ],
    "uuid": "550",
    "c": [
      "560",
      "540",
      "670"
    ]
  },
  {
    "xyz": [
      187.5000096453603,
      0.0802991610698589,
      2.5000061845553176
    ],
    "uuid": "540",
    "c": [
      "550",
      "530"
    ]
  },
  {
    "xyz": [
      187.4999946716046,
      0.0802991610698589,
      -2.499990745141531
    ],
    "uuid": "520",
    "c": [
      "530",
      "510"
    ]
  },
  {
    "xyz": [
      122.49999994412065,
      0.08029914438055874,
      2.499992314726285
    ],
    "uuid": "570",
    "c": [
      "500",
      "480",
      "560"
    ]
  },
  {
    "xyz": [
      187.499967009126,
      0.08029914914893022,
      2.5000135511103565
    ],
    "uuid": "530",
    "c": [
      "531",
      "540",
      "520"
    ]
  },
  {
    "xyz": [
      170,
      0,
      0
    ],
    "uuid": "531",
    "c": [
      "530"
    ]
  },
  {
    "xyz": [
      152.49999579352684,
      0.08029914438055874,
      -2.499996465320095
    ],
    "uuid": "699",
    "c": [
      "250",
      "690"
    ]
  },
  {
    "xyz": [
      157.49996880319105,
      0.08029914438055874,
      -2.4999915796161076
    ],
    "uuid": "670",
    "c": [
      "680",
      "550",
      "660"
    ]
  },
  {
    "xyz": [
      202.49998376081328,
      0.08029915153311595,
      -2.5000013342839793
    ],
    "uuid": "660",
    "c": [
      "670",
      "650"
    ]
  },
  {
    "xyz": [
      202.49999612942347,
      0.08029915153311595,
      2.4999885000291044
    ],
    "uuid": "650",
    "c": [
      "660",
      "640"
    ]
  },
  {
    "xyz": [
      167.49999439022815,
      0.08029895292613212,
      -4.999999136936879
    ],
    "uuid": "640",
    "c": [
      "650",
      "630"
    ]
  },
  {
    "xyz": [
      72.50000308702354,
      0.08029914914893022,
      -5.000000224138944
    ],
    "uuid": "630",
    "c": [
      "640",
      "620"
    ]
  },
  {
    "xyz": [
      -2.4999829353790837,
      0.08029915153311595,
      2.5000016940564933
    ],
    "uuid": "620",
    "c": [
      "630",
      "610"
    ]
  },
  {
    "xyz": [
      -15.000000123883542,
      0.08029990412784294,
      -2.500003758817826
    ],
    "uuid": "610",
    "c": [
      "620",
      "600"
    ]
  },
  {
    "xyz": [
      152.49999455059714,
      0.08029914914893022,
      -2.500006215022637
    ],
    "uuid": "690",
    "c": [
      "699",
      "240",
      "680"
    ]
  },
  {
    "xyz": [
      152.49999455059714,
      0.08029914914893022,
      -2.500006215022637
    ],
    "uuid": "680",
    "c": [
      "690",
      "490",
      "670"
    ]
  },
  {
    "xyz": [
      -17.500003870576535,
      0.08029914438055874,
      2.499996129423465
    ],
    "uuid": "600",
    "c": [
      "610",
      "820"
    ]
  },
  {
    "xyz": [
      -47.500003870576535,
      0.08029915153311595,
      2.4999885000291044
    ],
    "uuid": "710",
    "c": [
      "720",
      "700"
    ]
  },
  {
    "xyz": [
      -117.49999624118217,
      0.0802991610698589,
      2.499992314726285
    ],
    "uuid": "740",
    "c": [
      "750",
      "730"
    ]
  },
  {
    "xyz": [
      -47.499996241182174,
      0.0802991610698589,
      2.499992314726285
    ],
    "uuid": "700",
    "c": [
      "710",
      "701",
      "785"
    ]
  },
  {
    "xyz": [
      -12.499996465320095,
      0.08029914438055874,
      2.499995793526834
    ],
    "uuid": "775",
    "c": [
      "780",
      "320",
      "770",
      "830"
    ]
  },
  {
    "xyz": [
      -17.500003870576535,
      0.08029914438055874,
      2.499996129423465
    ],
    "uuid": "785",
    "c": [
      "700",
      "780"
    ]
  },
  {
    "xyz": [
      -112.49999455984351,
      0.08029914438055874,
      -2.499997699003423
    ],
    "uuid": "750",
    "c": [
      "765",
      "740",
      "800"
    ]
  },
  {
    "xyz": [
      -67.50000005587935,
      0.5305041552222334,
      2.499996129423465
    ],
    "uuid": "720",
    "c": [
      "730",
      "721",
      "710"
    ]
  },
  {
    "xyz": [
      -12.499997984037336,
      0.08029914914893022,
      2.5000032472449067
    ],
    "uuid": "780",
    "c": [
      "785",
      "775"
    ]
  },
  {
    "xyz": [
      -92.5000053713153,
      0.08029914914893022,
      -2.4999953943047455
    ],
    "uuid": "765",
    "c": [
      "770",
      "750"
    ]
  },
  {
    "xyz": [
      -32.5000053713153,
      0.08029914914893022,
      -2.4999953943047455
    ],
    "uuid": "770",
    "c": [
      "775",
      "765"
    ]
  },
  {
    "xyz": [
      -87.499999178499,
      0.08029914914893022,
      2.4999999441206455
    ],
    "uuid": "730",
    "c": [
      "740",
      "731",
      "720"
    ]
  },
  {
    "xyz": [
      -85,
      0,
      0
    ],
    "uuid": "731",
    "c": [
      "730"
    ]
  },
  {
    "xyz": [
      -63.698890686035156,
      0,
      0
    ],
    "uuid": "721",
    "c": [
      "720"
    ]
  },
  {
    "xyz": [
      -30,
      0,
      0
    ],
    "uuid": "701",
    "c": [
      "700"
    ]
  },
  {
    "xyz": [
      -12.499996465320095,
      0.08029914438055874,
      2.4999957935268355
    ],
    "uuid": "820",
    "c": [
      "825",
      "230",
      "600",
      "810"
    ]
  },
  {
    "xyz": [
      -17.500003870576535,
      0.08029914438055874,
      2.499996129423465
    ],
    "uuid": "830",
    "c": [
      "835",
      "100",
      "775",
      "825"
    ]
  },
  {
    "xyz": [
      -112.49999455984351,
      0.08029914438055874,
      -2.4999976990034156
    ],
    "uuid": "810",
    "c": [
      "820",
      "805"
    ]
  },
  {
    "xyz": [
      -117.50000420647316,
      0.08029914438055874,
      -2.499996465320095
    ],
    "uuid": "800",
    "c": [
      "805",
      "750",
      "840"
    ]
  },
  {
    "xyz": [
      -100,
      0,
      0
    ],
    "uuid": "849",
    "c": [
      "840"
    ]
  },
  {
    "xyz": [
      -97.499999178499,
      0.08029914914893022,
      2.4999999441206455
    ],
    "uuid": "840",
    "c": [
      "800",
      "849",
      "835"
    ]
  },
  {
    "xyz": [
      -37.499999178499,
      0.08029914914893022,
      2.4999999441206455
    ],
    "uuid": "835",
    "c": [
      "840",
      "836",
      "830"
    ]
  },
  {
    "xyz": [
      -30,
      0,
      0
    ],
    "uuid": "836",
    "c": [
      "835"
    ]
  },
  {
    "xyz": [
      -90,
      0,
      0
    ],
    "uuid": "806",
    "c": [
      "805"
    ]
  },
  {
    "xyz": [
      -12.499972388537914,
      0.08029914914893022,
      2.500011676603677
    ],
    "uuid": "825",
    "c": [
      "830",
      "826",
      "820"
    ]
  },
  {
    "xyz": [
      -30,
      0,
      0
    ],
    "uuid": "826",
    "c": [
      "825"
    ]
  }
]


let nav = new Nav(paths)

export default class People {

	update(db,nodes) {
		nodes.forEach( node => { this.solve_one(db,node)})
	}

	pick_goal(node) {
		// convert the schedule notation to something more legible
		//let day = Math.floor(this.elapsed/24)
		//let hr = this.elapsed-day*24
		//let days = ["sun","mon","tue","wed","thu","fri","sat"]

		// find best goal in persons schedule if any for the current time
		let latch = 0
		for(const [time,activity] of Object.entries(node.schedule)) {
			let t = parseFloat(time)
			if(node.elapsed < t) break
			if(node.elapsed >= t) latch = {time,activity}
		}
		if(!latch) return 0
		for(let i = 0; i < paths.length;i++) {
			if(latch.activity == paths[i].subkind) {
				console.log("person: got dest " + paths[i].uuid)
				return paths[i]
			}
		}
		return 0
	}

	solve_one(db,node) {

		// for now each person has their own counter; this could be a real system timer using Date.now
		node.elapsed = ( node.elapsed + node.tick ) % node.modulo

		// initialize ?
		if(!node.nav_current) {
			node.nav_current = nav.get_path("100"); //random_item()
			node.xyz = node.nav_current.xyz.slice()
			node.dirty = Date.now()
			node.nav_route = []
			console.log("person: setting random pos " + node.nav_current.uuid)
		}

		// pick a new goal if no set of goals
		if(!node.nav_route || node.nav_route.length < 1) {
			let item = this.pick_goal(node)
			if(!item) {
				console.warn("person: no goal")
				return
			}
			let route = nav.get_shortest_path(node.nav_current.uuid,item.uuid)
			if(route && route.path.length > 1) {
				let temp = route.path.slice()
				temp.shift()
	 			node.nav_route = temp
	 			console.log("person: goal " + temp)
	 			console.log(temp)
			}
 		}

		// make sure there are goals?
		if(!node.nav_route || node.nav_route.length < 1) {
			return
		}

		// get goal
		let target = nav.get_path( node.nav_route[0] )
		if(!target) return

		// get a vector that faces target
		let dir = [ target.xyz[0]-node.nav_current.xyz[0],
					target.xyz[1]-node.nav_current.xyz[1],
					target.xyz[2]-node.nav_current.xyz[2],
					]

		// get normalized length of direction vector
		let dirlen = Math.sqrt( dir[0]*dir[0]+dir[1]*dir[1]+dir[2]*dir[2] )
		if(!dirlen) {
			console.warn("people: no distance to target")
		}

		// get next best step along vector by normalizing the direction vector - rate is a hardcoded hack for velocity
		let rate = 0.5;
		let step = dirlen ? [ rate * dir[0] / dirlen , rate * dir[1] / dirlen, rate * dir[2] / dirlen ] : [0,0,0]

		if(!node.latched) {
			console.log("people: is at nav named  " + node.nav_current.uuid)
			console.log("is going to target named " + target.uuid)
			console.log("people: is at            " + node.xyz )
			console.log("people: target is at     " + target.xyz )
			console.log("people: moving from      " + node.nav_current.xyz )
			console.log("people: step is.         " + step )
		}

		// move
		node.xyz[0] += step[0]
		node.xyz[1] += step[1]
		node.xyz[2] += step[2]

		// orient
		let v = new BABYLON.Vector3(dir[0],dir[1],dir[2])
		v.normalize()
		node.ypr[1] = Math.atan2(v.x,v.z)

		// mark for update
		node.dirty = Date.now()

		// get current distance
		let dist = [(target.xyz[0]-node.xyz[0]),
					(target.xyz[1]-node.xyz[1]),
					(target.xyz[2]-node.xyz[2]) ]

		let distsq = dist[0]*dist[0]+dist[1]*dist[1]+dist[2]*dist[2]

		// be at target if close to target
		if( distsq < 1) {
			console.log("people: shifted a goal")
			node.nav_route.shift()
			node.nav_current = target
		}

		if(!node.latched) {
			node.latched = true
			console.log("people: is now at        " + node.xyz )
			console.log("people: dist is          " + dist )
		}

	}
}

// todo - car support:
//
// if far and not in car and if car is near then goto car
// if far and in car then drive
// if near and in car then park car
// if near and in car and car is parked then exit car
// if near and not in car then goto place
// close enough to walk - just linear interpolate
//
