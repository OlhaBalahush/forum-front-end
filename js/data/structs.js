class User {
    constructor(Id, Email, Nickname, Password, FirstName, LastName, Gender, DateOfBirth, Avatar, About, Posts, Chats, CreatedAt) {
        this.Id = Id;
        this.Email = Email;
        this.Nickname = Nickname;
        this.Password = Password;
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Gender = Gender;
        this.DateOfBirth = DateOfBirth;
        this.Avatar = Avatar;
        this.About = About;
        this.Posts = Posts;
        this.Chats = Chats;
        this.CreatedAt = CreatedAt;
    }
}

class Post {
    constructor(Id, Creator, Title, Text, Categories, Comments, Likes, LikedByUser, Image, CreatedAt) {
        this.Id = Id;
        this.Creator = Creator;
        this.Title = Title;
        this.Text = Text;
        this.Categories = Categories;
        this.Comments = Comments;
        this.Likes = Likes;
        this.LikedByUser = LikedByUser;
        this.Image = Image;
        this.CreatedAt = CreatedAt;
    }
}

class Comment {
    constructor(Id, Text, Creator, Post, CreatedAt) {
        this.Id = Id;
        this.Text = Text;
        this.Creator = Creator;
        this.Post = Post;
        this.CreatedAt = CreatedAt;
    }
}

class NewComment {
    constructor(Text, UserId, PostId) {
        this.Text = Text;
        this.UserId = UserId;
        this.PostId = PostId;
    }
}

class Message {
    constructor(Id, SenderId, ReceiverId, Text, CreatedAt) {
        this.Id = Id;
        this.SenderId = SenderId;
        this.ReceiverId = ReceiverId;
        this.Text = Text;
        this.CreatedAt = CreatedAt;
    }
}

class Chat {
    constructor(UserOne, UserTwo, Messages) {
        this.UserOne = UserOne;
        this.UserTwo = UserTwo;
        this.Messages = Messages;
    }
}

class Session {
    constructor(Authenticated, User, ActiveUsers, AllUsers, Error, Categories, Post, Posts, Query) {
        this.Authenticated = Authenticated;
        this.User = User;
        this.ActiveUsers = ActiveUsers;
        this.AllUsers = AllUsers;
        this.Error = Error;
        this.Categories = Categories;
        this.Post = Post;
        this.Posts = Posts;
        this.Query = Query;
    }
}

export {User, Post, Comment, NewComment, Message, Chat}