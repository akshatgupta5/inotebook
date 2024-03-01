const mongoose = require('mongoose');
const mongouri = "mongodb://localhost:27017";

const connectDB = async () => {
  try {
    await mongoose.connect(mongouri).then(()=> console.log("Connected to Mongo Successfully"));
  } catch (error) {
    console.error('Error: ', error);  }
}
module.exports = connectDB;