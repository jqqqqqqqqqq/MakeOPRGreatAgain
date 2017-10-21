// ==UserScript==
// @name         OPR Notification
// @version      0.7
// @description  pull latest info every 10 seconds, if recon is available, send a web notification.
// @updateURL    https://github.com/jqqqqqqqqqq/MakeOPRGreatAgain/raw/master/OPRNotification.user.js
// @downloadURL  https://github.com/jqqqqqqqqqq/MakeOPRGreatAgain/raw/master/OPRNotification.user.js
// @author       jqqqqqqqqqq
// @match        https://opr.ingress.com/recon
// @match        https://opr.ingress.com/
// @grant        none
// ==/UserScript==



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////DO NOT EDIT THIS LINE BELOW!
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function rnd(start, end){  // chaoed from shizhao
    return Math.floor((Math.random() * (end - start) + start));
}

function main(){
    if($($(".alert-danger")[0]).hasClass('ng-hide')){
        console.warn("OPR Notification idle.");
        return;
    }
    var injector = angular.injector(['ng']);
    injector.invoke(function($http){
        var flip = 0;
        var timeout=rnd(20,60);
        console.warn("OPR Notification running. First update will occur in " + timeout + " seconds.");
        flip=setTimeout(function timeoutFun(){
            var SUBMISSION_URL = "/api/v1/vault/review";
            var items = {};
            $http.get(SUBMISSION_URL).then(function(response) {
                items = response.data;
                if(items.code == "ERROR"){
                    timeout=rnd(20,60);
                    console.warn("No portal available, retry in " + timeout + " seconds.");
                    flip=setTimeout(timeoutFun,timeout*1000);
                }
                if(items.code == "OK"){
                    sessionStorage.setItem('portalAvailable', true);
                    location.href="/"; //有po就去主页
                    console.warn("New portals available！");
                }
            });
        },timeout*1000);
    });
}

function waitForLoading(){
    while(!$($(".ingress-loader")[0]).hasClass("ng-hide")){
        setTimeout(waitForLoading, 1000);
        return;
    }
    main();
}

function showNotification(){
    Notification.requestPermission( function(status) {
        var new_portal = new Notification("New portals available！",{// 显示通知
            body: 'Come on! Let\'s continue.',
            icon:"/img/great.png"
        });
    });
}

(function() {
    Notification.requestPermission();
    if(location.href == "https://opr.ingress.com/recon"){
        waitForLoading();
    }
    else{
        if(sessionStorage.getItem('portalAvailable')){
            sessionStorage.removeItem('portalAvailable');
            showNotification();
        }
    }
})();

