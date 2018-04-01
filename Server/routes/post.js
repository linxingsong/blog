const express = require('express')
const router = express.Router();
const mongojs = require('mongojs');
const db_access = require('../config/db_config');
const db = mongojs(db_access, ['blog_post']);  //collection 

router.get('/posts', function(req, res, next){
  db.blog_post.find(function(err, posts){
    if(err){
      res.send(err);
    }
    res.json(posts);
  })
})

//get single post
router.get('/posts/:id', function(req, res, next){
  db.blog_post.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, post){
    if(err){
      res.send(err);
    }
    res.json(post);
  })
});

//save task
router.post('/task', function(req, res, next){
  const post = req.body;
  if(!post.title || (task.body+'')){
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    db.blog_post.save(post, function(err, post){
      if(err){
        res.send(err);
      }
      res.json(task);
    });
  }
});

//delete post
router.delete('/posts/:id', function(req, res, next){
  db.blog_post.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, post){
    if(err){
      res.send(err);
    }
    res.json(post);
  })
});

//update post
router.put('/posts/:id', function(req, res, next){
  const new_post = req.body;
  const updatePost = {};

  if(new_post.body){
    updatePost.body = new_post.body;
  }

  if(new_post.title){
    updatePost.title = new_post.title;

    //temp hold
    updatePost.date = new Date();
  }

  if(!updatePost){
    res.status(400);
    res.json({
      "error": "Bad Data"
    })
  } else {
    db.blog_post.update({_id: mongojs.ObjectId(req.params.id)}, updatePost, {}, function(err, post){
      if(err){
        res.send(err);
      }
      res.json(post);
    });
  }
});

module.exports = router;