const existingUsernames = ['user123', 'john_doe', 'admin']; 

function validateUsername(username) {
    const regex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!regex.test(username)) {
        return "Username must be 3-20 characters, just contain letters, numbers, underscores, and hyphens.";
    }
    if (existingUsernames.includes(username)) {
        return "This username is already taken. Please choose another one.";
    }
    return null;
}

function validateSignupForm() {
    const username = document.getElementById('username').value;
    const errorMessage = validateUsername(username);
    if (errorMessage) {
        document.getElementById('username-error').textContent = errorMessage;
        document.getElementById('username-error').classList.remove('hidden');
        return false;
    } else {
        document.getElementById('username-error').classList.add('hidden');
        return true;
    }
}

document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', () => {
        input.classList.add('border', 'border-gray-300');
    });
    input.addEventListener('blur', () => {
        input.classList.remove('border', 'border-gray-300');
    });
});

document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
        const allFilled = Array.from(document.querySelectorAll('.form-control')).every(input => input.value);
        if (allFilled) {
            document.getElementById('signup-button').classList.remove('text-opacity-40');
        } else {
            document.getElementById('signup-button').classList.add('text-opacity-40');
        }
    });
});

function process(e){
    e.preventDefault();
    if(!validateSignupForm())
    {
        return;
    }
    window.location.href = '/signup2';
    return false;
}
