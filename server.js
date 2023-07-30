require('./config/db')

const express = require('express');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
require('./config/passport')
require('dotenv').config();
const isAuth = require('./config/authMiddleware').isAuth;

const userRouter = require('./api/User');
const postRouter = require('./api/Post');
const commentRouter = require('./api/Comment');
const subRouter = require('./api/Sub');
const passport = require('passport');

const secret = process.env.SECRET

const app = express();

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 *24
    }
}));

app.use(bodyParser.urlencoded( {extended: true}));
app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());

app.use('/apiv1/user', userRouter)
app.use('/apiv1/post', postRouter)
app.use('/apiv1/comment', commentRouter)
app.use('/apiv1/sub', subRouter)
app.get('/login-failure', (req, res) => {
    res.send('Login failed');
})

app.get('/login-success', (req, res) => {
    res.send('Login success');
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});