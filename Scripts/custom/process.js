var listStr = [];
var selected_step = "";
$(function () {
    $('.steps-form').hide();
});
function addStep() {
    $('.steps-form').show();
    var step_id = $("select option:selected").val();
    var step_name = $("select option:selected").text();
    if (step_id == "") {
        $('#error').text("Bạn cần chọn step trước!");
        return;
    }
    if (listStr.includes(step_id)) {
        $('#error').text("Bạn đã chọn bước này rồi!");
        return;
    }
    $('#error').text("");
    changeStep(step_id, step_name);
    listStr.push(step_id);
}
function changeStep(step_id, step_name) {
    var html = '<div id = "step-' + step_id + '" class="steps-step">' +
        '<a data-toggle="tooltip" href = "#/" type = "button" onclick ="return clickStep(' + step_id + ')" class="btn btn-primary text-white btn-circle">' + step_id + '</a>' +
        '<p id = "p-' + step_id + '">' + step_name + '</p>' +
        '</div >';
    $('.steps-row').append(html);
}
function clickStep(step_id) {
    selected_step = step_id;
}
function deleteStep() {
    if (selected_step == "") {
        $('#error').text("Chọn bước cần xóa!");
        return;
    }
    $('#error').text("");
    var temp = listStr.filter(m => m != selected_step);
    listStr = temp;
    $('#step-' + selected_step).remove();
    if (listStr.length < 1) {
        $('.steps-form').hide();
    }
}
function save() {
    if (listStr.length < 2) {
        $('#error').text("Bạn cần có ít nhất 2 bước!");
        return;
    }
    $('#error').text("");
    var processStr = "";
    listStr.forEach(function (value) {
        processStr += value + "(),";
    });
    processStr = processStr.substr(0, processStr.length - 1);
    $("#process").val(processStr);
    $('#save-form').submit();
}
