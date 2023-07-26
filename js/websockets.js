import { receiveMessage } from "./pages/chat.js";

let conn

class Event {
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
    }
}

class Message {
    constructor(senderId, receiverId, text, createdAt) {
        this.SenderId = senderId;
        this.ReceiverId = receiverId;
        this.Text = text;
        this.CreatedAt = createdAt;
    }
}

class Comment {
    constructor(text, creator, post, createdAt) {
        this.text = text;
        this.creator = creator;
        this.post = post;
        this.createdAt = createdAt;
    }
}

function routeEvent(event) {
    if (event.type === undefined) {
        alert("no 'type' in event")
    }
    switch (event.type) {
        case "receive_message":
            receiveMessage(event.payload)
            break
        default:
            alert("unsupported message type")
            break
    }
}

function sendEvent(eventName, payload) {
    console.log(eventName, payload)
    const event = new Event(eventName, payload)
    conn.send(JSON.stringify(event))
}

function connectWS(user) {
    // Check if the browser supports WebSocket
    if (window["WebSocket"]) {
        if (!user.connected) {
            conn = new WebSocket("ws://" + document.location.host + "/ws");
            user.connected = true
            console.log("connected")
            conn.onmessage = function (event) {
                const eventData = JSON.parse(event.data)
                const evt = Object.assign(new Event, eventData)
                routeEvent(evt)
            }
            conn.onclose = function (event) {
                user.connected = false
            }
        } else {
            return
        }

    } else {
        alert("Not supporting websockets");
    }
}


export { Event, Message, Comment, routeEvent, sendEvent, connectWS }