/* 
    Проверка хранилища, и загрузка соответствующих.
*/

// Чтение значения об принятии пользовательского соглашения
chrome.storage.local.get('GoogleExtension_BronyCrypt_Agreement_Accepted', function(data_1){
    // Чтение значения об невалидном сообществе
    chrome.storage.local.get('GoogleExtension_BronyCrypt_IsBadGroup', function(data_2){
        // Выполнение ряда проверок
        if (data_1.GoogleExtension_BronyCrypt_Agreement_Accepted === true &&
            data_2.GoogleExtension_BronyCrypt_IsBadGroup !== true)
                window.location.href = "popup.html";    // Открытие главной страницы, если всё нормально
        else if ( data_2.GoogleExtension_BronyCrypt_IsBadGroup !== true )
            window.location.href = "agreement.html";    // Открытие пользовательского соглашения, если оно не принято
        else
            window.location.href = "access_error.html"; // Открытие страницы с ошибкой в случае обнаружения невалидного сообщества
    });
});