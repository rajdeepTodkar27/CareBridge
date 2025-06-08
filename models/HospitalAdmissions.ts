import mongoose,{Schema,Document,models,model,Types} from "mongoose";
import PatientsProfile from "./PatientsProfile";
import ProfileDoctor from "./ProfileDoctor";
import ProfileStaff from "./ProfileStaff"
import AllCare from "./AllCare";
import ServiceUsage from "./ServiceUsage"

export interface IHospitalAdmission extends Document {
  patient: Types.ObjectId;
  datetimeOfAdmission: string;
  bedNo: String;
  dischargeDateTime:  string;
  isDischarged: boolean;
  assignedDoctor: Types.ObjectId;
  assignedNurse: Types.ObjectId;
  hospital: Types.ObjectId;
  treatmentServices: Types.Array<Types.ObjectId>
}

const hospitaladmissionschema = new Schema<IHospitalAdmission>({
  patient: {type: mongoose.Schema.ObjectId, ref: 'PatientsProfile', required: true},
  datetimeOfAdmission: {type:String, required: true},
  bedNo: {type:String, required: true},
  dischargeDateTime:  String,
  isDischarged: Boolean,
  assignedDoctor: {type: mongoose.Schema.ObjectId, ref: 'ProfileDoctor', required: true},
  assignedNurse: {type: mongoose.Schema.ObjectId, ref: 'ProfileStaff', required: true},
  hospital: {type: mongoose.Schema.ObjectId, ref: 'AllCare', required: true},
  treatmentServices: [{type: mongoose.Schema.ObjectId, ref: 'ServiceUsage'}]
})

export default models.HospitalAdmissions || model<IHospitalAdmission> ("HospitalAdmissions",hospitaladmissionschema)