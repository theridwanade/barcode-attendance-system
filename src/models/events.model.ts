import mongoose, { Schema } from "mongoose";


const invitedContactsSchema = new Schema({
    contact: {
        type: Schema.Types.ObjectId,
        ref: "Contacts",
        required: true,
    },
    checkInTime: {
        type: Date,
    }
}, { _id: false });

const eventsSchema = new Schema({
    title: {
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
    invitedContacts: [invitedContactsSchema],
}, { timestamps: true });

const Events = mongoose.models.Events || mongoose.model("Events", eventsSchema);

export default Events;