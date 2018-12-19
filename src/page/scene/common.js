function random(min, max) {
    return min + Math.random() * (max - min);
}

function collide($dom1, $dom2) {
    let rect1 = $dom1[0].getBoundingClientRect();
    let rect2 = $dom2[0].getBoundingClientRect();
    rect1.width = rect1.width || rect1.right - rect1.left;
    rect2.width = rect2.width || rect2.right - rect2.left;
    rect1.height = rect1.height || rect1.bottom - rect1.top;
    rect2.height = rect2.height || rect2.bottom - rect2.top;
    return rect1.left < rect2.left + rect2.width &&
        rect1.left + rect1.width > rect2.left &&
        rect1.top < rect2.top + rect2.height &&
        rect1.height + rect1.top > rect2.top
}

export {
    random,
    collide

}