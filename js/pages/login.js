import { navigateTo } from "../router.js";

export function generateLoginPage() {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }

    let container = document.createElement('div');
    container.classList.add('center-container');
    document.body.appendChild(container);

    let title = document.createElement('p');
    title.classList.add('title-for-popups');
    title.innerText = 'log in to forum';

    var line = document.createElement("div");
    line.className = "line";

    let loginForm = document.createElement('form');
    loginForm.setAttribute('action', '/log-in');
    loginForm.setAttribute('method', 'POST');
    loginForm.classList.add('sign-up-log-in-form');

    let emailNickLb = document.createElement('label');
    emailNickLb.setAttribute('for', 'email-address-log-in');
    emailNickLb.innerHTML = 'email address:';

    let emailNickInput = document.createElement('input');
    emailNickInput.setAttribute('type', 'email');
    emailNickInput.setAttribute('id', 'email-address-log-in');
    emailNickInput.setAttribute('name', 'email-address-log-in');
    emailNickInput.classList.add('form-input');
    emailNickInput.required = true;

    let passwordLb = document.createElement('label');
    passwordLb.setAttribute('for', 'password-log-in');
    passwordLb.innerHTML = 'password:';

    let passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('id', 'password-log-in');
    passwordInput.setAttribute('name', 'password-log-in');
    passwordInput.classList.add('form-input');
    passwordInput.required = true;

    let submitBtn = document.createElement('button');
    submitBtn.setAttribute('id', 'btn-apply-log-in');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.classList.add('button');
    submitBtn.innerHTML = 'log in';

    submitBtn.addEventListener("click", async (e) => {
        e.preventDefault()
        let path = "/login/" + "$" + emailNickInput.value + ":" + passwordInput.value
        const getUser = fetch(path).then((response) => response.json()).then((user) => {
            return user
        })

        const authenticateUser = async () => {
            const user = await getUser
            console.log(user)
            if (user.Authenticated) {
                navigateTo("/")
            } else {
                //Display error for the user here --------------------------------------
                console.log(user.Error)
                // errorText.innerHTML = user.Error
            }
        }
        authenticateUser()
    })
    //added this to test around, change it if needed
    let signUpBtn = document.createElement('button');
    signUpBtn.setAttribute('id', 'btn-apply-sign-up');
    signUpBtn.setAttribute('type', 'submit');
    signUpBtn.classList.add('button');
    signUpBtn.innerHTML = 'sign up';

    signUpBtn.addEventListener("click", (e) => {
        e.preventDefault()
        navigateTo("/sign-up")
    })

    // #region google / github
    // let googleGithubCont = document.createElement('div');
    // googleGithubCont.classList.add('google-github');

    // let google = document.createElement('a');
    // google.setAttribute('href', '/google/login/');

    // let googleIcon = document.createElement('img');
    // googleIcon.setAttribute('width', '40');
    // googleIcon.setAttribute('height', '40');
    // googleIcon.setAttribute('src', '/static/img/google-icon.svg');
    // google.appendChild(googleIcon);

    // let github = document.createElement('a');
    // github.setAttribute('href', '/github/login/');

    // let githubIcon = document.createElement('img');
    // githubIcon.setAttribute('width', '40');
    // githubIcon.setAttribute('height', '40');
    // githubIcon.setAttribute('src', '/static/img/github-icon.svg');
    // github.appendChild(githubIcon);

    // googleGithubCont.append(google, github);
    // #endregion

    loginForm.append(emailNickLb, emailNickInput, passwordLb, passwordInput, submitBtn, signUpBtn);
    container.append(title, line, loginForm);
}