
export default class Camera {

	routes = []

	constructor(blob) {
		let webcam = blob.blob.webcam
		navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
			webcam.srcObject = stream
			webcam.addEventListener('loadeddata', (results) => {
				for(let route of this.routes) {
					// push webcam once to targets
					route.resolve({webcam})
				}
			})
		})
	}

	route(route) {
		this.routes.push(route)
	}
}

