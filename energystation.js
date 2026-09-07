/*jslint browser: true, sloppy: true*/

var tempStartseite = true;
var minBild = 1;
var maxBild = 327;
var tempSprache;

// ==================== UI-Texte "Eigene Bilder & Texte": mehrsprachig ====================
// Liefert einen einzelnen UI-Text aus dem ownContentUI-Wörterbuch
// (languages.js) für die aktuell aktive Sprache. Fällt auf "de" zurück,
// solange noch keine Sprache gewählt wurde (tempSprache ist dann
// undefined) bzw. falls ein Sprachcode im Wörterbuch fehlen sollte.
// Platzhalter wie "{max}" oder "{n}" werden über das optionale
// vars-Objekt ersetzt, z.B. eigeneInhalteText("feedbackMaxBilder", { max: 20 }).
function eigeneInhalteText(key, vars) {
	var lang = tempSprache || localStorage.getItem("langEnergie") || "de";
	var dict = (window.ownContentUI && (window.ownContentUI[lang] || window.ownContentUI.de)) || {};
	var text = dict[key];
	if (text === undefined) return "";
	if (vars) {
		Object.keys(vars).forEach(function (k) {
			text = text.replace("{" + k + "}", vars[k]);
		});
	}
	return text;
}

// Setzt alle Oberflächen-Texte des "Eigene Bilder & Texte"-Popups sowie des
// zugehörigen "Sichern & Wiederherstellen"-Popups auf die übergebene
// Sprache. Wird von setLanguage() UND von jedem der 12 Flaggen-Buttons
// aufgerufen, damit beide Wege zur Sprachwahl das Popup gleichermaßen
// übersetzen. Die eigentliche Arbeit übernimmt ein Callback, den die
// DOMContentLoaded-Closure weiter unten registriert (dort liegen bereits
// alle Element-Referenzen und die Render-Funktionen der Listen).
function wendeEigeneInhalteSpracheAn(lang) {
	if (typeof window.__eigeneInhalteSpracheAnwenden === "function") {
		window.__eigeneInhalteSpracheAnwenden(lang);
	}
}

// --- AUTOMATISCHE SPRACHWAHL AUS URL ---
function getLangFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lang'); // z.B. "es", "ru"
}

// --- Funktion, um Sprache direkt zu setzen ---
function setLanguage(langCode) {
    switch (langCode) {
        case "de":
            document.getElementById("text1").innerHTML = "ENERGIE TANKSTELLE<br><img src='img/energietankstelle_1.png'>";
            document.getElementById("text2").innerHTML = "unendlich klicken...";
            tempSprache = "de";
            wendeEigeneInhalteSpracheAn("de");
            localStorage.setItem("langEnergie", "de");
            localStorage.setItem("langEnergieText1", "ENERGIE TANKSTELLE<br><img src='img/energietankstelle_1.png'>");
            localStorage.setItem("langEnergieText2", "unendlich klicken...");
            break;
        case "en":
            document.getElementById("text1").innerHTML = "Energy station<br><img src='img/energietankstelle_1.png'>";
            document.getElementById("text2").innerHTML = "Click and recharge<br>your energy again and again<br>with your<br>HEART INTELLIGENCE";
            tempSprache = "en";
            wendeEigeneInhalteSpracheAn("en");
            localStorage.setItem("langEnergie", "en");
            localStorage.setItem("langEnergieText1", "Energy station<br><img src='img/energietankstelle_1.png'>");
            localStorage.setItem("langEnergieText2", "Click and recharge<br>your energy again and again<br>with your<br>HEART INTELLIGENCE");
            break;
        case "es":
            document.getElementById("text1").innerHTML = "Tu estación de energía<br><img src='img/energietankstelle_1.png'>";
            document.getElementById("text2").innerHTML = "Haz clic y recarga<br>tu energía una y otra vez<br>con tu<br>INTELIGENCIA DEL CORAZÓN";
            tempSprache = "es";
            wendeEigeneInhalteSpracheAn("es");
            localStorage.setItem("langEnergie", "es");
            localStorage.setItem("langEnergieText1", "Tu estación de energía<br><img src='img/energietankstelle_1.png'>");
            localStorage.setItem("langEnergieText2", "Haz clic y recarga<br>tu energía una y otra vez<br>con tu<br>INTELIGENCIA DEL CORAZÓN");
            break;
        case "ru":
            document.getElementById("text1").innerHTML = "Ваша энергетическая станция<br><img src='img/energietankstelle_1.png'>";
            document.getElementById("text2").innerHTML = "Нажимай и снова и снова<br>заряжай свою энергию<br>с помощью<br>ТВОЕГО ИНТЕЛЛЕКТА СЕРДЦА";
            tempSprache = "ru";
            wendeEigeneInhalteSpracheAn("ru");
            localStorage.setItem("langEnergie", "ru");
            localStorage.setItem("langEnergieText1", "Ваша энергетическая станция<br><img src='img/energietankstelle_1.png'>");
            localStorage.setItem("langEnergieText2", "Нажимай и снова и снова<br>заряжай свою энергию<br>с помощью<br>ТВОЕГО ИНТЕЛЛЕКТА СЕРДЦА");
            break;
        case "it":
            document.getElementById("text1").innerHTML = "Stazione di rifornimento di energia<br><img src='img/energietankstelle_1.png'>";
            document.getElementById("text2").innerHTML = "Clicca e ricarica<br>la tua energia più e più volte<br>con la tua<br>INTELLIGENZA DEL CUORE";
            tempSprache = "it";
            wendeEigeneInhalteSpracheAn("it");
            localStorage.setItem("langEnergie", "it");
            localStorage.setItem("langEnergieText1", "Stazione di rifornimento di energia<br><img src='img/energietankstelle_1.png'>");
            localStorage.setItem("langEnergieText2", "Clicca e ricarica<br>la tua energia più e più volte<br>con la tua<br>INTELLIGENZA DEL CUORE");
            break;
        case "pl":
            document.getElementById("text1").innerHTML = "Twoja stacja energetyczna<br><img src='img/energietankstelle_1.png'>";
            document.getElementById("text2").innerHTML = "Klikaj i wielokrotnie<br>ładuj swoją energię<br>za pomocą<br>TWOJEJ INTELIGENCJI SERCA";
            tempSprache = "pl";
            wendeEigeneInhalteSpracheAn("pl");
            localStorage.setItem("langEnergie", "pl");
            localStorage.setItem("langEnergieText1", "Twoja stacja energetyczna<br><img src='img/energietankstelle_1.png'>");
            localStorage.setItem("langEnergieText2", "Klikaj i wielokrotnie<br>ładuj swoją energię<br>za pomocą<br>TWOJEJ INTELIGENCJI SERCA");
            break;
        case "tu":
            document.getElementById("text1").innerHTML = "Enerji istasyonunuz<br><img src='img/energietankstelle_1.png'>";
            document.getElementById("text2").innerHTML = "Tıkla ve tekrar tekrar<br>enerjini yenile<br>KALP ZEKÂN ile";
            tempSprache = "tu";
            wendeEigeneInhalteSpracheAn("tu");
            localStorage.setItem("langEnergie", "tu");
            localStorage.setItem("langEnergieText1", "Enerji istasyonunuz<br><img src='img/energietankstelle_1.png'>");
            localStorage.setItem("langEnergieText2", "Tıkla ve tekrar tekrar<br>enerjini yenile<br>KALP ZEKÂN ile");
            break;
        case "vi":
            document.getElementById("text1").innerHTML = "Trạm năng lượng của bạn<br><img src='img/energietankstelle_1.png'>";
            document.getElementById("text2").innerHTML = "Nhấp và liên tục<br>nạp năng lượng cho bản thân<br>bằng TRÍ THÔNG MINH TRÁI TIM<br>của bạn";
            tempSprache = "vi";
            wendeEigeneInhalteSpracheAn("vi");
            localStorage.setItem("langEnergie", "vi");
            localStorage.setItem("langEnergieText1", "Trạm năng lượng của bạn<br><img src='img/energietankstelle_1.png'>");
            localStorage.setItem("langEnergieText2", "Nhấp và liên tục<br>nạp năng lượng cho bản thân<br>bằng TRÍ THÔNG MINH TRÁI TIM<br>của bạn");
            break;
        case "ba":
            document.getElementById("text1").innerHTML = "তোমার বিদ্যুৎ কেন্দ্র<br><img src='img/energietankstelle_1.png'>";
            document.getElementById("text2").innerHTML = "ক্লিক করুন এবং বারবার<br>আপনার শক্তি পুনরায় পূরণ করুন<br>আপনার হৃদয়-বুদ্ধিমত্তার সাহায্যে";
            tempSprache = "ba";
            wendeEigeneInhalteSpracheAn("ba");
            localStorage.setItem("langEnergie", "ba");
            localStorage.setItem("langEnergieText1", "তোমার বিদ্যুৎ কেন্দ্র<br><img src='img/energietankstelle_1.png'>");
            localStorage.setItem("langEnergieText2", "ক্লিক করুন এবং বারবার<br>আপনার শক্তি পুনরায় পূরণ করুন<br>আপনার হৃদয়-বুদ্ধিমত্তার সাহায্যে");
            break;
        case "un":
            document.getElementById("text1").innerHTML = "A te energiaállomásod<br><img src='img/energietankstelle_1.png'>";
            document.getElementById("text2").innerHTML = "Kattints, és újra meg újra<br>töltsd fel az energiádat<br>a SZÍV-INTELLIGENCIÁD<br>segítségével";
            tempSprache = "un";
            wendeEigeneInhalteSpracheAn("un");
            localStorage.setItem("langEnergie", "un");
            localStorage.setItem("langEnergieText1", "A te energiaállomásod<br><img src='img/energietankstelle_1.png'>");
            localStorage.setItem("langEnergieText2", "Kattints, és újra meg újra<br>töltsd fel az energiádat<br>a SZÍV-INTELLIGENCIÁD<br>segítségével");
            break;
        case "ukr":
            document.getElementById("text1").innerHTML = "Твоя енергетична заправка<br><img src='img/energietankstelle_1.png'>";
            document.getElementById("text2").innerHTML = "Клацай і знову і знову<br>поповнюй свою енергію<br>за допомогою<br>ТВОГО ІНТЕЛЕКТУ СЕРЦЯ";
            tempSprache = "ukr";
            wendeEigeneInhalteSpracheAn("ukr");
            localStorage.setItem("langEnergie", "ukr");
            localStorage.setItem("langEnergieText1", "Твоя енергетична заправка<br><img src='img/energietankstelle_1.png'>");
            localStorage.setItem("langEnergieText2", "Клацай і знову і знову<br>поповнюй свою енергію<br>за допомогою<br>ТВОГО ІНТЕЛЕКТУ СЕРЦЯ");
            break;
        case "china":
            document.getElementById("text1").innerHTML = "你的能量加油站<br><img src='img/energietankstelle_1.png'>";
            document.getElementById("text2").innerHTML = "点击并一次又一次地<br>为自己充能<br>用你的心智";
            tempSprache = "china";
            wendeEigeneInhalteSpracheAn("china");
            localStorage.setItem("langEnergie", "china");
            localStorage.setItem("langEnergieText1", "你的能量加油站<br><img src='img/energietankstelle_1.png'>");
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

// Auto-Klick pausieren, solange die Seite nicht sichtbar ist (Tab im
// Hintergrund, Bildschirm aus, andere App im Vordergrund) ODER solange ein
// Teilen-Vorgang läuft (window.shareInProgress, siehe teileAktuellesBild).
// Vorher lief der Timer für immer weiter und hat alle 10-20s DOM-Arbeit
// (und früher auch teure Screenshots) ausgelöst, obwohl niemand zusehen
// konnte bzw. gerade der native Teilen-Dialog offen war - das erhöht den
// Ressourcenverbrauch unnötig und kann dazu führen, dass die App während
// des Teilens unbemerkt weiterläuft/wegklickt.
function autoKlickPausieren() {
	clearInterval(myInterval);
}

function autoKlickFortsetzenFallsErlaubt() {
	clearInterval(myInterval);
	if (document.hidden || window.shareInProgress) {
		return;
	}
	myInterval = setInterval(clickOnDocument, 20000);
}

document.addEventListener('visibilitychange', function () {
	if (document.hidden) {
		autoKlickPausieren();
	} else {
		autoKlickFortsetzenFallsErlaubt();
	}
});
  


//energieanzeigen
var btn_klickbereich = document.getElementById('klickbereich');
// wird durch tap press auch ausgelöst
btn_klickbereich.addEventListener('click', function(){
	//console.log("click");
	energieJetztAnzeigen(false);
	autoKlickFortsetzenFallsErlaubt();
})
var mc_klickbereich = new Hammer(btn_klickbereich);
// Pan-Recognizer entfernt: wurde nirgends ausgewertet, hat aber den ersten
// Touch auf Android manchmal als Pan-Start statt als Tap interpretiert.
// Nur "swipe" wird tatsächlich gebraucht (siehe unten).
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
	autoKlickFortsetzenFallsErlaubt();
});

