/**
 * JPG Comparison Tool - Main Application Logic
 * Handles file loading, image display, zoom/pan, and UI updates
 */

const App = (() => {
    const ZOOM_STEP = 0.1;
    const PAN_STEP = 20;

    let images = [];
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let lastViewState = { ...State.getViewState() };

    // ===== DOM Elements =====
    const elements = {
        fileInput: document.getElementById('fileInput'),
        openButton: document.getElementById('openButton'),
        clearButton: document.getElementById('clearButton'),
        dropZone: document.getElementById('dropZone'),
        mainContent: document.getElementById('mainContent'),
        imageGrid: document.getElementById('imageGrid'),
        zoomInButton: document.getElementById('zoomInButton'),
        zoomOutButton: document.getElementById('zoomOutButton'),
        zoomLevel: document.getElementById('zoomLevel'),
        fitButton: document.getElementById('fitButton'),
        undoButton: document.getElementById('undoButton'),
        redoButton: document.getElementById('redoButton'),
        helpButton: document.getElementById('helpButton'),
        helpModal: document.getElementById('helpModal'),
    };

    // ===== Initialization =====
    function init() {
        setupEventListeners();
        loadSession();
        updateUI();
    }

    // ===== Event Listeners =====
    function setupEventListeners() {
        // File input
        elements.openButton.addEventListener('click', () => {
            elements.fileInput.click();
        });

        elements.fileInput.addEventListener('change', (e) => {
            handleFilesSelected(Array.from(e.target.files));
        });

        // Drag and drop
        elements.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            elements.dropZone.classList.add('drag-over');
        });

        elements.dropZone.addEventListener('dragleave', () => {
            elements.dropZone.classList.remove('drag-over');
        });

        elements.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            elements.dropZone.classList.remove('drag-over');
            handleFilesSelected(Array.from(e.dataTransfer.files));
        });

        // Zoom controls
        elements.zoomInButton.addEventListener('click', () => {
            const current = State.getViewState();
            State.setZoom(current.zoomLevel + ZOOM_STEP);
            render();
        });

        elements.zoomOutButton.addEventListener('click', () => {
            const current = State.getViewState();
            State.setZoom(current.zoomLevel - ZOOM_STEP);
            render();
        });

        elements.fitButton.addEventListener('click', () => {
            State.resetView();
            render();
        });

        // Undo/Redo
        elements.undoButton.addEventListener('click', () => {
            if (State.undo()) {
                render();
            }
        });

        elements.redoButton.addEventListener('click', () => {
            if (State.redo()) {
                render();
            }
        });

        // Clear
        elements.clearButton.addEventListener('click', () => {
            if (confirm('Clear all images?')) {
                State.clearImages();
                images = [];
                State.clearSession();
                updateUI();
                render();
            }
        });

        // Help modal
        elements.helpButton.addEventListener('click', () => {
            elements.helpModal.classList.remove('hidden');
        });

        elements.helpModal.querySelector('.close').addEventListener('click', () => {
            elements.helpModal.classList.add('hidden');
        });

        elements.helpModal.addEventListener('click', (e) => {
            if (e.target === elements.helpModal) {
                elements.helpModal.classList.add('hidden');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeydown);

        // Mouse wheel zoom
        document.addEventListener('wheel', handleMouseWheel, { passive: false });
    }

    // ===== File Handling =====
    function handleFilesSelected(files) {
        const jpgFiles = files.filter(file => 
            file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')
        );

        if (jpgFiles.length === 0) {
            alert('Please select JPG/JPEG files');
            return;
        }

        if (jpgFiles.length + images.length > 4) {
            alert('Maximum 4 images allowed. Current: ' + images.length);
            return;
        }

        jpgFiles.forEach(file => {
            const objectUrl = URL.createObjectURL(file);
            State.addImage(file.name, objectUrl);
            images.push({
                id: Date.now() + Math.random(),
                filename: file.name,
                objectUrl: objectUrl,
            });
        });

        updateUI();
        render();
        State.saveSession();
    }

    // ===== Session Loading =====
    function loadSession() {
        const session = State.loadSession();
        if (!session && session?.imageFilenames?.length > 0) {
            // Note: We can only restore metadata, not actual files
            // User will need to reload images
            State.getViewState().zoomLevel = session.viewState.zoomLevel;
            State.getViewState().panX = session.viewState.panX;
            State.getViewState().panY = session.viewState.panY;
        }
    }

    // ===== Keyboard & Mouse Input =====
    function handleKeydown(e) {
        if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            const current = State.getViewState();
            State.setZoom(current.zoomLevel + ZOOM_STEP);
            render();
        } else if (e.key === '-' || e.key === '_') {
            e.preventDefault();
            const current = State.getViewState();
            State.setZoom(current.zoomLevel - ZOOM_STEP);
            render();
        } else if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            if (State.undo()) render();
        } else if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
            e.preventDefault();
            if (State.redo()) render();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const current = State.getViewState();
            State.setPan(current.panX, current.panY + PAN_STEP);
            render();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const current = State.getViewState();
            State.setPan(current.panX, current.panY - PAN_STEP);
            render();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const current = State.getViewState();
            State.setPan(current.panX + PAN_STEP, current.panY);
            render();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const current = State.getViewState();
            State.setPan(current.panX - PAN_STEP, current.panY);
            render();
        } else if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            State.resetView();
            render();
        }
    }

    function handleMouseWheel(e) {
        if (!images.length) return;
        e.preventDefault();

        const current = State.getViewState();
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        State.setZoom(current.zoomLevel + delta);
        render();
    }

    function handleImageMouseDown(e, imageId) {
        isDragging = true;
        dragStart = { x: e.clientX, y: e.clientY };
        e.currentTarget.classList.add('grabbing');
    }

    function handleImageMouseMove(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const current = State.getViewState();
        State.setPan(current.panX + deltaX, current.panY + deltaY);
        render();

        dragStart = { x: e.clientX, y: e.clientY };
    }

    function handleImageMouseUp(e) {
        isDragging = false;
        document.querySelectorAll('.image-wrapper').forEach(el => {
            el.classList.remove('grabbing');
        });
    }

    // ===== Rendering =====
    function render() {
        const viewState = State.getViewState();
        const zoomPercent = Math.round(viewState.zoomLevel * 100);
        elements.zoomLevel.textContent = zoomPercent + '%';

        document.querySelectorAll('.image-wrapper img').forEach(img => {
            img.style.transform = `scale(${viewState.zoomLevel}) translate(${viewState.panX}px, ${viewState.panY}px)`;
        });

        updateButtonStates();
        State.saveSession();
    }

    function updateUI() {
        updateImageGrid();
        updateButtonStates();

        if (images.length > 0) {
            elements.dropZone.classList.add('hidden');
            elements.mainContent.classList.remove('hidden');
        } else {
            elements.dropZone.classList.remove('hidden');
            elements.mainContent.classList.add('hidden');
        }
    }

    function updateImageGrid() {
        elements.imageGrid.innerHTML = '';
        elements.imageGrid.className = 'image-grid';

        if (images.length > 0) {
            elements.imageGrid.classList.add(`count-${images.length}`);
        }

        images.forEach((image, index) => {
            const container = document.createElement('div');
            container.className = 'image-container';

            const wrapper = document.createElement('div');
            wrapper.className = 'image-wrapper';

            const img = document.createElement('img');
            img.src = image.objectUrl;
            img.alt = image.filename;

            wrapper.appendChild(img);

            const label = document.createElement('div');
            label.className = 'image-label';
            label.textContent = `${index + 1}. ${image.filename}`;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', () => {
                State.removeImage(image.id);
                images = images.filter(img => img.id !== image.id);
                URL.revokeObjectURL(image.objectUrl);
                State.saveSession();
                updateUI();
                render();
            });

            wrapper.addEventListener('mousedown', (e) => handleImageMouseDown(e, image.id));
            document.addEventListener('mousemove', handleImageMouseMove);
            document.addEventListener('mouseup', handleImageMouseUp);

            container.appendChild(wrapper);
            container.appendChild(label);
            container.appendChild(removeBtn);

            elements.imageGrid.appendChild(container);
        });
    }

    function updateButtonStates() {
        elements.undoButton.disabled = !State.canUndo();
        elements.redoButton.disabled = !State.canRedo();
        elements.clearButton.disabled = images.length === 0;
    }

    return {
        init,
    };
})();

// ===== Start Application =====
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
