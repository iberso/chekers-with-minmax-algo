//DOM selector
const board = document.querySelector(".boardBase")
const inputSize = document.querySelector("#inputSize")

//init value
let PlayerTurn = true//True color || false white
var width = 8
var totalSize = width * width

//untuk meng Append square ke board
var change = false
var backgroundColor = 'white'

//buat papan dengan pola kotak kotak
for (let i = 0; i < totalSize; i++) {
    const square = document.createElement('div')
    if (width % 2 != 0) {
        if (i % 2 != 0) {
            square.classList.add("color")
        }
    } else {
        change = i % 8 === 0 || i === 0
        backgroundColor = change ? backgroundColor : backgroundColor === 'white' ? 'color' : 'white'
        square.classList.add(backgroundColor)
        change = false
    }

    square.innerHTML = i
    square.setAttribute('id', i)
    square.classList.add("empty")
    board.appendChild(square)

}


//Untuk Nampilin Pion Pertama Kali
for (let i = 0; i < width * 3; i++) {//Pion White
    if (board.children[i].classList.contains('color')) {
        board.children[i].innerHTML = '<img src="coin-w.svg">'
        board.children[i].classList.add("white-pion")
        board.children[i].classList.remove("empty")
    }
}

for (let i = totalSize - 1; i >= totalSize - width * 3; i--) {//Pion Color
    if (board.children[i].classList.contains('color')) {
        board.children[i].innerHTML = '<img src="coin-o.svg">'
        board.children[i].classList.add("color-pion")
        board.children[i].classList.remove("empty")
    }
}


//Buat ngitung Pion White dan Color Tiap Makan
function countPions(boardState) {
    let whiteAmount = 0;
    let whiteKingAmount = 0;
    let colorAmount = 0;
    let colorKingAmount = 0;

    let PionWin = "none";
    for (let i = 0; i < totalSize; i++) {
        if (boardState.children[i].classList.contains('white-pion')) { whiteAmount++; PionWin = "White" }
        if (boardState.children[i].classList.contains('white-pion') && boardState.children[i].classList.contains('king')) { whiteKingAmount++; }
        if (boardState.children[i].classList.contains('color-pion')) { colorAmount++; PionWin = "Color" }
        if (boardState.children[i].classList.contains('color-pion') && boardState.children[i].classList.contains('king')) { colorKingAmount++; }
    }
    return { whiteAmount, colorAmount, PionWin, whiteKingAmount, colorKingAmount }
}

//untuk tampilin jumlah pion
document.getElementById("colorPionsAmount").innerHTML = countPions(board).colorAmount
document.getElementById("whitePionsAmount").innerHTML = countPions(board).whiteAmount

//untuk cek apakah board tsb sudah dalam kondisi menang atau belum
function checkWins(_board) {
    if (countPions(_board).whiteAmount === 0 || countPions(_board).colorAmount === 0) {
        removePionsEventListener()
        document.getElementById('notif').innerHTML = "<b><span>" + countPions(_board).PionWin + " Wins</span></b>"
        console.log(countPions(_board).PionWin + " Winss")
        return true
    }
}

//untuk memberi event listerner click ke pions player
//biar bisa di click
function givePionsEventListener() {
    if (PlayerTurn) {
        document.querySelectorAll(".color-pion").forEach(function (element) {
            element.addEventListener('click', clickPion)
        });
    } else {
        document.querySelectorAll(".white-pion").forEach(function (element) {
            element.addEventListener('click', clickPion)
        });
    }
}

//untuk menghapus event listerner click dari pions
function removePionsEventListener() {
    for (let i = 0; i < totalSize; i++) {
        board.children[i].removeEventListener('click', clickPion)
    }
}

