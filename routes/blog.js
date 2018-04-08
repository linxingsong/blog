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

router.get('/allBlogs', (req, res)=>{
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
          blog: blogs
        });
      }
    }
  }).sort({'_id': -1});
});

//middleware for get token 
router.use((req, res, next)=>{
  const token = req.headers['authorization'];
  if(!token){
    res.json({
      success: false,
      message: 'No token provided.'
    });
  } else {
    jwt.verify(token, config.secret, (err, decoded)=>{
      if(err){
        res.json({
          success: false,
          message: "Token invalid: "+ err
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
});

router.get('/singleBlog/:id', (req, res)=>{
  if(!req.params.id){
    res.json({
      success: false,
      message: "No blog id found."
    })
  } else {
    Blog.findOne({ _id: req.params.id}, (err, blog)=>{
      if(err){
        res.json({
          success: false,
          message: err
        });
      } else {
        if(!blog){
          res.json({
            success: false,
            message: "No blog founded."
          });
        } else {
          User.findOne({_id: req.decoded.userId}, (err, user)=>{
            if(err){
              res.json({ success: flase, message: err});
            }else {
              if(!user){
                res.json({
                  success: false,
                  message: "Unable to authenticated user."
                });
              } else {
                if(user.username !== blog.createdBy){
                  res.json({ success: false, message: "You do not have permission to edit this blog."});
                } else {
                  res.json({ success: true, blog: blog });
                }
              }
            }
          });
        }
      }
    });
  }
});

router.put("/updateBlog", (req, res) => {
  if(!req.body._id){
    res.json({
      success: false,
      message: "Blog id is not provide."
    });
  } else {
    Blog.findOne( {_id: req.body._id }, (err, blog)=>{
      if(err){
        res.json({
          success: false,
          message: err
        });
      } else {
        if(!blog){
          res.json({
            success: false,
            message: "Blog id is not found."
          });
        } else {
          User.findOne({ _id: req.decoded.userId}, (err, user)=>{
            if(err){
              res.json({ success: flase, message: err});
            }else {
              if(!user){
                res.json({
                  success: false,
                  message: "Unable to authenticated user."
                });
              } else {
                if(user.username !== blog.createdBy){
                  res.json({ success: false, message: "You do not have permission to edit this blog."});
                } else {
                  blog.title= req.body.title;
                  blog.body = req.body.body;
                  blog.save((err)=>{
                    if (err) {
                      if (err.errors) {
                        res.json({ success: false, message: 'Please ensure form is filled out properly' });
                      } else {
                        res.json({ success: false, message: err }); // Return error message
                      }
                    } else {
                      res.json({ success: true, message: 'Blog Updated!' }); // Return success message
                    }
                  });
                }
              }
            }
          })
        }
      }
    })
  }
});

module.exports = router;