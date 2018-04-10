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

router.delete('/deleteBlog/:id', (req, res)=>{
  if(!req.params.id){
    res.json({ success: false, message: 'No id provided.' });
  } else {
    Blog.findOne({ _id: req.params.id }, (err, blog)=>{
      if(err){
        res.json({success: false, message: err });
      } else {
        if(!blog){
          res.json({success: false, message: "No blog found to delete." });
        } else {
          User.findOne({ _id: req.decoded.userId }, (err, user)=>{
            if(err){
              res.json({ success: false, message: "Unable to authenticate user."});
            } else {
              if( user.username !== blog.createdBy){
                res.json({ success: false, message: "You do not have permission to delete."});
              } else {
                blog.remove((err)=>{
                  if(err){
                    res.json({ success: false, message: err });
                  } else {
                    res.json({ success: true, message: "Blog deleted!"});
                  }
                })
              }
            }
          })  
        }
      }
    });
  }
})

router.put('/likeBlog', (req, res)=>{
  if(!req.body.id){
    res.json({ success: false, message: "No id provided" });
  } else {
    Blog.findOne( {_id: req.body.id }, (err, blog)=>{
      if(err){
        res.json({ success: false, message: err});
      } else {
        if(!blog){
          res.json({ success: false, message: "That blog is not found." });
        } else {
          User.findOne({ _id: req.decoded.userId }, (err, user)=>{
            if(err){
              res.json({ success: false, message: err });
            } else {
              if(!user){
                res.json({ success: false, message: "No user provided" });
              } else if (user.username === blog.createdBy){
                res.json({ success: false, message: "You could not vote for your blog." });
              } else {
                if(blog.likedBy.includes(user.username)){
                  res.json({ success: false, message: "You already like this blog." });
                } else {
                  if(blog.dislikedBy.includes(user.username)){
                    blog.dislikes--;
                    const arrayIndex = blog.dislikedBy.indexOf(user.username);
                    blog.dislikedBy.splice(arrayIndex, 1);
                    blog.likes++;
                    blog.likedBy.push(user.username);
                    blog.save((err)=>{
                      if(err){
                        res.json({
                          success: false,
                          message: err
                        });
                      } else {
                        res.json({
                          success: true,
                          message: "Blog Liked."
                        });
                      }
                    })
                  } else {
                    blog.likes++;
                    blog.likedBy.push(user.username);
                    blog.save((err)=>{
                      if(err){
                        res.json({
                          success: false,
                          message: err
                        });
                      } else {
                        res.json({
                          success: true,
                          message: "Blog Liked."
                        });
                      }
                    });
                  }
                }
              }
            }
          });
        }
      }
    });
  }
})

router.put('/dislikeBlog', (req, res)=>{
  if(!req.body.id){
    res.json({ success: false, message: "No id provided" });
  } else {
    Blog.findOne( {_id: req.body.id }, (err, blog)=>{
      if(err){
        res.json({ success: false, message: err});
      } else {
        if(!blog){
          res.json({ success: false, message: "That blog is not found." });
        } else {
          User.findOne({ _id: req.decoded.userId }, (err, user)=>{
            if(err){
              res.json({ success: false, message: err });
            } else {
              if(!user){
                res.json({ success: false, message: "No user provided" });
              } else if (user.username === blog.createdBy){
                res.json({ success: false, message: "You could not vote for your blog." });
              } else {
                if(blog.dislikedBy.includes(user.username)){
                  res.json({ success: false, message: "You already dislike this blog." });
                } else {
                  if(blog.likedBy.includes(user.username)){
                    blog.likes--;
                    const arrayIndex = blog.dislikedBy.indexOf(user.username);
                    blog.likedBy.splice(arrayIndex, 1);
                    blog.dislikes++;
                    blog.dislikedBy.push(user.username);
                    blog.save((err)=>{
                      if(err){
                        res.json({
                          success: false,
                          message: err
                        });
                      } else {
                        res.json({
                          success: true,
                          message: "Blog disliked."
                        });
                      }
                    })
                  } else {
                    blog.dislikes++;
                    blog.dislikedBy.push(user.username);
                    blog.save((err)=>{
                      if(err){
                        res.json({
                          success: false,
                          message: err
                        });
                      } else {
                        res.json({
                          success: true,
                          message: "Blog disiked."
                        });
                      }
                    });
                  }
                }
              }
            }
          });
        }
      }
    });
  }
})

router.post('/comment', (req, res) => {
  // Check if comment was provided in request body
  if (!req.body.comment) {
    res.json({ success: false, message: 'No comment provided' }); // Return error message
  } else {
    // Check if id was provided in request body
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided' }); // Return error message
    } else {
      // Use id to search for blog post in database
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid blog id' }); // Return error message
        } else {
          // Check if id matched the id of any blog post in the database
          if (!blog) {
            res.json({ success: false, message: 'Blog not found.' }); // Return error message
          } else {
            // Grab data of user that is logged in
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong' }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'User not found.' }); // Return error message
                } else {
                  // Add the new comment to the blog post's array
                  blog.comments.push({
                    comment: req.body.comment, // Comment field
                    commentBy: user.username // Person who commented
                  });
                  // Save blog post
                  blog.save((err) => {
                    // Check if error was found
                    if (err) {
                      res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                    } else {
                      res.json({ success: true, message: 'Comment saved' }); // Return success message
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  }
});

module.exports = router;