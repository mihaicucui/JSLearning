let countDownP = document.createElement('p');
//countDownP.textContent = 'new';
countDownP.id = 'countDownP';

let mainDiv = document.createElement('div');
mainDiv.classList.add('main-div')



let body = document.getElementsByTagName('body')[0].appendChild(mainDiv);
mainDiv.appendChild(countDownP);



class ChessTable {

    fromSquare = null;
    toSquare = null;
    static initialState = [
        ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
        ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
        ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']];

    constructor(chessMatrix = null, gridDiv = null) {
        this.chessMatrix = [];
        for (let i = 0; i < 8; i++) {
            this.chessMatrix[i] = [];
            for (let j = 0; j < 8; j++) {
                this.chessMatrix[i][j] = null;
            }
        }
    }



    createTable() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.chessMatrix[i][j] = new Square(i, j);

                this.chessMatrix[i][j].elem.addEventListener('click', () => {
                    if (this.fromSquare == null) {
                        if (this.chessMatrix[i][j].piece != null) {
                            this.fromSquare = this.chessMatrix[i][j];
                            console.log(this.fromSquare + "s1");
                        }
                    }
                    else {
                        this.toSquare = this.chessMatrix[i][j];
                        console.log(this.fromSquare + "s2");
                        if (this.fromSquare.piece.legalMove(this.fromSquare.xCoord, this.fromSquare.yCoord,
                            this.toSquare.xCoord, this.toSquare.yCoord, this.chessMatrix)) {

                            if (this.toSquare.piece != null) {
                                console.log('entered to remove piece in battle');
                                console.log(this.toSquare.piece);
                                console.log(this.toSquare.removePiece());
                            }
                            this.toSquare.setPiece(this.fromSquare.removePiece());

                        }
                        this.toSquare.elem.blur();
                        this.fromSquare = null;
                        this.toSquare = null;

                    }
                }
                )
                //this.chessMatrix[i][j].elem.addEventListener('click', this.clickFunction.bind(this));
            }
        }
    }

    clickFunction(event){
        console.log(event.srcElement);
        return;
        if (this.fromSquare == null) {
            if (this.chessMatrix[i][j].piece != null) {
                this.fromSquare = this.chessMatrix[i][j];
                console.log(this.fromSquare + "s1");
            }
        }
        else {
            this.toSquare = this.chessMatrix[i][j];
            console.log(this.fromSquare + "s2");
            if (this.fromSquare.piece.legalMove(this.fromSquare.xCoord, this.fromSquare.yCoord,
                this.toSquare.xCoord, this.toSquare.yCoord, this.chessMatrix)) {

                if (this.toSquare.piece != null) {
                    console.log('entered to remove piece in battle');
                    console.log(this.toSquare.piece);
                    console.log(this.toSquare.removePiece());
                }
                this.toSquare.setPiece(this.fromSquare.removePiece());

            }
            this.toSquare.elem.blur();
            this.fromSquare = null;
            this.toSquare = null;

        }
    }
    



    addPieces() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let actualPiece = Piece.createPiece(ChessTable.initialState[i][j]);
                this.chessMatrix[i][j].setPiece(actualPiece);
            }
        }
    }

    drawTable(container) {
        if (container) {
            let gridDiv = document.createElement('div');
            gridDiv.id = "grid-div";
            gridDiv.classList.add('grid-div');
            container.appendChild(gridDiv);

            this.createTable();
            this.addPieces();

            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    gridDiv.appendChild(this.chessMatrix[i][j].elem);
                }
            }
        }
    }
}



class Timer {

    /**
     * 
     * @param {Number} seconds 
     * @param {Element} paragraph 
     * @param {Function} endCallback 
     */
    constructor(seconds = 3, paragraph = null, endCallback = null) {
        this.seconds = seconds;
        this.paragraph = paragraph;
        this.endCallback = endCallback;

    }


    getSeconds() {
        return this.seconds;
    }

    decrement() {
        this.seconds--;
        console.log(this.seconds);
    }
    start() {
        const countdown = setInterval(() => {
            if (this.getSeconds() === 0) {
                clearInterval(countdown);

                if (this.paragraph) {
                    this.paragraph.remove();
                }

                if (typeof this.endCallback === 'function') {
                    this.endCallback();
                }
            } else {
                this.paragraph.textContent = this.seconds;
                this.decrement();
            }
        }, 1000);
    }

}

class Square {
    constructor(xCoord = null, yCoord = null, elem = null, piece = null) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.piece = piece;

        this.elem = document.createElement('div');
        if ((xCoord + yCoord) % 2 == 0) {
            this.elem.classList.add('white-div');
        }
        else {
            this.elem.classList.add('black-div')
        }

        this.elem.tabIndex = "1";

    }

    setPiece(piece) {
        if (piece != null && piece != undefined) {
            this.piece = piece;
            this.elem.appendChild(piece.elem);
            console.log(piece.elem + " " + this.xCoord + " " + this.yCoord);
        }
    }

    removePiece() {
        if (this.elem.childNodes[0]) {
            let toRemove = this.elem.removeChild(this.elem.childNodes[0]);
            let valToRet = this.piece;
            this.piece = null;
            return valToRet;
        }
        else return null;
    }


}

class Piece {
    static firstWhiteMove = true;
    static firstBlackMove = true;
    constructor(elem = null, color = null) {
        this.color = color;
        this.elem = document.createElement('img');
        this.elem.style.marginTop = "10px";
        //this.elem.src = this.constructor.getImage();
        this.elem.src = this.constructor.name.toLowerCase() + color.toLowerCase() + ".png";
        console.log(this.elem.src);
    }
    legalMove(initialX, initialY, toX, toY, state) {
        return true;
    }

