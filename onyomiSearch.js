var dataArray = [];

var loader = (function()
{
    var btn = "";
    var dataArray = [];
    var urlStart = "https://www.wanikani.com/api/user/";
    var urlEnd = "/kanji/";
    var myAPI = "";

    function printArray(array)
    {
        alert(array);
        console.log(array);
    }

    function getAPI()
    {
        var myAPI = "";

        do
        {
            myAPI = prompt("What is your API?","");
            if(myAPI.length != 32)
            {
                alert("API must be 32 characters long.");
            }
        }
        while(myAPI.length != 32);
        return myAPI;
    }

    function renderHTML(data)
    {
        var htmlString = "";
        var length = data.requested_information.length;

        htmlString = "You've learned " + data.requested_information.length + " characters!";
        document.getElementById('knownKanji').innerHTML = htmlString;

        loader.elementVisibility("search_box", "visible");
        document.getElementById("search_box").focus();

        for(var i = 0; i < length; i++)
        {
            dataArray[i] = new Array(4);

            dataArray[i][0] = data.requested_information[i].character;
            dataArray[i][1] = data.requested_information[i].meaning;
            dataArray[i][2] = data.requested_information[i].level;
            dataArray[i][3] = data.requested_information[i].onyomi;
        }
    }

    function informUser(searchTerm, array)
    {
        if(array.length === 0)
        {
               loader.clearArea("result_table");
               document.getElementById("result_statement").innerHTML = "There were no results for " + searchTerm;
        }
        else
        {
            if(searchTerm.toLowerCase() === "none" || searchTerm === "")
            {
                document.getElementById("result_statement").innerHTML = "There were " + array.length + " results with no 音読み";
            }
            else
            {
                if(array.length == 1)
                {
                    document.getElementById("result_statement").innerHTML = "There was 1 result for " + searchTerm;
                }
                if(array.length > 1)
                {
                    document.getElementById("result_statement").innerHTML = "There were " + array.length + " results for " + searchTerm;
                }
            }
            addTable(array);
        }
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

    function checkTerm(str)
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


    //these are the publicly available functions
    return {

        goBack: function()
        {
            window.history.back();
        },

        clearArea: function(idName)
        {
            document.getElementById(idName).innerHTML = "";
        },

        getArray: function()
        {
            return dataArray;
        },

        onyomiSearch: function(str, array)
        {
            var resultsArray = [];
            resultsArray.length = 0;
            var onArray = [];
            var numOfKanji = array.length;
            var hasOn = 0;
            var noneOn = 0;

            if(checkTerm(str))
            {
                loader.clearArea("result_statement");
                loader.clearArea("result_table");
                alert("Hiragana Characters Required");
                return;
            }

            for(var x = 0; x < numOfKanji; x++) //loop for each kanji
            {


                if(str === null　|| str === "" || str.toLowerCase() === "none")
                {
                    if(array[x][3] === null　|| array[x][3] === "" || array[x][3] === "None")
                    {
                        resultsArray.push(array[x]);
                        noneOn++;
                    }
                }
                else
                {
                    if(array[x][3] !== null)
                    {

                        onArray = array[x][3].split(',');
                        for(var y = 0; y < onArray.length; y++)
                        {
                            onArray[y] = onArray[y].replace(/\s+/, ""); //get rid of whitespaces
                            if(str === onArray[y])
                            {
                                resultsArray.push(array[x]);
                                hasOn++;
                            }

                        }
                    }
                }
            }
            resultsArray.sort(function(a, b){return a[2] - b[2];}); //sort results by level
            console.log(resultsArray);
            informUser(str, resultsArray);
            return resultsArray;
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
                loader.elementVisibility("api_btn","hidden");
                loader.elementVisibility("knownKanji","visible");
            }
        },

        elementVisibility: function(idName, str)
        {
            var div = document.getElementById(idName);
            div.style.visibility = str;
        }
    };
}());
