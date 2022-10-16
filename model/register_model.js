const db = require('./connection_db');

module.exports = function register(memberData) {
    let result = {};
    return new Promise((resolve, reject) => {
        if(!memberData.name || !memberData.email || !memberData.password2){
            result.err = "請完成所有欄位"
            reject(result);
            return; 
        }
        db.query('SELECT email FROM member_info WHERE email = ?', memberData.email, function (err, rows) {
            if(err){
                result.err = "伺服器錯誤，請稍後再試！"
                reject(result);
                return;               
            }if(rows.length >= 1){
                result.err = "此帳號已註冊"
                reject(result);
                return; 
            }
            delete memberData.password2;
            db.query('INSERT INTO member_info SET ?', memberData, function (err, rows) {
                if (err) {
                    result.err = "伺服器錯誤，請稍後再試！"
                    reject(result);
                    return;
                }else{
                    result.name = memberData.name;
                    // console.log("寫入成功");
                    resolve(result);
                } 
            })
        })
    })
}
