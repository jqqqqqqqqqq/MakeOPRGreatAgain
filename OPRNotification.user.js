// ==UserScript==
// @name         OPR Notification
// @version      0.3
// @description  pull latest info every 10 seconds, if recon is available, send a web notification.
// @updateURL    https://github.com/jqqqqqqqqqq/MakeOPRGreatAgain/raw/master/OPRNotification.user.js
// @downloadURL  https://github.com/jqqqqqqqqqq/MakeOPRGreatAgain/raw/master/OPRNotification.user.js
// @author       jqqqqqqqqqq
// @match        https://opr.ingress.com/recon
// @grant        none
// ==/UserScript==



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////DO NOT EDIT THIS LINE BELOW!
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function rnd(start, end){
    return Math.floor((Math.random() * (end - start) + start));
}


(function() {
    var injector = angular.injector(['ng']);
    injector.invoke(function($http){
        var first_try = true;
        var flip = 0;
        var timeout=rnd(20,60)*1000;
        
        flip=setTimeout(function timeoutFun(){
            
            var SUBMISSION_URL = "/api/v1/vault/review";
            var items = {};
            $http.get(SUBMISSION_URL).then(function(response) {
                items = response.data;
                console.log(items.code);
                if(items.code == "OK"){
                    clearInterval(interval);
                    if(first_try)
                        return;
                    Notification.requestPermission( function(status) {
                        console.log(status); // 仅当值为 "granted" 时显示通知
                        var new_portal = new Notification("New portals available！",{// 显示通知
                            body: 'Come on! Let\'s continue.',
                            icon:"/img/great.png"
                        });
                        location.href="/"; //有po就去主页
                    });
                }
                first_try = false;
                timeout=rnd(20,60)*1000;
                flip=setTimeout(timeoutFun,timeout);
            });
        },timeout);
    });
})();
