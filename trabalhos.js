/**
 * trabalhos.js - Fetches and displays work/projects with filters
 */

const urlw = "https://api.cosmicjs.com/v3/buckets/my-project-production-79a15780-938e-11ee-bad3-c399e8060022/objects/659c83116e0560e7c192753a?read_key=7C8tqJzO9S1KnNTyo7v5vs5kHvk9eoUBUpOlEkGFqEzwGodRBj&depth=1&props=slug,title,metadata,";

let allProjects = []; // Armazena todos os projetos
let currentFilter = 'todos'; // Filtro atual
let scrollPosition = 0; // Guarda a posição do scroll

/**
 * Fetches works/projects from the API
 */
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

/**
 * Cria os botões de filtro baseados nas categorias únicas
 */
function createFilterButtons(projects) {
    const workContainer = document.getElementById('work-container');
    if (!workContainer) return;

    // Extrai categorias únicas
    const filters = [...new Set(projects
        .map(p => p.metadata.category?.filter)
        .filter(Boolean)
    )];

    // Remove o conteúdo antigo da div.blu se existir
    const oldBlu = workContainer.querySelector('.blu');
    if (oldBlu) {
        oldBlu.remove();
    }

    // Cria novo container de filtros
    const filterDiv = document.createElement('div');
    filterDiv.className = 'blu';

    const filterTitle = document.createElement('h3');
    filterTitle.textContent = 'Projetos';
    filterDiv.appendChild(filterTitle);

    // Cria container dos botões
    const filterButtons = document.createElement('div');
    filterButtons.className = 'project-filters';
    filterButtons.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-top: 10px;
    `;

    // Botão "Todos"
    const allButton = createProjectFilterButton('TODOS', 'todos', true);
    filterButtons.appendChild(allButton);

    // Adiciona botões para cada categoria
    filters.forEach(category => {
        const filterName = category?.toUpperCase?.() || category;
        const button = createProjectFilterButton(filterName, category, false);
        filterButtons.appendChild(button);
    });

    filterDiv.appendChild(filterButtons);

    // Insere no início do work-container
    workContainer.insertBefore(filterDiv, workContainer.firstChild);
}

/**
 * Cria um botão de filtro individual
 */
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

    // Hover effects
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

    // Click event
    button.addEventListener('click', () => {
        filterProjects(filterValue);
        updateActiveFilterButton(button);
    });

    return button;
}

/**
 * Filtra os projetos baseado na categoria
 */
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

/**
 * Atualiza o botão ativo
 */
function updateActiveFilterButton(activeButton) {
    const allButtons = document.querySelectorAll('.filter-project-btn');

    allButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.color = '#4BC1DB';
    });

    activeButton.classList.add('active');
    activeButton.style.color = '#EF2F95';
}

/**
 * Displays the works/projects in the container
 */
function displayWorks(projects) {
    const workContainer = document.getElementById('work-container');
    if (!workContainer) {
        console.error("Work container not found!");
        return;
    }

    // Remove apenas a lista de projetos antiga, mantém os filtros
    const oldProjectList = workContainer.querySelector('.project-list');
    const oldHeader = workContainer.querySelector('.work-header');
    const oldNoProjects = workContainer.querySelector('.no-projects');

    if (oldProjectList) oldProjectList.remove();
    if (oldHeader) oldHeader.remove();
    if (oldNoProjects) oldNoProjects.remove();

    // Se não há projetos
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

    // Create the project list
    const projectList = document.createElement('ul');
    projectList.className = 'project-list';

    projects.forEach((project, index) => {
        const projectItem = document.createElement('li');
        projectItem.className = 'project-item';
        projectItem.style.opacity = '0';
        projectItem.style.animation = `fadeIn 0.5s ease-out ${index * 0.08}s forwards`;

        // Create the project link with number
        const projectLink = document.createElement('a');
        projectLink.className = 'project-link';
        const projectNumber = String(index + 1).padStart(3, '0');
        projectLink.innerHTML = `
            <span class="project-name">${project.title}</span>
            <span class="project-dots"></span>
            <span class="project-number">${projectNumber}</span>
        `;
        projectLink.href = '#';

        // Create modal popup
        projectLink.addEventListener('click', (event) => {
            event.preventDefault();
            openProjectModal(project);
        });

        projectItem.appendChild(projectLink);
        projectList.appendChild(projectItem);
    });

    workContainer.appendChild(projectList);
}

/**
 * Block body scroll
 */
function blockBodyScroll() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Guarda a largura atual antes de bloquear (para compensar scrollbar)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    // Compensa a scrollbar para evitar "jump"
    if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.documentElement.style.overflow = 'hidden';

    // Para iOS/Safari
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
}

/**
 * Restore body scroll
 */
function restoreBodyScroll() {
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('left');
    document.body.style.removeProperty('right');
    document.body.style.removeProperty('width');
    document.body.style.removeProperty('padding-right');
    document.body.style.removeProperty('height');
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('height');

    window.scrollTo(0, scrollPosition);
}

/**
 * Opens the project modal with details
 */
function openProjectModal(project) {
    const existingModal = document.getElementById('project-modal');
    if (existingModal) existingModal.remove();

    const images = project.metadata?.images || [];
    let slidesHTML = '';
    let dotsHTML = '';

    // Primeira página: Informações do projeto
    slidesHTML += `
        <div class="slide active">
            <div class="slide-info">
                <h2>${project.title}</h2>
                 <p class="modal-date">
                    <strong>Data:</strong> ${project.metadata.date || ''}
                </p>
                
                <div class="modal-sinopse">
                    <h1>Ferramentas</h1>
                    ${project.metadata.sinopse || ''}
                </div>
                <p>${project.metadata.description || ''}</p>


            </div>
        </div>
    `;
    dotsHTML += `<span class="slide-dot active" data-index="0"></span>`;

 // Páginas seguintes: Imagens e Vídeos
const videoMapping = {
    'Sara_Costa_Video.mp4': 'https://www.youtube.com/embed/z-QUMUwjGXQ',
};

images.forEach((img, index) => {
    const fileName = img.url.split('/').pop();
    const isVideo = fileName.match(/\.(mp4|webm|mov)$/i);

    if (isVideo && videoMapping[fileName]) {
        const newVideoUrl = videoMapping[fileName];

        // Se for Vimeo/YouTube use iframe
        if (newVideoUrl.includes('vimeo') || newVideoUrl.includes('youtube') || newVideoUrl.includes('youtu.be')) {
            slidesHTML += `
                <div class="slide">
                    <iframe 
                        src="${newVideoUrl}" 
                        style="width: 100%; height: 60vh; border: 3px solid #000; border-radius: 12px;"
                        allowfullscreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                </div>
            `;
        } else {
            slidesHTML += `
                <div class="slide">
                    <video controls preload="metadata" playsinline>
                        <source src="${newVideoUrl}" type="video/mp4">
                    </video>
                </div>
            `;
        }
    } else {
        // Imagem normal
        slidesHTML += `
            <div class="slide">
                <img src="${img.url}" alt="${img.alt_text || project.title}">
            </div>
        `;
    }

    dotsHTML += `<span class="slide-dot" data-index="${index + 1}"></span>`;
});

    const totalSlides = 1 + images.length;

    const modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.className = 'modal';

    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">×</button>

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

    // Block body scroll
    blockBodyScroll();

    // Event listeners para fechar
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');

    overlay.addEventListener('click', closeProjectModal);
    closeBtn.addEventListener('click', closeProjectModal);

    // Prevenir propagação de eventos no modal-content
    const modalContent = modal.querySelector('.modal-content');
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Prevenir scroll touch no overlay
    overlay.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    setTimeout(() => {
        modal.classList.add('modal-active');
    }, 10);

    if (totalSlides > 1) {
        initSlideshow();
    }
}

/**
 * Closes the project modal
 */
function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('modal-active');

        setTimeout(() => {
            modal.remove();
            // Restore body scroll
            restoreBodyScroll();
        }, 300);
    }
}

/**
 * Initialize slideshow functionality
 */
function initSlideshow() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    const prevBtn = document.querySelector('.slide-nav.prev');
    const nextBtn = document.querySelector('.slide-nav.next');
    const slidesContainer = document.querySelector('.slides');

    // Touch/Swipe variables
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

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

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(newIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIndex = (currentSlide + 1) % slides.length;
            showSlide(newIndex);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            showSlide(index);
        });
    });

    // Touch/Swipe functionality
    if (slidesContainer) {
        slidesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        slidesContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for swipe
        const horizontalDiff = touchStartX - touchEndX;
        const verticalDiff = Math.abs(touchStartY - touchEndY);

        // Only trigger if horizontal swipe is dominant
        if (verticalDiff < swipeThreshold && Math.abs(horizontalDiff) > swipeThreshold) {
            if (horizontalDiff > 0) {
                // Swipe left - next slide
                const newIndex = (currentSlide + 1) % slides.length;
                showSlide(newIndex);
            } else {
                // Swipe right - previous slide
                const newIndex = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(newIndex);
            }
        }
    }

    // Keyboard navigation
    const handleKeyboard = (e) => {
        if (e.key === 'ArrowLeft') {
            const newIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(newIndex);
        } else if (e.key === 'ArrowRight') {
            const newIndex = (currentSlide + 1) % slides.length;
            showSlide(newIndex);
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

