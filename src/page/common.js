let DIFX = 20;
let DIFY = 20;

function random(min, max) {
    return min + Math.random() * (max - min);
}

function collide($dom1, $dom2) {
    let rect1 = $dom1[0].getBoundingClientRect();
    let rect2 = $dom2[0].getBoundingClientRect();
    let width1 = rect1.width || rect1.right - rect1.left;
    let width2 = rect2.width || rect2.right - rect2.left;
    let height1 = rect1.height || rect1.bottom - rect1.top;
    let height2 = rect2.height || rect2.bottom - rect2.top;
    return rect1.left < rect2.left - DIFX + width2 &&
        rect1.left + width1 > rect2.left + DIFX &&
        rect1.top < rect2.top + height2 - DIFY &&
        height1 + rect1.top > rect2.top + DIFY
}

function getAward() {
    return new Promise((resolve, reject) => {
        $.post("http://47.98.149.216/draw").done((result) => {
            resolve(result.state)
        }).catch(reject)
    })

}

export {
    random,
    collide,
    getAward
}