//btn_german
var btn_german = document.getElementById('btn_deutsch');
var mc_german = new Hammer(btn_german);
mc_german.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_german.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "ENERGIE TANKSTELLE<br><img src='img/energietankstelle_1.png'>";
	document.getElementById("text2").innerHTML = "unendlich klicken...";
	tempSprache = "de";
	wendeEigeneInhalteSpracheAn("de");
	localStorage.setItem("langEnergie", "de");
	localStorage.setItem("langEnergieText1", "ENERGIE TANKSTELLE<br><img src='img/energietankstelle_1.png'>");
	localStorage.setItem("langEnergieText2", "unendlich klicken...");
});
//btn_english
var btn_english = document.getElementById('btn_englisch');
var mc_english = new Hammer(btn_english);
mc_english.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_english.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Energy station<br><img src='img/energietankstelle_1.png'>";
	document.getElementById("text2").innerHTML = "Click and recharge<br>your energy again and again<br>with your<br>HEART INTELLIGENCE";
	tempSprache = "en";
	wendeEigeneInhalteSpracheAn("en");
	localStorage.setItem("langEnergie", "en");
	localStorage.setItem("langEnergieText1", "Energy station<br><img src='img/energietankstelle_1.png'>");
	localStorage.setItem("langEnergieText2", "Click and recharge<br>your energy again and again<br>with your<br>HEART INTELLIGENCE");
});

//btn_italia
var btn_italia = document.getElementById('btn_italia');
var mc_italia = new Hammer(btn_italia);
mc_italia.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_italia.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Stazione di rifornimento di energia<br><img src='img/energietankstelle_1.png'>";
	document.getElementById("text2").innerHTML = "Clicca e ricarica<br>la tua energia più e più volte<br>con la tua<br>INTELLIGENZA DEL CUORE";
	tempSprache = "it";
	wendeEigeneInhalteSpracheAn("it");
	localStorage.setItem("langEnergie", "it");
	localStorage.setItem("langEnergieText1", "Stazione di rifornimento di energia<br><img src='img/energietankstelle_1.png'>");
	localStorage.setItem("langEnergieText2", "Clicca e ricarica<br>la tua energia più e più volte<br>con la tua<br>INTELLIGENZA DEL CUORE");
});

//btn_russian
var btn_russian = document.getElementById('btn_russian');
var mc_russian = new Hammer(btn_russian);
mc_russian.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_russian.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Ваша энергетическая станция<br><img src='img/energietankstelle_1.png'>";
	document.getElementById("text2").innerHTML = "Нажимай и снова и снова<br>заряжай свою энергию<br>с помощью<br>ТВОЕГО ИНТЕЛЛЕКТА СЕРДЦА";
	tempSprache = "ru";
	wendeEigeneInhalteSpracheAn("ru");
	localStorage.setItem("langEnergie", "ru");
	localStorage.setItem("langEnergieText1", "Ваша энергетическая станция<br><img src='img/energietankstelle_1.png'>");
	localStorage.setItem("langEnergieText2", "Нажимай и снова и снова<br>заряжай свою энергию<br>с помощью<br>ТВОЕГО ИНТЕЛЛЕКТА СЕРДЦА");
});


//btn_polnisch
var btn_polnisch = document.getElementById('btn_polnisch');
var mc_polnisch = new Hammer(btn_polnisch);
mc_polnisch.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_polnisch.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Twoja stacja energetyczna<br><img src='img/energietankstelle_1.png'>";
	document.getElementById("text2").innerHTML = "Klikaj i wielokrotnie<br>ładuj swoją energię<br>za pomocą<br>TWOJEJ INTELIGENCJI SERCA";
	tempSprache = "pl";
	wendeEigeneInhalteSpracheAn("pl");
	localStorage.setItem("langEnergie", "pl");
	localStorage.setItem("langEnergieText1", "Twoja stacja energetyczna<br><img src='img/energietankstelle_1.png'>");
	localStorage.setItem("langEnergieText2", "Klikaj i wielokrotnie<br>ładuj swoją energię<br>za pomocą<br>TWOJEJ INTELIGENCJI SERCA");
});
//btn_spanish
var btn_spanish = document.getElementById('btn_spanisch');
var mc_spanish = new Hammer(btn_spanish);
mc_spanish.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_spanish.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Tu estación de energía<br><img src='img/energietankstelle_1.png'>";
	document.getElementById("text2").innerHTML = "Haz clic y recarga<br>tu energía una y otra vez<br>con tu<br>INTELIGENCIA DEL CORAZÓN";
	tempSprache = "es";
	wendeEigeneInhalteSpracheAn("es");
	localStorage.setItem("langEnergie", "es");
	localStorage.setItem("langEnergieText1", "Tu estación de energía<br><img src='img/energietankstelle_1.png'>");
	localStorage.setItem("langEnergieText2", "Haz clic y recarga<br>tu energía una y otra vez<br>con tu<br>INTELIGENCIA DEL CORAZÓN");
});
//btn_turkiye
var btn_turkiye = document.getElementById('btn_turkiye');
var mc_turkiye = new Hammer(btn_turkiye);
mc_turkiye.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_turkiye.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Enerji istasyonunuz<br><img src='img/energietankstelle_1.png'>";
	document.getElementById("text2").innerHTML = "Tıkla ve tekrar tekrar<br>enerjini yenile<br>KALP ZEKÂN ile";
	tempSprache = "tu";
	wendeEigeneInhalteSpracheAn("tu");
	localStorage.setItem("langEnergie", "tu");
	localStorage.setItem("langEnergieText1", "Enerji istasyonu<br><img src='img/energietankstelle_1.png'>");
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
	document.getElementById("text1").innerHTML = "Trạm năng lượng của bạn<br><img src='img/energietankstelle_1.png'>";
	document.getElementById("text2").innerHTML = "Nhấp và liên tục<br>nạp năng lượng cho bản thân<br>bằng<br>TRÍ THÔNG MINH TRÁI TIM<br>của bạn";
	tempSprache = "vi";
	wendeEigeneInhalteSpracheAn("vi");
	localStorage.setItem("langEnergie", "vi");
	localStorage.setItem("langEnergieText1", "Trạm năng lượng của bạn<br><img src='img/energietankstelle_1.png'>");
	localStorage.setItem("langEnergieText2", "Nhấp và liên tục<br>nạp năng lượng cho bản thân<br>bằng<br>TRÍ THÔNG MINH TRÁI TIM<br>của bạn");
});

