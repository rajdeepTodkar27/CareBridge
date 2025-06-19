import mongoose, { Schema, Document, models, model, Types } from "mongoose";
import PatientsProfile from "./PatientsProfile";

export interface IMedRoutine extends Document {
  patient: Types.ObjectId;
  Medication: Medicine[];
  startingDate: string;
  endingDate: string;
}

interface Medicine {
  medicineName: string;
  dosage: string;
  time: string;
  mealRelation: 'before_meal' | 'after_meal';
  isTaken: Boolean
}

const medroutineschema = new Schema<IMedRoutine>({
  patient: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  Medication: [{
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true }, time: { type: String, required: true }, mealRelation: { type: String, enum: ['before_meal', 'after_meal'], isTaken: { type: Boolean, default: false } }
  }],
  startingDate: { type: String, required: true },
  endingDate: { type: String, required: true },
})

export default models.MedicationRoutine || model<IMedRoutine>("MedicationRoutine", medroutineschema)