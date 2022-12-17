
export default class CV {

	constructor(blob) {

		if(!blob || blob.client) {
			let err ="cv: must have a client"
			console.error(err)
			throw err
		}

		this.predict.bind(this)

		this.model = 0
		this.client = blob.client

		cocoSsd.load().then((loadedModel) => {
			this.model = loadedModel;

			// hack remove todo
			let demos = document.getElementById('demos')
			if(demos) {
				demos.classList.remove('invisible')
			}
		})

	}

	resolve(blob) {
		if(blob && blob.video) {
			// once camera sends us data once - then feed the model
			console.log("cv: got video frame buffer handle from camera once")
			this.video = blob.video
			this.predict()
		}
	}

	predict() {
		if(!this.model) {
			console.warn("cv: model not loaded")
			return
		}
		this.model.detect(this.video).then((predictions)=>{
			this.client.resolve({predictions})
			window.requestAnimationFrame(()=>{
				this.predict();
			})
		})
	}

}

