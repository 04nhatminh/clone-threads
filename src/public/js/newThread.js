const newThreadButton = document.getElementById('new-thread-button');
const newThreadOverlay = document.getElementById('new-thread-overlay');
const createContainer = document.getElementById('create-container');
const postInput = document.querySelector('.post-input');
const postButton = document.getElementById('post-button');
const scrollableContent = document.getElementById('scrollable-content');
const image = document.getElementById('attach-image');
const textarea = document.getElementById('content');
const fileInput = document.getElementById('image-upload');

const adjustContainerHeight = () => {
    if (window.innerWidth < 768) {
        createContainer.style.height = '100vh';
        scrollableContent.style.overflowY = 'auto';
    } else {
        createContainer.style.height = 'auto';
        const maxHeight = window.innerHeight * 0.7;
        const containerHeight = createContainer.offsetHeight;

        if (containerHeight > maxHeight) {
            createContainer.style.height = `${maxHeight}px`;
            scrollableContent.style.overflowY = 'auto';
        } else {
            createContainer.style.height = 'auto';
            scrollableContent.style.overflowY = 'hidden';
        }
    }
}

window.addEventListener('resize', adjustContainerHeight);

const createNewThread = () => {
    newThreadOverlay.classList.remove('hidden');
    newThreadOverlay.classList.add('flex');

    adjustContainerHeight();

    setTimeout(() => {
        createContainer.classList.remove('scale-95', 'opacity-0');
        createContainer.classList.add('scale-100', 'opacity-100');
    }, 100);

    postInput.focus();
};

if (postInput && postButton) {
    postInput.addEventListener('input', () => {
        postInput.style.height = 'auto';
        postInput.style.height = postInput.scrollHeight + 'px';

        adjustContainerHeight();

        if (postInput.value.trim()) {
            postButton.classList.remove('bg-white/10', 'text-gray-400', 'cursor-not-allowed');
            postButton.classList.add('bg-white', 'text-black', 'cursor-pointer');
        } else {
            postButton.classList.add('bg-white/10', 'text-gray-400', 'cursor-not-allowed');
            postButton.classList.remove('bg-white', 'text-black', 'cursor-pointer');
        }
    });
}

const exitCreate = () => {
    newThreadOverlay.classList.add('hidden');

    textarea.value = '';
    textarea.style.height = 'auto';

    image.src = '';
    image.classList.add('hidden');

    fileInput.value = '';

    postButton.classList.add('text-gray-400', 'cursor-not-allowed');
    postButton.classList.remove('text-blue-500', 'cursor-pointer');

    createContainer.style.height = 'auto';
    scrollableContent.style.overflowY = 'hidden';

    if (image.src.startsWith('blob:')) {
        URL.revokeObjectURL(image.src);
    }

    createContainer.classList.remove('scale-100', 'opacity-100');
    createContainer.classList.add('scale-95', 'opacity-0');
}

document.getElementById('new-thread-overlay').addEventListener('click', (e) => {
    if (!createContainer.contains(e.target)) {
        exitCreate();
    }
});

const previewImage = (event) => {
    image.src = URL.createObjectURL(event.target.files[0]);
    image.classList.remove('hidden');

    image.onload = () => {
        URL.revokeObjectURL(image.src);
        adjustContainerHeight();
    };
}

document.getElementById('content').addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    adjustContainerHeight();
});

adjustContainerHeight();