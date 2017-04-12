var resultsArray = new Array();
var dataArray;
var onArray;
var search;


function onyomiSearch()
{
    search = prompt("Type in your onyomi","");

    dataArray = arrayMaker();
    for(x = 0; x<numOfKanji; x++)
    {
        onArray = dataArray[x][2].split(',');

        if(search == dataArray[x][2])
        {
            resultsArray.push(dataArray[x][0] + "  " + dataArray[x][1]);
        }
    }

    myFunction();
    resultsArray = [];
    function changeText(id)
    {
        id.innerHTML = "Reload";
        //questionCreator();
        //populateBoxes();
    }
}




function myFunction()
{
    document.getElementById("results").innerHTML = "There were " + resultsArray.length + " results for " + search + "<br>ーーーーーーーーーーーーーーー";

    for(y = 0; y < resultsArray.length; y++)
    {
        var para = document.createElement("P");
        var t = document.createTextNode(resultsArray[y]);
        para.appendChild(t);
        document.getElementById("results").appendChild(para);
    }
}