    static createPiece(description) {
        let actualPiece = null;
        switch (description) {
            case 'bR':
                actualPiece = new Tower('Black');
                break;
            case 'bN':
                actualPiece = new Horse('Black');
                break;
            case 'bB':
                actualPiece = new Bishop('Black');
                break;
            case 'bQ':
                actualPiece = new Queen('Black');
                break;
            case 'bK':
                actualPiece = new King('Black');
                break;
            case 'bP':
                actualPiece = new Pawn('Black');
                break;
            case 'wR':
                actualPiece = new Tower('White');
                break;
            case 'wN':
                actualPiece = new Horse('White');
                break;
            case 'wB':
                actualPiece = new Bishop('White');
                break;
            case 'wQ':
                actualPiece = new Queen('White');
                break;
            case 'wK':
                actualPiece = new King('White');
                break;
            case 'wP':
                actualPiece = new Pawn('White');
                break;
            default:
                actualPiece = null;
        }
        return actualPiece;
    }

}


class Bishop extends Piece {
    constructor(color = null) {
        super(null, color)
    }
}

class Tower extends Piece {
    constructor(color = null) {
        super(null, color)
    }

    legalMove(initialX, initialY, toX, toY, state) {
        if (initialX != toX && initialY != toY) {
            return false;
        }
        if (initialX == toX && initialY == toY) {
            return false;
        }
        if (state[toX][toY].piece != null && state[toX][toY].piece.color.toLowerCase() == state[initialX][initialY].piece.color.toLowerCase()) {
            return false;
        }
        if (initialX == toX && initialY < toY) {
            //pana la patratu in care vreau sa ajung sa nu fie nicio alta piesa
            for (let i = initialY + 1; i < toY; i++) {
                if (state[initialX][i].piece != null) {
                    return false;
                }
            }
        }
        if (initialX == toX && initialY > toY) {
            //pana la patratu in care vreau sa ajung sa nu fie nicio alta piesa
            for (let i = toY + 1; i < initialY; i++) {
                if (state[initialX][i].piece != null) {
                    return false;
                }
            }
        }
        if (initialY == toY && initialX < toX) {
            for (let i = initialX + 1; i < toX; i++) {
                if (state[i][initialY].piece != null) {
                    return false;
                }
            }
        }
        if (initialY == toY && initialX > toX) {
            for (let i = toX + 1; i < initialX; i++) {
                if (state[i][initialY].piece != null) {
                    return false;
                }
            }
        }

        return true;
    }

}

class Horse extends Piece {
    constructor(color = null) {
        super(null, color)
    }

}

class King extends Piece {
    constructor(color = null) {
        super(null, color)
    }

}

class Queen extends Piece {
    constructor(color = null) {
        super(null, color)
    }

}

class Pawn extends Piece {

    constructor(color = null) {
        super(null, color)
    }

    legalMove(initialX, initialY, toX, toY, state) {
        console.log(initialX + ' ' + initialY + ' ' + toX + ' ' + toY);
        if (this.color.toLowerCase() == 'white') {
            if (this.constructor.firstWhiteMove) {
                if (toX - initialX != -1 && toX - initialX != -2) {
                    return false;
                }
                if (toY != initialY) {
                    return false;
                }
            }
            else { //daca nu e prima mutare
                if (toX - initialX != -1) {
                    console.log('entered if1');
                    return false;
                }
                if (toY == initialY && state[toX][toY].piece != null) {
                    console.log('entered if2');
                    return false; //avem piesa in cazul de mers in fata
                }
                if ((toY == initialY + 1 || toY == initialY - 1) && state[toX][toY].piece == null) {
                    return false;
                }
                if (toY == initialY - 1 && state[toX][toY].piece.color.toLowerCase() != 'black') {
                    console.log('entered if3'); //avem piesa de aceeasi culoare pentru mers pe diag
                    return false;
                }
                if (toY == initialY + 1 && state[toX][toY].piece.color.toLowerCase() != 'black') {
                    console.log('entered if4'); //avem piesa de aceeasi culoare pentru mers pe diag
                    return false;
                }
            }


            this.constructor.firstWhiteMove = false;
            return true;
        }
        else { //black moves
            if (this.constructor.firstBlackMove) {
                if (toX - initialX != 1 && toX - initialX != 2) {
                    return false;
                }
                if (toY != initialY) {
                    return false;
                }
            }
            else {
                if (toX - initialX != 1) {
                    return false;
                }
                if (toY == initialY && state[toX][toY].piece != null) {
                    console.log('entered if2');
                    return false; //avem piesa in cazul de mers in fata
                }
                if ((toY == initialY + 1 || toY == initialY - 1) && state[toX][toY].piece == null) {
                    return false;
                }
                if (toY == initialY - 1 && state[toX][toY].piece.color.toLowerCase() != 'white') {
                    console.log('entered if3'); //avem piesa in cazul de mers
                    return false;
                }
                if (toY == initialY + 1 && state[toX][toY].piece.color.toLowerCase() != 'white') {
                    console.log('entered if4');
                    return false;
                }
            }

            if (toY != initialY - 1 && toY != initialY && toY != initialY + 1) {
                return false;
            }
            this.constructor.firstBlackMove = false;
            return true;
        }
    }
}

const chessTable = new ChessTable();

const countdown = new Timer(1, countDownP, () => {
    chessTable.drawTable(mainDiv)
})






