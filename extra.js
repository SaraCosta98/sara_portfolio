const urle = 'https://api.cosmicjs.com/v3/buckets/my-project-production-79a15780-938e-11ee-bad3-c399e8060022/objects/659d79026e0560e7c19277e3?read_key=7C8tqJzO9S1KnNTyo7v5vs5kHvk9eoUBUpOlEkGFqEzwGodRBj&depth=1&props=slug,title,metadata,';

function fetchExtra() {
    fetch(urle)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayExtra(data.object);
        })
        .catch(error => console.error('Fetching error:', error));
}

function displayExtra(extra) {
    const extraContainer = document.getElementById('extra-container');
    if (!extraContainer) {
        console.error("extra container not found!");
        return;
    }

    const extraElement = document.createElement('div');
    extraElement.className = 'extra';

    // Check if the object has required properties
    if (
        extra &&
        extra.slug &&
        extra.title &&
        extra.metadata &&
        extra.metadata.about_me &&
        extra.metadata.text_about &&
        extra.metadata.curiosity &&
        extra.metadata.image &&
        extra.metadata.image.url &&
        extra.metadata.gif && 
        extra.metadata.gif.url  
    ) {
        const aboutMeText = extra.metadata.about_me;
        const textAbout = extra.metadata.text_about;
        const curiosity = extra.metadata.curiosity;
        const imageUrl = extra.metadata.image.url;
        const gifUrl = extra.metadata.gif.url;

        // Construct HTML for displaying the object information
        extraElement.innerHTML = `
        <img src="${imageUrl}" alt="Image">
            <p>${aboutMeText}</p>
            <p>${textAbout}</p>
            <p>${curiosity}</p>
            <img src="${gifUrl}" alt="GIF">
        `;
        extraContainer.appendChild(extraElement);
    } else {
        console.error('Invalid object structure:', extra);
    }
}

fetchExtra();
