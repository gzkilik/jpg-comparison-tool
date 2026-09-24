/**
 * State Management Module
 * Handles centralized state for zoom, pan, undo/redo, and session persistence
 */

const State = (() => {
    const MAX_UNDO_STACK = 50;
    const STORAGE_KEY = 'jpg_comparison_session';

    let viewState = {
        zoomLevel: 1,
        panX: 0,
        panY: 0,
    };

    let undoStack = [];
    let redoStack = [];

    let images = []; // Array of { filename, objectUrl }

    /**
     * Push current state to undo stack
     */
    function pushState() {
        undoStack.push(JSON.parse(JSON.stringify(viewState)));
        redoStack = [];

        if (undoStack.length > MAX_UNDO_STACK) {
            undoStack.shift();
        }
    }

    /**
     * Get current view state
     */
    function getViewState() {
        return { ...viewState };
    }

    /**
     * Set view state (zoom and pan)
     */
    function setViewState(newState) {
        if (newState.zoomLevel !== undefined) {
            viewState.zoomLevel = Math.max(0.1, Math.min(newState.zoomLevel, 5)); // Clamp 10% to 500%
        }
        if (newState.panX !== undefined) {
            viewState.panX = newState.panX;
        }
        if (newState.panY !== undefined) {
            viewState.panY = newState.panY;
        }
    }

    /**
     * Adjust zoom level by delta
     */
    function setZoom(zoomLevel) {
        pushState();
        setViewState({ zoomLevel });
    }

    /**
     * Adjust pan position
     */
    function setPan(panX, panY) {
        setViewState({ panX, panY });
    }

    /**
     * Reset zoom and pan
     */
    function resetView() {
        pushState();
        setViewState({ zoomLevel: 1, panX: 0, panY: 0 });
    }

    /**
     * Undo last action
     */
    function undo() {
        if (undoStack.length === 0) return false;
        redoStack.push(JSON.parse(JSON.stringify(viewState)));
        viewState = undoStack.pop();
        return true;
    }

    /**
     * Redo last undone action
     */
    function redo() {
        if (redoStack.length === 0) return false;
        undoStack.push(JSON.parse(JSON.stringify(viewState)));
        viewState = redoStack.pop();
        return true;
    }

    /**
     * Check if undo is available
     */
    function canUndo() {
        return undoStack.length > 0;
    }

    /**
     * Check if redo is available
     */
    function canRedo() {
        return redoStack.length > 0;
    }

    /**
     * Add image to state
     */
    function addImage(filename, objectUrl) {
        images.push({ filename, objectUrl, id: Date.now() + Math.random() });
    }

    /**
     * Remove image from state
     */
    function removeImage(id) {
        images = images.filter(img => img.id !== id);
    }

    /**
     * Get all images
     */
    function getImages() {
        return [...images];
    }

    /**
     * Reorder images to match the supplied object URL order
     */
    function reorderImages(objectUrls) {
        const order = new Map(objectUrls.map((objectUrl, index) => [objectUrl, index]));
        images.sort((first, second) => order.get(first.objectUrl) - order.get(second.objectUrl));
    }

    /**
     * Clear all images
     */
    function clearImages() {
        images.forEach(img => URL.revokeObjectURL(img.objectUrl));
        images = [];
        resetViewState();
    }

    /**
     * Reset view state to default without creating undo point
     */
    function resetViewState() {
        viewState = { zoomLevel: 1, panX: 0, panY: 0 };
        undoStack = [];
        redoStack = [];
    }

    /**
     * Serialize session data
     */
    function serializeSession() {
        return {
            viewState,
            imageCount: images.length,
            imageFilenames: images.map(img => img.filename),
            timestamp: Date.now(),
        };
    }

    /**
     * Save session to localStorage
     */
    function saveSession() {
        const session = serializeSession();
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
            return true;
        } catch (e) {
            console.warn('Failed to save session:', e);
            return false;
        }
    }

    /**
     * Load session from localStorage
     */
    function loadSession() {
        try {
            const session = localStorage.getItem(STORAGE_KEY);
            if (!session) return null;
            return JSON.parse(session);
        } catch (e) {
            console.warn('Failed to load session:', e);
            return null;
        }
    }

    /**
     * Clear saved session
     */
    function clearSession() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (e) {
            console.warn('Failed to clear session:', e);
            return false;
        }
    }

    return {
        getViewState,
        setViewState,
        setZoom,
        setPan,
        resetView,
        undo,
        redo,
        canUndo,
        canRedo,
        addImage,
        removeImage,
        getImages,
        reorderImages,
        clearImages,
        serializeSession,
        saveSession,
        loadSession,
        clearSession,
    };
})();
