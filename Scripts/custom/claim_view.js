var current_indexStart = 0;
var current_filter = "All";
$(function () {
    

});
$("#search_input").on("keydown", function (event) {
    if (event.which == 13) {
        load("All");
    }

});


function setSeletedNav(filter) {
    if (filter != null && filter != "") {
        $('.nav-item').each(function (index) {
            if ($(this).attr('name') == filter) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }
}
function convertDateFromServer(date) {
    var indexOfOpen = date.indexOf('(');
    var indexOfClose = date.indexOf(')');
    var dateString = parseInt(date.substring(indexOfOpen + 1, indexOfClose));
    return new Date(dateString);
}
