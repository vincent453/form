// first create a animation . adding a class to the container element when we click the sign up button in the panel,
// and remove it when we click the sign in button on the other panel

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () => {
    container.classList.remove("sign-up-mode");
});

function myFunction() {
      var x = document.getElementById("pass");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }

    const togglePassword = document.querySelector('#eye-open');
 
 
  togglePassword.addEventListener('click', function (e) {
   
    
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});

function myFunction2() {
      var y = document.getElementById("pas");
      if (y.type === "password") {
        y.type = "text";
      } else {
        y.type = "password";
      }
    }

    const togglePassword2 = document.querySelector('#eye-open2');
 
 
  togglePassword2.addEventListener('click', function (e) {
   
    
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});

