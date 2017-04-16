var resultsArray = new Array();
var dataArray;
var onArray;
var search;


function onyomiSearch()
{
    search = prompt("Type in your onyomi","");
    if(search.toLowerCase() == "none")
    {
        search = "None";
    }

    dataArray = arrayMaker();
    for(x = 0; x<numOfKanji; x++)
    {
        onArray = dataArray[x][2].split(',');
        //alert(dataArray)

        if(search == onArray[0] || search == onArray[1] || search == onArray[2])
        {
            var kanjiInfo = [dataArray[x][0], dataArray[x][1], dataArray[x][3]]
            //alert(kanjiInfo)
            resultsArray.push(kanjiInfo);
        }

    }

    resultsArray.sort(function(a, b){return a[2] - b[2]});
    addTable();
    resultPrinter();
    resultsArray = [];
}




function resultPrinter()
{
    if(resultsArray.length == 0)
    {
           document.getElementById("results").innerHTML = "You entered an invalid search.";
    }
    else
    {
        if(search.toLowerCase() == "none" || search == "")
        {
            document.getElementById("results").innerHTML = "There were " + resultsArray.length + " results with no 音読み";
        }
        else
        {
            document.getElementById("results").innerHTML = "There were " + resultsArray.length + " results for " + search;
        }
    }
}

function addTable()
{
    table = '';
    var rows = resultsArray.length;
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
            table += '<td>' + resultsArray[r][c] + '</td>';
        }
        table += '</tr>';
    }

    var completedTable = '<table>' + table + '</table';
    document.getElementById("demo").innerHTML = completedTable;
}


