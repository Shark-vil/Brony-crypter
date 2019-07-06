/* 
    Функция переключателя на странице редактора
*/

// Вызов функий полсе полной загрузки страницы
$(document).ready(function() {   
    //Получение значения их хранилища 
    chrome.storage.local.get('GoogleExtension_BronyCrypt_Launch', function(data){
        // Если значение положительное, меняем ползунок переключателя на ВКЛ, 
        // иначе выводим сообщение об выключенном расширении
        if (data.GoogleExtension_BronyCrypt_Launch === true)
            $('#enabled_application').prop("checked", true);
        else
            $('.description').text("Статус расширения: ВЫКЛЮЧЕНО");
    });

    // Выполнение функции после каждого обновления переключателя
    $('#enabled_application').change(function() {
        // Получение текущего значения элемента
        var checked = this.checked;

        // Устанавливаем нужное текстовое оповещение
        if (checked)
            $('.description').text("Статус расширения: ВКЛЮЧЕНО");
        else
            $('.description').text("Статус расширения: ВЫКЛЮЧЕНО");
        
        // Записываем данные об активности приложения в хранилище
        chrome.storage.local.set({'GoogleExtension_BronyCrypt_Launch': checked});
    });
});