//untuk removeclass selected dan validmove
function clearClass() {
    for (let i = 0; i < totalSize; i++) {
        board.children[i].classList.remove('selected')
        board.children[i].classList.remove('valid-move')
        board.children[i].classList.remove('eat-move')
        board.children[i].removeAttribute('onclick')
    }
    if (PlayerTurn) {
        document.getElementById("playerTurnInfo").innerHTML = "Color"
    } else {
        document.getElementById("playerTurnInfo").innerHTML = "White"
    }
    document.getElementById("colorPionsAmount").innerHTML = countPions(board).colorAmount
    document.getElementById("whitePionsAmount").innerHTML = countPions(board).whiteAmount
}

//untuk memilih Pion
function clickPion() {
    clearClass()
    //console.log(this)
    this.classList.add('selected')
    checkValidMove(this)
}

//untuk mengecek gerakan valid dari pion
function checkValidMove(selectedpion, chcAvaMove = true) {
    let pos = parseInt(selectedpion.getAttribute("id"))

    const isLeftEdge = (pos % width === 0)
    const isRightEdge = (pos % width === width - 1)
    const isTopEdge = (pos < width && pos >= 0)
    const isBottomEdge = (pos < totalSize && pos >= totalSize - width)

    const leftTop = pos - 1 - width
    const rightTop = pos + 1 - width

    const leftBottom = pos - 1 + width
    const rightBottom = pos + 1 + width

    //buat ngecek apakah kiri atas atau kanan atas adalah edge
    const leftTopIsEdge = (leftTop % width === 0)
    const rightTopIsEdge = (rightTop % width === width - 1)
    const leftTopIsTop = (leftTop < width && leftTop >= 0)
    const rightTopIsTop = (rightTop < width && rightTop >= 0)

    //buat ngecek apakah kiri bawah atau kanan bawah adalah edge
    const leftBottomIsEdge = (leftBottom % width === 0)
    const rightBottomIsEdge = (rightBottom % width === width - 1)
    const leftBottomIsBottom = (leftBottom >= totalSize - width && leftBottom < totalSize)
    const rightBottomIsBottom = (rightBottom >= totalSize - width && rightBottom < totalSize)

    if (PlayerTurn) {//Turn Player Pion Color
        if (selectedpion.classList.contains('king')) {//Gerakan Pion Raja Color
            pionKingValidMove("white-pion", chcAvaMove, pos, leftTop, rightTop, leftBottom, rightBottom, isLeftEdge, isRightEdge, isTopEdge, isBottomEdge, leftTopIsEdge, leftTopIsTop, rightTopIsEdge, rightTopIsTop, leftBottomIsEdge, leftBottomIsBottom, rightBottomIsEdge, rightBottomIsBottom)
        } else {
            //Gerakan Pion Color biasa
            //buat cek pos Kiri Atas [FIX] + Paksa Makan
            if (!isLeftEdge && !isTopEdge && !leftTopIsTop && !leftTopIsEdge && board.children[leftTop].classList.contains('white-pion') && board.children[leftTop - 1 - width].classList.contains('empty')) {
                if (chcAvaMove) {
                    board.children[leftTop - 1 - width].classList.add("valid-move")
                    board.children[leftTop].classList.add("eat-move")
                    board.children[leftTop - 1 - width].setAttribute('onclick', 'eatPion(' + pos + ',' + leftTop + ',' + parseInt(leftTop - 1 - width) + ')')
                } else {
                    board.children[pos].setAttribute('move', true)
                }
            } else if (!isRightEdge && !isTopEdge && board.children[rightTop].classList.contains('empty')) {//gerakan biasa
                if (chcAvaMove) {
                    board.children[rightTop].classList.add("valid-move")
                    board.children[rightTop].setAttribute('onclick', 'movePion(' + pos + ',' + rightTop + ')')
                } else {
                    board.children[pos].setAttribute('move', true)
                }
            }

            //buat cek pos Kanan Atas [FIX] + Paksa Makan
            if (!isRightEdge && !isTopEdge && !rightTopIsTop && !rightTopIsEdge && board.children[rightTop].classList.contains('white-pion') && board.children[rightTop + 1 - width].classList.contains('empty')) {
                if (chcAvaMove) {
                    board.children[rightTop + 1 - width].classList.add("valid-move")
                    board.children[rightTop].classList.add("eat-move")
                    board.children[rightTop + 1 - width].setAttribute('onclick', 'eatPion(' + pos + ',' + rightTop + ',' + parseInt(rightTop + 1 - width) + ')')
                } else {
                    board.children[pos].setAttribute('move', true)
                }
            } else if (!isLeftEdge && !isTopEdge && board.children[leftTop].classList.contains('empty')) {//gerakan biasa
                if (chcAvaMove) {
                    board.children[leftTop].classList.add("valid-move")
                    board.children[leftTop].setAttribute('onclick', 'movePion(' + pos + ',' + leftTop + ')')
                } else {
                    board.children[pos].setAttribute('move', true)
                }
            }
        }
    } else {//Turn Player Pion White
        if (selectedpion.classList.contains('king')) {//Gerakan Pion Raja Putih
            pionKingValidMove("color-pion", chcAvaMove, pos, leftTop, rightTop, leftBottom, rightBottom, isLeftEdge, isRightEdge, isTopEdge, isBottomEdge, leftTopIsEdge, leftTopIsTop, rightTopIsEdge, rightTopIsTop, leftBottomIsEdge, leftBottomIsBottom, rightBottomIsEdge, rightBottomIsBottom)
        } else {
            //Gerakan Pion White biasa
            //buat cek pos Kiri bawah [FIX] + Paksa Makan
            if (!isLeftEdge && !isBottomEdge && !leftBottomIsBottom && !leftBottomIsEdge && board.children[leftBottom].classList.contains('color-pion') && board.children[leftBottom - 1 + width].classList.contains('empty')) {
                if (chcAvaMove) {
                    board.children[leftBottom - 1 + width].classList.add("valid-move")
                    board.children[leftBottom].classList.add("eat-move")
                    board.children[leftBottom - 1 + width].setAttribute('onclick', 'eatPion(' + pos + ',' + leftBottom + ',' + parseInt(leftBottom - 1 + width) + ')')
                } else {
                    board.children[pos].setAttribute('move', true)
                }
            } else if (!isRightEdge && !isBottomEdge && board.children[rightBottom].classList.contains('empty')) {//gerakan biasa
                if (chcAvaMove) {
                    board.children[rightBottom].classList.add("valid-move")
                    board.children[rightBottom].setAttribute('onclick', 'movePion(' + pos + ',' + rightBottom + ')')
                } else {
                    board.children[pos].setAttribute('move', true)
                }
            }

            //buat cek pos Kanan bawah [FIX] + Paksa Makan
            if (!isRightEdge && !isBottomEdge && !rightBottomIsBottom && !rightBottomIsEdge && board.children[rightBottom].classList.contains('color-pion') && board.children[rightBottom + 1 + width].classList.contains('empty')) {
                if (chcAvaMove) {
                    board.children[rightBottom + 1 + width].classList.add("valid-move")
                    board.children[rightBottom].classList.add('eat-move')
                    board.children[rightBottom + 1 + width].setAttribute('onclick', 'eatPion(' + pos + ',' + rightBottom + ',' + parseInt(rightBottom + 1 + width) + ')')
                } else {
                    board.children[pos].setAttribute('move', true)
                }
            } else if (!isLeftEdge && !isBottomEdge && board.children[leftBottom].classList.contains('empty')) {//gerakan biasa
                if (chcAvaMove) {
                    board.children[leftBottom].classList.add("valid-move")
                    board.children[leftBottom].setAttribute('onclick', 'movePion(' + pos + ',' + leftBottom + ')')
                } else {
                    board.children[pos].setAttribute('move', true)
                }
            }
        }
    }
}

