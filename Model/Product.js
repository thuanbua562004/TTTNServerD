const mongoose = require('mongoose');
// Schema cho size và số lượng
const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true }, // Kích cỡ (e.g., "S", "M", "L")
  quantity: { type: Number, required: true }, // Số lượng theo kích cỡ
}, { _id: false }); // Không tự động tạo _id cho sizeSchema

// Schema cho màu sắc
const colorSchema = new mongoose.Schema({
  color: { type: String, required: true }, // Màu sắc (e.g., "#FFFFFF")
  imageUrl: { type: String, required: true }, // URL ảnh của màu
  sizes: { type: [sizeSchema], required: true } // Danh sách kích cỡ và số lượng
}, { _id: false }); // Không tự động tạo _id cho colorSchema


// Schema chính cho sản phẩm
const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
    required: true,
  },
  sold: { type: Number , default: 0}
  ,
  details: {
    name: { type: String, required: true },      // Tên sản phẩm
    price: { type: Number, required: true },     // Giá sản phẩm
    info: { type: String, required: true },      // Thông tin mô tả sản phẩm
    imageIntro: { type: [String], default: [] }, // Ảnh giới thiệu chung của sản phẩm
    loai: { type: String, required: true },      // Loại sản phẩm
    imgForColor: { type: [colorSchema], required: true } // Danh sách các màu sắc và biến thể
  }
});

// Tạo model từ schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
