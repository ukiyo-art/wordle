$(document).ready(function(){
    //dodanie id do każdej komórki tablicy
    var i = 1;
    $("td").each(function(){
        $(this).attr('id', "row" + i)
        i++;
    });
})

var answeredwords = []; //tablica przechowywująca odpowiedzi użytkownika
var words = []; //tablica przechowująca słowa, jakby ktoś chciał użyć własnych
const options = { //opcje do requestu api, przy pomocy którego losujemy słowo ze słownika
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '0abbce90d0msh419f32166b24d68p19f56fjsnbefde0097376', //api key, niestety nieukryty bo to javascript
        'X-RapidAPI-Host': 'polish-words.p.rapidapi.com'
    }
};
fetch('https://polish-words.p.rapidapi.com/word/random/5', options)
    .then(response => response.json())
    .then(response => {
        words.push(response.word.toString()) //dodajemy słowo do naszej tablicy ze słowami
})

var random = Math.floor(Math.random() * (words.length - 0) + 0) //losowanie słów, jeśli chcielibyśmy użyć własnych słów, a nie ze słownika

//zmienne do pętli
var i = 1;
var o = 1;
async function inputdata(){ //funkcja, która jest wykonywana po wpisaniu czegoś do inputu
    var rowsnumber = 0; // zmienna do ilości komórek w tabeli
    var inputvalue = $("#textinput").val(); //przypisanie tekstu z inputu do zmiennej
    if(inputvalue.length != 5){
        $("#error").text('Słowo musi mieć 5 liter.');
        return;
    } //sprawdzenie wpisane słowo ma 5 liter
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0abbce90d0msh419f32166b24d68p19f56fjsnbefde0097376',
            'X-RapidAPI-Host': 'polish-words.p.rapidapi.com'
        }
    };
    const res = fetch('https://polish-words.p.rapidapi.com/word/check/' + inputvalue, options).catch(error=>console.log(error)) //zapytanie do api, które sprawdza czy wpisane słowo istnieje
    if(await res.then(data=>{return data.ok}) != true){
        $("#error").text('Nie znaleziono słowa.');
        return;
    } //sprawdzenie czy udało się wykonać zapytanie do api (jeśli tak to słowo istnieje, a jeśli nie to nie istnieje)
    $("#textinput").val(''); //czyszczenie wpisanego tekstu po każdym kliknięciu enter
    $("#error").text(''); //czyszczenie pola error
    answeredwords.push(inputvalue); //dodanie podanego przez użytkownika słowa do tablicy ze słowami
    inputvaluesplited = inputvalue.split(''); //podzielenie słowa użytkownika na pojedyncze litery
    var randomword = words[random].split(''); //podzielenie losowego słowa na pojedyncze litery
    var animation = anime.timeline({ //timeline stworzony za pomocą anime.js (silnika od animacji do js), dzięki któremu animowane są poszczególne pola tablicy, a nie wszystkie na raz
        easing: 'easeInOutBounce',
        duration: 400,
    });
    for(var x = 0; x < 5; x++){ //pętla, która dodaje tekst wpisany przez użytkownika do pól tablicy na stronie oraz zmieniająca początkowo przezroczystość na 0, żeby pola tablicy były niewidzialne
        $("#row" + i).css('opacity', '0');
        $("#row" + i).text(inputvaluesplited[x])
        animation.add({ //dodajemy do timelineu animacje poszczególnych pól
            targets: '#row' + i, //dodajemy pola, w których ma wystąpić animacja (czyli w sumie wszystkie po kolei)
            rotateX: 360, //obracamy pole po osi X o 360stopni co daje efekt przewracania kartki
            opacity: 1 //zwiększamy przezroczystość na 1 
        }, '+=50') //zwiększamy wykonanie każdej następnej animacji o 50ms
        for(var y = 0; y <= randomword.length; y++){ //pętla sprawdzająca to, czy słowo użytkownika ma jakieś litery, które znajdują się też w wylosowanym słowie
            if(randomword[y] == inputvaluesplited[x]){
                $("#row" + i).css("backgroundColor", "orange");
            }
        }
        i++; 
    }
    for(var x = 0; x < randomword.length; x++){ //pętla sprawdzająca, czy słowo użytkownika ma jakieś litery, które znajdują się na tym samym miejscu co litery w wylosowanym słowie
        if(randomword[x] == inputvaluesplited[x]){
            $("#row" + o).css("backgroundColor", "green");
        }
        o++;
    }
    if(inputvalue == words[random]){ //wygrana i koniec gry
        $("#textinput").css("display", "none");
        $("#result").html("Pomyślnie zgadnięto słowo - <strong>" + words[random] + "</strong>")
        $("#restart").css("visibility", 'visible');
    }
    $("td").each(function(){
        rowsnumber++;
    });
    if(answeredwords.length == rowsnumber/5){ //przegrana i koniec gry
        $("#textinput").css("display", "none");
        $("#error").html("Skończyły się próby. Poprawne słowo to - <strong>" + words[random] + "</strong>")
        $("#restart").css("visibility", 'visible');
    }
    }