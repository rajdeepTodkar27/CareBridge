import mongoose,{Schema,Document,models,model,Types} from "mongoose";
import PatientsProfile from "./PatientsProfile";
import Prescription from "./Prescription"

export interface IMedHistory extends Document {
  patient: Types.ObjectId;
  pastIllness: string;
  surgeries: Surgery[];
  currentMedications: string;
  allergies: string;
  geneticDisorders: string;
  pastMedicalTests: MedicalTest[];
  pastPrescriptions: Types.Array<Types.ObjectId>;
}
interface Surgery {
    nameOfSurgery: string;
    dateOfSurgery: string;
    reportFile: string
}
interface MedicalTest{
  nameOfTest: string;
  testfile: string;
}

const medicalhistoryschema = new Schema<IMedHistory>({
  patient: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  pastIllness: {type: String, default: ""},
  surgeries: [{  nameOfSurgery:{ type: String,default: ""},
    dateOfSurgery: { type: String , default: ""},
    reportFile: { type: String , default: ""} }],
  currentMedications:  {type: String, default: ""},
  allergies:  {type: String, default: ""},
  geneticDisorders:  {type: String, default: ""},
  pastMedicalTests: [{nameOfTest:{type: String,default: ""},testfile: {type: String,default: ""}}],
  pastPrescriptions: [{type: mongoose.Schema.ObjectId, ref: 'Prescription'}]
})

export default models.MedicalHistory || model<IMedHistory> ("MedicalHistory", medicalhistoryschema)