import { navigateTo } from "../router.js";
import { createHeader, createFooter } from "./basic.js"
import { connectWS } from "../websockets.js";
import { readEntitiesFromFile } from "../data/entities.js";

export async function fetchMainPageContent() {
    const { users, posts, categories, comments, messages, chats } = await readEntitiesFromFile('./js/data/data.json');
    console.log(users);
    console.log(posts);
    console.log(categories);
    console.log(comments);
    console.log(messages);
    console.log(chats);
    //  TODO instead of fetch data from server I can take and compare with json
    generateMainPage(null, users, posts, categories)
}

var allPosts;

export function generateMainPage(user, users, posts, categories) {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    allPosts = posts;
    createHeader(user);
    let mainContainer = document.createElement('div');
    mainContainer.setAttribute('id', 'main-part');
    document.body.append(mainContainer);
    createFooter();

    let title = document.createElement('p');
    title.setAttribute('id', 'title');
    title.classList.add('title');
    title.innerText = 'forum';

    let searchAndFilterCats = document.createElement('div');
    searchAndFilterCats.setAttribute('id', 'search-categories-filter');

    let searchForm = document.createElement('form');
    searchForm.classList.add('search');
    searchForm.setAttribute('autocomplete', 'off');
    searchForm.setAttribute('action', '/search');
    searchForm.setAttribute('method', 'POST');

    let inputLineCont = document.createElement('div');
    inputLineCont.classList.add('input-group');
    searchForm.append(inputLineCont);

    let inputLine = document.createElement('input'); // TODO something wrong with place holder
    inputLine.classList.add('input-line');
    inputLine.setAttribute('id', 'input-line');
    inputLine.setAttribute('type', 'text');
    inputLine.setAttribute('name', 'searchBar');
    inputLine.placeholder = 'Search for a post';
    inputLineCont.append(inputLine);

    let categoriesCont = document.createElement('div');
    categoriesCont.setAttribute('id', 'categories-filter');

    let sliderL = document.createElement('button');
    sliderL.setAttribute('id', 'slideLeft');
    sliderL.setAttribute('type', 'button');
    sliderL.classList.add('horizontal-slider-btns');
    // TODO add image

    let contentCont = document.createElement('div');
    contentCont.classList.add('content');

    let categoryCont = document.createElement('div');

    categories.forEach(element => {
        let newC = createCategory(element, user, contentCont);
        categoryCont.append(newC);
    })

    let sliderR = document.createElement('button');
    sliderR.setAttribute('id', 'slideRight');
    sliderR.setAttribute('type', 'button');
    sliderR.classList.add('horizontal-slider-btns');
    // TODO add image

    categoriesCont.append(sliderL, categoryCont, sliderR);

    searchAndFilterCats.append(searchForm, categoriesCont);

    // #region content
    updatePostList(posts, user, contentCont)
    // #endregion

    mainContainer.append(title, searchAndFilterCats, contentCont);
    // createUsersChatsBtns(users, mainContainer);
}

function updatePostList(posts, user, contentCont) {
    while (contentCont.firstChild) {
        contentCont.removeChild(contentCont.firstChild);
    }

    if (user != null) {
        // TODO create button to add a post
        let appPostBtn = document.createElement('a');
        appPostBtn.setAttribute('id', 'btn-add-post');
        appPostBtn.classList.add('post');
        appPostBtn.setAttribute('href', `/createpostpage/${user.Nickname}`);
        contentCont.append(appPostBtn);

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

    posts.forEach(element => {
        let newPost = createPostDiv(element);
        contentCont.appendChild(newPost);
    });
}

function createPostDiv(post) {
    //  TODO
    let postCont = document.createElement('a');
    postCont.classList.add('post');
    postCont.setAttribute('href', `/postpage/${post.Id}`);

    postCont.addEventListener("click", (e) => {
        e.preventDefault()
        navigateTo(`/postpage/${post.Id}`)
    })

    // #region shadow

    let shadowCont = document.createElement('div');
    shadowCont.classList.add('shadow-for-button');

    let shortPostText = document.createElement('span');
    shortPostText.innerHTML = post.Text;
    shortPostText.classList.add('short-post-text');

    let userDataCont = document.createElement('div');
    userDataCont.classList.add('user-data-container');

    let userCont = document.createElement('div');
    userCont.classList.add('user-container');

    let postCreatorImgCont = document.createElement('div');
    postCreatorImgCont.setAttribute('id', 'post-creator-image-container');

    let postCreatorImg = document.createElement('img');
    post.Creator.Avatar != null ? postCreatorImg.setAttribute('src', post.Creator.Avatar) : postCreatorImg.setAttribute('src', '/img/user-image.svg')
    postCreatorImgCont.appendChild(postCreatorImg);

    let creator = document.createElement('span');
    creator.innerHTML = post.Creator.Nickname;

    userCont.append(postCreatorImgCont, creator);

    let createdAt = document.createElement('p');

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
        postPictureCont.appendChild(postImgExists);
    } else {
        let postImgHolder = document.createElement('img');
        postImgHolder.setAttribute('id', 'post-image-holder');
        postImgHolder.setAttribute('src', '/img/logo.svg');
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

    // TODO change like and dislike to only like
    let likeCont = document.createElement('div');
    likeCont.setAttribute('id', 'likes-dislikes');
    // TODO check if user liked this post

    postMainInfCont.append(postTitle, likeCont);

    // #endregion

    postCont.append(postPictureCont, postMainInfCont, shadowCont);

    return postCont

}

function createCategory(category, user, contentCont) {
    let categoryBtn = document.createElement('a');
    categoryBtn.setAttribute('id', 'btn-category');
    categoryBtn.classList.add('btn-category');
    // categoryBtn.setAttribute('href', `/filter/${category}`);

    let categoryName = document.createElement('span');
    categoryName.classList.add('category');
    categoryName.innerHTML = category;
    categoryName.value = category;
    categoryBtn.appendChild(categoryName);

    categoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let currPosts = allPosts.filter(post => post.Categories.includes(categoryName.value));
        updatePostList(currPosts, user, contentCont)
    });

    return categoryBtn;
}