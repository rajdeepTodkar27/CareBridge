import mongoose,{Schema,Document,model,models,Types} from "mongoose";
import User from "./User";
import AllCare from "./AllCare";




export interface IDoctor extends Document {
  user: Types.ObjectId;
  fullName: string;
  mobileNo: number;
  gender: string;
  medicalSpeciality: string;
  experience: number;
  hospital: Types.ObjectId;
  administrativeTitle: string;
  licenseNo: string;
  licenseAuthority: string
}

const doctorschema = new Schema<IDoctor> ({
  user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  fullName: {type: String, required: true},
  mobileNo: {type: Number, required: true},
  gender: {type: String, enum: ['male', 'female', 'trans'], required: true},
  medicalSpeciality: {type: String, required: true},
  experience: {type: Number, required: true},
  hospital: {type: mongoose.Schema.ObjectId, ref: 'AllCare', required: true},
  administrativeTitle: {type: String, required: true},
  licenseNo: {type: String, required: true},
  licenseAuthority: {type: String, required: true}
})

export default models.ProfileDoctor || model<IDoctor>("ProfileDoctor", doctorschema)