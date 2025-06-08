import mongoose,{Document,Schema,models,model, Types} from "mongoose";
import PatientsProfile from "./PatientsProfile";
import AllCare from "./AllCare";

export interface IProfileStaff extends Document {
  user: Types.ObjectId;
  hospital: Types.ObjectId
}

const profilestaffschema = new Schema <IProfileStaff> ({
  user: {type: mongoose.Schema.ObjectId, ref: 'PatientsProfile', required: true},
  hospital: {type:mongoose.Schema.ObjectId, ref:'AllCare' }
})

export default models.ProfileStaff || model<IProfileStaff> ("ProfileStaff", profilestaffschema)