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
            document.getElementById('send-button').classList.remove('text-opacity-40');
        } else {
            document.getElementById('send-button').classList.add('text-opacity-40');
        }
    });
});

function process(e){
    e.preventDefault();
    window.location.href = './index.html';
    return false;
}

function showPasswords(checked){
    let password = document.querySelector('#password');
    let confirmPassword = document.querySelector('#confirmPassword');
    if(checked){
        password.type = 'text';
        confirmPassword.type = 'text';
    }else{
        password.type = 'password';
        confirmPassword.type = 'password';
    }
}

function validatePasswords(){
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');

    if(password.value!== confirmPassword.value){
        confirmPassword.setCustomValidity('Passwords do not match!');
        confirmPassword.reportValidity();
    } else{
        confirmPassword.setCustomValidity('');
        
    }
}
