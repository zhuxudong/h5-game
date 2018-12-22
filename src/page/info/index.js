import page from "./index.html"
import pageScene1 from "page/scene/index"
import pageScene2 from "page/scene2/index"
import homePage from "page/home/index"
import "./index.less";
import {postInfo} from "../common";

import provinceJSON from "config/province.json"

class Info {
    $page = $(page);
    data = {};
    $name = this.$page.find("#name");
    $tel = this.$page.find("#tel");
    $province = this.$page.find("#province");
    $city = this.$page.find("#city");
    $address = this.$page.find("#address");
    $btnSubmit = this.$page.find(".btn-submit");
    curPage = 1;

    constructor() {
        $(".wrapper").append(this.$page);
        this.initData();
        this.$btnSubmit.on("touchend", this.onClickSubmit.bind(this))
    }

    initData() {
        for (let id in provinceJSON) {
            let json = provinceJSON[id];
            let {province, name, id} = json;
            if (this.data[province]) {
                this.data[province].push(name)
            } else {
                this.data[province] = [name]
            }
        }
        for (let province in this.data) {
            if (province === "浙江省") {
                this.$province.append($(`<option selected>${province}</option>`))
            } else {
                this.$province.append($(`<option >${province}</option>`))
            }
        }
        this.showCity("浙江省");
        this.$province.on("change", (e) => {
            this.showCity(e.target.value);
        })
    }

    showCity(province) {
        this.$city.html("");
        this.data[province].forEach((city) => {
            this.$city.append($(`<option >${city}</option>`))
        })
    }

    onClickSubmit() {
        let name = this.$name.val();
        let tel = this.$tel.val();
        let province = this.$province.val();
        let city = this.$city.val();
        let address = this.$address.val();
        if (name && tel && province && city && address) {
            if (/^\d*$/g.test(tel)) {
                postInfo(name, tel, province, city, address).then((result) => {
                    this.hidePage();
                    homePage.togglePage(this.curPage);
                    pageScene1.hidePage();
                    pageScene2.hidePage();
                })
            } else {
                alert("请输入正确格式的手机号码")
            }


        } else {
            alert("请填写所有字段!")
        }
    }

    showPage(curPage) {
        this.curPage = curPage;
        this.$page.stop().fadeIn();
    }

    hidePage() {
        this.$page.stop().fadeOut(0);
    }
}

export default new Info();