import { User, Post, Comment, Message, Chat } from "./structs.js"

export async function readEntitiesFromFile(filename) {
    var entities
    await fetch(filename)
        .then((response) => response.json())
        .then((data) => entities = data);

    const users = entities.users.map(user => new User(...Object.values(user)));
    const posts = entities.posts.map(post => new Post(...Object.values(post)));
    const comments = entities.comments.map(comment => new Comment(...Object.values(comment)));
    const messages = entities.messages.map(message => new Message(...Object.values(message)));
    const chats = entities.chats.map(chat => new Chat(chat.UserOneId, chat.UserTwoId, chat.Messages));
    
    var categories = []
    posts.forEach((e) => {
        e.Categories.forEach((c) => {
            categories.push(c)
        })
    })

    return { users, posts, categories, comments, messages, chats };
}