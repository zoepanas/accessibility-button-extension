var state = "none" // horizontal_scanning, vertical_scanning
var x = 0;
var y = 0;
var text_area = null;
var caps = false;
var shift = false;

function paint() {
    if (state == "horizontal_scanning") {
        // update position of your horizontal scan bar
        x = x + 10
        $("#hor_bar").css("background", "linear-gradient(to right, red 0px, red "+x+"px, transparent "+x+"px, transparent 100%)")
        $("#hor_bar").show()
    } else if (state == "vertical_scanning"){
        // update position of your vertical scan bar
        y = y + 10
        $("#ver_bar").css({left: x-1})
        $("#ver_bar").css("background", "linear-gradient(to bottom, red 0px, red "+y+"px, transparent "+y+"px, transparent 100%)")
        $("#ver_bar").show()
    } else {
        // do nothing
        $("#hor_bar").hide()
        $("#ver_bar").hide()
        x = 0
        y = 0
        $("#ver_bar").css({top: y, left: x})
        $("#hor_bar").css({top: y, left: x})
    }
}

function simulateClick(element){
    console.log(element)
    if (!element){
        console.log("not element")
        return;
    }
    var dispatchEvent = function (elt, name) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(name, true, true);
        elt.dispatchEvent(clickEvent);
    };
    dispatchEvent(element, 'mouseover');
    dispatchEvent(element, 'mousedown');
    dispatchEvent(element, 'click');
    dispatchEvent(element, 'mouseup');
};

$(document).keydown(function(e){
    if (e.key == " "){
        e.stopPropagation()
        if (typeof interval !== 'undefined'){clearInterval(interval)}
        
        interval = setInterval(function(){
            paint();
        }, 200);
        
        // update state here, given current state
        if (state == "none"){
            state = "horizontal_scanning"
        } else if (state == "horizontal_scanning"){
            state = "vertical_scanning"
        } else if (state == "vertical_scanning") {
            state = "none"
            var elementtoclick = document.elementFromPoint(x, y);
            simulateClick(elementtoclick);
            if ($(elementtoclick).is("input[type=’text’],textarea")){
                text_area = elementtoclick;
            }
            console.log("clicked")
        } else {
            // do nothing
        }

        
        return false;
    }
});

$(document).ready(function(){
    console.log("here")
    hbar = $("<div id='hor_bar'></div>")
    vbar = $("<div id='ver_bar'></div>")
    $("body").append(hbar)
    $("body").append(vbar)
    $("#hor_bar").hide()
    $("#ver_bar").hide()

    var sc = $(window).height()

    scroll_div = $("<div id='scroll'></div>")
    s = $("<div id='scroll_up'>&#8963</div><div id='scroll_down'>&#8964</div>")
    $("body").append(scroll_div)
    $("#scroll").append(s)
    
    $("#scroll_down").click(function(){
        $('html, body').animate({
            scrollTop: $(document).scrollTop()+(sc * 0.1)
        }, 1000);
    })

    $("#scroll_up").click(function(){
        $('html, body').animate({
            scrollTop: $(document).scrollTop()-(sc * 0.1)
        }, 1000);
    })

    keyboard = $("<div id='keyboard'></div>")
    $("body").append(keyboard)
    $("#keyboard").load("https://sarahmorrisonsmith.com/accessibility/keyboard.html")
    $("#keyboard").hide()

    key_btn = $("<div id='keyboard_btn'>&#9000</div>")
    $("#scroll").append(key_btn)

    $("#keyboard_btn").click(function(){
        if ($("#keyboard").is(":hidden")){
            $("#keyboard").show()
        } else {
            $("#keyboard").hide()
        }
    })

    $(document).on("click", ".key", function(){
        
        if($(this).hasClass("backspace")){
            var len = $(text_area).val().length;
            $(text_area).val($(text_area).val().substring(0, len-1))
        } else if($(this).hasClass("caps")){
            if(caps){
                caps = false;
            } else {
                caps = true;
            }
        } else if ($(this).hasClass("shift")){
            if(shift){
                shift = false;
            } else {
                shift = true;
            }
        } else {
            var str = $(this).text().trim().toLowerCase();
            var newchar;
            if($(this).hasClass("dual")){
                if(caps || shift){
                    newchar = str.charAt(0)
                    shift = false;
                } else {
                    newchar = str.charAt(1)
                }
            } else if ($(this).hasClass("space")){
                newchar = " "
            } else if ($(this).hasClass("tab")){
                newchar = "    "
            } else {
                if(caps || shift){
                    newchar = str.toUpperCase()
                    shift = false;
                } else {
                    newchar = str
                }
            }
            $(text_area).val($(text_area).val() + newchar)
        }
    })

})