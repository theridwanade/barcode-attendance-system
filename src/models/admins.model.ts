import mongoose, { Schema } from "mongoose";

const adminsSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    clerkId: { type: String, required: true, unique: true },
    groups: { type: [Map<string, number>], default: [] },
  },
  { timestamps: true },
);

const Admins = mongoose.models.Admins || mongoose.model("Admins", adminsSchema);
export default Admins;
