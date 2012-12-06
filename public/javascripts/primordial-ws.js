var primordial = (function() {
    var worker = new Worker('/javascripts/primeCalculatorTask.js');
    var results = [];
    var options = {};
    var yield = function(){};
    var keepGoing = false;
    var socket = io.connect();
    var docCookies = cookieMonster();

    // init=-----------------------------------
    socket.on('ready', function(){ keepGoing = true; });    
    function register(andThen) {
        if (!keepGoing) {
            socket.emit('id', {'id':docCookies.getItem('uuid')});
        }
        if(andThen) andThen();
    }
    register();
    // --------------------------------------=

    //old fetchNumber success
    socket.on('next-number', function(data){
        calculate(data.number);
    });

    //old fetchNumber error handler
    socket.on('complete', function(data) {
        var call = options.finish || function(){};
        call();
    });

    
    function fetchNumber() {
        socket.emit('next-number');
    }

    function reportResult(result, callback) {
        socket.emit('result', result);
    }

    function calculate(number) {
        worker.postMessage(number);
    }
    
    worker.addEventListener('message', function(e) {
        var result = e.data;
        results.push(result);        
        yield(result);
        reportResult(result, next);
        next();
    });

    function next() {
        if (!keepGoing) options.finish();        
        else fetchNumber();
    }

    function stop() { keepGoing = false; }
    function start() { keepGoing = true; next(); }
    return {
        next: next,
        results: results,
        yieldTo: function(callback) { yield = callback; },
        handlers: function(handlers) { options = handlers; },
        stop: stop,
        start: start
    };





// from https://developer.mozilla.org/en-US/docs/DOM/document.cookie
   function cookieMonster(){
       return {
          getItem: function (sKey) {
            if (!sKey || !this.hasItem(sKey)) { return null; }
            return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
          },
          setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
            var sExpires = "";
            if (vEnd) {
              switch (vEnd.constructor) {
                case Number:
                  sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
                  break;
                case String:
                  sExpires = "; expires=" + vEnd;
                  break;
                case Date:
                  sExpires = "; expires=" + vEnd.toGMTString();
                  break;
              }
            }
            document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
          },
          removeItem: function (sKey, sPath) {
            if (!sKey || !this.hasItem(sKey)) { return; }
            document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
          },
          hasItem: function (sKey) {
            return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
          },
          keys: /* optional method: you can safely remove it! */ function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = unescape(aKeys[nIdx]); }
            return aKeys;
          }
       }
   }
})();