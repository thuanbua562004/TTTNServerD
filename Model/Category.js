const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toHexString(),
        required: true,
    },
    loai: { type: String, required: true },

});

const Category = mongoose.model('categorys', categorySchema);
module.exports = Category;
