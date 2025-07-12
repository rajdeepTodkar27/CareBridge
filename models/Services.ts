import mongoose,{Document,Schema,models,model,Types} from "mongoose";

export interface IServices extends Document {
  serviceName: string;
  centerId: string;
  category: string;
  department: string;
  baseCost: number;
  unit: number;
  description: string;
  isActive: boolean;
}

const servicesschema = new Schema <IServices> ({
  serviceName:  {type: String, default: ""},
  centerId: {type: String, require: true},
  category:  {type: String, default: ""},
  department:  {type: String, default: ""},
  baseCost: Number,
  unit: String,
  description:  {type: String, default: ""},
  isActive: {type: Boolean, default: true}
})

export default models.Services || model<IServices> ("Services", servicesschema)