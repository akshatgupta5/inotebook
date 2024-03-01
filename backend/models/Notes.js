const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  title: {type: String,
    required: [true, 'Name field is required']
  },
  description: {type: String,
    required: [true, 'Email field is required']
  },
  tag: {type: String,  
    default: "General"
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('notes', NoteSchema);