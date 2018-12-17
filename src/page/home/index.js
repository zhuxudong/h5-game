import page from "./index.html"
import "./index.less"

class PageHome {
    $page = $(page)
    $prevRole = this.$page.find("#prevRole");
    $nextRole = this.$page.find("#nextRole");
    $score = this.$page.find("#score");
    $musicActive = this.$page.find("#musicActive");
    $musicActive2 = this.$page.find("#musicActive2");
    $musicClose = this.$page.find("#musicClose");
    $musicClose2 = this.$page.find("#musicClose2");
    $share = this.$page.find("#share");
    $share2 = this.$page.find("#share2");
    musicPlaying = true;

    constructor() {
        $(".wrapper").append(this.$page);
        this.initEvents();
        this.togglePage(1);
    }

    initEvents() {
        this.$musicActive.add("touchstart click", () => {
            this.$musicClose.show(0);
            this.$musicActive.hide(0);
            this.musicPlaying = true;
        })
        this.$musicClose.add("touchstart click", () => {
            this.$musicActive.show(0);
            this.$musicClose.hide(0);
            this.musicPlaying = false;
        })
        this.$musicActive2.add("touchstart click", () => {
            this.$musicClose2.show(0);
            this.$musicActive2.hide(0);
            this.musicPlaying = true;
        })
        this.$musicClose2.add("touchstart click", () => {
            this.$musicActive2.show(0);
            this.$musicClose2.hide(0);
            this.musicPlaying = false;
        })
    }

    showScore(score) {
        this.$score.text(score)
    }

    togglePage(page) {
        if (page === 1) {
            this.$page.removeClass("page2");
            this.$musicActive2.hide(0);
            this.$musicClose2.hide(0);
            this.$share2.hide(0);

        } else if (page === 2) {
            this.$page.addClass("page2");
            this.$musicActive.hide(0);
            this.$musicClose.hide(0);
            this.$share.hide(0);
        }
    }
}

export default new PageHome();