const mongoose = require('mongoose');

const connectDb = async()=>{
  await mongoose.connect("mongodb://127.0.0.1:27017/mern-chat-app")
  .then( console.log('mongo db connected successfully !!'))
  .catch(err => console.log('Error: ', err.message))
}

module.exports = connectDb;