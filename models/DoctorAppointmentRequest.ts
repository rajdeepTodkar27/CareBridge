import mongoose,{Schema,Document,models,model,Types} from "mongoose";
import { DateTime } from "next-auth/providers/kakao";
import PatientsProfile from "./PatientsProfile";
import ProfileDoctor from "./ProfileDoctor";
import AllCare from "./AllCare";
import Subscription from "./Subscription"

export interface IDocAppReq extends Document {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  hospitalCenterId: string;
  description: string;
  subscription: Types.ObjectId;
  requestStatus: string;
  requestDateTime: string;
  scheduledTime: string;
  responceFromH: string
}

const docappreqschema = new Schema<IDocAppReq>({
  patient: {type: mongoose.Schema.ObjectId, ref: 'PatientsProfile', required: true},
  doctor: {type: mongoose.Schema.ObjectId, ref: 'ProfileDoctor', required: true},
  hospitalCenterId: {type: String, required: true},
  description:{type: String,default: ""},
  subscription: {type: mongoose.Schema.ObjectId, ref: 'Subscription', required: true},
  requestStatus: {type: String,enum: ['pending', 'approved', 'rejected'],default: 'pending'},
  requestDateTime: {type: String, required: true},
  scheduledTime: {type: String, default: ""},
  responceFromH: {type: String, default: ""},

})

export default models.DoctorAppointmentRequest || model<IDocAppReq> ("DoctorAppointmentRequest",docappreqschema)