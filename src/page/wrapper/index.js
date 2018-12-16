import page from "./index.html"
import "./index.less"

let that = null;

class PageWrapper {
    $page = $(page);

    constructor() {
        that = this;
        $("body").append(this.$page).on('touchend touchstart', function (e) {
            e.preventDefault();
        });
        this.forcePortrait();
    }

    normal() {
        this.$page.css({
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            transform: "none"
        })
    }

    reverse() {
        this.$page.css({
            left: "100%",
            top: "0",
            width: window.innerHeight,
            height: window.innerWidth,
            transform: "rotate(90deg)"
        })
    }

    forcePortrait() {
        if (window.innerWidth >= window.innerHeight) {
            that.reverse();
        } else {
            that.normal();
        }
        window.removeEventListener("resize", this.forcePortrait);
        window.removeEventListener("resize", this.forceLandscape);
        window.addEventListener("resize", this.forcePortrait);
    }

    forceLandscape() {
        if (window.innerWidth >= window.innerHeight) {
            that.normal();
        } else {
            that.reverse();
        }
        window.removeEventListener("resize", this.forcePortrait)
        window.removeEventListener("resize", this.forceLandscape)
        window.addEventListener("resize", this.forceLandscape)
    }
}


export default new PageWrapper();
