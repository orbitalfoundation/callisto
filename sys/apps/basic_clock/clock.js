
// this probably doesn't work now?

// define a group of visual layout elements (this is just one of a number of ways to specify this)

// jan 2022 - thinking about the grammar conceptually:
//
// TODO is 'kind' the kind of thing or is it a base or an extends? what is inheritance model?
// TODO do we decorate these elements with behaviors? think about it

const myart = {
	myimage: {
		kind:"image",
		x:0.0,
		y:0.0,
		w:800.0,
		h:800.0,
		art:"matrix.jpg",
	},
	mycircle: {
		kind:"circle",
		x:0,
		y:0,
		w:220.0,
		h:220.0,
	},
	myline: {
		kind:"line",
		x:0.0,
		y:0.0,
		w:0.0,
		h:0.0,
		seconds:0,
	}
}

// define an event handler for the clock

async function clock_events(e) {
	if(e.event != "tick") return
	if(!this.initialized) {
		const d = new Date()
		this.seconds = d.getSeconds()
		console.log("javascript:: clock: initialization -> seconds hand is exactly at " + this.seconds)
		this.initialized = 1
	}
	let r = 3.1459*2.0/60*this.seconds;
	this.seconds++;
	this.myline.w = Math.sin(r)*100.0
	this.myline.h = Math.cos(r)*100.0
	this.dirty = true
}

// define a clock 'application' made out of instances of other elements (there's more than one way to specify this also)

export const myapp = {
	myview: {
		target:"/sys/elements/view",
		load: myart,
	},
	mytimer: {
		target:"/sys/elements/timer",
		millis:1000,
	},
	event: clock_events
}
