const url = "https://api.cosmicjs.com/v3/buckets/my-project-production-79a15780-938e-11ee-bad3-c399e8060022/objects?pretty=true&query=%7B%22type%22:%22project1s%22%7D&limit=10&skip=0&read_key=7C8tqJzO9S1KnNTyo7v5vs5kHvk9eoUBUpOlEkGFqEzwGodRBj&depth=1&sort=created_at&props=slug,title,metadata";

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

    // Ordena os posts pela data (mais recente primeiro)
    const sortedPosts = [...posts].sort((a, b) => {
        const dateA = a.metadata.date ? new Date(a.metadata.date) : new Date(0);
        const dateB = b.metadata.date ? new Date(b.metadata.date) : new Date(0);
        return dateB - dateA; // Ordem decrescente (mais recente primeiro)
    });

    sortedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';

        // Check if the post object has required properties
        if (post.slug && post.title && post.metadata) {
            const imageUrl = post.metadata.image?.url || ''; // Get the image URL safely
            const sinopse = post.metadata.sinopse || '';
            const description = post.metadata.description || '';
            const date = post.metadata.date || '';
            
            // Get category name (filter title)
            const categoryName = post.metadata.category?.filter || 'Trabalhos';

            // Construct HTML for displaying the post information
            postElement.innerHTML = `
                <h3>${categoryName}</h3>
                <h2>${post.title}</h2>
                ${imageUrl ? `<img src="${imageUrl}" alt="${post.title} Image">` : ''}
                 ${sinopse ? `<p><strong>Ferramentas: </strong>${sinopse}</p>` : ''}
                ${description ? `<p>${description}</p>` : ''}
                ${date ? `<p id="date">Data: ${date}</p>` : ''}
            `;
            postsContainer.appendChild(postElement);
        } else {
            console.error('Invalid post structure:', post);
        }
    });
}

// Call the function to fetch posts
fetchPosts();

// Animação da capa
const sentence1 = "Olá! Eu sou a Sara. Designer e Multimédia.";
const sentence2 = "Take a look at my work!";

let i = 0;

function writeSentence1() {
    if (i < sentence1.length) {
        document.getElementById("sentence1").innerHTML += sentence1.charAt(i);
        i++;
        setTimeout(writeSentence1, 50);
    } else {
        i = 0;
        setTimeout(writeSentence2, 1000);
    }
}

function writeSentence2() {
    if (i < sentence2.length) {
        document.getElementById("sentence2").innerHTML += sentence2.charAt(i);
        i++;
        setTimeout(writeSentence2, 50);
    }
}

writeSentence1();

window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("capa").classList.add("virar");

        // libertar scroll depois da animação
        setTimeout(() => {
            document.body.style.overflow = "auto";
        }, 1400);

    }, 5000);
});

