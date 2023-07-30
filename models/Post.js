const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    parentSub: {type: Schema.Types.ObjectId, ref: 'Sub'},
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Post', PostSchema);