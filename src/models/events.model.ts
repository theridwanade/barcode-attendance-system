import { Schema } from "mongoose";

const attendeesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    checkInTime: {
        type: Date,
        required: true,
        default: Date.now,
    }
}, { _id: false });

const eventsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: false,
    },
    invitedContacts: [{
        type: Schema.Types.ObjectId,
        ref: "Contact",
    }],
    attendees: [attendeesSchema],
}, { timestamps: true });

const Events = mongoose.models.Events || mongoose.model("Events", eventsSchema);

export default Events;