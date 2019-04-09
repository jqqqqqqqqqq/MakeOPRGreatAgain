// ==UserScript==
// @id			 5 Star One Key for Android
// @name         5 Star One Key for Android
// @version      0.30-modify-0.34
// @description  Give five star with single click
// @updateURL    https://github.com/Totoro625/MakeOPRGreatAgain/raw/master/5StarOneKeyForAndroid.user.js
// @downloadURL  https://github.com/Totoro625/MakeOPRGreatAgain/raw/master/5StarOneKeyForAndroid.user.js
// @author       jqqqqqqqqqq | modify by totoro625
// @match        https://opr.ingress.com/recon
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @supportURL   https://totoro.ink
// @grant        unsafeWindow
// ==/UserScript==

var auto_select = true;

var buttons = [
	{button:"4.3", total:5, name:5, history:5, unique:5, location:3, safety:3},
	{button:"4.5", total:5, name:5, history:5, unique:5, location:3, safety:4},
    {button:"4.6", total:5, name:5, history:5, unique:5, location:4, safety:4},
	{button:"4.8", total:5, name:5, history:5, unique:5, location:4, safety:5},
    {button:"5.0", total:5, name:5, history:5, unique:5, location:5, safety:5},
	{button:"4.1", total:4, name:5, history:5, unique:5, location:3, safety:3},
    {button:"3.7", total:4, name:4, history:4, unique:4, location:3, safety:3},
    {button:"3.0", total:3, name:3, history:3, unique:3, location:3, safety:3},
    {button:"1.0", total:1, name:0, history:0, unique:0, location:0, safety:0},
];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////DO NOT EDIT THIS LINE BELOW!
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const w = typeof unsafeWindow == "undefined" ? window : unsafeWindow;

var first = true;
function enable_auto_select(){
    $(".button-star").each(function(){  // use mouse hover to select stars
        if(first) {
            console.warn("first ignored");
            first = false;
        }
        else {
            $(this).hover(function(){$(this).click();});
        }
    });
}

var button_list = {
    'total': [],
    'name': [],
    'history': [],
    'unique': [],
    'location': [],
    'safety': []
};

function update_button_list(){
    $(".button-star").each(function(){  // use mouse hover to select stars
        switch($(this).attr("ng-model")) {
            case "answerCtrl.formData.quality":
                button_list['total'].push($(this));
                $(this).css({'margin-bottom': '10px'});
                $(this).children('span').css({'font-size': '42px'});
                $(this).css({'margin-left': '5px'});
                $(this).css({'margin-right': '5px'});
                break;

            case "answerCtrl.formData.description":
                button_list['name'].push($(this));
                $(this).css({'margin-bottom': '10px'});
                $(this).css({'margin-left': '5px'});
                $(this).css({'margin-right': '5px'});
                break;

            case "answerCtrl.formData.cultural":
                button_list['history'].push($(this));
                $(this).css({'margin-bottom': '10px'});
                $(this).css({'margin-left': '5px'});
                $(this).css({'margin-right': '5px'});
                break;

            case "answerCtrl.formData.uniqueness":
                button_list['unique'].push($(this));
                $(this).css({'margin-left': '5px'});
                $(this).css({'margin-right': '5px'});
                break;

            case "answerCtrl.formData.location":
                button_list['location'].push($(this));
                $(this).css({'margin-left': '5px'});
                $(this).css({'margin-right': '5px'});
                break;

            case "answerCtrl.formData.safety":
                button_list['safety'].push($(this));
                $(this).css({'margin-left': '5px'});
                $(this).css({'margin-right': '5px'});
                break;
        }

    });
}


function rate_portal(total, name, history, unique, location, safety) {
    button_list['total'][total - 1].click();
    button_list['name'][name - 1].click();
    button_list['history'][history - 1].click();
    button_list['unique'][unique - 1].click();
    button_list['location'][location - 1].click();
    button_list['safety'][safety - 1].click();
}

function add_button() {
    var button_region = document.getElementById("submitDiv");
    buttons.forEach(function(button_data) {
        var button = document.createElement("button");
        var textnode = document.createTextNode(button_data["button"]);
        button.className = "button submit-button";
        button.appendChild(textnode);
        button_region.appendChild(button);
        button.onclick = function(){rate_portal(button_data["total"], button_data["name"], button_data["history"], button_data["unique"], button_data["location"], button_data["safety"]);};
    });
    w.$scope = element => w.angular.element(element).scope();
    var submitAndNext = document.createElement("button");
    submitAndNext.className = "button submit-button";
    submitAndNext.innerHTML = `<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;<span class="glyphicon glyphicon-forward"></span>`;
    submitAndNext.title = "Submit and go to next review";
    submitAndNext.addEventListener("click", function() {angular.element(document.getElementById('AnswersController')).scope().answerCtrl.submitForm();setTimeout(function(){ window.location.assign("/recon");}, 1000);});
    button_region.insertBefore(submitAndNext, null);
}


(function() {
    if(auto_select) {
        enable_auto_select();
    }
    add_button();
    update_button_list();
    move_portal_rate();
})();
