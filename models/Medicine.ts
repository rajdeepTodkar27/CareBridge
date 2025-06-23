import mongoose, { Document, Schema, models, model } from "mongoose";

export interface IMedicine extends Document {
  medicineName: string;
  category: string;
  brandName: string;
  description: string;
  sellingPrice: number;  // price per unit
  createdAt?: Date;
  updatedAt?: Date;
}

const MedicineSchema: Schema = new Schema<IMedicine>({
  medicineName: { type: String, required: true },
  category: { type: String, required: true },
  brandName: { type: String, required: true },
  description: { type: String },
  sellingPrice: { type: Number, required: true }
}, { timestamps: true });

export default models.Medicine || model<IMedicine>('Medicine', MedicineSchema);
