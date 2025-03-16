const mongoose = require('mongoose');
const uri = "mongodb+srv://admin:123456thuan@cluster0.sglib.mongodb.net/Appstore";

mongoose.connect(uri, {
  useUnifiedTopology: true
  });
  
module.exports = mongoose;