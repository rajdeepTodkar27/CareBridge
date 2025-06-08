import mongoose,{Document,Schema,models,model, Types} from "mongoose";
import PatientsProfile from "./PatientsProfile";

export interface IPrescription extends Document {
  patient: Types.ObjectId;
  medicine: Medicine[];
  date: Date;
  isTaken: boolean
}

interface Medicine {
    medName: string,
    quantity: string,
    dosage: string,
}

const prescriptionschema = new Schema <IPrescription> ({
  patient: {type: mongoose.Schema.ObjectId, ref: 'PatientsProfile'},
  medicine: [{name:{ type: String},quantity:{ type: String},dosage:{ type: String} }],
  date: Date,
  isTaken: Boolean
})

export default models.Prescription || model<IPrescription> ("Prescription", prescriptionschema)