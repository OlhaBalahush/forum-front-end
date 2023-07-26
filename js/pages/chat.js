import { createHeader } from "./basic.js"
import { navigateTo } from "../router.js";
import { generateProfilePage } from "./profile.js";
import { Message, sendEvent, connectWS } from "../websockets.js";

const messagesPerPage = 10; // Number of messages to display per page
let currentPage = 1; // Current page number
let theLastPage = false;

export function fetchChatPage() {
    fetch("/fetchChats")
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data.Authenticated) {
                connectWS(data.User)
                generateChatPage(data.User.Chats, data.User, data.ActiveUsers, data.AllUsers)
            } else {
                navigateTo("/loginPage")
                //TODO create display for error
            }
        })
        .catch(error => {
            console.log(error);
        });
}

export function generateChatPage(chats, currUser, onlineUsers, allUsers) {
    // TODO sort chats before
    currentPage = 1; 
    theLastPage = false;

    if (chats != null) {
        const sortedChats = chats.sort((chatA, chatB) => {
            const latestMessageA = chatA.Messages[chatA.Messages.length - 1];
            const latestMessageB = chatB.Messages[chatB.Messages.length - 1];
            const createdAtA = new Date(latestMessageA.CreatedAt);
            const createdAtB = new Date(latestMessageB.CreatedAt);

            return createdAtB.getTime() - createdAtA.getTime();
        });
    }

    allUsers.sort((userA, userB) => {
        const nicknameA = userA.Nickname.toLowerCase();
        const nicknameB = userB.Nickname.toLowerCase();

        if (nicknameA < nicknameB) {
            return -1;
        } else if (nicknameA > nicknameB) {
            return 1;
        } else {
            return 0;
        }
    });

    if (onlineUsers != null) {
        var allUsersWithoutOnline = allUsers.filter(user => !onlineUsers.some(user2 => user.Id === user2.Id));
    }

    let currChat;
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    createHeader(currUser);
    let mainContChat = document.createElement('div');
    mainContChat.className = 'main-part-chat';

    let chatsCont = document.createElement('div');
    chatsCont.className = 'chats-container';

    let chatsLineTitle = document.createElement('button');
    chatsLineTitle.classList.add('chat-title');
    chatsLineTitle.classList.add('title');
    chatsLineTitle.style.padding = '0 40px';
    chatsLineTitle.style.width = '100%';
    // chatsLineTitle.innerHTML = 'chats';

    let chatBtnSpan = document.createElement('span');
    chatBtnSpan.className = 'btn-chat-change'
    chatBtnSpan.innerHTML = 'change on online user'

    chatsLineTitle.addEventListener('click', (e) => {
        e.preventDefault();
        if (chatsLineTitle.value == 'chats') {
            chatsLineTitle.innerHTML = 'online users';
            chatsLineTitle.value = 'online users'
            // TODO change list to ALL users
            let toDelete = document.getElementById('chats-list-container');
            if (toDelete != null) {
                while (toDelete.firstChild) {
                    toDelete.removeChild(toDelete.firstChild);
                }
            }
            if (onlineUsers != null) {
                onlineUsers.forEach(element => {
                    if (element.Id != currUser.Id) {
                        let newChat = createChatline(null, currUser, chatCont, chatCont, element, onlineUsers);
                        chatsList.append(newChat);
                    }
                });
            } else {
                let noUsersOnline = document.createElement('div');
                noUsersOnline.className = 'chat-line';
                noUsersOnline.innerHTML = 'no user online'
                chatsList.append(noUsersOnline);
            }
            let users
            allUsersWithoutOnline == undefined ? users = allUsers : users = allUsersWithoutOnline
            if (users != null) {
                users.forEach(element => {
                    if (element.Id != currUser.Id) {
                        let newChat = createChatline(null, currUser, chatCont, chatCont, element, onlineUsers);
                        chatsList.append(newChat);
                    }
                });
            }
        } else {
            let toDelete = document.getElementById('chats-list-container');
            if (toDelete != null) {
                while (toDelete.firstChild) {
                    toDelete.removeChild(toDelete.firstChild);
                }
            }
            if (chats != null) {
                chatsLineTitle.innerHTML = 'chats';
                chatsLineTitle.value = 'chats'
                // change list to chats
                currChat = chats[0];
                chatsLineTitle.value = 'chats'

                chats.forEach(element => {
                    let newChat = createChatline(element, currUser, chatCont, chatCont, null, onlineUsers);
                    chatsList.append(newChat);
                });
            } else {
                toDelete.innerHTML = 'no chats yet'
            }

            createCurrUserLine(currChat, currUser, chatCont, null, onlineUsers)
        }
    })

    let chatsList = document.createElement('div');
    chatsList.className = 'chats-list-container';
    chatsList.setAttribute('id', 'chats-list-container')

    let chatCont = document.createElement('div');
    chatCont.setAttribute('id', 'chat-container');
    chatCont.className = 'chat-container';

    if (chats == null) {
        chatsLineTitle.innerHTML = 'online users';
        let chatlineCont = document.createElement('button');
        chatlineCont.className = 'chat-line';
        chatlineCont.innerHTML = 'no chat yet'
        chatsList.append(chatlineCont);

        if (onlineUsers != null) {
            // TODO display ALL users
            chatsLineTitle.value = 'online users'
            chatBtnSpan.innerHTML = 'change on chats'

            onlineUsers.forEach(element => {
                if (element.Id != currUser.Id) {
                    let newChat = createChatline(null, currUser, chatCont, chatCont, element, onlineUsers);
                    chatsList.append(newChat);
                }
            });
        }
    } else {
        chatsLineTitle.innerHTML = 'chats';
        currChat = chats[0];
        chatsLineTitle.value = 'chats'
        chatBtnSpan.innerHTML = 'change on online user'

        chats.forEach(element => {
            let newChat = createChatline(element, currUser, chatCont, chatCont, null, onlineUsers);
            chatsList.append(newChat);
        });

        createCurrUserLine(currChat, currUser, chatCont, null, onlineUsers)
    }
    chatsCont.append(chatsLineTitle, chatsList);
    chatsLineTitle.append(chatBtnSpan)

    mainContChat.append(chatsCont, chatCont);
    // scrollToLastMessage()
    document.body.appendChild(mainContChat);
    scrollToLastMessage();

    // Event listener for scroll event with throttling
    const throttledScroll = throttle(() => handleScroll(currChat, currUser), 500);
    chatCont.addEventListener('scroll', (e) => {
        e.preventDefault()
        throttledScroll()
    });


}

