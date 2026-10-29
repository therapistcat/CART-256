import mongoose from 'mongoose';
const schema=new mongoose.Schema({owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},sequence:{type:Number,required:true},record:{type:mongoose.Schema.Types.ObjectId,ref:'PlantRecord',required:true,unique:true},payloadDigest:{type:String,required:true},previousHash:{type:String,required:true},createdAtImmutable:{type:Date,required:true},signature:{type:String,required:true},entryHash:{type:String,required:true,unique:true}},{timestamps:true,strict:'throw'});
schema.index({owner:1,sequence:1},{unique:true});
export default mongoose.model('IntegrityEntry',schema);
