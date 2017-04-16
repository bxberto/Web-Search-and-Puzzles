var info;
var numOfVocab = 1;

var vocabArray = [];
var meaningArray = [];
var questions;
var meanings;

var answer;

var knownKanji = [];
var begAnswerKanji = [];
var endAnswerKanji = [];
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
    if (srcFrame.contentDocument)
    {
        data = srcFrame.contentDocument.getElementsByTagName("BODY")[0].innerHTML;
    }
    else if (srcFrame.contentWindow)
    {
        data = srcFrame.contentWindow.document.body.innerHTML;
    }

    var tempArray = [];
    lineArray = data.split(/\r?\n/);
    numOfVocab = lineArray.length - 4;
    document.getElementById("learnedKanji").innerHTML = "You have learned " + numOfVocab + " vocabulary words";

    for(var x = 4; x < numOfVocab + 4; x++)
    {
        tempArray[x-4] = lineArray[x].split(';')
        vocabArray[x-4] = [tempArray[x-4][2], tempArray[x-4][8], tempArray[x-4][3], tempArray[x-4][9]];
    }

    questionCreator();
}

function changeText(id)
{
    document.getElementById("results").innerHTML = "";
    document.getElementById("demo").innerHTML = '';
    id.innerHTML = "Reload";
    document.getElementById("answer").disabled = false;
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
    //var knownKanji = [];

    do
    {

        //alert(vocabArray.length)
        firstCharCount = 0;
        f = 0;
        lastCharCount = 0;
        l = 0;
        knownKanji.length = 0;
        begAnswerKanji.length = 0;
        endAnswerKanji.length = 0;
        var ran = Math.floor(Math.random() * vocabArray.length)+1;
        var ranCharacter = vocabArray[ran][0].slice(1,2);
        //alert(vocabArray[ran][0] + " and " + vocabArray[ran][0].slice(1,2));
        //alert(ranCharacter);

        for(x = 0; x < vocabArray.length; x++)//go through all the kanji
        {

            //alert(ranCharacter + " and " + vocabArray[x][0]);
            if(ranCharacter == vocabArray[x][0].charAt(0))
            {
                //alert(vocabArray[x][0] + " starts with " + ranCharacter)
                firstCharCount++
                knownKanji.push(vocabArray[x]);
                //alert(vocabArray[x][0].length);
                if(vocabArray[x][0].length == 2)
                {
                    f++;
                    begAnswerKanji.push(vocabArray[x][0]);
                }
            }
            if(ranCharacter == vocabArray[x][0].charAt(1))
            {
                //alert(vocabArray[x] + " ends with " + ranCharacter)
                lastCharCount++
                knownKanji.push(vocabArray[x]);
                if(vocabArray[x][0].length == 2)
                {
                    l++;
                    endAnswerKanji.push(vocabArray[x][0]);
                }
            }


        }
        //alert(ranCharacter)
        //alert(begAnswerKanji)
        //alert(endAnswerKanji)
    }
    while(f <= 1 || l <= 1)

    //alert("Sucess! " + ranCharacter + " " + firstCharCount + " and " + lastCharCount);
    //alert("f = " + f + " and l = " + l);
    answer = ranCharacter;
}


function populateBoxes()
{
    //shuffle(begAnswerKanji);
    //shuffle(endAnswerKanji);

    var x = document.getElementById("puzzle_table").rows[0].cells;
    x[1].innerHTML = endAnswerKanji[0].charAt(0);
    var x = document.getElementById("puzzle_table").rows[1].cells;
    x[0].innerHTML = endAnswerKanji[1].charAt(0);
    x[1].innerHTML = "?";
    x[2].innerHTML = begAnswerKanji[0].charAt(1);
    var x = document.getElementById("puzzle_table").rows[2].cells;
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
  while (m)
  {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function displayAnswer(id)
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

    document.getElementById("answer").disabled = true;
    knownKanji.sort(function(a, b){return a[3] - b[3]});
    var num = knownKanji.length;
    document.getElementById("results").innerHTML = "You know " + num + " words with the kanji " + answer;
    addTable();
}

function addTable()
{
    table = '';
    var rows = knownKanji.length;
    var cols = 3;
    for(var r = 0; r < rows; r++)
    {

        if (r == 0)
        {
            table += '<tr>';
            table += '<th bgcolor="grey">Kanji</th>';
            table += '<th bgcolor="grey">Reading</th>';
            table += '<th bgcolor="grey">Meaning</th>';
            table += '<th bgcolor="grey">Level</th>';
            table += '</tr>';
        }

        table += '<tr>';
        for(var c = 0; c < 4; c++)
        {
            if(c != 2)
            {
                table += '<td>' + knownKanji[r][c] + '</td>';
            }
            else
            {
                //alert("this is column 3");
                table += '<td width = "50%">' + knownKanji[r][c] + '</td>';
            }
        }
        table += '</tr>';


    }

    var completedTable = '<table class="results_table" id="results_table">' + table + '</table';
    document.getElementById("demo").innerHTML = completedTable;
}

function hideFunction()
{
    document.getElementById("box").style.display = "none";
}

function showFunction()
{
    document.getElementById("box").style.display = "block";
}
