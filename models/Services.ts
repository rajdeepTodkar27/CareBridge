import mongoose,{Document,Schema,models,model,Types} from "mongoose";

export interface IServices extends Document {
  serviceName: string;
  category: string;
  department: string;
  baseCost: number;
  unit: number;
  description: string;
  isActive: boolean;
}

const servicesschema = new Schema <IServices> ({
  serviceName: String,
  category: String,
  department: String,
  baseCost: Number,
  unit: Number,
  description: String,
  isActive: Boolean
})

export default models.Services || model<IServices> ("Services", servicesschema)