//untuk cek apakah player sekarang yg sedang bermain bisa bergerak atau tidak
function checkPlayerCanMove() {
    let CP = 0
    let canMove = []
    if (PlayerTurn) {
        CP = document.querySelectorAll(".color-pion")
    } else {
        CP = document.querySelectorAll(".white-pion")
    }
    let ctr = 0

    CP.forEach(function (element, index) {
        checkValidMove(element, false)
        if (!element.hasAttribute('move')) {
            ctr++
        } else {
            canMove.push(CP[index].getAttribute('id'))
        }
    });

    CP.forEach(function (element, index) {
        checkValidMove(element, false)
        if (element.hasAttribute('move')) {
            element.removeAttribute('move')
        }
    });

    let PionWin = ""
    let PionLose = ""
    if (PlayerTurn) {
        PionWin = "White";
        PionLose = "Color";
    } else {
        PionWin = "Color";
        PionLose = "White";
    }

    console.log("Jumlah Pion " + PionLose + " yang gak bisa gerak: " + ctr + "/" + CP.length)
    console.log('\n')

    if (ctr === CP.length && CP.length != 0) {
        console.clear()
        removePionsEventListener()
        document.getElementById('notif').innerHTML = '<b>' + PionWin + " Wins because " + PionLose + " Has No Valid Movement" + '</b>'
        console.log(PionWin + " Wins because " + PionLose + " Has No Valid Movement")
    }
}