function createCurrUserLine(chat, currUser, chatCont, onlineUser, onlineUsers) {
    let toDelete = document.getElementById('chat-title');
    if (toDelete != null) {
        toDelete.remove();
    }

    let chatLine = document.createElement('div');
    chatLine.setAttribute('id', 'chat-title');
    chatLine.classList.add('chat-title');

    let userCont = document.createElement('div');
    userCont.className = 'user-image-container'

    let userImgCont = document.createElement('div');
    userImgCont.setAttribute('id', 'post-creator-image-container');

    let userImg = document.createElement('img');

    let onlineStatus = document.createElement('div');
    onlineStatus.className = 'online-status'


    userImgCont.append(userImg, onlineStatus);
    userCont.appendChild(userImgCont)

    let userNick = document.createElement('span');

    chatLine.append(userCont, userNick);

    let currChatUser;

    if (chat != null) {
        if (chat.UserOne.Id != currUser.Id) {
            currChatUser = chat.UserOne
            chat.UserOne.Avatar != '' ? userImg.setAttribute('src', chat.UserOne.Avatar) : userImg.setAttribute('src', '/ui/static/img/user-image.svg')
            userNick.innerHTML = chat.UserOne.Nickname;

        } else {
            currChatUser = chat.UserTwo
            chat.UserTwo.Avatar != '' ? userImg.setAttribute('src', chat.UserTwo.Avatar) : userImg.setAttribute('src', '/ui/static/img/user-image.svg')
            userNick.innerHTML = chat.UserTwo.Nickname;
        }
    } else {
        currChatUser = onlineUser
        onlineUser.Avatar != '' ? userImg.setAttribute('src', onlineUser.Avatar) : userImg.setAttribute('src', '/ui/static/img/user-image.svg')
        userNick.innerHTML = onlineUser.Nickname;
    }

    var foundObject
    if (onlineUsers != null) {
        foundObject = onlineUsers.find(item => item.Id === currChatUser.Id);
    }

    if (foundObject != undefined) {
        onlineStatus.style.backgroundColor = 'green';
    } else {
        onlineStatus.style.backgroundColor = 'lightgray';
    }

    chatLine.addEventListener('click', (e) => {
        e.preventDefault()
        navigateTo(`/profile/${currChatUser.Nickname}`)
    })

    if (chat != null) {
        chatCont.append(chatLine,loadMoreMessages(chat, currUser, null));
    } else {
        chatCont.append(chatLine, loadMoreMessages(chat, currUser, onlineUser));

    }
}

