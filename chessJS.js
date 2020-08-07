let $countDownP = $('<p></p>');
$countDownP.attr('id', 'countDownP');

let $mainDiv = $('<div></div>');
$mainDiv.addClass('main-div');

$('#row').append($mainDiv);



let dragging = false;


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

    constructor(gameID = null, chessMatrix = null, gridDiv = null, turn = 'white') {
        this.chessMatrix = [];
        for (let i = 0; i < 8; i++) {
            this.chessMatrix[i] = [];
            for (let j = 0; j < 8; j++) {
                this.chessMatrix[i][j] = null;
            }
        }
        this.turn = turn;
        this.gameID = gameID;
    }


    startDragHandler(event) {
        dragging = true;
        console.log(event.target);
        let i = $(event.target).attr('data-i');
        let j = $(event.target).attr('data-j');
        this.fromSquare = this.chessMatrix[i][j];
    }

    dropHandler(event) {
        let i = $(event.target).attr('data-i');
        let j = $(event.target).attr('data-j');
        this.toSquare = this.chessMatrix[i][j];

        if (this.fromSquare.piece.legalMove(this.fromSquare.xCoord, this.fromSquare.yCoord,
            this.toSquare.xCoord, this.toSquare.yCoord, this.chessMatrix)) {
            console.log('verify piece at' + this.toSquare.xCoord + ' ' + this.toSquare.yCoord)

            $(this.fromSquare.piece.$elem).attr('data-i', this.toSquare.xCoord);
            $(this.fromSquare.piece.$elem).attr('data-j', this.toSquare.yCoord);


            this.toSquare.setPiece(this.fromSquare.piece);
            this.fromSquare.piece = null;

            this.sendAMove(this.fromSquare.xCoord, this.fromSquare.yCoord, this.toSquare.xCoord, this.toSquare.yCoord);
            console.log('movesent' + this.fromSquare.xCoord + ' ' + this.fromSquare.yCoord + ' ' + this.toSquare.xCoord + ' ' + this.toSquare.yCoord)

        }

        this.toSquare.$elem.blur();
        this.fromSquare = null;
        this.toSquare = null;
        dragging = false;

    }


    createTable() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.chessMatrix[i][j] = new Square(i, j);

                this.chessMatrix[i][j].$elem.on('dragstart', (event) => {
                    this.startDragHandler(event);
                })

                this.chessMatrix[i][j].$elem.on('drop', (event) => {
                    this.dropHandler(event);
                })

                


            }
        }
    }



    addPieces() {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let actualPiece = Piece.createPiece(ChessTable.initialState[i][j]);
                this.chessMatrix[i][j].setPiece(actualPiece);

                if (actualPiece != null) {
                    if (i < 2) {
                        actualPiece.$elem.addClass('black-piece')
                    }
                    else {
                        actualPiece.$elem.addClass('white-piece');
                    }
                }
            }
        }
        console.log(this.whitePieces);
    }


    drawTable($container) {
        if ($container) {
            let $gridDiv = $('<div></div>').attr('id', 'grid-div').addClass('grid-div');
            $container.append($gridDiv);


            this.createTable();
            this.addPieces();

            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    $gridDiv.append(this.chessMatrix[i][j].$elem);

                }
            }
        }
    }

    sendAMove(fromX, fromY, toX, toY, color = null, type = null, next = null) {
        console.log('id game:' + this.gameID)
        $.ajax({
            method: 'POST',
            url: 'https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/' + this.gameID,
            data: {
                move: { from: { x: fromX, y: fromY }, to: { x: toX, y: toY } }
            }
        }).done(function (data) {

        })
    }

    moveAPiece(fromX, fromY, toX, toY) {
        console.log("MOVED FROM" + fromX + fromY + toX + toY);
        let fromSquare = this.chessMatrix[fromX][fromY];
        if (fromSquare.piece) {
            let actualPiece = fromSquare.piece;
            let toSquare = this.chessMatrix[toX][toY];
            toSquare.setPiece(actualPiece);
            fromSquare.piece = null;
        }
    }


}


class Game {
    constructor(gameID = null, timer = null) {
        this.chessTable = new ChessTable(gameID);
        this.gameID = gameID;
        this.gameMoves = [];
    }

    createAGame(gameName) {
        $.ajax({
            method: 'POST',
            url: "https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game",
            data: {
                name: gameName
            }

        }).done((data) => {
            this.gameID = data.ID;
            this.resetAGame(this.gameID);
            this.getAGameMoves(data.ID);
        })
    }

