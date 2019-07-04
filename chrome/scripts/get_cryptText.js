/* 
    Шифрование и копирование зашифрованного текста.
*/

// Текущая версия расширения (Исходя из version.txt)
var VERSION_APP = "1.6";
// Стандартный хеш расширения
var hash 		= "#*28638tr@G#*GR@ugu2d*G@#&GR@#g(23r*08hgio23fFM";
// Сохранение копии стандартного хеша
var origHash 	= hash;
// // Подключение компрессора
// var jsscompress = require("./jsscompress");
		
// Основная функция обработчика события нажатия кнопки шифрования
cryptAndCopyText = function(e){
	// Получение значения из input
    var getInputText = document.getElementById("encrypt_text").value;
	
	// Проверка допустимой длины текста
	if ( getInputText.length >= 200 )
	{
		// Вывод ошибке в случае нарушения
		Swal.fire({
		  position: 'top-end',
		  type: 'error',
		  title: 'Максимальный объём текста - 200 символов',
		  showConfirmButton: false,
		  timer: 3000
		})
		return;
	}
	
	// Подстановка HTML переносов туда, где это необходимо
    getInputText = getInputText.split(/\n|\s\n/).join("<br>\n") + "<br>";
	
	// Шаблон регулярки для поиска ссылок в тексте
	var patternFindHrefs = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
	// Поиск ссылок в тексте и реализация их кликабельности
	getInputText = getInputText.replace(patternFindHrefs, function(str, text){		
        return '<a href="' + text + '" target="_blank" rel="noopener">' + text + '</a>';
    });
	
	// Получение текущей реального адреса страницы
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs){
		// Чтение адреса страницы
		var realURL = tabs[0].url;
		// Удаление лишних атрибутов для получения чистой ссылки
		var fixUrl = realURL.split('?')[0]; fixUrl = fixUrl.replace(/(^\w+:|^)\/\//, '');

		// Чтение актуально хеша из репозитория
		$.get( "https://raw.githubusercontent.com/Shark-vil/Brony-crypter/master/hash.txt", function( data ){
			// Разделение полученного текста построчно
			var arrayOfLines = data.match(/[^\r\n]+/g);

			// Проверка валидности полученного текста
			if ( arrayOfLines[0] == 'BronyCrypt' )
				hash = arrayOfLines[1];	// Получаем актуальный хеш
			else
				hash = origHash; // Используем стандартный хеш
			
			// Запись хеша во временную переменную
			var dumpHash = hash;
			// Проверка на нахождение в диалоге
			if ( fixUrl != "m.vk.com/mail" && fixUrl != "vk.com/im" )
				hash = dumpHash + cryptoJS.MD5(fixUrl);	// Если не диалог, делаем хеш рабочим только для сообщества

			// Кодирование текста
			var encryptedText = cryptoJS.AES.encrypt(getInputText, hash);
			// Возвращение оригинального хеша из временной переменной
			hash = dumpHash;

			// Копирование текста в буфер обмена, с добавлением атрибутов
			copy("[BRONY]" + encryptedText + "[/BRONY]");
		});
	});
}

// Функция копирования текста
copy = function(text){
	// Создание объекта input
	var input = document.createElement("input");
	// Установка входных данных в качестве значения
	input.setAttribute('value', text);
	// Добавление объекта imput в конец html кода страницы 
	document.body.appendChild(input);
	// Выделение содержимого внутри input 
	input.select();
	// Выполнение команды копирования
	document.execCommand("copy");
	// Удаление объекта imput из html кода страницы
    document.body.removeChild(input);
	// Вывод сообщения об успешном копировании
	Swal.fire({
	  position: 'top-end',
	  type: 'success',
	  title: 'Текст скопирован',
	  showConfirmButton: false,
	  timer: 1500
	})
}

// Выполнение функции после полной загрузки страницы
$(document).ready(function(){
	// Вызывается при нажатии на кнопку шифрования
	document.getElementById("crypt_start").addEventListener("click", cryptAndCopyText);

	// Чтение актуальной версии из репозитория
    $.get( "https://raw.githubusercontent.com/Shark-vil/Brony-crypter/master/version.txt", function( getVersion ){
		// Проверка совпадения версий. В случае неудачи будет выведено сообщение с просьбой обновить расширение
		if ( getVersion != VERSION_APP )
			$(".actual_version").html("<hr><label>Ваша версия расширения устарела! " +
				"Обновите расширение в магазине Google Chrome.</label><hr>");
	});

	// Чтение актуальных новостей
    $.get( "https://raw.githubusercontent.com/Shark-vil/Brony-crypter/master/news.txt", function( getNews ){
		// Разделение полученного текста построчно
		var arrayOfLines = getNews.match(/[^\r\n]+/g);
		// Вывод новостей в случае их наличия
		if ( arrayOfLines[0] == "BronyCryptNews" )
			$(".actual_news").html("<h4>Новости: </h4><p>" + arrayOfLines[1] + "</p>");
	});
});