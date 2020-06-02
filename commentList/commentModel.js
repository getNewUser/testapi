const mongoose = require('mongoose');
const date = new Date();


const commentSchema = new mongoose.Schema({
    date :{
        type: Number,
        default: date.getTime()
    },
    text: {
        type: String,
    },
    commentOfText: {
        type: String,
    },
    postID: {
        type: String,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    username: {
        type: String
    }
})

const commentList = mongoose.model('commentList', commentSchema);

module.exports = commentList; 