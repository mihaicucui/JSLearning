function productSign(a, b, c){
    if(a*b*c < 0 )
        return 'Minus'
    else
        return 'Plus';
}

let x = productSign(2,3,-5);
console.log(x);


// 1.b

function box(nr){
    switch(nr){
        case 10:
            console.log('pen');
            break;
        case 200:
            console.log('cat');
            break;
        case 3000:
            console.log('dog');
            break;
        case 40000:
            cconsole.log('horse');
            break;
        case 5000000:
            console.log('car');
        default:
            console.log('truckload of bunnies');
    }
}

//2.a

function sumN(n){
    let sum=0;
    for(let i=1; i<=n; i++){
        sum+=i;
    }
    return sum;
}

//2.b

function mult(n){
    while(n<10000){
        console.log(n);
        n=n*Math.random()*10;
    }
}

//3.a

let arr=[];
for(let i=0;i<50;i++){
    arr.push(i);
}
arr.push(89,99,120,412,124);
console.log(arr[52]);

//3.b

arr.pop();
console.log(arr);

//4.a
let person = {age:22, firstName:'Mihai', lastName:'Cucui'};


//5.b

for(let i=0; i<arr.length;i++){
    if(arr[i]%3!=0){
        console.log(arr[i]);
    }
}

class Human{
    #fullName;

    getFullName(){
        return this.#fullName;
    }

    setFullName(fullN){
        this.#fullName=fullN;
    }

    helloIm(){
        return 'I am ' + this.#fullName;
    }
}
