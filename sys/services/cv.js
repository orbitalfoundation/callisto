
export default class CV {

	constructor(args) {

		if(args) {
			this.uid = args.uid
			this.uuid = args.uuid
			this.service_uuid = args.service_uuid
			this.urn = args.urn
			this._pool = args._pool
		}

		this.predict.bind(this)

		this.model = 0
		this.client = args.client

		cocoSsd.load().then((loadedModel) => {
			this.model = loadedModel;

			// hack remove todo
			let demos = document.getElementById('demos')
			if(demos) {
				demos.classList.remove('invisible')
			}
		})

	}

	resolve(args) {
		if(args && args.video) {
			// once camera sends us data once - then feed the model
			console.log("cv: got video frame buffer handle from camera once")
			this.video = args.video
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

