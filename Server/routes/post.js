const express = require('express')
const router = express.Router();
const mongojs = require('mongojs');
const db_access = require('../config/db_config');
const db = mongojs(db_access);

router.get('/posts', function(req, res, next){
  res.send('Post Page');
})

module.exports = router;