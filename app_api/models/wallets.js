const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    address: {
        type: String,
        unique: true,
        required: true
    },
    isUsed: {
        type: Boolean,
    },
    type: {
        type:String,
        enum:['admin', 'elector', 'candidate'],
        default: 'elector'
    }
});

mongoose.model('Wallet', userSchema);