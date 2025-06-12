const Post = require('../models/Post');

const loadPostsFromAPI = async () => {
    try {

        const count = await Post.countDocuments();
        if (count > 0) {
            console.log('Posts already loaded');
            return;
        }

        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        // await Post.deleteMany();
        await Post.insertMany(data);
        console.log('Posts loaded and saved to MongoDB');
    } catch (err) {
        console.error('Failed to load posts:', err.message);
    }
};

const getAllPosts = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    const posts = await Post.find().skip(skip).limit(limit);
    const total = await Post.countDocuments();

    res.json({ posts, total });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePost = async (req, res) => {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
};

const deletePost = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
};

module.exports = {
    loadPostsFromAPI,
    getAllPosts,
    updatePost,
    deletePost
};