function createChatline(chat, currUser, messagesCont, chatC, onlineUser, onlineUsers) {
    let chatCont = document.createElement('button');
    chatCont.className = 'chat-line';

    let userCont = document.createElement('div');
    userCont.className = 'user-image-container'

    let userImgCont = document.createElement('div');
    userImgCont.setAttribute('id', 'post-creator-image-container');

    let userImg = document.createElement('img');

    let userNick = document.createElement('span');


    let user;

    if (chat != null) {
        if (chat.UserOne.Id != currUser.Id) {
            user = chat.UserOne;
            chat.UserOne.Avatar != '' ? userImg.setAttribute('src', chat.UserOne.Avatar) : userImg.setAttribute('src', '/ui/static/img/user-image.svg')
            userNick.innerHTML = chat.UserOne.Nickname;
        } else {
            user = chat.UserTwo;
            chat.UserTwo.Avatar != '' ? userImg.setAttribute('src', chat.UserTwo.Avatar) : userImg.setAttribute('src', '/ui/static/img/user-image.svg')
            userNick.innerHTML = chat.UserTwo.Nickname;
        }
    } else {
        user = onlineUser;
        onlineUser.Avatar != '' ? userImg.setAttribute('src', onlineUser.Avatar) : userImg.setAttribute('src', '/ui/static/img/user-image.svg')
        userNick.innerHTML = onlineUser.Nickname;
    }

    let onlineStatus = document.createElement('div');
    onlineStatus.className = 'online-status'

    var foundObject
    if (onlineUsers != null) {
        foundObject = onlineUsers.find(item => item.Id === user.Id);
    }

    if (foundObject != undefined) {
        onlineStatus.style.backgroundColor = 'green';
    } else {
        onlineStatus.style.backgroundColor = 'lightgray';
    }

    userImgCont.append(userImg, onlineStatus);
    userCont.appendChild(userImgCont);
    chatCont.append(userCont, userNick);

    chatCont.addEventListener('click', (e) => {
        e.preventDefault()
        currentPage = 1;
        let toDelete = document.getElementById('chat-messages-container');
        if (toDelete != null) {
            toDelete.remove();
        }

        // Change chat and chat line
        if (chat != null) {
            createCurrUserLine(chat, currUser, chatC, null, onlineUsers)
            scrollToLastMessage()
        } else {
            createCurrUserLine(null, currUser, chatC, onlineUser)

        }
    })
    return chatCont;
}

function createChat(chat, currUser, onlineUser, startIndex, endIndex) {
    let isNewChat = false;
    let currChat = chat;
    if (chat != null) {
        var sortedArray = chat.Messages.sort(function (a, b) {
            return b.Id - a.Id;
        });
        currChat.Messages = sortedArray
    }
    
    // if chat container doesn't exist we should create it and in oposite way we should just add new messages
    let chatCont = document.getElementById('chat-messages-container');
    if (chatCont == null) {
        isNewChat = true
        chatCont = document.createElement('div');
        chatCont.setAttribute('id', 'chat-messages-container');
        chatCont.style.padding = '10px';
    }
    
    let existedMessagesCont = document.getElementById('messages-container');
    if (existedMessagesCont == null) {
        existedMessagesCont = document.createElement('div');
        existedMessagesCont.setAttribute('id', 'messages-container');
        existedMessagesCont.className = 'messages-container';
    }
    
    if (chat == null) {
        existedMessagesCont.innerHTML = 'start your chat!'
    } else {
        for (let i = startIndex; i <= endIndex; i++) {
            const message = currChat.Messages[i];
            let newMessage = createMessage(message, currUser);
            existedMessagesCont.insertBefore(newMessage, existedMessagesCont.firstChild);
            
        }
    }
    
    chatCont.insertBefore(existedMessagesCont, chatCont.firstChild)
    if (isNewChat) {
        let inputForm = document.createElement('form');
        inputForm.setAttribute('id', 'input-message-form');
        inputForm.className = 'message';
        
        let inputField = document.createElement('input');
        inputField.setAttribute('id', 'input-message');
        
        inputForm.append(inputField);
        
        inputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let messageText = inputField.value
            let reciver;
            if (messageText != "") {
                chat == null ? reciver = onlineUser.Id : reciver = chat.UserTwo.Id
                let message = new Message(currUser.Id, reciver, messageText, formatDate())
                sendEvent("send_message", message)
                inputField.value = ""


                let chatCont = document.querySelector(".messages-container")
                console.log("SENT MESSAGE--------------", message)
                chatCont.appendChild(createMessage(message, currUser))
                scrollToLastMessage()
            }

            navigateTo('/chats');
        })
        chatCont.append(inputForm);
    }

    return chatCont;
}

