import page from "./index.html";
import "./index.less";

class Loading {
    $page = $(page);
    $icon = this.$page.find(".role-move-icon");
    $bar = this.$page.find(".bar .now");
    $progress = this.$page.find(".progress");
    $preload = this.$page.find("#preload").children();

    constructor() {
        $("body").append(this.$page);
        this.preload();
    }

    //0-100
    setPercent(num) {
        this.$icon.css("marginLeft", `${num}%`);
        this.$bar.css("width", `${num}%`);
        this.$progress.css("marginLeft", `${num}%`);
        this.$progress.html(`${num}%`);
    }

    preload() {
        let amount = this.$preload.length;
        let check = () => {
            let completeAmount = 0;
            this.$preload.each((i, dom) => {
                if (dom.complete) {
                    completeAmount++;
                }
            })
            console.log(completeAmount)
            if (completeAmount === amount) {
                this.setPercent(100);
                setTimeout(() => {
                    this.hidePage();
                }, 500)
            } else {
                this.setPercent(completeAmount / amount * 100);
                setTimeout(check, 1000);
            }
        }
        check();
    }

    hidePage() {
        this.$page.fadeOut(() => {
            this.$preload.remove();
        });
    }
}

export default new Loading();