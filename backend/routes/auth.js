const routes = require('express').Router();
const { body, validationResult } = require('express-validator');
const Users = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authtoken = require('../middleware/authtoken');
routes.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email', 'invalid email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.password, salt);
    const secret = 'secret@26';
    // Create a new user with the hashed password
    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: pass
    });
    
    jwtsign = jwt.sign({ id: user.id }, secret);
    console.log(user.id);
    console.log(user)
    // Save the user
    await user.save()
        .then(() => res.send({ token: jwtsign }))
        .catch((error) => {
            if (error.code === 11000) {
                // Handle duplicate key error
                res.status(400).json({
                    errors: [{
                        msg: `A user with the email ${req.body.email} already exists.`,
                        param: 'email'
                    }]
                });
            } else {
                // Handle other possible errors
                console.error('Error saving the user:', error);
                res.status(500).json({ errors: [{ msg: 'There was an error processing your request.' }] });
            }
        });
});

// Login
routes.post('/login', [
    body('email', 'invalid email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = await Users.findOne({ email: req.body.email });
    try {
    if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid email or password' }] });
    }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    
    if (!validPass) {
        return res.status(400).json({ errors: [{ msg: 'Invalid email or password' }] });
    }
    const secret = 'secret@26';
    jwtsign = jwt.sign({ id: user.id }, secret);
    res.send({ token: jwtsign });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ errors: [{ msg: 'There was an error processing your request.' }] });
    }
});

// Get user
routes.post('/getuser',authtoken, async (req, res) => {
    try {
    const id = req.user.id;
    const user = await Users.findById(id);
    res.send(user);
    }
catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ errors: [{ msg: 'There was an error processing your request.' }] });
}
}
);
module.exports = routes;
