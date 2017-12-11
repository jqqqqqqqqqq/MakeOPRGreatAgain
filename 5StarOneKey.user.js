// ==UserScript==
// @name         5 Star One Key
// @version      0.26
// @description  Give five star with single click
// @updateURL    https://github.com/jqqqqqqqqqq/5StarOneKey/raw/master/5%20Star%20One%20Key.user.js
// @downloadURL  https://github.com/jqqqqqqqqqq/5StarOneKey/raw/master/5%20Star%20One%20Key.user.js
// @author       jqqqqqqqqqq
// @match        https://opr.ingress.com/recon
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        unsafeWindow
// ==/UserScript==

var auto_select = true;

var buttons = [
    {button:"Five Star", total:5, name:5, history:5, unique:5, location:5, safety:5},
    {button:"553355", total:5, name:5, history:3, unique:3, location:5, safety:5},
    {button:"533355", total:5, name:3, history:3, unique:3, location:5, safety:5},
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
                $(this).css({'margin-bottom': '15px'});
                break;

            case "answerCtrl.formData.description":
                button_list['name'].push($(this));
                $(this).css({'margin-bottom': '15px'});
                break;

            case "answerCtrl.formData.cultural":
                button_list['history'].push($(this));
                $(this).css({'margin-bottom': '15px'});
                break;

            case "answerCtrl.formData.uniqueness":
                button_list['unique'].push($(this));
                break;

            case "answerCtrl.formData.location":
                button_list['location'].push($(this));
                break;

            case "answerCtrl.formData.safety":
                button_list['safety'].push($(this));
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
        button.className = "button big-submit-button";
        button.appendChild(textnode);
        button_region.appendChild(button);
        button.onclick = function(){rate_portal(button_data["total"], button_data["name"], button_data["history"], button_data["unique"], button_data["location"], button_data["safety"]);};
    });
}

function move_portal_rate() {
    // move portal rating to the right side
    const scorePanel = w.document.querySelector("div[class~='pull-right']");
    let nodesToMove = Array.from(w.document.querySelector("div[class='btn-group']").parentElement.children);
    nodesToMove = nodesToMove.splice(2, 6);
    nodesToMove.push(w.document.createElement("br"));
    for (let j = nodesToMove.length - 1; j >= 0; --j) {
        scorePanel.insertBefore(nodesToMove[j], scorePanel.firstChild);
    }
}
(function() {
    if(auto_select) {
        enable_auto_select();
    }
    add_button();
    update_button_list();
    move_portal_rate();
})();
