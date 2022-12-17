
		if(e.event == "pick") {
			console.log("picking " + e.fragment.uuid)
			if(e.fragment.uuid.includes("fish")) {
				alert("cloud reef app picked")
			}
			if(e.fragment.uuid.includes("car")) {
				location.href = "/"
			}
			if(e.fragment.uuid.includes("globe")) {
				location.href = "/sys/apps/zonepicker"
			}
		}
