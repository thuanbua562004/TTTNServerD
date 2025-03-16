const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true,
      default: () => new mongoose.Types.ObjectId().toHexString(),
      unique: true
    },
    details: {
      email:{type: String , default: null},
      password:{type: String , default: null},
      address: { type: String,  default: null },
      dateBirth: { type: String,  default: null },
      name: { type: String,  default: null },
      img: { type: String,  default: null },
      phoneNumber: { type: String,  default: null, match: /^[0-9]{10}$/ }
    }
  }, {
    versionKey: false 
  });
module.exports = mongoose.model('User', userSchema);
