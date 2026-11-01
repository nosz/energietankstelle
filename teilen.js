/*jslint browser: true, sloppy: true*/

// ==================== Hinweistext beim Teilen ====================
// Beim Teilen des Bildes (Teilen-Button oben) wird ein kurzer Text mit Link zur Energietankstelle
// mitgeschickt, z.B. "Bild ist aus der Energietankstelle: https://nosz.github.io/energietankstelle",
// in der gewählten Sprache. In den Optionen (Panel "Teilen") lässt sich das ein- und ausschalten
// (Standard: an). energystation.js fragt den Text über energieTeilenText() ab.
(function () {
	"use strict";

	var KEY = "teilenHinweis";
	var LINK = "https://nosz.github.io/energietankstelle";

	// Hinweistext je Sprache (ohne Link, der Link wird angehängt). Fehlt eine Sprache, gilt "en".
	var HINWEIS = {
		de: "Bild ist aus der Energietankstelle:",
		en: "Image from the Energy Station:",
		es: "Imagen de la Estación de Energía:",
		pl: "Obraz ze Stacji Energii:",
		it: "Immagine dalla Stazione di energia:",
		ru: "Изображение из Энергетической станции:",
		tu: "Görsel Enerji İstasyonu’ndan:",
		vi: "Hình ảnh từ Trạm năng lượng:",
		ba: "ছবিটি এনার্জি স্টেশন থেকে:",
		un: "A kép az Energiaállomásról való:",
		ukr: "Зображення з Енергетичної заправки:",
		china: "图片来自能量加油站："
	};

	// Beschriftung der Zeile in den Optionen und Überschrift des Panels.
	var ZEILE = {
		de: "Hinweis beim Teilen anhängen",
		en: "Add a note when sharing",
		es: "Añadir una nota al compartir",
		pl: "Dodaj informację przy udostępnianiu",
		it: "Aggiungi una nota quando condividi",
		ru: "Добавлять подпись при отправке",
		tu: "Paylaşırken not ekle",
		vi: "Thêm ghi chú khi chia sẻ",
		ba: "শেয়ার করার সময় নোট যোগ করুন",
		un: "Megjegyzés hozzáadása megosztáskor",
		ukr: "Додавати примітку під час надсилання",
		china: "分享时附带说明"
	};
	var PANEL = {
		de: "Teilen", en: "Share", es: "Compartir", pl: "Udostępnianie", it: "Condivisione", ru: "Отправка",
		tu: "Paylaşım", vi: "Chia sẻ", ba: "শেয়ার", un: "Megosztás", ukr: "Надсилання", china: "分享"
	};

	// Beschriftung des Eingabefelds für den eigenen Text und des Zurücksetzen-Knopfs: [Feld, Zurücksetzen].
	var EIGEN = {
		de: ["Eigener Text (leer lassen für den Standardtext)", "Zurücksetzen"],
		en: ["Your own text (leave empty for the default text)", "Reset"],
		es: ["Texto propio (déjalo vacío para el texto estándar)", "Restablecer"],
		pl: ["Własny tekst (zostaw puste dla tekstu standardowego)", "Przywróć"],
		it: ["Testo personale (lascia vuoto per il testo standard)", "Ripristina"],
		ru: ["Свой текст (оставьте пустым для стандартного)", "Сбросить"],
		tu: ["Kendi metnin (standart metin için boş bırak)", "Sıfırla"],
		vi: ["Văn bản riêng (để trống để dùng văn bản mặc định)", "Đặt lại"],
		ba: ["নিজের লেখা (ডিফল্ট লেখার জন্য ফাঁকা রাখুন)", "রিসেট"],
		un: ["Saját szöveg (hagyd üresen az alapértelmezetthez)", "Visszaállítás"],
		ukr: ["Власний текст (залиште порожнім для стандартного)", "Скинути"],
		china: ["自定义文字（留空则使用默认文字）", "恢复默认"]
	};
	var EIGEN_KEY = "teilenText";
	var EIGEN_MAX = 300;

	var an = true;
	try { an = localStorage.getItem(KEY) !== "0"; } catch (e) {}
	// Eigener Text des Nutzers: ersetzt den Standardtext in allen Sprachen. Leer = Standardtext.
	var eigenerText = "";
	try { eigenerText = localStorage.getItem(EIGEN_KEY) || ""; } catch (e) {}

	function sprache() {
		var lang = (typeof tempSprache !== "undefined" && tempSprache) || localStorage.getItem("langEnergie") || "de";
		return HINWEIS[lang] ? lang : "de";
	}

	function el(id) {
		return document.getElementById(id);
	}

	function standardText() {
		return (HINWEIS[sprache()] || HINWEIS.en) + " " + LINK;
	}

	// Der Text, der beim Teilen mitgeschickt wird: der eigene des Nutzers, sonst der Standardtext.
	function hinweisText() {
		return eigenerText.trim() !== "" ? eigenerText.trim() : standardText();
	}

	// Von energystation.js beim Teilen abgefragt: der Text, oder "" wenn die Option aus ist.
	window.energieTeilenText = function () {
		return an ? hinweisText() : "";
	};

	// ---------- Panel "Teilen" in den Optionen (vor "Daten") ----------
	var daten = el("einstDatenText").parentNode;
	var panel = document.createElement("div");
	panel.className = "panel panel-default";
	panel.innerHTML = '<div class="panel-heading" id="teilenPanelText"></div><div class="list-group" id="teilenListe"></div>';
	daten.parentNode.insertBefore(panel, daten);

	var zeile = window.energieOptionZeile("teilenHinweis", "📤", "teilenListe");
	// Eingabefeld für einen eigenen Text (Bootstrap form-control).
	var eigenBox = document.createElement("div");
	eigenBox.className = "list-group-item teilen-eigen";
	eigenBox.id = "teilenEigenBox";
	eigenBox.innerHTML =
		'<label class="control-label small" for="teilenEigenText" id="teilenEigenLabel"></label>' +
		'<textarea class="form-control" id="teilenEigenText" rows="3" maxlength="' + EIGEN_MAX + '"></textarea>' +
		'<button type="button" class="btn btn-default btn-xs" id="teilenZuruecksetzen"></button>';
	el("teilenListe").appendChild(eigenBox);

	var vorschau = document.createElement("div");
	vorschau.className = "list-group-item small text-muted teilen-vorschau";
	vorschau.id = "teilenVorschau";
	el("teilenListe").appendChild(vorschau);

	function aktualisieren() {
		var lang = sprache();
		var schalter = window.energieAnAus[lang] || window.energieAnAus.en;
		el("teilenPanelText").textContent = PANEL[lang] || PANEL.en;
		el("teilenHinweisText").textContent = ZEILE[lang] || ZEILE.en;
		el("teilenHinweisAn").textContent = schalter[0];
		el("teilenHinweisAus").textContent = schalter[1];
		el("teilenHinweisAn").classList.toggle("active", an);
		el("teilenHinweisAus").classList.toggle("active", !an);
		// Eigener Text: Beschriftung, Platzhalter = Standardtext der gewählten Sprache.
		var eigen = EIGEN[lang] || EIGEN.en;
		var feld = el("teilenEigenText");
		el("teilenEigenLabel").textContent = eigen[0];
		el("teilenZuruecksetzen").textContent = eigen[1];
		feld.placeholder = standardText();
		if (feld.value !== eigenerText) feld.value = eigenerText;
		el("teilenZuruecksetzen").style.display = eigenerText !== "" ? "" : "none";
		eigenBox.style.display = an ? "" : "none";
		// Vorschau: so sieht der mitgeschickte Text aus.
		vorschau.textContent = hinweisText();
		vorschau.style.display = an ? "" : "none";
	}

	el("teilenEigenText").addEventListener("input", function () {
		eigenerText = el("teilenEigenText").value;
		try {
			if (eigenerText.trim() === "") localStorage.removeItem(EIGEN_KEY);
			else localStorage.setItem(EIGEN_KEY, eigenerText);
		} catch (e) {}
		aktualisieren();
	});
	el("teilenZuruecksetzen").addEventListener("click", function () {
		eigenerText = "";
		try { localStorage.removeItem(EIGEN_KEY); } catch (e) {}
		aktualisieren();
	});

	function setzen(neu) {
		if (an === neu) return;
		an = neu;
		try { localStorage.setItem(KEY, an ? "1" : "0"); } catch (e) {}
		aktualisieren();
	}
	el("teilenHinweisAn").addEventListener("click", function () { setzen(true); });
	el("teilenHinweisAus").addEventListener("click", function () { setzen(false); });

	// Beschriftung an die Sprache anpassen: beim Öffnen des Popups und nach Sprachwechsel.
	document.addEventListener("energie:sprache", aktualisieren);
	var btnEigene = el("btn_eigene");
	if (btnEigene) btnEigene.addEventListener("click", aktualisieren);
	document.addEventListener("click", function (ev) {
		if (ev.target.closest && ev.target.closest("#sprache, #sprache1, #sprache2")) setTimeout(aktualisieren, 50);
	});

	aktualisieren();
}());
