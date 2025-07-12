import mongoose,{Document,Schema,models,model,Types} from "mongoose";
import User from "./User";
import SubscriptionPlans from "./SubscriptionPlans"

export interface ISubsription extends Document {
  patient: Types.ObjectId;
  plan: Types.ObjectId;
  startingDate: Date;
  endingDate: Date;
  status: string;
  paymentMethod: string;
  paymentId: string
}

const subscriptionschema = new Schema <ISubsription> ({
  patient:{type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  plan: {type: mongoose.Schema.ObjectId, ref: 'SubscriptionPlans', required: true},
  startingDate:{type: Date, required: true},
  endingDate: {type: Date, required: true},
  status:  {type: String, enum: ['active', 'expired', 'cancelled']},
  paymentMethod: {type: String, enum: ['razorpay', 'cash']},
  paymentId: String
})

export default models.Subscription || model<ISubsription> ("Subscription", subscriptionschema)