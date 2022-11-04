
const video = document.getElementById('webcam');
const enableWebcamButton = document.getElementById('webcamButton');

export default class Camera {

	constructor(args) {
		if(args) {
			this.uid = args.uid
			this.uuid = args.uuid
			this.service_uuid = args.service_uuid
			this.urn = args.urn
			this._pool = args._pool
		}

		let getUserMediaSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)

		if (!getUserMediaSupported) {
			alert('getUserMedia() is not supported by your browser')
		} else {
			enableWebcamButton.addEventListener('click',()=>{
				event.target.classList.add('removed')
				// start video camera
				// route frames to specified channel
				navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
					video.srcObject = stream
					video.addEventListener('loadeddata', (results) => {
						args.client.resolve({video})
					})
				})
			})
		}

	}

	async resolve(args) {

	}
}

