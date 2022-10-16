const db = require('./connection_db');

module.exports = function logIn(verifyData) {
    let result = {};
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM member_info WHERE email = ? AND password = ?', [verifyData.email, verifyData.password], function (err, rows) {
            if(err){
                console.log(err);
                result.status = "登入失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;               
            }if(rows.length < 1){
                result.status = "登入失敗"
                result.err = "帳號密碼不符"
                reject(result);
                return; 
            }
            result.name = rows[0].name
            resolve(result);
        })
    })
}