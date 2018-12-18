import page from "./index.html";
import wrapperPage from "page/wrapper/index";
import homePage from "page/home/index";
import "./index.less";
import storage from "config/storage";
import {random, collide} from "../scene/common";

const MAX_PLAYTIMES = 5; //5次
const SCENE_WIDTH = 12164 / 2;//2X.img
const SCENE_DURATION = 15000;//15s
const JUMP_TIME = 2;//can jump 2 times
const SAFE_TIME = 2;//无敌
const JUMP_DURATION = 350;//350ms
const JUMP_HEIGHT = innerWidth > innerHeight ?
    (innerHeight < 423 ? (innerHeight - 123) / 2 : 150) :
    (innerWidth < 423 ? (innerWidth - 123) / 2 : 150);
//概率
const STONE_MIN = JUMP_DURATION * 2;//stone appear
const STONE_MAX = JUMP_DURATION * 8;
const STAR_PERCENT = .1;// star appear
const GIFT_MIN = JUMP_DURATION * 8; //tree appear
const GIFT_MAX = JUMP_DURATION * 24;

class Scene {
    $page = $(page);
    $curScore = this.$page.find("#curScore");
    $firstTip = this.$page.find(".first-tip");
    $result = this.$page.find(".result");
    $resultAgain = this.$result.find(".result-again");
    $resultShop = this.$result.find(".result-shop");
    $resultPass = this.$result.find(".result-pass");
    $btnAgain = this.$result.find(".btn-again");
    $btnShop = this.$result.find(".btn-shop");
    $btnShare = this.$result.find(".btn-share");
    $scoreResult = this.$result.find(".score-result");
    $scoreResultHigh = this.$result.find(".score-result-high");
    curScore = 0;
    die = false;
    $bg1 = this.$page.find(".bg.bg1");
    $bg2 = this.$page.find(".bg.bg2");
    $jump = this.$page.find(".jump");
    $role = this.$page.find(".role");
    jumpTime = 0;//1,2
    showStoneTimeout = null;
    clearStoneTimeout = null;
    showGiftTimeout = null;
    clearGiftTimeout = null;
    detectTimeout = null; //detect
    safeStatus = false;
    safeTimeout = null;
    over30 = false; //bigger only once

    constructor() {
        $(".wrapper").append(this.$page);
        this.initEvents();
    }

    initEvents() {
        this.$firstTip.on("touchend", () => {
            this.$firstTip.fadeOut(this.start.bind(this));
        })
        this.$jump.on("touchstart", this.jump.bind(this));
        this.$btnAgain.on("touchend", () => {
            this.hidePage();
            homePage.togglePage(1);
        })
        this.$btnShop.on("touchend", () => {
            this.hidePage();
            homePage.togglePage(1);
        })
        this.$btnShare.on("touchend", () => {
            this.hidePage();
            homePage.togglePage(1);
        })
        this.$resultPass.on("touchend", () => {
            this.hidePage();
            homePage.togglePage(1);
        })

    }

    reset(showTip = true) {
        this.showScore(0);
        this.over30 = false;
        this.die = false;
        showTip && this.$firstTip.fadeIn();
        this.$bg1.removeClass("move pause");
        this.$bg2.removeClass("move pause");
        this.setRole("normal");
        this.setRole("move");
        clearTimeout(this.showStoneTimeout);
        clearTimeout(this.showGiftTimeout);
        this.cancelDetectCollide();
        this.$page.find(".gift-container,.stone").remove();
    }

    start() {
        this.$bg1.addClass("move");
        this.$bg2.addClass("move");
        this.cancelDetectCollide();
        this.startDetectCollide();
        clearTimeout(this.showStoneTimeout);
        this.showStone();
        clearTimeout(this.showGiftTimeout);
        setTimeout(this.showGift.bind(this), 1000)
    }

    showScore(score) {
        score = parseInt(score);
        this.curScore = score;
        this.$curScore.text(score);
        let historyScore = localStorage.getItem(storage.historyScore) || 0;
        if (score > historyScore) {
            localStorage.setItem(storage.historyScore, score);
        }
        if (score >= 30) {
            if (!this.over30) {
                this.setRole("big");
                this.over30 = true;
            }
        }
    }

    addScore(num) {
        this.showScore(parseInt(this.curScore) + parseInt(num));
    }

    jump() {
        if (this.jumpTime >= JUMP_TIME || this.die)
            return;
        this.setRole("jump");
        this.jumpTime++;
        this.$role.stop(true);
        let curHeight = parseFloat(this.$role.css("marginBottom"));
        let curDuration = (curHeight / JUMP_HEIGHT) * JUMP_DURATION;
        this.$role.animate({
            marginBottom: JUMP_HEIGHT + curHeight
        }, JUMP_DURATION, "easeOutQuad", this.drop.bind(this, curDuration + JUMP_DURATION))
    }

    drop(duration) {
        this.$role.animate({
            marginBottom: 0,
        }, duration || 0, "easeInQuad", () => {
            if (!this.die) {
                this.setRole("move");
            }
            this.jumpTime = 0;
        })
    }

    //move ,jump,die,normal,big
    setRole(status) {
        this.$role.removeClass("jump");
        switch (status) {
            case "normal":
                this.$role.removeClass("big");
                break;
            case "big":
                this.$role.addClass("big");
                clearTimeout(this.safeTimeout);
                this.$role.removeClass("shrink");
                this.safeStatus = true;
                break;
            case "move":
                this.$role.attr("src", "/static/img/scene/scene2/role-move.png");
                break;
            case "jump":
                this.$role.attr("src", "/static/img/scene/scene2/role-jump.png");
                this.$role.addClass("jump");
                break;
            case "die":
                this.$role.attr("src", "/static/img/scene/scene2/role-die.png");
                break;
        }
    }

