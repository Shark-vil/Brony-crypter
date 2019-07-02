chrome.storage.local.get('GoogleExtension_BronyCrypt_Agreement_Accepted', function(data_1){
    chrome.storage.local.get('GoogleExtension_BronyCrypt_IsBadGroup', function(data_2){
        if (data_1.GoogleExtension_BronyCrypt_Agreement_Accepted === true &&
            data_2.GoogleExtension_BronyCrypt_IsBadGroup !== true)
            window.location.href = "popup.html";
        else if ( data_2.GoogleExtension_BronyCrypt_IsBadGroup !== true )
            window.location.href = "agreement.html";
        else
            window.location.href = "access_error.html";
    });
});