const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;


// Validate Function to check title length
let titleLengthChecker = (title) => {
  // Check if title exists
  if (!title) {
    return false; // Return error
  } else {
    // Check the length of title string
    if (title.length < 5 || title.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid title
    }
  }
};

// Validate Function to check if valid title format
let validTitleChecker = (title) => {
  // Check if title exists
  if (!title) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid title
    const regExp = new RegExp(/^[A-Za-z0-9 ]+$/);
    return regExp.test(title); // Return regular expression test results (true or false)
  }
};

// Array of title Validators
const titleValidators = [
  // First title Validator
  {
    validator: titleLengthChecker,
    message: 'Title must be at least 5 characters but no more than 50'
  },
  // Second title Validator
  {
    validator: validTitleChecker,
    message: 'Title can only contain letter or number'
  }
];

// Validate Function to check body length
let bodyLengthChecker = (body) => {
  // Check if body exists
  if (!body) {
    return false; // Return error
  } else {
    // Check length of body string
    if ( body.length < 3 ) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid body
    }
  }
};

// Array of body validators
const bodyValidators = [
  // First body validator
  {
    validator: bodyLengthChecker,
    message: 'body must be at least 3 characters.'
  }
];

// Validate Function to check comment length
let commentLengthChecker = (comment) => {
  // Check if comment exists
  if (!comment[0]) {
    return false; // Return error
  } else {
    // Check comment length
    if (comment[0].length < 1) {
      return false; // Return error if comment length requirement is not met
    } else {
      return true; // Return cmment as valid
    }
  }
};

// Array of comment  validators
const commentValidators = [
  // First password validator
  {
    validator: commentLengthChecker,
    message: 'Password must be at least 1 character.'
  }
];


const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    validate: titleValidators
  },
  body: {
    type: String,
    required: true,
    validate: bodyValidators
  },
  createdBy: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy:{
    type: Array
  },
  dislikes: {
    type: Number,
    default: 0
  },
  dislikedBy:{
    type: Array
  },
  comments: [
    {
      comment: { type: String, validate: commentValidators },
      commentBy: { type: String }
    }
  ]
})



module.exports = mongoose.model('Blog', blogSchema);