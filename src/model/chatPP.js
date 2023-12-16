const mongoose = require('mongoose');
const pharmacist = require("./pharmacist")
const patient = require("./patient")

const messageSchema = {
    text:{
        type: String,
    },
    date: {
        type: Date
    },
    isPatient:{
        type: Boolean
    },
    unread: {
        type: Boolean,
        default: true
    }
}

const chatSchema = new mongoose.Schema({
    room: {
        type: String
    },
    pharmacistID:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:pharmacist
    }
    ,
    patientID:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:patient
    },
    messages:[messageSchema],
},{timestamps:true})

const ChatPP = mongoose.model('chatPP', chatSchema);
module.exports = ChatPP;