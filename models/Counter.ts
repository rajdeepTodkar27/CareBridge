
import { Schema, model,models, Document } from 'mongoose';

export interface ICounter extends Document {
  centerId: string; 
  count: number;
}

const CounterSchema = new Schema<ICounter>({
  
  centerId: {
    type: String,
    required: true,
  },
  count:{type: Number, default:0}
});


export const Counter =models.Counter || model<ICounter>('Counter', CounterSchema);
