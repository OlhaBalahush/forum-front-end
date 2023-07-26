import { navigateTo } from "../router.js";
import { createHeader, createFooter /*, createUsersChatsBtns */ } from "./basic.js"
import { Comment } from "../websockets.js";


export function fetchPostPage() {
    let url = window.location.href
    url = url.split("/")
    fetch(`/postHandler/${url[url.length - 1]}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // Handle the response from the server
            if (data.Authenticated) {
                if (data.Error != "") {
                    //TODO error or 404 page
                    console.log(data.Error)
                } else {
                    generatePostPage(data.User, data.Post, data.ActiveUsers)
                }
            } else {
                navigateTo("/login")
                //TODO create display for error
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export function generatePostPage(user, post, users) {
    // const state = { post_id: post.PostId }
    // window.history.pushState(state, "", post.postId)
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    console.log("user", user)
    createHeader(user);
    let mainContainer = document.createElement('div');
    mainContainer.setAttribute('id', 'main-part-post-page');
    document.body.append(mainContainer);

    let postCont = document.createElement('div');
    postCont.setAttribute('id', 'post-container');

    let postImgCont = document.createElement('div');
    postImgCont.setAttribute('id', 'post-image');

    if (post.Image != '') {
        let postImgExists = document.createElement('img');
        postImgExists.setAttribute('id', 'post-image-exists');
        postImgExists.setAttribute('src', post.Image);
        postImgCont.appendChild(postImgExists);
    } else {
        let postImgHolder = document.createElement('img');
        postImgHolder.setAttribute('id', 'post-image-holder');
        postImgHolder.setAttribute('src', '/ui/static/img/logo.svg');
        postImgCont.appendChild(postImgHolder);
    }

    let postCont2 = document.createElement('div');
    postCont2.setAttribute('id', 'post');

    let tittleCont = document.createElement('div');
    tittleCont.setAttribute('id', 'post-title');
    tittleCont.innerHTML = post.Title

    let postCreationAI = document.createElement('div');
    postCreationAI.classList.add('post-addiional-information');
    postCreationAI.classList.add('about-creation');

    let profileBtn = document.createElement('a');
    profileBtn.setAttribute('id', 'post-creator');
    profileBtn.setAttribute('href', `/profile/${post.Creator.Nickname}`);
    profileBtn.classList.add('btn-user');

    profileBtn.addEventListener("click", (e) => {
        e.preventDefault()
        navigateTo(`/profile/${post.Creator.Nickname}`)
    })

    let postCreatorImgCont = document.createElement('div');
    postCreatorImgCont.setAttribute('id', 'post-creator-image-container');

    let postCreatorImg = document.createElement('img');
    post.Creator.Avatar != '' ? postCreatorImg.setAttribute('src', post.Creator.Avatar) : postCreatorImg.setAttribute('src', '/ui/static/img/user-image.svg');

    postCreatorImgCont.appendChild(postCreatorImg);

    let usernameSpan = document.createElement('span');
    usernameSpan.innerHTML = post.Creator.Nickname;

    profileBtn.append(postCreatorImgCont, usernameSpan);

    let createdAtSpan = document.createElement('p');
    createdAtSpan.setAttribute('id', 'span-created-at');
    createdAtSpan.innerHTML = post.CreatedAt;

    postCreationAI.append(profileBtn, createdAtSpan);

    let postAI = document.createElement('div');
    postAI.classList.add('post-addiional-information');

    post.Categories.forEach(element => {
        let newCat = createPostCategory(element);
        postAI.append(newCat);
    });

    let postTextCont = document.createElement('div');
    postTextCont.setAttribute('id', 'post-text');
    postTextCont.innerHTML = post.Text;

    let postLikeBtn = document.createElement('div');
    postLikeBtn.setAttribute('id', 'btn-like-dislike'); // TODO change only for likes

    //remove the form?
    let likeForm = document.createElement('form');
    likeForm.setAttribute('id', 'add-like-form');

    let likeBtn = document.createElement('button');
    likeBtn.setAttribute('id', 'btn-like-post');
    likeBtn.setAttribute('name', 'like-dislike');
    likeBtn.setAttribute('value', 'like');
    likeBtn.classList.add('likes-dislikes');

    // TODO change like system at all
    let likeIcon = document.createElement('img');
    likeIcon.setAttribute('src', '/ui/static/img/like.svg');
    likeIcon.classList.add('icon');
    likeBtn.append(likeIcon);

    if (post.LikedByUser == true) {
        likeIcon.setAttribute('src', '/ui/static/img/filled-like-icon.svg');
    } else {
        likeIcon.setAttribute('src', '/ui/static/img/like.svg');
    }

    likeBtn.addEventListener("click", (e) => {
        e.preventDefault()
        fetch(`/react/${post.Id}`)
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                if (data.Authenticated) {
                    navigateTo(`/postpage/${post.Id}`)
                } else {
                    navigateTo("/login")
                    //TODO create display for error
                }
            })
            .catch(error => {
                console.log(error);
            });
    })

    let likeLb = document.createElement('label');
    likeLb.setAttribute('id', 'lb-like-post');
    likeLb.setAttribute('for', 'btn-like-post');
    likeLb.classList.add('lb-like');
    likeLb.classList.add('postl');
    likeLb.innerHTML = post.Likes; // TODO change on number of likes 

    likeForm.append(likeBtn, likeLb);

    postLikeBtn.appendChild(likeForm);

    postCont2.append(tittleCont, postCreationAI, postAI, postTextCont, postLikeBtn);

    postCont.append(postImgCont, postCont2);

    mainContainer.appendChild(postCont);
    // createUsersChatsBtns(users, mainContainer);

    let commentsCont = document.createElement('div');
    commentsCont.setAttribute('id', 'comments-container');
    document.body.append(commentsCont);
    createFooter();

    let alreadyExistedCommCont = document.createElement('div');
    alreadyExistedCommCont.setAttribute('id', 'already-existed-comments');

    // TODO take comments to post
    let postcomments = post.Comments;
    console.log('post comments: ', post.Comments);

    if (postcomments != null) {
        postcomments.forEach((element) => {
            let commentCont = document.createElement('div');
            commentCont.setAttribute('id', element); // TODO change to element id
            commentCont.className = 'comment-container';
            alreadyExistedCommCont.append(commentCont);

            let commentHeader = document.createElement('div');
            commentHeader.className = 'comment-header';

            let commentCreatorBtn = document.createElement('a');
            commentCreatorBtn.setAttribute('href', `/profilepage/${element.Creator.Nickname}`);
            commentCreatorBtn.setAttribute('id', 'btn-comment-creator');
            commentCreatorBtn.className = 'btn-user';

            let creatorImgCont = document.createElement('div');
            creatorImgCont.setAttribute('id', 'post-creator-image-container');

            let creatorImg = document.createElement('img');
            // TODO check if user have picture or not
            creatorImg.setAttribute('src', '/ui/static/img/user-image.svg');
            creatorImgCont.appendChild(creatorImg);

            let creatorSpan = document.createElement('span');
            creatorSpan.innerHTML = element.Creator.Nickname;

            commentCreatorBtn.append(creatorImgCont, creatorSpan);

            let commentCreatedAt = document.createElement('p');
            commentCreatedAt.className = 'comment-created-at';
            commentCreatedAt.innerHTML = element.CreatedAt;

            commentHeader.append(commentCreatorBtn, commentCreatedAt);

            let commentText = document.createElement('div');
            commentText.className = 'comment';
            commentText.innerHTML = element.Text;

            commentCont.append(commentHeader, commentText);
        });
        commentsCont.append(alreadyExistedCommCont);
    }

    let addCommForm = document.createElement('form');
    // addCommForm.setAttribute('onsubmit', submitComment(addCommForm, post.Id));
    addCommForm.setAttribute('id', 'comment-form');
    addCommForm.setAttribute('method', 'post');

    let commentInput = document.createElement('input');
    commentInput.className = 'comment';
    commentInput.setAttribute('id', 'comment-input');
    commentInput.setAttribute('name', 'username-input');
    commentInput.setAttribute('type', 'text');
    commentInput.setAttribute('placeholder', 'Write comment here...');
    commentInput.setAttribute('maxlength', '500');
    commentInput.setAttribute('value', ''); // TODO change
    commentInput.required = true;
    // addCommForm.onsubmit = () => {
    //     // let text = commentInput.value
    //     // let comment = new Comment(text, user.Id, post.Id, new Date())
    //     let obj = {
    //         text: commentInput.value,
    //         postId: post.Id,
    //         userId: user.Id,
    //     };
    //     let jsonString = JSON.stringify(obj);
    //     console.log("commentform", jsonString);
    //     fetch("/comment", {
    //         method: "post",
    //         body: jsonString
    //     })
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error("Network response was not ok.");
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             // Handle the response from the server
    //             if (data.Authenticated) {
    //                 navigateTo(`/postpage/${post.Id}`);
    //             } else {
    //                 navigateTo("/login");
    //             }
    //         })
    //         .catch(error => {
    //             console.log("An error occurred:", error);
    //             // Handle the error appropriately
    //         });
    //     return false
    // }

    addCommForm.addEventListener('submit', (e) => {
        e.preventDefault()
        let obj = {
            text: commentInput.value,
            postId: post.Id,
            userId: user.Id,
        };
        let jsonString = JSON.stringify(obj);
        console.log("commentform", jsonString);
        fetch("/comment", {
            method: "post",
            body: jsonString
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok.");
                }
                return response.json();
            })
            .then(data => {
                // Handle the response from the server
                if (data.Authenticated) {
                    navigateTo(`/postpage/${post.Id}`);
                } else {
                    navigateTo("/login");
                }
            })
            .catch(error => {
                console.log("An error occurred:", error);
                // Handle the error appropriately
            });
    })

    addCommForm.appendChild(commentInput);
    // TODO check if user is registrated
    commentsCont.append(addCommForm);
}

function createPostCategory(category) {
    let catBtn = document.createElement('div');
    catBtn.setAttribute('id', 'btn-post-category');
    catBtn.classList.add('btn-post-category');

    let catSpan = document.createElement('span');
    catSpan.innerHTML = category;

    catBtn.appendChild(catSpan);

    return catBtn;
}