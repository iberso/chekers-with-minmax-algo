const boardCloneDIV = document.querySelector(".boardClone")


function evaluate(boardState) {
    let eval = (countPions(boardState).whiteAmount + countPions(boardState).whiteKingAmount) - (countPions(boardState).colorAmount + countPions(boardState).colorKingAmount)
    return [eval];
}

function AIMove() {
    if (checkPionCanMove(board, false).length != 0) {
        let move = minimax(board, 3, -Infinity, Infinity, true)[1]

        console.log("Best Move from : " + move.from + " to : " + move.to)
        const Delay = 500
        setTimeout(() => {
            board.children[move.from].click()
            setTimeout(() => {
                board.children[move.to].click()
            }, 100)
        }, Delay)
    }
}

function AIcheckValidMove(selectedpion, cloneBoard, PT) {
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

    if (PT) {//Turn Player Pion Color
        if (selectedpion.classList.contains('king')) {//Gerakan Pion Raja Color
            let king = AIpionKingValidMove("white-pion", leftTop, rightTop, leftBottom, rightBottom, isLeftEdge, isRightEdge, isTopEdge, isBottomEdge, leftTopIsEdge, leftTopIsTop, rightTopIsEdge, rightTopIsTop, leftBottomIsEdge, leftBottomIsBottom, rightBottomIsEdge, rightBottomIsBottom)
            return { moves: king.moves, canMove: king.canMove, canEat: king.canEat }
        } else {//Gerakan Pion Color biasa
            let moves = []
            let canMove = false
            let canEat = false

            //buat cek pos Kiri Atas [FIX] + Paksa Makan
            if (!isLeftEdge && !isTopEdge && !leftTopIsTop && !leftTopIsEdge && cloneBoard.children[leftTop].classList.contains('white-pion') && cloneBoard.children[leftTop - 1 - width].classList.contains('empty')) {
                moves.push(leftTop - 1 - width)
                canMove = true
                canEat = true
            } else if (!isRightEdge && !isTopEdge && cloneBoard.children[rightTop].classList.contains('empty')) {//gerakan biasa
                moves.push(rightTop)
                canMove = true
            }

            //buat cek pos Kanan Atas [FIX] + Paksa Makan
            if (!isRightEdge && !isTopEdge && !rightTopIsTop && !rightTopIsEdge && cloneBoard.children[rightTop].classList.contains('white-pion') && cloneBoard.children[rightTop + 1 - width].classList.contains('empty')) {
                moves.push(rightTop + 1 - width)
                canMove = true
                canEat = true
            } else if (!isLeftEdge && !isTopEdge && cloneBoard.children[leftTop].classList.contains('empty')) {//gerakan biasa
                moves.push(leftTop)
                canMove = true
            }
            return { moves, canMove, canEat }
        }
    } else {//Turn Player Pion White
        if (selectedpion.classList.contains('king')) {//Gerakan Pion Raja Putih
            let king = AIpionKingValidMove("color-pion", leftTop, rightTop, leftBottom, rightBottom, isLeftEdge, isRightEdge, isTopEdge, isBottomEdge, leftTopIsEdge, leftTopIsTop, rightTopIsEdge, rightTopIsTop, leftBottomIsEdge, leftBottomIsBottom, rightBottomIsEdge, rightBottomIsBottom)
            return { moves: king.moves, canMove: king.canMove, canEat: king.canEat }
        } else {//Gerakan Pion White biasa
            let moves = []
            let canMove = false
            let canEat = false

            //buat cek pos Kiri bawah [FIX] + Paksa Makan
            if (!isLeftEdge && !isBottomEdge && !leftBottomIsBottom && !leftBottomIsEdge && cloneBoard.children[leftBottom].classList.contains('color-pion') && cloneBoard.children[leftBottom - 1 + width].classList.contains('empty')) {
                moves.push(leftBottom - 1 + width)
                canMove = true
                canEat = true
            } else if (!isRightEdge && !isBottomEdge && cloneBoard.children[rightBottom].classList.contains('empty')) {//gerakan biasa    
                moves.push(rightBottom)
                canMove = true
            }

            //buat cek pos Kanan bawah [FIX] + Paksa Makan
            if (!isRightEdge && !isBottomEdge && !rightBottomIsBottom && !rightBottomIsEdge && cloneBoard.children[rightBottom].classList.contains('color-pion') && cloneBoard.children[rightBottom + 1 + width].classList.contains('empty')) {
                moves.push(rightBottom + 1 + width)
                canMove = true
                canEat = true
            } else if (!isLeftEdge && !isBottomEdge && cloneBoard.children[leftBottom].classList.contains('empty')) {//gerakan biasa
                moves.push(leftBottom)
                canMove = true
            }
            return { moves, canMove, canEat }
        }
    }
}

