function random(min, max) {
    return min + Math.random() * (max - min);
}

function collide($dom1, $dom2) {
    let rect1 = $dom1[0].getBoundingClientRect();
    let rect2 = $dom2[0].getBoundingClientRect();
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
}

export {
    random,
    collide

}