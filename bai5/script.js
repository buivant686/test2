const email= document.getElementById("email");
const password =document.getElementById("password");
const confirmPassword=document.getElementById("confirmPassword");
const submitBtn =document.getElementById("submitBtn");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmError");

const overlay = document.getElementById("overlay");
const closePopup = document.getElementById("closePopup");
const togglePassword = document.getElementById("togglePassword");

function validateFrom(){
    let isValid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email.value)){
        emailError.textContent = "Invalid email format";
        isValid= false;
    }else{
        emailError.textContent="";
    }

    if(password.value.length <6){
        passwordError.textContent="Mat khau phai tren 6 ki tu";
        isValid=false;
    }else{
        passwordError.textContent=""
    }
    if(confirmPassword.value !==password.value || confirmPassword.value =="")
    {
        confirmError.textContent="Mat khau khong dung";
        isValid=false;
    }else{
        confirmError.textContent="";
    }
    submitBtn.disabled=!isValid;
    return isValid;
}
[email, password, confirmPassword].forEach(input => {
    input.addEventListener("input", validateFrom);
});

togglePassword.addEventListener("click", function() {
    const isPassword = password.type === "password";
    password.type = isPassword ? "text" : "password";
    confirmPassword.type = isPassword ? "text" : "password"; // Nên đổi cả ô confirm
    this.textContent = isPassword ? "Hide Password" : "Show Password";
});
document.getElementById("registerForm").addEventListener("submit",function(e){
    e.preventDefault();
    if(validateFrom()){
    overlay.classList.add("show");
    
    submitBtn.disabled=true;
}
});
closePopup.addEventListener("click",function(){
    overlay.classList.remove("show");
});
overlay.addEventListener("click",function(e){
    if(e.target ===overlay)
    {
        overlay.classList.remove("show");
    }
});

