
///
/// Web Server for Orbital - Nov 2022 @anselm
///
/// This app runs a web accessible version of Orbital...
///
/// It provides a basic website, letting users sign up, try examples, and make and share their own examples.
/// Ultimately Orbital will eventually be a web browser by itself, but this is a bridge to let people try the ideas.
///
/// An http server is started below, and two folders are overlaid on top of each other and exposed through the web.
/// The entire root of the repository is exposed, and a "public" folder is exposed with the index.html page.
/// Many of the Orbital applications also have an index.html page and can be brought up by themselves in a browser.
///
/// A persistence layer is also started as well as a long sockets networking layer.
///


// get pool manager by hand
import Pool from '#orbital/sys/services/pool.js'
let pool = new Pool()

// get http server and give it the current folder as an additional place to serve files from - it also serves all files in ../../
let http = await pool.load({urn:"*:/sys/services/http",args:{port:8080,resources:import.meta.url}})

// get long sockets networking and run it also, sockets need to know about http server
let net = await pool.load({urn:"*:/sys/services/net",args:{server:http}})

// get database and run it also, database needs to know about networking
let db = await pool.load({urn:"*:/sys/services/db",args:{server:net}})

// let http run forever - it would be a bit cleaner to have the pool run forever, not the http handler - todo improve
http.runforever()
