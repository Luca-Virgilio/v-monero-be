const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    address: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isUsed: {
        type: Boolean,
        default:false
    },
    type: {
        type:String,
        enum:['admin', 'elector', 'candidate','fake'],
        default: 'elector'
    }
});

mongoose.model('Wallet', userSchema);