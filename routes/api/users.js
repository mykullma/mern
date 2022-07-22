const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');

// route    POST api/users
// descr    reg user
// access   public
router.post('/', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    // validate
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array() });
    }

    const { name, email, password } = req.body;
    try {
        // check duplicate
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
        // get avatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        // create user
        user = new User({
            name,
            email,
            avatar,
            password,
            follows: []
        });
        // encrypt pwd
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        // save user to db
        await user.save();
        // return token
        const payload = {
            user: { id: user.id }
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route    PUT api/users/follow/:id
// descr    follow user
// access   private
router.put('/follow/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ errors: [{ msg: 'user not found' }] });
        const me = await User.findById(req.user.id);
        if (me.follows.filter(follow => follow.user == req.params.id).length > 0) {
            return res.status(400).json({ errors: [{ msg: 'user already followed' }] });
        }
        me.follows.unshift({ user: req.params.id });
        await me.save();
        res.json(me.follows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route    PUT api/users/unfollow/:id
// descr    unfollow user
// access   private
router.put('/unfollow/:id', auth, async (req, res) => {
    try {
        const me = await User.findById(req.user.id);
        if (me.follows.filter(follow => follow.user == req.params.id).length = 0) {
            return res.status(400).json({ errors: [{ msg: 'user not followed' }] });
        }
        me.follows = me.follows.filter(follow => follow.user != req.params.id);
        await me.save();
        res.json(me.follows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;