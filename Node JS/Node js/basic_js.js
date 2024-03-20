//Function and Object

const  person={
    name:"raja",
    age:"25",
    greet(){
        console.log('name'+this.name)   
     }

}

console.log(person.name);
person.greet();


//Array



//Example 1


var a=[1,2,3];
var b=[3,4,5];
var c=[...a,...b,6];

console.log(c);


// Example 2

const array=(...test)=>{
    return test;
}

console.log(array(1,2));


const arrays=(test1,test2)=>{
    return [test1,test2];
}

console.log(arrays(1,2));



//


// Destructuring



var a={name:"Raja",age:"25"}
var {name,age}=a;
console.log(name,age);


var ar=["aa","bb"];
var [a,b]=ar;
console.log(a,b);



const demo=(test)=>{
test('Done');
}


demo((abc)=>{
    console.log(abc)
})


// promise ---Async

var test_promise=new Promise((yes,no)=>{
   // yes();
    no();
})

test_promise.then(()=>{console.log("success");}).catch(()=>{console.log("fail")})


