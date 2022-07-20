const express = require('express');
const router = express.Router();
const config = require('config');
const request = require('request');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');

// route    GET api/profile/me
// descr    get my profile
// access   private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);
    
        if (!profile) {
            return res.status(400).json({ msg: 'No profile for this user' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route    POST api/profile
// descr    create or update my profile
// access   private
router.post(
    '/',
    auth,
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
            ...rest
        } = req.body;
    
        // build a profile
        const profileFields = {
            user: req.user.id,
            skills: Array.isArray(skills)
                ? skills
                : skills.split(',').map((skill) => skill.trim()),
            ...rest
        };
        const socialFields = { youtube, twitter, instagram, linkedin, facebook };
        profileFields.social = socialFields;
  
        try {
            let profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            return res.json(profile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    }
);

// route    GET api/profile
// descr    get all profiles
// access   public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route    GET api/profile/user/:user_id
// descr    get profile by user ID
// access   public
router.get('/user/:uid', async ({ params: { uid } }, res) => {
    try {
        const profile = await Profile.findOne({
            user: uid
        }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        return res.status(500).json({ msg: 'Server Error' });
    }
});

// route    DELETE api/profile
// descr    delete user, profile & posts
// access   private
router.delete('/', auth, async (req, res) => {
    try {
        await Post.deleteMany({ user: req.user.id });
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'user deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route    PUT api/profile/experience
// descr    add profile experience
// access   private
router.put(
    '/experience',
    auth,
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From date is required').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(req.body);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// route    DELETE api/profile/experience/:exp_id
// descr    delete experience from profile
// access   private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const foundProfile = await Profile.findOne({ user: req.user.id });
        foundProfile.experience = foundProfile.experience.filter(
            (exp) => exp._id.toString() !== req.params.exp_id
        );
        await foundProfile.save();
        return res.status(200).json(foundProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

// route    GET api/profile/github/:username
// descr    get user repos from Github
// access   public
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };
    
        request(options, (error, response, body) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) return res.status(404).json({ msg: 'Github profile not found' });
            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        return res.status(404).json({ msg: 'Github profile not found' });
    }
});

module.exports = router;