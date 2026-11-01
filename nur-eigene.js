/*jslint browser: true, sloppy: true*/

// ==================== Nur eigene Sprüche / Bilder anzeigen ====================
// Zwei Optionen im Popup "Eigene Bilder & Texte" (An/Aus, Standard: aus). Ist
// eine an, zieht energystation.js (ziehNaechstenSpruch bzw. zieheNaechstesBild)
// nur aus den eigenen Texten bzw. Bildern. Die beiden Optionen sind
// unabhängig. Eine Option erscheint nur, solange es eigene Texte bzw. Bilder
// gibt; verschwinden sie, wird die Option wieder auf "Aus" gesetzt.
(function () {
	"use strict";

	var SPRACHEN = ["de", "en", "es", "pl", "it", "ru", "tu", "vi", "ba", "un", "ukr", "china"];

	// An/Aus: [An, Aus] je Sprache (Tabelle aus einstellungen.js). Fehlt eine Sprache, gilt "en".
	var AN_AUS = window.energieAnAus;

	// Je Option: Speicherschlüssel, Symbol, Beschriftung je Sprache und Zähler der eigenen Einträge.
	var OPTIONEN = [
		{
			id: "nurEigeneSprueche",
			icon: "✍️",
			anzahl: function () { return typeof ladeEigeneSprueche === "function" ? ladeEigeneSprueche().length : 0; },
			beobachte: "eigeneSpruecheListe",
			text: {
				de: "Nur eigene Sprüche anzeigen",
				en: "Show only my own texts",
				es: "Mostrar solo mis textos",
				pl: "Pokazuj tylko moje teksty",
				it: "Mostra solo i miei testi",
				ru: "Показывать только мои тексты",
				tu: "Yalnızca kendi metinlerimi göster",
				vi: "Chỉ hiện văn bản của tôi",
				ba: "শুধু আমার লেখা দেখান",
				un: "Csak saját szövegek megjelenítése",
				ukr: "Показувати лише мої тексти",
				china: "仅显示我自己的文字"
			}
		},
		{
			id: "nurEigeneBilder",
			icon: "🖼️",
			anzahl: function () { return typeof ladeEigeneBilder === "function" ? ladeEigeneBilder().length : 0; },
			beobachte: "eigeneBilderListe",
			text: {
				de: "Nur eigene Bilder anzeigen",
				en: "Show only my own images",
				es: "Mostrar solo mis imágenes",
				pl: "Pokazuj tylko moje obrazy",
				it: "Mostra solo le mie immagini",
				ru: "Показывать только мои изображения",
				tu: "Yalnızca kendi resimlerimi göster",
				vi: "Chỉ hiện hình ảnh của tôi",
				ba: "শুধু আমার ছবি দেখান",
				un: "Csak saját képek megjelenítése",
				ukr: "Показувати лише мої зображення",
				china: "仅显示我自己的图片"
			}
		}
	];

	function sprache() {
		var lang = (typeof tempSprache !== "undefined" && tempSprache) || localStorage.getItem("langEnergie") || "de";
		return SPRACHEN.indexOf(lang) >= 0 ? lang : "de";
	}

	function el(id) {
		return document.getElementById(id);
	}

	var btnEigene = el("btn_eigene");

	OPTIONEN.forEach(function (opt) {
		var an = false;
		try { an = localStorage.getItem(opt.id) === "1"; } catch (e) {}

		// Zeile mit An/Aus-Schalter in der Liste "Anzeige & Ton" (einstellungen.js).
		var zeile = window.energieOptionZeile(opt.id, opt.icon);

		function aktualisieren() {
			var vorhanden = opt.anzahl() > 0;
			// Ohne eigene Einträge gibt es nichts zu filtern: Option ausblenden und zurücksetzen.
			if (!vorhanden && an) {
				an = false;
				try { localStorage.setItem(opt.id, "0"); } catch (e) {}
			}
			zeile.style.display = vorhanden ? "" : "none";
			var lang = sprache();
			var schalter = AN_AUS[lang] || AN_AUS.en;
			el(opt.id + "Text").textContent = opt.text[lang] || opt.text.en;
			el(opt.id + "An").textContent = schalter[0];
			el(opt.id + "Aus").textContent = schalter[1];
			el(opt.id + "An").classList.toggle("active", an);
			el(opt.id + "Aus").classList.toggle("active", !an);
		}

		function setzen(neu) {
			if (an === neu) return;
			an = neu;
			try { localStorage.setItem(opt.id, an ? "1" : "0"); } catch (e) {}
			aktualisieren();
		}
		el(opt.id + "An").addEventListener("click", function () { setzen(true); });
		el(opt.id + "Aus").addEventListener("click", function () { setzen(false); });

		// Beschriftung an die aktuelle Sprache anpassen: beim Öffnen des Popups,
		// nach Sprachwechsel über die Flaggen und wenn sich die Liste der eigenen Einträge ändert.
		if (btnEigene) btnEigene.addEventListener("click", aktualisieren);
		document.addEventListener("energie:sprache", aktualisieren);
		document.addEventListener("click", function (ev) {
			if (ev.target.closest && ev.target.closest("#sprache, #sprache1, #sprache2")) {
				setTimeout(aktualisieren, 50);
			}
		});
		var liste = el(opt.beobachte);
		if (liste && window.MutationObserver) {
			new MutationObserver(aktualisieren).observe(liste, { childList: true });
		}

		aktualisieren();
	});
}());
