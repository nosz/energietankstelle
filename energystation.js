/*jslint browser: true, sloppy: true*/

var tempStartseite = true;
var minBild = 1;
var maxBild = 293;
var tempSprache;

// --- AUTOMATISCHE SPRACHWAHL AUS URL ---
function getLangFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lang'); // z.B. "es", "ru"
}

// --- Funktion, um Sprache direkt zu setzen ---
function setLanguage(langCode) {
    switch (langCode) {
        case "de":
            document.getElementById("text1").innerHTML = "ENERGIETANKSTELLE";
            document.getElementById("text2").innerHTML = "Klicken und immer wieder<br>Energie auftanken mit deiner<br>HERZ-INTELLIGENZ";
            tempSprache = "de";
            localStorage.setItem("langEnergie", "de");
            localStorage.setItem("langEnergieText1", "ENERGIETANKSTELLE");
            localStorage.setItem("langEnergieText2", "Klicken und immer wieder<br>Energie auftanken mit deiner<br>HERZ-INTELLIGENZ");
            break;
        case "en":
            document.getElementById("text1").innerHTML = "Energy station";
            document.getElementById("text2").innerHTML = "Click and recharge<br>your energy again and again<br>with your HEART INTELLIGENCE";
            tempSprache = "en";
            localStorage.setItem("langEnergie", "en");
            localStorage.setItem("langEnergieText1", "Energy station");
            localStorage.setItem("langEnergieText2", "Click and recharge<br>your energy again and again<br>with your HEART INTELLIGENCE");
            break;
        case "es":
            document.getElementById("text1").innerHTML = "Tu estación de energía";
            document.getElementById("text2").innerHTML = "Haz clic y recarga<br>tu energía una y otra vez<br>con tu INTELIGENCIA DEL CORAZÓN";
            tempSprache = "es";
            localStorage.setItem("langEnergie", "es");
            localStorage.setItem("langEnergieText1", "Tu estación de energía");
            localStorage.setItem("langEnergieText2", "Haz clic y recarga<br>tu energía una y otra vez<br>con tu INTELIGENCIA DEL CORAZÓN");
            break;
        case "ru":
            document.getElementById("text1").innerHTML = "Ваша энергетическая станция";
            document.getElementById("text2").innerHTML = "Нажимай и снова и снова<br>заряжай свою энергию<br>с помощью ТВОЕГО ИНТЕЛЛЕКТА СЕРДЦА";
            tempSprache = "ru";
            localStorage.setItem("langEnergie", "ru");
            localStorage.setItem("langEnergieText1", "Ваша энергетическая станция");
            localStorage.setItem("langEnergieText2", "Нажимай и снова и снова<br>заряжай свою энергию<br>с помощью ТВОЕГО ИНТЕЛЛЕКТА СЕРДЦА");
            break;
        case "it":
            document.getElementById("text1").innerHTML = "Stazione di rifornimento di energia";
            document.getElementById("text2").innerHTML = "Clicca e ricarica<br>la tua energia più e più volte<br>con la tua INTELLIGENZA DEL CUORE";
            tempSprache = "it";
            localStorage.setItem("langEnergie", "it");
            localStorage.setItem("langEnergieText1", "Stazione di rifornimento di energia");
            localStorage.setItem("langEnergieText2", "Clicca e ricarica<br>la tua energia più e più volte<br>con la tua INTELLIGENZA DEL CUORE");
            break;
        case "pl":
            document.getElementById("text1").innerHTML = "Twoja stacja energetyczna";
            document.getElementById("text2").innerHTML = "Klikaj i wielokrotnie<br>ładuj swoją energię<br>za pomocą TWOJEJ INTELIGENCJI SERCA";
            tempSprache = "pl";
            localStorage.setItem("langEnergie", "pl");
            localStorage.setItem("langEnergieText1", "Twoja stacja energetyczna");
            localStorage.setItem("langEnergieText2", "Klikaj i wielokrotnie<br>ładuj swoją energię<br>za pomocą TWOJEJ INTELIGENCJI SERCA");
            break;
        case "tu":
            document.getElementById("text1").innerHTML = "Enerji istasyonunuz";
            document.getElementById("text2").innerHTML = "Tıkla ve tekrar tekrar<br>enerjini yenile<br>KALP ZEKÂN ile";
            tempSprache = "tu";
            localStorage.setItem("langEnergie", "tu");
            localStorage.setItem("langEnergieText1", "Enerji istasyonunuz");
            localStorage.setItem("langEnergieText2", "Tıkla ve tekrar tekrar<br>enerjini yenile<br>KALP ZEKÂN ile");
            break;
        case "vi":
            document.getElementById("text1").innerHTML = "Trạm năng lượng của bạn";
            document.getElementById("text2").innerHTML = "Nhấp và liên tục<br>nạp năng lượng cho bản thân<br>bằng TRÍ THÔNG MINH TRÁI TIM của bạn";
            tempSprache = "vi";
            localStorage.setItem("langEnergie", "vi");
            localStorage.setItem("langEnergieText1", "Trạm năng lượng của bạn");
            localStorage.setItem("langEnergieText2", "Nhấp và liên tục<br>nạp năng lượng cho bản thân<br>bằng TRÍ THÔNG MINH TRÁI TIM của bạn");
            break;
        case "ba":
            document.getElementById("text1").innerHTML = "তোমার বিদ্যুৎ কেন্দ্র";
            document.getElementById("text2").innerHTML = "ক্লিক করুন এবং বারবার<br>আপনার শক্তি পুনরায় পূরণ করুন<br>আপনার হৃদয়-বুদ্ধিমত্তার সাহায্যে";
            tempSprache = "ba";
            localStorage.setItem("langEnergie", "ba");
            localStorage.setItem("langEnergieText1", "তোমার বিদ্যুৎ কেন্দ্র");
            localStorage.setItem("langEnergieText2", "ক্লিক করুন এবং বারবার<br>আপনার শক্তি পুনরায় পূরণ করুন<br>আপনার হৃদয়-বুদ্ধিমত্তার সাহায্যে");
            break;
        case "un":
            document.getElementById("text1").innerHTML = "A te energiaállomásod";
            document.getElementById("text2").innerHTML = "Kattints, és újra meg újra<br>töltsd fel az energiádat<br>a SZÍV-INTELLIGENCIÁD segítségével";
            tempSprache = "un";
            localStorage.setItem("langEnergie", "un");
            localStorage.setItem("langEnergieText1", "A te energiaállomásod");
            localStorage.setItem("langEnergieText2", "Kattints, és újra meg újra<br>töltsd fel az energiádat<br>a SZÍV-INTELLIGENCIÁD segítségével");
            break;
        case "ukr":
            document.getElementById("text1").innerHTML = "Твоя енергетична заправка";
            document.getElementById("text2").innerHTML = "Клацай і знову і знову<br>поповнюй свою енергію<br>за допомогою ТВОГО ІНТЕЛЕКТУ СЕРЦЯ";
            tempSprache = "ukr";
            localStorage.setItem("langEnergie", "ukr");
            localStorage.setItem("langEnergieText1", "Твоя енергетична заправка");
            localStorage.setItem("langEnergieText2", "Клацай і знову і знову<br>поповнюй свою енергію<br>за допомогою ТВОГО ІНТЕЛЕКТУ СЕРЦЯ");
            break;
        case "china":
            document.getElementById("text1").innerHTML = "你的能量加油站";
            document.getElementById("text2").innerHTML = "点击并一次又一次地<br>为自己充能<br>用你的心智";
            tempSprache = "china";
            localStorage.setItem("langEnergie", "china");
            localStorage.setItem("langEnergieText1", "你的能量加油站");
            localStorage.setItem("langEnergieText2", "点击并一次又一次地<br>为自己充能<br>用你的心智");
            break;
        default:
            startBild(); // fallback auf lokale oder Standard-Sprache
    }
}
  //
