import page from "./index.html"
import "./index.less"

class Page {
    constructor() {
        $(".wrapper").append(page)
    }
}

export default new Page();