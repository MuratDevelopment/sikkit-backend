const express = require('express');
const router = express.Router();
const isAuth = require('../config/authMiddleware').isAuth;

const Post = require('../models/Post');
const Sub = require('../models/Sub');


router.post('/create',isAuth, (req, res) => {
    // check if the user is banned from creating posts to the sub
    Sub.findById(req.body.subId).then(sub => {
        if (sub.bannedUsers.includes(req.user.id)) {
            return res.json({
                status: 'FAILED',
                message: 'You are banned from creating posts to this sub!'
            });
        }
    });

    if (!req.body.title || !req.body.content || !req.body.subId) return res.json({
        status: 'FAILED',
        message: 'You must provide a title, content and a subId'
    })
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        creator: req.user.id,
        parentSub: req.body.subId
    });
    newPost.save()
        .then(post => res.json(post))
        .catch(err => res.json(err));
});

router.get('/allPostOfUser',isAuth, (req, res) => {
    Post.find({creator: req.user.id}).sort({createdAt: -1})
        .then(posts => res.json(posts))
        .catch(err => res.json(err));
}
);

router.post('/allPostfromUserID', (req, res) => {
    if (!req.body.id) return res.json({
        status: 'FAILED',
        message: 'You need to provide a user id'
    })
    Post.find({creator: req.body.id}).sort({createdAt: -1})
        .then(posts => res.json(posts))
        .catch(err => res.json(err));
}
);

router.post('/getPost', (req, res) => {
    if (!req.body.id) return res.json({
        status: 'FAILED',
        message: 'You need to provide a post id'
    })
    Post.findById(req.body.id)
        .then(post => res.json(post))
        .catch(err => res.json(err));
}
);

router.get('/allPosts', (req, res) => {
    Post.find().sort({createdAt: -1})
        .then(posts => res.json(posts))
        .catch(err => res.json(err));
}
);

router.post('/allPostsFromSub', (req, res) => {
    if (!req.body.id) return res.json({
        status: 'FAILED',
        message: 'You need to provide a sub id'
    })
    Post.find({parentSub: req.body.id}).sort({createdAt: -1})
        .then(posts => res.json(posts))
        .catch(err => res.json(err));
}
);


router.delete('/delete', isAuth,(req, res) => {
    if (!req.body.id) return res.json({
        status: 'FAILED',
        message: 'You need to provide a post id'
    })
    Post.findOne({_id: req.body.id})
        .then(post => {
            if (!post) return res.json({
                status: 'FAILED',
                message: 'Post not found'
            })
            if(post.creator == req.user.id){
                Post.deleteOne({_id: req.body.id})
                    .then(() => res.json({
                        status: 'SUCCESS',
                        message: 'The post has been deleted'
                    }))
                    .catch(err => res.json(err));
            } else {
                res.json({
                    status: 'FAILED',
                    message: 'You are not authorized to delete this post'
                });
            }
        }
        )
        .catch(err => res.json(err));
}
);

module.exports = router;
