$(document).ready(function() {    
    chrome.storage.local.get('GoogleExtension_BronyCrypt_Launch', function(data){
        if (data.GoogleExtension_BronyCrypt_Launch === true)
            $('#enabled_application').prop("checked", true);
        else
            $('.description').text("Статус расширения: ВЫКЛЮЧЕНО");
    });

    $('#enabled_application').change(function() {
        var checked = this.checked;

        if (checked)
            $('.description').text("Статус расширения: ВКЛЮЧЕНО");
        else
            $('.description').text("Статус расширения: ВЫКЛЮЧЕНО");
        
        chrome.storage.local.set({'GoogleExtension_BronyCrypt_Launch': checked});
    });
});