    resetAGame(gameID) {
        $.ajax({
            method: 'POST',
            url: "https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/" + this.gameID,
            data: {
                reset: 1
            }

        }).done(() => {

        }).always(() => {
            console.log('entered to reset' + this.gameID);
            this.chessTable = new ChessTable(this.gameID);
            $('#grid-div').remove();
            this.chessTable.drawTable($mainDiv);
            this.gameMoves = [];
        })
    }


    getAGameMoves(gameID) {
        console.log($.ajax({
            method: 'GET',
            url: "https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/" + gameID,
            data: {

            }
        }).done((data) => {


            // for(let i=0;i<data.moves.length; i++){
            //     this.chessTable.moveAPiece(data.moves[i].from.x, data.moves[i].from.y, data.moves[i].to.x, data.moves[i].to.y);
            // }
            $("#gamePId").text('In game: ' + gameID)
            let whites = $(".white-piece");
            let blacks = $(".black-piece");
            if (data.moves.length % 2 == 0) {
                blacks.draggable("option", "disabled", true);
                whites.draggable("enable");
            }
            else {
                whites.draggable("option", "disabled", true);
                blacks.draggable("enable");
            }
            if (dragging == false) {
                if (data.moves.length > this.gameMoves.length) {
                    console.log('MOVES COMPARISON' + data.moves.length + ' ' + this.gameMoves.length)
                    let newLength = data.moves.length;
                    let oldLength = this.gameMoves.length;

                    for (let i = oldLength; i < newLength; i++) {
                        let fromX = data.moves[i].from.x;
                        let fromY = data.moves[i].from.y;
                        let toX = data.moves[i].to.x;
                        let toY = data.moves[i].to.y;

                        this.chessTable.moveAPiece(fromX, fromY, toX, toY);
                        this.gameMoves.push({ from: { x: fromX, y: fromY }, to: { x: toX, y: toY } })
                    }
                }
            }
        }))
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
        console.log('here')
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
                if (this.paragraph != null)
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
        this.$elem.attr('data-i', xCoord);
        this.$elem.attr('data-j', yCoord);
        this.$elem.droppable({
            accept: '#draggable'
        });

    }

    setPiece(piece = null) {
        this.piece = piece;
        if (this.$elem !== null && piece !== null) {
            this.$elem.html(piece.$elem);
        }
        if (this.piece != null) {
            this.piece.$elem.attr('data-i', this.xCoord);
            this.piece.$elem.attr('data-j', this.yCoord);
        }
    }





}

class Piece {

    constructor($elem = null, color = null) {
        this.color = color;
        this.$elem = $('<img>').attr('id', 'draggable'); //Equivalent: $(document.createElement('img'))
        this.$elem.attr('src', this.constructor.name.toLowerCase() + color.toLowerCase() + ".png");
        this.$elem.css('margin-top', '10px');
        this.$elem.draggable({
            revert: true,
            revertDuration: 0.1
        })



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
        console.log('entered in queen if');
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
                if (toY != initialY && state[toX][toY].piece == null) {
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
                if (toY != initialY && state[toX][toY].piece == null) {
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


const game = new Game(157);

//game.chessTable.sendAMove(1,1,2,1);


// const countdown = new Timer(0, $countDownP, () => {
//     game.chessTable.drawTable($mainDiv);
// })
game.chessTable.drawTable($mainDiv);



setInterval(function () {
    game.getAGameMoves(game.gameID);
    console.log(game.gameID);
}, 1000);

const $resetGame = $('<input type="button" value="Reset game" />');
$resetGame.appendTo("#buttons-div");
$resetGame.css('margin-left', '50px');
$resetGame.addClass('button')
$resetGame.click(() => {
    console.log('clicked reset' + game.gameID);

    game.resetAGame(game.gameID);
    // game.chessTable = new ChessTable(game.gameID);
    // $('#grid-div').remove();
    // game.chessTable.drawTable($mainDiv);
});

const $createGame = $('#createGame');
$createGame.click(() => {
    game.createAGame('random');
})

const $input1 = $('#input1');
const $getAGame = $('#getAGame');
$getAGame.click(() => {
    game.gameID = $input1.val();
    game.chessTable = new ChessTable(game.gameID);
    $('#grid-div').remove();
    game.chessTable.drawTable($mainDiv);
    game.gameMoves = [];
})









