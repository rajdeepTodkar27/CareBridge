import mongoose,{Document,Schema,models,model,Types} from "mongoose";
import PatientsProfile from "./PatientsProfile";
import AllCare from "./AllCare";
import ServiceUsage from "./ServiceUsage"

export interface IPayment extends Document {
  patient: Types.ObjectId;
  date: Date;
  hospital: Types.ObjectId;
  service: Types.Array<Types.ObjectId>;
  subscription: Types.ObjectId;
  paymentMethod: string;
  paymentId: string
}

const paymentschema = new Schema <IPayment> ({
  patient: {type: mongoose.Schema.ObjectId, ref: 'User',required: true},
  date:  {type: Date, required: true},
  hospital: {type: mongoose.Schema.ObjectId, ref: 'AllCare'},
  service: [{type: mongoose.Schema.ObjectId, ref: 'ServiceUsage'}],
  subscription : {type: mongoose.Schema.ObjectId, ref: 'Subscription'},
  paymentMethod: {type: String, enum: ['upi', 'card', 'cash', 'netbanking']},
  paymentId: {type: String,default:""}
})

export default models.Payment || model<IPayment> ("Payment", paymentschema)