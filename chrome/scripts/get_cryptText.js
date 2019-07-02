var hash = "#*28638tr@G#*GR@ugu2d*G@#&GR@#g(23r*08hgio23fFM";
var origHash = hash;
		
function clickHandler(e) {
    var getInputText = document.getElementById("encrypt_text").value;
	
	if ( getInputText.length >= 200 )
	{
		Swal.fire({
		  position: 'top-end',
		  type: 'error',
		  title: 'Максимальный объём текста - 200 символов',
		  showConfirmButton: false,
		  timer: 3000
		})
		return false;
	}
	
    var matches = getInputText.split(/\n|\s\n/);
    getInputText = matches.join("<br>\n") + "<br>";
	
	var pattern = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
	getInputText = getInputText.replace(pattern, function(str, text) {		
		var url = '<a href="' + text + '" target="_blank" rel="noopener">' + text + '</a>';
        return url;
    });
	
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		var url = tabs[0].url;
		var fixUrl = url.split('?')[0]; fixUrl = fixUrl.replace(/(^\w+:|^)\/\//, '');

		$.get( "https://pastebin.com/raw/gzeg1d6v", function( data ) {
			var arrayOfLines = data.match(/[^\r\n]+/g);
			if ( arrayOfLines[0] == 'BronyCrypt' )
				hash = arrayOfLines[1];
			else
				hash = origHash;
			
			var dumpHash = hash;
			if ( fixUrl != "m.vk.com/mail" && fixUrl != "vk.com/im" )
				hash = dumpHash + ponyCrypto.MD5(fixUrl);
			var encryptedText = ponyCrypto.AES.encrypt(getInputText, hash);
			hash = dumpHash;
			copy("[BRONY]" + encryptedText + "[/BRONY]");
		});
	});
}

function copy(text) {
    var input = document.createElement("input");
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand("copy");
    document.body.removeChild(input);
	
	Swal.fire({
	  position: 'top-end',
	  type: 'success',
	  title: 'Текст скопирован',
	  showConfirmButton: false,
	  timer: 1500
	})
	
    return result;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("crypt_start").addEventListener("click", clickHandler);
});