function AIpionKingValidMove(pionType, leftTop, rightTop, leftBottom, rightBottom, isLeftEdge, isRightEdge, isTopEdge, isBottomEdge, leftTopIsEdge, leftTopIsTop, rightTopIsEdge, rightTopIsTop, leftBottomIsEdge, leftBottomIsBottom, rightBottomIsEdge, rightBottomIsBottom) {
    let LT = false
    let RT = false
    let LB = false
    let RB = false

    let moves = []
    let canMove = false
    let canEat = false

    //buat cek pos makan Kiri Atas [FIX] + Paksa Makan
    if (!isLeftEdge && !isTopEdge && !leftTopIsTop && !leftTopIsEdge && board.children[leftTop].classList.contains(pionType) && board.children[leftTop - 1 - width].classList.contains('empty')) {
        LT = true
        moves.push(leftTop - 1 - width)
        canMove = true
        canEat = true
    }

    //buat cek pos makan Kanan Atas [FIX] + Paksa Makan
    if (!isRightEdge && !isTopEdge && !rightTopIsTop && !rightTopIsEdge && board.children[rightTop].classList.contains(pionType) && board.children[rightTop + 1 - width].classList.contains('empty')) {
        RT = true
        moves.push(rightTop + 1 - width)
        canMove = true
        canEat = true
    }

    //buat cek pos makan Kiri bawah [FIX] + Paksa Makan
    if (!isLeftEdge && !isBottomEdge && !leftBottomIsBottom && !leftBottomIsEdge && board.children[leftBottom].classList.contains(pionType) && board.children[leftBottom - 1 + width].classList.contains('empty')) {
        LB = true
        moves.push(leftBottom - 1 + width)
        canMove = true
        canEat = true
    }

    // //buat cek pos makan Kanan bawah [FIX] + Paksa Makan
    if (!isRightEdge && !isBottomEdge && !rightBottomIsBottom && !rightBottomIsEdge && board.children[rightBottom].classList.contains(pionType) && board.children[rightBottom + 1 + width].classList.contains('empty')) {
        RB = true
        moves.push(rightBottom + 1 + width)
        canMove = true
        canEat = true
    }

    //buat cek pos gerak Kiri Atas [FIX] + Paksa Makan
    if (!RT && !LB && !RB && !isLeftEdge && !isTopEdge && board.children[leftTop].classList.contains('empty')) {//gerakan biasa
        moves.push(leftTop)
        canMove = true
    }

    //buat cek pos gerak Kanan Atas [FIX] + Paksa Makan
    if (!LT && !LB && !RB && !isRightEdge && !isTopEdge && board.children[rightTop].classList.contains('empty')) {//gerakan biasa
        moves.push(rightTop)
        canMove = true
    }

    //buat cek pos gerak Kiri Bawah [FIX] + Paksa Makan
    if (!LT && !RT && !RB && !isLeftEdge && !isBottomEdge && board.children[leftBottom].classList.contains('empty')) {//gerakan biasa
        moves.push(leftBottom)
        canMove = true
    }

    //buat cek pos gerak Kanan Bawah[FIX] + Paksa Makan
    if (!LT && !RT && !LB && !isRightEdge && !isBottomEdge && board.children[rightBottom].classList.contains('empty')) {//gerakan biasa
        moves.push(rightBottom)
        canMove = true
    }
    return { moves, canMove, canEat }
}

