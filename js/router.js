import { generateLoginPage } from "./pages/login.js"
import { generateSignupPage } from "./pages/signup.js"
import { fetchMainPageContent } from "./pages/main.js"
import { fetchChatPage } from "./pages/chat.js"
import { fetchCreatePage } from "./pages/createPost.js"
import { fetchPostPage } from "./pages/post.js"
import { fetchProfilePage } from "./pages/profile.js"

export const navigateTo = url => {
    history.pushState(null, null, url)
    router()
}

export const router = async () => {
    const routes = [
        {
            path: "/",
            view: fetchMainPageContent
        },
        {
            path: "/loginPage",
            view: generateLoginPage
        },
        {
            path: "/sign-up",
            view: generateSignupPage
        },
        {
            path: "/log-out",
            view: fetchMainPageContent // TODO
        },
        {
            path: "/chats",
            view: fetchChatPage
        },
        {
            path: "/createPost",
            view: fetchCreatePage
        },
        {
            path: "/postpage/:id",
            view: fetchPostPage
        },
        {
            path: "/profile/:name",
            view: fetchProfilePage
        }
    ]
    console.log("location:", location.pathname.split("/"))
    const urlParts = location.pathname.split("/");
    const potentialMatches = routes.map(route => {
        const routeParts = route.path.split("/");
        const isMatch = routeParts.length === urlParts.length && routeParts.every((part, index) => {
            return part === urlParts[index] || part.startsWith(":");
        });

        return {
            route: route,
            isMatch: isMatch,
            params: isMatch ? urlParts.slice(routeParts.length - 1) : []
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true
        };
    }

    console.log(match);

    // Check if match.params exists and has at least one element
    const param = match.params && match.params.length > 0 ? match.params[0] : null;

    console.log(match.route.view(param));
}