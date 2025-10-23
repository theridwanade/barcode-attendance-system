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

const eventDateSchema = new Schema({
    start: { type: Date, required: true },
    end: { type: Date },
}, { _id: false });

const venueSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
}, { _id: false });

const eventsSchema = new Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: "Admins",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    date: eventDateSchema,
    venue: venueSchema,
    invitedContacts: [invitedContactsSchema],
}, { timestamps: true });

const Events = mongoose.models.Events || mongoose.model("Events", eventsSchema);

export default Events;