    hidePage() {
        this.$page.hide(0);
        this.hideResult();
    }

    //theme
    showPage() {
        this.reset();
        this.$page.show(0);
    }

    showStone() {
        let position1 = this.$bg1.position();
        let position2 = this.$bg2.position();
        let stoneIndex = Math.random() < .5 ? 1 : 2;
        let $stone = $(`<img class="stone" src="/static/img/scene/scene1/stone${stoneIndex}.png">`);
        let width = innerWidth >= innerHeight ? innerWidth : innerHeight;
        if ((wrapperPage.status === "normal" ? position2.left : position2.top) <= width) {
            $stone.css("left", 0)
        } else {
            $stone.css("left", -(wrapperPage.status === "normal" ? position1.left : position1.top) + width);
        }
        this.$bg1.append($stone);
        //clear when die
        this.clearStoneTimeout = setTimeout(() => {
            $stone.remove();
        }, (width + 150) / SCENE_WIDTH * SCENE_DURATION)
        this.showStoneTimeout = setTimeout(this.showStone.bind(this), random(STONE_MIN, STONE_MAX))
    }

    showGift() {
        let position1 = this.$bg1.position();
        let position2 = this.$bg2.position();
        let isStar = Math.random() <= STAR_PERCENT;
        let giftIndex = parseInt(Math.random() * 5);
        let treeIndex = Math.random() < .5 ? 1 : 2;
        let imgStr = isStar ? "star.png" : `g${giftIndex + 1}.png`;
        let scoreImg = isStar ? "score30.png" : "score5.png";
        let $giftContainer = $(`<div class="gift-container"></div>`)
        let $gift = $(`<img class="${isStar ? 'star' : 'gift'}" src="/static/img/scene/scene2/${imgStr}">`);
        let $tree = $(`<img class="tree" src="/static/img/scene/scene2/tree${treeIndex}.png">`)
        let $score = $(`<img class="${isStar ? 'score30' : 'score5'}" src="/static/img/scene/scene1/${scoreImg}">`)
        let width = innerWidth >= innerHeight ? innerWidth : innerHeight;
        if ((wrapperPage.status === "normal" ? position2.left : position2.top) <= width) {
            $giftContainer.css("left", 0)
        } else {
            $giftContainer.css("left", -(wrapperPage.status === "normal" ? position1.left : position1.top) + width);
        }
        let bottom = random(50, 100) + "%";
        let left = random(10, 80) + "%";
        $gift.css({
            bottom,
            left
        }).data("score", isStar ? 30 : 5).data("$score", $score);
        $score.css({
            bottom,
            left
        }).hide(0);
        $giftContainer
            .append($tree)
            .append($gift)
            .append($score)

        this.$bg1.append($giftContainer);
        //clear when die
        this.clearGiftTimeout = setTimeout(() => {
            $giftContainer.remove();
        }, (width + 300) / SCENE_WIDTH * SCENE_DURATION)
        this.showGiftTimeout = setTimeout(this.showGift.bind(this), random(GIFT_MIN, GIFT_MAX));
    }

    startDetectCollide() {
        let die = false;
        //stone
        this.$bg1.find(".stone").each((i, dom) => {
            if (collide($(dom), this.$role)) {
                if (this.safeStatus) {
                    this.setRole("normal");
                    this.$role.addClass("shrink");
                    clearTimeout(this.safeTimeout);
                    this.safeTimeout = setTimeout(() => {
                        this.safeStatus = false;
                        this.$role.removeClass("shrink");
                    }, SAFE_TIME * 1000)
                } else {
                    this.onDie();
                    die = true;
                }
            }
        })
        if (die)
            return;
        this.$bg1.find(".star,.gift").each((i, dom) => {
            let $dom = $(dom);
            if (collide($dom, this.$role)) {
                let score = $dom.data("score");
                let $score = $dom.data("$score");
                $dom.data("score", 0);
                if (score) {
                    $dom.fadeOut();
                    this.addScore(score);
                    $score.fadeIn(() => {
                        $score.fadeOut();
                    }).addClass("rise")
                }
            }
        })
        this.detectTimeout = requestAnimationFrame(this.startDetectCollide.bind(this));
    }

    cancelDetectCollide() {
        cancelAnimationFrame(this.detectTimeout);
    }

    hideResult() {
        this.$result.css("visibility", "hidden");
        this.$resultAgain.hide(0);
        this.$resultShop.hide(0);
        this.$resultPass.hide(0);
    }

    showResult() {
        this.hideResult();
        this.$result.css("visibility", "unset");
        this.$scoreResult.text(this.curScore);
        this.$scoreResultHigh.text(localStorage.getItem(storage.historyScore) || 0);
        let type = "again";
        let playTimes = localStorage.getItem(storage.playTimes) || 0;
        localStorage.setItem(storage.playTimes, playTimes - 0 + 1);
        if (this.curScore < 60) {
            if (playTimes < MAX_PLAYTIMES) {
                type = "again";
            } else {
                type = "shop";
            }
        } else {
            type = "pass";
        }
        switch (type) {
            case "again":
                this.$resultAgain.fadeIn()
                break;
            case "shop":
                this.$resultShop.fadeIn()
                break;
            case "pass":
                this.$resultPass.fadeIn()
                break;
        }
    }

    onDie() {
        this.die = true;
        this.$bg1.addClass("pause");
        this.$bg2.addClass("pause");
        this.cancelDetectCollide();
        clearTimeout(this.showStoneTimeout);
        clearTimeout(this.clearStoneTimeout);
        clearTimeout(this.showGiftTimeout);
        clearTimeout(this.clearGiftTimeout);
        this.setRole("die");
        this.showResult();
    }
}

export default new Scene();