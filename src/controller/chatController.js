const chatModel = require("../model/chatPP");

const chats = async (req,res) => {
    let chats = [];
    if(req.session.userType == "patient"){
        chats = await chatModel.find({patientID: req.session._id}).populate("pharmacistID").sort({ "updatedAt": -1 });
        console.log('chats: ');
        console.log(chats);
        chats = chats.map(({room,pharmacistID,patientID,messages}) => ({
            room,
            name: pharmacistID.name,
            messages:messages.map(({_id,text,isPatient,unread,date}) =>(
                {
                    _id,
                    text,
                    isPatient,
                    unread,
                    time: date.getHours() + ":"  + date.getMinutes()
                }
            )),
            unread: (() => {
                let count = 0;
                for(let i = 1; i <= messages.length; i++){
                    if(messages[messages.length - i].unread && !messages[messages.length - i].isPatient){
                        count++;
                    }
                    else{
                        break;
                    }
                }
                return count
                })()
        }));
    }
    else {
        chats = await chatModel.find({pharmacistID: req.session._id}).populate("patientID");
        chats = chats.filter((chat) => {
            if(chat.messages.length > 0)
                return true;
            return false;
        })
        chats = chats.map(({room,patientID,messages}) => ({
            room,
            name: patientID.name,
            messages:messages.map(({_id,text,isPatient,unread,date}) =>(
                {
                    _id,
                    text,
                    isPatient,
                    unread,
                    time: date.getHours() + ":"  + date.getMinutes()
                }
            )),
            unread: (() => {
                let count = 0;
                for(let i = 1; i <= messages.length; i++){
                    if(messages[messages.length - i].unread && messages[messages.length - i].isPatient){
                        count++;
                    }
                    else{
                        break;
                    }
                }
                return count
                })()
        }));
    }
    res.status(200).json(chats);
}

const send = async (req,res) => {
    let chat = await chatModel.find({room:req.body.room})
    
    let message = {
        text:req.body.text,
        date: new Date(Date.now()),
        isPatient: (req.session.userType == "patient"? true: false)
    }

    chat.messages.push(message);
    chat.save();
    
    res.status(200).json(chat); 
}

const save = async ({room, text, isPatient, time}) => {
    let chat = await chatModel.findOne({room:room})

    let message = {
        text,
        date: new Date(time),
        isPatient
    }

    chat.messages.push(message);
    chat.save();
}

const read = async (req,res) => {
    let chat = await chatModel.findOne({room:req.body.room});
    for(let i = 1; i <= chat.messages.length && (req.session.userType == 'patient'? !chat.messages[chat.messages.length -i].isPatient : chat.messages[chat.messages.length -i].isPatient) && chat.messages[chat.messages.length - i].unread ; i++){
        chat.messages[chat.messages.length - i].unread = false;
    }

    chat.save();

    res.status(200).json({chat}); 
}

const start = async (req,res) => {
    console.log(req.session);
    let room = req.session._id + "000000000000000000000000";
    let chat = await chatModel.findOne({room});
    console.log(chat);
    if(chat == null)
    {
        chat = new chatModel({
            room: room,
            patientID: req.session._id,
            pharmacistID: "000000000000000000000000"
        })
    
        chat = await chat.save();
    }

    res.status(200).json(chat);
}

module.exports = {chats, send, read, start, save}