var params = new Params();

$(window).resize(function () {
    $('.thumbnail').height($('.thumbnail').width());
    paintwrapper();
});
$('.thumbnail').height($('.thumbnail').width());

function paintwrapper() {
    var width = $('.thumbnail').width();
    draw.size(width, width);
    paint(draw, params.sex, params.gender, params.orientation, params.sexChange, params.acceptSexChange, params.noOrientation);
}

function updateJsSocial() {
    $("#jsSocial").jsSocials({
        url: "https://i.ecliptik.org/" + params.toUrlParam(),
        shares: ["facebook", "twitter", "linkedin", "pinterest", "stumbleupon", "telegram", "whatsapp", "email"]
    });
}

function slidify(selector, varName, scale, offset) {
    var granularity = 100000;
    var onValueChange = function (e) {
        params[varName] = offset + scale * ($(selector).slider("value") / granularity);
        updateJsSocial();
        paintwrapper();
    };

    var timeout = {};
    function sliderfix(){
        onValueChange();
        timeout.timeout = setInterval(function(){
            onValueChange();
        }, 100);    
    }    

    function sliderunfix(){ 
        clearInterval(timeout.timeout);
    }

    $(selector).slider({
        min: -granularity,
        max: granularity,
        value: params[varName] * granularity,
        orientation: "horizontal",
        range: "min",
        slide: onValueChange,
        change: onValueChange,
        start: sliderfix,
        stop: sliderunfix
    });
}

function enableSlider(selector, beEnabled) {
    $(selector).slider({
        disabled: !beEnabled
    });
    $(selector + " .ui-slider-range").toggleClass("disabled", !beEnabled);
    $(selector + " .ui-slider-handle").toggleClass("disabled", !beEnabled);
}

function checkify(selector, varName) {
    $(selector).prop('checked', params[varName]);
    $(selector).change(function () {
        params[varName] = this.checked;
        if (varName == "noOrientation") {
            enableSlider("#slider3", !params.noOrientation);
            $("#checkboxAcceptSexChange").prop("disabled", params.noOrientation);
        }
        paintwrapper();
    })
}

function share() {
    var url = "https://i.ecliptik.org/";
    url += params.toUrlParam();
    window.open(url, '_blank');
}

function setupJsSocials() {
    jsSocials.setDefaults({
        showLabel: false,
        showCount: false,
        shareIn: "blank",
        text: "Ecliptik",
        url: "https://ecliptik.org/",
    });

    updateJsSocial();
}

function updateHoverText() {
    $(this).attr('title', params.fullDescription());
}

$(document).ready(function () {
    slidify("#slider1", "sex", 1, 0);
    slidify("#slider2", "gender", 1, 0);
    slidify("#slider3", "orientation", 1, 0);
    checkify("#checkboxHadSexChange", "sexChange");
    checkify("#checkboxAcceptSexChange", "acceptSexChange");
    checkify("#checkboxNoOrientation", "noOrientation");
    paintwrapper();
    $('#share').click(share);
    setupJsSocials();   
    $('#drawing').mouseenter(updateHoverText);
});

var draw = SVG('drawing');
