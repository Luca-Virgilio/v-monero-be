const mongoose = require('mongoose');
const User = mongoose.model('User');

const getUsers = async (req, res) => {
    try {
        users = await User.find();
        console.log("users", users);
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}
const createUser = async (req, res) => {
    try {
        const { email, name } = req.body;
        existEmails = await User.find({ email });
        console.log("existEmails", existEmails);
        if (existEmails.length != 0) {
            throw new Error('email already exist');
        }
        const newUser = await User.create({ email, name });
        console.log("res", newUser);
        return res.status(201).json(newUser);

    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

module.exports = {
    getUsers,
    createUser
}