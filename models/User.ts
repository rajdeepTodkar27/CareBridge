import mongoose,{Schema,models,model,Document} from "mongoose";

export interface IUser extends Document {
    email : string;
    password : string;
    role : string;
    centerId: string,
    isActive: boolean
}

const userschema = new Schema<IUser> ({
    email: {type: String, required: true, unique: true},
    password: {type: String, required:true},
    role: {type: String, required:true},
    centerId: {type: String},
    isActive: {type:Boolean, default: true}
})

export default models.User || model<IUser>("User", userschema)