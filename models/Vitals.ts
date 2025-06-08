import mongoose,{Document,Schema,models,model,Types} from "mongoose";
import User from "./User";

export interface IVital extends Document {
  patient: Types.ObjectId;
  weight: number;
  height: number;
  bmi: number;
  heartRate: number;
  bloodSugar: number;
  bloodPressure: string;
  temperature: number
}

const vitalschema = new Schema <IVital> ({
  patient: {type:mongoose.Schema.ObjectId, ref: 'User', required: true},
  weight: {type: Number},
  height: {type: Number},
  bmi: {type: Number},
  heartRate: {type: Number},
  bloodSugar: {type: Number},
  bloodPressure: {type: String},
  temperature: {type: Number},
})

export default models.Vitals || model<IVital> ("Vitals", vitalschema )