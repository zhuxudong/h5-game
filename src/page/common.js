const DIFX = 40;
const DIFY = 20;

function random(min, max) {
    return min + Math.random() * (max - min);
}

function collide($dom1, $dom2, difX, difY) {
    if (difX == null) {
        difX = DIFX;
    }
    if (difY == null) {
        difY = DIFY;
    }
    let rect1 = $dom1[0].getBoundingClientRect();
    let rect2 = $dom2[0].getBoundingClientRect();
    let width1 = rect1.width || rect1.right - rect1.left;
    let width2 = rect2.width || rect2.right - rect2.left;
    let height1 = rect1.height || rect1.bottom - rect1.top;
    let height2 = rect2.height || rect2.bottom - rect2.top;
    return rect1.left < rect2.left - difX + width2 &&
        rect1.left + width1 > rect2.left + difX &&
        rect1.top < rect2.top + height2 - difY &&
        height1 + rect1.top > rect2.top + difY
}

function getAward() {
    return new Promise((resolve, reject) => {
        $.post("https://forreall.cn/h5xmas/draw/public/index.php/draw").done((result) => {
            resolve(result.state)
        }).catch(reject)
    })
}

function postInfo(name, phone, province, city, address) {
    return new Promise((resolve, reject) => {
        let settings = {
            "url": "https://forreall.cn/h5xmas/draw/public/index.php/save",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                name,
                phone,
                province,
                city,
                address,
                sign: md5(`name=${name}phone=${phone}province=${province}city=${city}address=${address}key=dfyfsdfsdf23423jGFFTt6`)
            }
        };
        $.ajax(settings).done((result) => {
            resolve(result)
        }).catch(reject)
    })

}

export {
    random,
    collide,
    getAward,
    postInfo
}