//btn_bangla
var btn_bangla = document.getElementById('btn_bangla');
var mc_bangla = new Hammer(btn_bangla);
mc_bangla.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_bangla.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "তোমার বিদ্যুৎ কেন্দ্র<br><img src='img/energietankstelle_1.png'>";
	document.getElementById("text2").innerHTML = "ক্লিক করুন এবং বারবার<br>আপনার শক্তি পুনরায় পূরণ করুন<br>আপনার হৃদয়-বুদ্ধিমত্তার সাহায্যে";
	tempSprache = "ba";
	wendeEigeneInhalteSpracheAn("ba");
	localStorage.setItem("langEnergie", "ba");
	localStorage.setItem("langEnergieText1", "তোমার বিদ্যুৎ কেন্দ্র<br><img src='img/energietankstelle_1.png'>");
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
	document.getElementById("text1").innerHTML = "A te energiaállomásod<br><img src='img/energietankstelle_1.png'>";
	document.getElementById("text2").innerHTML = "Kattints, és újra meg újra<br>töltsd fel az energiádat<br>a SZÍV-INTELLIGENCIÁD<br>segítségével";
	tempSprache = "un";
	wendeEigeneInhalteSpracheAn("un");
	localStorage.setItem("langEnergie", "un");
	localStorage.setItem("langEnergieText1", "A te energiaállomásod<br><img src='img/energietankstelle_1.png'>");
	localStorage.setItem("langEnergieText2", "Kattints, és újra meg újra<br>töltsd fel az energiádat<br>a SZÍV-INTELLIGENCIÁD<br>segítségével");
});

//btn_ukraine
var btn_ukraine = document.getElementById('btn_ukraine');
var mc_ukraine = new Hammer(btn_ukraine);
mc_ukraine.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_ukraine.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "Твоя енергетична заправка<br><img src='img/energietankstelle_1.png'>";
	document.getElementById("text2").innerHTML = "Клацай і знову і знову<br>поповнюй свою енергію<br>за допомогою<br>ТВОГО ІНТЕЛЕКТУ СЕРЦЯ";
	tempSprache = "ukr";
	wendeEigeneInhalteSpracheAn("ukr");
	localStorage.setItem("langEnergie", "ukr");
	localStorage.setItem("langEnergieText1", "Твоя енергетична заправка<br><img src='img/energietankstelle_1.png'>");
	localStorage.setItem("langEnergieText2", "Клацай і знову і знову<br>поповнюй свою енергію<br>за допомогою<br>ТВОГО ІНТЕЛЕКТУ СЕРЦЯ");
});

//btn_china
var btn_china = document.getElementById('btn_china');
var mc_china = new Hammer(btn_china);
mc_china.get('pan').set({
	direction: Hammer.DIRECTION_ALL
});
// listen to events...
mc_china.on("panleft panright panup pandown tap press", function (ev) {
	document.getElementById("text1").innerHTML = "你的能量加油站<br><img src='img/energietankstelle_1.png'>";
	document.getElementById("text2").innerHTML = "点击并一次又一次地<br>为自己充能<br>用你的心智";
	tempSprache = "china";
	wendeEigeneInhalteSpracheAn("china");
	localStorage.setItem("langEnergie", "china");
	localStorage.setItem("langEnergieText1", "你的能量加油站<br><img src='img/energietankstelle_1.png'>");
	localStorage.setItem("langEnergieText2", "点击并一次又一次地<br>为自己充能<br>用你的心智");
});

//end language

var meinBild;
var meinBildVorher;

var zahl;
var zahl1;

// --- für Teilen-Funktion ---
var SHARE_BUTTON_AKTIV = true;
var currentShareText = "";
var currentShareImageUrl = null;

// Vorgerendertes Share-Bild: wird im Hintergrund erzeugt, sobald ein neuer
// Spruch/Bild angezeigt wird (statt erst beim Klick auf "Teilen"). So liegt
// beim tatsächlichen Klick meist schon eine fertige Datei bereit und
// navigator.share() kann sofort/synchron aufgerufen werden - vorher ging
// zwischen Klick und navigator.share() oft so viel Zeit durch den teuren
// html2canvas-Aufruf verloren, dass die für Web-Share nötige "User-
// Aktivierung" auf manchen (v.a. langsameren Android-)Geräten schon
// abgelaufen war. Das führte dazu, dass der erste Klick scheinbar nichts
// tat (navigator.share() wurde mit NotAllowedError abgelehnt) und erst der
// zweite Klick funktionierte.
var cachedShareFile = null;
var sharePrerenderPromise = null;
var sharePrerenderIdleId = null;
var sharePrerenderTimeoutId = null;

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

		// Share-Button erst jetzt anzeigen, da vorher noch kein Bild/Spruch existiert
		// TEMPORÄR DEAKTIVIERT (siehe SHARE_BUTTON_AKTIV weiter oben): Button
		// bleibt ausgeblendet, bis die Android-Instabilität geklärt ist.
		// "Eigene Bilder & Texte"-Button erst jetzt anzeigen - wie der
		// Teilen-Button soll er nicht schon auf dem Startbildschirm
		// erscheinen, sondern erst nachdem zum ersten Mal geklickt wurde.
		var btnEigeneReveal = document.getElementById("btn_eigene");
		if (btnEigeneReveal) {
			btnEigeneReveal.style.display = "";
		}

		if (SHARE_BUTTON_AKTIV) {
			var btnShare = document.getElementById("btn_share");
			if (btnShare) {
				btnShare.style.display = "";
			}

			// Share-Bild für den aktuell sichtbaren Spruch/Bild im Hintergrund
			// vorbereiten (siehe Kommentar bei den Variablen oben).
			schedulePrerenderShareImage();
		}
	}
	//document.getElementById("startJetzt").style.display = 'none';
}

var tempSatzOld;
var tempBildOld;
var bildNeu = true;

// ==================== Eigene Bilder & Sprüche ====================
// Eigene Bilder und eigene Sprüche werden komplett unabhängig voneinander
// verwaltet und gezogen - genau wie die Standard-Bilder (t1...t327.jpg) und
// die Standard-Sprüche (sprachArray) schon immer unabhängig kombiniert
// wurden. Beide eigenen Pools liegen nur lokal im Browser (localStorage).
var EIGENE_BILDER_KEY = "eigeneBilder";
var EIGENE_BILDER_QUEUE_KEY = "eigeneBilderQueue";
var EIGENE_SPRUECHE_KEY = "eigeneSprueche";
var EIGENE_SPRUECHE_QUEUE_KEY = "eigeneSpruecheQueue";

var EIGENE_BILDER_MAX = 20;
var EIGENE_SPRUECHE_MAX = 50;
var EIGENE_SPRUCH_MAX_LAENGE = 500;
var EIGENE_BILD_MAX_EDGE = 1000;
var EIGENE_BILD_QUALITY = 0.8;
// Chance, dass ein eigenes Bild bzw. ein eigener Spruch gezogen wird,
// sobald die Warteschlange "frisch hinzugefügt" leer ist. 30% = spürbar
// bevorzugt, aber nicht dominant - unabhängig davon, wie viele Standard-
// bzw. eigene Einträge es jeweils gibt.
var EIGENE_GEWICHT = 0.3;

function ladeJSON(key, fallback) {
	"use strict";
	try {
		var raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch (e) {
		return fallback;
	}
}

function speichereJSON(key, value) {
	"use strict";
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (e) {
		console.error("Speichern fehlgeschlagen (" + key + "):", e);
		return false;
	}
}

function ladeEigeneBilder() { return ladeJSON(EIGENE_BILDER_KEY, []); }
function ladeEigeneBilderQueue() { return ladeJSON(EIGENE_BILDER_QUEUE_KEY, []); }
function ladeEigeneSprueche() { return ladeJSON(EIGENE_SPRUECHE_KEY, []); }
function ladeEigeneSpruecheQueue() { return ladeJSON(EIGENE_SPRUECHE_QUEUE_KEY, []); }

// Verkleinert/komprimiert ein hochgeladenes eigenes Bild client-seitig
// (max. 1000px lange Kante, JPEG-Qualität 0.8), bevor es im localStorage
// abgelegt wird - so bleiben auch mehrere Bilder zusammen mit den übrigen
// App-Daten sicher innerhalb des Speicherlimits.
function komprimiereEigenesBild(file, maxEdge, quality) {
	"use strict";
	maxEdge = maxEdge || EIGENE_BILD_MAX_EDGE;
	quality = quality || EIGENE_BILD_QUALITY;
	return new Promise(function (resolve, reject) {
		var reader = new FileReader();
		reader.onload = function () {
			var img = new Image();
			img.onload = function () {
				var width = img.width, height = img.height;
				if (width > maxEdge || height > maxEdge) {
					if (width >= height) {
						height = Math.round(height * (maxEdge / width));
						width = maxEdge;
					} else {
						width = Math.round(width * (maxEdge / height));
						height = maxEdge;
					}
				}
				var canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, width, height);
				try {
					resolve(canvas.toDataURL("image/jpeg", quality));
				} catch (err) {
					reject(err);
				}
			};
			img.onerror = function () { reject(new Error("Bild konnte nicht geladen werden")); };
			img.src = reader.result;
		};
		reader.onerror = function () { reject(new Error("Datei konnte nicht gelesen werden")); };
		reader.readAsDataURL(file);
	});
}

