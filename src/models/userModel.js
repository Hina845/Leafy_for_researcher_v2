import mongoose from "mongoose";
import { type } from "os";

const Schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    owned_posts: {
        type: Array,
        default: [],
    },
    profile_image: {
        type: String,
        default: 'public/assets/imgDefaultProfilePic.png',
    },
    viewed_posts: {
        type: Array,
        default: [],
    },
    followers: {
        type: Number,
        default: 0,
    },
    followed: {
        type: Array,
        default: [],
    },
})

const UserModel = mongoose.model('user', Schema);

export default UserModel;