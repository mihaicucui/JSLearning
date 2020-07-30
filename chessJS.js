let countDownP = document.createElement('p');
//countDownP.textContent = 'new';
countDownP.id = 'countDownP';

let mainDiv = document.createElement('div');
mainDiv.classList.add('main-div')



let body = document.getElementsByTagName('body')[0].appendChild(mainDiv);
mainDiv.appendChild(countDownP);



class ChessTable {
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
                this.chessMatrix[i][j].elem.addEventListener('click', ()=> {
                    console.log(this.chessMatrix[i][j].removePiece());
                })
            }
        }


    }

    

    addPieces() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let actualPiece = null;
                switch (ChessTable.initialState[i][j]) {
                    case 'bR':
                        actualPiece = new BlackTower();
                        break;
                    case 'bN':
                        actualPiece=new BlackHorse();
                        break;
                    case 'bB':
                        actualPiece=new BlackBishop();
                        break;
                    case 'bQ':
                        actualPiece=new BlackQueen();
                        break;
                    case 'bK':
                        actualPiece=new BlackKing();
                        break;
                    case 'bP':
                        actualPiece=new BlackPawn();
                        break;
                    case 'wR':
                        actualPiece=new WhiteTower();
                        break;
                    case 'wN':
                        actualPiece=new WhiteHorse();
                        break;
                    case 'wB':
                        actualPiece=new WhiteBishop();
                        break;
                    case 'wQ':
                        actualPiece=new WhiteQueen();
                        break;
                    case 'wK':
                        actualPiece=new WhiteKing();
                        break;
                    case 'wP':
                        actualPiece=new WhitePawn();
                        break;
                }
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

        this.elem.tabIndex="1";
        
        

    }

    setPiece(piece) {
        if (piece != null && piece != undefined) {
            this.piece = piece;
            this.elem.appendChild(piece.elem);
            console.log(piece.elem + " " + this.xCoord + " " + this.yCoord);
        }
    }

    removePiece(){
        if(this.elem.childNodes[0]){
            let toRemove = this.elem.removeChild(this.elem.childNodes[0]);
        return toRemove;
        }
        else return null;
    }


}

class Piece {
    constructor(elem = null) {
        this.elem = document.createElement('img');
        this.elem.style.marginTop = "10px";
        this.elem.src = this.constructor.getImage();
    }

}


class WhiteBishop extends Piece {
    static getImage() {
        return 'bsWhite.png';
    }

    canMove(){

    }
}

class BlackBishop extends Piece {
    static getImage() {
        return 'bsBlack.png';
    }
}

class WhiteTower extends Piece {
    static getImage() {
        return 'towerWhite.png';
    }
}

class BlackTower extends Piece {
    static getImage() {
        return 'towerBlack.png';
    }
}

class WhiteHorse extends Piece {
    static getImage() {
        return 'horseWhite.png';
    }
}

class BlackHorse extends Piece {
    static getImage() {
        return 'horseBlack.png';
    }
}

class WhiteKing extends Piece {
    static getImage() {
        return 'kWhite.png';
    }
}

class BlackKing extends Piece {
    static getImage() {
        return 'kBlack.png';
    }
}

class WhiteQueen extends Piece {
    static getImage() {
        return 'queenWhite.png';
    }
}

class BlackQueen extends Piece {
    static getImage() {
        return 'queenBlack.png';
    }
}

class WhitePawn extends Piece {
    static getImage() {
        return 'pawnWhite.png';
    }
}

class BlackPawn extends Piece {
    static getImage() {
        return 'pawnBlack.png';
    }
}

const chessTable = new ChessTable();

const countdown = new Timer(1, countDownP, () => {
    chessTable.drawTable(mainDiv)
})






