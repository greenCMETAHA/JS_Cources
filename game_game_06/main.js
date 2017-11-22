'use strict';

//--------------------------------------------------Начальные данные---------------------------------------------

const SIZE=30;
const TEXT_VARIANT=1, CANVAS_VARIANT=2, SVG_VARIANT=3, CELL_SIZE=15, SVG_NS  = "http://www.w3.org/2000/svg";
const CANVAS_COLOR="rgb(237,224,224)";
var variantOfTheGame=(+localStorage.getItem("GameLafe_Vasilchenko_variantOfTheGame"))||TEXT_VARIANT;
var textDIV = document.getElementById(`textDIV`);
var canvasDIV = document.getElementById(`canvasDIV`);
var svgDIV = document.getElementById(`svgDIV`);


var size_X=0;
var size_Y=0;
var matrix= null;
var timeLine=null;
refreshDimensions();    //function

matrix[2][2]=1;   //начальная фигура для тестов  -->  планер
matrix[3][3]=1;
matrix[4][1]=1;
matrix[4][2]=1; 
matrix[4][3]=1; //начальная фигура для тестов   <--

showStep(matrix);    //function
var currentStep=-1;
var isStarted=false;

//---------------------------------------Механика игры-------------------------------------------

function refreshDimensions() {
    let x=document.getElementById("size_X").value;
    let y=document.getElementById("size_Y").value;  
    if (x!=size_X || y!=size_Y){
        size_X=+x;
        size_Y=+y;
        timeLine=new Array();
        matrix=createEmptyStep();
        gameVariant(variantOfTheGame);
    }
}

function start() {
    var timerId = setTimeout(function go() {
        matrix=nextStep(matrix);
        showStep(matrix);
        timeLine.push(matrix);
        currentStep++;
        
        if (liveMatrix(matrix) &&  isStarted) {
            setTimeout(go,getSpeed());
        }else{
            if (isStarted){
                alert("Game over!");
            }
        }
    }, getSpeed());
}

function nextStep(matrix) {
    var result=createEmptyStep();

    for (let i = 0; i < size_X; i++) {
        for (let j = 0; j < size_Y; j++) {
            let count=returnNumberAround(i,j);  //function
            if (matrix[i][j]===0){
                result[i][j]=count===3?1:0;

            }else{
                result[i][j]=(count===3 || count===2)?1:0;
            }
        }
    }

    return result; 
    
}

function createEmptyStep() {
    var result=new Array();
    for (var i = 0; i < size_X; i++) {
        result[i]=new Array();
        for (var j = 0; j < size_Y; j++) {
            result[i][j]=0;
        }
    }
    return result;
}

function liveMatrix(matrix) {
    for (var i = 0; i < size_X; i++) {
         for (var j = 0; j < size_Y; j++) {
            if (matrix[i][j]===1){
                return true;   //return

            }
        }
    } 
    return false;   //return
}

function getSpeed() {
    let result=1000;
    let slider = document.getElementById("gameSpeed");
    result = slider.value || result;

    return result; 
    
}

function correctCoordinates(i,j) {
    let currentI=(i<0?size_X-1:(i>=size_X?0:i));  //а можно было отдельную функцию на это написать
    let currentJ=(j<0?size_Y-1:(j>=size_Y?0:j));

    return matrix[currentI][currentJ];
}

function returnNumberAround(i,j){
    let result=0;

    result=correctCoordinates(i-1,j)+correctCoordinates(i,j-1)+correctCoordinates(i+1,j)+correctCoordinates(i,j+1)
          +correctCoordinates(i-1,j-1)+correctCoordinates(i-1,j+1)+correctCoordinates(i+1,j-1)+correctCoordinates(i+1,j+1)

    return result;
}

// ------------------------------------------Кнопки ----------------------------------------------
function buttonBack() {
    currentStep--;
    matrix=timeLine[currentStep];
    showStep(matrix);
    
}

function buttonPlay() {
    isStarted=!isStarted;

    if (isStarted){
        refreshDimensions();

    }
    while (currentStep<(timeLine.length-1)){  //жали кнопку Back
        timeLine.pop(); 
    }
    var button = document.getElementById("button_startstor");
    button.src=(isStarted?"https://image.flaticon.com/icons/svg/61/61039.svg":"https://image.flaticon.com/icons/svg/26/26025.svg");  //Пауза:  //Старт: 
    start();
}

function buttonForward() {
    currentStep++;
    if (currentStep>=timeLine.length){
        currentStep--;
    }
    matrix=timeLine[currentStep];
    showStep(matrix);
    
}

// ---------------------------------------------------- Графика. Обработка 

function showStep(matrix) {
    if (variantOfTheGame===TEXT_VARIANT){
        var str=`<pre><table onclick="clickOnTable()">`;
        for (var j = 0; j < size_Y; j++) {
            str+=`<tr>`;
            for (var i = 0; i < size_X; i++) {
                let current=matrix[i][j]===1?`O`:` `;
                str+=`<td class="td_text" id="${i},${j}">${current}</td>`;
            }
            str+=`</tr>`;
        } 
        str+=`</table></pre>`;
        textDIV.innerHTML=str;
    }else if (variantOfTheGame===CANVAS_VARIANT){
        let canvasElement=document.getElementById("canvasTag");
        let ctx     = canvasElement.getContext('2d');
        for (let j = 0; j < size_Y; j++) {
            for (let i = 0; i < size_X; i++) {
                ctx.fillStyle = matrix[i][j]===1?"black":CANVAS_COLOR;
                ctx.fillRect(i*CELL_SIZE+i+1, j*CELL_SIZE+j+1, CELL_SIZE, CELL_SIZE);
            }
        }
    }else if (variantOfTheGame===SVG_VARIANT){
        let svgElement=document.getElementById("svgCells");
        let str="";
        for (let i = 0; i < size_X; i++) {
            for (let j = 0; j < size_Y; j++) {
                let currentColor=matrix[i][j]===1?'black':CANVAS_COLOR;
                str+= `<rect id="rect`+i+`,`+j+`" x="${CELL_SIZE*i+i+1}" y="${CELL_SIZE*j+j+1}" height='${CELL_SIZE}' width='${CELL_SIZE}' 
                    stroke-width="0" fill="${currentColor}"></rect>`;
            }
        }
        svgElement.innerHTML=str;

    }   
}

