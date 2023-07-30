const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false, default: ''},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    bannedUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    banned: {type: Boolean, default: false},
    moderators: [{type: Schema.Types.ObjectId, ref: 'User'}],
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Sub', SubSchema);
