const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const router = require('express').Router();

router.post('/newBlog', (req, res) => {
  if(!req.body.title){
    res.json({
      success: false,
      message: 'Blog title could not be empty.'
    });
  } else {
    if(!req.body.body){
      res.json({
        success: false,
        message: "Blog body could not be empty."
      });
    } else {
      if(!req.body.createdBy){
        res.json({
            success: false,
            message: 'Blog create is required.'
        });
      } else {
        const blog = new Blog({
          title: req.body.title,
          body: req.body.body,
          createdBy: req.body.createdBy
        });
        blog.save((err)=>{
          if(err){
            if(err.errors){
              if(err.errors.title){
                res.json({
                  success: false,
                  message: err.errors.title.message
                });
              } else {
                if(err.errors.body){
                  res.json({
                    success: false,
                    message: err.errors.body.message
                  });
                } else {
                  res.json({
                    success: false,
                    message: err.errmsg
                  });
                }
              }
            } else {
              res.json({
                success: false,
                message: err
              });
            }
          } else {
            res.json({
              success: true,
              message: "Blog saved."
            })
          }
        })
      }
    }
  }
});

router.get('/allBlog', (req, res)=>{
  Blog.find({}, (err, blogs)=>{
    if(err){
      res.json({
        success: false,
        message: err
      });
    } else {
      if(!blogs){
        res.json({
          success: false,
          message: 'No blogs found.'
        });
      } else {
        res.json({
          success: true,
          blogs: blogs
        });
      }
    }
  });
})

module.exports = router;