//gerakan Untuk pion king
function pionKingValidMove(pionType, chcAvaMove, pos, leftTop, rightTop, leftBottom, rightBottom, isLeftEdge, isRightEdge, isTopEdge, isBottomEdge, leftTopIsEdge, leftTopIsTop, rightTopIsEdge, rightTopIsTop, leftBottomIsEdge, leftBottomIsBottom, rightBottomIsEdge, rightBottomIsBottom) {
    let LT = false
    let RT = false
    let LB = false
    let RB = false

    //buat cek pos makan Kiri Atas [FIX] + Paksa Makan
    if (!isLeftEdge && !isTopEdge && !leftTopIsTop && !leftTopIsEdge && board.children[leftTop].classList.contains(pionType) && board.children[leftTop - 1 - width].classList.contains('empty')) {
        if (chcAvaMove) {
            LT = true
            board.children[leftTop - 1 - width].classList.add("valid-move")
            board.children[leftTop].classList.add("eat-move")
            board.children[leftTop - 1 - width].setAttribute('onclick', 'eatPion(' + pos + ',' + leftTop + ',' + parseInt(leftTop - 1 - width) + ')')
        } else {
            board.children[pos].setAttribute('move', true)
        }
    }

    //buat cek pos makan Kanan Atas [FIX] + Paksa Makan
    if (!isRightEdge && !isTopEdge && !rightTopIsTop && !rightTopIsEdge && board.children[rightTop].classList.contains(pionType) && board.children[rightTop + 1 - width].classList.contains('empty')) {
        if (chcAvaMove) {
            RT = true
            board.children[rightTop + 1 - width].classList.add("valid-move")
            board.children[rightTop].classList.add("eat-move")
            board.children[rightTop + 1 - width].setAttribute('onclick', 'eatPion(' + pos + ',' + rightTop + ',' + parseInt(rightTop + 1 - width) + ')')
        } else {
            board.children[pos].setAttribute('move', true)
        }
    }

    //buat cek pos makan Kiri bawah [FIX] + Paksa Makan
    if (!isLeftEdge && !isBottomEdge && !leftBottomIsBottom && !leftBottomIsEdge && board.children[leftBottom].classList.contains(pionType) && board.children[leftBottom - 1 + width].classList.contains('empty')) {
        if (chcAvaMove) {
            LB = true
            board.children[leftBottom - 1 + width].classList.add("valid-move")
            board.children[leftBottom].classList.add("eat-move")
            board.children[leftBottom - 1 + width].setAttribute('onclick', 'eatPion(' + pos + ',' + leftBottom + ',' + parseInt(leftBottom - 1 + width) + ')')
        } else {
            board.children[pos].setAttribute('move', true)
        }
    }

    // //buat cek pos makan Kanan bawah [FIX] + Paksa Makan
    if (!isRightEdge && !isBottomEdge && !rightBottomIsBottom && !rightBottomIsEdge && board.children[rightBottom].classList.contains(pionType) && board.children[rightBottom + 1 + width].classList.contains('empty')) {
        if (chcAvaMove) {
            RB = true
            board.children[rightBottom + 1 + width].classList.add("valid-move")
            board.children[rightBottom].classList.add('eat-move')
            board.children[rightBottom + 1 + width].setAttribute('onclick', 'eatPion(' + pos + ',' + rightBottom + ',' + parseInt(rightBottom + 1 + width) + ')')
        } else {
            board.children[pos].setAttribute('move', true)
        }
    }

    //buat cek pos gerak Kiri Atas [FIX] + Paksa Makan
    if (!RT && !LB && !RB && !isLeftEdge && !isTopEdge && board.children[leftTop].classList.contains('empty')) {//gerakan biasa
        if (chcAvaMove) {
            board.children[leftTop].classList.add("valid-move")
            board.children[leftTop].setAttribute('onclick', 'movePion(' + pos + ',' + leftTop + ')')
        } else {
            board.children[pos].setAttribute('move', true)
        }
    }

    //buat cek pos gerak Kanan Atas [FIX] + Paksa Makan
    if (!LT && !LB && !RB && !isRightEdge && !isTopEdge && board.children[rightTop].classList.contains('empty')) {//gerakan biasa
        if (chcAvaMove) {
            board.children[rightTop].classList.add("valid-move")
            board.children[rightTop].setAttribute('onclick', 'movePion(' + pos + ',' + rightTop + ')')
        } else {
            board.children[pos].setAttribute('move', true)
        }
    }

    //buat cek pos gerak Kiri Bawah [FIX] + Paksa Makan
    if (!LT && !RT && !RB && !isLeftEdge && !isBottomEdge && board.children[leftBottom].classList.contains('empty')) {//gerakan biasa
        if (chcAvaMove) {
            board.children[leftBottom].classList.add("valid-move")
            board.children[leftBottom].setAttribute('onclick', 'movePion(' + pos + ',' + leftBottom + ')')
        } else {
            board.children[pos].setAttribute('move', true)
        }
    }

    //buat cek pos gerak Kanan Bawah[FIX] + Paksa Makan
    if (!LT && !RT && !LB && !isRightEdge && !isBottomEdge && board.children[rightBottom].classList.contains('empty')) {//gerakan biasa
        if (chcAvaMove) {
            board.children[rightBottom].classList.add("valid-move")
            board.children[rightBottom].setAttribute('onclick', 'movePion(' + pos + ',' + rightBottom + ')')
        } else {
            board.children[pos].setAttribute('move', true)
        }
    }

    // if (chcAvaMove) {
    //     console.log("TOP : (" + LT + "," + RT + ")")
    //     console.log("BOTTOM: (" + LB + "," + RB + ")")
    // }
}

