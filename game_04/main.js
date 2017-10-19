var backPicture="back.jpg";
var buttonSubmit=document.getElementById("buttonsubmit");
var openedCards=0; //сколько карт секйчас открыто. Максимум=3;
var firstDemention=3;
var secondDemention=2;
var gameOver=true;
var matrix=new Array();

    // Алиасы
var $$ = document.querySelector.bind(document);
var $$All = document.querySelectorAll.bind(document);

console.log(34);
//buttonSubmit.addEventListener("onclick",startGame());
console.log(44);

function Picture(pictureNumber, urlPicture) {  //это ячейка таблицы.
    var id=pictureNumber;
    var url=urlPicture;
    var opened=false;

    this.getId=function (){
        return id;

    }

    this.getPicture = function (){
        return url;

    }

    this.setPicture = function (value){
        url=value;

    }

    this. isOpened = function (){
        return opened;
    }

    this.toOpen = function (value){
        opened=value;
    }   

    this.isActive = function (){
        return this.getPicture()===undefined?false:true;
    }      
}

function getPicturesArray(size){
    var result=[];

    var categories = [
        //"abstract",
        "animals",
        "business",
        "cats",
        "city",
        "food",
        "nightlife",
        "fashion",
        "people",
        "nature",
        "sports",
        "technics",
        "transport"
      ];
      console.log(2);
      var arr=[];
      // Создаем объект { категория: [10 картинок] }
      var images = categories.reduce((hash, category) => {
        hash[category] = Array(10)
          .fill(1)
          .map((_, i) => {
            arr.push(`http://lorempixel.com/50/70/${category}/${i + 1}`);
              return `http://lorempixel.com/50/70/${category}/${i + 1}`
          });
        return hash;
      }, {});
      
      result=new Set();  //вернём массив уникальных картинок.
      while (result.size<size){
        //var value=Math.random()*100;
       
        var currentPicture=new Picture(result.size,arr[getRandomValue(arr.length)]);
        result.add(currentPicture);
      }
      console.log("result="+result);
      return result;
}

function getRandomValue(size){
    var randomValue=Math.random();
    var value=randomValue*size;
    value=Math.floor(value);
    console.log("randomValue="+randomValue+", value="+value);

    return value;
}

function startGame() {
    gameOver=false;
    openedCards=0;
    matrix=[];
    console.log(1);
    firstDemention=document.getElementById("firstDemention").value;
    secondDemention=document.getElementById("secondDemention").value;
    var setPictures=getPicturesArray(firstDemention*secondDemention/2);
    var arr=[];
    setPictures.forEach(function(item, sameItem, setPictures) { //задублируем их
        arr.push(item); 
        arr.push(new Picture(item.getId(),item.getPicture())); 
    });  

    var tableHTML= `<table class="images" id="placeImages">`;

    for (var i=0;i<firstDemention;i++){  //распределяем по матрице и выводим на экран
        console.log("i="+i);
        tableHTML+= `<tr>`;
        matrix[i]=new Array();
        for (var j=0;j<secondDemention;j++){
            console.log("j="+j);
           
            var currentNumber=getRandomValue(arr.length);
            var currentPicture=arr[currentNumber];
            matrix[i][j]=currentPicture;
            arr.splice(currentNumber,1);
            console.log("arr.length="+arr.length+", currentPicture.id="+currentPicture.getId());
            tableHTML+= getCardImageHTML(i,j,true); //изначально инициализируем рубашкой вверх   
         }
         tableHTML+= `</tr>`;
    }
    tableHTML+= `</table>`;
    $$(".place").innerHTML=tableHTML;
    //$$(".place").addEventListener("onclick",onCardClick);
    document.getElementById("placeImages").onclick=function (event){
        console.log(9);
        if (event.target.localName!=="img" || gameOver){
            return;
        }
        var cutrrentTDId=event.target.parentNode.id;
        var currentI=+cutrrentTDId[cutrrentTDId.length-2];
        var currentJ=+cutrrentTDId[cutrrentTDId.length-1];
        openedCards++;
        if (! matrix[currentI][currentJ].isOpened() && matrix[currentI][currentJ].isActive()){  //открываем текущую. Если она ещё в игре
            matrix[currentI][currentJ].toOpen(true);
            document.getElementById("cell"+currentI+currentJ).innerHTML= getCardImageHTML(currentI,currentJ,false);
        }        
        console.log(10);
        if (openedCards===3){ //закрываем все открытые, открываем только текущаю
            for (var i=0;i<firstDemention;i++){  //распределяем по матрице и выводим на экран
                for (var j=0;j<secondDemention;j++){
                    if (i!==currentI || j!==currentJ){
                        if (matrix[i][j].isOpened() && matrix[i][j].isActive()){
                            matrix[i][j].toOpen(false);
                            document.getElementById("cell"+i+j).innerHTML= getCardImageHTML(i,j,true);
                            openedCards=1;
                        }
                    }
                }
            
            }
        }else if (openedCards===2){
            var currentCell= matrix[currentI][currentJ];
              
            for (var i=0;i<firstDemention;i++){  //распределяем по матрице и выводим на экран
                for (var j=0;j<secondDemention;j++){
                    if (i!==currentI || j!==currentJ){
                        if (matrix[i][j].isOpened() && matrix[i][j].getId()===currentCell.getId()){ //Типа, нашли пару
                            setTimeout(function() {}, 500);
                            document.getElementById("cell"+i+j).innerHTML= '<td>-1<div class="empty" style="width:80px;height:100px;"></div></td>';
                            matrix[i][j].setPicture(undefined);
                            document.getElementById("cell"+currentI+currentJ).innerHTML= '<td>-1<div class="empty" style="width:80px;height:100px;"></td>';
                            currentCell.setPicture(undefined);
                            openedCards=0;
                            console.log("Нашли пару");
            
                            break;
                        }
                    }       
                }
            }
            
        }
        checkForGameOver();
    }
    

console.log(7);

}

function getCardImageHTML(i,j,backSide){
    var obj=matrix[i][j];

    return `<td id="cell`+i+j+`">`
        +(backSide?100+`(`+obj.getId()+`)`:(obj.isOpened()?obj.getId():100+`(`+obj.getId()+`)`))  //ПОТОМУ ЧТО ЭТИ ЕБУЧИЕ КАРТИНКИ НИХЕРА НЕ ГРУЗЯТСЯ
        +`<img src="`+(backSide?backPicture:(obj.isOpened()?obj.getPicture():backPicture))
        +`" style="width:80px;height:100px;"></td>`;
}


function checkForGameOver(){
    gameOver=true;
    for (var i=0;i<firstDemention;i++){
        for (var j=0;j<secondDemention;j++){
            if (matrix[i][j].isActive()){
                gameOver=false;  //значит, где-то чё-то ещё осталось. Продолжаем игру
                break;
            }
        }
        if (!gameOver){
            break;
            console.log(12);
        }
    }        
    if (gameOver){
        matrix=[];
        console.log("Game over 2");
        alert("Game over");
    }
    console.log(14);
    
}


// Создание таблицы строки - категории, в ячейках - картинки
/*
$$(".place").innerHTML =${Array(categories.length)
  .fill("<tr></tr>")
  .join("")}</table>`;
categories.forEach(
  (category, index) =>
    ($$All(`.images tr`)[index].innerHTML = images[category]
      .map(img => `<td><img src="${img}" /></td>`)
      .join(""))
);

}*/
