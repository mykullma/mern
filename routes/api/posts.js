const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');

// route    POST api/posts
// descr    create post
// access   private
router.post('/', auth, check('text', 'text required').notEmpty(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route    GET api/posts
// descr    get all posts
// access   private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route    GET api/posts/:id
// descr    get post by id
// access   private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'post not found' });
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'post not found' });
        res.status(500).send('Server Error');
    }
});

// route    DELETE api/posts/:id
// descr    delete post by id
// access   private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'post not found' });
        if (post.user != req.user.id) return res.status(401).json({ msg: 'user not authorized' });
        await post.remove();
        res.json({ msg: 'post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'post not found' });
        res.status(500).send('Server Error');
    }
});

// route    PUT api/posts/like/:id
// descr    like post by id
// access   private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'post not found' });
        if (post.likes.filter(like => like.user == req.user.id).length > 0) {
            return res.status(400).json({ msg: 'post already liked' });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'post not found' });
        res.status(500).send('Server Error');
    }
});

// route    PUT api/posts/unlike/:id
// descr    unlike post by id
// access   private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'post not found' });
        if (post.likes.filter(like => like.user == req.user.id).length == 0) {
            return res.status(400).json({ msg: 'post not liked' });
        }
        post.likes = post.likes.filter(like => like.user != req.user.id);
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'post not found' });
        res.status(500).send('Server Error');
    }
});

// route    POST api/posts/comment/:id
// descr    comment post by id
// access   private
router.post('/comment/:id', auth, check('text', 'text required').notEmpty(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'post not found' });
        const user = await User.findById(req.user.id).select('-password');
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route    DELETE api/posts/comment/:id/:comment_id
// descr    delete comment by id
// access   private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'post not found' });
        const comment = post.comments.find(comment => comment.id == req.params.comment_id);
        if (!comment) {
            return res.status(404).json({ msg: 'comment not found' });
        }
        if (comment.user != req.user.id) {
            return res.status(401).json({ msg: 'user not authorized' });
        }
        post.comments = post.comments.filter(com => com.id != req.params.comment_id);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;