import { url } from "inspector";
import { title } from "process";
const fetch = require('node-fetch');
const fs = require('fs')
const request = require('request')
const prom = require('prompt-sync')();
const cheerio = require('cheerio')
let verb = false

const verblog = (mess:string) => {
	if (verb){
		console.log('[verbose] '+mess)
	}
}
for (let j = 0; j < process.argv.length; j++) {
	if (process.argv[j] === "-v") verb = true

}
verblog('args : ['+String(process.argv)+']')


const getImgs = async (u:string,p:number,t:string)=>{
	let nu = u.split('1')
	let nnu = nu.slice(0,nu.length-1).join('1')

	for (let i = 0; i < p; i++) {
		let upage = nnu+String(i+1)+nu[nu.length-1]
		const response = await fetch(upage);
		if (response['status'] === 404){
			console.error(`image n°${String(i+1)} isn't on the server`)
			continue
		}
		const buffer = await response.buffer();
		let zero = '' 
		for (let m = 0; m < String(p).length - String(i+1).length ; m++) {
			zero +='0'
		}
		let prefix = `./${t}/${zero+String(i+1)+nu[nu.length-1]}`
		fs.writeFile(prefix, buffer, ()=> console.log(`image n°${i+1}/${p} downloaded !`)
		);
	}
}
const fetchinfo = (url: String) => {
	const selcttitle = '#info > h1'
	const selctNpages = '#info > div:nth-child(4)'
	const selcturlimgsatabase = '#image-container > a > img'
	let res = {
		'title': '',
		'pages': 0,
		'dataurl' : ''
	}
	request(url, (error,response,body) => {
		if (error) throw error
		const $ = cheerio.load(body)
		res['title'] = $(selcttitle).text()
		res['pages']=parseInt($(selctNpages).text().split(' ')[0])
		verblog('responce code : '+response)
		request(url+'/1', (errorl,responsel,bodyl) => {
			if (errorl) throw errorl
			const l = cheerio.load(bodyl)
			res['dataurl'] = l(selcturlimgsatabase).attr('src')
			console.log(`Title: ${res['title']}\nPages: ${res['pages']}`)
			verblog('img database : '+res['dataurl'])
			
			const fs = require("fs"); 
			const path = res['title']; 
			fs.access(path, (error) => { 
			if (error) { 
				fs.mkdir(path, (error) => { 
				if (error) { 
					console.log(error); 
				} else { 
					getImgs(res['dataurl'],res['pages'],res['title'])
				} 
				}); 
			} else { 
				console.log("You alredy downloaded this hentai"); 
				getImgs(res['dataurl'],res['pages'],res['title'])
			} 
			}); 
			
		})
	})
}


let urlbase = prom('url (just accept url like "https://nhentai.to/g/328483") : ')
const nhinfo = fetchinfo(urlbase)