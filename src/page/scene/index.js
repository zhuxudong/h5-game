import page from "./index.html";
import "./index.less";

const SCENE_WIDTH = 12164 / 2;

function random(min, max) {
    return min + Math.random() * (max - min);
}


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
        clearTimeout(this.showStoneTimeout);
        this.cancelDetectCollide();
        this.startDetectCollide();
        this.showStone();
    }

    showScore(score) {
        this.curScore = parseInt(score);
        this.$curScore.text(score);
    }

    jump() {
        if (this.jumpTime >= 2 || this.die)
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
        console.log("showstone")
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

    collide($dom1, $dom2) {
        let rect1 = $dom1[0].getBoundingClientRect();
        let rect2 = $dom2[0].getBoundingClientRect();
        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y

    }

    startDetectCollide() {
        let die = false;
        this.$page.find(".bg .stone").each((i, dom) => {
            if (this.collide($(dom), this.$role)) {
                this.onDie();
                die = true;
            }
        })
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