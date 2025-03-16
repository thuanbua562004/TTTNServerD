const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json()); 
let router = express.Router();
const tokenStore = new Map();
const crypto = require('crypto'); 
const User = require('../Model/User');

router.post('/send-reset-password-link', async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ message: 'Email là bắt buộc.' });
    }
    const token = crypto.randomBytes(20).toString('hex');
    tokenStore.set(token, email);

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
      user: 'vanthuan562004@gmail.com',
      pass: 'jsun tpst cgjl afko'
    }
    });
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Đổi mật khẩu của bạn',
      text: `Vui lòng nhấp vào liên kết sau để đổi mật khẩu: ${resetLink}`,
      html: `<p>Vui lòng nhấp vào liên kết sau để đổi mật khẩu:</p>
             <a href="${resetLink}">${resetLink}</a>`
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Liên kết đổi mật khẩu đã được gửi.' });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại.' });
  }
});
router.post('/reset-password', async (req, res) => {
  const { token, newPass } = req.body;
  
  try {
    if (tokenStore.has(token)) {
      const email = tokenStore.get(token); // Lấy email từ tokenStore
      const user = await User.findOne({ 'details.email': email });
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại.' });
      }
      user.details.password = newPass;
      await user.save();
      tokenStore.delete(token);
      return res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
    } else {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
  } catch (error) {
    console.error('Lỗi khi đặt lại mật khẩu:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống. Vui lòng thử lại sau.' });
  }
});




module.exports = router;
