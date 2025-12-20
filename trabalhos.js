/**
 * trabalhos.js - Fetches and displays work/projects with filters and swipe support
 */

const urlw = "https://api.cosmicjs.com/v3/buckets/my-project-production-79a15780-938e-11ee-bad3-c399e8060022/objects/659c83116e0560e7c192753a?read_key=7C8tqJzO9S1KnNTyo7v5vs5kHvk9eoUBUpOlEkGFqEzwGodRBj&depth=1&props=slug,title,metadata,";

let allProjects = [];
let currentFilter = 'todos';

function fetchWorks() {
    fetch(urlw)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.object && data.object.metadata && Array.isArray(data.object.metadata.link)) {
                allProjects = data.object.metadata.link;
                displayWorks(allProjects);
                createFilterButtons(allProjects);
            } else {
                console.error('Invalid object structure:', data.object);
            }
        })
        .catch(error => console.error('Fetching error:', error));
}

function createFilterButtons(projects) {
    const workContainer = document.getElementById('work-container');
    if (!workContainer) return;

    const filters = [...new Set(projects
        .map(p => p.metadata.category?.filter)
        .filter(Boolean)
    )];

    const oldBlu = workContainer.querySelector('.blu');
    if (oldBlu) {
        oldBlu.remove();
    }

    const filterDiv = document.createElement('div');
    filterDiv.className = 'blu';

    const filterTitle = document.createElement('h3');
    filterTitle.textContent = 'Projetos';
    filterDiv.appendChild(filterTitle);

    const filterButtons = document.createElement('div');
    filterButtons.className = 'project-filters';
    filterButtons.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-top: 10px;
    `;

    const allButton = createProjectFilterButton('TODOS', 'todos', true);
    filterButtons.appendChild(allButton);

    filters.forEach(category => {
        const filterName = category?.toUpperCase?.() || category;
        const button = createProjectFilterButton(filterName, category, false);
        filterButtons.appendChild(button);
    });

    filterDiv.appendChild(filterButtons);
    workContainer.insertBefore(filterDiv, workContainer.firstChild);
}

function createProjectFilterButton(label, filterValue, isActive) {
    const button = document.createElement('p');
    button.className = 'projetos filter-project-btn' + (isActive ? ' active' : '');
    button.textContent = label;
    button.dataset.filter = filterValue;

    button.style.cssText = `
        color: ${isActive ? '#EF2F95' : '#4BC1DB'};
        font-family: Swiss 721 Condensed;
        font-size: 0.875rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        margin: 0;
        padding: 5px 0;
        user-select: none;
    `;

    button.addEventListener('mouseenter', () => {
        button.style.color = '#EF2F95';
        button.style.transform = 'translateX(5px)';
    });

    button.addEventListener('mouseleave', () => {
        if (!button.classList.contains('active')) {
            button.style.color = '#4BC1DB';
            button.style.transform = 'translateX(0)';
        }
    });

    button.addEventListener('click', () => {
        filterProjects(filterValue);
        updateActiveFilterButton(button);
    });

    return button;
}

function filterProjects(filterValue) {
    currentFilter = filterValue;

    const filteredProjects = filterValue === 'todos'
        ? allProjects
        : allProjects.filter(project => {
            const projectCategory = project.metadata?.category?.filter || 'outros';
            return projectCategory === filterValue;
        });

    displayWorks(filteredProjects);
}

function updateActiveFilterButton(activeButton) {
    const allButtons = document.querySelectorAll('.filter-project-btn');

    allButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.color = '#4BC1DB';
    });

    activeButton.classList.add('active');
    activeButton.style.color = '#EF2F95';
}

function displayWorks(projects) {
    const workContainer = document.getElementById('work-container');
    if (!workContainer) {
        console.error("Work container not found!");
        return;
    }

    const oldProjectList = workContainer.querySelector('.project-list');
    const oldHeader = workContainer.querySelector('.work-header');
    const oldNoProjects = workContainer.querySelector('.no-projects');

    if (oldProjectList) oldProjectList.remove();
    if (oldHeader) oldHeader.remove();
    if (oldNoProjects) oldNoProjects.remove();

    if (projects.length === 0) {
        const noProjectsMsg = document.createElement('div');
        noProjectsMsg.className = 'no-projects';
        noProjectsMsg.style.cssText = `
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        `;
        noProjectsMsg.innerHTML = `<p>🔭 Nenhum projeto nesta categoria.</p>`;
        workContainer.appendChild(noProjectsMsg);
        return;
    }

    const projectList = document.createElement('ul');
    projectList.className = 'project-list';

    projects.forEach((project, index) => {
        const projectItem = document.createElement('li');
        projectItem.className = 'project-item';
        projectItem.style.opacity = '0';
        projectItem.style.animation = `fadeIn 0.5s ease-out ${index * 0.08}s forwards`;

        const projectLink = document.createElement('a');
        projectLink.className = 'project-link';
        const projectNumber = String(index + 1).padStart(3, '0');
        projectLink.innerHTML = `
            <span class="project-name">${project.title}</span>
            <span class="project-dots"></span>
            <span class="project-number">${projectNumber}</span>
        `;
        projectLink.href = '#';

        projectLink.addEventListener('click', (event) => {
            event.preventDefault();
            openProjectModal(project);
        });

        projectItem.appendChild(projectLink);
        projectList.appendChild(projectItem);
    });

    workContainer.appendChild(projectList);
}

function openProjectModal(project) {
    const existingModal = document.getElementById('project-modal');
    if (existingModal) existingModal.remove();

    const images = project.metadata?.images || [];
    let slidesHTML = '';
    let dotsHTML = '';

    slidesHTML += `
        <div class="slide active">
            <div class="slide-info">
                <h2>${project.title}</h2>
                <div class="modal-sinopse">
                    ${project.metadata.sinopse || ''}
                </div>
                <p>${project.metadata.description || ''}</p>
                <p class="modal-date">
                    <strong>Data:</strong> ${project.metadata.date || ''}
                </p>
            </div>
        </div>
    `;
    dotsHTML += `<span class="slide-dot active" data-index="0"></span>`;

    images.forEach((img, index) => {
        slidesHTML += `
            <div class="slide">
                <img 
                    src="${img.url}" 
                    alt="${img.alt_text || project.title}"
                >
            </div>
        `;

        dotsHTML += `
            <span 
                class="slide-dot" 
                data-index="${index + 1}"
            ></span>
        `;
    });

    const totalSlides = 1 + images.length;

    const modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.className = 'modal';

    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeProjectModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeProjectModal()">×</button>

            <div class="modal-body">
                <div class="slideshow">
                    <div class="slides">
                        ${slidesHTML}
                    </div>

                    ${totalSlides > 1 ? `
                        <button class="slide-nav prev">‹</button>
                        <button class="slide-nav next">›</button>
                        <div class="slide-dots">${dotsHTML}</div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.classList.add('modal-active');
    }, 10);

    if (totalSlides > 1) {
        initSlideshow();
    }
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('modal-active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

/**
 * Initialize slideshow with swipe support
 */
function initSlideshow() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    const prevBtn = document.querySelector('.slide-nav.prev');
    const nextBtn = document.querySelector('.slide-nav.next');
    const slidesContainer = document.querySelector('.slides');

    // Variáveis para swipe
    let startX = 0;
    let endX = 0;
    let isDragging = false;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        currentSlide = index;
    }

    function nextSlide() {
        const newIndex = (currentSlide + 1) % slides.length;
        showSlide(newIndex);
    }

    function prevSlide() {
        const newIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(newIndex);
    }

    // Botões de navegação
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            showSlide(index);
        });
    });

    // SWIPE - Touch events
    if (slidesContainer) {
        slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        slidesContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            endX = e.touches[0].clientX;
        }, { passive: true });

        slidesContainer.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const difference = startX - endX;
            const swipeThreshold = 50; // Mínimo de 50px para considerar swipe

            if (Math.abs(difference) > swipeThreshold) {
                if (difference > 0) {
                    // Swipe para esquerda - próximo slide
                    nextSlide();
                } else {
                    // Swipe para direita - slide anterior
                    prevSlide();
                }
            }

            isDragging = false;
            startX = 0;
            endX = 0;
        });
    }

    // Keyboard navigation
    const handleKeyboard = (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    };

    document.addEventListener('keydown', handleKeyboard);
    
    // Clean up on modal close
    const modal = document.getElementById('project-modal');
    if (modal) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.removedNodes.length > 0) {
                    document.removeEventListener('keydown', handleKeyboard);
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(document.body, { childList: true });
    }
}

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

fetchWorks();
