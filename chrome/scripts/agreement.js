/* 
    Подтверждение лицензионного соглашения.
*/

// Принятие соглашения
function confimAgreementOn(e) {
    // Запись значения в хранилище
    chrome.storage.local.set({'GoogleExtension_BronyCrypt_Agreement_Accepted': true});
    // Загрузка рабочей страницы
    window.location.href = "popup.html";
}

// Отказ от соглашения
function confimAgreementOff(e) {
    // Запись значения в хранилище
    chrome.storage.local.set({'GoogleExtension_BronyCrypt_Agreement_Accepted': false});
    // Закрытие окна расширения
    window.close();
}

// Получение значения из хранилища при загрузке окна
chrome.storage.local.get('GoogleExtension_BronyCrypt_Agreement_Accepted', function(data){
    if (data.GoogleExtension_BronyCrypt_Agreement_Accepted === true)
        $(document).ready(function() {
            document.getElementById("confim_agreement_on").remove();
            document.getElementById("confim_agreement_off").remove();
        });
});

// Добавление крючков после загрузки страницы
$( document ).ready(function() {
    // Вызывается при нажатии на кнопку принятия соглашения
    document.getElementById("confim_agreement_on").addEventListener("click", confimAgreementOn);
    // Вызывается при нажатии на кнопку отказа от соглашения
    document.getElementById("confim_agreement_off").addEventListener("click", confimAgreementOff);
});