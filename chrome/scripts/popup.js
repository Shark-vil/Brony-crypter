var isVkMobile = false;
var isEnabled = false;
var isBlacklist = false;
var hash = "#*28638tr@G#*GR@ugu2d*G@#&GR@#g(23r*08hgio23fFM";
var origHash = hash;

chrome.storage.local.get('GoogleExtension_BronyCrypt_Launch', function(data){
    if (data.GoogleExtension_BronyCrypt_Launch === true)
        isEnabled = true;
});

chrome.storage.onChanged.addListener(function(changes, area) {
    if (area == "local" && "GoogleExtension_BronyCrypt_Launch" in changes) {
        isEnabled = changes.GoogleExtension_BronyCrypt_Launch.newValue;
    };
});

var findingMethod = function(getText) {
	var dumpHash = hash;
	var fixUrl = window.location.href.split('?')[0]; fixUrl = fixUrl.replace(/(^\w+:|^)\/\//, '');
    var newHTMLCode = getText.replace(/\[BRONY](.*?)\[\/BRONY]/gi, function(str, text) {		
		if ( fixUrl != "m.vk.com/mail" && fixUrl != "vk.com/im" )
			hash = dumpHash + ponyCrypto.MD5(fixUrl);
        var decrypted = ponyCrypto.AES.decrypt(text, hash);
		hash = dumpHash;
        return decrypted.toString(ponyCrypto.enc.Utf8);
    });
    return newHTMLCode;
}

var replaceComponent = function() {
    if ( isEnabled === false || isBlacklist === true )
        return;

	$.get( "https://pastebin.com/raw/gzeg1d6v", function( data ) {
		var arrayOfLines = data.match(/[^\r\n]+/g);
		if ( arrayOfLines[0] == 'BronyCrypt' )
			hash = arrayOfLines[1];
		else
			hash = origHash;
		
		if (isVkMobile === true) {
			$(".pi_text").each(function(i) {
				var newHTMLCode = findingMethod($(this).html());
				$(this).html(newHTMLCode);
			});
			$(".mi_text").each(function(i) {
				var newHTMLCode = findingMethod($(this).html());
				$(this).html(newHTMLCode);
			});
		} else {
			$(".wall_post_text").each(function(i) {
				var newHTMLCode = findingMethod($(this).html());
				$(this).html(newHTMLCode);
			});
			$(".im-mess--text").each(function(i) {
				var newHTMLCode = findingMethod($(this).html());
				$(this).html(newHTMLCode);
			});
		}
	});
}

var vkCheckerUrl = function() {
    if (location.hostname.indexOf("m.vk.com") != -1) {
        isVkMobile = true;
    };
}

var checkBadGroup = function() {
    if ($("#page_menu_group_manage").length && location.href.indexOf("vk.com/mlpfan") != -1) {
        return true;
    };
    return false;
}

var checkers = function() {
    if (checkBadGroup())
    {
        chrome.storage.local.set({'GoogleExtension_BronyCrypt_IsBadGroup': true});
        isBlacklist = true;
    }

    vkCheckerUrl();
    replaceComponent();

    $(".nim-dialog--name").click(function() {
        setTimeout(replaceComponent, 2000);
    });

    $(".nim-dialog--text-preview").click(function() {
        setTimeout(replaceComponent, 2000);
    });
}

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

var urlDetection = new urlHandler();

$(document).ready(function() {
    checkers();

    var timeout = false;
    $(window).scroll(function() {
        if (timeout !== false) { clearTimeout(timeout); };
        timeout = setTimeout(function() { replaceComponent(); }, 300);
    });
});