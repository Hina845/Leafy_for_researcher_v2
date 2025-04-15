import moongoose from 'mongoose';

const Schema = moongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
        required: true,
    },
    date_created: {
        type: Date,
        default: Date.now,
        required: true,
    },
    owned_user_id: {
        type: String,
        required: true,
    },
    content_path: {
        type: String,
        required: true,
    },
})

const PostModel = moongoose.model('post', Schema);

export default PostModel;