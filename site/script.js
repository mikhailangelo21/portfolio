document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');

    const revealSectionsOnScroll = () => {
        const windowHeight = window.innerHeight;

        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top;
            const isVisible = sectionTop - windowHeight <= 0;

            if (isVisible) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    };

    // Initialize sections to start hidden
    sections.forEach((section) => section.classList.add('hidden'));

    // Listen for scroll events
    window.addEventListener('scroll', revealSectionsOnScroll);
    revealSectionsOnScroll(); // Trigger the effect on load

    // Initialize Photography Behavior
    initializeMouseStuff();
    enableImageClick();
    showDragHint();
});

let hintDone = false;

function initializeMouseStuff() {
    const track = document.getElementById('track');
    const images = document.querySelectorAll('#track .image');

    // Calculate total width of images and set track width dynamically
    const totalWidth = Array.from(images).reduce((width, image) => {
        return width + image.offsetWidth;
    }, 0);
    track.style.width = `${totalWidth}px`;

    // Set initial transform and data attributes
    const initialPercent = 40; // The initial offset for the track
    track.dataset.prevPercent = `${initialPercent}`;
    track.dataset.mouseDownAt = "0";
    track.style.transform = `translate(${initialPercent}%, 0%)`;

    // Mouse down: Record starting position
    track.onmousedown = (e) => {
        if (!hintDone) hintDone = true;
        track.dataset.mouseDownAt = e.clientX; // Record mouse position
    };

    // Mouse up: Reset and save the current position
    window.onmouseup = () => {
        track.dataset.mouseDownAt = "0"; // Reset on mouse release
        track.dataset.prevPercent = track.dataset.percent || `${initialPercent}`; // Save the current percent
    };

    // Mouse move: Handle dragging
    window.onmousemove = (e) => {
        if (track.dataset.mouseDownAt === "0") return; // Skip if not dragging

        const mouseDownAt = parseFloat(track.dataset.mouseDownAt);
        const prevPercent = parseFloat(track.dataset.prevPercent) || initialPercent;

        const mouseDelta = mouseDownAt - e.clientX; // Difference in mouse position
        const maxDelta = window.innerWidth / 2;

        // Calculate the percentage of movement
        const percent = (mouseDelta / maxDelta) * -100; // Adjusted for smoother drag
        let nextPercent = prevPercent + percent;

        // Constrain nextPercent to the range [-100, 25]
        nextPercent = Math.max(Math.min(nextPercent, 40), -40);

        // Update the track's transform property directly for immediate response
        track.style.transform = `translate(${nextPercent}%, 0%)`;

        // Update images' object position for a parallax effect
        images.forEach((image) => {
            image.style.objectPosition = `${70 + nextPercent}% center`;
        });

        // Save the current percent for reference
        track.dataset.percent = nextPercent;
    };
}

function showDragHint() {
    const track = document.getElementById('track');

    // Function to create and animate the hint
    const createHint = () => {
        const dragHint = document.createElement('div');
        dragHint.className = 'drag-hint'; // Assign a class for styling
        track.appendChild(dragHint);

        // Remove the hint after the animation completes
        dragHint.addEventListener('animationend', () => {
            dragHint.remove();
        });
    };

    // Create the hint every 2 seconds
    setInterval(() => {
        if (!hintDone) createHint();
    }, 2300); // Adjust interval as needed
}

function enableImageClick() {
    const images = document.querySelectorAll('#track .image');

    images.forEach((image) => {
        image.addEventListener('click', () => {
            showFullImage(image.src);
        });
    });
}

function showFullImage(src) {
    const fullImageContainer = document.createElement('div');
    fullImageContainer.id = 'full-image-container';

    const fullImage = document.createElement('img');
    fullImage.src = src;
    fullImage.id = 'full-image';

    const closeButton = document.createElement('button');
    closeButton.id = 'close-button';
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(fullImageContainer);
    });

    fullImageContainer.appendChild(fullImage);
    fullImageContainer.appendChild(closeButton);
    document.body.appendChild(fullImageContainer);
}
