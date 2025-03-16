const mongoose = require('mongoose');


const notifiSchema = new mongoose.Schema({
    _id:{
        type: String,
        required: true,
        default: () => new mongoose.Types.ObjectId().toHexString(),
        unique: true
    },
    details:{
        dateCreate :{
            type: Date,
            default: Date.now()
        },
        infoNoti:{type: String, required: true},
        img1 :{type: String, required: true},
        title:{type: String, required: true}
    }
});
const Notifi = mongoose.model('Notifi',notifiSchema);
module.exports = Notifi;
