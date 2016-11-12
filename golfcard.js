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
        // if (selectedCourse.course.website === true) {
        //     $("#coursewebsite").html("<a target='_blank' href='" + selectedCourse.course.website + "'>Visit our Website</a>");
        // } else {
        //     $("#coursewebsite").remove();
        // }
        for (var i = 0; i < (selectedCourse.course.holes[0].tee_boxes.length - 1); i++) {
            $("#teetypes").append("<option value='" + i + "'>" + selectedCourse.course.holes[0].tee_boxes[i].tee_type + "</option>");
        }
    });
}

function begincard() {
    var totalboxes = "";
    players = $("#playercount").val();
    $("#leftcard").html("");
    $("#scorecontainer").css("display", "flex");
    for (var i = 1; i <= players; i++) {
        $("#leftcard").append("<div id='playerlabel" + i +"' class='playerlabels'> Player " + i + " <span class='removeicon fa fa-pencil-square-o' aria-hidden='true' onclick='editname("+ i +")'></span><span class='removeicon fa fa-trash-o' aria-hidden='true' onclick='removeplayer("+ i +")'></span></div>");
        totalboxes += "<div class='playerstyles' id='playertotal" + i + "'></div>";
    }
    for (var c = 1; c <= numberofholes; c++) {
        $("#rightcard").append("<div id='column" + c +"' class='holcol'><div class='colheader'>" + c + "</div></div>");
    }
    $(".modalbackground").fadeOut();
    $("#rightcard").append("<div id='outcol' class='holcol'><div class='colheader'>out</div>" + totalboxes + "</div>");
    $("#rightcard").append("<div id='incol' class='holcol'><div class='colheader'>in</div>" + totalboxes + "</div>");
    $("#rightcard").append("<div id='strokescol' class='holcol'><div class='colheader'>strokes</div>" + totalboxes + "</div>");
    $("#rightcard").append("<div id='scorecol' class='holcol'><div class='colheader'>score</div>" + totalboxes + "</div>");
    buildholes();
}

function buildholes() {
    numberofholes = selectedCourse.course.holes.length;
    $("#contact").removeClass("empty");
    $("#container").removeClass("empty");
    for (var p = 1; p <= players; p++) {
        for (var h = 1; h <= numberofholes; h++) {
            $("#column" + h).append("<input onkeyup='calculatescore(" + p + ")' class='holebox' type='text' id='player" + p + "hole" + h + "' />");
        }
    }
    for (var s = 0; s < numberofholes; s++) {
        $("#par-values").append("<div id='parvalues" + s + "' class='parstyles'>" + selectedCourse.course.holes[s].tee_boxes[0].par + "</div>");
        $("#yardage-values").append("<div class='yardagestyles'>" + selectedCourse.course.holes[s].tee_boxes[0].yards + "</div>");
        $("#handicap-values").append("<div class='handicapstyles'>" + selectedCourse.course.holes[s].tee_boxes[0].hcp + "</div>");
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

function removeplayer(theid) {
    $("#playerlabel" + theid).remove();
    for (var i = 1; i <= numberofholes; i++) {
        $("#player" + theid + "hole" + i).remove();
    }
}

// function editname(theid) {
//     $(".removeicon").click(function() {
//         $("#playerlabel" + theid).hide();
//         $("#leftcard").append("<form name='input' id='showform'><label for='nametobe'></label><input id='nametobe' type='text' name='yourname' placeholder='Enter your name.' /><input id='subinp' type='submit' value='submit' /></form>");
//         $("#subinp").click(function() {
//             $("#playerlabel" + theid).val();
//         })
//     });
// }

function calculatescore(playerid) {
    var thetotal = 0;
    for (var t = 1; t <= numberofholes; t++) {
        thetotal += Number($("#player" + playerid + "hole" + t).val());
    }
    // for (var t = 1; t <= 9; t++) {
    //     thetotal += Number($("#player" + playerid + "hole" + t).val());
    // }
    // for (var t = 10; t <= 18; t++) {
    //     thetotal += Number($("#player" + playerid + "hole" + t).val());
    // }
    $("#playertotal" + playerid).html(thetotal);
}