var myInterval = setInterval(clickOnDocument, 10000)
function clickOnDocument() {
	var btn_klickbereich = document.getElementById('klickbereich');
	btn_klickbereich.click();       
	clearInterval(myInterval);  
	myInterval = setInterval(clickOnDocument, 20000);      
  }
;
  


//energieanzeigen
var btn_klickbereich = document.getElementById('klickbereich');
// wird durch tap press auch ausgelöst
btn_klickbereich.addEventListener('click', function(){
	//console.log("click");
	energieJetztAnzeigen(false);
	clearInterval(myInterval);  
	myInterval = setInterval(clickOnDocument, 20000);
})
var mc_klickbereich = new Hammer(btn_klickbereich);
mc_klickbereich.get('pan').set({});
// listen to events...
//mc_klickbereich.on("tap press", function (ev) {
	//console.log("tap press");
	//energieJetztAnzeigen(false);
	//clearInterval(myInterval); 
	//myInterval = setInterval(clickOnDocument, 20000); 
//});

//for all swipe
mc_klickbereich.on("swipe", function (ev) {
	//console.log("swipe");
	energieJetztAnzeigen(false);
	clearInterval(myInterval);  
	myInterval = setInterval(clickOnDocument, 20000);
});

//btn_german
var btn_german = document.getElementById('btn_deutsch');
var mc_german = new Hammer(btn_german);
mc_german.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_german.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "ENERGIETANKSTELLE";
	document.getElementById("text2").innerHTML = "Klicken und immer wieder<br>Energie auftanken mit deiner<br>HERZ-INTELLIGENZ";
	tempSprache = "de";
	localStorage.setItem("langEnergie", "de");
	localStorage.setItem("langEnergieText1", "ENERGIETANKSTELLE");
	localStorage.setItem("langEnergieText2", "Klicken und immer wieder<br>Energie auftanken mit deiner<br>HERZ-INTELLIGENZ");
});
//btn_english
var btn_english = document.getElementById('btn_englisch');
var mc_english = new Hammer(btn_english);
mc_english.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_english.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Energy station";
	document.getElementById("text2").innerHTML = "Click and recharge<br>your energy again and again<br>with your HEART INTELLIGENCE";
	tempSprache = "en";
	localStorage.setItem("langEnergie", "en");
	localStorage.setItem("langEnergieText1", "Energy station");
	localStorage.setItem("langEnergieText2", "Click and recharge<br>your energy again and again<br>with your HEART INTELLIGENCE");
});

