const mongoose = require('mongoose');
const mongooseuri = 'mongodb://localhost:27017/yourdb';
mongoose.connect(mongooseuri, { useNewUrlParser: true, useUnifiedTopology: true });