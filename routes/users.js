var express = require('express');
var router = express.Router();

var dbget = require('../db/get.js');
var dball = require('../db/all.js');
var dbdo = require('../db/exec');

const db = require('../models/index');


/* Login page */
router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'Login',
        login: req.session.login,
    });
});
router.post('/login', async function(req, res, next) {

    let account = req.body.account;
    let pass = req.body.password;

    db.users.findAll({
        where: {
            account: account,
            password: pass
        }
    }).then(users => {
        // その後の処理を書く
        if (users.length == 1) {
            req.session.login = users[0];
        }
        res.redirect('/');
    });
});

/* Logout */
router.get('/logout', function(req, res, next) {
    req.session.login = undefined;
    res.redirect('/users/login');
});

/* Admin (Add New User) */
router.get('/admin', async function(req, res, next) {
    if (req.session.login == undefined) {
        res.redirect('/users/login');
    }
    if (req.session.login.role != 'admin') {
        res.redirect('/users/login');
    }
    res.render('admin', {
        title: 'Admin',
        login: req.session.login,
    });
});
router.post('/admin', async function(req, res, next) {
    let account = req.body.account;
    let pass = req.body.password;
    let name = req.body.name;

    db.sequelize.sync().then(() => db.users.create({
        account: account,
        password: pass,
        name: name,
        role: 'user'
    }))
        .then(user => {
            res.render('admin', {
                title: 'Admin',
                login: req.session.login,
            })
        });
});

/* Show User List */
router.get('/admin2', async function(req, res, next) {
    if (req.session.login == undefined) {
        res.redirect('/users/login');
    }
    if (req.session.login.role != 'admin') {
        res.redirect('/users/login');
    }

    db.users.findAll().then(users => {
        res.render('admin2', {
            title: 'Admin2',
            login: req.session.login,
            data: users
        });
    });
});

/* Delete User */
router.get('del_usr', async function(req, res, next) {
    if (req.session.login == undefined) {
        res.redirect('/users/login');
    }
    if (req.session.login.role != 'admin') {
        res.redirect('/users/login');
    }
    let id = req.query.id;
    let sql = 'delete from users where id=' + id;
    await dbdo.exec(sql);
    res.redirect('/users/admin2');
});


module.exports = router;