//btn_italia
var btn_italia = document.getElementById('btn_italia');
var mc_italia = new Hammer(btn_italia);
mc_italia.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_italia.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Stazione di rifornimento di energia";
	document.getElementById("text2").innerHTML = "Clicca e ricarica<br>la tua energia più e più volte<br>con la tua INTELLIGENZA DEL CUORE";
	tempSprache = "it";
	localStorage.setItem("langEnergie", "it");
	localStorage.setItem("langEnergieText1", "Stazione di rifornimento di energia");
	localStorage.setItem("langEnergieText2", "Clicca e ricarica<br>la tua energia più e più volte<br>con la tua INTELLIGENZA DEL CUORE");
});

//btn_russian
var btn_russian = document.getElementById('btn_russian');
var mc_russian = new Hammer(btn_russian);
mc_russian.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_russian.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Ваша энергетическая станция";
	document.getElementById("text2").innerHTML = "Нажимай и снова и снова<br>заряжай свою энергию<br>с помощью ТВОЕГО ИНТЕЛЛЕКТА СЕРДЦА";
	tempSprache = "ru";
	localStorage.setItem("langEnergie", "ru");
	localStorage.setItem("langEnergieText1", "Ваша энергетическая станция");
	localStorage.setItem("langEnergieText2", "Нажимай и снова и снова<br>заряжай свою энергию<br>с помощью ТВОЕГО ИНТЕЛЛЕКТА СЕРДЦА");
});


