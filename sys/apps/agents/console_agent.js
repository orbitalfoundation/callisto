

		// keyboard

		if(e.event == "console") {
			let fragment = eval('(' + e.text + ')')
			if(fragment) {
				console.log("desktop: console event")
				console.log(fragment)
				this.db.resolve({command:"write",data:fragment})
			} else {
				console.log("bad eval")
			}
		}
