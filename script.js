const url ="https://api.cosmicjs.com/v3/buckets/my-project-production-79a15780-938e-11ee-bad3-c399e8060022/objects?pretty=true&query=%7B%22type%22:%22project1s%22%7D&limit=10&skip=0&read_key=7C8tqJzO9S1KnNTyo7v5vs5kHvk9eoUBUpOlEkGFqEzwGodRBj&depth=1&sort=created_at&props=slug,title,metadata,";

// Function to fetch posts
function fetchPosts() {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayPosts(data.objects);
        })
        .catch(error => console.error('Fetching error:', error));
}


// Function to display posts
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) {
        console.error("Posts container not found!");
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';

        // Check if the post object has required properties
        if (post.slug && post.title && post.metadata && post.metadata.sinopse && post.metadata.image && post.metadata.description && post.metadata.date) {
            const imageUrl = post.metadata.image.url; // Get the image URL

            // Construct HTML for displaying the post information
            postElement.innerHTML = `
                <h3>Trabalhos</h3>
                <h2>${post.title}</h2>
                <p>${post.metadata.sinopse}</p>
                <img src="${imageUrl}" alt="${post.title} Image">
                <p>${post.metadata.description}</p>
                <p>Date: ${post.metadata.date}</p>
            `;
            postsContainer.appendChild(postElement);
        } else {
            console.error('Invalid post structure:', post);
        }
    });
}

// Call the function to fetch posts
fetchPosts();