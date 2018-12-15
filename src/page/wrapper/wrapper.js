import page from "./wrapper.html"
import "./wrapper.less"

let $page = $(page);
$("body").append($page);

function portrait() {
    $page.css({
        left: "100%",
        top: "0",
        width: window.innerHeight,
        height: window.innerWidth,
        transform: "rotate(90deg)"
    })
}

function landscape() {
    $page.css({
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        transform: "none"
    })
}

function adjust() {
    if (window.innerWidth >= window.innerHeight) {
        landscape();
    } else {
        portrait();
    }
}

adjust();
window.addEventListener("resize", adjust)