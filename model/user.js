const db = require('./connection_db');

module.exports = class user{
    constructor(Data){
        this.name = Data.name;
        this.email = Data.email;
        this.password = Data.password;
        this.Data = Data;
        db.execute()
    }

    findUser(){
        return db.promise().query('SELECT * FROM member_info WHERE name = ?', this.name);
    }

    findEmail(){
        return db.promise().query('SELECT * FROM member_info WHERE email = ?', this.email);
    }

    verify(){
        return db.promise().query('SELECT * FROM member_info WHERE email = ? AND password = ?', [this.email, this.password]);
    }

    writeData(){
        return db.promise().query('INSERT INTO member_info SET ?', this.Data);
    }
}