// Fügt ein bereits komprimiertes Bild (Data-URL) hinzu und reiht es zusätzlich
// in die Warteschlange ein, damit es beim nächsten Klick garantiert als
// Erstes gezeigt wird (danach greift wieder der gewichtete Zufall).
function addEigenesBild(dataUrl) {
	"use strict";
	var bilder = ladeEigeneBilder();
	if (bilder.length >= EIGENE_BILDER_MAX) return false;
	bilder.push(dataUrl);
	speichereJSON(EIGENE_BILDER_KEY, bilder);
	var queue = ladeEigeneBilderQueue();
	queue.push(dataUrl);
	speichereJSON(EIGENE_BILDER_QUEUE_KEY, queue);
	return true;
}

function removeEigenesBild(index) {
	"use strict";
	var bilder = ladeEigeneBilder();
	var entfernt = bilder.splice(index, 1)[0];
	speichereJSON(EIGENE_BILDER_KEY, bilder);
	// auch aus der Warteschlange entfernen, falls das Bild dort noch wartet
	var queue = ladeEigeneBilderQueue().filter(function (b) { return b !== entfernt; });
	speichereJSON(EIGENE_BILDER_QUEUE_KEY, queue);
}

function addEigenerSpruch(text) {
	"use strict";
	text = (text || "").trim();
	if (!text) return false;
	if (text.length > EIGENE_SPRUCH_MAX_LAENGE) return false;
	var sprueche = ladeEigeneSprueche();
	if (sprueche.length >= EIGENE_SPRUECHE_MAX) return false;
	sprueche.push(text);
	speichereJSON(EIGENE_SPRUECHE_KEY, sprueche);
	var queue = ladeEigeneSpruecheQueue();
	queue.push(text);
	speichereJSON(EIGENE_SPRUECHE_QUEUE_KEY, queue);
	return true;
}

function removeEigenerSpruch(index) {
	"use strict";
	var sprueche = ladeEigeneSprueche();
	var entfernt = sprueche.splice(index, 1)[0];
	speichereJSON(EIGENE_SPRUECHE_KEY, sprueche);
	var queue = ladeEigeneSpruecheQueue().filter(function (s) { return s !== entfernt; });
	speichereJSON(EIGENE_SPRUECHE_QUEUE_KEY, queue);
}

// Ändert einen bestehenden eigenen Spruch nachträglich (Bearbeiten-Funktion
// im UI), ohne ihn aus der Warteschlange zu entfernen oder neu einzureihen -
// er bleibt einfach an seinem Platz im Pool, nur der Text ändert sich.
function updateEigenerSpruch(index, text) {
	"use strict";
	text = (text || "").trim();
	if (!text) return false;
	if (text.length > EIGENE_SPRUCH_MAX_LAENGE) return false;
	var sprueche = ladeEigeneSprueche();
	if (index < 0 || index >= sprueche.length) return false;
	sprueche[index] = text;
	speichereJSON(EIGENE_SPRUECHE_KEY, sprueche);
	return true;
}

// Zieht das nächste Bild: zuerst die Warteschlange frisch hinzugefügter
// eigener Bilder abarbeiten (FIFO, ein Bild pro Klick), danach gewichteter
// Zufall zwischen Standard-Bildern (t1...t327.jpg) und dem eigenen
// Bilder-Pool (falls vorhanden). Gibt { url, istEigen } zurück.
function zieheNaechstesBild() {
	"use strict";
	var queue = ladeEigeneBilderQueue();
	if (queue.length > 0) {
		var naechstes = queue.shift();
		speichereJSON(EIGENE_BILDER_QUEUE_KEY, queue);
		return { url: naechstes, istEigen: true };
	}
	var eigeneBilder = ladeEigeneBilder();
	if (eigeneBilder.length > 0 && Math.random() < EIGENE_GEWICHT) {
		var idx = rand(0, eigeneBilder.length - 1);
		return { url: eigeneBilder[idx], istEigen: true };
	}
	var z = rand(minBild, maxBild);
	if (z === tempBildOld) {
		z = rand(minBild, maxBild);
	} else {
		tempBildOld = z;
	}
	// 9.1.2025 dass das neueste Bild am Anfang angezeigt wird
	if (bildNeu) {
		z = maxBild;
		bildNeu = false;
	}
	return { url: "img/t" + z + ".jpg", istEigen: false };
}

