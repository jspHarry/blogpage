const API_BASE = 'https://blogpage-3sny.onrender.com';
const authorId = document.getElementById('postAuthor').value;


document.addEventListener("DOMContentLoaded", function () {
const createBlogBtn = document.getElementById("createBlogBtn");
const blogContainer = document.getElementById("blogContainer");

if (createBlogBtn) {
createBlogBtn.addEventListener("click", function () {
    console.log("Create Blog button clicked!"); 
    if (blogContainer) {
        blogContainer.style.display = "block"; 
        window.scrollTo({
            top: blogContainer.offsetTop,
            behavior: "smooth"
        });
    } else {
        console.error("Blog container not found!");
    }
});
} else {
console.error("Create Blog button not found!");
}
});





async function fetchAuthors() {
    const res = await fetch(`${API_BASE}/authors`);
    const authors = await res.json();
    const authorDiv = document.getElementById('authors');
    const authorSelect = document.getElementById('postAuthor');
    authorDiv.innerHTML = '';
    authorSelect.innerHTML = '';
    authors.forEach(author => {
        authorDiv.innerHTML += `<div class='author'>${author.name} <button onclick="deleteAuthor('${author._id}')">Delete</button></div>`;
        authorSelect.innerHTML += `<option value="${author._id}">${author.name}</option>`;
    });
    
}


async function fetchPosts() {
    const res = await fetch(`${API_BASE}/posts`);
    const posts = await res.json();
    const postDiv = document.getElementById('posts');
    postDiv.innerHTML = '';
    posts.forEach(post => {
        postDiv.innerHTML += `<div class='post'><strong>${post.title}</strong><br>${post.content} <button onclick="deletePost('${post._id}')">Delete</button></div>`;

    });
}

async function addAuthor() {
    const name = document.getElementById('authorName').value;
    await fetch(`${API_BASE}/authors`, {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: { 'Content-Type': 'application/json' }
    });
    fetchAuthors();
}

async function addPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const authorId = document.getElementById('postAuthor').value;

    if (!authorId) {
        alert("Please select an author!");
        return;
    }

    await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        body: JSON.stringify({ title, content, authorId }),
        headers: { 'Content-Type': 'application/json' }
    });

    fetchPosts();
}



async function deletePost(id) {
    await fetch(`${API_BASE}/posts/${id}`, { method: 'DELETE' });
    fetchPosts();
}

async function deleteAuthor(id) {
    await fetch(`${API_BASE}/authors/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchAuthors();
            fetchPosts(); // Refresh posts to remove deleted author's posts
        });
}

async function searchPostsByAuthor() {
    const searchName = document.getElementById('searchAuthor').value.toLowerCase();
    const authors = await fetch(`${API_BASE}/authors`).then(res => res.json());
    const foundAuthor = authors.find(author => author.name.toLowerCase() === searchName);

    if (foundAuthor) {
        const posts = await fetch(`${API_BASE}/posts/author/${foundAuthor._id}`).then(res => res.json());
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';

        if (posts.length > 0) {
            posts.forEach(post => {
                searchResults.innerHTML += `<div class='post'><strong>${post.title}</strong><br>${post.content}</div>`;
            });
        } else {
            searchResults.innerHTML = `<p>No posts found for this author.</p>`;
        }
    } else {
        document.getElementById('searchResults').innerHTML = `<p>Author not found.</p>`;
    }
}

fetchAuthors();
fetchPosts();
