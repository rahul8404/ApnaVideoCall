import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        trim: true,
    },
    meetingCode: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };