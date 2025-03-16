
const mongoose = require('../config/ConnectMongo.js');
const User = require('../Model/User');
const Product = require('../Model/Product.js');
const Cart = require('../Model/Cart.js');
const Notifi = require('../Model/Notifi.js');
const HistoryBuy = require('../Model/HistoryBuy.js');
const Voucher = require('../Model/Voucher.js');
const Comment = require('../Model/Comment.js');
const Category = require('../Model/Category.js');

const connect=require('../config/ConnectMongo.js')
connect();
////////////////Api User////////////////

let getUser = async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  console.log(email, password);
  try {
    const user = await User.findOne({ 'details.email': email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    const isPasswordValid = (password === user.details.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid  ');
    }
    return res.status(200).send(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).send('Error fetching user');
  }
}

let createUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const id = req.body.id;
    const isCheckUser = await User.findOne(({ "details.email": email }));

    if (isCheckUser) {
      return res.status(409).json({ message: 'User đã tồn tại' });
    }
    const saveUser = await new User({
      id: id,
      details: {
        email: email,
        password: password
      }
    }).save();
    res.status(201).json(saveUser);
  } catch (err) {
    console.error('Lỗi khi tạo :', err);
    res.status(500).send('Lỗi khi thêm ');
  }
}

let updateUser = async (req, res) => {
  try {
    const _id = req.body.id;
    const { address, phone, name, dateBirth } = req.body;

    const updateFields = {};
    if (address !== null && address !== undefined) updateFields['details.address'] = address;
    if (phone !== null && phone !== undefined) updateFields['details.phoneNumber'] = phone;
    if (name !== null && name !== undefined) updateFields['details.name'] = name;
    if (dateBirth !== null && dateBirth !== undefined) updateFields['details.dateBirth'] = dateBirth;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send('No valid fields provided for update');
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('Không tìm thấy người dùng');
    }

    return res.status(200).send(updatedUser);
  } catch (err) {
    console.error('Lỗi khi cập nhật người dùng:', err);
    res.status(500).send('Lỗi khi cập nhật người dùng');
  }
};



let deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await User.findOneAndDelete({ _id: id });

    if (!result) {
      return res.status(404).send('Không tìm thấy sách');
    }

    res.send(`Đã xóa sách với ID: ${id}`);
  } catch (err) {
    console.error('Lỗi khi xóa sách:', err);
    res.status(500).send('Lỗi khi xóa sách');
  }
}
////////////////Api Product////////////////
let getListProduct = async (req, res) => {
  const category = req.params.category;
  console.log(category);

  if (category === undefined || category === "undefined") {
    const list = await Product.find();
    if (!list) {
      res.status(404).send('Không tìm thấy');
    } else {
      res.status(200).json(list);
    }
  } else {
    const list = await Product.find({ "details.loai": category });
    if (!list) {
      res.status(404).send('Không tìm thấy');
    } else {
      res.status(200).json(list);
    }
  }



}
let getProductDetail = async (req, res) => {
  const id = req.params.id;
  const pro = await Product.find(
    { _id: id }
  );
  if (pro.length == 0) {
    res.status(404).send('Không tìm thấy');
  } else {
    res.status(200).json(pro);
  }

}

let createProduct = async (req, res) => {
  try {
    const { productName, price, info, category, variants } = req.body;
    console.log(variants)
    const formattedVariants = variants.map(variant => ({
      color: variant.color,
      imageUrl: variant.imageUrl,
      sizes: variant.sizes.map(size => ({
        size: size.size,
        quantity: size.quantity,
        sold: size.sold || 0,
      }))
    }));

    const newProduct = new Product({
      "details.name": productName,
      "details.price": price,
      "details.info": info,
      "details.loai": category,
      "details.imgForColor": formattedVariants,
    });

    const response = await newProduct.save();
    res.status(201).json(response);
  } catch (e) {
    console.error("Error creating product:", e);
    res.status(400).json({ message: "Failed to create product", error: e.message });
  }
};
let updateProduct = async (req, res) => {
  try {
    const {_id, productName, price, info, category, variants } = req.body; // Dữ liệu gửi lên

    console.log("Variants received:", variants);

    // Định dạng lại `variants` nếu có
    const formattedVariants = variants.map(variant => ({
      color: variant.color,
      imageUrl: variant.imageUrl,
      sizes: variant.sizes
        .filter(size => size.size && size.size !== "")  // Lọc các size không hợp lệ
        .map(size => ({
          size: size.size,
          quantity: size.quantity,
          sold: size.sold || 0, // Mặc định là 0 nếu không có
        })),
    }));
    

    // Thực hiện cập nhật sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      _id, // ID của sản phẩm cần cập nhật
      {
        "details.name": productName,
        "details.price": price,
        "details.info": info,
        "details.loai": category,
        "details.imgForColor": formattedVariants,
      },
      { new: true, runValidators: true } // Trả về sản phẩm sau khi cập nhật
    );

    // Kiểm tra nếu sản phẩm không tồn tại
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Trả về sản phẩm đã cập nhật
    res.status(200).json(updatedProduct);
  } catch (e) {
    console.error("Error updating product:", e);
    res.status(400).json({ message: "Failed to update product", error: e.message });
  }
};
const updateQuantity = async(req,res)=>{
  const products = req.body.products;
  console.log("Received products:", products); // Thêm dòng này để kiểm tra

  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Products must be a valid non-empty array");
  }
  try {
    // Tạo danh sách các thao tác cập nhật
    const bulkOperations = products.map(({ productId, color, size, quantitySold }) => ({
      updateOne: {
        filter: {
          _id:  productId.split('_')[0],
          "details.imgForColor.color": color,
          "details.imgForColor.sizes.size": size
        },
        update: {
          $inc: {
            sold: quantitySold,
            "details.imgForColor.$[color].sizes.$[size].quantity": -quantitySold
          }
        },
        arrayFilters: [
          { "color.color": color },
          { "size.size": size }
        ]
      }
    }));

    // Thực hiện cập nhật hàng loạt
    const result = await Product.bulkWrite(bulkOperations);
    return result;
  } catch (error) {
    console.error("Lỗi cập nhật nhiều sản phẩm:", error.message);
    throw error;
  }
};
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await Product.findByIdAndDelete(id);
    if (!response) {
      res.status(404).send('Không tìm thấy sản phẩm');
    } else {
      res.status(200).send(`Đã xóa sản phẩm với ID: ${id}`);
    }
  } catch (e) {
    res.status(500).json({ message: "Failed to delete product", error: e.message });
  }
}

