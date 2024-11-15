//send otp
function sendOTP (){
    const emailInput = document.getElementById('loginemail');
    const OTPVerify = document.getElementById('OTPverify');

    let otp_value = Math.floor(Math.random() * 10000);

    let emailbody = `<h1>Thanks to visit our website আলোয় ভরা শহর!</h1><br><h2>Your OTP is </h2>${otp_value}`;


    Email.send({
        SecureToken : "e84b03c5-e5f6-45bb-b60c-e90ab98d7f07",
        To : emailInput.value,
        From : "kunduarpan2404@gmail.com",
        Subject : "welcome to আলোয় ভরা শহর!",
        Body : emailbody
    }).then(
      message => {

        console.log(message);

        if (message === "OK") {
            alert("OTP sent to your eamil " + emailInput.value  + otp_value);

            OTPVerify.style.display = "block";
            
            const otp = document.getElementById('otp');
            const verifyButton = document.getElementById('verify');

            verifyButton.addEventListener('click', () => {
                if (otp.value == otp_value) {
                    alert("Email address verified!!!!");
                    window.location.href = 'index.html';
                }
                else{
                    alert("Invalid OTP!!!!<br>Try again!!!!");
                }
            })    
        }
        else{
            alert("Failed to send OTP. Please try again.")
        }
        
      }
    );
}


//password strength checker
const passwordInput = document.getElementById('signuppassword');
const passwordStrength = document.getElementById('password-strength');

const regexspecialsymbol = /[!@#$%^&*(),.?":{}|<>]/;
const regexuppercase = /[A-Z]/;
const regexlowercase = /[a-z]/;
const regexnumber = /[a-z]/;

function checkPasswordStrength () {
    let password = passwordInput.value;
    let sterngth = 0;

    if (password.length >= 8) {
        sterngth += 1;
    }
    if (regexspecialsymbol.test(password)) {
        sterngth += 1;
    }
    if (regexuppercase.test(password)) {
        sterngth += 1;
    }
    if (regexlowercase.test(password)) {
        sterngth += 1;
    }
    if (regexnumber.test(password)) {
        sterngth += 1;
    }

    let percentage = (sterngth/5)*100;
    
    let gradientcolor = sterngth <= 2 ? '#ff2c1c' : (sterngth <=4 ? '#ff9800' : '#12ff12');

    passwordStrength.style.background = `linear-gradient(to right, ${gradientcolor} ${percentage}%, #4B2E2E ${percentage}%)`;

    return sterngth >= 4;
    
}


//confirm password
const confirmPasswordInput = document.getElementById("confirmpassword");
const signupButton = document.getElementById("sign_upbtn");
const message = document.getElementById("confirmpasswordmessage");

function checkPasswords() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const isStrongPassword = checkPasswordStrength();  
    if (password === confirmPassword && password.length > 0 && isStrongPassword) {
        signupButton.disabled = false;
        message.classList.add('hidden');
    } else {
        signupButton.disabled = true; 
        if (password != confirmPassword) {
            message.classList.remove('hidden');
        } 
    }
}

passwordInput.addEventListener('input', checkPasswords);
confirmPasswordInput.addEventListener('input', checkPasswords);


//smooth transition
const signupBtn = document.getElementById("signupbtn");
const loginBtn = document.getElementById("loginbtn");
const loginContainer = document.getElementById("logincontainer");
const signupContainer = document.getElementById("signupcontainer");

signupBtn.addEventListener('click', function() {
    loginContainer.classList.add('opacity-0', '-translate-y-5');
    setTimeout(() => {
        loginContainer.classList.add('hidden');
        signupContainer.classList.remove('hidden');
        signupContainer.classList.remove('opacity-0', '-translate-y-5');
        signupContainer.classList.add('opacity-100', 'translate-y-0');
    }, 500);
});

loginBtn.addEventListener('click', function() {
    signupContainer.classList.add('opacity-0', '-translate-y-5');
    setTimeout(() => {
        signupContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        loginContainer.classList.remove('opacity-0', '-translate-y-5');
        loginContainer.classList.add('opacity-100', 'translate-y-0');
    }, 500);
});


