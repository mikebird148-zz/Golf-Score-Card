// var numplayers = 5;
var numberofholes = 18;
var myplace = {latitude: 40.4426135, longitude: -111.8631116, radius: 100};
var closeCourses;
var selectedCourse;
var players;

$(document).ready(function() {
    $.post("http://golf-courses-api.herokuapp.com/courses/", myplace, function(data, status) {
        closeCourses = JSON.parse(data);
        for (var p in closeCourses.courses) {
            var selectinput = "<option value='" + closeCourses.courses[p].id + "'>" + closeCourses.courses[p].name + "</option>";
            $("#courseselect").append(selectinput);
        }
    });
});

function loadCourse(theid) {
    $("#teetypes").html("");
    $.get("http://golf-courses-api.herokuapp.com/courses/" + theid, function(data, status) {
        selectedCourse = JSON.parse(data);
        numberofholes = selectedCourse.course.holes.length;
        $("#coursename").html(selectedCourse.course.name);
        $("#courseaddress").html(selectedCourse.course.addr_1);
        $("#courseaddress2").html(selectedCourse.course.city);
        $("#coursenumber").html(selectedCourse.course.phone);
        $("#coursewebsite").html("<a target='_blank' href='" + selectedCourse.course.website + "'>Visit our Website</a>");
        for (var i = 0; i < (selectedCourse.course.holes[0].tee_boxes.length - 1); i++) {
            $("#teetypes").append("<option value='" + i + "'>" + selectedCourse.course.holes[0].tee_boxes[i].tee_type + "</option>");
        }
    });
}

function begincard() {
    $("#cardsetupbtn").click(function(){
        $("#cardsetup").remove();
    });
    var totalboxes = "";
    var outboxes = "";
    var inboxes = "";
    players = $("#playercount").val();
    $("#leftcard").html("");
    $("#scorecontainer").css("display", "flex");
    for (var i = 1; i <= players; i++) {
        $("#leftcard").append("<div id='playerlabel" + i +"' class='playerlabels'> Player " + i + " <span id='editicon' class='removeicon fa fa-pencil-square-o' aria-hidden='true' onclick='editname(" + i + ")'></span><span class='removeicon fa fa-trash-o' aria-hidden='true' onclick='removeplayer("+ i +")'></span></div>");
        totalboxes += "<div class='playerstyles' id='playertotal" + i + "'>-</div>";
        outboxes += "<div class='playerstyles' id='playerouttotal" + i + "'>-</div>";
        inboxes += "<div class='playerstyles' id='playerintotal" + i + "'>-</div>";
    }
    for (var c = 1; c <= numberofholes; c++) {
        $("#rightcard").append("<div id='column" + c +"' class='holcol'><div class='colheader'>" + c + "</div></div>");
    }
    $(".modalbackground").fadeOut();
    $("#rightcard").append("<div id='outcol' class='holcol'><div class='colheader'>out</div>" + outboxes + "</div>");
    $("#rightcard").append("<div id='incol' class='holcol'><div class='colheader'>in</div>" + inboxes + "</div>");
    $("#rightcard").append("<div id='scorecol' class='holcol'><div class='colheader'>score</div>" + totalboxes + "</div>");
    buildholes();
}

function buildholes() {
    numberofholes = selectedCourse.course.holes.length;
    $("#contact").removeClass("empty");
    $("#container").removeClass("empty");
    for (var s = 0; s < numberofholes; s++) {
        $("#par-values").append("<div id='parvalues" + (s + 1) + "' class='parstyles'>" + selectedCourse.course.holes[s].tee_boxes[0].par + "</div>");
        $("#yardage-values").append("<div class='yardagestyles'>" + selectedCourse.course.holes[s].tee_boxes[0].yards + "</div>");
        $("#handicap-values").append("<div class='handicapstyles'>" + selectedCourse.course.holes[s].tee_boxes[0].hcp + "</div>");
    }
    for (var p = 1; p <= players; p++) {
        for (var h = 1; h <= numberofholes; h++) {
            $("#column" + h).append("<input onkeyup='calculatescore(" + p + ")' class='holebox' type='text' id='player" + p + "hole" + h + "' />");
        }
    }
    parYardageHandicap();
}

function parYardageHandicap() {
    var partotal = $(".parstyles");
    var parsum = 0;
    var yardagetotal = $(".yardagestyles");
    var yardagesum = 0;
    var handicaptotal = $(".handicapstyles");
    var handicapsum = 0;
    numberofholes = selectedCourse.course.holes.length;
    for (var e = 0; e < partotal.length; e++) {
        var parct = parseInt($(partotal[e]).text());
        parsum += parct;
        var yardct = parseInt($(yardagetotal[e]).text());
        yardagesum += yardct;
        var hcpct = parseInt($(handicaptotal[e]).text());
        handicapsum += hcpct;
    }
    $("#par-total").html(parsum);
    $("#yardage-total").html(yardagesum);
    $("#handicap-total").html(handicapsum);
}

// function addplayer(theid) {
//
// }

function editname(golferid) {
    $("#playerlabel" + golferid).replaceWith("<div id='playerlabel" + golferid + "'><form><input id='theirname' type='text' placeholder='Enter your name.' /><input id='submitname' type='submit' value='ok' /></form></div>");
    $("#submitname").click(function(){
            $("#playerlabel" + golferid).replaceWith("<div id='playerlabel" + golferid + "' class='playerlabels'>" + $("#theirname").val() + "<span id='editicon' class='removeicon fa fa-pencil-square-o' aria-hidden='true' onclick='editname(" + golferid + ")'></span><span class='removeicon fa fa-trash-o' aria-hidden='true' onclick='removeplayer(" + golferid + ")'></span></div>");
        }
    );
}

function removeplayer(theid) {
    $("#playerlabel" + theid).remove();
    for (var i = 1; i <= numberofholes; i++) {
        $("#player" + theid + "hole" + i).remove();
    }
}

function calculatescore(playerid) {
        numberofholes = selectedCourse.course.holes.length;
        var thetotal = 0;
        var theout = 0;
        var thein = 0;
        for (var t = 1; t <= numberofholes; t++) {
            thetotal += Number($("#player" + playerid + "hole" + t).val());
        }
        for (var t = 1; t <= numberofholes; t++) {
        theout += Number($("#player" + playerid + "hole" + t).val());
    }
    if (numberofholes == 18) {
        for (var t = 10; t <= numberofholes; t++) {
            thein += Number($("#player" + playerid + "hole" + t).val());
        }
    }
        $("#playertotal" + playerid).html(thetotal);
        $("#playerouttotal" + playerid).html(theout);
        $("#playerintotal" + playerid).html(thein);
}
