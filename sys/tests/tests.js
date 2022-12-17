
import * as fs from 'fs';

//
// instance of orbital to run tests against and basic db port api
//

let db_endpoint = "http://localhost:8080/sys/services/db"

//
// sample data
//

let george = {uuid:1123,kind:"person",pedestrian:true,mobile:true,name:"george"}

//
// a helper for raw fetches against http port
//

async function fetcher(endpoint,args) {
	try {
		let response = await fetch(endpoint, {
			method: 'POST', headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(args)
		})
		let json = await response.json()
		return json
	} catch(err) {
		console.error(err)
	}
}

//
// db write
//

async function db_write() {

	let blob = {command:"write",data:george}

	let results = await fetcher(db_endpoint,blob)

	if(results && results.length && results[0].uuid == blob.data.uuid) {
		console.log("Excellent",results)
		return true
	} else {
		console.error("Sad",results)
		return false
	}

}

//
// db query 
//

async function db_query() {

	let blob = {command:"query",data:george}

	let results = await fetcher(db_endpoint,blob)

	if(results && results.length && results[0].uuid == george.uuid) {
		console.log("Excellent",results)
		return true
	} else {
		console.error("Sad",results)
		return false
	}

}

//
// db destroy
//

async function db_destroy() {

	let blob = {command:"destroy",data:george}

	let results = await fetcher(db_endpoint,blob)

	return results && results.status == "success"
}

//
// test loading an agent and sending to db
//

async function db_agent() {
	let path = "./sys/apps/agents/boid.js"
	const data = fs.readFileSync(path, 'utf8')
	let blob = {command:"agent",data}
	let results = await fetcher(db_endpoint,blob)
	return true
}


//
// all tests
//

let tests = [
	db_write,
	db_query,
	db_destroy,
	db_write,
	db_query,
	db_agent
]

async function start() {

	let results = []
	for(const test of tests) {
		console.log("**** Running test",test.name)
		let status = await test()
		results.push(`${test.name} : ${status?'pass':'fail'}`)
	}

	console.log("******* Done ***** Results are *****")
	results.forEach(r=>{
		console.log(r)
	})

}


start()