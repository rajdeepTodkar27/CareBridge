import mongoose,{Document,Schema,models,model, Types} from "mongoose";


export interface IProfileStaff extends Document {
  user: Types.ObjectId;
  empId: string;
  fullName: string;
  mobileNo: number;
  gender: string;
  administrativeTitle: string;
  qualification: string;
  institute: string
}

const profilestaffschema = new Schema <IProfileStaff> ({
  user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  empId: {type: String,required:true},
  fullName: {type: String, required: true},
  mobileNo: {type: Number, required: true},
  gender: {type: String, enum: ['male', 'female', 'trans'], required: true},
  administrativeTitle: {type: String, default:""},
  qualification: {type: String,required : true},
  institute: {type: String, required: true}
})

export default models.ProfileStaff || model<IProfileStaff> ("ProfileStaff", profilestaffschema)