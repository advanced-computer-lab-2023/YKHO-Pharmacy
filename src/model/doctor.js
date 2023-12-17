const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
  });

const doctorSchema = new mongoose.Schema({
    name:
    {
        type:String,
        required:true,
        maxlength:20,
    }
    ,
    username:
    {
        type:String,
        required:true,
        maxlength:20,
    },
    password: 
    {
        type:String,
        required:true,
    },
    email:
    {
        type:String,
        required:true,
    },
    DOB:{
        type:Date,
        required:true,
    },
    rate:
    {
        type:Number,
        required:true,
    },
    mobile: {
        type: String,  
        required: true,
    },
    affiliation:
    {
        type:String,
        required:true,
    },
    education:
    {
        type:String,
        required:true,
    },
    speciality:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: ['dermatology', 'pediatrics', 'orthopedics'],
    },
    acceptedContract:{
        type: Boolean,
        default: false,
    },
    id:fileSchema,
    medicalLicense:fileSchema,
    medicalDegree:fileSchema,
    Wallet:
    {
        type:Number,
        required:true,
        default:0,
    },
    });
const doctor = mongoose.model('doctor', doctorSchema);

module.exports={doctor};