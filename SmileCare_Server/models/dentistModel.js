import mongoose from "mongoose";

const dentistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    specialty: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const dentistModel = mongoose.model("dentists", dentistSchema);
export default dentistModel;
