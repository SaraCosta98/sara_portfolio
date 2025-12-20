const urlab = "https://api.cosmicjs.com/v3/buckets/my-project-production-79a15780-938e-11ee-bad3-c399e8060022/objects/659d5a9a6e0560e7c1927708?read_key=7C8tqJzO9S1KnNTyo7v5vs5kHvk9eoUBUpOlEkGFqEzwGodRBj&depth=1&props=slug,title,metadata,";

function fetchObject() {
    fetch(urlab)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayObject(data.object);
        })
        .catch(error => console.error('Fetching error:', error));
}

function displayObject(object) {
    const objectContainer = document.getElementById('object-container');

    if (!objectContainer) {
        console.error("object container not found!");
        return;
    }

    const objectElement = document.createElement('div');
    objectElement.className = 'object';

    // Check if the object object has required properties
    if (object &&
        object.slug &&
        object.title &&
        object.metadata &&
        object.metadata.nome &&
        object.metadata.about &&
        object.metadata.content &&
        object.metadata.contacts &&
        object.metadata.perfil &&
        object.metadata.perfil.url) {

            const imageUrl = object.metadata.perfil.url;


        // Construct HTML for displaying the object information
        objectElement.innerHTML = `
                <h3>${object.title}</h3>
                <p>${object.metadata.about}</p>
                <img src="${imageUrl}" alt="${object.title} Image">
                <p>${object.metadata.content}</p>
                <div class="pinkborder">
                <p>${object.metadata.contacts}</p></div>
            `;

        objectContainer.appendChild(objectElement);
    } else {
        console.error('Invalid object structure:', object);
    }
}

fetchObject();

