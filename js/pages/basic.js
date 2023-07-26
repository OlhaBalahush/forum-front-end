import { navigateTo } from "../router.js";
import { generateProfilePage } from "./profile.js";

export function createHeader(curruser) {
    let header = document.createElement('header');
    document.body.append(header);

    let homeBtn = document.createElement('button');
    homeBtn.setAttribute('id', 'btn-home');

    let homeIcon = document.createElement('img');
    homeIcon.setAttribute('id', 'logo');
    homeIcon.setAttribute('src', '/img/logo.svg');

    homeBtn.appendChild(homeIcon);

    homeBtn.addEventListener('click', (e) => {
        e.preventDefault()
        navigateTo("/")
    });

    header.append(homeBtn);

    let loginBtn = document.createElement('button');
    loginBtn.className = 'button';
    loginBtn.setAttribute('id', 'btn-log-in');
    loginBtn.innerHTML = 'log in';

    loginBtn.addEventListener('click', () => {
        e.preventDefault()
        navigateTo("/login")
    });

    let signupBtn = document.createElement('button');
    signupBtn.className = 'button';
    signupBtn.setAttribute('id', 'btn-sign-up');
    signupBtn.innerHTML = 'sign up';

    signupBtn.addEventListener('click', () => {
        e.preventDefault()
        navigateTo("/sign-up")
    });

    let logoutBtn = document.createElement('button');
    logoutBtn.className = 'button';
    logoutBtn.setAttribute('id', 'btn-log-out');
    logoutBtn.innerHTML = 'log out';

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fetch("/logout")
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                console.log("logging out")
                navigateTo("/")
            })
            .catch(error => {
                console.log(error);
            });
        // TODO create handler for log out
        navigateTo('/log-out');
    })

    let chatBtn = document.createElement('button');
    chatBtn.setAttribute('id', 'btn-chat');

    let chatIcon = document.createElement('img');
    chatIcon.setAttribute('id', 'btn-my-profile-icon');
    chatIcon.setAttribute('src', '/img/chat.svg'); // TODO take user img if it is existed
    chatBtn.appendChild(chatIcon);

    chatBtn.addEventListener('click', (e) => {
        e.preventDefault()
        navigateTo("/chats")
    })

    if (curruser != null) {
        let profileBtn = document.createElement('a');
        profileBtn.setAttribute('id', 'btn-my-profile');
        profileBtn.setAttribute('href', `/profilepage/${curruser.Nickname}`);
    
        profileBtn.addEventListener("click", (e) => {
            e.preventDefault()
            navigateTo(`/profile/${curruser.Nickname}`)
            generateProfilePage(curruser, curruser, null, curruser.Posts)
        })
        profileBtn.addEventListener("click", (e) => {
            e.preventDefault()
            generateProfilePage(curruser, curruser, null, curruser.posts)
        })
        let profileImgCont = document.createElement('div');
        profileImgCont.className = 'container-btn-my-profile-icon';
    
        let profileImg = document.createElement('img');
        profileImg.setAttribute('id', 'btn-my-profile-icon');
        profileImg.setAttribute('src', '/img/user-image.svg'); // TODO take user img if it is existed
        profileImgCont.appendChild(profileImg);
        profileBtn.append(profileImgCont);
    }





    // let nickname = document.createElement('span');
    // nickname.innerHTML = 'my profile';


    if (curruser == null) {
        header.append(loginBtn, signupBtn);
    } else {
        header.append(logoutBtn, chatBtn ,profileBtn);
    }

}

export function createFooter() {
    let footer = document.createElement('footer');
    document.body.append(footer);

    let aboutCont = document.createElement('div');
    aboutCont.setAttribute('id', 'about');

    let aboutProjectTitle = document.createElement('p');
    aboutProjectTitle.className = 'footer-titles';
    aboutProjectTitle.innerHTML = 'About project';

    let aboutProject = document.createElement('p');
    aboutProject.innerHTML = `The web forum with user authentication, 
    post/comment features, like/dislike functionality, category filtering,
    encrypted passwords in an SQLite database, login sessions via cookies, 
    and Docker containerization.`;

    aboutCont.append(aboutProjectTitle, aboutProject);

    let contactInfoCont = document.createElement('div');
    contactInfoCont.setAttribute('id', 'contact-info');

    let ourTeamTitle = document.createElement('p');
    ourTeamTitle.className = 'footer-titles';
    ourTeamTitle.innerHTML = 'Our team';

    let table = document.createElement('table');

    let tr1 = document.createElement('tr');
    let td11 = document.createElement('td');
    td11.innerHTML = 'Front-end:';
    let td12 = document.createElement('td');
    let member1Btn = document.createElement('a');
    member1Btn.setAttribute('href', 'https://01.kood.tech/git/Olya');
    member1Btn.innerHTML = 'Olha Balahush';
    td12.append(member1Btn);
    tr1.append(td11, td12);
    let tr2 = document.createElement('tr');
    let td21 = document.createElement('td');
    td21.innerHTML = 'Back-end:';
    let td22 = document.createElement('td');
    let member2Btn = document.createElement('a');
    member2Btn.setAttribute('href', 'https://01.kood.tech/git/TaivoT');
    member2Btn.innerHTML = 'Taivo Tokman';
    td22.append(member2Btn);
    tr2.append(td21, td22);
    let tr3 = document.createElement('tr');
    let td31 = document.createElement('td');
    td31.innerHTML = 'Db:';
    let td32 = document.createElement('td');
    let member3Btn = document.createElement('a');
    member3Btn.setAttribute('href', 'https://01.kood.tech/git/ekhalets');
    member3Btn.innerHTML = 'Elena Khaletska';
    td32.append(member3Btn);
    tr3.append(td31, td32);
    table.append(tr1, tr2, tr3);

    contactInfoCont.append(ourTeamTitle, table);

    let copyrightCont = document.createElement('div');
    copyrightCont.setAttribute('id', 'copyright');

    let text = document.createElement('p');
    text.innerHTML = `Copyright &copy; 2023 All rights reserved 
    | <a href="https://01.kood.tech/git/Olya/real-time-forum"> The
    repository of project</a>`;
    copyrightCont.append(text);


    footer.append(aboutCont, contactInfoCont, copyrightCont);
}