function createMessage(message, currUser) {
    let messageCont0 = document.createElement('div');
    messageCont0.className = 'message-container';

    let messageCont = document.createElement('div');
    messageCont.className = 'message';

    // let messageSenderCont = document.createElement('div');
    // messageSenderCont.className = 'message-sender';
    // messageSenderCont.innerHTML = message.sender.Nickname;

    let messageContentCont = document.createElement('div');
    messageContentCont.className = 'message-content';
    messageContentCont.innerHTML = message.Text;

    let messageTime = document.createElement('span');
    messageTime.className = 'message-time'
    messageTime.innerHTML = message.CreatedAt


    if (message.SenderId == currUser.Id) {
        messageCont0.style.justifyContent = 'flex-end';
    } else {
        messageCont.style.backgroundColor = 'var(--color-3)';
    }

    messageCont.append(/*messageSenderCont,*/ messageContentCont, messageTime);
    messageCont0.append(messageCont);
    return messageCont0;
}

export function receiveMessage(message) {
    let chatCont = document.querySelector(".messages-container")
    console.log("RECEIVED MESSAGE--------------", message)
    chatCont.appendChild(createMessage(message, message.ReceiverId))
}

function scrollToLastMessage() {
    const container = document.getElementById('chat-messages-container');
    container.scrollIntoView({ block: 'end' });
}

function formatDate() {
    const date = new Date();

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const hh = String(date.getHours() + 1).padStart(2, '0')
    const m = String(date.getMinutes() + 1).padStart(2, '0')
    const ss = String(date.getSeconds() + 1).padStart(2, '0')


    return `${yyyy}-${mm}-${dd} ${hh}:${m}:${ss}`
}

function loadMoreMessages(chat, currUser, onlineUser) {
    var startIndex = (currentPage - 1) * messagesPerPage;
    var endIndex = currentPage * messagesPerPage - 1;
    theLastPage = false;

    // chat.Messages.length - 1 < endIndex ? endIndex = chat.Messages.length - 1 : 0

    if (chat != null && chat.Messages.length - 1 < endIndex) {
        // endIndex = chat.Messages.length - 1
        // startIndex = endIndex - messagesPerPage
        endIndex = chat.Messages.length - 1
        theLastPage = true;
    }

    currentPage++;
    return createChat(chat, currUser, onlineUser, startIndex, endIndex);
}

// Throttling function
function throttle(func, delay) {
    let timerId;
    return function (...args) {
        if (!timerId) {
            timerId = setTimeout(() => {
                func(...args);
                timerId = null;
            }, delay);
        }
    };
}

// Function to handle scroll event
function handleScroll(currChat, currUser) {
    const messageContainer = document.getElementById('chat-container');
    const scrollPosition = messageContainer.scrollTop;
    const scrollHeight = messageContainer.scrollHeight;
    const containerHeight = messageContainer.clientHeight;
    
    const scrollPositionBeforeUpdate = messageContainer.scrollHeight - messageContainer.scrollTop;
    
    // Check if the user has scrolled to the top
    if (!theLastPage) {
        if (scrollPosition === 0 && scrollHeight > containerHeight) {
            // take container to add messages in it
            let chatCont = document.getElementById('chat-container');
            chatCont.append(loadMoreMessages(currChat, currUser))

            // Calculate new scroll position after adding new messages
            const scrollPositionAfterUpdate = messageContainer.scrollHeight - scrollPositionBeforeUpdate;
            messageContainer.scrollTop = scrollPositionAfterUpdate;

        }
    }
}