const mongoose = require('mongoose');

// Schema cho chi tiết sản phẩm trong giỏ hàng
const productInCartSchema = new mongoose.Schema({
   _id: { type: String, required: true},
    color: { type: String },
    id_product: { type: String },
    imgProduct: { type: String },
    nameProduct: { type: String },
    number: { type: Number },
    price: { type: Number },
    size: { type: String },
});

// Schema chính cho giỏ hàng
const CartSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, 
    default: () => new mongoose.Types.ObjectId(),
  },
  id: {
    type: String,
    required: true,
  },
  details: [productInCartSchema],
});

// Tạo model từ schema
const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
