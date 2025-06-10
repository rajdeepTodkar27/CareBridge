import mongoose,{Document,Schema,models,model, Types} from "mongoose";
import PatientsProfile from "./PatientsProfile";
import AllCare from "./AllCare";

export interface IProfileStaff extends Document {
  user: Types.ObjectId;
  hospital: Types.ObjectId;
  administrativeTitle: string;
  qualification: string;
  institute: string
}

const profilestaffschema = new Schema <IProfileStaff> ({
  user: {type: mongoose.Schema.ObjectId, ref: 'PatientsProfile', required: true},
  administrativeTitle: {type: String, required: true},
  qualification: {type: String,required : true},
  institute: {type: String, required: true}
})

export default models.ProfileStaff || model<IProfileStaff> ("ProfileStaff", profilestaffschema)