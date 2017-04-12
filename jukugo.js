var info = 'declaration';
var numOfVocab = 1;
var vocabArray = new Array();
var meaningArray = new Array();
var questions;
var meanings;
var answer;
var begAnswerKanji = new Array();
var endAnswerKanji = new Array();
var score = 0;

function goBack()
{
    window.history.back();
}

function loadOuter(doc)
{
    srcFrame = document.getElementById("hiddenContent");
    srcFrame.src = doc;


    // workaround for missing onLoad event in IFRAME for NN6
    if (!srcFrame.onload)
    {
        setTimeout("transferHTML()", 1000)
    }

}

function transferHTML()
{

    //var lineArray = [];
    if (srcFrame.contentDocument)
    {
        data = srcFrame.contentDocument.getElementsByTagName("BODY")[0].innerHTML;
    }
    else if (srcFrame.contentWindow)
    {
        data = srcFrame.contentWindow.document.body.innerHTML;
    }

    var tempArray = new Array()
    lineArray = data.split(/\r?\n/);
    numOfVocab = lineArray.length - 4;
    document.getElementById("learnedKanji").innerHTML = "You have learned " + numOfVocab + " vocabulary words!";

    for(var x = 4; x < numOfVocab + 4; x++)
    {
        tempArray[x-4] = lineArray[x].split(';')
    }

    for(var y = 0; y < numOfVocab; y++)
    {
        vocabArray.push(tempArray[y][2]　+ " [" + tempArray[y][8] + "] " + tempArray[y][3]); //the vocabulary
    }

    //alert(vocabArray[2209]);
    //arrayMaker();
    questionCreator();
}

function changeText(id)
{
    id.innerHTML = "Reload";
    questionCreator();
    populateBoxes();
}

function arrayMaker()
{
    var itemArray = new Array();
    var x = 0;



    //alert("Your array has " + meaningArray.length + " entries.")
    //return itemArray;

}

function questionCreator()
{
    var questionKanji = new Array;
    var ranCharacter;
    var meaningArray = new Array;
    var firstCharCount = 0;
    var lastCharCount = 0;

    do
    {

        //alert(vocabArray.length)
        firstCharCount = 0;
        lastCharCount = 0;
        begAnswerKanji.length = 0;
        endAnswerKanji.length = 0;
        var ran = Math.floor(Math.random() * vocabArray.length)+1;
        var ranCharacter = vocabArray[ran].slice(1,2);
        //alert(ranCharacter + " " + begAnswerKanji.length + " and " + endAnswerKanji.length);

        for(x = 0; x < vocabArray.length; x++)//go through all the kanji
        {
            if(ranCharacter == vocabArray[x].charAt(0))
            {
                //alert(vocabArray[x] + " starts with " + ranCharacter)
                firstCharCount++
                begAnswerKanji.push(vocabArray[x]);
            }
            if(ranCharacter == vocabArray[x].charAt(1))
            {
                //alert(vocabArray[x] + " ends with " + ranCharacter)
                lastCharCount++
                endAnswerKanji.push(vocabArray[x]);
            }


        }
        //alert(ranCharacter)
        //alert(begAnswerKanji)
        //alert(endAnswerKanji)
    }
    while(firstCharCount <= 1 || lastCharCount <= 1)
    //while(firstCharCount <= 1 && lastCharCount <= 1);


    //alert("Sucess! " + ranCharacter + " " + firstCharCount + " and " + lastCharCount);
    answer = ranCharacter;

    var x = document.getElementById("info_table1").rows[0].cells;
    x[1].innerHTML = endAnswerKanji[0].charAt(0);
    var x = document.getElementById("info_table1").rows[1].cells;
    x[0].innerHTML = endAnswerKanji[1].charAt(0);
    x[1].innerHTML = "?";
    x[2].innerHTML = begAnswerKanji[0].charAt(1);
    var x = document.getElementById("info_table1").rows[2].cells;
    x[1].innerHTML = begAnswerKanji[1].charAt(1);

    function changeButton()
    {
        document.getElementById("buttons").value = "Answer";
    }
}

function shuffle(array)
{
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function myFunction()
{
    var num = begAnswerKanji.length + endAnswerKanji.length;
    document.getElementById("results").innerHTML = "You know " + num + " words with the kanji " + answer + "<br>ーーーーーーーーーーーーーーーーー";

    for(y = 0; y < endAnswerKanji.length; y++)
    {
        var para = document.createElement("P");
        var t = document.createTextNode(endAnswerKanji[y]);
        para.appendChild(t);
        document.getElementById("results").appendChild(para);
    }



    for(z = 0; z < begAnswerKanji.length; z++)
    {
        var para = document.createElement("P");
        var t = document.createTextNode(begAnswerKanji[z]);
        para.appendChild(t);
        document.getElementById("results").appendChild(para);
    }

}

function displayAnswer()
{
    var guess = prompt("What is the common Kanji?","");

    if(answer == guess)
    {
        score++;
        alert("That's correct!\nYour score is " + score)

    }
    else
    {
        document.getElementById("results").innerHTML = '';
        alert("Sorry, that's incorrect\nThe answer was " + answer + "\nYour score is " + score);
        score--;
    }

    myFunction();
    questionCreator();
}
