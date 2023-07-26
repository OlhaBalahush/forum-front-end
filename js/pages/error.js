import { createFooter } from "./basic.js"

export function generateErrorPage() {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    

    let mainContainer = document.createElement('div');
    mainContainer.setAttribute('id', 'error-container');
    document.body.append(mainContainer);
    createFooter();

    let errorCode = document.createElement('h1');
    errorCode.className = 'error';
    errorCode.innerHTML = '404'; // TODO take error from backend
    
    let erroMessage = document.createElement('p');
    erroMessage.setAttribute('id', 'error-message');

    let b = document.createElement('b');
    b.innerHTML = 'some message'; // TODO take message
    erroMessage.appendChild(b);

    let homeBtn = document.createElement('button');
    homeBtn.setAttribute('id', 'btn-to-home');
    homeBtn.className = 'button';

    let homeSpan = document.createElement('span');
    let homeB = document.createElement('b');
    homeB.innerHTML = 'home';
    homeSpan.appendChild(homeB);
    homeBtn.appendChild(homeSpan);

    homeBtn.addEventListener('click', () => {
        console.log('go to home'); //TODO change to real link
    });

    mainContainer.append(errorCode, erroMessage, homeBtn);
}
