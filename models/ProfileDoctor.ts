import mongoose,{Schema,Document,model,models,Types} from "mongoose";
import User from "./User";
import AllCare from "./AllCare";



// here we will set the empId as centerId-counter couter will increase(static)
export interface IDoctor extends Document {
  user: Types.ObjectId;
  empId: String;
  fullName: string;
  mobileNo: number;
  gender: string;
  medicalSpeciality: string;
  experience: number;
  administrativeTitle: string;
  licenseNo: string;
  licenseAuthority: string
}

const doctorschema = new Schema<IDoctor> ({
  user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  empId: {type:String, required: true},
  fullName: {type: String, required: true},
  mobileNo: {type: Number, required: true},
  gender: {type: String, enum: ['male', 'female', 'trans'], required: true},
  medicalSpeciality: {type: String, required: true},
  experience: {type: Number, required: true},
  administrativeTitle: {type: String,default: ""},
  licenseNo: {type: String, required: true},
  licenseAuthority: {type: String, required: true}
})

export default models.ProfileDoctor || model<IDoctor>("ProfileDoctor", doctorschema)