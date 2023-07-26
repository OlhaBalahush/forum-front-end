import { createHeader, createFooter } from "./basic.js"
import { navigateTo } from "../router.js";

export function fetchCreatePage() {
    fetch("/home")
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data.Authenticated) {
                generateCreatePostPage(data.User, data.Categories)
            } else {
                navigateTo("/loginPage")
                //TODO create display for error
            }
        })
        .catch(error => {
            console.log(error);
        });
}

var categories = [];

export function generateCreatePostPage(user, suggestions) {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }


    createHeader(user);
    let mainContainer = document.createElement('div');
    mainContainer.setAttribute('id', 'create-post-container');
    document.body.append(mainContainer);
    createFooter();

    let postImgCont = document.createElement('div');
    postImgCont.setAttribute('id', 'post-image');

    let postImg = document.createElement('img');
    postImg.setAttribute('src', '/ui/static/img/logo.svg');
    postImgCont.appendChild(postImg);

    let postCont = document.createElement('div');
    postCont.setAttribute('id', 'post');

    let postForm = document.createElement('form');
    postForm.setAttribute('method', 'post');
    postForm.setAttribute('enctype', 'multipart/form-data');
    postForm.className = 'create-post-form';

    let titleLb = document.createElement('label');
    titleLb.className = 'post-lable';
    titleLb.setAttribute('for', 'title-create-post');
    titleLb.innerHTML = 'title:';

    let titleInput = document.createElement('input');
    titleInput.className = 'create-post-input';
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('name', 'title');
    titleInput.setAttribute('id', 'title-create-post');
    titleInput.setAttribute('placeholder', 'Make title for your post');
    titleInput.setAttribute('maxlength', '30');
    titleInput.setAttribute('value', ''); //TODO take buffer value

    let categoriesLb = document.createElement('label');
    categoriesLb.className = 'post-lable';
    categoriesLb.setAttribute('for', 'category-create-post');
    categoriesLb.innerHTML = 'category:';

    let categoriesForm = document.createElement('div');
    categoriesForm.setAttribute('id', 'categories-forms');

    let categoryInput = document.createElement('input');
    categoryInput.className = 'create-post-input';
    categoryInput.setAttribute('type', 'text');
    categoryInput.setAttribute('name', 'category-create-post');
    categoryInput.setAttribute('id', 'category-create-post');
    categoryInput.setAttribute('placeholder', 'Choose or create category for your post');
    categoryInput.setAttribute('maxlength', '15');
    categoryInput.setAttribute('list', 'search-suggestions');
    categoryInput.setAttribute('value', ''); //TODO take buffer value

    // TODO change to real categories
    let addedCategCont = document.createElement('div');
    addedCategCont.className = 'categories-created-page';

    let addCatBtn = document.createElement('button');
    addCatBtn.className = 'button';
    addCatBtn.setAttribute('id', 'btn-category-create');
    addCatBtn.innerHTML = 'add';

    addCatBtn.addEventListener("click", (e) => {
        e.preventDefault()
        if (!categories.includes(categoryInput.value)) {
            categories.push(categoryInput.value);
        }
        categoryInput.value = '';
        updateCategories(addedCategCont)
    })

    categoriesForm.append(categoryInput, addCatBtn);

    let categoriesSuggestions = document.createElement('datalist');
    categoriesSuggestions.setAttribute('id', 'search-suggestions');

    suggestions.forEach((element) => {
        let option = document.createElement('option');
        option.setAttribute('value', element);
        option.innerHTML = element;
        categoriesSuggestions.append(option);
    });

    postForm.append(titleLb, titleInput, categoriesLb, categoriesForm,
        categoriesSuggestions, addedCategCont);

    let error = document.createElement('span');
    error.className = 'authorization-error';
    // TODO check if there any error from backend and add if there is any
    let err = null;

    if (err != null) {
        error.innerHTML = err.message;
        postForm.append(error);
    }

    let postTextLb = document.createElement('label');
    postTextLb.className = 'post-label';
    postTextLb.setAttribute('for', 'text-create-post');
    postTextLb.innerHTML = 'post:';

    let postTextInput = document.createElement('textarea');
    postTextInput.setAttribute('type', 'text');
    postTextInput.setAttribute('name', 'text');
    postTextInput.setAttribute('id', 'text-create-post"');
    postTextInput.setAttribute('rows', '20');
    postTextInput.setAttribute('cols', '50');
    postTextInput.setAttribute('placeholder', 'Write here your post');
    postTextInput.setAttribute('maxlength', '2000');
    postTextInput.className = 'create-post-input';

    // let postImgLb = document.createElement('label');
    // postImgLb.className = 'post-label';
    // postImgLb.setAttribute('for', 'attachment');
    // postImgLb.innerHTML = 'image:';

    // let postImgInput = document.createElement('textarea');
    // postImgInput.setAttribute('id', 'btn-upload-file');
    // postImgInput.setAttribute('type', 'file');
    // postImgInput.setAttribute('name', 'attachment');

    let submitBtn = document.createElement('button');
    submitBtn.setAttribute('id', 'btn-create-post');
    submitBtn.className = 'button';
    submitBtn.innerHTML = 'create';

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault()
        const formData = new FormData(postForm);
        let obj = {};
        obj.categories = categories
        obj.creator = user
        obj.createdAt = new Date()
        for (let [key, value] of formData.entries()) {
            obj[key] = value;
        }
        let jsonString = JSON.stringify(obj);
        console.log("JSON", jsonString)
        fetch("/create-post", {
            method: "post",
            body: jsonString
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server
                if (data.Authenticated) {
                    navigateTo("/postpage/" + data.Query)
                } else {
                    //TODO create display for error ----------------------------------
                    console.log(data.Error)
                }
            })
            .catch(error => {
                console.log(error);
            });
        console.log("POST: \n", post)
    })

    postForm.append(postTextLb, postTextInput, /* postImgLb,
        postImgInput,*/ submitBtn);

    let cancelBtn = document.createElement('a');
    cancelBtn.setAttribute('id', 'btn-cancel-creation');
    cancelBtn.setAttribute('href', '/');
    cancelBtn.className = 'button';
    cancelBtn.innerHTML = 'cancel';

    postCont.append(postForm, cancelBtn);

    mainContainer.append(postImgCont, postCont);
}

function updateCategories(addedCategCont) {
    while (addedCategCont.firstChild) {
        addedCategCont.removeChild(addedCategCont.firstChild);
    }
    categories.forEach((element) => {
        let catCont = document.createElement('div');
        catCont.className = 'btn-post-category';
        catCont.setAttribute('id', 'btn-post-category');

        let catBtn = document.createElement('div');
        catBtn.setAttribute('id', 'btn-delete-category');
        catBtn.setAttribute('name', 'category-to-delete');
        catBtn.setAttribute('value', element);
        catBtn.setAttribute('formaction', '/delete-post-category');
        catBtn.setAttribute('formmethod', 'post');
        catBtn.innerHTML = '+';

        let catSpan = document.createElement('span');
        catSpan.className = 'category';
        catSpan.innerHTML = element;
        catSpan.value = element;

        catCont.append(catBtn, catSpan);
        addedCategCont.append(catCont);

        catBtn.addEventListener('click', (e) => {
            e.preventDefault()
            categories = categories.filter(element => element !== catSpan.value);
            updateCategories(addedCategCont);
        });
    });
}