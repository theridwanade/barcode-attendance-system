import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema(
  {
    admin: { type: Schema.Types.ObjectId, ref: "Admins" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true },
);

const Contacts =
  mongoose.models.Contacts || mongoose.model("Contacts", contactSchema);
export default Contacts;
