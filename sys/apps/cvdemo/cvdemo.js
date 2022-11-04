	

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

	constructor(args) {
		this.init(args)
	}

	async init(args) {

		// remember pool
		let pool = this.pool = args._pool

		// start a cv module -> pipe predictions to us
		this.cv = await pool.load({urn:'*:/sys/services/cv',args:{client:this}})

		// start a camera -> pipe video to cv
		this.cam = await pool.load({urn:'*:/sys/services/camera',args:{client:this.cv}})

	}

	resolve(args) {
		if(args.predictions) this.paintResults(args.predictions)
	}

	paintResults(predictions) {

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


