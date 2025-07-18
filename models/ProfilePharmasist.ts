import mongoose,{model,models,Schema,Document, Types} from "mongoose";
import User from "./User";
import AllCare from "./AllCare";

export interface IPharmasist extends Document {
  user: Types.ObjectId;
  avtarImg: string;
  ownerName: string;
  licenseNo: string;
  licenseAuthority: string;
  education: string;
  experience: number;
}

const pharmasistschema = new Schema <IPharmasist> ({
  user: {type: mongoose.Schema.ObjectId, ref:'User', required: true},
  ownerName:{type: String, required: true},
  avtarImg: {type: String,default: ""},
  licenseNo:{type: String, required: true},
  licenseAuthority:{type: String, required: true},
  education: {type: String, required: true},
  experience: {type: Number, required: true},
})

export default models.ProfilePharmasist ||  model<IPharmasist>("ProfilePharmasist", pharmasistschema)