
let yours_data = [

/*
	{
		uuid:"AR Desktop",
		label:"AR Desktop",
		url:"/sys/apps/desktop",
		art:"/sys/images/arux.jpg",
		about:"Augmented Reality Interfaces have different requirements from desktop or mobile phone interfaces. They are multi-player and require competing apps to co-render and share resources within the same view. Applications need to express layout with high level semantic intent such as 'place a clock on a nearby wall' rather than having total control of the display. This app explores what a heads up display ux may look and feel like. It demonstrates render-engine neutral high-level 3d scene descriptions, multiple camera rendering with both 3d and orthographic views and the ability to launch, run and manage other apps."
	},

	{
		uuid:"Sandbox",
		label:"Multiplayer Sandbox",
		url:"/sys/apps/multiverse",
		art:"/sys/images/multiverse.jpeg",
		about:"Future multi-participant shared spaces may benefit from network effects if they allow participants to upload and share software agents and behaviors, what we colloqially refer to as 'apps' as well as images, text and static geometry. Sharing independently written digital software agents however requires more formally defining the intent, capabilities and permissions of each agent. Here we explore what a multiplayer sandbox may feel like for many participants."
	},

	{
		uuid:"Venice",
		label:"Virtual Venice",
		art:"/sys/images/venice.png",
		url:"/sys/apps/venice",
		about:"[TBD] Digital Twins provide a synthesis of real and virtual information together; populating the digital model with sensor data - and ideally allowing participants in the virtual model to also have impact on the real world. In this scenario we explore what a digital twin of Venice could be like."

	},
*/
	{
		uuid:"Zone Picker",
		label:"Zone Picker",
		url:"/sys/apps/zonepicker",
		art:"/sys/images/zonepicker.png",
		about:"[TBD] We are already familiar with the idea of a mind palace for organizing information. Organizing information in a shared context may also benefit from spatial metaphors. This app provides a subject picker - allowing people to create and place and find subjects on a globe. An example subject could be another app such as a place-specific digital twin. Other views of the same data may include time spirals as well as more traditional file and folder views."
	},

	{
		uuid:"Cloud Reef",
		label:"Cloud Reef",
		url:"/sys/apps/worldpicker",
		art:"/sys/images/reef.jpg",
		about:"[TBD] There's a possibility of civic engagement around decision making if we can have shared understanding. In this case we see digital simulations running in the cloud as a way to do this. This example explores coral reef ecologies which are systems that efficiently capture energy and act as single organisms with emergent behaviors. Reefs are impacted by global warming and it may be possible to use digital tools to predictively model the outcome of policy changes here."
	},

]

let tutorials_data = [

	{
		uuid:"CVDemo",
		label:"Computer Vision Demo",
		url:"/sys/apps/cvdemo",
		art:"/sys/images/bird.jpg",
		about:"Future software tooling will use computer vision to help provide sense-making and contextual awareness for users. There are a wide range of applications here from diy farmbot applications to simple friend finders. Here we exercise high level descriptions of a typical computer vision scenario."
	},

]

let popular_data = [

	{
		uuid:"CarWorld",
		label:"Car World",
		url:"/sys/apps/carworld",
		art:"/sys/images/carla.png",
		about:"Carworld is a digital twin to help visualize and exercise vehicle models. It consists of separate models for vehicles and pedestrians driven by an ECS system. You can upload new agents to the system or revise existing agents to test out new scenarios. Currently navigation and routing information is embedded in the provided mesh"
	},

]

export { yours_data, tutorials_data, popular_data };

