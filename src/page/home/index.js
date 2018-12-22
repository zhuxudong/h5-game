import page from "./index.html"
import "./index.less"
import storage from "config/storage"
import wrapperPage from "page/wrapper/index"
import scenePage from "page/scene/index"
import scenePage2 from "page/scene2/index"

class PageHome {
    $page = $(page);
    $prevRole = this.$page.find("#prevRole");
    $nextRole = this.$page.find("#nextRole");
    $score = this.$page.find("#score");
    $musicActive = this.$page.find("#musicActive");
    $musicClose = this.$page.find("#musicClose");
    $share = this.$page.find("#share");
    $title = this.$page.find("#title");
    $toggleTip = this.$page.find("#toggleTip");
    $role = this.$page.find("#role");
    $start = this.$page.find("#start");
    $bg1 = this.$page.find(".ground-container.page1");
    $bg2 = this.$page.find(".ground-container.page2");
    $resultShare = this.$page.find(".share-container");
    $shareIcon = this.$page.find(".share-container .share-guide");
    curPage = 1;
    $music1 = this.$page.find("#music1")[0];
    $music2 = this.$page.find("#music2")[0];
    musicActive = true;

    constructor() {
        $(".wrapper").append(this.$page);
        this.initEvents();
        this.togglePage(1);
    }

    initEvents() {
        this.$share.on("touchstart", () => {
            this.$resultShare.stop().fadeToggle();
            if (innerWidth > innerHeight) {
                this.$shareIcon.addClass("reverse")
            } else {
                this.$shareIcon.removeClass("reverse")
            }
        })
        this.$page.on("resize", () => {
            setTimeout(() => {
                if (innerWidth > innerHeight) {
                    this.$shareIcon.addClass("reverse")
                } else {
                    this.$shareIcon.removeClass("reverse")
                }
            }, 300)
        })
        this.$resultShare.on("touchend", () => {
            this.$resultShare.stop().fadeToggle();
        })
        this.$musicActive.on("touchstart", () => {
            this.$musicClose.show(0);
            this.$musicActive.hide(0);
            this.$music2.pause();
            this.$music1.pause();
            this.musicActive = false;
        })
        this.$musicClose.on("touchstart ", () => {
            this.$musicActive.show(0);
            this.$musicClose.hide(0);
            this.musicActive = true;
            if (this.curPage === 1) {
                this.$music1.play();
                this.$music2.pause();
            } else if (this.curPage === 2) {
                this.$music1.pause();
                this.$music2.play();
            }
        })
        this.$prevRole.on("touchstart ", (e) => {
            this.togglePage(this.curPage === 1 ? (this.curPage = 2) : (this.curPage = 1));
            return false;
        })
        this.$nextRole.on("touchend ", () => {
            this.togglePage(this.curPage === 1 ? (this.curPage = 2) : (this.curPage = 1));
            return false;
        })
        this.$start.on("touchstart", () => {
            this.hidePage();
            wrapperPage.forceLandscape();
            if (this.curPage === 1) {
                scenePage.showPage();
            } else if (this.curPage === 2) {
                scenePage2.showPage();
            }
        })
        this.$page.on("touchstart", () => {
            if (this.musicActive) {
                if (this.curPage === 1) {
                    this.$music1.play();
                } else if (this.curPage === 2) {
                    this.$music2.play();
                }
            }
        })
    }

    showScore(score) {
        score = score || localStorage.getItem(storage.historyScore) || 0;
        this.$score.text(score)
    }

    togglePage(page) {
        this.$page.fadeIn();
        this.curPage = page;
        wrapperPage.forcePortrait();
        this.showScore();
        if (page === 1) {
            this.$page.removeClass("page2");
            this.$score.parent().removeClass("page2");
            this.$title.attr("src", "/static/img/home/title.png");
            this.$toggleTip.attr("src", "/static/img/home/toggle-tip.png");
            this.$role.attr("src", "/static/img/home/role.png");
            this.$start.attr("src", "/static/img/home/start.png");
            this.$musicActive.attr("src", "/static/img/home/music-active.png");
            this.$musicClose.attr("src", "/static/img/home/music-close.png");
            this.$share.attr("src", "/static/img/home/share.png");
            this.$bg1.show(0);
            this.$bg2.hide(0);
            if (this.musicActive) {
                this.$music2.pause();
                this.$music1.play();
            }
        } else if (page === 2) {
            this.$page.addClass("page2");
            this.$score.parent().addClass("page2");
            this.$title.attr("src", "/static/img/home/page2/title.png");
            this.$toggleTip.attr("src", "/static/img/home/page2/toggle-tip.png");
            this.$role.attr("src", "/static/img/home/page2/role.png");
            this.$start.attr("src", "/static/img/home/page2/start.png");
            this.$musicActive.attr("src", "/static/img/home/page2/music-active.png");
            this.$musicClose.attr("src", "/static/img/home/page2/music-close.png");
            this.$share.attr("src", "/static/img/home/page2/share.png");
            this.$bg2.show(0);
            this.$bg1.hide(0);
            if (this.musicActive) {
                this.$music1.pause();
                this.$music2.play();
            }
        }
    }

    hidePage() {
        this.$page.hide(0);
    }
}

export default new PageHome();