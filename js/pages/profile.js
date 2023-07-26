import { createHeader, createFooter /*, createUsersChatsBtns*/ } from "./basic.js"
import { generatePostPage } from "./post.js";
import { navigateTo } from "../router.js";

export function fetchProfilePage() {
    let url = window.location.href
    url = url.split("/")
    fetch(`/fetchProfile/${url[url.length - 1]}`)
        .then(response => response.json())
        .then(data => {
            console.log("USERDATA:", data)
            // Handle the response from the server
            if (data.Authenticated) {
                if (data.Error != "") {
                    //display error message ------------------------------------------------------
                    console.log("User profile not found, err:", data.Error)
                } else {
                    generateProfilePage(data.Query, data.User, null, data.Query.Posts)
                }
            } else {
                navigateTo("/loginPage")
                //TODO create display for error
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export function generateProfilePage(user, curruser, users, posts) {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }

    createHeader(curruser);
    let mainContainer = document.createElement('div');
    mainContainer.setAttribute('id', 'main-part-profile-page');
    document.body.append(mainContainer);
    createFooter();

    let userInfCont = document.createElement('div');
    userInfCont.setAttribute('id', 'user-information');

    let userBasicCont = document.createElement('div');
    userBasicCont.setAttribute('id', 'user-basic');

    // TODO add posibility to add new profile picture
    let userImgForm = document.createElement('form');
    userImgForm.setAttribute('action', '/update-user-img');
    userImgForm.setAttribute('method', 'POST');
    userImgForm.setAttribute('enctype', 'multipart/form-data');

    let userImgCont = document.createElement('div');
    userImgCont.classList.add('user-image');
    userImgForm.appendChild(userImgCont)

    let userImg = document.createElement('img');
    userImg.setAttribute('id', 'user-base-image');
    userImg.setAttribute('src', '/ui/static/img/user-image.svg');
    userImgCont.appendChild(userImg);

    let nicknameSpan = document.createElement('span');
    nicknameSpan.setAttribute('id', 'username');
    user.Nickname == undefined ? nicknameSpan.innerHTML = user.nickname : nicknameSpan.innerHTML = user.Nickname
    user.Nickname == undefined ? nicknameSpan.innerHTML = user.nickname : nicknameSpan.innerHTML = user.Nickname

    userBasicCont.append(userImgForm, nicknameSpan);

    let userAICont = document.createElement('div');
    userAICont.setAttribute('id', 'user-additional');

    // TODO create table to output all data about user
    let userData = document.createElement('table')

    let firstNameCont = document.createElement('tr');

    let userFirstname = document.createElement('td');
    userFirstname.className = 'table-titles';
    userFirstname.innerHTML = 'first name:';

    let userFirstnamefilled = document.createElement('td');
    userFirstnamefilled.className = 'table-data';
    user.FirstName == undefined ? userFirstnamefilled.innerHTML = user.firstName : userFirstnamefilled.innerHTML = user.FirstName

    firstNameCont.append(userFirstname, userFirstnamefilled);

    let lastNameCont = document.createElement('tr');

    let userLastName = document.createElement('td');
    userLastName.className = 'table-titles';
    userLastName.innerHTML = 'last name:';

    let userLastNamefilled = document.createElement('td');
    userLastNamefilled.className = 'table-data';
    user.LastName == undefined ? userLastNamefilled.innerHTML = user.lastname : userLastNamefilled.innerHTML = user.LastName

    lastNameCont.append(userLastName, userLastNamefilled);

    let genderCont = document.createElement('tr');

    let userGender = document.createElement('td');
    userGender.className = 'table-titles';
    userGender.innerHTML = 'gender:';

    let userGenderfilled = document.createElement('td');
    userGenderfilled.className = 'table-data';
    user.Gender == undefined ? userGenderfilled.innerHTML = user.gender : userGenderfilled.innerHTML = user.Gender

    genderCont.append(userGender, userGenderfilled);

    let birthdayCont = document.createElement('tr');

    let userBirthday = document.createElement('td');
    userBirthday.className = 'table-titles';
    userBirthday.innerHTML = 'age:';

    let userBirthdayfilled = document.createElement('td');
    userBirthdayfilled.className = 'table-data';

    const today = new Date();
    let birthday = new Date(user.DateOfBirth);

    let age = today.getFullYear() - birthday.getFullYear();
    const hasBirthdayOccurred = today.getMonth() > birthday.getMonth() ||
        (today.getMonth() === birthday.getMonth() && today.getDate() >= birthday.getDate());

    if (!hasBirthdayOccurred) {
        age--;
    }
    userBirthdayfilled.innerHTML = age

    birthdayCont.append(userBirthday, userBirthdayfilled);

    userData.append(firstNameCont, lastNameCont, genderCont, birthdayCont);

    userAICont.append(userData);

    userInfCont.append(userBasicCont, userAICont);

    let userPostsCont = document.createElement('div');
    userPostsCont.setAttribute('id', 'user-posts');
    userPostsCont.classList.add('content');

    if (curruser.Id == user.Id) {
        // TODO create button to add a post
        let appPostBtn = document.createElement('a');
        appPostBtn.setAttribute('id', 'btn-add-post');
        appPostBtn.classList.add('post');
        appPostBtn.setAttribute('href', `/createpostpage/${user.Nickname}`);
        appPostBtn.setAttribute('href', `/createpostpage/${user.Nickname}`);
        userPostsCont.append(appPostBtn);

        appPostBtn.addEventListener("click", (e) => {
            e.preventDefault()
            navigateTo("/createPost")
        })

        appPostBtn.addEventListener("click", (e) => {
            e.preventDefault()
            navigateTo("/createPost")
        })

        let plussCont = document.createElement('div');
        plussCont.classList.add('post-picture-add');

        let pluss = document.createElement('div');
        pluss.classList.add('plus');
        pluss.classList.add('radius');
        plussCont.append(pluss);

        let createPostText = document.createElement('div');
        createPostText.classList.add('post-main-information');

        let createPostTextSpan = document.createElement('span');
        createPostTextSpan.classList.add('title');
        createPostTextSpan.setAttribute('id', 'small-post-title');
        createPostTextSpan.innerHTML = 'Create post';
        createPostText.appendChild(createPostTextSpan);

        appPostBtn.append(plussCont, createPostText);
    }

    if (posts != null) {
        posts.forEach(element => {
            let newPost = createPostDiv(user, element);
            userPostsCont.append(newPost);
        })
    }

    mainContainer.append(userInfCont, userPostsCont);
    // createUsersChatsBtns(users, mainContainer);
}

function createPostDiv(user, post) {
    //  TODO
    let postCont = document.createElement('a');
    postCont.classList.add('post');
    postCont.setAttribute('href', `/postpage/${post.Id}`);
    postCont.setAttribute('href', `/postpage/${post.Id}`);

    postCont.addEventListener("click", (e) => {
        // TODO add to response post id ? 
        e.preventDefault()
        generatePostPage(user, post, null)
    })

    // #region shadow

    let shadowCont = document.createElement('div');
    shadowCont.classList.add('shadow-for-button');

    let shortPostText = document.createElement('span');
    shortPostText.innerHTML = post.Text;
    shortPostText.innerHTML = post.Text;
    shortPostText.classList.add('short-post-text');

    let userDataCont = document.createElement('div');
    userDataCont.classList.add('user-data-container');

    let userCont = document.createElement('div');
    userCont.classList.add('user-container');

    let postCreatorImgCont = document.createElement('div');
    postCreatorImgCont.setAttribute('id', 'post-creator-image-container');

    let postCreatorImg = document.createElement('img');
    post.Creator.Avatar != null ? postCreatorImg.setAttribute('src', post.Creator.Avatar) : postCreatorImg.setAttribute('src', '/ui/static/img/user-image.svg')
    post.Creator.Avatar != null ? postCreatorImg.setAttribute('src', post.Creator.Avatar) : postCreatorImg.setAttribute('src', '/ui/static/img/user-image.svg')
    postCreatorImgCont.appendChild(postCreatorImg);

    let creator = document.createElement('span');
    creator.innerHTML = post.Creator.Nickname;
    creator.innerHTML = post.Creator.Nickname;

    userCont.append(postCreatorImgCont, creator);

    let createdAt = document.createElement('p');

    createdAt.innerText = post.CreatedAt;
    createdAt.innerText = post.CreatedAt;
    createdAt.classList.add('created-at');

    userDataCont.append(userCont, createdAt);
    shadowCont.append(shortPostText, userDataCont);

    // #endregion

    // #region post picture

    let postPictureCont = document.createElement('div');
    postPictureCont.classList.add('post-picture');

    if (post.Image != '') { // TODO make better check
        let postImgExists = document.createElement('img');
        postImgExists.setAttribute('id', 'post-image-exists');
        postImgExists.setAttribute('src', post.Image);
        postImgExists.setAttribute('src', post.Image);
        postPictureCont.appendChild(postImgExists);
    } else {
        let postImgHolder = document.createElement('img');
        postImgHolder.setAttribute('id', 'post-image-holder');
        postImgHolder.setAttribute('src', '/ui/static/img/logo.svg');
        postPictureCont.appendChild(postImgHolder);
    }

    // #endregion

    // #region post info

    let postMainInfCont = document.createElement('div');
    postMainInfCont.classList.add('post-main-information');

    let postTitle = document.createElement('span');
    postTitle.setAttribute('id', 'small-post-title');
    postTitle.classList.add('title');
    postTitle.innerHTML = post.Title;
    postTitle.innerHTML = post.Title;

    // TODO change like and dislike to only like
    let likeCont = document.createElement('div');
    likeCont.setAttribute('id', 'likes-dislikes');
    // TODO check if user liked this post

    postMainInfCont.append(postTitle, likeCont);

    // #endregion

    postCont.append(postPictureCont, postMainInfCont, shadowCont);

    return postCont

}