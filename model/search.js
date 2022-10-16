var db = require('./connection_db');
const config = require('../config/development_config');
const axios = require('axios').default;
var natural = require('natural');
var lemma = require('wink-lemmatizer');

class search{
	clear(str){
        let s = new String();
        let flags = 0;
        for(let i=0; i < str.length;i++){
            console.log(s)
            console.log(flags)
            if(str[i] == '{' ){flags=1};

            if(flags == 0){
                s = s + str[i]
            }
            if(str[i] == '}'){
                flags=0}; 
        }
        return s;
    }

	async searchVoc(voc){
		let results = {}
		let webUrl = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'+voc+'?key='+config.internet.webKey
		let webTUrl = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/'+voc+'?key='+config.internet.webTKey
		await db.promise().query('SELECT * FROM stardict WHERE word = ?', voc)
			.then((row, fields)=>{
				if(row.length != 0){
					results.stardict = row[0]
				}else{
					results.stardict = false
				}
				
			})
			.catch((err)=> {
				console.log(err)
				results.start = false})
		await axios.get(webUrl)
			.then((r)=>{
				let data = r.data
				let res = []

				// result[0] save spelling
				let spelling = {}
				let filename = data[0].hwi.prs[0].sound.audio;
				let sub = data[0].hwi.prs[0].sound.audio[0]
				spelling.hw = data[0].hwi.hw.replaceAll('*','\u2017');				
				spelling.url = "https://media.merriam-webster.com/audio/prons/en/us/mp3/"+sub+"/"+filename+".mp3"				
				console.log(spelling.url)
				res.push(spelling)

				for(let i=0; i < data.length; i++){
					let result = {}
					//example need to clear {}
					console.log(Object.keys(data[i]))
					if('suppl' in data[i]){
						if('examples' in data[i].suppl){
							let example = [];
							let examples = data[i].suppl.examples;
							for(let e=0; e < examples.length; e++){
								example.push(this.clear(examples[e].t))
							};
							result.example = example;
						}
					}


					if('stems' in data[i].meta){		
						result.stem = data[i].meta.stems;	
					}

					result.fl = data[i].fl
					result.def = data[i].shortdef
					res.push(result)
				}
				results.web = res
			})
			.catch((err)=>{
				console.log(err)
				results.web = false;
			})
		// await axios.get(webTUrl)
		// 	.then((result)=>{
		// 		results.webT = result.data[0]
		// 	})
		// 	.catch((err)=>{
		// 		console.log(err)
		// 		results.webT = false;
		// 	})
		// console.log(results)
		return results
	}

	async searchArticle(article){
		let arti = article.toLowerCase()
		arti = arti.split(/(?:\. |\.|, |,| |:|"|-|\(|\)|\?|\n|“|'|’|‘)/)
		let results = {};
		let result = []
		let original = [];
		let beforeTag = [];
		let tagged = [];
		for(let i=0; i< arti.length; i++){
			let temp = lemma.noun(arti[i]);
			if(arti[i] == temp){
				temp = lemma.verb(arti[i])
				if(arti[i] == temp){
					temp = lemma.adjective(arti[i])
				}
			}
			original.push(temp)
		}
		for(let i=0; i< original.length; i++){
			await db.promise().query('SELECT word FROM stopwords WHERE word = ?', original[i])
				.then(([row,field])=>{
					if(row.length == 0){
						db.promise().query('SELECT translation, levels FROM stardict WHERE word = ?', original[i])
							.then(([row, field])=>{
								if(row.length > 0 && row[0].translation){
									let res = {}
									let levels = 0
									if(row[0].levels){
										levels = row[0].levels
									}else{
										levels = "Others"
									}

									beforeTag.push(arti[i])
									tagged.push({
										level: levels,
										voc: original[i]
									})

									res.voc = original[i]
									res.level = levels
									res.translation = row[0].translation
									result.push(res)
								}
							})
					}
				})
		}
		result = [...new Map(result.map((m)=>[m.voc, m])).values()]
		results.vocset = result
		results.articles = article
		results.beforeTag = beforeTag
		results.tagged = tagged
		return results
	}
}

module.exports = search