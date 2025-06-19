import mongoose, { Schema, Document, models, model, Types } from "mongoose";

export interface IMissedMedRoutine extends Document {
  patient: Types.ObjectId;
  Medication: Medicine[];
  missedDate: string;
}

interface Medicine {
  medicineName: string;
  quantity: string;
  time: string;
  mealRelation: 'before_meal' | 'after_meal';
}

const missedMedRoutineSchema = new Schema<IMissedMedRoutine>({
  patient: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  Medication: [{
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    time: { type: String, required: true },
    mealRelation: { type: String, enum: ['before_meal', 'after_meal'], required: true }
  }],
  missedDate: { type: String, required: true }
});

export default models.MissedMedicationRoutine || model<IMissedMedRoutine>("MissedMedicationRoutine", missedMedRoutineSchema);