//untuk memakan pion player lain
function eatPion(from, eat, to) {
    let text = 'Eat Pion : (' + from + ') -> (' + eat + ') -> (' + to + ')'
    // console.log(text)

    //buat cetak gerakan
    let br = document.createElement('li');
    br.innerHTML = text
    if (PlayerTurn) {
        document.getElementById("colormove").append(br)
    } else {
        document.getElementById("whitemove").append(br)
    }
    scrollToEnd()

    console.log('\n')

    const leftTop = to - 1 - width
    const rightTop = to + 1 - width

    const leftBottom = to - 1 + width
    const rightBottom = to + 1 + width

    const isLeftEdge = (to % width === 0)
    const isRightEdge = (to % width === width - 1)
    const isTopEdge = (to < width && to >= 0)
    const isBottomEdge = (to < totalSize && to >= totalSize - width)

    //buat ngecek apakah kiri atas atau kanan atas adalah edge
    const leftTopIsEdge = (leftTop % width === 0)
    const rightTopIsEdge = (rightTop % width === width - 1)
    const leftTopIsTop = (leftTop < width && leftTop >= 0)
    const rightTopIsTop = (rightTop < width && rightTop >= 0)

    //buat ngecek apakah kiri bawah atau kanan bawah adalah edge
    const leftBottomIsEdge = (leftBottom % width === 0)
    const rightBottomIsEdge = (rightBottom % width === width - 1)
    const leftBottomIsBottom = (leftBottom >= totalSize - width && leftBottom < totalSize)
    const rightBottomIsBottom = (rightBottom >= totalSize - width && rightBottom < totalSize)

    const pionType = board.children[from].innerHTML

    const pionFrom = (board.children[from].classList.contains('color-pion')) ? "color-pion" : "white-pion";

    // board.children[from].innerHTML = ""
    board.children[from].innerHTML = board.children[from].getAttribute('id')
    board.children[from].classList.remove(pionFrom)
    board.children[from].classList.add("empty")

    const pionEat = (board.children[eat].classList.contains('white-pion')) ? "white-pion" : "color-pion";

    // board.children[eat].innerHTML = ""
    board.children[eat].innerHTML = board.children[eat].getAttribute('id')
    board.children[eat].classList.remove(pionEat)
    board.children[eat].classList.add("empty")

    board.children[to].classList.remove('empty')
    board.children[to].classList.add(pionFrom)

    if (board.children[from].classList.contains('king')) {
        board.children[from].classList.remove('king')
        board.children[to].classList.add('king')
    }

    if (board.children[eat].classList.contains('king')) {
        board.children[eat].classList.remove('king')
    }

    board.children[to].innerHTML = pionType;

    //buat ganti giliran main
    PlayerTurn = (PlayerTurn) ? false : true;

    //buat delay kalau double jump biar gak kelihatan ghost
    const jumpDelay = 350
    setTimeout(() => {
        if (board.children[to].classList.contains('color-pion')) {//double Jump Untuk Color Pion
            if (!isLeftEdge && !isTopEdge && !leftTopIsTop && !leftTopIsEdge && board.children[leftTop].classList.contains('white-pion') && board.children[leftTop - 1 - width].classList.contains('empty')) {
                PlayerTurn = true;
                eatPion(to, leftTop, leftTop - 1 - width)
            } else if (!isRightEdge && !isTopEdge && !rightTopIsTop && !rightTopIsEdge && board.children[rightTop].classList.contains('white-pion') && board.children[rightTop + 1 - width].classList.contains('empty')) {
                PlayerTurn = true;
                eatPion(to, rightTop, rightTop + 1 - width)
            }

            if (board.children[to].classList.contains('king')) {//double Jump Untuk Color Pion King
                if (!isLeftEdge && !isBottomEdge && !leftBottomIsBottom && !leftBottomIsEdge && board.children[leftBottom].classList.contains('white-pion') && board.children[leftBottom - 1 + width].classList.contains('empty')) {
                    PlayerTurn = true;
                    eatPion(to, leftBottom, leftBottom - 1 + width)
                } else if (!isRightEdge && !isBottomEdge && !rightBottomIsBottom && !rightBottomIsEdge && board.children[rightBottom].classList.contains('white-pion') && board.children[rightBottom + 1 + width].classList.contains('empty')) {
                    PlayerTurn = true;
                    eatPion(to, rightBottom, rightBottom + 1 + width)
                }
            }
        }

        if (board.children[to].classList.contains('white-pion')) {//double Jump Untuk White Pion
            if (!isLeftEdge && !isBottomEdge && !leftBottomIsBottom && !leftBottomIsEdge && board.children[leftBottom].classList.contains('color-pion') && board.children[leftBottom - 1 + width].classList.contains('empty')) {
                PlayerTurn = false;
                eatPion(to, leftBottom, leftBottom - 1 + width)
            } else if (!isRightEdge && !isBottomEdge && !rightBottomIsBottom && !rightBottomIsEdge && board.children[rightBottom].classList.contains('color-pion') && board.children[rightBottom + 1 + width].classList.contains('empty')) {
                PlayerTurn = false;
                eatPion(to, rightBottom, rightBottom + 1 + width)
            }
            if (board.children[to].classList.contains('king')) {//double Jump Untuk White Pion King
                if (!isLeftEdge && !isTopEdge && !leftTopIsTop && !leftTopIsEdge && board.children[leftTop].classList.contains('color-pion') && board.children[leftTop - 1 - width].classList.contains('empty')) {
                    PlayerTurn = false;
                    eatPion(to, leftTop, leftTop - 1 - width)
                } else if (!isRightEdge && !isTopEdge && !rightTopIsTop && !rightTopIsEdge && board.children[rightTop].classList.contains('color-pion') && board.children[rightTop + 1 - width].classList.contains('empty')) {
                    PlayerTurn = false;
                    eatPion(to, rightTop, rightTop + 1 - width)
                }
            }
        }
    }, jumpDelay)

    if (isTopEdge && !board.children[to].classList.contains('white-pion')) {
        board.children[to].innerHTML = '<img src="coin-o-king.svg">'
        board.children[to].classList.add('king')
    }

    if (isBottomEdge && !board.children[to].classList.contains('color-pion')) {
        board.children[to].innerHTML = '<img src="coin-w-king.svg">'
        board.children[to].classList.add('king')
    }

    removePionsEventListener()
    givePionsEventListener()
    clearClass()
    checkWins(board)
    checkPlayerCanMove()
    setTimeout(() => {
        if (!PlayerTurn) {
            AIMove()
        }
    }, 10)
}

