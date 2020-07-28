let countDownP = document.createElement('p');
countDownP.textContent = 'new';
countDownP.id = 'countDownP';

let mainDiv = document.createElement('div');
mainDiv.classList.add('main-div')

let seconds = 5;

let body = document.getElementsByTagName('body')[0].appendChild(mainDiv);
mainDiv.appendChild(countDownP);

// function Decrement() {
//     countDownP.textContent = seconds;
//     seconds--;
//     if (seconds >= 0) {
//         setTimeout('Decrement()', 1000);
//     }
//     else {
//         addChessTableToDiv(mainDiv);
//     }
// }

const countdown = new Timer(5, countDownP, () => {
    addChessTableToDiv(mainDiv);
})


class Timer {

    /**
     * 
     * @param {Number} seconds 
     * @param {Element} paragraph 
     * @param {Function} endCallback 
     */
    constructor(seconds = 5, paragraph = null, endCallback = null) {
        this.seconds = seconds;
        this.paragraph = this.paragraph;
        this.endCallback = endCallback;

    }

    
    getSeconds() {
        return this.seconds;
    }

    decrement() {
        this.seconds--;
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
                this.decrement();


            }
        }, 1000);
    }

}


function addChessTableToDiv(container) {

    let gridDiv = document.createElement('div');
    gridDiv.id = "grid-div";
    gridDiv.classList.add('grid-div');
    container.appendChild(gridDiv);

    countDownP.parentNode.removeChild(countDownP);
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let createdDiv = document.createElement('div');
            gridDiv.appendChild(createdDiv);
            if ((i + j) % 2 == 0) {
                createdDiv.classList.add('white-div')
            }
            else {
                createdDiv.classList.add('black-div')
            }
        }
    }
}




