
export default class CV {

	model = 0
	routes = []

	constructor(blob) {
		cocoSsd.load().then((loadedModel) => {
			this.model = loadedModel;
		})
	}

	route(blob) {
		this.routes.push(blob)
	}

	resolve(blob) {

		if(!blob.webcam) {
			return
		}

		// this binds once only ... effectively it is a kind of route - todo may redo as a route?
		console.log("cv: got video frame buffer handle from camera once!")
		this.webcam = blob.webcam

		this.predict();
	}

	predict() {
		if(!this.model) {
			console.warn("cv: model not loaded")
			return
		}

		this.model.detect(this.webcam).then((predictions)=>{
			for(let route of this.routes) route.resolve({predictions})
			window.requestAnimationFrame(()=>{
				this.predict();
			})
		})
	}

}