// Zieht den nächsten Spruch nach demselben Prinzip: eigene Warteschlange
// zuerst, danach gewichteter Zufall zwischen dem sprachspezifischen
// Standard-Pool und den eigenen (sprachunabhängigen) Sprüchen. Gibt
// { text, istEigen } zurück.
function ziehNaechstenSpruch(sprachArrayAktuell, countTextAktuell) {
	"use strict";
	var queue = ladeEigeneSpruecheQueue();
	if (queue.length > 0) {
		var naechster = queue.shift();
		speichereJSON(EIGENE_SPRUECHE_QUEUE_KEY, queue);
		return { text: naechster, istEigen: true };
	}
	var eigeneSprueche = ladeEigeneSprueche();
	if (eigeneSprueche.length > 0 && Math.random() < EIGENE_GEWICHT) {
		var idx = rand(0, eigeneSprueche.length - 1);
		return { text: eigeneSprueche[idx], istEigen: true };
	}
	return { text: sprachArrayAktuell[rand(0, countTextAktuell - 1)], istEigen: false };
}

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
	var spruchErgebnis = ziehNaechstenSpruch(sprachArray, countText);
	selected = spruchErgebnis.text;
	if (selected == tempSatzOld) {
		spruchErgebnis = ziehNaechstenSpruch(sprachArray, countText);
		selected = spruchErgebnis.text;
	} else {
		tempSatzOld = selected;
	}

	// Das "no"-Präfix (nur Text, kein Bild) ist eine Konvention der
	// Standard-Sprüche in languages.js und gilt bewusst nicht für eigene
	// Sprüche - die werden immer mit einem Bild kombiniert.
	if (!spruchErgebnis.istEigen && selected.slice(0, 2) === "no") {
		selected = selected.slice(2, selected.length);
		// kein Bild in diesem Fall -> nur Text zum Teilen
		currentShareText = selected;
		currentShareImageUrl = null;
	} else {

		if (!spruchErgebnis.istEigen) {
			//Grossbuchstaben (nur bei Standard-Sprüchen, eigene Sprüche
			//bleiben in der vom Nutzer eingegebenen Schreibweise)
			selected = selected.toUpperCase();
			//end Grossbuchstaben
		}

		var bildErgebnis = zieheNaechstesBild();

		// für Teilen-Funktion merken (reiner Text + Bild-URL, vor dem Zusammenbauen des HTML)
		currentShareText = selected;
		currentShareImageUrl = bildErgebnis.url;

		meinBild = "<img src='" + bildErgebnis.url + "' class='img-circle'>";
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
		localStorage.setItem("langEnergieText1", "ENERGIE TANKSTELLE<br><img src='img/energietankstelle_1.png'>");
		localStorage.setItem("langEnergieText2", "unendlich klicken...");
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

// --- Teilen-Funktion (Button oben rechts) ---
// Nach dem bewährten Muster der Challenge-App: einfaches navigator.share()
// mit {text, url} - ohne fetch/Blob/File-Anhang, da dieser Weg auf manchen
// mobilen Browsern scheitert (z.B. wenn canShare({files}) false liefert
// oder das lokale Bild per fetch() nicht geladen werden kann). Stattdessen
// wird der absolute Link zum aktuellen Bild mitgeteilt.
//
// erzeugeShareDatei() macht den eigentlichen (teuren) Screenshot und liefert
// eine fertige File. Wird sowohl vom Hintergrund-Vorrendern als auch als
// Fallback direkt beim Klick verwendet (falls das Vorrendern fehlgeschlagen
// ist oder aus irgendeinem Grund kein Ergebnis vorliegt).
async function erzeugeShareDatei() {
	"use strict";

	var zielElement = document.getElementById('klickbereich') || document.getElementById('farbe');

	if (typeof html2canvas !== 'function') {
		console.error("html2canvas ist nicht geladen - kann keinen Screenshot erstellen.");
		return null;
	}

	var canvas;
	try {
		// Screenshot des aktuell sichtbaren Bereichs (Bild + Spruch zusammen)
		// scale: bisher auf Geräten mit hoher Pixeldichte (Handys oft 2-3x)
		// auf 0.75 reduziert, sonst 1 - das machte die Screenshots klein und
		// etwas unscharf. Jetzt scale: 1 für alle Geräte, d.h. es wird immer
		// mindestens in normaler CSS-Pixel-Auflösung gerendert (kein
		// zusätzliches Herunterskalieren mehr allein wegen hoher
		// Pixeldichte). Die endgültige Auflösung wird weiter unten über
		// MAX_BREITE gedeckelt, damit die Datei nicht zu groß wird.
		canvas = await html2canvas(zielElement, {
			backgroundColor: "#ffffff",
			useCORS: true,
			scale: 1,
			// Partikel-Canvas beim Rendern des Screenshots überspringen: das
			// Rastern der laufenden Animation war unvorhersehbar teuer und
			// hat den Teilen-Button manchmal spürbar langsam gemacht. Die
			// Animation läuft im echten DOM unbeeinflusst weiter, taucht
			// aber im Screenshot nicht mehr auf.
			ignoreElements: function (element) {
				return element.id === "particles-js";
			}
		});
	} catch (err) {
		console.error("Screenshot fehlgeschlagen:", err);
		return null;
	}

	// Zusätzlich auf eine vernünftige maximale Breite verkleinern, falls das
	// Element selbst schon sehr breit/hoch ist (z.B. großer Handybildschirm).
	// Von 1080 auf 1440 erhöht für eine spürbar höhere Auflösung.
	var MAX_BREITE = 1440;
	if (canvas.width > MAX_BREITE) {
		var skaliert = document.createElement('canvas');
		var faktor = MAX_BREITE / canvas.width;
		skaliert.width = MAX_BREITE;
		skaliert.height = Math.round(canvas.height * faktor);
		skaliert.getContext('2d').drawImage(canvas, 0, 0, skaliert.width, skaliert.height);
		canvas = skaliert;
	}

	return new Promise(function (resolve) {
		canvas.toBlob(function (blob) {
			if (!blob) {
				console.error("Konnte Screenshot nicht in Bild-Datei umwandeln.");
				resolve(null);
				return;
			}
			var dateiname = "energie-tankstelle.jpg";
			var file = new File([blob], dateiname, { type: "image/jpeg" });
			console.log("Geteilte Bilddatei-Größe:", Math.round(blob.size / 1024) + " KB");
			resolve(file);
		}, "image/jpeg", 0.85);
	});
}

// Stößt die Screenshot-Erzeugung im Hintergrund an, sobald ein neuer
// Spruch/Bild angezeigt wird - nicht erst beim Klick auf "Teilen". Läuft
// leicht verzögert/idle, damit der teure html2canvas-Aufruf nicht mit der
// Farbwechsel-Animation um Rechenzeit konkurriert.
// Sicherheitsnetz-Timeout in ms: spätestens nach dieser Zeit wird das
// Vorrendern gestartet, auch wenn requestIdleCallback bis dahin nicht
// gefeuert hat. Auf Android hält die dauerhaft laufende particles.js-
// Animation (rAF-Loop) den Main Thread meist so beschäftigt, dass
// requestIdleCallback selten oder erst deutlich nach 1500ms feuert -
// dann lag beim tatsächlichen Klick noch kein fertiges Bild vor.
var SHARE_PRERENDER_FALLBACK_MS = 400;

function schedulePrerenderShareImage() {
	"use strict";

	// Alten Stand verwerfen, der aktuelle Inhalt hat sich geändert.
	cachedShareFile = null;

	// Beide möglichen Trigger (Idle-Callback und Timeout) aus dem
	// vorherigen Aufruf sauber abräumen, bevor neu geplant wird.
	if (sharePrerenderIdleId !== null && typeof cancelIdleCallback === 'function') {
		cancelIdleCallback(sharePrerenderIdleId);
		sharePrerenderIdleId = null;
	}
	if (sharePrerenderTimeoutId !== null) {
		clearTimeout(sharePrerenderTimeoutId);
		sharePrerenderTimeoutId = null;
	}

	var vorrenderGestartet = false;
	var starteVorrendern = function () {
		if (vorrenderGestartet) return;
		vorrenderGestartet = true;
		if (sharePrerenderIdleId !== null && typeof cancelIdleCallback === 'function') {
			cancelIdleCallback(sharePrerenderIdleId);
		}
		if (sharePrerenderTimeoutId !== null) {
			clearTimeout(sharePrerenderTimeoutId);
		}
		sharePrerenderIdleId = null;
		sharePrerenderTimeoutId = null;
		sharePrerenderPromise = erzeugeShareDatei().then(function (file) {
			cachedShareFile = file;
			return file;
		});
	};

	// Rennen: wer zuerst feuert (Idle-Slot oder das Sicherheitsnetz),
	// startet das Vorrendern. So wartet Android nicht mehr auf einen
	// Idle-Slot, der wegen der Partikel-Animation evtl. nie/spät kommt.
	if (typeof requestIdleCallback === 'function') {
		sharePrerenderIdleId = requestIdleCallback(starteVorrendern, { timeout: SHARE_PRERENDER_FALLBACK_MS });
	}
	sharePrerenderTimeoutId = setTimeout(starteVorrendern, SHARE_PRERENDER_FALLBACK_MS);
}

// --- Robuster Reload-Schutz während des Teilens ---
// navigator.share() löst sein Promise auf manchen Android-Browsern/WebViews
// bereits auf, sobald der Share-Intent an das Betriebssystem übergeben
// wurde - NICHT erst, wenn der native Share-Screen wieder geschlossen ist.
// Würde window.shareInProgress direkt im finally-Block von
// teileAktuellesBild() zurückgesetzt, könnte in genau diesem kurzen Fenster
// (Share-Screen optisch noch offen, shareInProgress aber schon false) ein
// Service-Worker-Reload durchrutschen (siehe controllerchange-Handler in
// index.html) - die App wirkt dann für den Nutzer mitten im Teilen neu
// gestartet.
//
// Deshalb: shareInProgress erst dann wirklich auf false setzen, wenn die
// Seite nachweislich wieder sichtbar ist (visibilitychange zurück zu
// sichtbar), plus ein kleiner Sicherheitspuffer danach. Meldet der Browser
// document.hidden während des Share-Screens gar nicht als true (auch das
// kommt vor), wird direkt der Puffer gestartet.
var SHARE_GUARD_PUFFER_MS = 1200;
// Sicherheitsnetz, falls visibilitychange nach einem "hidden" Zustand aus
// irgendeinem Grund nie feuert - dann trotzdem spätestens hiernach beenden.
var SHARE_GUARD_MAX_WARTEZEIT_MS = 5000;
var shareGuardTimeoutId = null;
var shareGuardVisibilityHandler = null;
var shareGuardToken = 0;

function planeShareSchutzEnde() {
	"use strict";
	shareGuardToken += 1;
	var eigenerToken = shareGuardToken;

	function raeumeAuf() {
		if (shareGuardVisibilityHandler) {
			document.removeEventListener('visibilitychange', shareGuardVisibilityHandler);
			shareGuardVisibilityHandler = null;
		}
		if (shareGuardTimeoutId !== null) {
			clearTimeout(shareGuardTimeoutId);
			shareGuardTimeoutId = null;
		}
	}

	function schutzBeenden() {
		// Falls in der Zwischenzeit schon ein neuerer Share-Vorgang
		// gestartet wurde, hat dessen eigener Schutz Vorrang - nicht
		// vorzeitig freigeben.
		if (eigenerToken !== shareGuardToken) return;
		raeumeAuf();
		window.shareInProgress = false;
		autoKlickFortsetzenFallsErlaubt();
		// Falls index.html in der Zwischenzeit einen Reload wegen eines
		// neuen Service Workers zurückgehalten hat, jetzt nachholen.
		if (typeof window.zeigeReloadFallsAusstehend === 'function') {
			window.zeigeReloadFallsAusstehend();
		}
	}

	function starteAbschlussPuffer() {
		if (eigenerToken !== shareGuardToken) return;
		if (shareGuardTimeoutId !== null) {
			clearTimeout(shareGuardTimeoutId);
		}
		shareGuardTimeoutId = setTimeout(schutzBeenden, SHARE_GUARD_PUFFER_MS);
	}

	if (document.hidden) {
		shareGuardVisibilityHandler = function () {
			if (!document.hidden) {
				document.removeEventListener('visibilitychange', shareGuardVisibilityHandler);
				shareGuardVisibilityHandler = null;
				starteAbschlussPuffer();
			}
		};
		document.addEventListener('visibilitychange', shareGuardVisibilityHandler);
		shareGuardTimeoutId = setTimeout(schutzBeenden, SHARE_GUARD_MAX_WARTEZEIT_MS);
	} else {
		starteAbschlussPuffer();
	}
}

async function teileAktuellesBild() {
	"use strict";
	console.log("teileAktuellesBild() aufgerufen");

	// Solange gesetzt, weiß ein wartender Service-Worker-Reload (siehe
	// index.html), dass er sich noch gedulden muss - sonst könnte die Seite
	// mitten im Teilen (z.B. während der native Share-Dialog offen ist) neu
	// laden und die App wirkt wie neu gestartet.
	window.shareInProgress = true;
	// Auto-Klick explizit pausieren, solange geteilt wird - unabhängig
	// davon, ob der Browser das offene Share-Sheet überhaupt als "hidden"
	// meldet (verhält sich je nach Android-Version/Browser unterschiedlich).
	autoKlickPausieren();
	try {
		await teileAktuellesBildImpl();
	} finally {
		// Nicht sofort freigeben (siehe Kommentar oben bei
		// planeShareSchutzEnde) - erst wenn die App wirklich wieder
		// sichtbar ist, plus Sicherheitspuffer.
		planeShareSchutzEnde();
	}
}

async function teileAktuellesBildImpl() {
	"use strict";

	// Meist liegt hier schon ein fertig vorgerendertes Bild bereit (siehe
	// schedulePrerenderShareImage), dann geht es ab hier sofort weiter.
	var file = cachedShareFile;

	// Seltener Fall: Nutzer tippt so schnell, dass das Vorrendern noch
	// läuft - dann kurz auf das laufende Promise warten statt neu von vorn
	// zu beginnen.
	if (!file && sharePrerenderPromise) {
		try {
			file = await sharePrerenderPromise;
		} catch (err) {
			file = null;
		}
	}

	// Letzter Fallback, falls kein Vorrendern lief oder es fehlgeschlagen
	// ist (z.B. html2canvas nicht geladen): jetzt live erzeugen wie bisher.
	if (!file) {
		file = await erzeugeShareDatei();
	}

	if (!file) {
		alert("Teilen ist gerade nicht möglich (Bild konnte nicht erzeugt werden).");
		return;
	}

	console.log("navigator.share verfügbar:", !!navigator.share,
		"| canShare(files):", !!(navigator.canShare && navigator.canShare({ files: [file] })),
		"| isSecureContext:", window.isSecureContext);

	// Nur das Bild teilen (der Spruch steckt bereits im Screenshot selbst)
	if (navigator.canShare && navigator.canShare({ files: [file] })) {
		try {
			await navigator.share({ files: [file] });
			console.log("navigator.share() mit Bild-Datei erfolgreich aufgerufen");
		} catch (err) {
			console.log("navigator.share() mit Datei abgebrochen oder fehlgeschlagen:", err);
		}
		return;
	}

	// Letzter Fallback (z.B. Desktop-Browser ohne Datei-Share-Unterstützung):
	// Bild einfach herunterladen
	console.warn("Datei-Teilen nicht verfügbar - Fallback: Bild wird heruntergeladen.");
	var link = document.createElement("a");
	link.href = URL.createObjectURL(file);
	link.download = file.name;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

// Klick-Handler für den Share-Button (addEventListener statt Inline-onclick,
// damit Fehler sauber in der Konsole sichtbar sind und die Bindung nicht
// von Inline-Skript-Restriktionen abhängt)
document.addEventListener('DOMContentLoaded', function () {
	var btnShareEl = document.getElementById('btn_share');
	if (btnShareEl) {
		btnShareEl.addEventListener('click', function (ev) {
			console.log("Share-Button geklickt");
			ev.stopPropagation();
			teileAktuellesBild();
		});
	} else {
		console.warn("btn_share Element nicht gefunden - Share-Button kann nicht gebunden werden.");
	}
});

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

// ==================== UI: Eigene Bilder & Sprüche verwalten ====================
document.addEventListener('DOMContentLoaded', function () {
	"use strict";

	var btnEigene = document.getElementById('btn_eigene');
	var modalBackdrop = document.getElementById('eigeneModalBackdrop');
	var modalClose = document.getElementById('eigeneModalClose');
	var tabBtnBilder = document.getElementById('tabBtnBilder');
	var tabBtnSprueche = document.getElementById('tabBtnSprueche');
	var panelBilder = document.getElementById('panelBilder');
	var panelSprueche = document.getElementById('panelSprueche');

	// Sichern & Wiederherstellen (Export/Import) - eigenes, separates Modal,
	// damit das Bilder/Sprüche-Modal übersichtlich bleibt.
	var backupBtn = document.getElementById('oeffneBackupModalBtn');
	var backupModalBackdrop = document.getElementById('eigeneBackupModalBackdrop');
	var backupModalClose = document.getElementById('eigeneBackupModalClose');

	var eigenerSpruchInput = document.getElementById('eigenerSpruchInput');
	var eigenerSpruchAddBtn = document.getElementById('eigenerSpruchAddBtn');
	var eigenerSpruchCancelBtn = document.getElementById('eigenerSpruchCancelBtn');
	// Index des Spruchs, der gerade bearbeitet wird - null, solange nur
	// neue Sprüche hinzugefügt werden (kein Bearbeiten-Modus aktiv).
	var eigenerSpruchEditIndex = null;
	// Index des Bildes, für das gerade "Wirklich löschen?" angezeigt wird -
	// null, solange keine Löschung bestätigt werden muss.
	var eigenesBildConfirmIndex = null;

	if (!btnEigene || !modalBackdrop) {
		return;
	}

	// ---------- Mehrsprachigkeit: statische Oberflächen-Texte ----------
	// Setzt Titel/Buttons/Platzhalter/aria-labels beider Popups auf die
	// übergebene Sprache und lässt danach die Listen neu rendern (Zähler,
	// Lösch-Bestätigungen und leer-Hinweise stecken bereits sprachabhängig
	// in den Render-Funktionen weiter unten). Über
	// window.__eigeneInhalteSpracheAnwenden von außen (Flaggen-Buttons,
	// setLanguage()) erreichbar.
	function wendeSpracheAufEigeneInhalteAn(lang) {
		var dict = (window.ownContentUI && (window.ownContentUI[lang] || window.ownContentUI.de)) || null;
		if (!dict) return;

		modalClose.setAttribute("aria-label", dict.modalClose);
		var modalTitle = document.getElementById("eigeneModalTitle");
		if (modalTitle) modalTitle.textContent = dict.title;
		if (tabBtnBilder) tabBtnBilder.textContent = dict.tabBilder;
		if (tabBtnSprueche) tabBtnSprueche.textContent = dict.tabSprueche;
		var uploadText = document.getElementById("eigeneBilderUploadText");
		if (uploadText) uploadText.textContent = dict.uploadText;
		if (eigenerSpruchInput) eigenerSpruchInput.setAttribute("placeholder", dict.textareaPlaceholder);
		// "Text hinzufügen" bzw. "Aktualisieren" hängt zusätzlich vom
		// Bearbeitungsmodus ab - der ist hier bekannt (eigenerSpruchEditIndex).
		if (eigenerSpruchAddBtn) {
			eigenerSpruchAddBtn.textContent = eigenerSpruchEditIndex !== null ? dict.updateBtn : dict.addBtn;
		}
		if (eigenerSpruchCancelBtn) eigenerSpruchCancelBtn.textContent = dict.cancelBtn;
		var backupLinkText = document.getElementById("oeffneBackupModalText");
		if (backupLinkText) backupLinkText.textContent = dict.backupLink;
		var lokalHinweis = document.getElementById("eigeneLokalHinweis");
		if (lokalHinweis) lokalHinweis.textContent = dict.lokalHinweis;

		if (backupModalClose) backupModalClose.setAttribute("aria-label", dict.backupModalClose);
		var backupTitle = document.getElementById("eigeneBackupModalTitle");
		if (backupTitle) backupTitle.textContent = dict.backupTitle;
		var backupIntro = document.getElementById("eigeneBackupIntro");
		if (backupIntro) backupIntro.textContent = dict.backupIntro;
		var exportTitle = document.getElementById("eigeneExportTitle");
		if (exportTitle) exportTitle.textContent = dict.exportTitle;
		var exportText = document.getElementById("eigeneExportText");
		if (exportText) exportText.textContent = dict.exportText;
		var exportBtn = document.getElementById("eigeneExportBtn");
		if (exportBtn) exportBtn.textContent = dict.exportBtn;
		var importTitle = document.getElementById("eigeneImportTitle");
		if (importTitle) importTitle.textContent = dict.importTitle;
		var importText = document.getElementById("eigeneImportText");
		if (importText) importText.textContent = dict.importText;
		var importBtn = document.getElementById("eigeneImportBtn");
		if (importBtn) importBtn.textContent = dict.importBtn;

		// Zähler, leer-Hinweise und Lösch-Bestätigungen stecken in den
		// Listen selbst - einfach neu rendern statt Text zu erraten.
		renderEigeneBilderListeUI();
		renderEigeneSpruecheListeUI();
	}
	window.__eigeneInhalteSpracheAnwenden = wendeSpracheAufEigeneInhalteAn;

	// zielId erlaubt dieselbe Funktion für beide Modals zu nutzen (Haupt-
	// Modal: #eigeneFeedback, Sichern & Wiederherstellen: #eigeneBackupFeedback).
	function zeigeFeedback(text, zielId) {
		var el = document.getElementById(zielId || 'eigeneFeedback');
		if (!el) return;
		el.textContent = text;
		el.classList.add('is-visible');
		setTimeout(function () { el.classList.remove('is-visible'); }, 2200);
	}

	function beendeSpruchBearbeitung() {
		eigenerSpruchEditIndex = null;
		if (eigenerSpruchInput) eigenerSpruchInput.value = '';
		if (eigenerSpruchAddBtn) eigenerSpruchAddBtn.textContent = eigeneInhalteText('addBtn');
		if (eigenerSpruchCancelBtn) eigenerSpruchCancelBtn.style.display = 'none';
		aktualisiereSpruchZeichenZaehler();
	}

	// Aktualisiert die Live-Zeichenanzeige ("123/500") unter dem Textfeld.
	// Färbt den Zähler ein, sobald das Limit erreicht ist (rein optisch,
	// die eigentliche Begrenzung übernimmt maxlength + addEigenerSpruch/
	// updateEigenerSpruch).
	function aktualisiereSpruchZeichenZaehler() {
		var zaehlerEl = document.getElementById('eigenerSpruchZeichenZaehler');
		if (!zaehlerEl || !eigenerSpruchInput) return;
		var laenge = eigenerSpruchInput.value.length;
		zaehlerEl.textContent = laenge + "/" + EIGENE_SPRUCH_MAX_LAENGE;
		zaehlerEl.classList.toggle('own-content-limit-reached', laenge >= EIGENE_SPRUCH_MAX_LAENGE);
	}
	if (eigenerSpruchInput) {
		eigenerSpruchInput.addEventListener('input', aktualisiereSpruchZeichenZaehler);
		aktualisiereSpruchZeichenZaehler();
	}

	function oeffneModal() {
		modalBackdrop.classList.add('is-open');
		beendeSpruchBearbeitung();
		eigenesBildConfirmIndex = null;
		wendeSpracheAufEigeneInhalteAn(tempSprache || localStorage.getItem("langEnergie") || "de");
	}
	function schliesseModal() {
		modalBackdrop.classList.remove('is-open');
		beendeSpruchBearbeitung();
		eigenesBildConfirmIndex = null;
	}

	btnEigene.addEventListener('click', function (ev) {
		ev.preventDefault();
		oeffneModal();
	});
	if (modalClose) modalClose.addEventListener('click', schliesseModal);
	modalBackdrop.addEventListener('click', function (ev) {
		if (ev.target === modalBackdrop) schliesseModal();
	});

	function oeffneBackupModal() {
		if (backupModalBackdrop) backupModalBackdrop.classList.add('is-open');
	}
	function schliesseBackupModal() {
		if (backupModalBackdrop) backupModalBackdrop.classList.remove('is-open');
	}
	if (backupBtn) backupBtn.addEventListener('click', function () { oeffneBackupModal(); });
	if (backupModalClose) backupModalClose.addEventListener('click', schliesseBackupModal);
	if (backupModalBackdrop) {
		backupModalBackdrop.addEventListener('click', function (ev) {
			if (ev.target === backupModalBackdrop) schliesseBackupModal();
		});
	}

	function aktiviereTab(tab) {
		var bilderAktiv = tab === 'bilder';
		if (tabBtnBilder) tabBtnBilder.classList.toggle('active', bilderAktiv);
		if (tabBtnSprueche) tabBtnSprueche.classList.toggle('active', !bilderAktiv);
		if (panelBilder) panelBilder.style.display = bilderAktiv ? '' : 'none';
		if (panelSprueche) panelSprueche.style.display = bilderAktiv ? 'none' : '';
	}
	if (tabBtnBilder) tabBtnBilder.addEventListener('click', function () { aktiviereTab('bilder'); });
	if (tabBtnSprueche) tabBtnSprueche.addEventListener('click', function () { aktiviereTab('sprueche'); });

	// ---------- Bilder-Liste ----------
	// Löschen läuft zweistufig: erster Klick auf den Papierkorb markiert das
	// Bild und zeigt darunter eine volle-Breite-Leiste ("Bild wirklich
	// löschen? Ja/Nein") - dank grid-column:1/-1 unabhängig von der kleinen
	// Kachelbreite, damit die Buttons immer groß genug sind. Erst ein Klick
	// auf "Ja" entfernt das Bild wirklich.
	function renderEigeneBilderListeUI() {
		var listeEl = document.getElementById('eigeneBilderListe');
		var zaehlerEl = document.getElementById('eigeneBilderZaehler');
		if (!listeEl) return;
		var bilder = ladeEigeneBilder();
		if (zaehlerEl) zaehlerEl.textContent = eigeneInhalteText('bilderZaehler', { n: bilder.length, max: EIGENE_BILDER_MAX });
		if (bilder.length === 0) {
			listeEl.innerHTML = "<p class='own-content-empty-note'></p>";
			listeEl.querySelector('.own-content-empty-note').textContent = eigeneInhalteText('emptyBilder');
			return;
		}
		if (eigenesBildConfirmIndex !== null && eigenesBildConfirmIndex >= bilder.length) {
			eigenesBildConfirmIndex = null;
		}
		var bildRemoveAria = eigeneInhalteText('bildRemoveAria');
		var bildConfirmFrage = eigeneInhalteText('bildConfirmFrage');
		var confirmJa = eigeneInhalteText('confirmJa');
		var confirmNein = eigeneInhalteText('confirmNein');
		var html = "";
		for (var i = 0; i < bilder.length; i++) {
			var wirdBestaetigt = i === eigenesBildConfirmIndex;
			html += "<div class='own-content-thumb-item" + (wirdBestaetigt ? " is-pending-delete" : "") + "' data-idx='" + i + "'>" +
						"<img src='" + bilder[i] + "' class='own-content-thumb' alt=''>" +
						"<button type='button' class='own-content-thumb-remove' data-idx='" + i + "' aria-label='" + bildRemoveAria + "'>🗑️</button>" +
					"</div>";
			if (wirdBestaetigt) {
				html += "<div class='own-content-bild-confirm-row'>" +
							"<span>" + bildConfirmFrage + "</span>" +
							"<button type='button' class='own-content-confirm-yes btn btn-danger' data-idx='" + i + "'>" + confirmJa + "</button>" +
							"<button type='button' class='own-content-confirm-no btn btn-default' data-idx='" + i + "'>" + confirmNein + "</button>" +
						"</div>";
			}
		}
		listeEl.innerHTML = html;
		listeEl.querySelectorAll('.own-content-thumb-remove').forEach(function (btn) {
			btn.addEventListener('click', function (ev) {
				eigenesBildConfirmIndex = parseInt(ev.currentTarget.getAttribute('data-idx'), 10);
				renderEigeneBilderListeUI();
			});
		});
		listeEl.querySelectorAll('.own-content-confirm-no').forEach(function (btn) {
			btn.addEventListener('click', function () {
				eigenesBildConfirmIndex = null;
				renderEigeneBilderListeUI();
			});
		});
		listeEl.querySelectorAll('.own-content-confirm-yes').forEach(function (btn) {
			btn.addEventListener('click', function (ev) {
				var idx = parseInt(ev.currentTarget.getAttribute('data-idx'), 10);
				removeEigenesBild(idx);
				eigenesBildConfirmIndex = null;
				renderEigeneBilderListeUI();
			});
		});
	}

	var eigeneBilderUploadBtn = document.getElementById('eigeneBilderUploadBtn');
	var eigeneBilderInput = document.getElementById('eigeneBilderInput');
	if (eigeneBilderUploadBtn && eigeneBilderInput) {
		eigeneBilderUploadBtn.addEventListener('click', function () { eigeneBilderInput.click(); });
		eigeneBilderInput.addEventListener('change', function (ev) {
			var files = Array.prototype.slice.call(ev.target.files || []);
			ev.target.value = '';
			if (!files.length) return;
			var vorhandene = ladeEigeneBilder().length;
			var frei = EIGENE_BILDER_MAX - vorhandene;
			if (frei <= 0) {
				zeigeFeedback(eigeneInhalteText('feedbackMaxBilder', { max: EIGENE_BILDER_MAX }));
				return;
			}
			eigeneBilderUploadBtn.disabled = true;
			var zuVerarbeiten = files.slice(0, frei);
			var i = 0;
			function naechsteDatei() {
				if (i >= zuVerarbeiten.length) {
					eigeneBilderUploadBtn.disabled = false;
					renderEigeneBilderListeUI();
					if (zuVerarbeiten.length > 0) {
						zeigeFeedback(eigeneInhalteText('feedbackBilderGespeichert'));
					}
					return;
				}
				var datei = zuVerarbeiten[i];
				i++;
				komprimiereEigenesBild(datei).then(function (dataUrl) {
					addEigenesBild(dataUrl);
					naechsteDatei();
				}).catch(function (err) {
					console.warn("Eigenes Bild konnte nicht verarbeitet werden:", err);
					naechsteDatei();
				});
			}
			naechsteDatei();
		});
	}

	// ---------- Sprüche-Liste ----------
	// Jeder Eintrag hat jetzt zwei Icons: Stift (Bearbeiten) und Papierkorb
	// (Löschen, mit derselben Ja/Nein-Bestätigung wie bei den Bildern).
	// Bearbeiten lädt den Text zurück ins obere Textfeld und wandelt den
	// "Spruch hinzufügen"-Button in "Aktualisieren" um.
	function renderEigeneSpruecheListeUI() {
		var listeEl = document.getElementById('eigeneSpruecheListe');
		var zaehlerEl = document.getElementById('eigeneSpruecheZaehler');
		if (!listeEl) return;
		var sprueche = ladeEigeneSprueche();
		if (zaehlerEl) zaehlerEl.textContent = eigeneInhalteText('spruecheZaehler', { n: sprueche.length, max: EIGENE_SPRUECHE_MAX });
		if (sprueche.length === 0) {
			listeEl.innerHTML = "<p class='own-content-empty-note'></p>";
			listeEl.querySelector('.own-content-empty-note').textContent = eigeneInhalteText('emptySprueche');
			return;
		}
		var spruchEditAria = eigeneInhalteText('spruchEditAria');
		var spruchRemoveAria = eigeneInhalteText('spruchRemoveAria');
		var spruchEditTitle = eigeneInhalteText('spruchEditTitle');
		var spruchConfirmFrage = eigeneInhalteText('spruchConfirmFrage');
		var confirmJa = eigeneInhalteText('confirmJa');
		var confirmNein = eigeneInhalteText('confirmNein');
		var html = "";
		for (var i = 0; i < sprueche.length; i++) {
			html += "<div class='own-content-spruch-item" + (i === eigenerSpruchEditIndex ? " is-editing" : "") + "' data-idx='" + i + "'>" +
						"<div class='own-content-spruch-row'>" +
							"<div class='own-content-spruch-text' data-idx='" + i + "' role='button' tabindex='0' title='" + spruchEditTitle + "'></div>" +
							"<div class='own-content-spruch-actions'>" +
								"<button type='button' class='own-content-spruch-edit' data-idx='" + i + "' aria-label='" + spruchEditAria + "'>✏️</button>" +
								"<button type='button' class='own-content-spruch-remove' data-idx='" + i + "' aria-label='" + spruchRemoveAria + "'>🗑️</button>" +
							"</div>" +
						"</div>" +
						"<div class='own-content-confirm-row'>" +
							"<span>" + spruchConfirmFrage + "</span>" +
							"<button type='button' class='own-content-confirm-yes btn btn-danger' data-idx='" + i + "'>" + confirmJa + "</button>" +
							"<button type='button' class='own-content-confirm-no btn btn-default' data-idx='" + i + "'>" + confirmNein + "</button>" +
						"</div>" +
					"</div>";
		}
		listeEl.innerHTML = html;
		var textEls = listeEl.querySelectorAll('.own-content-spruch-text');
		textEls.forEach(function (el, i) { el.textContent = sprueche[i]; });

		// Startet den Bearbeitungsmodus für einen Text - wird sowohl vom
		// Stift-Button als auch vom Antippen des Texts selbst ausgelöst,
		// damit man nicht gezielt das kleine Icon treffen muss.
		function starteSpruchBearbeitung(idx) {
			eigenerSpruchEditIndex = idx;
			if (eigenerSpruchInput) {
				eigenerSpruchInput.value = sprueche[idx];
				eigenerSpruchInput.focus();
			}
			if (eigenerSpruchAddBtn) eigenerSpruchAddBtn.textContent = eigeneInhalteText('updateBtn');
			if (eigenerSpruchCancelBtn) eigenerSpruchCancelBtn.style.display = '';
			aktualisiereSpruchZeichenZaehler();
			renderEigeneSpruecheListeUI();
		}

		listeEl.querySelectorAll('.own-content-spruch-edit').forEach(function (btn) {
			btn.addEventListener('click', function (ev) {
				starteSpruchBearbeitung(parseInt(ev.currentTarget.getAttribute('data-idx'), 10));
			});
		});
		listeEl.querySelectorAll('.own-content-spruch-text').forEach(function (el) {
			el.addEventListener('click', function (ev) {
				starteSpruchBearbeitung(parseInt(ev.currentTarget.getAttribute('data-idx'), 10));
			});
			el.addEventListener('keydown', function (ev) {
				if (ev.key === 'Enter' || ev.key === ' ') {
					ev.preventDefault();
					starteSpruchBearbeitung(parseInt(ev.currentTarget.getAttribute('data-idx'), 10));
				}
			});
		});
		listeEl.querySelectorAll('.own-content-spruch-remove').forEach(function (btn) {
			btn.addEventListener('click', function (ev) {
				var item = ev.currentTarget.closest('.own-content-spruch-item');
				if (item) item.classList.add('is-confirming');
			});
		});
		listeEl.querySelectorAll('.own-content-confirm-no').forEach(function (btn) {
			btn.addEventListener('click', function (ev) {
				var item = ev.currentTarget.closest('.own-content-spruch-item');
				if (item) item.classList.remove('is-confirming');
			});
		});
		listeEl.querySelectorAll('.own-content-confirm-yes').forEach(function (btn) {
			btn.addEventListener('click', function (ev) {
				var idx = parseInt(ev.currentTarget.getAttribute('data-idx'), 10);
				removeEigenerSpruch(idx);
				// Falls ausgerechnet der gerade bearbeitete Spruch gelöscht
				// wird, Bearbeiten-Modus sauber verlassen statt mit
				// veraltetem Index hängen zu bleiben.
				if (eigenerSpruchEditIndex === idx) beendeSpruchBearbeitung();
				renderEigeneSpruecheListeUI();
			});
		});
	}

	if (eigenerSpruchAddBtn && eigenerSpruchInput) {
		eigenerSpruchAddBtn.addEventListener('click', function () {
			var wert = eigenerSpruchInput.value;
			var getrimmt = (wert || '').trim();
			if (eigenerSpruchEditIndex !== null) {
				var aktualisiert = updateEigenerSpruch(eigenerSpruchEditIndex, wert);
				if (aktualisiert) {
					beendeSpruchBearbeitung();
					renderEigeneSpruecheListeUI();
				} else if (getrimmt.length > EIGENE_SPRUCH_MAX_LAENGE) {
					zeigeFeedback(eigeneInhalteText('feedbackMaxZeichen', { max: EIGENE_SPRUCH_MAX_LAENGE }));
				} else {
					zeigeFeedback(eigeneInhalteText('feedbackBitteText'));
				}
				return;
			}
			var ok = addEigenerSpruch(wert);
			if (ok) {
				eigenerSpruchInput.value = '';
				aktualisiereSpruchZeichenZaehler();
				renderEigeneSpruecheListeUI();
			} else if (getrimmt === '') {
				zeigeFeedback(eigeneInhalteText('feedbackBitteText'));
			} else if (getrimmt.length > EIGENE_SPRUCH_MAX_LAENGE) {
				zeigeFeedback(eigeneInhalteText('feedbackMaxZeichen', { max: EIGENE_SPRUCH_MAX_LAENGE }));
			} else {
				zeigeFeedback(eigeneInhalteText('feedbackMaxSprueche', { max: EIGENE_SPRUECHE_MAX }));
			}
		});
	}
	if (eigenerSpruchCancelBtn) {
		eigenerSpruchCancelBtn.addEventListener('click', function () {
			beendeSpruchBearbeitung();
		});
	}

	// ---------- Export / Import (jetzt im eigenen "Sichern & Wiederherstellen"-Modal) ----------
	var eigeneExportBtn = document.getElementById('eigeneExportBtn');
	if (eigeneExportBtn) {
		eigeneExportBtn.addEventListener('click', function () {
			var daten = {
				eigeneBilder: ladeEigeneBilder(),
				eigeneSprueche: ladeEigeneSprueche(),
				exportiertAm: new Date().toISOString().slice(0, 10)
			};
			var blob = new Blob([JSON.stringify(daten, null, 2)], { type: 'application/json' });
			var url = URL.createObjectURL(blob);
			var a = document.createElement('a');
			a.href = url;
			a.download = 'energietankstelle-eigene-inhalte.json';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			zeigeFeedback(eigeneInhalteText('feedbackDownload'), 'eigeneBackupFeedback');
		});
	}

	var eigeneImportBtn = document.getElementById('eigeneImportBtn');
	var eigeneImportInput = document.getElementById('eigeneImportInput');
	if (eigeneImportBtn && eigeneImportInput) {
		eigeneImportBtn.addEventListener('click', function () { eigeneImportInput.click(); });
		eigeneImportInput.addEventListener('change', function (ev) {
			var datei = ev.target.files[0];
			ev.target.value = '';
			if (!datei) return;
			var reader = new FileReader();
			reader.onload = function () {
				var daten;
				try {
					daten = JSON.parse(reader.result);
				} catch (err) {
					zeigeFeedback(eigeneInhalteText('feedbackReadError'), 'eigeneBackupFeedback');
					return;
				}
				var bestaetigt = window.confirm(eigeneInhalteText('importConfirm'));
				if (!bestaetigt) return;
				var neueBilder = Array.isArray(daten.eigeneBilder) ? daten.eigeneBilder.slice(0, EIGENE_BILDER_MAX) : [];
				var neueSprueche = Array.isArray(daten.eigeneSprueche) ? daten.eigeneSprueche.slice(0, EIGENE_SPRUECHE_MAX).map(function (s) {
					return (s || "").toString().slice(0, EIGENE_SPRUCH_MAX_LAENGE);
				}) : [];
				speichereJSON(EIGENE_BILDER_KEY, neueBilder);
				speichereJSON(EIGENE_SPRUECHE_KEY, neueSprueche);
				// Nach einem Import startet die Warteschlange bewusst leer -
				// importierte Inhalte fallen direkt in den normalen
				// gewichteten Zufall, statt alle nacheinander erzwungen
				// angezeigt zu werden.
				speichereJSON(EIGENE_BILDER_QUEUE_KEY, []);
				speichereJSON(EIGENE_SPRUECHE_QUEUE_KEY, []);
				beendeSpruchBearbeitung();
				renderEigeneBilderListeUI();
				renderEigeneSpruecheListeUI();
				zeigeFeedback(eigeneInhalteText('feedbackImportSuccess'), 'eigeneBackupFeedback');
			};
			reader.readAsText(datei);
		});
	}
});
