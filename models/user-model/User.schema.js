import mongoose from 'mongoose' 


//fname, lname, dob, email, phone, password, address, gender, role
const UserSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true,
        default: "",
        max: 20
    },
    lname: {
        type: String,
        required: true,
        default: "",
        max: 20
    },
    dob: {
        type: Date,
        required: true,
        default: "",
        max: 20
    },
    email: {
        type: String,
        required: true,
        default: "",
        max: 50,
        unique: true,
        index:1
    },
    phone: {
        type: String,
        required: true,
        default: "",
        max: 20
    },
    password: {
        type: String,
        required: true,
        default: "",
        min:8
    },
    address: {
        type: String,
        max: 100
    },
    gender: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: "User"
    }
}
    , {
    timestapms:true
    })

const user = mongoose.model("User", UserSchema)

export default user