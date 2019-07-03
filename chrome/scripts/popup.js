/* 
    Дешифрование текста на странице и прочие проверки.
*/

// Переменная для проверки мобильной версии VK
var isVkMobile  = false;
// Переменная для проверки доступности расширения
var isEnabled   = false;
// Переменная для проверки невалидных ссылок
var isBlacklist = false;
// Стандартный хеш расширения
var hash        = "#*28638tr@G#*GR@ugu2d*G@#&GR@#g(23r*08hgio23fFM";
// Сохранение копии стандартного хеша
var origHash    = hash;

// Проверка доступности расширения
chrome.storage.local.get('GoogleExtension_BronyCrypt_Launch', function(data){
    // Если значение положительно, продолжаем выполнение скрипта
    if (data.GoogleExtension_BronyCrypt_Launch === true)
        isEnabled = true;
});

// Вызов функции при смене значения в хранилище
chrome.storage.onChanged.addListener(function(changes, area){
    // Проверка валидности входных данных
    if (area == "local" && "GoogleExtension_BronyCrypt_Launch" in changes){
        // Установка нового значения для переменной
        isEnabled = changes.GoogleExtension_BronyCrypt_Launch.newValue;
    };
});

// Функция для поиска и декодирования текста на html странице
var replaceHTMLComponent = function(getText){
    // Запись хеша во временную переменную
    var dumpHash = hash;
    // Удаление лишних атрибутов для получения чистой ссылки
    var fixUrl = window.location.href.split('?')[0]; fixUrl = fixUrl.replace(/(^\w+:|^)\/\//, '');
    // Поиск текста по регулярному выражению
    var newHTMLCode = getText.replace(/\[BRONY](.*?)\[\/BRONY]/gi, function(str, text){
        // Проверка на нахождение в диалоге
		if ( fixUrl != "m.vk.com/mail" && fixUrl != "vk.com/im" )
            hash = dumpHash + cryptoJS.MD5(fixUrl); // Если не диалог, делаем хеш рабочим только для сообщества
        
        // Декодирование текста
        var decrypted = cryptoJS.AES.decrypt(text, hash);
        // Возвращение оригинального хеша из временной переменной
        hash = dumpHash;
        // Возвращение декодированного текста, приведённого в читабельный вид
        return decrypted.toString(cryptoJS.enc.Utf8);
    });
    if (newHTMLCode == getText)
        return false;
    // Возврат нового html блока
    return newHTMLCode;
}

// Функция для поиска необходимых блоков на HTML странице
var findingCryptMethod = function() {
    // Не выполнять код, если приложение выключено, или имеет невалидные данные страницы
    if ( isEnabled === false || isBlacklist === true )
        return;

    // Чтение актуально хеша из репозитория
	$.get( "https://raw.githubusercontent.com/Shark-vil/Brony-crypter/master/hash.txt", function( data ){
        // Разделение полученного текста построчно
        var arrayOfLines = data.match(/[^\r\n]+/g);
        
        // Проверка валидности полученного текста
		if ( arrayOfLines[0] == 'BronyCrypt' )
			hash = arrayOfLines[1]; // Получаем актуальный хеш
		else
			hash = origHash; // Используем стандартный хеш
        
        // Поиск элементов в зависимости от версии отображения VK (Мобильная и десктопная)
		if (isVkMobile === true){
            // Запись на стене сооьщества
			$(".pi_text").each(function(i){
                // Получение изменённого кода
                var newHTMLCode = replaceHTMLComponent($(this).html());
                // Проверка на то, что код был изменён
                if (newHTMLCode !== false)
                    $(this).html(newHTMLCode);  // Запись изменённого кода
            });
            // Сообщение в VK
			$(".mi_text").each(function(i){
                // Получение изменённого кода
                var newHTMLCode = replaceHTMLComponent($(this).html());
                // Проверка на то, что код был изменён
                if (newHTMLCode !== false)
				    $(this).html(newHTMLCode);  // Запись изменённого кода
			});
		} else {
            // Запись на стене сооьщества
			$(".wall_post_text").each(function(i){
                // Получение изменённого кода
                var newHTMLCode = replaceHTMLComponent($(this).html());
                // Проверка на то, что код был изменён
                if (newHTMLCode !== false)
                    $(this).html(newHTMLCode);  // Запись изменённого кода
            });
            // Сообщение в VK
			$(".im-mess--text").each(function(i){
                // Получение изменённого кода
                var newHTMLCode = replaceHTMLComponent($(this).html());
                // Проверка на то, что код был изменён
                if (newHTMLCode !== false)
                    $(this).html(newHTMLCode);  // Запись изменённого кода
			});
		}
	});
}

// Функция для проверки VK на мобильную версию сайта
var vkCheckerUrl = function() {
    if (location.hostname.indexOf("m.vk.com") != -1) {
        isVkMobile = true;
    };
}

// Функция для поиска невалидных значений на странице
var checkBadGroup = function() {
    if ($("#page_menu_group_manage").length && location.href.indexOf("vk.com/mlpfan") != -1) {
        return true;
    };
    return false;
}

// функция основной проверки
var checkers = function() {
    // Если сообщество имеет невалидные параметры - блокируем расширение
    if (checkBadGroup())
    {
        chrome.storage.local.set({'GoogleExtension_BronyCrypt_IsBadGroup': true});
        isBlacklist = true;
    }

    // Проверка на мобильную версию VK
    vkCheckerUrl();

    // Замена текста на странице
    findingCryptMethod();

    // Вызов замены текста после перехода в диалог
    $(".nim-dialog--name").click(function() {
        setTimeout(findingCryptMethod, 2000);
    });
    $(".nim-dialog--text-preview").click(function() {
        setTimeout(findingCryptMethod, 2000);
    });
}

// Функция для вызова проверки после смены URL вдреса сайта ( В пределах вк )
function urlHandler(){
    this.oldUrl = window.location.href;
    this.Check;

    var that = this;
    var detect = function(){
        if(that.oldUrl != window.location.href) {
            checkers();
            that.oldUrl = window.location.href;
        }
    }
    this.Check = setInterval(function(){ detect() }, 500);
}

// Создание нового экземпляра класса отслеживания
var urlDetection = new urlHandler();

// Выполнение проверок по завершению загрузк страницы
$(document).ready(function() {
    // Выполнение основной проверки
    checkers();

    // Функция для вызова проверки каждый раз после окончания прокрутки страницы
    var timeout = false;
    $(window).scroll(function() {
        if (timeout !== false) { clearTimeout(timeout); };
        timeout = setTimeout(function() { checkers(); }, 300);
    });
});