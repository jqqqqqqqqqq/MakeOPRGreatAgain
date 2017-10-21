// ==UserScript==
// @name         OPR Notification
// @version      0.8
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

var OPR_NOTIFICATION_IDLE =  "OPR Notification idle.";
var OPR_NOTIFICATION_SERVICE_RUNNING =  "OPR Notification service is running. Please sit back and relax.";
var OPR_FIRST_UPDATE = "OPR Notification running. First update will occur in %s seconds.";
var OPR_UPDATE = "No portal available, retry in %s seconds.";
var OPR_PORTAL_AVAILABLE = "New portals available！";
var OPR_NOTIFICATION_CONTENT = "Come on! Let's continue.";

function parse(str) {  // from stackoverflow
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}

function localization(){
    var locale = $("html").attr("lang");
    switch(locale){
        case "zh_CN":
            OPR_NOTIFICATION_IDLE =  "OPR 通知空闲。";
            OPR_NOTIFICATION_SERVICE_RUNNING =  "OPR 通知正在运行，请坐和放宽。";
            OPR_FIRST_UPDATE = "OPR 通知正在运行， 第一次更新将在 %s 秒之后。";
            OPR_UPDATE = "当前没有 Portal，将在 %s 秒后再次查询";
            OPR_PORTAL_AVAILABLE = "新的 Portal 已经出现！";
            OPR_NOTIFICATION_CONTENT = "怎么能够停止不前！";
            break;
        case "ja":
            OPR_NOTIFICATION_IDLE =  "OPR　は今アイドル状態になっています。";
            OPR_NOTIFICATION_SERVICE_RUNNING =  "OPR が今実行中です。お待ちください。";
            OPR_FIRST_UPDATE = "OPR 通知が今実行中です。 最初の通知まで %s 秒です。";
            OPR_UPDATE = "ただいま新しい Portal　候補があるません。次のチェックは %s 秒後です。";
            OPR_PORTAL_AVAILABLE = "新しい Portal　候補が現れました！";
            OPR_NOTIFICATION_CONTENT = "止まるもんか！";
            break;
    }
}

function rnd(start, end){  // from shizhao
    return Math.floor((Math.random() * (end - start) + start));
}

function main(){
    var alert_box = $(".alert-danger")[0];
    if($(alert_box).hasClass('ng-hide')){
        console.warn(OPR_NOTIFICATION_IDLE);
        return;
    }
    $(alert_box).children(".ng-binding").text(OPR_NOTIFICATION_SERVICE_RUNNING);
    $(alert_box).removeClass("alert-danger").addClass("alert-success");
    $(alert_box).children("a").remove();
    var injector = angular.injector(['ng']);
    injector.invoke(function($http){
        var flip = 0;
        var timeout=rnd(20,60);
        console.warn(parse(OPR_FIRST_UPDATE, timeout));
        flip=setTimeout(function timeoutFun(){
            var SUBMISSION_URL = "/api/v1/vault/review";
            var items = {};
            $http.get(SUBMISSION_URL).then(function(response) {
                items = response.data;
                if(items.code == "ERROR"){
                    timeout=rnd(20,60);
                    console.warn(parse(OPR_UPDATE, timeout));
                    flip=setTimeout(timeoutFun,timeout*1000);
                }
                if(items.code == "OK"){
                    sessionStorage.setItem('portalAvailable', true);
                    location.href="/"; // go to '/' when new portal emerges
                    console.warn(OPR_PORTAL_AVAILABLE);
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
        var new_portal = new Notification(OPR_PORTAL_AVAILABLE,{// show notification
            body: OPR_NOTIFICATION_CONTENT,
            icon:"/img/great.png"
        });
    });
}

(function() {
    Notification.requestPermission();
    localization();
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