function AImovePion(from, to, cloneBoard, PT) {
    const pionType = cloneBoard.children[from].innerHTML
    cloneBoard.children[from].innerHTML = cloneBoard.children[from].getAttribute('id')
    console.log("Move = " + cloneBoard.children[from].getAttribute('id') + " -> " + to)

    if (PT) { //pindahan Pion Color
        if (cloneBoard.children[from].classList.contains('king')) {
            cloneBoard.children[from].classList.remove("color-pion", "king")
            cloneBoard.children[from].classList.add("empty")
            cloneBoard.children[to].classList.remove('empty')
            cloneBoard.children[to].classList.add('color-pion', 'king')
        } else {
            cloneBoard.children[from].classList.remove("color-pion")
            cloneBoard.children[from].classList.add("empty")
            cloneBoard.children[to].classList.remove('empty')
            cloneBoard.children[to].classList.add('color-pion')
        }
        cloneBoard.children[to].innerHTML = pionType

        const isTopEdge = (to < width && to >= 0)
        if (isTopEdge) {//Untuk ubah Pion Color jadi KING
            cloneBoard.children[to].innerHTML = '<img src="coin-o-king.svg">'
            cloneBoard.children[to].classList.add('king')
        }

    } else { //pindahan Pion White
        if (cloneBoard.children[from].classList.contains('king')) {
            cloneBoard.children[from].classList.remove("white-pion", "king")
            cloneBoard.children[from].classList.add("empty")
            cloneBoard.children[to].classList.remove('empty')
            cloneBoard.children[to].classList.add('white-pion', 'king')
        } else {
            cloneBoard.children[from].classList.remove("white-pion")
            cloneBoard.children[from].classList.add("empty")
            cloneBoard.children[to].classList.remove('empty')
            cloneBoard.children[to].classList.add('white-pion')
        }
        cloneBoard.children[to].innerHTML = pionType

        const isBottomEdge = (to < totalSize && to >= totalSize - width)
        if (isBottomEdge) {//Untuk ubah Pion white jadi KING
            cloneBoard.children[to].innerHTML = '<img src="coin-w-king.svg">'
            cloneBoard.children[to].classList.add('king')
        }
    }
    return cloneBoard
}

