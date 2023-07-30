const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    created: {type: Date, default: Date.now},
    admin: {type: Boolean, default: false},
    subs: [{type: Schema.Types.ObjectId, ref: 'Sub'}],
    banned: {type: Boolean, default: false},
    profilePicture: {type: String, required: false,default:"https://cdn.discordapp.com/attachments/1134470924377276496/1134902551641342002/oooooo.PNG"}
});

module.exports = mongoose.model('User', UserSchema);