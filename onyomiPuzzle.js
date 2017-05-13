var onPuzzle = (function ()
{
    //variable declarations
    var urlStart = "https://www.wanikani.com/api/user/";
    var urlEnd = "/kanji/";
    var myAPI = "";
    var dataArray = [];
    var score = 0;
    var answerArray = [];

    //private function declarations
    function renderHTML(data)
    {
        var htmlString = "";
        var length = data.requested_information.length;

        htmlString = "You've learned " + data.requested_information.length + " characters!";
        document.getElementById('knownKanji').innerHTML = htmlString;
        onPuzzle.elementVisibility("play","visible");
        document.getElementById("play").focus();

        for(var i = 0; i < length; i++)
        {
            dataArray[i] = new Array(4);

            dataArray[i][0] = data.requested_information[i].character;
            dataArray[i][1] = data.requested_information[i].meaning;
            dataArray[i][2] = data.requested_information[i].level;
            dataArray[i][3] = data.requested_information[i].onyomi;
        }
    }

    function questionCreator()
    {
        var questionKanji = [];
        var ranOnyomi;
        var meaningArray = [];
        var num = 0;
        var vocabArray = onPuzzle.getArray();
        var knownKanji = [];

        do
        {
            var ran = Math.floor(Math.random() * vocabArray.length)+1;
            ranOnyomi = onyomiSelector(vocabArray[ran]);
            answerArray = matchChecker(ranOnyomi);
        }
        while(answerArray.length < 4);
        answer = ranOnyomi;
        populateBoxes(answer, answerArray);

    }

    function onyomiSelector(str)
    {
        var answerOnyomi;
        var onyomi = "";

        if(str[3] === "None")
        {
            console.log(str);
            answerOnyomi = "none";
        }
        else if(!str[3])
        {
            console.log(str);
            answerOnyomi = "none";
        }
        else
        {
            onyomi = str[3].split(',');
            if(onyomi.length > 1)
            {
                var ran = Math.floor(Math.random() * onyomi.length)+1;
                answerOnyomi = onyomi[ran];
            }
            else
            {
                answerOnyomi = onyomi;
            }
        }

        return answerOnyomi;
    }

    function matchChecker(str) //checks for matching onyomi
    {
        var array = onPuzzle.getArray();
        var numOfKanji = array.length;
        choiceArray = [];

        for(var i = 0; i < numOfKanji; i++) //goes through each item
        {
            if(!array[i][3])
            {
                i++;
            }

            var tempArray = array[i][3].split(',');
            var length = tempArray.length; //gets the number of onyomi
            if(length == 1) //items with one onyomi, null and blank items
            {

                if(array[i][3] == "None")
                {

                }
                else if (!array[i][3])
                {

                }
                else
                {
                    if(str == array[i][3])
                    {
                        choiceArray.push(array[i]);
                    }
                }
            }
            else //items with 2 or 3 onyomi
            {
                for(var j = 0; j < length; j++)
                {
                    tempArray[j] = tempArray[j].replace(/\s+/, ""); //get rid of whitespaces
                    if(str == tempArray[j])
                    {
                        choiceArray.push(array[i]);
                    }
                }
            }
        }

        return choiceArray; // returns an array of matches

    }

    function populateBoxes(answer, array)
    {
        onPuzzle.disableElement("input_box",false);
        document.getElementById("input_box").focus();

        var x = document.getElementById("puzzle_table").rows[0].cells;
        x[1].innerHTML = array[0][0];
        var y = document.getElementById("puzzle_table").rows[1].cells;
        y[0].innerHTML = array[1][0];
        y[2].innerHTML = array[2][0];
        var z = document.getElementById("puzzle_table").rows[2].cells;
        z[1].innerHTML = array[3][0];

    }

    function changeButtonValue(buttonId, buttonValue)
    {
        document.getElementById(buttonId).value = buttonValue;
    }

    function addTable(array)
    {
        var table = '';
        var rows = array.length;
        var cols = 3;

        for(var r = 0; r < rows; r++)
        {
            if (r === 0)
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
                table += '<td>' + array[r][c] + '</td>';
            }
            table += '</tr>';
        }

        var completedTable = '<table id="kanji_table" class="kanji_table">' + table + '</table';
        document.getElementById("result_table").innerHTML = completedTable;
    }

    function isNotHiragana(str)
    {
        var regex = /[\u3040-\u309f]/;
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
                    var numOfItems = ourData.requested_information.length;
                    for(var i = 0; i < numOfItems; i++)
                    {
                        dataArray[i] = new Array(4);

                        dataArray[i][0] = ourData.requested_information[i].character;
                        dataArray[i][1] = ourData.requested_information[i].meaning;
                        dataArray[i][2] = ourData.requested_information[i].onyomi;
                        dataArray[i][3] = ourData.requested_information[i].level;
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

                onPuzzle.elementVisibility("knownKanji","visible");
            }
        },

        getArray: function()
        {
            return dataArray;
        },

        changeText: function()
        {
            onPuzzle.clearArea("result_statement");
            onPuzzle.clearArea("result_table");
            document.getElementById("play").innerHTML = "Reload";
            onPuzzle.elementVisibility("input_box","visible");
            questionCreator();

        },

        shuffle: function(array)
        {
            let counter = array.length;

            // While there are elements in the array
            while (counter > 0)
            {
                // Pick a random index
                let index = Math.floor(Math.random() * counter);

                // Decrease counter by 1
                counter--;

                // And swap the last element with it
                let temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }

            return array;
        },

        displayAnswer: function(str)
        {
            onPuzzle.clearArea("result_statement");
            onPuzzle.clearArea("result_table");
            var again;

            if(isNotHiragana(str) || !str)
            {
                alert("Hiragana Characters Required");
                return;
            }

            if(answer == str)
            {
                score++;
                alert("That's correct!\nScore: " + score);
            }
            else
            {
                onPuzzle.clearArea("result_statement");
                score--;
                alert("Sorry, that's incorrect\nThe answer was " + answer + "\nScore: " + score);

            }

            onPuzzle.elementVisibility("input_box","hidden");
            onPuzzle.disableElement("input_box",true);
            document.getElementById("play").focus();
            answerArray.sort(function(a, b){return a[2] - b[2];});
            var num = answerArray.length;
            document.getElementById("result_statement").innerHTML = "You know " + num + " kanji with the onyomi " + answer;
            addTable(answerArray);
        },

        clearArea: function(idName)
        {
            document.getElementById(idName).innerHTML = "";
        },

        elementVisibility: function(idName, str)
        {
            var div = document.getElementById(idName);
            div.style.visibility = str;
        },

        disableElement: function(idName, bool)
        {
            document.getElementById(idName).disabled = bool;
        }

    };

}());
