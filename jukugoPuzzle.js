var jukuPuzzle = (function ()
{
    //variable declarations
    var urlStart = "https://www.wanikani.com/api/user/";
    var urlEnd = "/vocabulary/";
    var myAPI = "";
    var dataArray = [];
    var score = 0;
    var answerArray = [];
    var answer = "";

    //private function declarations
    function renderHTML(data)
    {
        var htmlString = "";
        var length = data.requested_information.general.length;

        htmlString = "You've learned " + data.requested_information.general.length + " words!";
        document.getElementById('knownWords').innerHTML = htmlString;
        jukuPuzzle.elementVisibility("play","visible");
        document.getElementById("play").focus();

        for(var i = 0; i < length; i++)
        {
            dataArray[i] = new Array(4);

            dataArray[i][0] = data.requested_information.general[i].character;
            dataArray[i][1] = data.requested_information.general[i].kana;
            dataArray[i][2] = data.requested_information.general[i].meaning;
            dataArray[i][3] = data.requested_information.general[i].level;
        }
    }

    function questionCreator()
    {
        var vocabArray = jukuPuzzle.getArray();
        var temp = 0;
        var ranKanji;
        var answerArray = [];
        var possibleArray = [];
        var again = true;

        do
        {
            do
            {
                var ran = Math.floor(Math.random() * vocabArray.length)+1;
                ranKanji = characterSelector(vocabArray[ran][0]);
            }
            while(isNotKanji(ranKanji));

            possibleArray = matchChecker(ranKanji);
        }
        while(possibleArray[0].length < 2 || possibleArray[1].length < 2);
        answer = ranKanji;
        populateBoxes(answer, possibleArray[0], possibleArray[1]);
    }

    function isNotKanji(str)
    {
        var regex = /[\u4e00-\u9faf]/;
        var length = str.length;
        for(var i = 0; i < length; i++)
        {
            var x = str.charAt(i);
            if((!regex.test(x)))
            {
                return true;
            }
        }
        return false;
    }

    function addTable(array)
    {
        var table = '';
        var rows = array.length;
        var cols = 4;

        for(var r = 0; r < rows; r++)
        {

            if (r === 0)
            {
                table += '<col width="250px">';
                table += '<col width="320">';
                table += '<tr>';
                table += '<th bgcolor="grey">Word</th>';
                table += '<th bgcolor="grey">Reading</th>';
                table += '<th bgcolor="grey">Meaning</th>';
                table += '<th bgcolor="grey">Level</th>';
                table += '</tr>';
            }

            table += '<tr>';

            for(var c = 0; c < cols; c++)
            {
                if (c==1 && array[r][c].includes(","))
                {
                    var tempArray = array[r][1].split(",");
                    var num = tempArray.length;
                    table += '<td>';
                    for(var i = 0; i < num; i++)
                    {
                        tempArray[i] = tempArray[i].replace(/\s+/, "");
                        //alert(tempArray[i] + " , " + tempArray[i].length);
                        table += tempArray[i] + '<br>';
                    }
                    table += '</td>';
                }
                else
                {
                    table += '<td>' + array[r][c] + '</td>';
                }
            }

            table += '</tr>';
        }

        var completedTable = '<table id="kanji_table" class="kanji_table">' + table + '</table';
        document.getElementById("result_table").innerHTML = completedTable;
    }

    function populateBoxes(answer, array1, array2)
    {
        jukuPuzzle.disableElement("input_box",false);
        document.getElementById("input_box").focus();
        console.log(array1);
        console.log(array2);

        var x = document.getElementById("puzzle_table").rows[0].cells;
        x[1].innerHTML = array2[0].charAt(0);
        var y = document.getElementById("puzzle_table").rows[1].cells;
        y[0].innerHTML = array2[1].charAt(0);
        y[2].innerHTML = array1[0].charAt(1);
        var z = document.getElementById("puzzle_table").rows[2].cells;
        z[1].innerHTML = array1[1].charAt(1);

    }

    function characterSelector(word)
    {

        var ran = Math.floor(Math.random() * word.length)+1;
        var selectedCharacter;

        selectedCharacter = word.charAt(ran-1);
        return selectedCharacter;
    }

    function matchChecker(kanji)
    {
        var startWith = [];
        var endWith = [];
        var array = jukuPuzzle.getArray();
        var numOfItems = array.length;
        answerArray.length  = 0;


        for(var i = 0; i < numOfItems; i++)
        {
            var word = array[i][0];

            if(word.includes(kanji))
            {
                answerArray.push(array[i]);

                if(word.length == 2)
                {
                    if(word.startsWith(kanji))
                    {
                        startWith.push(word);
                    }
                    else
                    {
                        endWith.push(word);
                    }
                }
            }
        }

        var newArray = [2];
        newArray[0] = startWith;
        newArray[1] = endWith;
        return newArray;
    }

    //publicly available function declarations
    return {

        goBack: function()
        {
            window.history.back();
        },

        loadData: function()
        {
            var pageCounter = 0;
            var url = "";
            var ourRequest = new XMLHttpRequest();

            //url = urlStart + getAPI() + urlEnd;

            myAPI = "f5a1f19c9f1f7f3cf7562bb7477ba320";
            url = urlStart + myAPI + urlEnd;

            ourRequest.open('GET',url);
            ourRequest.onload = function()
            {
                var ourData = JSON.parse(ourRequest.responseText);
                console.log(ourData);

                if(ourData.requested_information === undefined)
                {
                    alert("Invalid API");
                    loader.loadData();
                }
                else
                {
                    var numOfItems = ourData.requested_information.general.length;
                    for(var i = 0; i < numOfItems; i++)
                    {
                        dataArray[i] = new Array(4);

                        dataArray[i][0] = ourData.requested_information.general[i].character;
                        dataArray[i][1] = ourData.requested_information.general[i].kana;
                        dataArray[i][2] = ourData.requested_information.general[i].level;
                        dataArray[i][3] = ourData.requested_information.general[i].meaning;
                    }
                    renderHTML(ourData);
                }
            };

            ourRequest.send();
            pageCounter++;

            if(pageCounter > 0)
            {
                var div = document.getElementById("api_btn");
                div.style.display = "none";

                jukuPuzzle.elementVisibility("knownWords","visible");
            }
        },

        elementVisibility: function(idName, str)
        {
            var div = document.getElementById(idName);
            div.style.visibility = str;
        },

        disableElement: function(idName, bool)
        {
            document.getElementById(idName).disabled = bool;
        },

        changeText: function()
        {
            jukuPuzzle.clearArea("result_statement");
            jukuPuzzle.clearArea("result_table");
            document.getElementById("play").innerHTML = "Reload";
            jukuPuzzle.elementVisibility("input_box","visible");
            questionCreator();

        },

        getArray: function()
        {
            return dataArray;
        },

        clearArea: function(idName)
        {
            document.getElementById(idName).innerHTML = "";
        },

        displayAnswer: function(str)
        {
            jukuPuzzle.clearArea("result_statement");
            jukuPuzzle.clearArea("result_table");

            if(isNotKanji(str))
            {
                alert("A Kanji character is required");
                return;
            }

            if(answer == str)
            {
                score++;
                alert("That's correct!\nScore: " + score);
            }
            else
            {
                jukuPuzzle.clearArea("result_statement");
                score--;
                alert("Sorry, that's incorrect\nThe answer was " + answer + "\nScore: " + score);

            }

            jukuPuzzle.elementVisibility("input_box","hidden");
            jukuPuzzle.disableElement("input_box",true);
            document.getElementById("play").focus();
            answerArray.sort(function(a, b){return a[3] - b[3];});
            var num = answerArray.length;
            document.getElementById("result_statement").innerHTML = "You know " + num + " words with the " + answer + " kanji";
            addTable(answerArray);
        }

    };

}());
