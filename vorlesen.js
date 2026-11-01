/*jslint browser: true, sloppy: true*/

// ==================== Vorlesen ====================
// Optional: Jeder neu angezeigte Spruch wird zusätzlich per Ton vorgelesen.
// Einstellung (An/Aus und Stimme) liegt im Popup "Eigene Bilder & Texte" und
// wird nur lokal im Browser gespeichert. Standard: aus.
//
// Eigene Texte können mit der eigenen Stimme eingesprochen werden. Die
// Aufnahme liegt nur lokal im Browser (IndexedDB, Schlüssel = Text des
// Spruchs) und wird statt der Computerstimme abgespielt, sobald dieser Text
// angezeigt wird und "Vorlesen" an ist.
(function () {
	"use strict";

	var AN_KEY = "vorlesenAn";
	var STIMME_KEY = "vorlesenStimme";
	var AUFNAHME_MAX_MS = 60000;

	// Sprachcode der App -> Sprech-Sprache.
	var SPRECH_SPRACHE = {
		de: "de-DE", en: "en-US", es: "es-ES", pl: "pl-PL", it: "it-IT", ru: "ru-RU",
		tu: "tr-TR", vi: "vi-VN", ba: "bn-BD", un: "hu-HU", ukr: "uk-UA", china: "zh-CN"
	};

	// Oberflächen-Texte: [Vorlesen, An, Aus, Stimme, Automatisch]. Fehlt eine Sprache, gilt "en".
	var TEXTE = {
		de: ["Vorlesen", "An", "Aus", "Stimme", "Automatisch"],
		en: ["Read aloud", "On", "Off", "Voice", "Automatic"],
		es: ["Leer en voz alta", "Activado", "Desactivado", "Voz", "Automática"],
		pl: ["Czytaj na głos", "Wł.", "Wył.", "Głos", "Automatyczny"],
		it: ["Leggi ad alta voce", "Attivo", "Spento", "Voce", "Automatica"],
		ru: ["Читать вслух", "Вкл.", "Выкл.", "Голос", "Автоматически"],
		tu: ["Sesli oku", "Açık", "Kapalı", "Ses", "Otomatik"],
		vi: ["Đọc to", "Bật", "Tắt", "Giọng", "Tự động"],
		ba: ["জোরে পড়ুন", "চালু", "বন্ধ", "কণ্ঠ", "স্বয়ংক্রিয়"],
		un: ["Felolvasás", "Be", "Ki", "Hang", "Automatikus"],
		ukr: ["Читати вголос", "Увімк.", "Вимк.", "Голос", "Автоматично"],
		china: ["朗读", "开", "关", "声音", "自动"]
	};

	// Texte der Aufnahme-Knöpfe: [Aufnehmen, Stopp, Anhören, Aufnahme löschen, Mikrofon nicht erlaubt, Speichern nicht möglich].
	var AUFNAHME_TEXTE = {
		de: ["Aufnehmen", "Stopp", "Anhören", "Aufnahme löschen", "Mikrofon nicht erlaubt", "Speichern nicht möglich", "Aufnahme nicht möglich"],
		en: ["Record", "Stop", "Play", "Delete recording", "Microphone not allowed", "Could not save", "Recording not possible"],
		es: ["Grabar", "Parar", "Escuchar", "Borrar grabación", "Micrófono no permitido", "No se pudo guardar", "Grabación no posible"],
		pl: ["Nagraj", "Stop", "Odtwórz", "Usuń nagranie", "Mikrofon niedozwolony", "Nie udało się zapisać", "Nagrywanie niemożliwe"],
		it: ["Registra", "Stop", "Ascolta", "Elimina registrazione", "Microfono non consentito", "Impossibile salvare", "Registrazione non possibile"],
		ru: ["Записать", "Стоп", "Слушать", "Удалить запись", "Микрофон не разрешён", "Не удалось сохранить", "Запись невозможна"],
		tu: ["Kaydet", "Durdur", "Dinle", "Kaydı sil", "Mikrofona izin verilmedi", "Kaydedilemedi", "Kayıt yapılamıyor"],
		vi: ["Ghi âm", "Dừng", "Nghe", "Xóa bản ghi", "Micro không được phép", "Không thể lưu", "Không thể ghi âm"],
		ba: ["রেকর্ড", "থামুন", "শুনুন", "রেকর্ডিং মুছুন", "মাইক্রোফোনের অনুমতি নেই", "সংরক্ষণ করা যায়নি", "রেকর্ড করা সম্ভব নয়"],
		un: ["Felvétel", "Leállítás", "Lejátszás", "Felvétel törlése", "A mikrofon nem engedélyezett", "Nem sikerült menteni", "A felvétel nem lehetséges"],
		ukr: ["Записати", "Стоп", "Слухати", "Видалити запис", "Мікрофон не дозволено", "Не вдалося зберегти", "Запис неможливий"],
		china: ["录音", "停止", "播放", "删除录音", "麦克风未被允许", "无法保存", "无法录音"]
	};

	var an = false;
	var letzterText = "";
	var letzterRoh = "";
	var wiedergabeToken = 0;
	var audio = null;
	var audioUrl = null;
	var IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
	var audioKontext = null;   // Web Audio für die Wiedergabe eigener Aufnahmen
	var quelle = null;         // laufende Aufnahme-Wiedergabe über Web Audio
	var AUFNAHME_ENDE_KUERZEN_S = 0.1;   // vom Ende längerer Aufnahmen weglassen
	var AUFNAHME_AUSBLENDEN_S = 0.12;    // Länge der Ausblendung am Ende

	function sprache() {
		var lang = (typeof tempSprache !== "undefined" && tempSprache) || localStorage.getItem("langEnergie") || "de";
		return SPRECH_SPRACHE[lang] ? lang : "de";
	}

	function t(index) {
		return (TEXTE[sprache()] || TEXTE.en)[index];
	}

	function ta(index) {
		return (AUFNAHME_TEXTE[sprache()] || AUFNAHME_TEXTE.en)[index];
	}

	function el(id) {
		return document.getElementById(id);
	}

	// Alte Wecker-Einstellungen aus früheren Versionen aufräumen.
	try {
		["weckerZiel", "weckerZeit", "weckerTaeglich", "weckerStimme"].forEach(function (k) {
			localStorage.removeItem(k);
		});
		an = localStorage.getItem(AN_KEY) === "1";
	} catch (e) {}

	// ==================== Eigene Aufnahmen (IndexedDB) ====================
	var DB_NAME = "energietankstelleStimmen";
	var STORE = "aufnahmen";

	function aufnahmeMoeglich() {
		return !!(window.indexedDB && window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
	}

	function dbOeffnen() {
		return new Promise(function (resolve, reject) {
			var req = indexedDB.open(DB_NAME, 1);
			req.onupgradeneeded = function () { req.result.createObjectStore(STORE); };
			req.onsuccess = function () { resolve(req.result); };
			req.onerror = function () { reject(req.error); };
		});
	}

	// Führt eine Operation auf dem Object Store aus und liefert deren Ergebnis.
	function dbAktion(modus, aktion) {
		return dbOeffnen().then(function (db) {
			return new Promise(function (resolve, reject) {
				var tx = db.transaction(STORE, modus);
				var req = aktion(tx.objectStore(STORE));
				tx.oncomplete = function () { db.close(); resolve(req ? req.result : undefined); };
				tx.onerror = tx.onabort = function () { db.close(); reject(tx.error); };
			});
		});
	}

	function aufnahmeLaden(key) {
		if (!window.indexedDB || !key) return Promise.resolve(null);
		return dbAktion("readonly", function (s) { return s.get(key); }).then(function (b) { return b || null; });
	}

	function aufnahmeSpeichern(key, blob) {
		return dbAktion("readwrite", function (s) { return s.put(blob, key); });
	}

	function aufnahmeLoeschen(key) {
		return dbAktion("readwrite", function (s) { return s.delete(key); });
	}

	function alleSchluessel() {
		if (!window.indexedDB) return Promise.resolve([]);
		return dbAktion("readonly", function (s) { return s.getAllKeys(); }).then(function (k) { return k || []; });
	}

	// ==================== Ton ausgeben ====================
	function audioSpielt() {
		return !!(audio && !audio.paused && !audio.ended);
	}

	function audioStoppen() {
		if (quelle) {
			var q = quelle;
			quelle = null;
			q.onended = null;
			try { q.stop(); } catch (e) {}
		}
		if (audio) {
			audio.pause();
			audio = null;
		}
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
			audioUrl = null;
		}
	}

	// ---------- Läuft gerade eine Ausgabe? ----------
	// Solange vorgelesen oder eine Aufnahme abgespielt wird (und kurz davor, bis die Ausgabe
	// startet), sind Tippen, Wischen und der automatische Wechsel auf der Oberfläche gesperrt.
	// Ein eigenes Merkmal statt speechSynthesis.speaking, das in manchen Browsern hängen bleibt;
	// zusätzlich beendet eine Zeitsicherung die Sperre, falls ein Ende-Ereignis ausbleibt.
	var ausgabe = false;
	var ausgabeTimer = null;
	var badge = document.createElement("div");
	badge.id = "vorlesenBadge";
	badge.className = "vorlesen-badge";
	badge.setAttribute("aria-hidden", "true");
	badge.textContent = "🔊";
	document.body.appendChild(badge);

	function ausgabeBeginnt(maxMs) {
		ausgabe = true;
		clearTimeout(ausgabeTimer);
		ausgabeTimer = setTimeout(ausgabeEnde, maxMs);
		badge.classList.add("is-on");
	}

	function ausgabeEnde() {
		ausgabe = false;
		clearTimeout(ausgabeTimer);
		badge.classList.remove("is-on");
	}

	function vorlesenLaeuft() {
		return ausgabe;
	}

	function allesStoppen() {
		wiedergabeToken += 1;
		utteranceId += 1; // eine noch wartende Sprachausgabe (iOS-Verzögerung) verfällt
		audioStoppen();
		if (window.speechSynthesis) window.speechSynthesis.cancel();
		ausgabeEnde();
	}

	// Einfacher Weg über ein Audio-Element (Rückfall, falls das Dekodieren unten nicht klappt).
	function aufnahmeEinfachAbspielen(blob) {
		audioStoppen();
		audioUrl = URL.createObjectURL(blob);
		var a = new Audio(audioUrl);
		audio = a;
		var ende = function () { if (audio === a) ausgabeEnde(); };
		a.addEventListener("ended", ende);
		a.addEventListener("error", ende);
		a.addEventListener("pause", ende);
		ausgabeBeginnt(125000);
		a.play().catch(ende);
	}

	// Aufnahmen werden über Web Audio abgespielt: Das Ende wird weich ausgeblendet (und der Anfang
	// eingeblendet), und von längeren Aufnahmen entfällt der letzte Moment. So bleibt am Ende des
	// Spruchs kein Knacken oder Klicken (z.B. vom Fertig-Knopf) übrig, auch bei älteren Aufnahmen.
	function aufnahmeAbspielen(blob) {
		audioStoppen();
		var ctx = audioKontext;
		if (!ctx) {
			var AC = window.AudioContext || window.webkitAudioContext;
			if (AC) {
				try { ctx = audioKontext = new AC(); } catch (e) { ctx = null; }
			}
		}
		if (!ctx || !blob.arrayBuffer) {
			aufnahmeEinfachAbspielen(blob);
			return;
		}
		var token = wiedergabeToken;
		ausgabeBeginnt(125000);
		ctx.resume().catch(function () {});
		blob.arrayBuffer().then(function (daten) {
			return ctx.decodeAudioData(daten);
		}).then(function (buffer) {
			if (token !== wiedergabeToken) return; // inzwischen gestoppt oder ein anderer Spruch
			var beginn = ctx.currentTime + 0.02;
			var laenge = buffer.duration > 1 ? buffer.duration - AUFNAHME_ENDE_KUERZEN_S : buffer.duration;
			var lautstaerke = ctx.createGain();
			lautstaerke.gain.setValueAtTime(0, beginn);
			lautstaerke.gain.linearRampToValueAtTime(1, beginn + 0.02);
			lautstaerke.gain.setValueAtTime(1, beginn + Math.max(0.03, laenge - AUFNAHME_AUSBLENDEN_S));
			lautstaerke.gain.linearRampToValueAtTime(0, beginn + laenge);
			var s = ctx.createBufferSource();
			s.buffer = buffer;
			s.connect(lautstaerke);
			lautstaerke.connect(ctx.destination);
			quelle = s;
			s.onended = function () {
				if (quelle === s) {
					quelle = null;
					ausgabeEnde();
				}
			};
			s.start(beginn, 0, laenge);
		}).catch(function () {
			if (token === wiedergabeToken) aufnahmeEinfachAbspielen(blob);
		});
	}

	// ---------- Einstellung im Popup "Eigene Bilder & Texte" ----------
	// Zeile "Vorlesen" mit An/Aus (einstellungen.js) und darunter die Stimmenwahl.
	window.energieOptionZeile("vorlesen", "🔊");
	var stimmeBox = document.createElement("div");
	stimmeBox.className = "list-group-item vorlesen-stimme";
	stimmeBox.id = "vorlesenStimmeBox";
	stimmeBox.innerHTML =
		'<label class="control-label small" for="vorlesenStimme" id="vorlesenStimmeText"></label>' +
		'<div class="input-group" id="vorlesenStimmeGruppe">' +
		'<select class="form-control" id="vorlesenStimme"></select>' +
		'<span class="input-group-btn"><button type="button" class="btn btn-default" id="vorlesenTest"></button></span>' +
		'</div>' +
		'<p class="text-warning small vorlesen-keine-stimme" id="vorlesenKeineStimme"></p>';
	el("einstListe").appendChild(stimmeBox);

	// Testen-Knopf: in den Einstellungen wird nie von selbst gesprochen. Die Stimme kommt nur, wenn
	// jemand hier auf "Testen" tippt. Je Sprache: [Knopf, Beispielsatz].
	var TEST = {
		de: ["Testen", "Hallo! So klingt die ausgewählte Stimme."],
		en: ["Test", "Hello! This is how the selected voice sounds."],
		es: ["Probar", "¡Hola! Así suena la voz seleccionada."],
		pl: ["Testuj", "Cześć! Tak brzmi wybrany głos."],
		it: ["Prova", "Ciao! Ecco come suona la voce selezionata."],
		ru: ["Проверить", "Здравствуйте! Так звучит выбранный голос."],
		tu: ["Dene", "Merhaba! Seçilen ses böyle duyuluyor."],
		vi: ["Thử", "Xin chào! Đây là giọng đọc bạn đã chọn."],
		ba: ["পরীক্ষা", "হ্যালো! নির্বাচিত কণ্ঠ এভাবেই শোনায়।"],
		un: ["Teszt", "Szia! Így hangzik a kiválasztott hang."],
		ukr: ["Перевірити", "Привіт! Ось як звучить вибраний голос."],
		china: ["试听", "你好！所选语音听起来就是这样。"]
	};

	// Hinweis, wenn für die gewählte Sprache keine Stimme auf dem Gerät installiert ist.
	var KEINE_STIMME = {
		de: "Für diese Sprache ist auf diesem Gerät keine Stimme installiert, deshalb wird nicht vorgelesen.",
		en: "No voice is installed on this device for this language, so nothing is read aloud.",
		es: "No hay ninguna voz instalada en este dispositivo para este idioma, por eso no se lee en voz alta.",
		pl: "Na tym urządzeniu nie ma zainstalowanego głosu dla tego języka, więc nic nie jest czytane.",
		it: "Su questo dispositivo non è installata nessuna voce per questa lingua, quindi non viene letto nulla.",
		ru: "Для этого языка на устройстве не установлен голос, поэтому чтение вслух отключено.",
		tu: "Bu cihazda bu dil için yüklü bir ses yok, bu yüzden sesli okunmaz.",
		vi: "Thiết bị này chưa cài giọng đọc cho ngôn ngữ này nên sẽ không đọc to.",
		ba: "এই ডিভাইসে এই ভাষার জন্য কোনো কণ্ঠ ইনস্টল করা নেই, তাই জোরে পড়া হবে না।",
		un: "Ezen az eszközön nincs telepítve hang ehhez a nyelvhez, ezért nem olvassa fel.",
		ukr: "На цьому пристрої не встановлено голос для цієї мови, тому читання вголос вимкнено.",
		china: "此设备上没有安装该语言的语音，因此不会朗读。"
	};

	function stimmen() {
		if (!window.speechSynthesis) return [];
		var praefix = SPRECH_SPRACHE[sprache()].slice(0, 2).toLowerCase();
		return window.speechSynthesis.getVoices().filter(function (v) {
			return v.lang.replace("_", "-").toLowerCase().indexOf(praefix) === 0;
		});
	}

	function stimmenListeFuellen() {
		var select = el("vorlesenStimme");
		var gemerkt = select.value || localStorage.getItem(STIMME_KEY) || "";
		select.innerHTML = "";
		var optionen = [["", t(4)]];
		stimmen().forEach(function (v) { optionen.push([v.voiceURI, v.name]); });
		optionen.forEach(function (o) {
			var opt = document.createElement("option");
			opt.value = o[0];
			opt.textContent = o[1];
			select.appendChild(opt);
		});
		select.value = optionen.some(function (o) { return o[0] === gemerkt; }) ? gemerkt : "";
	}

	function oberflaecheAktualisieren() {
		el("vorlesenText").textContent = t(0);
		el("vorlesenAn").textContent = t(1);
		el("vorlesenAus").textContent = t(2);
		el("vorlesenAn").classList.toggle("active", an);
		el("vorlesenAus").classList.toggle("active", !an);
		el("vorlesenStimmeText").textContent = t(3);
		el("vorlesenStimmeBox").style.display = an ? "" : "none";
		stimmenListeFuellen();
		var keine = keineStimmeFuerSprache();
		el("vorlesenTest").textContent = "▶ " + (TEST[sprache()] || TEST.en)[0];
		el("vorlesenStimmeGruppe").style.display = keine ? "none" : "";
		el("vorlesenStimmeText").style.display = keine ? "none" : "";
		el("vorlesenKeineStimme").textContent = keine ? (KEINE_STIMME[sprache()] || KEINE_STIMME.en) : "";
		el("vorlesenKeineStimme").style.display = keine ? "" : "none";
	}

	// ---------- Sprechen ----------
	// HTML-Reste und Emojis entfernen: Emojis (z.B. rotes Herz) bleiben im
	// Spruch sichtbar, werden aber nicht vorgelesen.
	function sprechText(raw) {
		var d = document.createElement("div");
		d.innerHTML = String(raw).replace(/<br\s*\/?>/gi, " ");
		var text = (d.textContent || "").replace(/[\p{Extended_Pictographic}\p{Regional_Indicator}\u{1F3FB}-\u{1F3FF}︎️‍⃣]/gu, "");
		// Textsmileys wie ":-)", ";)", ":D", "<3" oder "^^" würden die Stimmen als
		// "lächelnder Smiley" vorlesen. Nur entfernen, wenn danach ein Leerzeichen,
		// Satzzeichen oder das Ende folgt (und davor keine Ziffer steht), damit
		// Uhrzeiten wie "10:30", "(Punkt 8)" oder Links erhalten bleiben.
		text = text.replace(/(^|[^\d])(?:[:;=][-^']?[)(\]\[DdPpOo3*\/\\|@$]|[xX]D|<\/?3|\^_?\^|-_-|[oO]_[oO]|T_T)(?=$|[\s.,!?])/g, "$1");
		// Punktfolgen ("Heute .... ist wunderschön"), "…" und Unterstrich-Lücken ("____")
		// sollen nicht buchstabiert oder als "Punkt Punkt Punkt" gelesen werden, sondern nur
		// eine kurze Pause ergeben: mitten im Satz ein Komma, am Ende ein Punkt.
		text = text
			.replace(/([?!])\s*(?:\.{2,}|…|_{2,})\s*$/, "$1")
			.replace(/\s*(?:\.{2,}|…|_{2,})\s*$/, ".")
			.replace(/([?!,;:])\s*(?:\.{2,}|…|_{2,})\s*/g, "$1 ")
			.replace(/\s*(?:\.{2,}|…|_{2,})\s*/g, ", ");
		return lateinInKyrillischen(text.replace(/\s+/g, " ").replace(/\s+([,.!?])/g, "$1").trim());
	}

	// Manche Texte (z.B. Ukrainisch) enthalten in kyrillischen Wörtern versehentlich
	// lateinische Buchstaben, die genauso aussehen ("гoл" mit lateinischem o). Die
	// Stimme würde mitten im Wort die Sprache wechseln. Nur fürs Vorlesen werden sie
	// durch die kyrillischen Buchstaben ersetzt; die Anzeige bleibt unverändert.
	var LATEIN_ZU_KYRILLISCH = {
		a: "а", c: "с", e: "е", o: "о", p: "р", x: "х", y: "у",
		A: "А", B: "В", C: "С", E: "Е", H: "Н", K: "К", M: "М", O: "О", P: "Р", T: "Т", X: "Х"
	};

	function lateinInKyrillischen(text) {
		var lang = sprache();
		if (lang !== "ru" && lang !== "ukr") return text;
		return text.replace(/\S+/g, function (wort) {
			if (!/[Ѐ-ӿ]/.test(wort)) return wort;
			return wort.replace(/[A-Za-z]/g, function (c) {
				if (c === "i") return lang === "ukr" ? "і" : c;
				if (c === "I") return lang === "ukr" ? "І" : c;
				return LATEIN_ZU_KYRILLISCH[c] || c;
			});
		});
	}

	// Stimmen werden vom Browser oft erst nach dem Laden geliefert. Solange noch
	// keine Stimme bekannt ist, wird trotzdem gesprochen; sind Stimmen da, aber keine
	// für die Sprache der App, wird nicht vorgelesen (eine fremde Stimme würde den
	// Text unverständlich sprechen).
	function keineStimmeFuerSprache() {
		return !!window.speechSynthesis && window.speechSynthesis.getVoices().length > 0 && stimmen().length === 0;
	}

	var utteranceId = 0;

	// Liefert true, wenn gesprochen wird (false: nichts zu sprechen oder keine passende Stimme).
	function sprich(text) {
		if (!window.speechSynthesis || !text || keineStimmeFuerSprache()) return false;
		window.speechSynthesis.cancel();
		var lang = SPRECH_SPRACHE[sprache()];
		var u = new SpeechSynthesisUtterance(text);
		u.lang = lang;
		u.rate = 0.95;
		var liste = stimmen();
		var wahl = el("vorlesenStimme").value;
		var stimme = liste.filter(function (v) { return v.voiceURI === wahl; })[0] || liste[0];
		if (stimme) u.voice = stimme;
		// Ende melden, aber nur für die aktuelle Ausgabe (cancel() meldet auch die vorherige).
		var id = ++utteranceId;
		var ende = function () { if (id === utteranceId) ausgabeEnde(); };
		u.onend = ende;
		u.onerror = ende;
		ausgabeBeginnt(Math.min(90000, 8000 + text.length * 130));
		var los = function () {
			if (id !== utteranceId) return; // inzwischen kam eine neuere Ausgabe oder ein Stopp
			window.speechSynthesis.resume(); // iOS lässt die Ausgabe sonst manchmal pausiert
			window.speechSynthesis.speak(u);
		};
		// iOS verwirft ein speak(), das direkt nach cancel() kommt: kurz warten.
		if (IOS) setTimeout(los, 80);
		else los();
		return true;
	}

	// ---------- iPhone/iPad: Ton freischalten ----------
	// Safari auf iOS erlaubt Sprache und Web Audio erst, nachdem sie einmal direkt aus einem Tippen
	// gestartet wurden. Gesprochen wird aber später (Timer, Datenbank-Abfrage), außerhalb des Tippens, und
	// bliebe stumm. Beim ersten Tippen werden deshalb einmal lautlos Sprache und Audio angestoßen.
	if (IOS) {
		var freigeschaltet = false;
		var freischalten = function () {
			if (freigeschaltet) return;
			freigeschaltet = true;
			["touchend", "click"].forEach(function (name) { document.removeEventListener(name, freischalten, true); });
			try {
				if (window.speechSynthesis) {
					var stumm = new SpeechSynthesisUtterance(" ");
					stumm.volume = 0;
					window.speechSynthesis.speak(stumm);
				}
			} catch (e) {}
			try {
				var AC = window.AudioContext || window.webkitAudioContext;
				if (AC) {
					var ctx = audioKontext || (audioKontext = new AC());
					ctx.resume().catch(function () {});
					var leer = ctx.createBufferSource();
					leer.buffer = ctx.createBuffer(1, 1, 22050);
					leer.connect(ctx.destination);
					leer.start(0);
				}
			} catch (e) {}
		};
		["touchend", "click"].forEach(function (name) { document.addEventListener(name, freischalten, true); });
	}

	// Spielt für einen Spruch die eigene Aufnahme (falls vorhanden), sonst die
	// Computerstimme. "roh" ist der Text so, wie er gespeichert ist (Schlüssel
	// der Aufnahme), "text" die bereinigte Fassung zum Vorlesen.
	function spieleSpruch(roh, text) {
		allesStoppen();
		var token = wiedergabeToken;
		// Schon während die Aufnahme gesucht wird, ist die Oberfläche gesperrt (kurze Zeitsicherung).
		ausgabeBeginnt(5000);
		aufnahmeLaden(roh).then(function (blob) {
			if (token !== wiedergabeToken) return;
			if (blob) aufnahmeAbspielen(blob);
			else if (!sprich(text)) ausgabeEnde();
		}, function () {
			if (token === wiedergabeToken && !sprich(text)) ausgabeEnde();
		});
	}

	// Jeder neue Spruch landet in #moti (energieAnzeigen); currentShareText
	// (energystation.js) enthält dazu den reinen Text ohne Bild.
	var moti = el("moti");
	if (moti && window.MutationObserver) {
		new MutationObserver(function () {
			letzterRoh = typeof currentShareText !== "undefined" ? currentShareText : moti.textContent;
			// Vorgelesen wird die Originalschreibweise (currentSpeechText, energystation.js),
			// nicht die großgeschriebene Anzeige.
			letzterText = sprechText(typeof currentSpeechText !== "undefined" && currentSpeechText ? currentSpeechText : letzterRoh);
			if (an) spieleSpruch(letzterRoh, letzterText);
		}).observe(moti, { childList: true });
	}

	// Das automatische Weiterklicken (alle 20 s) soll das Vorlesen nicht
	// abschneiden: solange gesprochen oder abgespielt wird, den automatischen
	// Wechsel überspringen.
	if (typeof clickOnDocument === "function") {
		var automatischWeiter = clickOnDocument;
		window.clickOnDocument = function () {
			if (vorlesenLaeuft()) return;
			automatischWeiter();
		};
	}

	// Öffnet sich ein Popup (z.B. die Einstellungen), endet eine laufende Ausgabe sofort: im Popup
	// kommt die Stimme nur noch beim "Testen"-Knopf oder bei der Aufnahme.
	if (window.MutationObserver) {
		var popupWarOffen = false;
		new MutationObserver(function () {
			var offen = !!document.querySelector(".share-modal-backdrop.is-open");
			if (offen && !popupWarOffen) allesStoppen();
			popupWarOffen = offen;
		}).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"] });
	}

	// Tippen und Wischen auf der Oberfläche (und damit jeder Wechsel von Bild und Spruch) sind erst
	// möglich, wenn die Ausgabe beendet ist. energystation.js ruft energieJetztAnzeigen() über den
	// globalen Namen auf, deshalb reicht ein Schutz an dieser einen Stelle.
	if (typeof energieJetztAnzeigen === "function") {
		var anzeigeOhneSperre = energieJetztAnzeigen;
		window.energieJetztAnzeigen = function () {
			if (vorlesenLaeuft()) return;
			return anzeigeOhneSperre.apply(this, arguments);
		};
	}

	// ==================== Aufnahme-Knöpfe in der Liste der eigenen Texte ====================
	var vorhanden = {};      // Texte, zu denen eine Aufnahme existiert
	var aktiv = null;        // laufende Aufnahme: { rec, stream, key, timer }

	function nachricht(item, text) {
		var feld = item.querySelector(".vorlesen-rec-msg");
		if (feld) feld.textContent = text || "";
	}

	function knopf(klasse, text, onClick, deaktiviert) {
		var b = document.createElement("button");
		b.type = "button";
		b.className = "btn btn-xs " + (klasse === "is-recording" ? "btn-danger" : "btn-default");
		b.textContent = text;
		b.disabled = !!deaktiviert;
		b.addEventListener("click", onClick);
		return b;
	}

	function zeileAufbauen(item) {
		var key = item.getAttribute("data-key");
		var zeile = item.querySelector(".vorlesen-rec-row");
		if (!zeile) return;
		zeile.innerHTML = "";
		var nimmtAuf = aktiv && aktiv.key === key;
		var andereLaeuft = aktiv && !nimmtAuf;
		if (nimmtAuf) {
			zeile.appendChild(knopf("is-recording", "⏹ " + ta(1), function () { aufnahmeBeenden(); }));
		} else {
			zeile.appendChild(knopf("", "🎤 " + ta(0), function () { aufnahmeStarten(item); }, andereLaeuft));
		}
		if (vorhanden[key] && !nimmtAuf) {
			zeile.appendChild(knopf("", "▶ " + ta(2), function () {
				allesStoppen();
				aufnahmeLaden(key).then(function (blob) { if (blob) aufnahmeAbspielen(blob); });
			}));
			zeile.appendChild(knopf("", "🗑 " + ta(3), function () {
				aufnahmeLoeschen(key).then(function () {
					delete vorhanden[key];
					alleZeilenAufbauen();
				});
			}));
		}
		var msg = document.createElement("span");
		msg.className = "vorlesen-rec-msg text-danger small";
		zeile.appendChild(msg);
	}

	function alleZeilenAufbauen() {
		document.querySelectorAll("#eigeneSpruecheListe .own-content-spruch-item").forEach(zeileAufbauen);
	}

	function aufnahmeStarten(item) {
		var key = item.getAttribute("data-key");
		allesStoppen();
		nachricht(item, "");
		navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
			var rec;
			try {
				rec = new MediaRecorder(stream);
			} catch (e) {
				stream.getTracks().forEach(function (tr) { tr.stop(); });
				nachricht(item, ta(6));
				return;
			}
			var teile = [];
			rec.ondataavailable = function (ev) { if (ev.data && ev.data.size > 0) teile.push(ev.data); };
			rec.onstop = function () {
				clearTimeout(aktiv && aktiv.timer);
				stream.getTracks().forEach(function (tr) { tr.stop(); });
				aktiv = null;
				if (teile.length === 0) {
					alleZeilenAufbauen();
					return;
				}
				var blob = new Blob(teile, { type: rec.mimeType || "audio/webm" });
				aufnahmeSpeichern(key, blob).then(function () {
					vorhanden[key] = true;
					alleZeilenAufbauen();
				}, function () {
					alleZeilenAufbauen();
					document.querySelectorAll("#eigeneSpruecheListe .own-content-spruch-item").forEach(function (i) {
						if (i.getAttribute("data-key") === key) nachricht(i, ta(5));
					});
				});
			};
			aktiv = { rec: rec, key: key, timer: setTimeout(aufnahmeBeenden, AUFNAHME_MAX_MS) };
			try {
				rec.start();
			} catch (e) {
				clearTimeout(aktiv.timer);
				stream.getTracks().forEach(function (tr) { tr.stop(); });
				aktiv = null;
				nachricht(item, ta(6));
				return;
			}
			alleZeilenAufbauen();
		}, function () {
			nachricht(item, ta(4));
		});
	}

	function aufnahmeBeenden() {
		if (aktiv && aktiv.rec.state !== "inactive") aktiv.rec.stop();
	}

	// Nach jedem Neuaufbau der Liste (energystation.js setzt innerHTML) die
	// Aufnahme-Zeilen ergänzen und Aufnahmen gelöschter oder geänderter Texte entfernen.
	function listeErgaenzen() {
		var items = document.querySelectorAll("#eigeneSpruecheListe .own-content-spruch-item");
		// Maßgeblich für das Aufräumen sind die gespeicherten Texte, nicht die
		// Liste im Popup: sie ist beim Start der Seite noch nicht gerendert, und
		// ein Abgleich damit würde dann alle Aufnahmen löschen.
		var texte = {};
		(typeof ladeEigeneSprueche === "function" ? ladeEigeneSprueche() : []).forEach(function (s) {
			texte[s] = true;
		});
		items.forEach(function (item) {
			var textEl = item.querySelector(".own-content-spruch-text");
			var key = textEl ? textEl.textContent : "";
			item.setAttribute("data-key", key);
			// Nur einmal je Eintrag anlegen: die Funktion kann mehrfach laufen (auch nach dem
			// Speichern einer Aufnahme, ohne dass die Liste neu gerendert wurde).
			if (!item.querySelector(".vorlesen-rec-row")) {
				var zeile = document.createElement("div");
				zeile.className = "vorlesen-rec-row";
				var confirm = item.querySelector(".own-content-confirm-row");
				item.insertBefore(zeile, confirm);
			}
		});
		alleSchluessel().then(function (keys) {
			vorhanden = {};
			keys.forEach(function (k) {
				if (texte[k]) {
					vorhanden[k] = true;
				} else if (!aktiv) {
					aufnahmeLoeschen(k);
				}
			});
			alleZeilenAufbauen();
		}, alleZeilenAufbauen);
	}

	var liste = el("eigeneSpruecheListe");
	if (liste && window.MutationObserver && aufnahmeMoeglich()) {
		new MutationObserver(listeErgaenzen).observe(liste, { childList: true });
		listeErgaenzen();
	}

	// ---------- Bedienung ----------
	function vorlesenSetzen(neu) {
		if (an === neu) return;
		an = neu;
		try { localStorage.setItem(AN_KEY, an ? "1" : "0"); } catch (e) {}
		// In den Einstellungen kommt keine Stimme von selbst: weder beim Einschalten noch beim
		// Wechseln der Stimme. Ausgeschaltet wird eine laufende Ausgabe gestoppt.
		if (!an) allesStoppen();
		oberflaecheAktualisieren();
	}
	el("vorlesenAn").addEventListener("click", function () { vorlesenSetzen(true); });
	el("vorlesenAus").addEventListener("click", function () { vorlesenSetzen(false); });

	el("vorlesenStimme").addEventListener("change", function () {
		try { localStorage.setItem(STIMME_KEY, el("vorlesenStimme").value); } catch (e) {}
		allesStoppen(); // eine laufende Probe mit der alten Stimme beenden; gesprochen wird erst bei "Testen"
	});

	// "Testen": spricht einen kurzen Beispielsatz mit der gewählten Stimme (nur auf Tipp).
	el("vorlesenTest").addEventListener("click", function () {
		allesStoppen();
		var beispiel = (TEST[sprache()] || TEST.en)[1];
		if (!sprich(beispiel)) ausgabeEnde();
	});

	// Beschriftung an die aktuelle Sprache anpassen: beim Öffnen des Popups und
	// nach Sprachwechsel über die Flaggen.
	document.addEventListener("energie:sprache", oberflaecheAktualisieren);
	var btnEigene = el("btn_eigene");
	if (btnEigene) btnEigene.addEventListener("click", oberflaecheAktualisieren);
	document.addEventListener("click", function (ev) {
		if (ev.target.closest && ev.target.closest("#sprache, #sprache1, #sprache2")) {
			setTimeout(oberflaecheAktualisieren, 50);
		}
	});
	// Stimmen werden vom Browser oft erst nach dem Laden geliefert.
	if (window.speechSynthesis) {
		window.speechSynthesis.addEventListener("voiceschanged", oberflaecheAktualisieren);
	}

	// Schnittstelle für einsprechen.js (Aufnahme beim Anlegen eines neuen Texts).
	window.energieAufnahme = {
		moeglich: aufnahmeMoeglich,
		speichern: aufnahmeSpeichern,
		abspielen: function (blob) { allesStoppen(); aufnahmeAbspielen(blob); },
		stoppen: allesStoppen,
		aktualisieren: listeErgaenzen
	};

	oberflaecheAktualisieren();
}());
