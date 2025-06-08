import mongoose,{Schema,model,models,Document,Types} from "mongoose";               

export interface IAllcare extends Document {
  centerId: string;
  branchId: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  email: string;
  phoneNo: number;
  latitude: number;
  longitude: number

}

const allcareschema = new Schema<IAllcare>({
  centerId: { type: String, required: true, unique: true },
  branchId: {type: String, required: true},
  name: {type: String, required: true},
  type: {type: String,enum:['hospital','medical store','blood bank','pathology lab'], required: true},
  address: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  email: {type: String, required: true},
  phoneNo: {type: Number, required: true},
  latitude: {type: Number, required: true},
  longitude: {type: Number, required: true},
})

export default models.AllCare || model<IAllcare>("AllCare",allcareschema)