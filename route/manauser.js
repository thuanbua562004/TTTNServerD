const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const { ConfidentialClientApplication, LogLevel } = require('@azure/msal-node');
require('dotenv').config()
const app = express();
const sessionSecret = crypto.randomBytes(64).toString('hex');

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000 // 1 giờ
    }
}));
const router = express.Router();

const config = {
    auth: {
        clientId:"f1b41edf-ad8b-4a13-a722-26760970681d",
        authority: "https://login.microsoftonline.com/b7c1605c-ae68-41ad-bdae-ff8385ab6242",
        clientSecret:   "GuX8Q~6kHXdAwXCd~Ui.gU41mPO16x3GKiHU6clw"
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            logLevel: LogLevel.Verbose,
            piiLoggingEnabled: false,
        },
    },
};

const cca = new ConfidentialClientApplication(config);

const authCodeUrlParameters = {
    scopes: ['openid', 'profile', 'email', "api://f1b41edf-ad8b-4a13-a722-26760970681d/admin_access"],
    redirectUri: 'https://tttnserverd.onrender.com/admin/auth/openid/return'
};

router.get('/auth/openid', async (req, res) => {
    const authCodeUrl = await cca.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authCodeUrl);
});

router.get('/auth/openid/return', async (req, res) => {
    console.log('Đã vào /admin/auth/openid/return');
    try {
        const tokenResponse = await cca.acquireTokenByCode({
            code: req.query.code,
            redirectUri: 'https://tttnserverd.onrender.com/admin/auth/openid/return',
            scopes: ['openid', 'profile', 'email', 'api://f1b41edf-ad8b-4a13-a722-26760970681d/admin_access'],
        });

        const user = tokenResponse.account.username;
        req.session.user = tokenResponse.account;
        console.log('Session after save:', req.session);

        // Đảm bảo chỉ gọi res.redirect sau khi session được lưu
        req.session.save(err => {
            if (err) {
                console.error('Error saving session:', err);
                return res.redirect('http://42store.duynguyen23.io.vn:5000/admin/login'); // Điều hướng đến trang login nếu lưu session thất bại
            }

            // Điều hướng đến trang chính sau khi session được lưu
            res.redirect(`http://42store.duynguyen23.io.vn:5000/admin/home?user=${user}`);
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.redirect('http://42store.duynguyen23.io.vn:5000/admin/login');
    }
});

router.get('/auth/logout', (req, res) => {
    const logoutUri = "https://login.microsoftonline.com/contoso.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=http://42store.duynguyen23.io.vn:5000/admin/login";
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to destroy session');
        }
        res.redirect(logoutUri);
    });
});


module.exports = router
