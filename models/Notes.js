const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const noteSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title : {
        type: String,
    },
    description:{
        type:String,
    },
    tag: {
        type:String,

    },
    color: {
        type:String,
    },
    date:{
        type: Date,
        default: Date.now
    },
});

const Notes = mongoose.model('notes', noteSchema);
Notes.createIndexes();
module.exports = Notes;