//btn_polnisch
var btn_polnisch = document.getElementById('btn_polnisch');
var mc_polnisch = new Hammer(btn_polnisch);
mc_polnisch.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_polnisch.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Twoja stacja energetyczna";
	document.getElementById("text2").innerHTML = "Klikaj i wielokrotnie<br>ładuj swoją energię<br>za pomocą TWOJEJ INTELIGENCJI SERCA";
	tempSprache = "pl";
	localStorage.setItem("langEnergie", "pl");
	localStorage.setItem("langEnergieText1", "Twoja stacja energetyczna");
	localStorage.setItem("langEnergieText2", "Klikaj i wielokrotnie<br>ładuj swoją energię<br>za pomocą TWOJEJ INTELIGENCJI SERCA");
});
//btn_spanish
var btn_spanish = document.getElementById('btn_spanisch');
var mc_spanish = new Hammer(btn_spanish);
mc_spanish.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_spanish.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Tu estación de energía";
	document.getElementById("text2").innerHTML = "Haz clic y recarga<br>tu energía una y otra vez<br>con tu INTELIGENCIA DEL CORAZÓN";
	tempSprache = "es";
	localStorage.setItem("langEnergie", "es");
	localStorage.setItem("langEnergieText1", "Tu estación de energía");
	localStorage.setItem("langEnergieText2", "Haz clic y recarga<br>tu energía una y otra vez<br>con tu INTELIGENCIA DEL CORAZÓN");
});
//btn_turkiye
var btn_turkiye = document.getElementById('btn_turkiye');
var mc_turkiye = new Hammer(btn_turkiye);
mc_turkiye.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_turkiye.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Enerji istasyonunuz";
	document.getElementById("text2").innerHTML = "Tıkla ve tekrar tekrar<br>enerjini yenile<br>KALP ZEKÂN ile";
	tempSprache = "tu";
	localStorage.setItem("langEnergie", "tu");
	localStorage.setItem("langEnergieText1", "Enerji istasyonu");
	localStorage.setItem("langEnergieText2", "Tıkla ve tekrar tekrar<br>enerjini yenile<br>KALP ZEKÂN ile");
});
//btn_vietnam
var btn_vietnam = document.getElementById('btn_vietnam');
var mc_vietnam = new Hammer(btn_vietnam);
mc_vietnam.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_vietnam.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Trạm năng lượng của bạn";
	document.getElementById("text2").innerHTML = "Nhấp và liên tục<br>nạp năng lượng cho bản thân<br>bằng TRÍ THÔNG MINH TRÁI TIM của bạn";
	tempSprache = "vi";
	localStorage.setItem("langEnergie", "vi");
	localStorage.setItem("langEnergieText1", "Trạm năng lượng của bạn");
	localStorage.setItem("langEnergieText2", "Nhấp và liên tục<br>nạp năng lượng cho bản thân<br>bằng TRÍ THÔNG MINH TRÁI TIM của bạn");
});

//btn_bangla
var btn_bangla = document.getElementById('btn_bangla');
var mc_bangla = new Hammer(btn_bangla);
mc_bangla.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_bangla.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "তোমার বিদ্যুৎ কেন্দ্র";
	document.getElementById("text2").innerHTML = "ক্লিক করুন এবং বারবার<br>আপনার শক্তি পুনরায় পূরণ করুন<br>আপনার হৃদয়-বুদ্ধিমত্তার সাহায্যে";
	tempSprache = "ba";
	localStorage.setItem("langEnergie", "ba");
	localStorage.setItem("langEnergieText1", "তোমার বিদ্যুৎ কেন্দ্র");
	localStorage.setItem("langEnergieText2", "ক্লিক করুন এবং বারবার<br>আপনার শক্তি পুনরায় পূরণ করুন<br>আপনার হৃদয়-বুদ্ধিমত্তার সাহায্যে");
});

//btn_ungarn
var btn_ungarn = document.getElementById('btn_ungarn');
var mc_ungarn = new Hammer(btn_ungarn);
mc_ungarn.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_ungarn.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "A te energiaállomásod";
	document.getElementById("text2").innerHTML = "Kattints, és újra meg újra<br>töltsd fel az energiádat<br>a SZÍV-INTELLIGENCIÁD segítségével";
	tempSprache = "un";
	localStorage.setItem("langEnergie", "un");
	localStorage.setItem("langEnergieText1", "A te energiaállomásod");
	localStorage.setItem("langEnergieText2", "Kattints, és újra meg újra<br>töltsd fel az energiádat<br>a SZÍV-INTELLIGENCIÁD segítségével");
});

