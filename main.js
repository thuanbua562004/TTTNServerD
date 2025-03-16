const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
const initAPIRoute = require('./route/api');
const order = require('./route/order');
const sendCode = require('./route/sendCode');
const ManaUser = require('./route/manauser');
const momo = require('./route/momo');
const authRouter = require('./route/manauser'); // import the route
const crypto = require('crypto');

const secret = crypto.randomBytes(64).toString('hex');

const cors = require('cors');
const multer = require('multer');
const path = require('path');

const port = process.env.PORT || 5000; // Use environment variable or default to 5000

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Configure CORS to only accept requests from your frontend origin.
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());


// Cấu hình session
app.use(session({
    secret:secret, // Thay bằng secret key của bạn
    resave: false,
    saveUninitialized: true,
}));
// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);
initAPIRoute(app);
app.use('/order', order);
app.use('/momo', momo);
app.use('/code', sendCode);
app.use('/admin', ManaUser);



/////////////////upload ảnh lên localhost
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // Use path.join
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Generates unique name
    },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
    console.log('File upload request:', req.file);

    if (!req.file) {
        return res.status(400).json({ error: 'No file was uploaded.' }); // Improved error message
    }

    // You could also add file type validation here:
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({error: 'File type not allowed. Only jpeg, png, and gif are allowed'});
    }

    const filePath = `http://localhost:${port}/uploads/${req.file.filename}`;
    res.json({ filePath: filePath });
});


app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});