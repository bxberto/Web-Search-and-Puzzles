var numOfKanji = 1;
var line;
var onyomiArray = new Array();
var questions;
var meanings;
var answer;
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


    lineArray = data.split(/\r?\n/);
    numOfKanji = lineArray.length - 4;
    document.getElementById("learnedKanji").innerHTML = "You have learned " + numOfKanji + " Kanji";
    dataArray = arrayMaker();
    //onyomiArray = onyomiArrayMaker(dataArray)


    //var row = prompt("Which row would you like?","");

    for(var k = 0; k < dataArray.length; k++)
    {
        onyomiArray[k] = dataArray[k][2].split(",");
        //myPrinter(k+1 + " " + onyomiArray[k])
    }

    questionCreator();

}

function play()
{
    document.getElementById("demo2").innerHTML = "play";
    alert(info);
}

function reset()
{
    document.getElementById("demo2").innerHTML = "reset";
    alert(info);
}

function arrayMaker()
{
    var itemArray = new Array(numOfKanji);

    for(var i = 4; i < numOfKanji + 4 ; i++)
    {
        line = lineArray[i].split(';')
        itemArray[i-4] = new Array(4);

        itemArray[i-4][0] = line[2]; //the kanji
        itemArray[i-4][1] = line[3]; //the meaning
        itemArray[i-4][2] = line[5]; //the onyomi
        itemArray[i-4][3] = line[9]; //the level

        //alert(itemArray[i-4].length);
    }

    //alert("Your array has " + itemArray.length + " entries.")
    return itemArray;

}

function myPrinter(f)
{
    var page = document.createElement("P");
    var t = document.createTextNode(f);
    page.appendChild(t);
    document.body.appendChild(page);
}

function onyomiSelector()
{

    var again = true;
    while(again)
    {
        var ran = Math.floor(Math.random() * numOfKanji)+1;
        var first = onyomiArray[ran][0];
        var selectedOnyomi = 'default';
        //alert(dataArray[ran][0] + " - " + dataArray[ran][2])
        var num = onyomiArray[ran].length;
        switch (num)
        {
            case 1: if(first == "None" || first == '')
                    {
                        //alert(dataArray[ran][0] + " doesn't have any onyomi!")
                        again = true;
                        break
                    }
                    else
                    {
                        again = false;
                        selectedOnyomi = first;
                        break;
                    }


            case 2:
            case 3:
                //alert(dataArray[ran][0] + " has " + num + " onyomi!")
                var ran2 = Math.floor(Math.random() * num);
                //alert("so we'll pick number " + ran2)
                again = false;
                selectedOnyomi = onyomiArray[ran][ran2]
                //alert("the chosen onyomi is " + ran + " , " + ran2);
                break;
        }
    }
    //alert("The chosen on'yomi is " + selectedOnyomi);
    return selectedOnyomi;
}

function questionCreator()
{
    var questionKanji = [];
    var onyomi;
    var meaningArray = [];

    do
    {

        var y = 1
        onyomi = onyomiSelector()//a random onyomi is selected
        //alert(onyomi);
        //alert(onyomiArray[4][2]);

        questionKanji.length = 0;//the matching kanji will go here
        for(x = 0; x < numOfKanji; x++)//go through all the kanji
        {
            var num = onyomiArray[x].length;
            //alert(num);
            if (num == 1)
            {
                //alert(onyomiArray[x]);
                if(onyomi == onyomiArray[x])
                {
                    questionKanji.push([dataArray[x][0], dataArray[x][1], dataArray[x][3]]);
                    //alert(questionKanji[0]);
                    y++
                }
            }
            if(num == 2)
            {
                //alert(onyomiArray[x][2] + " has " + num + " onyomi")
                if(onyomi == onyomiArray[x][0])
                {
                    questionKanji.push([dataArray[x][0], dataArray[x][1], dataArray[x][3]]);
                    y++

                }
                if(onyomi == onyomiArray[x][1])
                {
                    questionKanji.push([dataArray[x][0], dataArray[x][1], dataArray[x][3]]);
                    y++
                }
            }
            if(num == 3)
            {
                if(onyomi == onyomiArray[x][0])
                {
                    questionKanji.push([dataArray[x][0], dataArray[x][1], dataArray[x][3]]);
                    y++
                }
                if(onyomi == onyomiArray[x][1])
                {
                    questionKanji.push([dataArray[x][0], dataArray[x][1], dataArray[x][3]]);
                    y++
                }
                if(onyomi == onyomiArray[x][2])
                {
                    questionKanji.push([dataArray[x][0], dataArray[x][1], dataArray[x][3]]);
                    y++
                }

            }


        }

    }
    while(questionKanji.length < 4)
    answer = onyomi;
    questions = questionKanji;

}

function populateBoxes()
{
    shuffle(questions);
    //alert(questions.length);

    var x = document.getElementById("puzzle_table").rows[0].cells;
    x[1].innerHTML = questions[0][0];
    var x = document.getElementById("puzzle_table").rows[1].cells;
    x[0].innerHTML = questions[1][0];
    x[1].innerHTML = "?";
    x[2].innerHTML = questions[2][0];
    var x = document.getElementById("puzzle_table").rows[2].cells;
    x[1].innerHTML = questions[3][0];

    function changeButton()
    {
        document.getElementById("buttons").value = "Answer";
    }
}

function displayAnswer(id)
{
    document.getElementById("results").innerHTML = '';
    document.getElementById("demo").innerHTML = '';
    var guess = prompt("What is the common onyomi?","");

    if(answer == guess)
    {
        score++;
        alert("That's correct!\nYour score is " + score)

    }
    else
    {

        alert("Sorry, that's incorrect\nThe answer was " + answer + "\nYour score is " + score);
        score--;
    }


    document.getElementById("answer").disabled = true;
    questions.sort(function(a, b){return a[2] - b[2]});
    addTable();
    document.getElementById("results").innerHTML = "You know " + questions.length + " Kanji with On'Yomi " + answer;
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


function addTable()
{
    table = '';
    var rows = questions.length;
    var cols = 3;

    for(var r = 0; r < rows; r++)
    {
        if (r == 0)
        {
            table += '<tr>';
            table += '<th bgcolor="grey">Kanji</th>';
            table += '<th bgcolor="grey">Meaning</th>';
            table += '<th bgcolor="grey">Level</th>';
            table += '</tr>';
        }

        table += '<tr>';
        for(var c = 0; c < cols; c++)
        {
            table += '<td>' + questions[r][c] + '</td>';
        }
        table += '</tr>';
    }

    var completedTable = '<table class="results_table" id="results_table">' + table + '</table';
    document.getElementById("demo").innerHTML = completedTable;
}
