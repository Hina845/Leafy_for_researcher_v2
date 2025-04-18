import PostModel from '../models/postModel.js';
import UserModel from '../models/userModel.js';
import TagModel from '../models/tagModel.js';
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
                subtitle: post.subtitle,
                author: author.display_name,
                date: post.date_created.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
                views: post.views,
                imageUrl: `${thumbnail_path}`,
            });
            content_cards.push(template)
        }
        return res.json({ success: true, content_cards });
    } catch (err) {
        console.error(err.message);
        return res.json({ success: false, error: err.message });
    }
}

async function getSearchValue(req, res) {
    const regex = req.query.value || '';
    const limit = parseInt(req.query.limit) || 10;
    let searchResponse = {
        tags: [],
        posts: [],
        users: [],
    }
    try {
        const [tags, posts, users, users_by_display_name] = await Promise.all([
            TagModel.find({ name: { $regex: regex, $options: 'iu' } }).limit(limit),
            PostModel.find({ title: { $regex: regex, $options: 'iu' } }).limit(limit),
            UserModel.find({ username: { $regex: regex, $options: 'i' } }).limit(limit),
            UserModel.find({ display_name: { $regex: regex, $options: 'iu' } }).limit(limit),
        ]);

        const userUsernames = new Set(users.map(user => user.username));
        for (let user of users_by_display_name) {
            if (!userUsernames.has(user.username)) {
            users.push(user);
            userUsernames.add(user.username);
            }
        }

        searchResponse.tags = tags.map(tag => ({
            _id: tag._id,
            name: tag.name,
        }));

        const postAuthors = await UserModel.find({
            _id: { $in: posts.map(post => post.owned_user_id) },
        }).lean();

        const authorMap = postAuthors.reduce((map, author) => {
            map[author._id] = author.display_name;
            return map;
        }, {});

        searchResponse.posts = posts.map(post => ({
            _id: post._id,
            title: post.title,
            author_name: authorMap[post.owned_user_id] || 'Unknown',
            date_created: post.date_created.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                }),
            view: post.views,
        }));

        const userProfilePaths = users.map(user => ({
            user,
            profilePicturePath: path.join(__dirname, '..', 'public', 'users', user._id.toString()),
        }));

        for (let { user, profilePicturePath } of userProfilePaths) {
            if (!fs.existsSync(profilePicturePath)) {
                user.profile_image = 'assets/images/imgDefaultProfilePicture.png';
            } else {
                const files = fs.readdirSync(profilePicturePath);
                user.profile_image = path.join('users', user._id.toString(), files[0]);
            }
        }

        searchResponse.users = users.map(user => ({
            _id: user._id,
            username: user.username,
            display_name: user.display_name,
            profile_picture_url: user.profile_image,
        }));

        return res.json({ success: true, data: searchResponse });
    } catch (err) {
        console.error(err.message);
        return res.json({ success: false, error: err.message });
    }
}

export { getContentCards, getSearchValue };