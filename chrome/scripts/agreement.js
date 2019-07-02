function confimAgreementOn(e) {
    chrome.storage.local.set({'GoogleExtension_BronyCrypt_Agreement_Accepted': true});
    window.location.href = "popup.html";
}

function confimAgreementOff(e) {
    chrome.storage.local.set({'GoogleExtension_BronyCrypt_Agreement_Accepted': false});
    window.close();
}

chrome.storage.local.get('GoogleExtension_BronyCrypt_Agreement_Accepted', function(data){
    if (data.GoogleExtension_BronyCrypt_Agreement_Accepted === true)
        $(document).ready(function() {
            document.getElementById("confim_agreement_on").remove();
            document.getElementById("confim_agreement_off").remove();
        });
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("confim_agreement_on").addEventListener("click", confimAgreementOn);
    document.getElementById("confim_agreement_off").addEventListener("click", confimAgreementOff);
});