let getNoitfi = async (req, res) => {

  const listNoti = await Notifi.find();
  if (listNoti == null) {
    res.status(404).send('Không tìm thấy');
  } else if (listNoti.length < 0 && listNoti == "") {
    res.status(404).send('Không tìm thấy');
  }
  else {
    res.status(200).json(listNoti);
  }
}

//// api Cart 
let getListCart = async (req, res) => {
  try {
    const id = req.body.id
    const listCart = await Cart.find(
      { id: id }
    );

    if (listCart.length === 0) {
      return res.status(404).send('Không tìm thấy giỏ hàng');
    } else {
      return res.status(200).json(listCart);
    }
  } catch (e) {
    // Ghi log lỗi để dễ dàng theo dõi
    console.error(e);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy giỏ hàng' });
  }
};

let updateCart = async (req, res) => {
  try {
    const user_id = req.body.userid;
    const id_color_size = req.body.color_size;
    const number = req.body.number;
    console.log(user_id, id_color_size, number)
    const cart = await Cart.findOneAndUpdate(
      { id: user_id, 'details._id': id_color_size },
      { $set: { 'details.$.number': number } },
      { new: true }
    );

    if (!cart) {
      res.status(404).send({ message: 'Không tìm thấy giỏ hàng' });
    } else {
      res.status(200).json(cart);
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};
let delItemCart = async (req, res) => {
  try {
    const userId = req.body.userid;
    const id_color_size = req.body.color_size;
    console.log(userId, id_color_size)
    const cart = await Cart.findOneAndUpdate(
      { id: userId },
      { $pull: { details: { _id: id_color_size } } },
      { new: true }
    );
    if (!cart) {
      res.status(404).send({ message: 'Không tìm thấy  hàng' });
    } else {
      res.status(200).json(cart);
    }
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
}
const addCart = async (req, res) => {
  const userId = req.body.userId;
  const id_color_size = req.body.id_color_size;
  const color = req.body.color;
  const id_product = req.body.productId;
  const imgProduct = req.body.imgProduct;
  const nameProduct = req.body.nameProduct;
  const number = req.body.number;
  const price = req.body.price;
  const size = req.body.size;
  try {
    const isCheckCart = await Cart.findOne({ id: userId });

    if (!isCheckCart) {
      const newCart = new Cart({
        id: userId,
        details: [
          {
            _id: id_color_size,
            color: color,
            id_product: id_product,
            imgProduct: imgProduct,
            nameProduct: nameProduct,
            number: number,
            price: price,
            size: size,
          },
        ],
      });
      const savedCart = await newCart.save();
      console.log('Giỏ hàng mới đã được tạo và lưu:', savedCart);
      res.send(savedCart);
    } else {
      const productId = id_color_size;
      const isCheckProduct = isCheckCart.details.find(item => item.id === productId);

      if (!isCheckProduct) {
        isCheckCart.details.push({
          _id: id_color_size,
          color: color,
          id_product: id_product,
          imgProduct: imgProduct,
          nameProduct: nameProduct,
          number: number,
          price: price,
          size: size,
        });
        const updatedCart = await isCheckCart.save();
        console.log('Giỏ hàng đã được cập nhật:', updatedCart);
        res.send(updatedCart);
      } else {
        res.status(501).send(`Sản phẩm đã có trong giỏ hàng!`);
      }
    }
  } catch (error) {
    console.error('Lỗi khi xử lý:', error.message);
    res.status(500).send(`Lỗi: ${error.message}`);
  }


};
let deleteCart = async (req, res) => {
  try {
    const userId = req.body.userid;
    const cart = await Cart.findOneAndDelete({ id: userId });
    if (!cart) {
      res.status(404).send({ message: 'Không tìm thấy  hàng' });
    } else {
      res.status(200).json(cart);
    }
  } catch (err) {
    res.status(404).send({ message: err.message });
  }
}

///// Api history buy 
const getHistory = async (req, res) => {
  try {
    const history = await HistoryBuy.find({});
    res.status(200).json(history);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
const updateStatus = async (req, res) => {
  try {
    const _id = req.body._id;
    const status = req.body.status;
    console.log(status ,_id);
    const history = await HistoryBuy.findByIdAndUpdate(_id, { stage: status }, { new: true });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
const getHistoryUser = async (req, res) => {
  try {
    const id = req.params.id;
    const history = await HistoryBuy.find({
      id: id
    });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
const addCHistoryBuy = async (req, res) => {
  try {

    const id = req.body.id;
    const id_order = req.body.id_order;
    const address = req.body.address;
    const method = req.body.method;
    const totalPrice = req.body.totalPrice;
    const phone = req.body.phone;
    const note = req.body.note;
    const listProduct = req.body.listProduct;
    const saveHistory = new HistoryBuy({
      _id: id_order,
      id: id,
      adress: address,
      methodPayload: method,
      totalPrice: totalPrice,
      note: note,
      phone: phone,
      listProduct: listProduct
    });
    const responsive = await saveHistory.save();
    res.status(200).json({
      message: "Successfully",
      data: responsive
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: err.message });
  }

};
const addVoucher = async (req, res) => {
  const voucherCode = req.body.code
  const discountValue = req.body.discount
  const endDate = req.body.endDate
  const usageLimit = req.body.usageLimit
  try {
    const voucher = new Voucher({
      voucherCode: voucherCode,
      discountValue: discountValue,
      endDate: endDate,
      usageLimit: usageLimit
    });
    const resphone = await voucher.save();
    res.status(200).send(resphone)
    return voucher;
  } catch (e) {
    res.status(404).send("Trùng mã")
  }
}
const getVoucher = async (req, res) => {
  const id = req.params.id;
  console.log(id)
  try {
    const resphone = await Voucher.findOne({
      voucherCode: id
    })
    if (resphone == null) {
      res.status(203).send("Không đúng")
    } else {
      res.status(200).send(resphone)
    }
  } catch (e) {
    res.status(404).send("Không đúng")
  }
}
const addComment = async (req, res) => {
  try {
    const { content, images, email, id_product } = req.body;

    if (!content || !email) {
      return res.status(400).json({
        message: "Content and email are required",
      });
    }

    const comment = {
      content,
      images: images || [], // Nếu images không có thì gán mảng rỗng
      email,
    };

    const updatedProduct = await Comment.findOneAndUpdate(
      { id: id_product }, // Điều kiện tìm sản phẩm
      { $push: { comments: comment } }, // Thêm comment vào mảng
      { new: true, upsert: true } // Tạo mới nếu không tìm thấy sản phẩm
    );

    return res.status(201).json({
      message: "Comment added successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
};
const deleteComment = async (req, res) => {
  try {
    const id_comment = req.body.id_comment;
    const id_product = req.body.id_product;
    console.log(id_comment)
    const result = await Comment.findOneAndUpdate(
      { id: id_product }, // Tìm sản phẩm theo id
      { $pull: { comments: { _id: id_comment } } }, // Xóa comment với _id là id_comment
      { new: true } // Trả về tài liệu mới sau khi cập nhật
    );
    if (!result) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm hoặc comment' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
const getComment = async (req, res) => {
  try {
    const id = req.params.id;
    const comment = await Comment.findOne({
      id: id
    })
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}


const getCategory = async (req, res) => {
  try {
    const category = await Category.find();
    if (category) {
      res.status(200).send(category)
    }
  } catch (error) {
    console.error(error)
  }
}
const addCategory = async (req, res) => {
  try {
    const category = req.body.category;
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    const newCategory = new Category({
      loai: category,
    });
    const savedCategory = await newCategory.save();
    res.status(200).json({
      message: 'Category added successfully',
      data: savedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while adding the category',
      error: error.message,
    });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy loại sản phẩm' });
    }
    res.status(200).json(category);
  } catch (e) {
    res.status(500).send({ message });
  }
}

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getListProduct,
  getProductDetail,
  deleteProduct,
  getListCart,
  getNoitfi,
  addCart,
  updateCart,
  delItemCart,
  addCHistoryBuy,
  deleteCart,
  getHistory,
  getHistoryUser,
  addVoucher,
  getVoucher,
  addComment,
  getComment,
  deleteComment,
  getCategory,
  addCategory,
  createProduct,
  deleteCategory,
  updateProduct,
  updateQuantity,
  updateStatus
}