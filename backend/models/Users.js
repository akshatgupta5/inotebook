const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {type: String,
    required: [true, 'Name field is required']
  },
  email: {type: String,
    required: [true, 'Email field is required'],
    unique: [true, 'Email already exists']
  },
  password: {type: String,  
    required: [true, 'Password field is required']
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('users', UserSchema);