const crypto = require('crypto');

module.exports = function encrytPssword(password){
	let hashPassword = crypto.createHash('sha256');
	hashPassword.update(password);
	const rePassword = hashPassword.digest('hex')
	return rePassword;
}