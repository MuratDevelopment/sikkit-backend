const express = require('express');
const router = express.Router();
const isAuth = require('../config/authMiddleware').isAuth;

const Comment = require('../models/Comment');

router.post('/create',isAuth, (req, res) => {
    if (!req.body.content || !req.body.postId) return res.json({
        status: 'FAILED',
        message: 'Missing required fields'
    });
    const newComment = new Comment({
        content: req.body.content,
        originalPoster: req.user.id,
        post: req.body.postId
    });
    newComment.save()
        .then(comment => res.json(comment))
        .catch(err => res.json(err));
});

router.post('/allCommentsOfPost', (req, res) => {
    if (!req.body.postId) return res.json({
        status: 'FAILED',
        message: 'Missing required fields'
    });
    Comment.find({post: req.body.postId}).sort({createdAt: -1})
        .then(comments => res.json(comments))
        .catch(err => res.json(err));
});

router.post('/getComment', (req, res) => {
    if (!req.body.id) return res.json({
        status: 'FAILED',
        message: 'Missing required fields'
    });
    Comment.findById(req.body.id).then(comment => {
        if (!comment) return res.json({
            status: 'FAILED',
            message: 'Comment not found!'
        });
        res.json(comment);
    }).catch(err => res.json(err));
});


router.delete('/delete', isAuth,(req, res) => {
    if (!req.body.id) return res.json({
        status: 'FAILED',
        message: 'Missing required fields'
    });
    Comment.findById(req.body.id).then(comment => {
        if (!comment) return res.json({
            status: 'FAILED',
            message: 'Comment not found!'
        });
        if (comment.originalPoster.toString() !== req.user.id) {
            return res.json({
                status: 'FAILED',
                message: 'You are not authorized to delete this comment!'
            });
        }
        Comment.deleteOne({_id: req.body.id}).then(() => {
            res.json({
            status: 'SUCCESS',
            message: 'Comment deleted successfully!'
        })}).catch(err => res.json(err));
    }).catch(err => res.json(err));
});







module.exports = router;