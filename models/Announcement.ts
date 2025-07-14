import mongoose, { Document, Schema, Types, model, models } from "mongoose";

// Define a union type for possible sender profile models
type SenderModelType = "ProfileStaff" | "ProfileDoctor" | "ProfilePharmasist";

export interface IAnnouncement extends Document {
  sendersProfileId: Types.ObjectId;
  senderModel: SenderModelType;
  text: string;
  link?: string;
  timestamp: Date;
}

const announcementSchema = new Schema<IAnnouncement>({
  sendersProfileId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "senderModel", 
  },
  senderModel: {
    type: String,
    required: true,
    enum: ["ProfileStaff", "ProfileDoctor", "ProfilePharmasist"],
  },
  text: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Announcement =
  models.Announcement || model<IAnnouncement>("Announcement", announcementSchema);

export default Announcement;
