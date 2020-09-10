const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
    isVoting: {
        type: Boolean,
        required: true
    }
});

// compile module
mongoose.model('Info', infoSchema);