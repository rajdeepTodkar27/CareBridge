import mongoose,{Document,Schema,models,model,Types} from "mongoose";

export interface ISubscriptionPlans extends Document {
  planName: string;
  description: string;
  billingCycle: string;
  pharmacyDiscount: number;
  freeConsultions: number;
  price: number;
  isActive: boolean
}

const subplansschema = new Schema <ISubscriptionPlans> ({
  planName: {type: String, required: true},
  description: {type: String, required: true},
  billingCycle: {type: String,enum: ['monthly', 'quarterly', 'yearly'], required: true}, 
  pharmacyDiscount: {type: Number, required: true},
  freeConsultions: {type: Number, required: true},
  price: {type: Number, required: true},
  isActive: {type: Boolean, default: true},
})

export default models.SubscriptionPlans || model<ISubscriptionPlans> ("SubscriptionPlans",subplansschema )