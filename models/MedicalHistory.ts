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
  pastMedicalTests: Types.Array<string>;
  pastPrescriptions: Types.Array<Types.ObjectId>;
}
interface Surgery {
    nameOfSurgery: string;
    dateOfSurgery: string;
    reportFile: string
}

const medicalhistoryschema = new Schema<IMedHistory>({
  patient: {type: mongoose.Schema.ObjectId, ref: 'PatientsProfile', required: true},
  pastIllness: String,
  surgeries: [{  nameOfSurgery:{ type: String},
    dateOfSurgery: { type: String},
    reportFile: { type: String} }],
  currentMedications: String,
  allergies: String,
  geneticDisorders: String,
  pastMedicalTests: [String],
  pastPrescriptions: [{type: mongoose.Schema.ObjectId, ref: 'Prescription'}]
})

export default models.MedicalHistory || model<IMedHistory> ("MedicalHistory", medicalhistoryschema)