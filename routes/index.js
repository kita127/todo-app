var express = require('express');
var router = express.Router();

var dbget = require('../db/get.js');
var dball = require('../db/all.js');
var dbdo = require('../db/exec.js');

const db = require('../models/index');

/* User Home */
router.get('/', async function(req, res, next) {
    if (req.session.login == undefined) {
        res.redirect('/users/login');
        return;
    }
    let sql = "select *,datetime(finished,'+9 hours') from todo where user_id="
        + req.session.login.id + ' and checked = 0 and finished > CURRENT_TIMESTAMP order by finished asc limit 10';
    let records = await dball.getAllRows(sql);
    let sql2 = "select *,datetime(finished,'+9 hours') from todo where user_id=" +
        req.session.login.id + ' and checked = 0 and finished < CURRENT_TIMESTAMP order by finished desc limit 10';
    let records2 = await dball.getAllRows(sql2);
    res.render('index', {
        title: 'ToDo',
        login: req.session.login,
        data: records,
        data2: records2,
    });
});

/* Add New ToDo */
router.get('/add', function(req, res, next) {
    if (req.session.login == undefined) {
        res.redirect('/users/login');
        return;
    }
    res.render('add', {
        title: 'Add ToDo',
        login: req.session.login,
    });
});
router.post('/add', async function(req, res, next) {
    let uid = req.session.login.id;
    let title = req.body.title;
    let memo = req.body.memo;
    let finished = req.body.finished;
    let priority = req.body.priority;


    db.sequelize.sync().then(() => db.todo.create({
        user_id: uid,
        title: title,
        memo: memo,
        finished: finished,
        priority: priority
    })).then(todo => {
        console.log('add result=ok');
        res.redirect('/');
    });

    /*
    let sql = "insert into todo (user_id,title,memo,finished,priority) values("
        + uid + ",'" + title + "','" + memo + "',datetime('" + finished
        + "','-9 hours')," + priority + ")";
    let result = await dbdo.exec(sql);
    console.log('add result=' + result);
    res.redirect('/');
    */
});

/* View ToDo Detail */
router.get('/view', async function(req, res, next) {
    if (req.session.login == undefined) {
        res.redirect('/users/login');
        return;
    }
    let uid = req.session.login.id;
    let id = req.query.id;
    let sql = "select *,datetime(finished,'+9 hours') from todo where user_id=" + uid + " and checked=0 and id=" + id;
    console.log(sql);
    let record = await dbget.getRow(sql);
    res.render('view', {
        title: 'Show ToDo',
        login: req.session.login,
        data: record,
    });
});

/* Set checked to TRUE */
router.get('/complete', async function(req, res, next) {
    if (req.session.login == undefined) {
        res.redirect('/users/login');
        return;
    }
    let uid = req.session.login.id;
    let id = req.query.id;
    let sql = "update todo set checked=1 where user_id=" + uid + " and id=" + id;
    console.log(sql);
    await dbdo.exec(sql);
    res.redirect('/');
});

/* User home */
router.get('/user', async function(req, res, next) {
    if (req.session.login == undefined) {
        res.redirect('/users/login');
        return;
    }

    /* 日本日付と完了日の昇順には対応していない */
    db.todo.findAll({
        where: {
            user_id: req.session.login.id
        }
    }).then(todos => {
        res.render('user', {
            title: 'User Home',
            login: req.session.login,
            data: todos,
        });
    });

    /*
    let sql = "select *,datetime(finished,'+9 hours') from todo where user_id=" +
        req.session.login.id + ' order by finished asc';
    let records = await dball.getAllRows(sql);
    res.render('user', {
        title: 'User Home',
        login: req.session.login,
        data: records,
    });
    */
});

/* Delete ToDo */
router.get('/del_todo', async function(req, res, next) {
    if (req.session.login == undefined) {
        res.redirect('/users/login');
        return;
    }
    let id = req.query.id;
    let uid = req.session.login.id;
    let sql = 'delete from todo where id=' + id + ' and user_id=' + uid;
    await dbdo.exec(sql);
    res.redirect('/user')
});

module.exports = router;
