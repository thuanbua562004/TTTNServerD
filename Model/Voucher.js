const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  voucherCode: { type: String, required: true, unique: true }, 
  discountValue: { type: Number, required: true }, 
  endDate: { type: String, required: true }, 
  usageLimit: { type: Number, default: null }, 
}, {
  timestamps: true,
});

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
