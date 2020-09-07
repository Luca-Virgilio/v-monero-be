const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    cf: {
        type: String,
        unique: true,
        required: true
    },
    wallet:{
        type:String
    }
});

mongoose.model('User', userSchema);