import mongoose,{Document,Schema,models,model, Types} from "mongoose";


export interface IPrescription extends Document {
  patient: Types.ObjectId;
  medicine: Medicine[];
  date: Date;
  isTaken: boolean
}

interface Medicine {
    medName: string,
    quantity: string,
    dosage: string,
}

const prescriptionschema = new Schema <IPrescription> ({
  patient: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  medicine: [{medName:{ type: String},quantity:{ type: String},dosage:{ type: String} }],
  date: {type:Date,required: true},
  isTaken: {type: Boolean, default: false}
})

export default models.Prescription || model<IPrescription> ("Prescription", prescriptionschema)