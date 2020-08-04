let $countDownP = $('<p></p>');
$countDownP.attr('id', 'countDownP');

let $mainDiv = $('<div></div>');
$mainDiv.addClass('main-div');


$('body').append($mainDiv);
//let body = document.getElementsByTagName('body')[0].appendChild(mainDiv);
//mainDiv.appendChild($countDownP);
$mainDiv.append($countDownP);


class ChessTable {

    fromSquare = null;
    toSquare = null;
    turn = 'white';
    static initialState = [
        ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
        ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
        ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']];

    constructor(chessMatrix = null, gridDiv = null, turn = 'white') {
        this.chessMatrix = [];
        for (let i = 0; i < 8; i++) {
            this.chessMatrix[i] = [];
            for (let j = 0; j < 8; j++) {
                this.chessMatrix[i][j] = null;
            }
        }
        this.turn = turn;
    }



    createTable() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.chessMatrix[i][j] = new Square(i, j);

                //this.chessMatrix[i][j].$elem.addEventListener('click', () => {
                this.chessMatrix[i][j].$elem.click(() => {
                    if (this.fromSquare == null) {
                        if (this.chessMatrix[i][j].piece != null) {
                            if (this.chessMatrix[i][j].piece.color.toLowerCase() == this.turn) {
                                this.fromSquare = this.chessMatrix[i][j];
                                console.log(this.fromSquare + "s1");
                            }
                        }
                    }
                    else {
                        if (this.chessMatrix[i][j].piece != null && this.fromSquare.piece.color==this.chessMatrix[i][j].piece.color){
                            this.fromSquare=this.chessMatrix[i][j];
                        }
                        else {
                            this.toSquare = this.chessMatrix[i][j];
                            console.log(this.fromSquare + "s2");
                            if (this.fromSquare.piece.legalMove(this.fromSquare.xCoord, this.fromSquare.yCoord,
                                this.toSquare.xCoord, this.toSquare.yCoord, this.chessMatrix)) {

                                if (this.toSquare.piece != null) {
                                    console.log('entered to remove piece in battle');
                                    console.log(this.toSquare.piece);
                                    //console.log(this.toSquare.removePiece());
                                }
                                this.toSquare.setPiece(this.fromSquare.piece);
                                this.fromSquare.piece = null;
                                if (this.turn == 'white') {
                                    this.turn = 'black';
                                }
                                else {
                                    this.turn = 'white';
                                }
                            }
                            this.toSquare.$elem.blur();
                            this.fromSquare = null;
                            this.toSquare = null;
                        }

                    }
                }
                )
                //this.chessMatrix[i][j].elem.addEventListener('click', this.clickFunction.bind(this));
            }
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

    drawTable($container) {
        if ($container) {
            let $gridDiv = $('<div></div>');
            $gridDiv.attr('id', 'grid-div');
            $gridDiv.addClass('grid-div');
            $container.append($gridDiv);

            
            this.createTable();
            this.addPieces();

            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    $gridDiv.append(this.chessMatrix[i][j].$elem);
                    //gridDiv.appendChild(this.chessMatrix[i][j].elem);
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
    constructor(xCoord = null, yCoord = null, $elem = null, piece = null) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.piece = piece;

        //this.$elem = document.createElement('div');
        this.$elem = $('<div></div>');
        if ((xCoord + yCoord) % 2 == 0) {
            //this.$elem.classList.add('white-div');
            this.$elem.addClass('white-div');
        }
        else {
            //this.$elem.classList.add('black-div')
            this.$elem.addClass('black-div');
        }

        //this.$elem.tabIndex = "1";
        this.$elem.attr('tabindex', 1);
        
    }

    setPiece(piece = null) {
        this.piece = piece;
        if (this.$elem !== null && piece !== null) {
            this.$elem.html(piece.$elem);
        }
    }





}

class Piece {

