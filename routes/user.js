var express = require('express');
var router = express.Router();
var search = require('../controller/search');
var userControl = require('../controller/member');

// userControl = new userControl();

function back(req, res){
	res.redirect('back');
}

router.get('/register', userControl.register);
router.post('/register', userControl.handleRegister, back);

router.get('/login', userControl.login);
router.post('/login', userControl.handleLogin, back);

router.get('/logout', userControl.logOut);

router.get('/', userControl.home);

router.get('/search', search.voc);
router.post('/search', search.searchVoc, back);
router.get('/article', search.article);
router.post('/article', search.searchArticle, back);

module.exports = router;

