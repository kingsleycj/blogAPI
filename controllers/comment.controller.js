const Comment = require ('../models/comment.model')

exports.getAllComments = async (req, res) => {
    const comments = await Comment.find().populate('author', 'username')
    res.status(200).json({message: "All comments fetched successfully", comments})
}

exports.getSingleComment = async (req, res) => {
    const comment = await Comment.findById(req.params.id).populate('author', 'username')
    if (!comment) return res.status(404).json({message: 'Comment not found'})
        res.status(200).json({message: 'Comment fetched successfully', comment})
    }

exports.createComment = async (req, res) => {
    const {title, content} = req.body;
    const comment = await Comment.create({title, content, author: req.user._id})
    rs.status(201).json({message: 'Comment creation successful', comment})
}

exports.updateComment = async (req, res) => {
    const comment = await Comment.findById(req.params.id)
    if (!comment) return res.status(404).json({message: 'Comment not found'})
        if (comment.author.toString() !== req.user._id.toString())
            return res.status(403).json({message: 'Unauthorised'})

        comment.title = req.body.title || comment.title;
        comment.content = req.body.content || comment.content;
        await Comment.save();
        res.status(200).json({message: 'Comment updated Successfully', comment})
}

exports.deleteComment = async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({message: 'Comment not found'})
        if (comment.author.toString() !== req.user._id.toString())
            return res.status(403).json({message: 'Unauthorized'})

    await Comment.deleteOne();
    res.status(200).json({message: 'Comment deleted successfully'})
}