//btn_ukraine
var btn_ukraine = document.getElementById('btn_ukraine');
var mc_ukraine = new Hammer(btn_ukraine);
mc_ukraine.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_ukraine.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Твоя енергетична заправка";
	document.getElementById("text2").innerHTML = "Клацай і знову і знову<br>поповнюй свою енергію<br>за допомогою ТВОГО ІНТЕЛЕКТУ СЕРЦЯ";
	tempSprache = "ukr";
	localStorage.setItem("langEnergie", "ukr");
	localStorage.setItem("langEnergieText1", "Твоя енергетична заправка");
	localStorage.setItem("langEnergieText2", "Клацай і знову і знову<br>поповнюй свою енергію<br>за допомогою ТВОГО ІНТЕЛЕКТУ СЕРЦЯ");
});

//btn_china
var btn_china = document.getElementById('btn_china');
var mc_china = new Hammer(btn_china);
mc_china.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_china.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "你的能量加油站";
	document.getElementById("text2").innerHTML = "点击并一次又一次地<br>为自己充能<br>用你的心智";
	tempSprache = "china";
	localStorage.setItem("langEnergie", "china");
	localStorage.setItem("langEnergieText1", "你的能量加油站");
	localStorage.setItem("langEnergieText2", "点击并一次又一次地<br>为自己充能<br>用你的心智");
});

//end language

var meinBild;
var meinBildVorher;

var zahl;
var zahl1;
//motivationText is from language.js
var sprachArray = motivationText;
var countText = sprachArray.length;

var buttonstyle = ["alert alert-success", "alert alert-danger", "alert alert-info"];
var countbutton = buttonstyle.length;
//var schriftstyle = ["Tangerine", "Dancing Script", "Roboto"];
//var schriftstyle = ["Tangerine"];
var schriftstyle = ["Arial"];

var countschrift = schriftstyle.length;

var tempSatzOld;

