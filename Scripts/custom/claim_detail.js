var step_selected_id = 0;

$(function () {
    $("#searchUser").on("keydown", function (e) {
        if (e.which == 13) {
            var value = $(this).val().toLowerCase();
            $("#listUser li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        }

    });
    $('#delete-step').hide();
    $('#submitors').hide();
    $("#Action_by").change(function () {

    });
    $('#steps-form-detail').hide();
    var processListId = $('#processListId').val();
    if (processListId > 0) {
        $('#ProcessList').val(processListId).change();
        changeProcess(false);
    }
    $("#ProcessList").hide();
    $('#ProcessList').change(function () {
        //changeProcess(true);
    });
    changeProcess(false);
    $('#history-form').hide();
    $('#Image_NG_Attach').change(function () {
        previewFile();
    });
    $('#view-reject').click(function () {
        $('#ActionName').val("Reject");
        if (validateCommentReject()) {
            $('#view-form').submit();
        }
    });
    $('#view-approve').click(function () {
        $('#ActionName').val("Approve");
        if (validateNextStep()) {
            $('#view-form').submit();
        } else {
            $('#error').text("Bạn chưa chọn người thực hiện bước tiếp theo!");
        }
    });
    $("#detail-reject").click(function () {
        $('#ActionName').val("Reject");
        if (validateCommentReject()) {
            $('#detail-form').submit();
        }
    });
    $("#detail-save").click(function () {
        $('#ActionName').val("Approve");
        var isValidateStep = validateNextStep();
        var isSelectedForm = checkSelectedForm();
        if (!isSelectedForm) {
            $('#error').text("Bạn cần chọn loại form!");
            return;
        }
        if (!isValidateStep) {
            $('#error').text("Bạn chưa chọn người thực hiện bước tiếp theo!");
            return;
        }
        $('#error').text("");
        addTableContent();
        $('#detail-form').submit();
    });
    $("#detail-draft").click(function () {
        $('#ActionName').val("Draft");
        addTableContent();
        $('#detail-form').submit();
    });
    $('#action_by').focus(function () {
        $('.list-user').show();
        filterFunction();
    });

    $('.list-user').hide();
    $('.list-group-item .form-check-input').click(function () {
        selectedAction($(this));
    });
    readTableContent();
    if (CKEDITOR.env.ie && CKEDITOR.env.version < 9)
        CKEDITOR.tools.enableHtml5Elements(document);
    if ($('#Image_NG').is('textarea')) {
        addToCKEDITOR('Image_NG');
    }
    if ($('#Confirm_artifact').is('textarea')) {
        addToCKEDITOR('Confirm_artifact');
    }
    if ($('#Point_change').is('textarea')) {
        addToCKEDITOR('Point_change');
    }
    if ($('#Retest').is('textarea')) {
        addToCKEDITOR('Retest');
    }

    if ($('#Confirm_factor').is('textarea')) {
        addToCKEDITOR('Confirm_factor');
    }

    if ($('#Analysis_factor').is('textarea')) {
        addToCKEDITOR('Analysis_factor');
    }
    if ($('#Reason_occur').is('textarea')) {
        addToCKEDITOR('Reason_occur');
    }
    if ($('#Reason_error').is('textarea')) {
        addToCKEDITOR('Reason_error');
    }
    if ($('#Strategy_temp').is('textarea')) {
        addToCKEDITOR('Strategy_temp');
    }
    if ($('#Strategy_longtime').is('textarea')) {
        addToCKEDITOR('Strategy_longtime');
    }
    if ($('#Containment_Action').is('textarea')) {
        addToCKEDITOR('Containment_Action');
    }
    if ($('#Delivery_history').is('textarea')) {
        addToCKEDITOR('Delivery_history');
    }

    if ($('#Cause_occur').is('textarea')) {
        addToCKEDITOR('Cause_occur');
    }

    if ($('#Cause_outflow').is('textarea')) {
        addToCKEDITOR('Cause_outflow');
    }

    if ($('#Temp_measure').is('textarea')) {
        addToCKEDITOR('Temp_measure');
    }

    if ($('#Comment_reject').is('textarea')) {
        addToCKEDITOR('Comment_reject');
    }

    if ($('#Outflow_countermeasure').is('textarea')) {
        addToCKEDITOR('Outflow_countermeasure');
    }

    if ($('#Step_occur').is('textarea')) {
        addToCKEDITOR('Step_occur');
    }

    if ($('#Strategy_follow').is('textarea')) {
        addToCKEDITOR('Strategy_follow');
    }
    if ($('#FileAttach').is('textarea')) {
        addToCKEDITOROnlyImage('FileAttach');
    }
    setInterval("Test()", 1000 * 30); // 30s gửi request một lần

    CKEDITOR.instances.FileAttach.on('change', function (e) {
       $('#FileAttachStr').text($('#FileAttach').text());
    });
    
});

function Test() {
    $.ajax({
        url: "/Home/Test"
    });
}


function BrowseServer() {
    var finder = new CKFinder();
    finder.selectActionFunction = SetFileField;
    finder.popup();
}
function SetFileField(fileUrl) {
    $('#Image_NG').val(fileUrl);
    $("#Image_NG_Preview").attr("src", fileUrl);
    $("#Image_NG_Preview").attr("src", fileUrl);
}
function validateReason_occur() {
    if ($('#Reason_occur').length > 0 && $('#Reason_occur').val().trim() == "") {
        $('span[data-valmsg-for="Reason_occur"]').text('This field is required');
        return false;
    } else {
        $('span[data-valmsg-for="Reason_occur"]').text('');
        return true;
    }
}
function addTableContent() {
    //addStepToStepOccur();
    // addStrategyFollow();
    addResponse();
    addPokayOk();
}
function readTableContent() {
    //  readStepToStepOccur();
    //readStrategyFollow();
    readResponse();
    readPokayOk();
}
function readResponse() {
    var response = $('#Response_occur_place').val();
    if (typeof response !== 'undefined') {
        var splitLineRes = response.split('&');
        if (splitLineRes.length > 0) {
            for (var i = 1; i <= splitLineRes.length; i++) {
                var splitRes = splitLineRes[i - 1].split(';');
                if (splitRes.length > 5) {
                    var x = splitRes[0];
                    $('#res_' + i + '_select').prop('checked', x == '1');
                    $('#res_' + i + '_docname').val(splitRes[1]);
                    $('#res_' + i + '_docno').val(splitRes[2]);
                    $('#res_' + i + '_plan').val(splitRes[3]);
                    $('#res_' + i + '_infact').val(splitRes[4]);
                    $('#res_' + i + '_pic').val(splitRes[5]);
                }

            }
        }
    }

}
function readStrategyFollow() {
    var strategy = $('#Strategy_follow').val();
    if (typeof strategy !== 'undefined') {
        var splitLineStrategy = strategy.split("&");
        if (splitLineStrategy.length > 0) {
            for (var i = 1; i <= splitLineStrategy.length; i++) {
                var line = splitLineStrategy[i - 1];
                var splitStrategy = line.split(";");
                if (splitStrategy.length > 7) {
                    $('#follow_' + i + '_no').val(splitStrategy[0]);
                    $('#follow_' + i + '_content').val(splitStrategy[1]);
                    $('#follow_' + i + '_model').val(splitStrategy[2]);
                    $('#follow_' + i + '_part').val(splitStrategy[3]);
                    $('#follow_' + i + '_plan').val(splitStrategy[4]);
                    $('#follow_' + i + '_infact').val(splitStrategy[5]);
                    $('#follow_' + i + '_doc').val(splitStrategy[6]);
                    $('#follow_' + i + '_pic').val(splitStrategy[7]);
                }
            }
        }
    }

}
function readStepToStepOccur() {
    var step_occur = $('#Step_occur').val();
    if (typeof step_occur !== 'undefined') {
        var splitOccur = step_occur.split(';');
        if (splitOccur.length > 4) {
            for (var i = 1; i < 6; i++) {
                $('#occur_' + i).val(splitOccur[i - 1]);
            }
        }

        var step_error = $('#Step_error').val();
        var splitError = step_error.split(";");
        if (splitError.length > 4) {
            for (var i = 1; i < 6; i++) {
                $('#error_' + i).val(splitError[i - 1]);
            }
        }
    }

}
function readPokayOk() {
    var x = $('#Strategy_IsPokayoke').val();
    var select = x == 1 ? true : false;
    $('#is_pokayoke').prop('checked', select);
}
function addPokayOk() {
    var x = $('#is_pokayoke').is(":checked");
    var select = x == true ? 1 : 0;
    $('#Strategy_IsPokayoke').val(select);
}
function addStepToStepOccur() {
    var step_occur = "";
    for (var i = 1; i < 6; i++) {
        step_occur += $('#occur_' + i).val() + ";";
    }
    $('#Step_occur').val(step_occur);
    var step_error = "";
    for (var i = 1; i < 6; i++) {
        step_error += $('#error_' + i).val() + ";";
    }
    $('#Step_error').val(step_error);
}
function addStrategyFollow() {
    var strategy = "";
    for (var i = 1; i < 6; i++) {
        strategy += $('#follow_' + i + '_no').val() + ';' +
            $('#follow_' + i + '_content').val() + ';' +
            $('#follow_' + i + '_model').val() + ';' +
            $('#follow_' + i + '_part').val() + ';' +
            $('#follow_' + i + '_plan').val() + ';' +
            $('#follow_' + i + '_infact').val() + ';' +
            $('#follow_' + i + '_doc').val() + ';' +
            $('#follow_' + i + '_pic').val() + '&';
    }
    $('#Strategy_follow').val(strategy);
}
function addResponse() {
    var response = "";
    for (var i = 1; i < 9; i++) {
        var x = $('#res_' + i + '_select:checked').is(":checked");
        var select = x == true ? 1 : 0;
        response += select + ';' +
            $('#res_' + i + '_docname').val() + ';' +
            $('#res_' + i + '_docno').val() + ';' +
            $('#res_' + i + '_plan').val() + ';' +
            $('#res_' + i + '_infact').val() + ';' +
            $('#res_' + i + '_pic').val() + '&';
    }
    $('#Response_occur_place').val(response);
}
function addToCKEDITOROnlyImage(id) {
    CKEDITOR.replace(id, {
        htmlEncodeOutput: true,
        toolbarGroups: [{
            "name": "links",
            "groups": ["links"]
        }
        ],
        removeButtons: 'Source,Save,Templates,Cut,Undo,Find,NewPage,Preview,Print,Copy,Paste,PasteText,PasteFromWord,Redo,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,Strike,Subscript,Superscript,RemoveFormat,CopyFormatting,Outdent,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,TextColor,Maximize,BGColor,ShowBlocks,About,HiddenField'
    });

}

function addToCKEDITOR(id) {
    CKEDITOR.replace(id, {
        htmlEncodeOutput: true,
        toolbarGroups: [

            {
                "name": "document",
                "groups": ["basicstyles", "Source"]
            },
            {
                "name": "links",
                "groups": ["links"]
            },
            {
                "name": "paragraph",
                "groups": ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']
            },
            {
                "name": 'colors'
            },
            {
                "name": "insert",
                "groups": ["insert"]
            },
            {
                "name": "styles",
                "groups": ["styles"]
            },
            { "name": 'forms', "groups": ['Checkbox', 'Radio', 'TextField', 'Button'] },
            {
                name: 'maximized',
                groups: [
                    'basicstyles',
                    'tools'
                ]
            },
        ],

        removeButtons: 'ImageButton,Form,HiddenField,Select,Textarea,Save,Templates,Cut, Undo, Find, NewPage, Preview, Print, Copy, Paste, PasteText,PasteFromWord, Redo, Replace, SelectAll, Scayt, Strike, Subscript, Superscript, RemoveFormat,CopyFormatting, Outdent, Indent, Blockquote, CreateDiv, BidiLtr, BidiRtl, Language, Anchor,Flash, HorizontalRule, Smiley, SpecialChar, PageBreak, Iframe, Maximize, ShowBlocks, About, HiddenField'
    });

}
function ShowFormReject() {
    if ($('.form-reject').css('display') == 'none') {
        $('.form-reject').show();
    } else {
        $('.form-reject').hide();
    }

}
function validateCommentReject() {
    var stepToReject = $('#SteptToReject').val();
    if (stepToReject == "") {
        $('#SteptToReject').focus();
        return false;
    }
    var comment = $('#Comment_reject').val();
    if (comment == '') {
        $('#Comment_reject').focus();
        return false;
    }
    return true;
}
function previewFile() {
    var file = $("#Image_NG_Attach").get(0).files[0];
    if (validateExtensionFile()) {
        $('#Error_Image_NG').text('');
    } else {
        $('#Error_Image_NG').text("Bạn cần chọn file đúng định dạng png/jpg/jpeg");
    }
    if (file) {
        var reader = new FileReader();

        reader.onload = function () {
            $("#Image_NG_Preview").attr("src", reader.result);
            $('#Image_NG').val(file.name);
        }

        reader.readAsDataURL(file);
    }
}
function filterFunction() {
    var filter, li;
    filter = $('#action_by').val().toUpperCase();
    div = $('#submitors');
    li = $('#submitors').find("li");
    for (i = 0; i < li.length; i++) {
        txtValue = li[i].textContent || li[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
function validateExtensionFile() {
    var file = $('#Image_NG_Attach')[0].files[0].name;
    var lastIndexDot = file.lastIndexOf('.');
    var extension = file.substr(lastIndexDot + 1, file.length - 1);
    var extensionValidate = ["png", "jpg", "jpeg", "gif"];
    for (i = 0; i < extensionValidate.length; i++) {
        if (extension == extensionValidate[i]) {
            return true;
        }
    }
    return false;
}
function checkSelectedForm() {
    var process = $('#process').val();
    if (process == undefined || process == "") {
        return false;
    } else return true;
}
function validateNextStep() {
    var next_step = $('#next-step').val();
    // trường hợp tạo mới
    if (next_step == undefined) {
        next_step = 2;
    }
    var process = $('#process').val();
    var processList = process.split(',');

    for (i = 0; i < processList.length; i++) {
        var bracketOpen = processList[i].indexOf('(');
        var bracketClose = processList[i].indexOf(')');
        var processId = processList[i].substr(0, bracketOpen);
        if (processId == next_step) {
            if (i + 1 <= processList.length - 1) {
                bracketOpen = processList[i + 1].indexOf('(');
                bracketClose = processList[i + 1].indexOf(')');
                if (bracketOpen + 1 < bracketClose - 2) {
                    return true;
                }
            } else {
                return true;
            }
            break;
        }
    }
    return false;
}
function changeProcess(isResetProcess) {
    $('.steps-row').html("");
    //var process = $('#ProcessList option:selected').attr('name'); 
    //var processId = $('#ProcessList option:selected').val();
    var process = "1(),2(),3(),4(),5(),6()";
    var processId = "1";
    if (process == "") {
        return;
    }
    var processDb = $('#process').val();
    if (processDb == "" || isResetProcess) {
        $('#process').val(process);
    }
    process = $('#process').val();
    $('#processListId').val(processId);
    if (processId == "") {
        $('#steps-form-detail').hide();
        return;
    }
    $('#steps-form-detail').show();
    var status_approval = $('#Status_approval').val();
    var color = "btn-primary";

    var processList = process.split(',');
    var indexStatusApproval = 0;
    for (i = 0; i < processList.length; i++) {
        var bracketOpen = processList[i].indexOf('(');
        var bracketClose = processList[i].indexOf(')');
        var step_id = processList[i].substr(0, bracketOpen);
        var actionBy = processList[i].substr(bracketOpen + 1, bracketClose - 2);
        var hiddenId = '.' + step_id;
        var step_name = $(hiddenId).val();
        var html = "";
        if (status_approval != null && step_id == status_approval) {
            indexStatusApproval = i;
        }
        if (status_approval != null && step_id <= status_approval || i == indexStatusApproval + 1) {
            color = "btn-success";
        } else {
            color = "btn-primary";
        }

        var actionBySplit = actionBy.split(';');
        actionBy = "";
        $.each(actionBySplit, function (index, value) {
            if (value != "")
                actionBy += "\r\n" + $("input[name='" + value + "']").data('text');
        });
        if (i == 0) {

            html = '<div id = "step-' + step_id + '"class="steps-step" style = "display:none">' +
                '<a data-toggle="tooltip" title="' + actionBy + '" href = "#/" type = "button" class="btn ' + color + ' text-white btn-circle">' + i + '</a>' +
                '<pre id = "p-' + step_id + '">' + step_name + '  ' + actionBy + ' </pre>' +
                '</div >';
        } else {
            html = '<div id = "step-' + step_id + '"class="steps-step">' +
                '<a data-toggle="tooltip" title="' + actionBy + '" onclick ="return clickStep(' + step_id + ')" href = "#/" type = "button" class="btn ' + color + ' text-white btn-circle">' + i + '</a>' +
                '<pre id = "p-' + step_id + '">' + step_name + '  ' + actionBy + ' </pre>' +
                '</div >';
        }

        $('.steps-row').append(html)
    }
}

function clickStep(step_id) {
    step_selected_id = step_id;
    if (step_id != 1 && step_id != 2) {
        $("#submitors").fadeOut(1);
        $("#submitors").fadeIn();
        $('#action_by').val('');
        var process = $('#process').val();
        var processList = process.split(',');
        $('#listUser .form-check-input').prop('checked', false);
        for (i = 0; i < processList.length; i++) {
            var currentProcess = processList[i];
            var bracketOpen = currentProcess.indexOf('(');
            var processId = currentProcess.substr(0, bracketOpen);
            if (step_id == processId) {
                $('#btn-step-' + processId).addClass('active');
            } else {
                $('#btn-step-' + processId).removeClass('active');
            }
        }
        for (i = 2; i < processList.length; i++) {
            var currentProcess = processList[i];
            var bracketOpen = currentProcess.indexOf('(');
            var bracketClose = currentProcess.indexOf(')');
            var processId = currentProcess.substr(0, bracketOpen);
            if (bracketOpen + 1 < bracketClose - 2) {
                var actionBy = currentProcess.substr(bracketOpen + 1, bracketClose - 2);
                if (actionBy != undefined && actionBy != "" && step_id == processId) {
                    var personSelected = actionBy.split(';');
                    $.each(personSelected, function (index, value) {
                        $("input[name='" + value + "']").each(function () {
                            $(this).prop('checked', true);
                        });
                    });

                    break;
                }
            }
        }
      
        var previousProcess = "";
        var next_step = $('#next-step').val();
        // ko phải trường hợp tạo mới thì check để disabled các step đã được xác nhận rồi
        if (next_step != undefined) {
            for (i = 0; i < processList.length; i++) {
                var next_step = $('#next-step').val();
                var bracketOpen = processList[i].indexOf('(');
                var processId = processList[i].substr(0, bracketOpen);
                previousProcess += processId;
                if (processId == next_step) {
                    break;
                }
            }
        }

        for (i = 2; i < processList.length; i++) {
            var currentProcess = processList[i];
            var bracketOpen = currentProcess.indexOf('(');
            var bracketClose = currentProcess.indexOf(')');
            var processId = currentProcess.substr(0, bracketOpen);
            if (bracketOpen + 1 < bracketClose - 2) {
                var actionBy = currentProcess.substr(bracketOpen + 1, bracketClose - 2);
                if (actionBy != undefined && actionBy != "" && step_id == processId) {
                    if (previousProcess.includes(step_id)) {
                        $('input[type=checkbox]').attr('disabled', 'disabled');
                    } else {
                        $('input[type=checkbox]').removeAttr('disabled');
                    }
                    break;
                } else {
                    $('input[type=checkbox]').removeAttr('disabled');
                }
            }
        }

    } else {
        $("#submitors").fadeOut(1);
    }
}
function selectedAction(element) {
    var action_displayname = element.data('text');
    $('#action_by').val(action_displayname);
    var action_by = element.attr('name');
    var process = $('#process').val();
    var processList = process.split(',');
    var temp = "1(),2()";
    for (i = 2; i < processList.length; i++) {
        var currentProcess = processList[i];
        var indexOfbracket = currentProcess.indexOf('(');
        var indexOfCloseBracket = currentProcess.indexOf(')');
        var personSelected = "";
        try {
            personSelected = currentProcess.substr(indexOfbracket + 1, indexOfCloseBracket - 2);
        } catch {
            personSelected = "";
        }

        var processId = currentProcess.substr(0, indexOfbracket);
        temp = temp.concat(',');
        if (step_selected_id == processId) {
            if (element.is(':checked')) {
                if (personSelected != "") {
                    action_by = personSelected + ";" + action_by;
                }
            } else {
                var splitPersonSelected = personSelected.split(';');
                splitPersonSelected.splice(splitPersonSelected.indexOf(action_by), 1);
                action_by = "";
                $.each(splitPersonSelected, function (index, value) {
                    if (value != "")
                        action_by += value + ";";
                });

            }
            temp = temp.concat(step_selected_id + "(" + action_by + ")");
            var text = $('#p-' + step_selected_id).text();
            var lastTextIndex = text.indexOf(' ');
            if (lastTextIndex > 0) {
                text = text.substr(0, lastTextIndex + 1);
            }
            var actionBySplit = action_by.split(';');
            action_by = "";
            $.each(actionBySplit, function (index, value) {
                if (value != "")
                    action_by += "\r\n" + $("input[name='" + value + "']").data('text');
            });
            $('#p-' + step_selected_id).text(text + " " + action_by);
        } else {
            temp = temp.concat(currentProcess);
        }
    }
    $('#process').val(temp);
    $('.list-user').hide();
}
function resize() {
    //define the width to resize e.g 600px
    var resize_width = 600;//without px

    //get the image selected
    var item = $('#Image_NG_Attach').get(0).files[0];

    //create a FileReader
    var reader = new FileReader();

    reader.readAsDataURL(item);
    reader.name = item.name;

    reader.size = item.size;
    reader.onload = function (event) {
        var img = new Image();
        img.src = event.target.result;
        img.name = event.target.name;
        img.size = event.target.size;
        img.onload = function (el) {
            var elem = document.createElement('canvas');

            //scale the image to 600 (width) and keep aspect ratio
            var scaleFactor = resize_width / el.target.width;
            elem.width = resize_width;
            elem.height = el.target.height * scaleFactor;

            //draw in canvas
            var ctx = elem.getContext('2d');
            ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

            //get the base64-encoded Data URI from the resize image
            var srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);

            //assign it to thumb src
            document.querySelector('#Image_NG_Preview').src = srcEncoded;

            /*Now you can send "srcEncoded" to the server and
            convert it to a png o jpg. Also can send
            "el.target.name" that is the file's name.*/
            $('#Image_NG').val(srcEncoded);
            // $('#Image_NG_Attach') = srcEncoded;
        }
    }
}