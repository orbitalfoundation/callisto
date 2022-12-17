
const video = document.getElementById('webcam');
const enableWebcamButton = document.getElementById('webcamButton');

export default class Camera {

	constructor(blob) {

		if(!blob || !blob.client) {
			let err = "camera: must have a client handler supplied"
			console.error(err)
			throw err
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
						blob.client.resolve({video})
					})
				})
			})
		}

	}

}

