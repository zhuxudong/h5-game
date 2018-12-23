import page from "./index.html"
import "./index.less"

let that = null;

class PageWrapper {
    $page = $(page);
    status = "normal";//normal reverse
    constructor() {
        that = this;
        $("body").append(this.$page);
        this.forcePortrait();
    }

    normal() {
        this.status = "normal";
        this.$page.css({
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            transform: "none"
        })
    }

    reverse() {
        this.status = "reverse";
        this.$page.css({
            left: "100%",
            top: "0",
            width: window.innerHeight,
            height: window.innerWidth,
            transform: "rotate(90deg)"
        })
    }

    forcePortrait() {
        setTimeout(() => {
            if ((window.innerWidth || window.outerWidth || screen.width) > (window.innerHeight || window.outerHeight || screen.height)) {
                that.reverse();
            } else {
                that.normal();
            }
            window.removeEventListener("resize", this.forcePortrait);
            window.removeEventListener("resize", this.forceLandscape);
            window.addEventListener("resize", this.forcePortrait);
            window.onorientationchange = this.forcePortrait;
        }, 300)
    }

    forceLandscape() {
        setTimeout(() => {
            if ((window.innerWidth || window.outerWidth || screen.width) < (window.innerHeight || window.outerHeight || screen.height)) {
                that.reverse();
            } else {
                that.normal();
            }
            window.removeEventListener("resize", this.forcePortrait);
            window.removeEventListener("resize", this.forceLandscape);
            window.addEventListener("resize", this.forceLandscape);
            window.onorientationchange = this.forceLandscape;
        }, 300)
    }

    forceOriginal() {
        window.removeEventListener("resize", this.forcePortrait);
        window.removeEventListener("resize", this.forceLandscape);
        window.onorientationchange = null;
    }
}


export default new PageWrapper();
