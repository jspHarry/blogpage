const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const Post = require('./models/Post');
// const Author = require('./models/Author');
require('dotenv').config();

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cors());

// Mongoose Models
const authorSchema = new mongoose.Schema({
    name: { type: String, required: true }
});
const Author = mongoose.model('Author', authorSchema);

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' }
});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;

// Routes

// Get all posts
app.get('/posts', async (req, res) => {
    const posts = await Post.find().populate('authorId','name');
    res.json(posts);
  });
  
  // Add a new post
  app.post('/posts', async (req, res) => {
    const newPost = new Post(req.body);
    await newPost.save();
    res.json({ message: 'Post added', post: newPost });
  });

// Delete post by ID
app.delete('/posts/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
});

// Get all authors
app.get('/authors', async (req, res) => {
    const authors = await Author.find();
    res.json(authors);
});

// Add new author
app.post('/authors', async (req, res) => {
    try {
        const author = new Author(req.body);
        await author.save();
        res.json({ message: 'Author added', author });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete author and their posts
app.delete('/authors/:id', async (req, res) => {
    await Author.findByIdAndDelete(req.params.id);
    await Post.deleteMany({ authorId: req.params.id });
    res.json({ message: 'Author and their posts deleted' });
});

// Get posts by author ID
app.get('/posts/author/:id', async (req, res) => {
    const posts = await Post.find({ authorId: req.params.id });
    res.json(posts);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
