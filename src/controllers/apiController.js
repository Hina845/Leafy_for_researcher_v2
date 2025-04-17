import PostModel from '../models/postModel.js';
import UserModel from '../models/userModel.js';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve('src');

async function getContentCards(req, res) {

    const post_id = req.body.post_id || null;
    const user_id = req.body.user_id || null;
    const limit = req.body.limit || 10;
    const tags = req.body.tags || [];

    let query = {};
    if (post_id) query._id = post_id;
    if (user_id) query.owned_user_id = user_id;
    if (tags.length > 0) query.tags = { $in: tags };
    try {
        const posts = await PostModel.find(query).limit(limit);
        if (!posts) return res.status(400).json({ success: false, error: 'post-not-exist' });

        let content_cards = [];
        for (let post of posts) {
            const post_directory = `researches/${post._id.toString()}/content.md`;
            const author = await UserModel.findById(post.owned_user_id);
            const thumbnail_directory = path.resolve('public', 'researches', post._id.toString());
            const thumbnail_files = fs.readdirSync(thumbnail_directory);
            const thumbnail_file = thumbnail_files.find(file => /\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(file));
            if (!thumbnail_file) {
                throw new Error(`Thumbnail not found for post ${post._id}`);
            }
            const thumbnail_path = path.join('researches', post._id.toString(), thumbnail_file);
            const template = await ejs.renderFile(__dirname + '/views/content-card.ejs', {
                tags: post.tags,
                title: post.title,
                author: author.display_name,
                date: post.date_created.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
                views: post.views,
                imageUrl: `${thumbnail_path}`,
            });
            content_cards.push({template, post_directory})
        }
        return res.json({ success: true, content_cards });
    } catch (err) {
        console.error(err.message);
        return res.json({ success: false, error: err.message });
    }
}

export { getContentCards };