function gameVariant(variant) {
    variantOfTheGame=variant;
    textDIV.innerHTML="";
    canvasDIV.innerHTML="";
    svgDIV.innerHTML="";
    localStorage.setItem('GameLafe_Vasilchenko_variantOfTheGame', variantOfTheGame);  //чтобы через Back возвращалось на нужный вариант игры

    if (variantOfTheGame===TEXT_VARIANT){

    } else if (variantOfTheGame===CANVAS_VARIANT){   //CANVAS_VARIANT  --------------------------------------
        let dimension_X=(size_X*CELL_SIZE)+(size_X+1)
            , dimension_Y=(size_Y*CELL_SIZE)+(size_Y+1);

        canvasDIV.innerHTML=`<canvas height='${dimension_Y}' width='${dimension_X}' id="canvasTag"></canvas>`;
        let canvasElement=document.getElementById("canvasTag");
        let ctx     = canvasElement.getContext('2d');

        ctx.fillStyle = CANVAS_COLOR;
        ctx.fillRect(1, 1,dimension_X+1,dimension_Y+1);
        for (let i = 0; i < size_Y+1; i++) {
            ctx.beginPath();
            ctx.moveTo(1,(CELL_SIZE*i)+i+1);
            ctx.lineTo(dimension_X,(CELL_SIZE*i)+i+1);
            ctx.strokeStyle="green";
            ctx.stroke();
        }
        for (let i = 0; i < size_X+1; i++) {
            ctx.beginPath();
            ctx.moveTo((CELL_SIZE*i)+i+1,1);
            ctx.lineTo((CELL_SIZE*i)+i+1,dimension_Y);
            ctx.strokeStyle="green";
            ctx.stroke();
        } 

        canvasElement.addEventListener("mouseup",(evt)=>{  //обработчики событий  -->>
            if (!isStarted && evt){
                let mousePos =  getMousePos(canvasElement, evt);
                let cell_x=Math.floor(mousePos.x/(CELL_SIZE+1)); 
                let cell_y=Math.floor(mousePos.y/(CELL_SIZE+1));
                matrix[cell_x][cell_y]=matrix[cell_x][cell_y]===1?0:1;
                showStep(matrix);
            }
        });

        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
              x: evt.clientX - rect.left,
              y: evt.clientY - rect.top
            };
          }
          
    }else if (variantOfTheGame===SVG_VARIANT){           //SVG_VARIANT  --------------------------------------

        let dimension_X=(size_X*CELL_SIZE)+(size_X+1)
             , dimension_Y=(size_Y*CELL_SIZE)+(size_Y+1);

        svgDIV.innerHTML=`<svg id="svgTag" height="${dimension_Y+1}" width="${dimension_X+1}" > </svg>`;
        let svgsElement=document.getElementById("svgTag");



        let str=`<polyline points="1,1 ${dimension_X+1},1 ${dimension_X},${dimension_Y} 1,${dimension_Y+1} 1,1" 
            fill="${CANVAS_COLOR}" stroke-width="1" stroke="green"/>`;

        for (let i = 0; i < size_X+1; i++) {  //вертикальные x 
            str+=`<line x1="${(CELL_SIZE*i)+i+1}" y1="1" x2="${(CELL_SIZE*i)+i+1}" y2="${dimension_Y}" stroke-width="1" stroke="green"/> `;
        }
        for (let i = 0; i < size_Y+1; i++) { //горизонтальные y
            str+=`<line x1="1" y1="${(CELL_SIZE*i)+i+1}" x2="${dimension_X}" y2="${(CELL_SIZE*i)+i+1}" stroke-width="1" stroke="green"/> `;
        } 
    
        str+=`<g id="svgCells"><rect x="${1}" y="${1}"
                     width="${40}"  height="${40}" fill="black"></rect></g>`;  //что бы не перерисовывать фон и клетки. Так просто при каждом показе убьём и перерисуем квадратики
        svgsElement.innerHTML=str;
        showStep(matrix);

        let svgCells=svgsElement.getElementById("svgCells");   //обработчики событий  -->>
        svgsElement.addEventListener("mouseup",(evt)=>{
            if (!isStarted && evt){
                let svgCell=event.target;
                let str = svgCell.id;
                let arr=str.replace("rect","").split(',');
                if (arr.length===2){
                    matrix[arr[0]][arr[1]]=matrix[arr[0]][arr[1]]===0?1:0;
                    svgCell.setAttribute("fill", matrix[arr[0]][arr[1]]===1?"black":CANVAS_COLOR);
                    //showStep(matrix);
                }
            }
        });
        
    }
        
    showStep(matrix);
}

function clickOnTable() {
    if (!isStarted){
        let str = event.target.id;
        let arr=str.split(',');
        if (arr.length===2){
            matrix[arr[0]][arr[1]]=matrix[arr[0]][arr[1]]===0?1:0;
            showStep(matrix);
        }
    }
}




