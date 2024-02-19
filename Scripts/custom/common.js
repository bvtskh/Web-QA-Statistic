var isHideDropDownList = true;
$(function () {
    $("#sidebarToggle, #sidebarToggleTop").on('click', function (e) {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
        };
    });

    window.setTimeout(function () {
        $(".alert").fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
            var to = $('#send_to').val();
            if (to != undefined || to != "") {
                Send(to, "");
            }
        });
    }, 2000);
    var noticeHub = $.connection.notice;
    loadClient(noticeHub);
    $.connection.hub.start().done(function () {
        noticeHub.server.connect("userChat");
    });

    $('#alertsDropdown').click(function () {
        if ($('.dropdown-list').css("display") == "none") {
            $('.dropdown-list').fadeIn(2);
        } else {
            $('.dropdown-list').fadeOut(2);
            $('.hide-notice').hide();
        }
    });
    loadAllNotice();
    var filter = $('#filter').val();
    if (filter != null) {
        $('#accordionSidebar li').each(function (e) {
            if ($(this).attr('name') == filter) {

                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        }
        );
    }
    
});
function ViewAllNotice() {
    if ($('#view_all_notice').text() == "Xóa tất cả") {
        DeleteAllNotice();
    } else {
        $('.hide-notice').fadeIn();
        $('#view_all_notice').text("Xóa tất cả");
    }

}
function DeleteAllNotice() {
    $.ajax({
        url: "/Notice/DeleteNotice",
        success: function () {
            $('.dropdown-list').html('');
            $('#number_notice').text('');
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function Send(name, msg) {
    var chatHub = $.connection.notice;
    var split = name.split(",");
    $.each(split, function (index, value) {
        if (value != "")
            chatHub.server.message(value, msg);
    });

}

function loadClient(chatHub) {
    chatHub.client.message = function () {
        loadAllNotice();
    }
}
function loadAllNotice() {
    $.ajax({
        url: "/Notice/Notice",
        success: function (response) {
            $('.dropdown-list').html('');
            $('.dropdown-list').html(response.body);
            if (parseInt(response.number) > 0) {
                $('#number_notice').text(response.number + '+');
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}