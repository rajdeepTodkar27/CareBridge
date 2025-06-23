import mongoose, { Document, Schema, model, models, Types } from "mongoose";

export interface IBatch {
  batchNumber: string;
  expiryDate: Date;
  quantity: number;
}

export interface IMedicineStock extends Document {
  medicineCentreId: string;  // which hospital/center
  medicineName: string;
  brandName: string;
  sellingPrice: number;
  description?: string;
  stock: IBatch[];
  createdAt?: Date;
  updatedAt?: Date;
}

const MedicineStockSchema: Schema<IMedicineStock> = new Schema({
  medicineCentreId: String,
  medicineName: { type: String, required: true },
  brandName: { type: String, required: true },
  sellingPrice: { type: Number, required: true },
  description: { type: String },
  stock: [
    {
      batchNumber: { type: String, required: true },
      expiryDate: { type: Date, required: true },
      quantity: { type: Number, required: true },
    }
  ]
}, { timestamps: true });

export default models.MedicineStock || model<IMedicineStock>('MedicineStock', MedicineStockSchema);