function rand(min, max) {
	"use strict";
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loescheElement(element) {
	"use strict";
	if (element) {
		var papa = element.parentNode;
		papa.removeChild(element);
	}
}

var myColor = ["#9e0976","#000e9e", "#009e00"];

//#f39c12

var mySelectedBack;
var textfarbe, schriftart, selected;

function energieAnzeigen(tempSelected) {
	//console.log(tempStartseite);
	if (tempStartseite === false) {
		document.getElementById("moti").innerHTML = tempSelected;

		//farbe

		document.getElementById("farbe").className = buttonstyle[rand(0, countbutton - 1)];
		textfarbe = myColor[rand(0, myColor.length - 1)];
		//alert(textfarbe);

		document.getElementById("farbe").style.color = textfarbe;
		document.getElementById("farbe").style.borderColor = textfarbe;

		//document.getElementById("moti").style.borderColor = textfarbe;
		//ende farbe

		document.getElementById("moti").style.fontFamily = schriftart;

		loescheElement(document.getElementById("startJetzt"));
		loescheElement(document.getElementById("startJetztBild"));
		loescheElement(document.getElementById("sprache"));
		loescheElement(document.getElementById("sprache1"));
		loescheElement(document.getElementById("sprache2"));
		loescheElement(document.getElementById("buttonInfo"));
	}
	//document.getElementById("startJetzt").style.display = 'none';
}

var tempSatzOld;
var tempBildOld;
var bildNeu = true;

function energieJetztAnzeigen(boolAnzeige) {
	// console.log("jetzt wird neu angezeigt");
	"use strict";
	if (boolAnzeige === false) {
		tempStartseite = false;
	}
	//neu...vorheriges Bild
	//mySelectedBack = selected;
	textfarbe = buttonstyle[rand(0, countbutton - 1)];
	schriftart = schriftstyle[rand(0, countschrift - 1)];

	//sprache auswählen
	if (tempSprache === "de") {
		sprachArray = motivationText;
		countText = sprachArray.length;
	}

	if (tempSprache === "en") {
		sprachArray = motivationTextEn;
		countText = sprachArray.length;
	}

	if (tempSprache === "es") {
		sprachArray = motivationTextEs;
		countText = sprachArray.length;
	}

	if (tempSprache === "pl") {
		sprachArray = motivationTextPL;
		countText = sprachArray.length;
	}

	if (tempSprache === "it") {
		sprachArray = motivationTextIt;
		countText = sprachArray.length;
	}

	if (tempSprache === "ru") {
		sprachArray = motivationTextRu;
		countText = sprachArray.length;
	}

	if (tempSprache === "tu") {
		sprachArray = motivationTextTu;
		countText = sprachArray.length;
	}

	if (tempSprache === "vi") {
		sprachArray = motivationTextVi;
		countText = sprachArray.length;
	}

	if (tempSprache === "ba") {
		sprachArray = motivationTextBa;
		countText = sprachArray.length;
	}

	if (tempSprache === "un") {
		sprachArray = motivationTextUn;
		countText = sprachArray.length;
	}

	if (tempSprache === "ukr") {
		sprachArray = motivationTextUkr;
		countText = sprachArray.length;
	}

	if (tempSprache === "china") {
		sprachArray = motivationTextChina;
		countText = sprachArray.length;
	}
	selected = sprachArray[rand(0, countText - 1)];
	if (selected == tempSatzOld) {
		selected = sprachArray[rand(0, countText - 1)];
	} else {
		tempSatzOld = selected;
	}

	if (selected.slice(0, 2) === "no") {
		selected = selected.slice(2, selected.length);
	} else {

		//Grossbuchstaben
		selected = selected.toUpperCase();
		//end Grossbuchstaben
		//selected = selected + motivationBild[Math.random() * countBild | 0];
		zahl = rand(minBild, maxBild);
		if (zahl == tempBildOld) {
			zahl = rand(minBild, maxBild);
		} else {
			tempBildOld = zahl;
		}		
		// 9.1.2025 das das neueste Bild am Anfang angezeigt wird
		if(bildNeu){
			zahl = rand(maxBild, maxBild);
			bildNeu= false;
			//console.log("AKTUELLES STARTBILD: " + zahl)
		}
		console.log(selected);

		meinBild = "<img src='img/t" + zahl + ".jpg' class='img-circle'>";
		zahl1 = rand(1, 2);
		if (zahl1 === 1) {
			selected = selected + "&nbsp;" + meinBild;
		} else {
			selected = meinBild + "&nbsp;" + selected;
		}
	}

	

	energieAnzeigen(selected);

	//document.getElementById("info").innerHTML = textfarbe;
}

var tempInfo1;
var tempInfo2;

function startBild() {
	"use strict";
	tempStartseite = true;
	if (localStorage.getItem("langEnergie") == null) {
		localStorage.setItem("langEnergie", "de");
		localStorage.setItem("langEnergieText1", "ENERGIETANKSTELLE");
		localStorage.setItem("langEnergieText2", "Klicken und immer wieder<br>Energie auftanken mit deiner<br>HERZ-INTELLIGENZ");
	}
	tempSprache = localStorage.getItem("langEnergie");
	//alert(tempSprache);
	tempInfo1 = localStorage.getItem("langEnergieText1");
	//alert(tempInfo1);
	tempInfo2 = localStorage.getItem("langEnergieText2");
	//alert(tempInfo2);
	document.getElementById("text1").innerHTML = tempInfo1;
	document.getElementById("text2").innerHTML = tempInfo2;

	//zahl = rand(1, 3);
	//meinBild = "img/t" + zahl + ".jpg";
	//ocument.getElementById("startJetztBild").setAttribute("src", //meinBild);
	document.getElementById("startJetzt").style.backgroundColor = "white";
	document.getElementById("startJetzt").style.color = "#9e0976";
}

// Am Seitenstart prüfen
window.addEventListener('DOMContentLoaded', function() {
	console.log("DOMCONTENTLOADED");
    const langParam = getLangFromURL();
    if (langParam) {
		console.log("Sprach-Paramter übergeben " + langParam);
        setLanguage(langParam); // Sprache aus URL setzen
    } else {
        console.log("Keine Param übergeben");
		startBild(); // fallback auf lokale Spracheinstellung
    }
});
