import Connect from './dbConnect.js';
import TagModel from '../models/tagModel.js';

Connect("mongodb+srv://11236187:Pass*is*1234@cluster0.am0qsfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

async function saveTag(tags) {
    console.log(tags);
    for (let tag of tags) {
        const tagExists = await TagModel.findOne({ name: tag.name });
        if (tagExists) {
            console.log(`Tag ${tag.name} duplicated!`);
            continue;
        };
        const newTag = new TagModel({
            name: tag.name,  // String
            group: tag.group, // List of strings
        });
        await newTag.save();
        console.log(`Tag ${tag.name} saved successfully!`);
    }
}

let tags = ['AI',
        'Data Science',
        'Machine Learning',

    ]
let groups = [['Hot'],
          ['Club', 'Hot'],
          ['Trending'],

        ]

saveTag(tags.map((tag, index) => ({ name: tag, group: groups[index] })))
.then(() => {
    console.log('Tags saved successfully!');
})
.catch((error) => {
    console.error('Error saving tags:', error);
});