const mongoose = require ("mongoose")

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Post title is required'],
            trim: true,
        },
        content: {
            type: String,
            required:[true, 'Post content is required']
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        likes: [
            {
                types: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Post', postSchema)