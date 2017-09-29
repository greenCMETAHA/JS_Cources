/* eslint no-var: "off" */
/* eslint no-unused-vars: "off" */
/* eslint max-len: "off" */

/**
 * Функция вывода строк для работы в fizzBuzz
 * @param {*} a 
 */
function log(a) {
    console.log(a);
}

/* Раместите ваш код ниже */

/**
 * реализовать фукнцию `fizzBuzz` 
 * которая выводит числа от 1 до 100. 
 * Если число кратно 3 - вместо числа вывести `Fizz`. 
 * Если кратно 5 - вывести вместо числа `Buzz`. 
 * Если число кратно и 3 и 5 - вывести вместо числа `FizzBuzz`. 
 * Для вывода использовать фукнцию `log` (аналогично заданию в классе). 
 * В теле функции нельзя использовать  `if`, `switch`, тернарный оператор `? :`
 */
function fizzBuzz() {
    var arr3=["Fizz"], arr5=["Buzz"];
     for (var i=1; i<=100; i++ ){
        window.log( !(i%15)&&'FizzBuzz'||!(i%5)&&'Buzz'||!(i%3)&&'Fizz'||i);
                //это не я умный, это поисковик умный.
    }
}
//fizzBuzz(); 


/**
 * реализовать фукнцию  `isPolindrom`, 
 * которая принимает на вход строку и возвращает результат проверки (`true`/ `false` ),
 * является строка полндромом (одинакого читается с лева на право и с права на лево ) или нет
 * @param {string} textString 
 * @return {boolean} Является строка полндромом (одинакого читается с лева на право и с права на лево ) или нет
 */
function isPolindrom(textString) {
    var bPolindrom=true;
    var str=textString.toLowerCase();
    for (var i=0; i<str.length;i++){
        if (str[i]!==str[str.length-(i+1)]){
            bPolindrom=false;
            break;
        }
    }

    return bPolindrom;
}


/**
 * Реализовать фукнцию `drawCalendar` , 
 * которая принимает три аргумента - год, месяц, htmlElement 
 * и выводит в этот элемент календарь на месяц (дни недели начинаются с понедельника ).  
 * @param {number} year 
 * @param {number} month - номер месяца, начиная с 1
 * @param {external:HTMLElement} htmlEl 
 */
function drawCalendar(year, month, htmlEl) {
    var d=new Date(year, month-1,1);
    var days_in_month = 32 - new Date(year, month-1,32).getDate();
    var dayOfWeek=d.getDay(); 
    var calendar="";
    for (var i=1; i<dayOfWeek; i++){ //выводим дни прошлого месяца с понедельника (пустые даты)
        calendar+="    ";  //4 символа: 2 на дату, и 2 - пустых

    }

    for (i=1; i<=days_in_month; i++){ //выводим дни прошлого месяца с понедельника (пустые даты)
        calendar+="  "+(i<10?" ":"")+i;  //4 символа: 2 на дату, и 2 - пустых
        dayOfWeek++;
        if (dayOfWeek==8){
            dayOfWeek=1;
            calendar+="<br>";
        }
    } 
    htmlEl.innerHTML =calendar;
}

/**
 * Написать функцию `isDeepEqual`
 * которая принимает на вход двe переменных
 * и проверяет идентичны ли они по содержимому. Например
 * @param {*} objA 
 * @param {*} objB 
 * @return {boolean} идентичны ли параметры по содержимому
 */
function isDeepEqual(objA, objB) {
    var result=true;

    if ((typeof objA)!==(typeof objB)){
        result=false;
    } else if (Array.isArray(objA) && Array.isArray(objB)){
        if (objA.join(",")!==objB.join(",")){
            result=false;
        }
    }else {
        if (objA!==objB) {
            result=false;
        }
        try{
            bCurrent=(JSON.stringify(objA) == JSON.stringify(objB)); // если элементы мапы будут в разном порядке, хоть и одинаковы, даст false
            if (!bCurrent){ 
                if (Object.keys(objA).length>0)     {                                    //поэтому проверяем
                    bCurrent=true;
                    for (var keyAB in objA){
                        if (!isDeepEqual(objA[keyAB], objB[keyAB])){
                            bCurrent=false;
                            break;
                        }
                    }             
                } //чет как-то через ж, и работает долго. Но тесты прошло.

            }
            result=bCurrent;
        }
        catch(e){
            console.log(e);
        };
     }

    return result;
}