//untuk memindahkan Pion
function movePion(from, to) {
    let text = 'Move Pion : (' + from + ') -> (' + to + ')'

    let br = document.createElement('li');
    br.innerHTML = text
    if (PlayerTurn) {
        document.getElementById("colormove").append(br)
    } else {
        document.getElementById("whitemove").append(br)
    }
    scrollToEnd()

    console.log('\n')

    const pionType = board.children[from].innerHTML

    board.children[from].innerHTML = board.children[from].getAttribute('id')

    if (PlayerTurn) { //pindahan Pion Color
        if (board.children[from].classList.contains('king')) {
            board.children[from].classList.remove("color-pion", "king")
            board.children[from].classList.add("empty")
            board.children[to].classList.remove('empty')
            board.children[to].classList.add('color-pion', 'king')
        } else {
            board.children[from].classList.remove("color-pion")
            board.children[from].classList.add("empty")
            board.children[to].classList.remove('empty')
            board.children[to].classList.add('color-pion')
        }
        board.children[to].innerHTML = pionType

        const isTopEdge = (to < width && to >= 0)
        if (isTopEdge) {//Untuk ubah Pion Color jadi KING
            board.children[to].innerHTML = '<img src="coin-o-king.svg">'
            board.children[to].classList.add('king')
        }
        PlayerTurn = false;
    } else { //pindahan Pion White
        if (board.children[from].classList.contains('king')) {
            board.children[from].classList.remove("white-pion", "king")
            board.children[from].classList.add("empty")
            board.children[to].classList.remove('empty')
            board.children[to].classList.add('white-pion', 'king')
        } else {
            board.children[from].classList.remove("white-pion")
            board.children[from].classList.add("empty")
            board.children[to].classList.remove('empty')
            board.children[to].classList.add('white-pion')
        }
        board.children[to].innerHTML = pionType

        const isBottomEdge = (to < totalSize && to >= totalSize - width)
        if (isBottomEdge) {//Untuk ubah Pion white jadi KING
            board.children[to].innerHTML = '<img src="coin-w-king.svg">'
            board.children[to].classList.add('king')
        }
        PlayerTurn = true;
    }

    removePionsEventListener()
    givePionsEventListener()
    clearClass()
    checkPlayerCanMove()
    setTimeout(() => {
        if (!PlayerTurn) {
            AIMove()
        }
    }, 10)
}

givePionsEventListener()

//buat show gerakan selalu menujukan gerakan yg terbaru
function scrollToEnd() {
    let list = null
    if (PlayerTurn) {
        list = document.getElementById("colormove");
    } else {
        list = document.getElementById("whitemove");
    }
    list.scrollTop = list.scrollHeight;
}