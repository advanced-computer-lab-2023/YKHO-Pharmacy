const chatPD = require("../model/chatPD");

const pharmacistChat = async (req, res) => {
    let chat = await chatPD.find({patientID:"000000000000000000000000"});
    res.status(200).json(chat);
}

const send = async (req,res) => {
    let chat = await chatModel.find({room:req.body.room})
    
    let message = {
        text:req.body.text,
        date: new Date(req.body.time),
        isPatient:  true
    }

    chat.messages.push(message);
    chat.save();
    
    res.status(200).json(chat); 
}

const save = async ({room, text, time}) => {
    let chat = await chatModel.findOne({room:room})

    let message = {
        text,
        date: new Date(time),
        isPatient:true
    }

    chat.messages.push(message);
    chat.save();
}

const pharmacistRead = async (req,res) => {
    let chat = await chatPD.findOne({doctorID:req.user._id});
    
    for(let i = 1; i <= chat.messages.length && chat.messages[chat.messages.length - i].isPatient && chat.messages[chat.messages.length - i].unread ; i++){
        chat.messages[chat.messages.length - i].unread = false;
    }


    chat.save();
    res.status(200).json({chat}); 
}


module.exports = { pharmacistChat, pharmacistRead, send,save}