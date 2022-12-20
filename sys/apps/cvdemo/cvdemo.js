	

const liveView = document.getElementById('liveView');
var model = undefined;
var children = [];

// todo load tensorflow using es6 later
//var script = document.createElement('script');
//script.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.10.0";
//document.getElementsByTagName('head')[0].appendChild(script);
//import * as tf from "/sys/libs/tensorflow/tf.min.js"
//import * as coco from "/sys/libs/tensorflow/coco-ssd.js"

export default class CVDemo {

	constructor(blob) {
		this._setup(blob)
	}

	async _setup(blob) {

		// sanity check - this demo only runs in a browser
		if(typeof document === 'undefined') {
			let err = "camera: must run on client"
			throw err
		}

		// sanity check - supports webcam?
		let getUserMediaSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
		if (!getUserMediaSupported) {
			let err = "Cameras are not supported in your browser"
			console.error(err)
			alert(err)
			throw err
		}

		// has webcam buttons?
		const button = document.getElementById('webcamButton');
		const webcam = document.getElementById('webcam');
		if(!button || !webcam) {
			let err = "camera: requires a click due to web bubblewrapping of users policies"
			throw err
		}

		// wait for click
		button.addEventListener('click',(event)=>{
			event.target.classList.add('removed')
			this._setup_camera(blob.pool,webcam)
		})
	}

	async _setup_camera(pool,webcam) {

		// get camera service
		let cam = await pool.resolve({urn:'*:/sys/services/camera',webcam})

		// get cv module service
		let cv = await pool.resolve({urn:'*:/sys/services/cv'})

		// route camera to cv
		cam.route(cv)

		// route cv to here
		cv.route(this)
	}

	resolve(results) {

		if(!results.predictions) return

		let predictions = results.predictions



		for (let i = 0; i < children.length; i++) {
			liveView.removeChild(children[i]);
		}
		children.splice(0);
		
		for (let n = 0; n < predictions.length; n++) {
			if (predictions[n].score > 0.66) {
				const p = document.createElement('p');
				p.innerText = predictions[n].class  + ' - with ' 
						+ Math.round(parseFloat(predictions[n].score) * 100) 
						+ '% confidence.';
				p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
						+ (predictions[n].bbox[1] - 10) + 'px; width: ' 
						+ (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

				const highlighter = document.createElement('div');
				highlighter.setAttribute('class', 'highlighter');
				highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
						+ predictions[n].bbox[1] + 'px; width: ' 
						+ predictions[n].bbox[2] + 'px; height: '
						+ predictions[n].bbox[3] + 'px;';

				liveView.appendChild(highlighter);
				liveView.appendChild(p);
				children.push(highlighter);
				children.push(p);
			}
		}
	}
}


