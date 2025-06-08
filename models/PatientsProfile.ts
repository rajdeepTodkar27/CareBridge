import mongoose,{Document,Schema,models,model,Types} from "mongoose";
import User from "./User";
import MedicalHistory from "./MedicalHistory";
import Vitals from "./Vitals"
import Payment from "./Payment"


export interface IPatient extends Document {
  user: Types.ObjectId;
  fullName: string;
  aadharNo: number;
  gender: string;
  dateOfBirth: Date;
  mobileNo: number;
  emergencyContact: number;
  medicalHistory:  Types.ObjectId;
  vitals:  Types.ObjectId;
  occupation: string;
  lifestyle: string;
  paymentHistory:  Types.ObjectId
}

const patientschema = new Schema <IPatient> ({
  user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  fullName: String,
  aadharNo: Number,
  gender: {type: String, enum: ['male', 'female', 'trans']},
  dateOfBirth: Date,
  mobileNo: Number,
  emergencyContact: Number,
  medicalHistory: {type: mongoose.Schema.ObjectId, ref: 'MedicalHistory'},
  vitals: {type: mongoose.Schema.ObjectId, ref: 'Vitals'},
  occupation: String,
  lifestyle: String,
  paymentHistory: {type: mongoose.Schema.ObjectId, ref: 'Payment'}
})

export default models.ProfilePatient || model<IPatient>("ProfilePatient", patientschema)