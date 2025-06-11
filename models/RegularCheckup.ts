import mongoose,{Document,Schema,models,model,Types} from "mongoose";
import PatientsProfile from "./PatientsProfile";
import ProfileDoctor from "./ProfileDoctor";
import DoctorAppointmentRequest from "./DoctorAppointmentRequest";
import ServiceUsage from "./ServiceUsage"

export interface IRegCheckup extends Document {
  appointmentRequest: Types.ObjectId;
  treatmentServices: Types.Array<Types.ObjectId>;
  followUpDate: String;
  notes: string;
  isDone: boolean;
}

const regularcheckupschema = new Schema <IRegCheckup> ({
  appointmentRequest:{type: mongoose.Schema.ObjectId, ref: 'DoctorAppointmentRequest', required: true},
  treatmentServices: [{type: mongoose.Schema.ObjectId, ref: 'ServiceUsage', required: true}],
  followUpDate: { type: String,default: ""},
  notes:{type: String, default: ""},
  isDone: {type: Boolean, default: false}
})

export default models.RegularCheckup || model<IRegCheckup> ("RegularCheckup", regularcheckupschema)