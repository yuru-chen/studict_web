const writeRegister = require('../model/register_model');
const logIn = require('../model/login_model');
const crypto = require('../model/encryption')

module.exports = class Member{
	register(req, res, next){
		res.render('register');
	}
	handleRegister(req, res, next){
		const password = crypto(req.body.password);
		const memberData= {
  			name: req.body.name,
  			email: req.body.email,
  			password: password,
  			password2: req.body.password
		}
		writeRegister(memberData).then(result => {
			req.session.name = result.name;
			res.redirect('/')
			return
		}, (err) =>{
			req.flash('errorMessage', err.err)
			res.redirect('/register')
			return
		})
	}
	logIn(req, res, next){
		res.render('login');
	}

	handleLogIn(req, res){
		const password = crypto(req.body.password);
		const verifyData = {
			email: req.body.email,
			password: password
		}
		logIn(verifyData).then(result => {
			req.session.name = result.name;
			res.redirect('/')
		}, (err) =>{
			req.flash('errorMessage', err.err)
			res.redirect('/login');
		})
	}
	home(req, res){
		res.render('index',{
			name: req.session.name,
		});
	}
	logOut(req, res){
		req.session.name = false;
		res.redirect('/');
	}

}