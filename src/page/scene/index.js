import page from "./index.html";
import "./index.less";
import storage from "config/storage";
import {random, collide} from "./common";

const SCENE_WIDTH = 12164 / 2;//2X.img
const JUMP_TIME = 2;//can jump 2 times
const SAFE_TIME = 2;//无敌

class Scene {
    $page = $(page);
    $curScore = this.$page.find("#curScore");
    $firstTip = this.$page.find(".first-tip");
    curScore = 0;
    die = false;
    $bg1 = this.$page.find(".bg.bg1");
    $bg2 = this.$page.find(".bg.bg2");
    $jump = this.$page.find(".jump");
    $role = this.$page.find(".role");
    jumpHeight = 150;
    jumpDuration = 300;
    jumpTime = 0;//1,2
    difficulty = 2;//the smaller the difficulter
    minGap = this.jumpDuration * 4 * this.difficulty;//stone appear
    maxGap = this.jumpDuration * 12 * this.difficulty;
    showStoneTimeout = null;
    clearStoneTimeout = null;
    detectStoneTimeout = null;
    roleStatus = "move";
    safeStatus = false;

    constructor() {
        $(".wrapper").append(this.$page);
        this.initEvents();
    }

    initEvents() {
        this.$firstTip.on("touchend", () => {
            this.$firstTip.fadeOut(this.start.bind(this));
        })
        this.$jump.on("touchstart", this.jump.bind(this));
    }

    reset(showTip = true) {
        this.showScore(0);
        this.die = false;
        showTip && this.$firstTip.fadeIn();
        this.$bg1.removeClass("move pause");
        this.$bg2.removeClass("move pause");
        this.setRole("normal");
        this.setRole("move");
        clearTimeout(this.showStoneTimeout);
        this.cancelDetectCollide();
    }

    start() {
        this.$bg1.addClass("move");
        this.$bg2.addClass("move");
        this.cancelDetectCollide();
        this.startDetectCollide();
        clearTimeout(this.showStoneTimeout);
        this.showStone();
    }

    showScore(score) {
        score = parseInt(score);
        this.curScore = score;
        this.$curScore.text(score);
        let historyScore = localStorage.getItem(storage.historyScore) || 0;
        if (score > historyScore) {
            localStorage.setItem(storage.historyScore, score);
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
        let curDuration = (curHeight / this.jumpHeight) * this.jumpDuration;
        this.$role.animate({
            marginBottom: this.jumpHeight + curHeight
        }, this.jumpDuration, "easeOutQuad", this.drop.bind(this, curDuration + this.jumpDuration))
    }

    drop(duration) {
        this.$role.animate({
            marginBottom: 0,
        }, duration || 0, "easeInQuad", () => {
            this.setRole("move");
            this.jumpTime = 0;
        })
    }

    //move ,jump,die,normal,big
    setRole(status) {
        this.roleStatus = status;
        switch (status) {
            case "normal":
                this.$role.removeClass("big");
                break;
            case "big":
                this.$role.addClass("big");
                break;
            case "move":
                this.$role.attr("src", "/static/img/scene/scene1/role-move.png");
                break;
            case "jump":
                this.$role.attr("src", "/static/img/scene/scene1/role-jump.png");
                break;
            case "die":
                this.$role.attr("src", "/static/img/scene/scene1/role-die.png");
                break;
        }
    }

    hidePage() {
        this.$page.hide(0);
    }

    showPage() {
        this.$page.show(0);
    }

    showStone() {
        let position1 = this.$bg1.position();
        let position2 = this.$bg2.position();
        let stoneIndex = Math.random() < .5 ? 1 : 2;
        let $stone = $(`<img class="stone" src="/static/img/scene/scene1/stone${stoneIndex}.png">`);
        let width = innerWidth > innerHeight ? innerWidth : innerHeight;
        if (position2.left <= width) {
            $stone.css("left", 0)
        } else {
            $stone.css("left", -position1.left + width);
        }
        this.$bg1.append($stone);
        //clear when die
        this.clearStoneTimeout = setTimeout(() => {
            $stone.remove();
        }, (width + 150) / SCENE_WIDTH * 15000)
        this.showStoneTimeout = setTimeout(this.showStone.bind(this), random(this.minGap, this.maxGap))
    }

    startDetectCollide() {
        let die = false;
        //stone
        if (!this.safeStatus) {
            this.$page.find(".bg .stone").each((i, dom) => {
                if (collide($(dom), this.$role)) {
                    if (this.roleStatus === "big") {
                        this.setRole("normal");
                        this.$role.addClass("shrink");
                        this.safeStatus = true;
                        setTimeout(() => {
                            this.safeStatus = false;
                            this.$role.removeClass("shrink");
                        }, SAFE_TIME * 1000)
                    } else {
                        this.onDie();
                        die = true;
                    }
                }
            })
        }
        if (die)
            return;
        this.detectStoneTimeout = requestAnimationFrame(this.startDetectCollide.bind(this));
    }

    cancelDetectCollide() {
        cancelAnimationFrame(this.detectStoneTimeout);
    }

    onDie() {
        this.die = true;
        this.$bg1.addClass("pause");
        this.$bg2.addClass("pause");
        this.cancelDetectCollide();
        clearTimeout(this.showStoneTimeout);
        clearTimeout(this.clearStoneTimeout);
        this.setRole("die");
    }
}

export default new Scene();