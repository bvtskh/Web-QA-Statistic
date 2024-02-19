
function setFilterDateWhenChange() {
    $('#filter_date_from').val(moment().startOf('month').format('yyyy-MM-DD'));
    $('#filter_date_to').val(moment($('#filter_date_from').val()).endOf('month').format('yyyy-MM-DD'));
}
var chart_view = '';
$(function () {
    setFilterDateWhenChange();
    $('#filter_date_from').change(function () {
        var start = moment($(this).val());
        var end = moment($('#filter_date_to').val());
        if (end < start) {
            alert("Bạn phải chọn thời gian nhỏ hơn end date!");
            return;
        }
    });
    $('#filter_date_to').change(function () {
        var start = moment($('#filter_date_from').val());
        var end = moment($(this).val());
        if (end < start) {
            alert("Bạn phải chọn thời gian lớn hơn start date!");
            return;
        }
    });
    loadData()

    $('input[id^="filter_value_"]').hide();
    $('#filter_value_area').show();
    $('#filter_select').change(function (e) {
        var selected = $(this).find("option:selected").text()
        if (selected == 'Area') {
            $('input[id^="filter_value_"]').hide();
            $('#filter_value_area').show();
        } else if (selected == "Project") {
            $('input[id^="filter_value_"]').hide();
            $('#filter_value_customer').show();
        } else if (selected == "Model") {
            $('input[id^="filter_value_"]').hide();
            $('#filter_value_model').show();
        } else if (selected == "GroupModel") {
            $('input[id^="filter_value_"]').hide();
            $('#filter_value_group').show();
        }
    });
    $('input[id^="filter_value_"]').keyup(function (e) {
        if (e.keyCode == 13) {
            loadData()
        }

    })
    $('#ckbChangeJp').change(function () {
        if (this.checked) {
            $('.def_vi').addClass("d-none")
            $('.def_jp').removeClass("d-none")
        } else {
            $('.def_vi').removeClass("d-none")
            $('.def_jp').addClass("d-none")
        }

    });
    chart_view = 'Ngày'
    $('.chart_view').click(function () {
        $('.chart_view').each(function () {
            $(this).removeClass('bg-secondary1');
        });
        $(this).addClass('bg-secondary1');
        chart_view = $(this).text();
        loadData();
    });

});
function onChangeCheckStation() {
    loadData()
}
function makeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}
function settingChartMtdQuantity(listIncrement, listDefectionByDate, OQC, CSL, maxNG, maxNGTotal, targetPPM) {
    var listActual = []
    var listTarget = []
    var totalCheck = 0
    var totalNG = 0
    $('#thead').empty()
    var row = $('<tr />', {

    })
    var th0 = $('<th />', {
        text: "##",
        class: "text-white",
        style: "width: 1%"

    })
    var th = $('<th />', {
        text: "#############################",
        class: "text-white"


    })
    var th1 = $('<th />', {
        text: "##################",
        class: "text-white"

    })
    row.append(th0)
    row.append(th)
    row.append(th1)

    $('#body').empty()
    $.each(listDefectionByDate, function (index, value) {
        var row = $('<tr />', {

        })
        var textIndex = (index + 1);
        if (index < 9) {
            textIndex = "0" + (index + 1)
        }
        var th0 = $('<th />', {
            class: " text-left pl-1",
            text: textIndex
        })
        row.append(th0)
        var th = $('<th />', {
            class: " text-left pl-2"
        })

        var span = $('<span />', {
            text: value.defection,
            class: 'def_vi d-none'
        })
        var spanJP = $('<span />', {
            text: value.jpDefection,
            class: 'def_jp text-left '
        })
        th.append(span)
        th.append(spanJP)
        row.append(th)
        var th1 = $('<th />', {

        })

        row.append(th1)
        var total = 0;

        $.each(value.list, function (i, v) {
            var ratio = v.totalNG == 0 || maxNG == 0 ? 0 : v.totalNG / maxNG;

            var th2 = $('<td />', {
                text: v.totalNG == 0 ? '-' : v.totalNG,
                style: v.totalNG == 0 ? '' : 'background-color:rgba(255, 111, 0,' + ratio + ')'
            })
            total += v.totalNG
            row.append(th2)
        })
        if (total == 0) {
            th1.text('-')

        } else {
            var ratio = maxNGTotal == 0 ? 0 : parseInt(total) * 100 / maxNGTotal;
            var inTh1 = $('<div />', {
                text: total,
                class: "bg-ng-gradient float-right",
                style: "width:" + ratio + "%; height:100%"
            })
            th1.append(inTh1);
        }

        $('#body').append(row)
    })
    var rowTotal = $('<tr />', {
        class: "bg-dark1 text-white",

    })
    var th = $('<th />', {
        width: "100px",
        colspan: 2,
        class: "text-left pl-2"
    })
    var th1 = $('<th />', {
        width: "50px",
        text: "Total",

    })
    var span = $('<span />', {
        text: "Check Qty(pcs)"
    })
    var br = $('<br />')
    var span1 = $('<span />', {
        text: "NG Qty"
    })
    var br1 = $('<br />')
    var span2 = $('<span />', {
        text: "Fail Rate (PPM)"
    })
    var br2 = $('<br />')
    var span3 = $('<span />', {
        text: "Target"
    })
    var br3 = $('<br />')
    th.append(span)
    th.append(br)
    th.append(span1)
    th.append(br1)
    th.append(span2)
    th.append(br2)
    th.append(span3)
    th.append(br3)
    rowTotal.append(th1)
    rowTotal.append(th)

    var rowReview = $('<tr />', {

    })
    var td11 = $('<td />', {
        text: "Đánh giá",
        class: 'font-weight-bold',
        colspan: 3
    })
    rowReview.append(td11)
    $.each(listIncrement, function (index, value) {
        var actual = {
            label: ConvertDateToShort(value.DateStr,chart_view),
            y: CaclPPMRound(value.TotalCheck, value.TotalNG),
            x: index
        }
        var target1 = {
            label: ConvertDateToShort(value.DateStr,chart_view),
            y: targetPPM,
            x: index
        }
        totalCheck += value.TotalCheck
        totalNG += value.TotalNG
        listActual.push(actual)
        listTarget.push(target1)

        var th1 = $('<th />', {
            text: ConvertDateToShort(value.DateStr,chart_view)
        })
        row.append(th1)

        var th = $('<th />', {
            class: 'bg-white text-black font-weight-normal'
        })
        var span = $('<span />', {
            text: value.TotalCheck == 0 ? '' : addCommas(value.TotalCheck)
        })
        var br = $('<br />')
        var span1 = $('<span />', {
            text: value.TotalNG == 0 ? '' : addCommas(value.TotalNG)
        })
        var br1 = $('<br />')
        var ppm = CaclPPMRound(value.TotalCheck, value.TotalNG)
        var span2 = $('<span />', {
            text: ppm == 0 ? '' : ppm
        })
        var br2 = $('<br />')

        var span3 = $('<span />', {
            text: targetPPM
        })

        var textWhite = chart_view.includes('Tuần') ? '######' : '##'

        var span4 = $('<span />', {
            text: textWhite,
            class: 'text-white'
        })
        var span5 = $('<span />', {
            text: textWhite,
            class: 'text-white'
        })

        var br3 = $('<br />')
        th.append(span)
        th.append(br)
        th.append(span1)
        th.append(br1)
        th.append(span2)
        th.append(br2)
        th.append(span4)
        th.append(span3)
        th.append(span5)
        th.append(br3)
        rowTotal.append(th)

        if (ppm > targetPPM) {
            var thPPM = $('<td />', {
                text: "NG",
                class: 'text-danger',
                style: 'background-color:#fce4ec;'
            })
            rowReview.append(thPPM)
        } else {
            var thPPM = $('<td />', {
                text: "OK",
                class: 'text-success',
                style: 'background-color:#dcedc8;'
            })
            rowReview.append(thPPM)
        }
    })
    $('#thead').append(row)
    $('#totalCheck').text(addCommas(totalCheck))
    $('#totalNG').text(addCommas(totalNG))
    $('#targetPPM').text(targetPPM)
    var ppm = totalCheck == 0 ? 0 : Math.round((totalNG * 1000000 / totalCheck) * 100) / 100;
    $('#actualPPM').text(ppm)
    var actualPercent = Math.round(ppm * 100 / targetPPM);
    $('#actualPercent').text(actualPercent + "%")
    $('#actualDraw').css('width', actualPercent);
    if (ppm > targetPPM) {
        $('#targetBg').css('fill', '#b71c1c')
        $('#targetResult').css('fill', 'white')
        $('#targetResult').text('NG')
    } else {
        $('#targetBg').css('fill', '#c5e1a5')
        $('#targetResult').css('fill', 'green')
        $('#targetResult').text('OK')
    }
    CanvasJS.addColorSet("colorFailRate",
        [
            "#f0ad4e",
            "#0275d8"
        ]);
    var chart = new CanvasJS.Chart("chartMtdQuantity",
        {
            colorSet: "colorFailRate",
            title: {
                text: ""
            },
            xAxis: {
                interval: 1
            },
            axisY: {
                title: "(ppm)",
                tickColor: "#8bc34a",
                labelFontColor: "#8bc34a",
                gridThickness: 0,
                labelFontSize: 10,
                fontSize: 10,
                titleFontSize: 10,
                labelFontColor: "#111"
            },
            data: [
                {
                    type: "line",
                    showInLegend: true,
                    markerType: "circle",
                    legendText: "Target(ppm)",
                    dataPoints: listTarget
                },
                {
                    type: "line",
                    showInLegend: true,
                    markerType: "square",
                    legendText: "Actual",
                    dataPoints: listActual
                }
            ]
        });

    chart.render();
    $('#body').append(rowTotal)


    //CSL
    var rowCSL = $('<tr />', {
        class: "bg-secondary2 text-black",

    })
    var th = $('<th />', {
        width: "100px",
        colspan: 2,
        class: "text-left pl-2"
    })
    var th1 = $('<th />', {
        width: "100px",
        text: "CSL"
    })
    var span = $('<span />', {
        text: "CSL Check(pcs)"
    })
    var br = $('<br />')
    var span1 = $('<span />', {
        text: "CSL NG"
    })
    var br1 = $('<br />')
    var span2 = $('<span />', {
        text: "PPM"
    })
    var br2 = $('<br />')

    th.append(span)
    th.append(br)
    th.append(span1)
    th.append(br1)
    th.append(span2)
    th.append(br2)

    rowCSL.append(th1)
    rowCSL.append(th)
    $.each(CSL.list, function (index, value) {

        var th = $('<th />', {
            class: 'bg-secondary2 text-black font-weight-normal'
        })
        var span = $('<span />', {
            text: value.TotalCheck == 0 ? '' : addCommas(value.TotalCheck)
        })
        var br = $('<br />')
        var span1 = $('<span />', {
            text: value.TotalNG == 0 ? '' : addCommas(value.TotalNG)
        })
        var br1 = $('<br />')
        var span2 = $('<span />', {
            text: value.TotalNG == 0 ? '' : CaclPPMRound(value.TotalCheck, value.TotalNG)
        })
        var br2 = $('<br />')

        th.append(span)
        th.append(br)
        th.append(span1)
        th.append(br1)
        th.append(span2)
        th.append(br2)
        rowCSL.append(th)
    })
    $('#body').append(rowCSL)


    //OQC
    var rowOQC = $('<tr />', {
        class: "bg-secondary2 text-black",

    })
    var th = $('<th />', {
        width: "100px",
        colspan: 2,
        class: "text-left pl-2"
    })
    var th1 = $('<th />', {
        width: "100px",
        text: "OQC"
    })
    var span = $('<span />', {
        text: "OQC Check(pcs)"
    })
    var br = $('<br />')
    var span1 = $('<span />', {
        text: "OQC NG"
    })
    var br1 = $('<br />')
    var span2 = $('<span />', {
        text: "PPM"
    })
    var br2 = $('<br />')

    th.append(span)
    th.append(br)
    th.append(span1)
    th.append(br1)
    th.append(span2)
    th.append(br2)

    rowOQC.append(th1)
    rowOQC.append(th)
    $.each(OQC.list, function (index, value) {

        var th = $('<th />', {
            class: 'bg-secondary2 text-black font-weight-normal'
        })
        var span = $('<span />', {
            text: value.TotalCheck == 0 ? '' : addCommas(value.TotalCheck)
        })
        var br = $('<br />')
        var span1 = $('<span />', {
            text: value.TotalNG == 0 ? '' : addCommas(value.TotalNG)
        })
        var br1 = $('<br />')
        var span2 = $('<span />', {
            text: value.TotalNG == 0 ? '' : CaclPPMRound(value.TotalCheck, value.TotalNG)
        })
        var br2 = $('<br />')

        th.append(span)
        th.append(br)
        th.append(span1)
        th.append(br1)
        th.append(span2)
        th.append(br2)
        rowOQC.append(th)
    })
    $('#body').append(rowOQC)

    // Danh gia


    $('#body').append(rowReview)
}
function loadData() {
    var station = [];
    var oqc1 = $('#check_oqc1').prop('checked');
    var oqc2 = $('#check_oqc2').prop('checked');
    var csl = $('#check_csl').prop('checked');
    if (oqc1 == true) {
        station.push("OQC1")
    }
    if (oqc2 == true) {
        station.push("OQC2")
    }
    if (csl == true) {
        station.push("CSL")
    }
    var selectedFilter = $('#filter_select').find("option:selected").text();
    var selectedValue = "ID";
    if (selectedFilter == 'Area') {
        selectedValue = $('#filter_value_area').val();
    } else if (selectedFilter == "Project") {
        selectedValue = $('#filter_value_customer').val();
    } else if (selectedFilter == "Model") {
        selectedValue = $('#filter_value_model').val();
    } else if (selectedFilter == "GroupModel") {
        selectedValue = $('#filter_value_group').val();
    }

    $('.loading').show()
    $('#btn_filter').prop('disabled', true)
    $.ajax({
        url: "/OQC/LoaDataMTDQuantity",
        data: {
            filter: selectedFilter,
            startDate: $('#filter_date_from').val(),
            endDate: $('#filter_date_to').val(),
            value: selectedValue,
            chart_view: chart_view,
            station: station.toString()
        },
        success: function (response) {
            $('.loading').hide()
            if (response.error) {
                alert(response.error)
            } else
                settingChartMtdQuantity(response.listIncrement, response.listDefectionByDate,
                    response.OQC, response.CSL, response.maxNG, response.maxNGTotal, response.targetPPM)
            $('#btn_filter').prop('disabled', false)
        },
        error: function (e) {
            console.log(e);
            $('.loading').hide()
            $('#btn_filter').prop('disabled', false)
        }
    });

}
