import mongoose, { Schema } from "mongoose";

const adminsSchema = new Schema({
    email: { type: String, required: true, unique: true },
    clerk_id: { type: String, required: true, unique: true },
    groups: { type: [Map<String, Number>], default: [] },
}, { timestamps: true })

const Admins = mongoose.models.Admins || mongoose.model("Admins", adminsSchema);
export default Admins;