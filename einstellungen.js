/*jslint browser: true, sloppy: true*/

// ==================== Optionen ====================
// Reiter "Optionen" im Popup "Eigene Bilder & Texte", aufgebaut aus
// Bootstrap-Panels:
//  - "Sprache": die Sprache lässt sich jederzeit wechseln (die Flaggen der
//    Startseite verschwinden nach dem ersten Tippen).
//  - "Anzeige & Ton": Liste mit An/Aus-Schaltern. vorlesen.js und
//    nur-eigene.js hängen ihre Zeilen über energieOptionZeile() ein.
//  - Versionsnummer der App (aus dem ?v= dieses Skripts in index.html, also
//    immer dieselbe Nummer wie bei allen anderen Dateien).
// Bei jedem Sprachwechsel (Flaggen oder dieses Panel) wird "energie:sprache"
// ausgelöst, damit alle Module ihre Texte nachziehen.
(function () {
	"use strict";

	// ?v=... dieses Skripts als Versionsnummer lesen (muss synchron beim Laden passieren).
	var versionMatch = ((document.currentScript && document.currentScript.src) || "").match(/[?&]v=(\d+(?:\.\d+)*)/);
	var VERSION = versionMatch ? versionMatch[1] : "?";

	// Code der App, Flaggenbild, Name in der jeweiligen Sprache.
	var SPRACHEN = [
		{ code: "de", bild: "img/deutsch.jpg", name: "Deutsch" },
		{ code: "en", bild: "img/englisch.jpg", name: "English" },
		{ code: "es", bild: "img/spanisch.jpg", name: "Español" },
		{ code: "pl", bild: "img/polnisch.png", name: "Polski" },
		{ code: "it", bild: "img/italia.jpg", name: "Italiano" },
		{ code: "ru", bild: "img/russian.jpg", name: "Русский" },
		{ code: "tu", bild: "img/turkiye.jpg", name: "Türkçe" },
		{ code: "vi", bild: "img/vietnam.jpg", name: "Tiếng Việt" },
		{ code: "un", bild: "img/ungarn.jpg", name: "Magyar" },
		{ code: "ba", bild: "img/bangla.jpg", name: "বাংলা" },
		{ code: "ukr", bild: "img/ukraine.jpg", name: "Українська" },
		{ code: "china", bild: "img/china.jpg", name: "中文" }
	];

	// Texte je Sprache: [Reiter "Optionen", "Sprache", "Anzeige & Ton", "Version"]. Fehlt eine Sprache, gilt "en".
	var TEXTE = {
		de: ["⚙️ Optionen", "Sprache", "Anzeige & Ton", "Version"],
		en: ["⚙️ Options", "Language", "Display & sound", "Version"],
		es: ["⚙️ Opciones", "Idioma", "Pantalla y sonido", "Versión"],
		pl: ["⚙️ Opcje", "Język", "Wyświetlanie i dźwięk", "Wersja"],
		it: ["⚙️ Opzioni", "Lingua", "Schermo e audio", "Versione"],
		ru: ["⚙️ Опции", "Язык", "Экран и звук", "Версия"],
		tu: ["⚙️ Seçenekler", "Dil", "Ekran ve ses", "Sürüm"],
		vi: ["⚙️ Tùy chọn", "Ngôn ngữ", "Hiển thị và âm thanh", "Phiên bản"],
		ba: ["⚙️ অপশন", "ভাষা", "প্রদর্শন ও শব্দ", "সংস্করণ"],
		un: ["⚙️ Opciók", "Nyelv", "Megjelenítés és hang", "Verzió"],
		ukr: ["⚙️ Опції", "Мова", "Екран і звук", "Версія"],
		china: ["⚙️ 选项", "语言", "显示与声音", "版本"]
	};

	// Überschrift des Panels mit dem Backup-Button.
	var DATEN = {
		de: "Daten", en: "Data", es: "Datos", pl: "Dane", it: "Dati", ru: "Данные", tu: "Veri",
		vi: "Dữ liệu", ba: "ডেটা", un: "Adatok", ukr: "Дані", china: "数据"
	};

	function sprache() {
		var lang = (typeof tempSprache !== "undefined" && tempSprache) || localStorage.getItem("langEnergie") || "de";
		return TEXTE[lang] ? lang : "de";
	}

	function el(id) {
		return document.getElementById(id);
	}

	// ---------- Kein Wechsel im Hintergrund, solange ein Popup offen ist ----------
	// Beim Öffnen eines Popups hält energystation.js den automatischen Spruch-/Bildwechsel an
	// (autoKlickPausieren), startet ihn aber z.B. nach einem Tab-Wechsel wieder
	// (visibilitychange), auch bei offenem Popup. Dieser Schutz überspringt den Wechsel deshalb
	// zusätzlich, solange irgendein Popup offen ist (Eigene Bilder & Texte mit Optionen und
	// Aufnahme, Backup, Starthilfe). Nach dem Schließen läuft der Wechsel wie gewohnt weiter.
	if (typeof clickOnDocument === "function") {
		var wechselOhneSchutz = clickOnDocument;
		window.clickOnDocument = function () {
			if (document.querySelector(".share-modal-backdrop.is-open")) return;
			wechselOhneSchutz();
		};
	}

	// ---------- Aufbau des Panels ----------
	var panel = el("panelEinstellungen");
	panel.innerHTML =
		'<div class="panel panel-default">' +
		'<div class="panel-heading" id="einstSpracheText"></div>' +
		'<div class="panel-body"><div class="row einst-flaggen" id="einstFlaggen"></div></div>' +
		'</div>' +
		'<div class="panel panel-default">' +
		'<div class="panel-heading" id="einstAnzeigeText"></div>' +
		'<div class="list-group" id="einstListe"></div>' +
		'</div>' +
		'<div class="panel panel-default">' +
		'<div class="panel-heading" id="einstDatenText"></div>' +
		'<div class="panel-body" id="einstDatenBody"></div>' +
		'</div>' +
		'<p class="text-center text-muted small einst-version" id="einstVersion"></p>';

	// Backup-Button (steht in index.html, Klick-Handler hängt an der Id) in die Optionen verschieben.
	var backupBtn = el("oeffneBackupModalBtn");
	backupBtn.className = "btn btn-default btn-block";
	el("einstDatenBody").appendChild(backupBtn);

	// Bootstrap-Raster: je Sprache eine Spalte (3 pro Zeile), darin ein Block-Button.
	var flaggen = el("einstFlaggen");
	SPRACHEN.forEach(function (s) {
		var spalte = document.createElement("div");
		spalte.className = "col-xs-4";
		var b = document.createElement("button");
		b.type = "button";
		b.className = "btn btn-default btn-block btn-sm einst-flagge";
		b.setAttribute("data-code", s.code);
		b.title = s.name;
		b.innerHTML = '<img src="' + s.bild + '" alt="" width="44" height="28"><span class="small"></span>';
		b.querySelector("span").textContent = s.name;
		b.addEventListener("click", function () { spracheWechseln(s.code); });
		spalte.appendChild(b);
		flaggen.appendChild(spalte);
	});

	// Zeile mit An/Aus-Schalter (Bootstrap list-group-item + btn-group) für vorlesen.js und
	// nur-eigene.js. Ids: <id>Zeile, <id>Text (Beschriftung), <id>An, <id>Aus.
	// An/Aus-Beschriftung der Schalter: [An, Aus]. Fehlt eine Sprache, gilt "en".
	window.energieAnAus = {
		de: ["An", "Aus"], en: ["On", "Off"], es: ["Activado", "Desactivado"], pl: ["Wł.", "Wył."],
		it: ["Attivo", "Spento"], ru: ["Вкл.", "Выкл."], tu: ["Açık", "Kapalı"], vi: ["Bật", "Tắt"],
		ba: ["চালু", "বন্ধ"], un: ["Be", "Ki"], ukr: ["Увімк.", "Вимк."], china: ["开", "关"]
	};

	// Der optionale dritte Parameter nennt die Liste, in die die Zeile kommt (Standard: "Anzeige & Ton").
	window.energieOptionZeile = function (id, icon, listeId) {
		var zeile = document.createElement("div");
		zeile.className = "list-group-item einst-zeile";
		zeile.id = id + "Zeile";
		zeile.innerHTML =
			'<span class="einst-zeile-text"><span class="einst-icon">' + icon + '</span><span id="' + id + 'Text"></span></span>' +
			'<div class="btn-group btn-group-sm" role="group">' +
			'<button type="button" class="btn btn-default" id="' + id + 'An"></button>' +
			'<button type="button" class="btn btn-default" id="' + id + 'Aus"></button>' +
			'</div>';
		el(listeId || "einstListe").appendChild(zeile);
		return zeile;
	};

	// setLanguage() (energystation.js) schreibt in #text1/#text2 der Startseite;
	// die gibt es nach dem ersten Tippen nicht mehr. Kurzzeitig versteckte
	// Platzhalter sorgen dafür, dass es trotzdem alle Einstellungen setzt
	// (Sprache, Texte der Startseite, Popup-Texte).
	function spracheWechseln(code) {
		var platzhalter = [];
		["text1", "text2"].forEach(function (id) {
			if (!el(id)) {
				var d = document.createElement("div");
				d.id = id;
				d.style.display = "none";
				document.body.appendChild(d);
				platzhalter.push(d);
			}
		});
		setLanguage(code);
		platzhalter.forEach(function (d) { d.parentNode.removeChild(d); });
		document.dispatchEvent(new CustomEvent("energie:sprache", { detail: code }));
	}
	// Auch für starthilfe.js (kleine Flaggen auf der Startseite und im Willkommens-Popup).
	window.energieSpracheWechseln = spracheWechseln;
	window.energieSprachen = SPRACHEN;

	function texteSetzen() {
		var texte = TEXTE[sprache()] || TEXTE.en;
		el("tabBtnEinstellungen").textContent = texte[0];
		el("einstSpracheText").textContent = texte[1];
		el("einstAnzeigeText").textContent = texte[2];
		el("einstDatenText").textContent = DATEN[sprache()] || DATEN.en;
		el("einstVersion").textContent = texte[3] + " " + VERSION;
		var aktuell = (typeof tempSprache !== "undefined" && tempSprache) || localStorage.getItem("langEnergie") || "de";
		flaggen.querySelectorAll(".einst-flagge").forEach(function (b) {
			b.classList.toggle("active", b.getAttribute("data-code") === aktuell);
		});
	}

	// Sprachwechsel über die Flaggen der Startseite und über dieses Panel.
	document.addEventListener("energie:sprache", texteSetzen);
	document.addEventListener("click", function (ev) {
		if (ev.target.closest && ev.target.closest("#sprache, #sprache1, #sprache2")) {
			setTimeout(function () {
				texteSetzen();
				document.dispatchEvent(new CustomEvent("energie:sprache"));
			}, 50);
		}
	});
	// Das Zahnrad oben rechts öffnet das Popup direkt auf dem Reiter "Optionen" (die App öffnet das Popup in
	// ihrem eigenen Klick-Handler, danach wird der Reiter umgeschaltet). Außerdem die Markierung der
	// aktuellen Sprache erneuern.
	var btnEigene = el("btn_eigene");
	if (btnEigene) {
		btnEigene.addEventListener("click", texteSetzen);
		btnEigene.addEventListener("click", function () {
			setTimeout(function () { el("tabBtnEinstellungen").click(); }, 0);
		});
	}

	// Beschriftung des Zahnrads (für Screenreader und Tooltip) in der gewählten Sprache.
	var ZAHNRAD = {
		de: "Einstellungen", en: "Settings", es: "Ajustes", pl: "Ustawienia", it: "Impostazioni", ru: "Настройки",
		tu: "Ayarlar", vi: "Cài đặt", ba: "সেটিংস", un: "Beállítások", ukr: "Налаштування", china: "设置"
	};
	function zahnradBeschriften() {
		if (!btnEigene) return;
		var text = ZAHNRAD[sprache()] || ZAHNRAD.en;
		btnEigene.setAttribute("aria-label", text);
		btnEigene.setAttribute("title", text);
	}
	document.addEventListener("energie:sprache", zahnradBeschriften);
	zahnradBeschriften();

	texteSetzen();
}());
