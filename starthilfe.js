/*jslint browser: true, sloppy: true*/

// ==================== Starthilfe ====================
// 1. Willkommens-Popup beim ersten Start mit drei kurzen Schritten und der
//    Sprachwahl; erneut aufrufbar im Reiter "Optionen" (Panel "Hilfe").
// 2. Kleine Flaggen statt der drei großen Flaggen-Reihen auf der Startseite
//    (die großen Reihen sind per CSS ausgeblendet, ihre Logik bleibt unberührt).
//    Die kleinen Flaggen verschwinden wie die großen nach dem ersten Tippen;
//    die Sprache lässt sich danach in den Optionen wechseln.
// Die Anzeige der Bilder und Sprüche wird hier nicht angefasst.
(function () {
	"use strict";

	var GESEHEN_KEY = "starthilfeGesehen";

	var SPRACHEN = ["de", "en", "es", "pl", "it", "ru", "tu", "vi", "ba", "un", "ukr", "china"];

	// Texte: [Titel, Schritt 1, Schritt 2, Schritt 3, Button, Panel-Überschrift "Hilfe", Hilfe-Button]. Fehlt eine Sprache, gilt "en".
	var TEXTE = {
		de: ["Willkommen bei der Energietankstelle", "👆 Tippen oder wischen: der nächste Spruch erscheint.", "⚙️ Oben rechts im Zahnrad: Einstellungen, Sprache, Vorlesen sowie eigene Bilder und Texte.", "📤 Sobald ein Bild erscheint, kannst du es oben rechts teilen.", "Los geht’s", "Hilfe", "Starthilfe anzeigen"],
		en: ["Welcome to the Energy Station", "👆 Tap or swipe to get the next message.", "⚙️ Top right, the gear opens settings, language, read-aloud and your own pictures and texts.", "📤 As soon as a picture appears, you can share it at the top right.", "Let’s go", "Help", "Show quick start"],
		es: ["Bienvenido a la Estación de Energía", "👆 Toca o desliza para ver el siguiente mensaje.", "⚙️ Arriba a la derecha, la rueda dentada abre los ajustes, el idioma, la lectura en voz alta y tus propias imágenes y textos.", "📤 En cuanto aparece una imagen, puedes compartirla arriba a la derecha.", "¡Vamos!", "Ayuda", "Mostrar guía rápida"],
		pl: ["Witaj w Stacji Energii", "👆 Dotknij lub przesuń, aby zobaczyć kolejną myśl.", "⚙️ W prawym górnym rogu zębatka otwiera ustawienia, język, czytanie na głos oraz własne obrazy i teksty.", "📤 Gdy pojawi się obraz, możesz go udostępnić w prawym górnym rogu.", "Zaczynamy", "Pomoc", "Pokaż pomoc startową"],
		it: ["Benvenuto alla Stazione di energia", "👆 Tocca o scorri per il messaggio successivo.", "⚙️ In alto a destra, l’ingranaggio apre impostazioni, lingua, lettura ad alta voce e le tue immagini e testi.", "📤 Appena compare un’immagine, puoi condividerla in alto a destra.", "Iniziamo", "Aiuto", "Mostra guida rapida"],
		ru: ["Добро пожаловать на Энергетическую станцию", "👆 Коснитесь или проведите пальцем, чтобы увидеть следующее сообщение.", "⚙️ Шестерёнка вверху справа открывает настройки, язык, чтение вслух и ваши изображения и тексты.", "📤 Как только появится картинка, её можно отправить кнопкой вверху справа.", "Начнём", "Помощь", "Показать подсказки"],
		tu: ["Enerji İstasyonuna hoş geldin", "👆 Sonraki mesaj için dokun veya kaydır.", "⚙️ Sağ üstteki dişli ayarları, dili, sesli okumayı ve kendi resim ve metinlerini açar.", "📤 Bir resim göründüğünde onu sağ üstten paylaşabilirsin.", "Başlayalım", "Yardım", "Başlangıç yardımını göster"],
		vi: ["Chào mừng đến Trạm năng lượng", "👆 Chạm hoặc vuốt để xem thông điệp tiếp theo.", "⚙️ Bánh răng ở góc trên bên phải mở cài đặt, ngôn ngữ, đọc to và hình ảnh, văn bản của bạn.", "📤 Khi có hình ảnh xuất hiện, bạn có thể chia sẻ ở góc trên bên phải.", "Bắt đầu", "Trợ giúp", "Hiện hướng dẫn nhanh"],
		ba: ["এনার্জি স্টেশনে স্বাগতম", "👆 পরবর্তী বার্তার জন্য ট্যাপ করুন বা সোয়াইপ করুন।", "⚙️ উপরে ডানদিকের গিয়ার সেটিংস, ভাষা, জোরে পড়া এবং আপনার নিজের ছবি ও লেখা খোলে।", "📤 ছবি দেখা গেলেই উপরে ডানদিক থেকে শেয়ার করতে পারবেন।", "শুরু করি", "সহায়তা", "শুরুর সহায়তা দেখান"],
		un: ["Üdv az Energiaállomáson", "👆 Koppints vagy húzd az ujjad a következő üzenethez.", "⚙️ A jobb felső sarokban a fogaskerék megnyitja a beállításokat, a nyelvet, a felolvasást és a saját képeidet, szövegeidet.", "📤 Amint megjelenik egy kép, a jobb felső sarokban megoszthatod.", "Kezdjük", "Súgó", "Gyorstalpaló megjelenítése"],
		ukr: ["Ласкаво просимо на Енергетичну заправку", "👆 Торкніться або проведіть пальцем, щоб побачити наступне повідомлення.", "⚙️ Шестерня вгорі праворуч відкриває налаштування, мову, читання вголос і ваші зображення та тексти.", "📤 Щойно з’явиться зображення, його можна надіслати кнопкою вгорі праворуч.", "Почнемо", "Допомога", "Показати підказки"],
		china: ["欢迎来到能量加油站", "👆 轻点或滑动，查看下一条信息。", "⚙️ 右上角的齿轮可打开设置、语言、朗读以及你自己的图片和文字。", "📤 图片出现后，可在右上角分享。", "开始吧", "帮助", "显示新手指南"]
	};

	function sprache() {
		var lang = (typeof tempSprache !== "undefined" && tempSprache) || localStorage.getItem("langEnergie") || "de";
		return SPRACHEN.indexOf(lang) >= 0 ? lang : "de";
	}

	function t(index) {
		return (TEXTE[sprache()] || TEXTE.en)[index];
	}

	function el(id) {
		return document.getElementById(id);
	}

	// ---------- Kleine Flaggen (Startseite und Willkommens-Popup) ----------
	function flaggenBauen(container) {
		window.energieSprachen.forEach(function (s) {
			var b = document.createElement("button");
			b.type = "button";
			b.className = "sh-flagge";
			b.setAttribute("data-code", s.code);
			b.title = s.name;
			b.setAttribute("aria-label", s.name);
			b.innerHTML = '<img src="' + s.bild + '" alt="" width="30" height="20">';
			b.addEventListener("click", function () { window.energieSpracheWechseln(s.code); });
			container.appendChild(b);
		});
	}

	function flaggenMarkieren() {
		var aktuell = (typeof tempSprache !== "undefined" && tempSprache) || localStorage.getItem("langEnergie") || "de";
		document.querySelectorAll(".sh-flagge").forEach(function (b) {
			b.classList.toggle("active", b.getAttribute("data-code") === aktuell);
		});
	}

	// Leiste auf der Startseite, an der Stelle der großen Flaggen-Reihen.
	var leiste = document.createElement("div");
	leiste.id = "startSprachen";
	leiste.className = "sh-leiste";
	flaggenBauen(leiste);
	var klickbereich = el("klickbereich");
	klickbereich.parentNode.insertBefore(leiste, klickbereich);

	// Nach dem ersten Tippen (erster Spruch erscheint) verschwindet die Leiste wie die großen Flaggen.
	var moti = el("moti");
	if (moti && window.MutationObserver) {
		new MutationObserver(function () {
			if (leiste.parentNode) leiste.parentNode.removeChild(leiste);
		}).observe(moti, { childList: true });
	}

	// ---------- Willkommens-Popup ----------
	var popup = document.createElement("div");
	popup.id = "starthilfeBackdrop";
	popup.className = "share-modal-backdrop";
	popup.innerHTML =
		'<div class="share-modal starthilfe-modal" role="dialog" aria-modal="true" aria-labelledby="starthilfeTitel">' +
		'<button type="button" class="share-modal-close" id="starthilfeClose" aria-label="×">&times;</button>' +
		'<h2 class="share-modal-title" id="starthilfeTitel"></h2>' +
		'<div class="sh-leiste sh-leiste-popup" id="starthilfeSprachen"></div>' +
		'<div class="list-group sh-schritte">' +
		'<div class="list-group-item" id="starthilfeS1"></div>' +
		'<div class="list-group-item" id="starthilfeS2"></div>' +
		'<div class="list-group-item" id="starthilfeS3"></div>' +
		'</div>' +
		'<button type="button" class="btn btn-primary btn-lg btn-block" id="starthilfeOk"></button>' +
		'</div>';
	document.body.appendChild(popup);
	flaggenBauen(el("starthilfeSprachen"));

	function texteSetzen() {
		el("starthilfeTitel").textContent = t(0);
		el("starthilfeS1").textContent = t(1);
		el("starthilfeS2").textContent = t(2);
		el("starthilfeS3").textContent = t(3);
		el("starthilfeOk").textContent = t(4);
		el("starthilfeHilfeText").textContent = t(5);
		el("starthilfeButton").textContent = t(6);
		flaggenMarkieren();
	}

	function oeffnen() {
		texteSetzen();
		popup.classList.add("is-open");
		// Wie die anderen Popups: den automatischen Wechsel im Hintergrund anhalten.
		if (typeof autoKlickPausieren === "function") autoKlickPausieren();
		el("starthilfeOk").focus();
	}

	function schliessen() {
		popup.classList.remove("is-open");
		try { localStorage.setItem(GESEHEN_KEY, "1"); } catch (e) {}
		if (typeof autoKlickFortsetzenFallsErlaubt === "function") autoKlickFortsetzenFallsErlaubt();
	}

	el("starthilfeOk").addEventListener("click", schliessen);
	el("starthilfeClose").addEventListener("click", schliessen);
	popup.addEventListener("click", function (ev) {
		if (ev.target === popup) schliessen();
	});
	document.addEventListener("keydown", function (ev) {
		if (ev.key === "Escape" && popup.classList.contains("is-open")) schliessen();
	});

	// ---------- Hilfe-Panel im Reiter "Optionen" ----------
	var panel = document.createElement("div");
	panel.className = "panel panel-default";
	panel.innerHTML =
		'<div class="panel-heading" id="starthilfeHilfeText"></div>' +
		'<div class="panel-body"><button type="button" class="btn btn-default btn-block" id="starthilfeButton"></button></div>';
	el("panelEinstellungen").insertBefore(panel, el("einstVersion"));
	el("starthilfeButton").addEventListener("click", function () {
		// Das Optionen-Popup schließen, dann die Starthilfe zeigen.
		var zu = el("eigeneModalClose");
		if (zu) zu.click();
		oeffnen();
	});

	// ---------- Sprachwechsel ----------
	document.addEventListener("energie:sprache", texteSetzen);
	document.addEventListener("click", function (ev) {
		if (ev.target.closest && ev.target.closest("#sprache, #sprache1, #sprache2")) {
			setTimeout(texteSetzen, 50);
		}
	});
	var btnEigene = el("btn_eigene");
	if (btnEigene) btnEigene.addEventListener("click", texteSetzen);

	texteSetzen();

	// Beim allerersten Start automatisch zeigen.
	var gesehen = false;
	try { gesehen = localStorage.getItem(GESEHEN_KEY) === "1"; } catch (e) {}
	if (!gesehen) oeffnen();
}());
