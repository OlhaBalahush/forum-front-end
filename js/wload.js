import { router } from "./router.js"
import { sendEvent } from "./websockets.js"

window.onload = function () {
    window.addEventListener("popstate", router)
    router()
}


