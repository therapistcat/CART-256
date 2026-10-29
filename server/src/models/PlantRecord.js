import mongoose from 'mongoose';
const schema=new mongoose.Schema({owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},sequence:{type:Number,required:true},plantId:String,plantName:{type:String,required:true},scientificName:String,observation:{type:String,default:''},location:{type:String,default:''},image:{bytes:Buffer,mime:String,name:String},imageDigest:{type:String,default:null},createdAtImmutable:{type:Date,required:true},payloadDigest:{type:String,required:true},canonicalPayload:{type:String,required:true}},{timestamps:true,strict:'throw'});
schema.index({owner:1,sequence:1},{unique:true});
export default mongoose.model('PlantRecord',schema);
