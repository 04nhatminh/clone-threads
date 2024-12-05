
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
            document.getElementById('login-button').classList.remove('text-opacity-40');
        } else {
            document.getElementById('login-button').classList.add('text-opacity-40');
        }
    });
});

function process(e){
    e.preventDefault();
    window.location.href = '/';
    return false;
}

