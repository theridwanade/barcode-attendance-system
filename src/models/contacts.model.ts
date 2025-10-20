import mongoose, { Schema } from "mongoose";

const contactInformationSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true },
);

const contactRecordsSchema = new Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admins",
    },
    contacts: [contactInformationSchema]
  },
  { timestamps: true },
);

const Contacts =
  mongoose.models.Contacts || mongoose.model("Contacts", contactRecordsSchema);

export default Contacts;


