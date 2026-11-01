/*jslint browser: true, sloppy: true*/

// ==================== Spruch einsprechen ====================
// Im Reiter "Texte" unter dem Textfeld gibt es einen einzigen großen Knopf:
//   1. Tippen -> die eigene Stimme wird aufgenommen, und der gesprochene Text erscheint
//      gleichzeitig im Textfeld (wenn der Browser Spracherkennung kann).
//   2. Nochmal tippen ("Fertig") -> die Aufnahme ist bereit; Text prüfen, bei Bedarf korrigieren.
//   3. "Text hinzufügen" (bzw. "Aktualisieren") -> der Text wird gespeichert und die Aufnahme ihm
//      zugeordnet. Beim Vorlesen läuft dann statt der Computerstimme die Aufnahme (siehe vorlesen.js).
// Erscheint kein Text im Feld (Browser ohne Spracherkennung, kein Internet, Mikrofon von der Aufnahme
// belegt ...), sagt die Oberfläche das mit dem Grund und bietet "Text diktieren" an: dabei wird der Text
// noch einmal ohne Aufnahme gesprochen; die Aufnahme bleibt erhalten. Oder man tippt ihn ins Feld.
(function () {
	"use strict";

	var AUFNAHME_MAX_MS = 60000;
	var MAX_ZEICHEN = 500;
	var ERKENNUNG_NACHLAUF_MS = 3000;   // so lange auf das letzte Ergebnis der Erkennung warten
	var STUECK_MS = 50;                 // Länge der Aufnahme-Stücke
	var ENDE_ABSCHNEIDEN_STUECKE = 5;   // 5 x 50 ms = die letzte Viertelsekunde (Klick des Fertig-Knopfs)

	// Sprachcode der App -> Sprache der Spracherkennung.
	var ERKENNUNG_SPRACHE = {
		de: "de-DE", en: "en-US", es: "es-ES", pl: "pl-PL", it: "it-IT", ru: "ru-RU",
		tu: "tr-TR", vi: "vi-VN", ba: "bn-BD", un: "hu-HU", ukr: "uk-UA", china: "zh-CN"
	};

	// Texte: [0 Knopf "einsprechen", 1 "Fertig", 2 "Ich höre zu", 3 Hinweis mit Texterkennung, 4 "Aufnahme fertig ... tippe auf",
	//         5 Anhören, 6 Neu aufnehmen, 7 Löschen, 8 Mikrofon nicht erlaubt, 9 Aufnahme nicht möglich,
	//         10 Hinweis ohne Texterkennung, 11 Text nicht erkannt, 12 Browser ohne Spracherkennung,
	//         13 Text diktieren, 14 Spracherkennung braucht Internet, 15 Text wird erkannt,
	//         16 Hinweis "als lokale Datei geöffnet"].
	// Fehlt eine Sprache, gilt "en".
	var TEXTE = {
		de: ["Spruch einsprechen", "Fertig", "Ich höre zu … sprich jetzt.", "Tippe auf das Mikrofon und sprich deinen Spruch. Der Text erscheint im Feld, die Aufnahme wird ihm zugeordnet.", "Aufnahme fertig. Prüfe den Text und tippe auf", "Anhören", "Neu aufnehmen", "Löschen", "Mikrofon nicht erlaubt", "Aufnahme nicht möglich", "Tippe auf das Mikrofon und sprich deinen Spruch. Schreibe den Text dazu ins Feld, die Aufnahme wird ihm zugeordnet.",
			"Der Text wurde nicht automatisch erkannt. Sprich ihn zum Diktieren noch einmal oder tippe ihn ins Feld.", "Dein Browser kann Sprache nicht in Text umwandeln. Bitte tippe den Text ins Feld.", "Text diktieren", "Die Spracherkennung braucht eine Internetverbindung. Bitte tippe den Text ins Feld.", "Text wird erkannt …", "Du hast die App als lokale Datei geöffnet. Darum fragt der Browser bei jeder Aufnahme erneut nach dem Mikrofon. Öffne die App über ihre Web-Adresse, dann genügt einmal „Beim Besuch der Website erlauben“."],
		en: ["Record your message", "Done", "Listening … speak now.", "Tap the microphone and say your message. The text appears in the field and the recording is linked to it.", "Recording done. Check the text and tap", "Play", "Record again", "Delete", "Microphone not allowed", "Recording not possible", "Tap the microphone and say your message. Type the text into the field; the recording is linked to it.",
			"The text was not recognised automatically. Say it again to dictate it, or type it into the field.", "Your browser cannot convert speech to text. Please type the text into the field.", "Dictate text", "Speech recognition needs an internet connection. Please type the text into the field.", "Recognising text …", "You opened the app as a local file, so the browser asks for the microphone again for every recording. Open the app via its web address; then “Allow while visiting the site” is enough once."],
		es: ["Grabar tu mensaje", "Listo", "Escuchando … habla ahora.", "Toca el micrófono y di tu mensaje. El texto aparece en el campo y la grabación se asocia a él.", "Grabación lista. Revisa el texto y toca", "Escuchar", "Grabar de nuevo", "Borrar", "Micrófono no permitido", "Grabación no posible", "Toca el micrófono y di tu mensaje. Escribe el texto en el campo; la grabación se asocia a él.",
			"El texto no se reconoció automáticamente. Dilo de nuevo para dictarlo o escríbelo en el campo.", "Tu navegador no puede convertir voz en texto. Escribe el texto en el campo.", "Dictar texto", "El reconocimiento de voz necesita internet. Escribe el texto en el campo.", "Reconociendo texto …", "Has abierto la app como archivo local, por eso el navegador pide el micrófono en cada grabación. Abre la app desde su dirección web; entonces basta con permitirlo una vez."],
		pl: ["Nagraj swoją myśl", "Gotowe", "Słucham … mów teraz.", "Dotknij mikrofonu i powiedz swoją myśl. Tekst pojawi się w polu, a nagranie zostanie do niego przypisane.", "Nagranie gotowe. Sprawdź tekst i dotknij", "Odtwórz", "Nagraj ponownie", "Usuń", "Mikrofon niedozwolony", "Nagrywanie niemożliwe", "Dotknij mikrofonu i powiedz swoją myśl. Wpisz tekst w polu; nagranie zostanie do niego przypisane.",
			"Tekst nie został rozpoznany automatycznie. Powiedz go jeszcze raz, aby podyktować, albo wpisz go w polu.", "Twoja przeglądarka nie potrafi zamienić mowy na tekst. Wpisz tekst w polu.", "Podyktuj tekst", "Rozpoznawanie mowy wymaga internetu. Wpisz tekst w polu.", "Rozpoznawanie tekstu …", "Otworzyłeś aplikację jako plik lokalny, dlatego przeglądarka pyta o mikrofon przy każdym nagraniu. Otwórz aplikację przez jej adres internetowy, wtedy wystarczy raz zezwolić."],
		it: ["Registra il tuo messaggio", "Fatto", "Ascolto … parla ora.", "Tocca il microfono e di’ il tuo messaggio. Il testo appare nel campo e la registrazione gli viene associata.", "Registrazione pronta. Controlla il testo e tocca", "Ascolta", "Registra di nuovo", "Elimina", "Microfono non consentito", "Registrazione non possibile", "Tocca il microfono e di’ il tuo messaggio. Scrivi il testo nel campo; la registrazione gli viene associata.",
			"Il testo non è stato riconosciuto automaticamente. Ripetilo per dettarlo oppure scrivilo nel campo.", "Il tuo browser non può convertire la voce in testo. Scrivi il testo nel campo.", "Detta il testo", "Il riconoscimento vocale richiede internet. Scrivi il testo nel campo.", "Riconoscimento del testo …", "Hai aperto l’app come file locale, quindi il browser chiede il microfono a ogni registrazione. Apri l’app dal suo indirizzo web: basterà consentire una volta."],
		ru: ["Записать своё сообщение", "Готово", "Слушаю … говорите.", "Нажмите на микрофон и произнесите своё сообщение. Текст появится в поле, а запись будет к нему привязана.", "Запись готова. Проверьте текст и нажмите", "Слушать", "Записать заново", "Удалить", "Микрофон не разрешён", "Запись невозможна", "Нажмите на микрофон и произнесите своё сообщение. Введите текст в поле, запись будет к нему привязана.",
			"Текст не распознан автоматически. Произнесите его ещё раз для диктовки или введите в поле.", "Ваш браузер не умеет преобразовывать речь в текст. Введите текст в поле.", "Продиктовать текст", "Для распознавания речи нужен интернет. Введите текст в поле.", "Распознаю текст …", "Вы открыли приложение как локальный файл, поэтому браузер запрашивает микрофон при каждой записи. Откройте приложение по его веб-адресу, тогда достаточно один раз разрешить."],
		tu: ["Mesajını sesli kaydet", "Bitti", "Dinliyorum … şimdi konuş.", "Mikrofona dokun ve mesajını söyle. Metin alanda görünür, kayıt ona bağlanır.", "Kayıt hazır. Metni kontrol et ve dokun:", "Dinle", "Yeniden kaydet", "Sil", "Mikrofona izin verilmedi", "Kayıt yapılamıyor", "Mikrofona dokun ve mesajını söyle. Metni alana yaz; kayıt ona bağlanır.",
			"Metin otomatik olarak tanınmadı. Dikte etmek için tekrar söyle ya da alana yaz.", "Tarayıcın konuşmayı metne çeviremiyor. Lütfen metni alana yaz.", "Metni dikte et", "Konuşma tanıma için internet gerekir. Lütfen metni alana yaz.", "Metin tanınıyor …", "Uygulamayı yerel dosya olarak açtın; bu yüzden tarayıcı her kayıtta mikrofonu yeniden sorar. Uygulamayı web adresinden aç, o zaman bir kez izin vermek yeter."],
		vi: ["Ghi âm thông điệp của bạn", "Xong", "Đang nghe … hãy nói.", "Chạm vào micro và nói thông điệp của bạn. Văn bản xuất hiện trong ô và bản ghi được gắn với nó.", "Đã ghi xong. Kiểm tra văn bản và chạm", "Nghe", "Ghi lại", "Xóa", "Micro không được phép", "Không thể ghi âm", "Chạm vào micro và nói thông điệp của bạn. Gõ văn bản vào ô; bản ghi được gắn với nó.",
			"Văn bản chưa được nhận dạng tự động. Hãy nói lại để đọc chính tả hoặc gõ vào ô.", "Trình duyệt của bạn không chuyển giọng nói thành văn bản được. Hãy gõ văn bản vào ô.", "Đọc để nhập văn bản", "Nhận dạng giọng nói cần internet. Hãy gõ văn bản vào ô.", "Đang nhận dạng văn bản …", "Bạn đã mở ứng dụng dưới dạng tệp cục bộ nên trình duyệt hỏi micro ở mỗi lần ghi âm. Hãy mở ứng dụng bằng địa chỉ web, khi đó chỉ cần cho phép một lần."],
		ba: ["আপনার বার্তা রেকর্ড করুন", "শেষ", "শুনছি … এখন বলুন।", "মাইক্রোফোনে ট্যাপ করে আপনার বার্তা বলুন। লেখাটি ঘরে দেখা যাবে এবং রেকর্ডিং তার সাথে যুক্ত হবে।", "রেকর্ডিং শেষ। লেখা দেখে নিন এবং ট্যাপ করুন", "শুনুন", "আবার রেকর্ড করুন", "মুছুন", "মাইক্রোফোনের অনুমতি নেই", "রেকর্ড করা সম্ভব নয়", "মাইক্রোফোনে ট্যাপ করে আপনার বার্তা বলুন। লেখাটি ঘরে লিখুন; রেকর্ডিং তার সাথে যুক্ত হবে।",
			"লেখাটি স্বয়ংক্রিয়ভাবে চেনা যায়নি। বলে লেখাতে আবার বলুন বা ঘরে টাইপ করুন।", "আপনার ব্রাউজার কথাকে লেখায় রূপান্তর করতে পারে না। অনুগ্রহ করে লেখাটি ঘরে টাইপ করুন।", "লেখা বলে দিন", "স্পিচ রিকগনিশনের জন্য ইন্টারনেট দরকার। অনুগ্রহ করে লেখাটি ঘরে টাইপ করুন।", "লেখা চেনা হচ্ছে …", "আপনি অ্যাপটি লোকাল ফাইল হিসেবে খুলেছেন, তাই ব্রাউজার প্রতিটি রেকর্ডিংয়ে মাইক্রোফোন চায়। অ্যাপটি তার ওয়েব ঠিকানা দিয়ে খুলুন, তাহলে একবার অনুমতি দিলেই চলবে।"],
		un: ["Üzeneted bemondása", "Kész", "Hallgatom … beszélj most.", "Koppints a mikrofonra, és mondd el az üzeneted. A szöveg megjelenik a mezőben, a felvétel hozzá kapcsolódik.", "A felvétel kész. Ellenőrizd a szöveget, és koppints:", "Lejátszás", "Újra felvétel", "Törlés", "A mikrofon nem engedélyezett", "A felvétel nem lehetséges", "Koppints a mikrofonra, és mondd el az üzeneted. Írd be a szöveget a mezőbe; a felvétel hozzá kapcsolódik.",
			"A szöveget nem ismertem fel automatikusan. Mondd el újra diktáláshoz, vagy írd be a mezőbe.", "A böngésződ nem tudja a beszédet szöveggé alakítani. Írd be a szöveget a mezőbe.", "Szöveg diktálása", "A beszédfelismeréshez internet kell. Írd be a szöveget a mezőbe.", "Szöveg felismerése …", "Az alkalmazást helyi fájlként nyitottad meg, ezért a böngésző minden felvételnél újra kéri a mikrofont. Nyisd meg a webcímén, akkor elég egyszer engedélyezni."],
		ukr: ["Записати своє повідомлення", "Готово", "Слухаю … говоріть.", "Торкніться мікрофона й промовте своє повідомлення. Текст з’явиться в полі, а запис буде з ним пов’язано.", "Запис готовий. Перевірте текст і торкніться", "Слухати", "Записати знову", "Видалити", "Мікрофон не дозволено", "Запис неможливий", "Торкніться мікрофона й промовте своє повідомлення. Введіть текст у поле, запис буде з ним пов’язано.",
			"Текст не розпізнано автоматично. Промовте його ще раз для диктування або введіть у поле.", "Ваш браузер не вміє перетворювати мовлення на текст. Введіть текст у поле.", "Продиктувати текст", "Для розпізнавання мовлення потрібен інтернет. Введіть текст у поле.", "Розпізнаю текст …", "Ви відкрили застосунок як локальний файл, тому браузер запитує мікрофон під час кожного запису. Відкрийте застосунок за його веб-адресою, тоді достатньо один раз дозволити."],
		china: ["录制你的话", "完成", "正在聆听…请说话。", "点击麦克风并说出你的话。文字会出现在输入框，录音会与它关联。", "录音完成。检查文字并点击", "播放", "重新录制", "删除", "麦克风未被允许", "无法录音", "点击麦克风并说出你的话。请在输入框中输入文字，录音会与它关联。",
			"未能自动识别文字。请再说一遍进行听写，或直接输入到文本框。", "你的浏览器无法将语音转换为文字。请在文本框中输入文字。", "语音输入文字", "语音识别需要网络。请在文本框中输入文字。", "正在识别文字…", "你是以本地文件方式打开应用的，因此浏览器每次录音都会再次询问麦克风。请通过网址打开应用，这样只需允许一次。"]
	};

	var LOKALE_DATEI = location.protocol === "file:";
	var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
	var neueAufnahme = null;   // Aufnahme für den Text, der gerade eingegeben wird
	var erkennung = null;      // laufende Spracherkennung
	var aufnahme = null;       // laufende Aufnahme: { rec, timer }
	var erkenneNoch = false;   // Aufnahme ist zu Ende, das letzte Ergebnis der Erkennung steht noch aus
	var erkenneTimer = null;
	var erkennungFehler = "";  // letzter Fehlercode der Spracherkennung (z.B. "network", "not-allowed")
	var fehler = "";           // Fehlermeldung unter dem Knopf

	function sprache() {
		var lang = (typeof tempSprache !== "undefined" && tempSprache) || localStorage.getItem("langEnergie") || "de";
		return ERKENNUNG_SPRACHE[lang] ? lang : "de";
	}

	function t(index) {
		return (TEXTE[sprache()] || TEXTE.en)[index];
	}

	function el(id) {
		return document.getElementById(id);
	}

	var eingabe = el("eigenerSpruchInput");

	// "Text hinzufügen" erscheint erst, wenn im Textfeld Text steht. Auch wenn die App das Feld per Code
	// füllt oder leert (Bearbeiten, Abbrechen, nach dem Hinzufügen), löst das kein "input"-Ereignis aus;
	// deshalb meldet sich das Feld über einen eigenen value-Setter.
	var addKnopf = el("eigenerSpruchAddBtn");
	function addKnopfAnzeigen() {
		if (addKnopf && eingabe) addKnopf.style.display = (eingabe.value || "").trim() !== "" ? "" : "none";
	}
	if (eingabe && addKnopf) {
		var wertBeschreibung = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");
		Object.defineProperty(eingabe, "value", {
			configurable: true,
			get: function () { return wertBeschreibung.get.call(this); },
			set: function (v) {
				wertBeschreibung.set.call(this, v);
				addKnopfAnzeigen();
			}
		});
		eingabe.addEventListener("input", addKnopfAnzeigen);
		addKnopfAnzeigen();
	}

	// Ohne Aufnahmemöglichkeit (z.B. kein HTTPS, kein Mikrofon-Zugriff im Browser) bleibt das Feld wie bisher.
	if (!eingabe || !(window.energieAufnahme && window.energieAufnahme.moeglich())) return;

	// ---------- Aufbau (Bootstrap btn, btn-group, alert) ----------
	var box = document.createElement("div");
	box.className = "einsprechen-box";
	box.innerHTML =
		'<button type="button" class="btn btn-primary btn-block btn-lg" id="einsprechenBtn"></button>' +
		'<p class="small text-muted einsprechen-hinweis" id="einsprechenHinweis"></p>' +
		'<div class="einsprechen-neu" id="neueAufnahmeZeile" style="display:none;">' +
		'<div class="alert alert-success small" id="neueAufnahmeHinweis"></div>' +
		'<button type="button" class="btn btn-primary btn-block" id="neueAufnahmeDiktieren" style="display:none;"></button>' +
		'<div class="btn-group btn-group-sm btn-group-justified" role="group">' +
		'<div class="btn-group btn-group-sm" role="group"><button type="button" class="btn btn-default" id="neueAufnahmeAnhoeren"></button></div>' +
		'<div class="btn-group btn-group-sm" role="group"><button type="button" class="btn btn-default" id="neueAufnahmeNeu"></button></div>' +
		'<div class="btn-group btn-group-sm" role="group"><button type="button" class="btn btn-default" id="neueAufnahmeLoeschen"></button></div>' +
		'</div></div>';
	var formActions = el("eigenerSpruchFormActions");
	formActions.parentNode.insertBefore(box, formActions);

	// Hinweis "als lokale Datei geöffnet": steht unter dem Speichern-Knopf, damit der Knopf direkt
	// unter dem Einsprechen-Bereich bleibt.
	var dateiBox = document.createElement("div");
	dateiBox.className = "alert alert-info small einsprechen-datei";
	dateiBox.id = "einsprechenDateiHinweis";
	dateiBox.style.display = "none";
	formActions.parentNode.insertBefore(dateiBox, formActions.nextSibling);

	// Warum kein Text im Feld steht (für die Meldung bei fertiger Aufnahme ohne Text).
	function grundOhneText() {
		if (!SR) return t(12);
		if (erkennungFehler === "network") return t(14);
		if (erkennungFehler === "not-allowed" || erkennungFehler === "service-not-allowed") return t(8);
		return t(11);
	}

	// Kann "Text diktieren" überhaupt helfen? Nicht ohne Spracherkennung, ohne Internet oder ohne Erlaubnis.
	function diktierenMoeglich() {
		return !!SR && erkennungFehler !== "network" && erkennungFehler !== "not-allowed" && erkennungFehler !== "service-not-allowed";
	}

	// Je nach Zustand: bereit / Aufnahme läuft / Text wird erkannt / Aufnahme fertig (mit oder ohne Text).
	var fokusGesetzt = false;
	function ansichtAktualisieren() {
		var knopf = el("einsprechenBtn");
		var hinweis = el("einsprechenHinweis");
		var laeuft = !!aufnahme;
		var wartet = !!neueAufnahme && !laeuft && erkenneNoch;
		var fertig = !!neueAufnahme && !laeuft && !erkenneNoch;
		var diktiert = fertig && !!erkennung;
		var hatText = (eingabe.value || "").trim() !== "";

		knopf.style.display = (fertig || wartet) ? "none" : "";
		knopf.disabled = startet; // während die Mikrofon-Abfrage offen ist, nicht doppelt starten
		// Solange aufgenommen oder erkannt wird, kann nichts gespeichert werden (Text und Aufnahme sind noch nicht fertig).
		el("eigenerSpruchAddBtn").disabled = laeuft || startet || erkenneNoch;
		knopf.textContent = laeuft ? "⏹ " + t(1) : "🎤 " + t(0);
		knopf.classList.toggle("btn-danger", laeuft);
		knopf.classList.toggle("btn-primary", !laeuft);

		if (fehler) {
			hinweis.textContent = fehler;
			hinweis.className = "small text-danger einsprechen-hinweis";
		} else if (laeuft) {
			hinweis.textContent = t(2);
			hinweis.className = "small text-danger einsprechen-hinweis";
		} else if (wartet) {
			hinweis.textContent = t(15);
			hinweis.className = "small text-muted einsprechen-hinweis";
		} else if (fertig) {
			hinweis.textContent = "";
			hinweis.className = "small text-muted einsprechen-hinweis";
		} else {
			hinweis.textContent = SR ? t(3) : t(10);
			hinweis.className = "small text-muted einsprechen-hinweis";
		}
		hinweis.style.display = hinweis.textContent ? "" : "none";

		// Als lokale Datei geöffnet (file://) kann der Browser die Mikrofon-Erlaubnis nicht merken und
		// fragt bei jeder Aufnahme neu: Hinweis, die App über ihre Web-Adresse zu öffnen.
		var dateiHinweis = el("einsprechenDateiHinweis");
		dateiHinweis.textContent = LOKALE_DATEI ? t(16) : "";
		dateiHinweis.style.display = LOKALE_DATEI ? "" : "none";

		el("neueAufnahmeZeile").style.display = fertig ? "" : "none";
		var meldung = el("neueAufnahmeHinweis");
		if (hatText) {
			meldung.textContent = "✓ " + t(4) + " „" + el("eigenerSpruchAddBtn").textContent + "“.";
			meldung.className = "alert alert-success small";
		} else {
			meldung.textContent = diktiert ? t(2) : grundOhneText();
			meldung.className = "alert alert-warning small";
		}
		var diktieren = el("neueAufnahmeDiktieren");
		diktieren.style.display = (!hatText && (diktiert || diktierenMoeglich())) ? "" : "none";
		diktieren.textContent = diktiert ? "⏹ " + t(1) : "🎤 " + t(13);
		diktieren.classList.toggle("btn-danger", diktiert);
		diktieren.classList.toggle("btn-primary", !diktiert);
		el("neueAufnahmeAnhoeren").textContent = "▶ " + t(5);
		el("neueAufnahmeNeu").textContent = "🎤 " + t(6);
		el("neueAufnahmeLoeschen").textContent = "🗑 " + t(7);

		// Ohne Text direkt ins Feld springen, damit man sofort tippen kann (einmal je Aufnahme).
		if (fertig && !hatText && !fokusGesetzt) {
			fokusGesetzt = true;
			eingabe.focus();
		}
		if (!fertig) fokusGesetzt = false;
	}

	// ---------- Texterkennung ----------
	// "dauerhaft": läuft zusammen mit der Aufnahme. Der Browser beendet die Erkennung nach einer Pause
	// oder einem Zeitlimit von selbst; solange die Aufnahme läuft, startet sie deshalb neu und schreibt
	// den Text hinter den bisherigen. Ohne "dauerhaft" ist es ein einzelnes Diktat (zweiter Versuch).
	function erkennungStarten(dauerhaft, versuch) {
		versuch = versuch || 0;
		var hatErgebnis = false;
		var rec;
		try {
			rec = new SR();
		} catch (e) {
			erkennungFehler = "unsupported";
			return;
		}
		rec.lang = ERKENNUNG_SPRACHE[sprache()];
		rec.interimResults = true;
		rec.continuous = !!dauerhaft;
		var basis = eingabe.value;
		var abstand = basis && !/\s$/.test(basis) ? " " : "";
		var neuStarten = !!dauerhaft;
		rec.onresult = function (ev) {
			if (erkennung !== rec) return; // Nachzügler nach Abbruch oder Neustart ignorieren
			var text = "";
			for (var i = 0; i < ev.results.length; i++) text += ev.results[i][0].transcript;
			eingabe.value = (basis + abstand + text.trim()).slice(0, MAX_ZEICHEN);
			hatErgebnis = true;
			erkennungFehler = "";
			// Zeichenzähler und Prüfungen der App reagieren auf "input".
			eingabe.dispatchEvent(new Event("input", { bubbles: true }));
		};
		rec.onerror = function (ev) {
			if (erkennung !== rec) return;
			if (ev.error === "no-speech" || ev.error === "aborted") return;
			// Grund merken (die Aufnahme läuft trotzdem weiter) und nicht endlos neu starten.
			erkennungFehler = ev.error || "error";
			neuStarten = false;
		};
		rec.onend = function () {
			if (erkennung !== rec) return;
			erkennung = null;
			// Nur neu starten, wenn die Sitzung Text geliefert hat (es wird also gesprochen) und höchstens
			// dreimal: jeder Start kann im Browser eine Mikrofon-Abfrage auslösen, ein Neustart nach
			// Stille würde diese Abfragen endlos wiederholen.
			if (neuStarten && aufnahme && !rec.beendet && hatErgebnis && versuch < 3) {
				erkennungStarten(true, versuch + 1);
				return;
			}
			// Aufnahme beendet und letztes Ergebnis ist da: jetzt kann die Ansicht den Zustand beurteilen.
			erkenneNoch = false;
			clearTimeout(erkenneTimer);
			ansichtAktualisieren();
		};
		erkennung = rec;
		try {
			rec.start();
		} catch (e) {
			erkennung = null;
			erkennungFehler = erkennungFehler || "error";
		}
	}

	// Beendet die Erkennung; ihr letztes Ergebnis kommt oft erst danach, deshalb wird kurz darauf gewartet.
	function erkennungBeenden() {
		if (!erkennung) return;
		erkennung.beendet = true;
		erkenneNoch = true;
		clearTimeout(erkenneTimer);
		erkenneTimer = setTimeout(function () {
			erkenneNoch = false;
			ansichtAktualisieren();
		}, ERKENNUNG_NACHLAUF_MS);
		erkennung.stop();
	}

	// ---------- Aufnahme ----------
	// "sitzung" wird bei jedem Start und jedem Zurücksetzen erhöht. Alles Asynchrone (Mikrofon-Abfrage,
	// Ende der Aufnahme, Ergebnisse der Erkennung) prüft, ob es noch zur aktuellen Sitzung gehört, und
	// verfällt sonst. So kann nach dem Schließen des Popups nichts mehr nachträglich den Zustand ändern.
	var sitzung = 0;
	var feldVorher = "";   // Inhalt des Textfelds vor dem Einsprechen (für den Abbruch)
	var startet = false;   // Mikrofon wurde angefordert, die Erlaubnis/der Stream steht noch aus

	function mikrofonFreigeben(stream) {
		if (stream) stream.getTracks().forEach(function (tr) { tr.stop(); });
	}

	function aufnehmenStarten() {
		if (startet || aufnahme) return; // Doppelklick oder zweiter Start während einer laufenden Aufnahme
		window.energieAufnahme.stoppen();
		fehler = "";
		erkennungFehler = "";
		neueAufnahme = null;
		var meine = ++sitzung;
		feldVorher = eingabe.value;
		startet = true;
		ansichtAktualisieren();
		navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
			if (meine !== sitzung) {
				// Zwischenzeitlich abgebrochen (z.B. Popup geschlossen, während die Abfrage offen war).
				mikrofonFreigeben(stream);
				return;
			}
			startet = false;
			var rec;
			try {
				rec = new MediaRecorder(stream);
			} catch (e) {
				mikrofonFreigeben(stream);
				fehler = t(9);
				ansichtAktualisieren();
				return;
			}
			var teile = [];
			var a = { rec: rec, stream: stream, timer: null, verworfen: false };
			rec.ondataavailable = function (ev) { if (ev.data && ev.data.size > 0) teile.push(ev.data); };
			rec.onstop = function () {
				clearTimeout(a.timer);
				mikrofonFreigeben(stream);
				if (a.verworfen || meine !== sitzung) return; // abgebrochen: Ergebnis wird nicht übernommen
				aufnahme = null;
				// Das Ende der Aufnahme enthält fast immer das Klicken des Fertig-Knopfs (oder Tippen am
				// Gerät): ein kleines Geräusch am Schluss. Die letzten Stücke werden deshalb abgeschnitten
				// (nur bei Aufnahmen, die lang genug sind).
				if (teile.length > ENDE_ABSCHNEIDEN_STUECKE * 2) teile = teile.slice(0, teile.length - ENDE_ABSCHNEIDEN_STUECKE);
				if (teile.length > 0) neueAufnahme = new Blob(teile, { type: rec.mimeType || "audio/webm" });
				erkennungBeenden();
				ansichtAktualisieren();
			};
			a.timer = setTimeout(aufnehmenBeenden, AUFNAHME_MAX_MS);
			aufnahme = a;
			try {
				// In kleinen Stücken aufnehmen, damit sich das Ende (Klickgeräusch) sauber abschneiden lässt.
				rec.start(STUECK_MS);
			} catch (e) {
				clearTimeout(a.timer);
				mikrofonFreigeben(stream);
				aufnahme = null;
				fehler = t(9);
				ansichtAktualisieren();
				return;
			}
			ansichtAktualisieren();
			// Den gesprochenen Text gleichzeitig ins Textfeld schreiben lassen.
			if (SR) erkennungStarten(true);
		}, function () {
			if (meine !== sitzung) return;
			startet = false;
			fehler = t(8);
			ansichtAktualisieren();
		});
	}

	function aufnehmenBeenden() {
		if (aufnahme && aufnahme.rec.state !== "inactive") aufnahme.rec.stop();
	}

	// Alles anhalten und zum Startzustand zurückkehren: laufende Aufnahme und Erkennung werden beendet
	// und ihr Ergebnis verworfen, eine offene Mikrofon-Abfrage verfällt, die Ansicht wird neu aufgebaut.
	// "textZurueck": auch den Text im Feld auf den Stand vor dem Einsprechen zurücksetzen (beim Abbruch
	// durch Wegklicken); beim Löschen der Aufnahme bleibt erkannter Text stehen.
	function zuruecksetzen(textZurueck) {
		var warAktiv = startet || !!aufnahme || !!erkennung || !!neueAufnahme || erkenneNoch;
		sitzung += 1;
		startet = false;
		if (aufnahme) {
			var a = aufnahme;
			aufnahme = null;
			a.verworfen = true;
			clearTimeout(a.timer);
			try { if (a.rec.state !== "inactive") a.rec.stop(); } catch (e) {}
			mikrofonFreigeben(a.stream);
		}
		if (erkennung) {
			var e2 = erkennung;
			erkennung = null;
			e2.beendet = true;
			try { (e2.abort || e2.stop).call(e2); } catch (e) {}
		}
		neueAufnahme = null;
		erkenneNoch = false;
		clearTimeout(erkenneTimer);
		fehler = "";
		erkennungFehler = "";
		fokusGesetzt = false;
		if (textZurueck && warAktiv && eingabe.value !== feldVorher) {
			eingabe.value = feldVorher;
			eingabe.dispatchEvent(new Event("input", { bubbles: true }));
		}
		ansichtAktualisieren();
	}

	function neueAufnahmeVerwerfen() {
		zuruecksetzen(false);
	}

	// Läuft gerade etwas (Mikrofon-Abfrage, Aufnahme, Erkennung)? Dann bricht Wegklicken es ab.
	function aktivitaetLaeuft() {
		return startet || !!aufnahme || !!erkennung || erkenneNoch;
	}

	// ---------- Bedienung ----------
	el("einsprechenBtn").addEventListener("click", function () {
		if (aufnahme) aufnehmenBeenden();
		else aufnehmenStarten();
	});
	// Zweiter Versuch ohne Aufnahme: nur den Text sprechen. Die vorhandene Aufnahme bleibt.
	el("neueAufnahmeDiktieren").addEventListener("click", function () {
		if (erkennung) {
			erkennungBeenden();
		} else {
			erkennungFehler = "";
			feldVorher = eingabe.value;
			erkennungStarten(false);
		}
		ansichtAktualisieren();
	});
	el("neueAufnahmeAnhoeren").addEventListener("click", function () {
		if (neueAufnahme) window.energieAufnahme.abspielen(neueAufnahme);
	});
	el("neueAufnahmeNeu").addEventListener("click", function () {
		// Neu aufnehmen: das Textfeld wird mit der neuen Aufnahme neu gefüllt.
		zuruecksetzen(false);
		eingabe.value = "";
		eingabe.dispatchEvent(new Event("input", { bubbles: true }));
		aufnehmenStarten();
	});
	el("neueAufnahmeLoeschen").addEventListener("click", neueAufnahmeVerwerfen);

	// Tippt oder diktiert jemand Text ins Feld, wechselt die Meldung von "nicht erkannt" auf "Aufnahme fertig".
	eingabe.addEventListener("input", ansichtAktualisieren);

	// "Text hinzufügen" bzw. "Aktualisieren": Aufnahme unter dem Text speichern, sobald die App
	// ihn übernommen hat. Dieser Handler läuft vor dem der App (er ist früher registriert) und liest
	// den Text, bevor die App das Feld leert.
	el("eigenerSpruchAddBtn").addEventListener("click", function () {
		var text = (eingabe.value || "").trim();
		var blob = neueAufnahme;
		if (!blob || !text) return;
		setTimeout(function () {
			var gespeichert = typeof ladeEigeneSprueche === "function" ? ladeEigeneSprueche() : [];
			if (gespeichert.indexOf(text) < 0) return; // Text wurde nicht übernommen (Prüfung fehlgeschlagen)
			window.energieAufnahme.speichern(text, blob).then(function () {
				neueAufnahme = null;
				ansichtAktualisieren();
				window.energieAufnahme.aktualisieren();
			}, function () {
				fehler = t(9);
				ansichtAktualisieren();
			});
		}, 50);
	});

	// Beim Schließen des Popups (X oder Klick daneben) alles abbrechen und auf den Startzustand
	// zurücksetzen: laufende Aufnahmen beenden, nicht gespeicherte verwerfen, Wiedergabe der
	// Vorschau stoppen. Beim nächsten Öffnen ist alles wie neu.
	function popupGeschlossen() {
		zuruecksetzen(true);
		window.energieAufnahme.stoppen();
	}
	el("eigeneModalClose").addEventListener("click", popupGeschlossen);
	el("eigeneModalBackdrop").addEventListener("click", function (ev) {
		if (ev.target === el("eigeneModalBackdrop")) popupGeschlossen();
	});

	// Wer während einer Aufnahme den Reiter wechselt, sieht die Aufnahme nicht mehr: abbrechen statt
	// im Hintergrund weiterlaufen zu lassen. Eine fertige (nicht mehr laufende) Aufnahme bleibt erhalten.
	["tabBtnBilder", "tabBtnEinstellungen"].forEach(function (id) {
		var reiter = el(id);
		if (reiter) {
			reiter.addEventListener("click", function () {
				if (aktivitaetLaeuft()) zuruecksetzen(true);
			});
		}
	});

	// Beschriftungen an die Sprache anpassen (auch der Name des Speichern-Knopfs kann wechseln).
	document.addEventListener("energie:sprache", function () { setTimeout(ansichtAktualisieren, 0); });
	var btnEigene = el("btn_eigene");
	if (btnEigene) btnEigene.addEventListener("click", function () { setTimeout(ansichtAktualisieren, 0); });
	document.addEventListener("click", function (ev) {
		// Bearbeiten-Modus wechselt "Text hinzufügen" <-> "Aktualisieren": Hinweistext nachziehen.
		if (ev.target.closest && ev.target.closest("#eigeneSpruecheListe, #eigenerSpruchCancelBtn")) {
			setTimeout(ansichtAktualisieren, 0);
		}
	});

	ansichtAktualisieren();
}());