function AIeatPion(from, to, cloneBoard) {
    let eat = 0

    if (from + 1 + width === to - 1 - width) {
        eat = from + 1 + width
    }
    if (from - 1 + width === to + 1 - width) {
        eat = from - 1 + width
    }
    if (from + 1 - width === to - 1 + width) {
        eat = from + 1 - width
    }
    if (from - 1 - width === to + 1 + width) {
        eat = from - 1 - width
    }

    console.log("Eat Pion : from(" + from + ") -> eat(" + eat + ") -> to(" + to + ")")

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

    const pionType = cloneBoard.children[from].innerHTML
    const pionFrom = (cloneBoard.children[from].classList.contains('color-pion')) ? "color-pion" : "white-pion";

    // board.children[from].innerHTML = ""
    cloneBoard.children[from].innerHTML = cloneBoard.children[from].getAttribute('id')
    cloneBoard.children[from].classList.remove(pionFrom)
    cloneBoard.children[from].classList.add("empty")

    const pionEat = (cloneBoard.children[eat].classList.contains('white-pion')) ? "white-pion" : "color-pion";

    // board.children[eat].innerHTML = ""
    cloneBoard.children[eat].innerHTML = cloneBoard.children[eat].getAttribute('id')
    cloneBoard.children[eat].classList.remove(pionEat)
    cloneBoard.children[eat].classList.add("empty")

    cloneBoard.children[to].classList.remove('empty')
    cloneBoard.children[to].classList.add(pionFrom)

    if (cloneBoard.children[from].classList.contains('king')) {
        cloneBoard.children[from].classList.remove('king')
        cloneBoard.children[to].classList.add('king')
    }

    if (cloneBoard.children[eat].classList.contains('king')) {
        cloneBoard.children[eat].classList.remove('king')
    }

    cloneBoard.children[to].innerHTML = pionType;

    if (cloneBoard.children[to].classList.contains('color-pion')) {//double Jump Untuk Color Pion
        if (!isLeftEdge && !isTopEdge && !leftTopIsTop && !leftTopIsEdge && cloneBoard.children[leftTop].classList.contains('white-pion') && cloneBoard.children[leftTop - 1 - width].classList.contains('empty')) {
            AIeatPion(to, leftTop - 1 - width, cloneBoard)
        } else if (!isRightEdge && !isTopEdge && !rightTopIsTop && !rightTopIsEdge && cloneBoard.children[rightTop].classList.contains('white-pion') && cloneBoard.children[rightTop + 1 - width].classList.contains('empty')) {
            AIeatPion(to, rightTop + 1 - width, cloneBoard)
        }

        if (board.children[to].classList.contains('king')) {//double Jump Untuk Color Pion King
            if (!isLeftEdge && !isBottomEdge && !leftBottomIsBottom && !leftBottomIsEdge && cloneBoard.children[leftBottom].classList.contains('white-pion') && cloneBoard.children[leftBottom - 1 + width].classList.contains('empty')) {
                AIeatPion(to, leftBottom - 1 + width, cloneBoard)
            } else if (!isRightEdge && !isBottomEdge && !rightBottomIsBottom && !rightBottomIsEdge && cloneBoard.children[rightBottom].classList.contains('white-pion') && cloneBoard.children[rightBottom + 1 + width].classList.contains('empty')) {
                AIeatPion(to, rightBottom + 1 + width, cloneBoard)
            }
        }
    }

    if (cloneBoard.children[to].classList.contains('white-pion')) {//double Jump Untuk White Pion
        if (!isLeftEdge && !isBottomEdge && !leftBottomIsBottom && !leftBottomIsEdge && cloneBoard.children[leftBottom].classList.contains('color-pion') && cloneBoard.children[leftBottom - 1 + width].classList.contains('empty')) {
            AIeatPion(to, leftBottom - 1 + width, cloneBoard)
        } else if (!isRightEdge && !isBottomEdge && !rightBottomIsBottom && !rightBottomIsEdge && cloneBoard.children[rightBottom].classList.contains('color-pion') && cloneBoard.children[rightBottom + 1 + width].classList.contains('empty')) {
            AIeatPion(to, rightBottom + 1 + width, cloneBoard)
        }
        if (cloneBoard.children[to].classList.contains('king')) {//double Jump Untuk White Pion King
            if (!isLeftEdge && !isTopEdge && !leftTopIsTop && !leftTopIsEdge && cloneBoard.children[leftTop].classList.contains('color-pion') && cloneBoard.children[leftTop - 1 - width].classList.contains('empty')) {
                AIeatPion(to, leftTop - 1 - width, cloneBoard)
            } else if (!isRightEdge && !isTopEdge && !rightTopIsTop && !rightTopIsEdge && cloneBoard.children[rightTop].classList.contains('color-pion') && cloneBoard.children[rightTop + 1 - width].classList.contains('empty')) {
                AIeatPion(to, rightTop + 1 - width, cloneBoard)
            }
        }
    }

    //const TopEdge = (to < width && to >= 0) //untuk mengubah color pion menjadi king
    if (isTopEdge && !cloneBoard.children[to].classList.contains('white-pion')) {
        cloneBoard.children[to].innerHTML = '<img src="coin-o-king.svg">'
        cloneBoard.children[to].classList.add('king')
    }

    //const BottomEdge = (to < totalSize && to >= totalSize - width)//untuk mengubah white pion menjadi king
    if (isBottomEdge && !cloneBoard.children[to].classList.contains('color-pion')) {
        cloneBoard.children[to].innerHTML = '<img src="coin-w-king.svg">'
        cloneBoard.children[to].classList.add('king')
    }
    return cloneBoard
}

