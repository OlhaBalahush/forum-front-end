import { navigateTo } from "../router.js";

export function generateSignupPage() {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }

    let container = document.createElement('div');
    container.classList.add('center-container');
    document.body.appendChild(container);

    let title = document.createElement('p');
    title.classList.add('title-for-popups');
    title.innerText = 'sign up to forum';

    var line = document.createElement("div");
    line.className = "line";

    let signupForm = document.createElement('form');
    signupForm.setAttribute('action', '/sign-up');
    signupForm.setAttribute('method', 'POST');
    signupForm.classList.add('sign-up-log-in-form');

    let nicknameLb = document.createElement('label');
    nicknameLb.setAttribute('for', 'nickname');
    nicknameLb.innerHTML = 'nickname:';

    let nicknameInput = document.createElement('input');
    nicknameInput.setAttribute('type', 'text');
    nicknameInput.setAttribute('id', 'nickname');
    nicknameInput.setAttribute('name', 'nickname');
    nicknameInput.setAttribute('maxlength', '15');
    nicknameInput.classList.add('form-input');
    nicknameInput.required = true;

    let firstnameLb = document.createElement('label');
    firstnameLb.setAttribute('for', 'firstname');
    firstnameLb.innerHTML = 'first name:';

    let firstnameInput = document.createElement('input');
    firstnameInput.setAttribute('type', 'text');
    firstnameInput.setAttribute('id', 'firstname');
    firstnameInput.setAttribute('name', 'firstname');
    firstnameInput.setAttribute('maxlength', '15');
    firstnameInput.classList.add('form-input');
    firstnameInput.required = true;

    let lastnameLb = document.createElement('label');
    lastnameLb.setAttribute('for', 'lastname');
    lastnameLb.innerHTML = 'last name:';

    let lastnameInput = document.createElement('input');
    lastnameInput.setAttribute('type', 'text');
    lastnameInput.setAttribute('id', 'lastname');
    lastnameInput.setAttribute('name', 'lastname');
    lastnameInput.setAttribute('maxlength', '30');
    lastnameInput.classList.add('form-input');
    lastnameInput.required = true;

    // TODO make list of genders with posibility to add new ?
    let genderLb = document.createElement('label');
    genderLb.setAttribute('for', 'gender');
    genderLb.innerHTML = 'gender:';

    let genderInput = document.createElement('input');
    genderInput.setAttribute('type', 'text');
    genderInput.setAttribute('id', 'gender');
    genderInput.setAttribute('name', 'gender');
    genderInput.setAttribute('maxlength', '30');
    genderInput.classList.add('form-input');
    genderInput.required = true;

    let ageLb = document.createElement('label');
    ageLb.setAttribute('for', 'dateOfBirth');
    ageLb.innerHTML = 'date of birth:';

    let ageInput = document.createElement('input');
    ageInput.setAttribute('type', 'date');
    ageInput.setAttribute('id', 'age');
    ageInput.setAttribute('name', 'dateOfBirth');
    genderInput.setAttribute('max', '120');
    ageInput.classList.add('form-input');
    ageInput.required = true;

    let emailLb = document.createElement('label');
    emailLb.setAttribute('for', 'email');
    emailLb.innerHTML = 'email:';

    let emailInput = document.createElement('input');
    emailInput.setAttribute('type', 'email');
    emailInput.setAttribute('id', 'email');
    emailInput.setAttribute('name', 'email');
    emailInput.classList.add('form-input');
    emailInput.required = true;

    let passwordLb = document.createElement('label');
    passwordLb.setAttribute('for', 'password');
    passwordLb.innerHTML = 'password:';

    let passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('id', 'password');
    passwordInput.setAttribute('name', 'password');
    passwordInput.classList.add('form-input');
    passwordInput.required = true;

    let submitBtn = document.createElement('button');
    submitBtn.setAttribute('id', 'btn-apply-log-in');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.classList.add('button');
    submitBtn.innerHTML = 'sign up';



    let cancelBtn = document.createElement('button');
    cancelBtn.setAttribute('id', 'cancel');
    cancelBtn.setAttribute('type', 'submit');
    cancelBtn.classList.add('button');
    cancelBtn.innerHTML = 'cancel';

    cancelBtn.addEventListener("click", (e) => {
        e.preventDefault()
        navigateTo("/")
    })

    signupForm.append(nicknameLb, nicknameInput,
        firstnameLb, firstnameInput,
        lastnameLb, lastnameInput,
        genderLb, genderInput,
        ageLb, ageInput,
        emailLb, emailInput,
        passwordLb, passwordInput,
        submitBtn,
        cancelBtn);

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault()
        const formData = new FormData(signupForm);
        let obj = {};
        for (let [key, value] of formData.entries()) {
            obj[key] = value;
        }

        let jsonString = JSON.stringify(obj);

        fetch("/signUp", {
            method: "post",
            body: jsonString
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                if (data.Authenticated) {
                    navigateTo("/loginPage")
                } else {
                    //display error from backend
                    //TODO create display for errorw
                    console.log("Error message:", data.Error)
                }
            })
            .catch(error => {
                console.log(error);
            });
    })
    container.append(title, line, signupForm);
}