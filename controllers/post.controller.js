const Post = require("../models/post.model")

exports.getAllPosts = async (req, res) => {
    const posts = await Post.find().populate('author', 'username')
    res.status(200).json({message: "All Post Fetched Successfully", posts})
}

exports.getSinglePosts = async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author', 'username')
    if (!post) return res.status(404).json({message: 'Post not found'})
        res.status(200).json({message: 'Post fetched successfully', post})
}

exports.createPost = async (req, res) => {
    const {title, content} = req.body;
    const post = await Post.create({ title, content, author: req.user._id });
    res.status(201).json({message: 'Post creation successful', post})
}

exports.updatePost = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if(!post) return res.status(404).json({message: 'Post not found'})
        if (post.author.toString() !== req.user._id.toString())
            return res.status(403).json({message: 'Unauthorized'})

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        await post.save();
        res.status(200).post({message: 'Post Updated Successfully', post})
}

exports.deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({message: 'Post not found'})
        if (post.author.toString() !== req.user._id.toString())
            return res.status(403).json({message: 'Unauthorized'})

    await post.deleteOne();
    res.status(200).json({message: "Post deleted successfully"})
}