function minimax(boardState, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || checkPionCanMove(boardState, false).length === 0) {
        return evaluate(boardState)
    }

    if (maximizingPlayer) {//MAX PLAYER
        let maxEval = -Infinity
        let bestMove = null

        let cloneBoard = boardState.cloneNode(true);
        let pionCanMove = checkPionCanMove(cloneBoard, false)

        console.log("White Pion Can Move : " + pionCanMove)
        console.log('\n')

        for (let i = 0; i < pionCanMove.length; i++) {
            let pionMoves = AIcheckValidMove(cloneBoard.children[pionCanMove[i]], cloneBoard, false).moves
            console.log("White " + pionCanMove[i] + " Can Moves To -> " + pionMoves)

            let tempBoard = cloneBoard.cloneNode(true);

            for (let j = 0; j < pionMoves.length; j++) {
                let canEat = AIcheckValidMove(cloneBoard.children[pionCanMove[i]], cloneBoard, false).canEat
                if (!canEat) {
                    cloneBoard = AImovePion(pionCanMove[i], pionMoves[j], cloneBoard, false)
                } else {
                    cloneBoard = AIeatPion(parseInt(pionCanMove[i]), pionMoves[j], cloneBoard)
                }
                let eval = minimax(cloneBoard, depth - 1, alpha, beta, false)[0]

                if (eval > maxEval) {
                    maxEval = eval
                    bestMove = { from: pionCanMove[i], to: pionMoves[j] }
                }
                alpha = Math.max(alpha, eval)
                cloneBoard = tempBoard

                if (alpha >= beta) { break; }
            }
        }
        return [maxEval, bestMove]
    } else {
        let minEval = Infinity
        let bestMove = null

        let cloneBoard = boardState.cloneNode(true);
        let pionCanMove = checkPionCanMove(cloneBoard, true)

        console.log("Color Pion Can Move : " + pionCanMove)
        console.log('\n')
        for (let i = 0; i < pionCanMove.length; i++) {
            let pionMoves = AIcheckValidMove(cloneBoard.children[pionCanMove[i]], cloneBoard, true).moves
            console.log("Color " + pionCanMove[i] + " Can Moves To -> " + pionMoves)

            let tempBoard = cloneBoard.cloneNode(true);

            for (let j = 0; j < pionMoves.length; j++) {
                let canEat = AIcheckValidMove(cloneBoard.children[pionCanMove[i]], cloneBoard, true).canEat
                if (!canEat) {
                    cloneBoard = AImovePion(pionCanMove[i], pionMoves[j], cloneBoard, true)
                } else {
                    cloneBoard = AIeatPion(parseInt(pionCanMove[i]), pionMoves[j], cloneBoard)
                }
                let eval = minimax(cloneBoard, depth - 1, alpha, beta, true)[0]
                if (eval < minEval) {
                    minEval = eval
                    bestMove = { from: pionCanMove[i], to: pionMoves[j] }
                }
                beta = Math.min(beta, eval)

                cloneBoard = tempBoard

                if (alpha >= beta) { break; }
            }
        }
        return [minEval, bestMove]
    }
}

//buat cek suatu pion itu bisa gerak atau tidak
function checkPionCanMove(BC, player) {
    let canMove = []
    if (player) {
        for (let i = 0; i < totalSize; i++) {
            if (BC.children[i].classList.contains('color-pion')) {
                if (AIcheckValidMove(BC.children[i], BC, true).canMove) {
                    canMove.push(BC.children[i].getAttribute('id'))
                }
            }
        }
    } else {
        for (let i = 0; i < totalSize; i++) {
            if (BC.children[i].classList.contains('white-pion')) {
                if (AIcheckValidMove(BC.children[i], BC, false).canMove) {
                    canMove.push(BC.children[i].getAttribute('id'))
                    if (BC.children[i].classList.contains('king') && BC.children[i].classList.contains('white-pion')) {
                        canMove = canMove.filter(item => item !== BC.children[i].getAttribute('id'));
                        canMove.unshift(BC.children[i].getAttribute('id'));
                    }
                }
            }
        }
    }
    return canMove
}