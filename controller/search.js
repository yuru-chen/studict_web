var Searching = require('../model/search')

const search = {
	voc: (req, res)=>{
		res.render('search');
	},

	searchVoc: async (req, res)=>{
		const voc = req.body.voc;
		console.log(voc)
		vocabulary = new Searching();
		vocabulary.searchVoc(voc)
			.then((result)=>{
				res.json(result)
			})
			.catch((err)=>{
				req.flash('errorMessage', '伺服器有問題請稍候再試')
			})
	},

	article: (req, res)=>{
		res.render('article');
	},

	searchArticle: async(req,res)=>{
		let arti = req.body.article;
		//split article
		// art = art.split(/(?<=,| |:|"|\(|\)|\?|“|'|’|‘)|(?=,| |:|"|\(|\)|\?|\n|“|'|’|‘)/)
		//1. ignore stop word 2. search voc in dic -> if bnc=0 & exchange = '%/1%' -> find the /0
		article = new Searching();
		let result = await article.searchArticle(arti)
		console.log(result)
		// res.render('article', result)
		res.send(result)

	},
}

module.exports = search;