    constructor($elem = null, color = null) {
        this.color = color;
        // this.$elem = document.createElement('img');
        // this.$elem.style.marginTop = "10px";
        // //this.elem.src = this.constructor.getImage();
        // this.$elem.src = this.constructor.name.toLowerCase() + color.toLowerCase() + ".png";
        //console.log(this.$elem.src);

        this.$elem = $('<img>'); //Equivalent: $(document.createElement('img'))
        this.$elem.attr('src', this.constructor.name.toLowerCase() + color.toLowerCase() + ".png");
        this.$elem.css('margin-top','10px');
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

    //     x2 – x1 = y2 – y1
    // -x2 + x1 = y2 – y1

    legalMove(initialX, initialY, toX, toY, state) {
        return this.constructor.bishopLegalMove(initialX, initialY, toX, toY, state);
    }

    static bishopLegalMove(initialX, initialY, toX, toY, state) {
        if (initialX == toX && initialY == toY) {
            return false;
        }
        if (-toX + initialX == toY - initialY) {
            if (initialX > toX) {
                for (let i = initialX - 1, j = initialY + 1; i > toX; i--, j++) { //mergem pe diagonala
                    if (state[i][j].piece != null) {
                        return false;
                    }
                }
            }
            else {

                for (let i = toX - 1, j = toY + 1; i > initialX; i--, j++) {
                    if (state[i][j].piece != null) {
                        return false;
                    }
                }

            }
            if (state[toX][toY].piece != null) {
                if (state[initialX][initialY].piece.color == state[toX][toY].piece.color) {
                    return false;
                }
            }
            return true;
        }
        if (toX - initialX == toY - initialY) {
            if (initialX > toX) {
                for (let i = initialX - 1, j = initialY - 1; i > toX; i--, j--) {
                    if (state[i][j].piece != null) {
                        return false;
                    }
                }
            }
            else {
                for (let i = toX - 1, j = toY - 1; i > toX; i--, j--) {
                    if (state[i][j].piece != null) {
                        return false;
                    }
                }
            }
            if (state[toX][toY].piece != null) {
                if (state[initialX][initialY].piece.color == state[toX][toY].piece.color) {
                    return false;
                }
            }
            return true;
        }
        else {
            return false;
        }
    }
}

class Tower extends Piece {
    constructor(color = null) {
        super(null, color)
    }

    legalMove(initialX, initialY, toX, toY, state) {
        return this.constructor.towerLegalMove(initialX, initialY, toX, toY, state)

    }

    static towerLegalMove(initialX, initialY, toX, toY, state) {
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
    legalMove(initialX, initialY, toX, toY, state) {
        if ((Math.abs(initialY - toY) == 1 && Math.abs(initialX - toX) == 2) || (Math.abs(initialY - toY) == 2 && Math.abs(initialX - toX) == 1)) {
            if (state[toX][toY].piece != null) {
                if (state[toX][toY].piece.color != state[initialX][initialY].piece.color) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
}

class King extends Piece {
    constructor(color = null) {
        super(null, color)
    }

    legalMove(initialX, initialY, toX, toY, state) {
        if ((initialX == toX && Math.abs(toY - initialY) == 1) || (initialY == toY && Math.abs(toX - initialX) == 1)) {
            if (state[toX][toY].piece == null) {
                return true;
            }
            else {
                return false;
            }
        }
        if (Math.abs(toX - initialX) == 1 && Math.abs(toY - initialY) == 1) {
            if (state[toX][toY].piece != null) {
                if (state[toX][toY].piece.color != state[initialX][initialY].piece.color) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
    }

}

class Queen extends Piece {
    constructor(color = null) {
        super(null, color)
    }

    legalMove(initialX, initialY, toX, toY, state) {
        return Bishop.bishopLegalMove(initialX, initialY, toX, toY, state) || Tower.towerLegalMove(initialX, initialY, toX, toY, state);

    }



}

class Pawn extends Piece {

    firstWhiteMove;
    firstBlackMove;

    constructor(color = null, firstWhiteMove = true, firstBlackMove = true) {
        super(null, color);
        this.firstBlackMove = true;
        this.firstWhiteMove = true;
    }

    legalMove(initialX, initialY, toX, toY, state) {
        console.log(initialX + ' ' + initialY + ' ' + toX + ' ' + toY);
        if (this.color.toLowerCase() == 'white') {
            if (this.firstWhiteMove) {
                if (toX - initialX != -1 && toX - initialX != -2) {
                    return false;
                }
                if (toY != initialY && state[toX][toY].piece==null ) {
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


            this.firstWhiteMove = false;
            return true;
        }
        else { //black moves
            if (this.firstBlackMove) {
                if (toX - initialX != 1 && toX - initialX != 2) {
                    return false;
                }
                if (toY != initialY && state[toX][toY].piece==null) {
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
            this.firstBlackMove = false;
            return true;
        }
    }
}

const chessTable = new ChessTable();

const countdown = new Timer(1, $countDownP, () => {
    chessTable.drawTable($mainDiv)
})






