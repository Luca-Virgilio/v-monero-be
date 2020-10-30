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
    loaded: {
        type: Boolean,
        default:false
    },
    isUsed: {
        type: Boolean,
        default:false
    },
    value:{
        type:Number
    },
    type: {
        type:String,
        enum:['elector', 'candidate'],
        default: 'elector'
    }
});

mongoose.model('Wallet', userSchema);