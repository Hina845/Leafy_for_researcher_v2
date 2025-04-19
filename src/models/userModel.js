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
    display_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    notifiaction_email: {
        type: String,
        default: null,
    },
    owned_posts: {
        type: Array,
        default: [],
    },
    viewed_posts: {
        type: Array,
        default: [],
    },
    followers: {
        type: Array,
        default: [],
    },
    followed: {
        type: Array,
        default: [],
    },
    total_views: {
        type: Number,
        default: 0,
    }
})

const UserModel = mongoose.model('user', Schema);

export default UserModel;