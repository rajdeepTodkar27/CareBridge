import mongoose,{Document,Schema,models,model,Types} from "mongoose";
import User from "./User";
import MedicalHistory from "./MedicalHistory";
import Vitals from "./Vitals"
import Payment from "./Payment"


export interface IPatient extends Document {
  patient: Types.ObjectId;
  fullName: string;
  aadharNo: number;
  gender: string;
  dateOfBirth: Date;
  mobileNo: number;
  emergencyContact: number;
  vitals:  Types.ObjectId;
  occupation: string;
  lifestyle: string;
}

const patientschema = new Schema <IPatient> ({
  patient: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  fullName: {type: String,required: true},
  aadharNo: {type: Number,required: true},
  gender: {type: String, enum: ['male', 'female', 'trans']},
  dateOfBirth: {type: Date,required: true},
  mobileNo: {type: Number,required: true},
  emergencyContact: {type: Number,required: true},
  vitals: {type: mongoose.Schema.ObjectId, ref: 'Vitals'},
  occupation: {type: String, default: ""},
  lifestyle: {type: String, default: ""},
})

export default models.ProfilePatient || model<IPatient>("ProfilePatient", patientschema)