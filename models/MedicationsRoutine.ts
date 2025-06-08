import mongoose,{Schema,Document,models,model,Types} from "mongoose";
import PatientsProfile from "./PatientsProfile";

export interface IMedRoutine extends Document {
  patient: Types.ObjectId;
  Medication: Medicine[];
  Medtime: string;
  repetation: number;
  afterEating: boolean;
  endingDate: Date;
  isTaken: boolean
}

interface Medicine {
    medicineName: string;
    quantity: string;
}

const medroutineschema = new Schema<IMedRoutine>({
  patient: {type: mongoose.Schema.ObjectId, ref: 'PatientsProfile', required: true},
  Medication: [{ medicineName: { type: String},
    quantity: { type: String} }],
  Medtime:  String,
  repetation: Number,
  afterEating: Boolean,
  endingDate: Date,
  isTaken: Boolean
})

export default models.MedicationRoutine || model<IMedRoutine> ("MedicationRoutine",medroutineschema)