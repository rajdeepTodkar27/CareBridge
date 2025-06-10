import mongoose,{Document,Schema,models,model,Types} from "mongoose";
import Services from "./Services";

export interface IServiceUsage extends Document {
  service: Types.ObjectId;
  unit: number;
  totalCost: number;
  note: string;
  dateProvided:  Date;
  isProvided: string;
  isPaid: boolean
}

const serviceusageschema = new Schema <IServiceUsage> ({
  service: {type: mongoose.Schema.ObjectId, ref: 'Services', required: true},
  unit: {type: Number, required: true, default: 1},
  totalCost: {type: Number,required: true},
  note: {type: String, default: ""},
  dateProvided:  Date,
  isProvided: {type: String, enum: ['pending', 'provided']},
  isPaid: {type: Boolean, default: false}
})

export default models.ServiceUsage || model<IServiceUsage> ("ServiceUsage", serviceusageschema )