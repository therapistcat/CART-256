import mongoose from 'mongoose';
const schema=new mongoose.Schema({email:{type:String,required:true,unique:true,lowercase:true,trim:true},verifier:{type:String,required:true,select:false}},{timestamps:true});
export default mongoose.model('User',schema);
