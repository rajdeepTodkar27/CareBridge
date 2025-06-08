import mongoose,{Document,Schema,models,model,Types} from "mongoose";
import PatientsProfile from "./PatientsProfile";
import ProfileDoctor from "./ProfileDoctor";
import DoctorAppointmentRequest from "./DoctorAppointmentRequest";
import ServiceUsage from "./ServiceUsage"

export interface IRegCheckup extends Document {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  appointmentRequest: Types.ObjectId;
  treatmentServices: Types.Array<Types.ObjectId>;
  followUpDate: Date;
  notes: string
}

const regularcheckupschema = new Schema <IRegCheckup> ({
  patient: {type: mongoose.Schema.ObjectId, ref: 'PatientsProfile', required: true},
  doctor:{type: mongoose.Schema.ObjectId, ref: 'ProfileDoctor', required: true},
  appointmentRequest:{type: mongoose.Schema.ObjectId, ref: 'DoctorAppointmentRequest', required: true},
  treatmentServices: [{type: mongoose.Schema.ObjectId, ref: 'ServiceUsage', required: true}],
  followUpDate:  Date,
  notes: String
})

export default models.RegularCheckup || model<IRegCheckup> ("RegularCheckup", regularcheckupschema)