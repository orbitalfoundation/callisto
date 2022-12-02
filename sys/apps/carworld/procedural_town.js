
/* Town generator - not used atm

This is an exploration of procedurally generating a town starting with paths.

Some subjects such as cities or towns are defined by axiomatic features such as roads or paths.
Often there is a cellular quality; for example a city is made of many blocks jammed together around paths.

There are a range of techniques for generating content. For example these links:

	https://github.com/victorqribeiro/isocity
	Grasshopper
	https://sketchfab.com/3d-models/pacific-reef-871b42a7f1304367aa72c313eb127bd8
	https://martindevans.me/game-development/2015/12/11/Procedural-Generation-For-Dummies-Roads/
	https://parametrichouse.com/


*/

class ProceduralTown {
	lines = []
	intersections = []
	uuid = 1

	/// define the pathways of a town by defining a bunch of paths crossing through it
	defaults() {
		let count = 6
		let ratio = 5
		let thing = [...Array(count).keys()]
		thing.forEach(n=>{
			this.path( [0.0,n/ratio], [1.0,n/ratio] )
			this.path( [n/ratio,0.0], [n/ratio,1.0] )
		})
	}

	/// add a path segment to a town; also find any intersections
	path(n1,n2) {
		// find intersections
		this.lines.forEach(l=>{
			let result = math.intersect(n1,n2,l[0],l[1])
			if(result) this.intersections.push(result)
		})

		//
		// - find blocks; complete polyhedra
		//
		// - every intersection generates 4 pieces -> we could rewrite the database to update
		// - we could rewrite line segments in the database to become the cut apart snippets
		// - so this should rewrite all the segments to be short
		//
		// - find all non repetitive shortest paths back to a given hub
		//
		// - now we 
		// 

		// store new line
		this.lines.push([n1,n2])
	}

	/// visualize the dataset
	paint(db) {

		/// draw roads
		this.lines.forEach(l=>{
			db.merge({
				uuid: `town${this.uuid++}`,
				kind:"line",
				points:l,
				//xyz:[x,y,z],
				//whd:[1,1,1]
			})			
		})

		/// draw intersections
		this.intersections.forEach(i=>{
			let x = i[0]
			let y = i[1]
			let z = 0
			console.log(x,y)
			db.merge({
				uuid: `town${this.uuid++}`,
				kind:"box",
				xyz:[x,y,z],
				whd:[0.1,0.1,0.1]
			})			
		})

	}
}

