const writeRegister = require('../model/register_model');
const User = require('../model/user');
const crypto = require('../model/encryption')

const Member = {
	register: (req, res, next)=>{
		res.render('register');
	},

	handleRegister: (req, res, next)=>{
		const password = crypto(req.body.password);
		const memberData= {
  			name: req.body.name,
  			email: req.body.email,
  			password: req.body.password
		}

		// check fill all space
		if(!memberData.name || !memberData.email || !memberData.password){
			req.flash('errorMessage', '請完成所有欄位');
			return next();
		}

		memberData.password = password;
		
		user = new User(memberData);
		// check repeat register

		user.findUser()
			.then(([rows, fields]) => {
				if(rows.length > 1){
					req.flash('errorMessage', '使用者已存在');
					return next();
				}
			})
			.then(()=>user.findEmail())
			.then(([rows, fields]) => {
				console.log(rows);
				if(rows.length > 1){
					req.flash('errorMessage', '此帳戶已註冊');
					return next();					
				}else{
					user.writeData(memberData)
						.then(()=>{
							req.session.name = memberData.name;
							res.redirect('/');
						})
					}
			})		
			.catch(error=>{
				console.log(error);
				req.flash('errorMessage', '伺服器問題請稍後再試');
				return next();
			})
	},
	
	login: (req, res, next)=>{
		res.render('login');
	},

	handleLogin: (req, res, next)=>{
		const password = crypto(req.body.password);
		const verifyData = {
			name: undefined,
			email: req.body.email,
			password: password
		}

		user = new User(verifyData);
		user.verify()
			.then(([rows,fields]) => {
				if(rows.length > 0){
					req.session.name = rows[0].name;
					res.redirect('/');			
				}else{
					req.flash('errorMessage', '帳號密碼錯誤');
					return next();
				}

		}, (err) =>{
			console.log(err);
			req.flash('errorMessage', '伺服器異常請稍後再試')
			return next();
		})
	},
	
	home: (req, res)=>{
		res.render('index',{
			name: req.session.name,
		});
	},

	logOut: (req, res)=>{
		req.session.name = false;
		res.redirect('/');
	}
}
module.exports = Member;