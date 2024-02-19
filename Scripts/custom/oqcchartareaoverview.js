
function setFilterDateWhenChange() {
    $('#filter_date_from').val(moment().startOf('month').format('yyyy-MM-DD'));
    $('#filter_date_to').val(moment($('#filter_date_from').val()).endOf('month').format('yyyy-MM-DD'));
}
function onChangeCheckStation() {
    loadData()
}
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
    oqc = 'OQC'
    $('.oqc-process').click(function () {
        $('.oqc-process').each(function () {
            $(this).removeClass('bg-secondary1');
            $(this).removeClass('text-black');
        });
        $(this).addClass('bg-secondary1');
        $(this).addClass('text-black');
        oqc = $(this).text();
        loadData();
    });
    loadData()

});
function settingChartPerformance(listArea) {
    var list = [];
    $.each(listArea, function (index, value) {
        var item = {
            x: index,
            y: value.TotalCheck,
            label: value.Area
        }
        list.push(item)
    })
    var chart = new CanvasJS.Chart("chartPerformance",
        {
            colorSet: "color",
            title: {
                text: "Performance",
                fontSize: 12
            },
            axisY: {
                title: "Tổng số  Check(pcs)",
                tickColor: "#8bc34a",
                labelFontColor: "#8bc34a",
                gridThickness: 0,
                labelFontSize: 10,
                fontSize: 10,
                titleFontSize: 14,
                labelFontColor: "#111"
            },

            data: [

                {
                    name: "Tổng số Check(pcs)",
                    showInLegend: true,
                    indexLabel: "{y}",
                    indexLabelFontSize: 10,
                    type: "column",
                    //indexLabelPlacement: "outside",
                    indexLabelOrientation: "horizontal",
                    dataPoints: list
                }
            ]
        });

    chart.render();
}
function settingChartFailRate(listArea) {
    CanvasJS.addColorSet("color",
        [
            "#9bc57e",
            "#ffd34c",
            "#677ca0",
            "#8bf595"

        ]);
    var list = [];
    $.each(listArea, function (index, value) {
        var item = {
            y: value.TotalNG,
            indexLabel: value.Area
        }
        list.push(item)
    })
    var chart = new CanvasJS.Chart("chartFailRate",
        {
            colorSet: "color",
            theme: "light2",
            title: {
                text: "Fail Rate",
                fontSize: 12

            },
            data: [
                {
                    type: "pie",
                    showInLegend: true,
                    toolTipContent: "{y} NG - #percent %",
                    legendText: "{indexLabel}",
                    dataPoints: list
                }
            ]
        });
    chart.render();

}
function settingAreaTable(listArea) {
    $('#area_body').empty();
    var totalCheck = 0;
    var totalNG = 0;
    $.each(listArea, function (index, value) {
        var row = $('<tr />', {

        })
        var col = $('<th />', {
            text: value.Area,
            rowspan: 2
        })
        var col1 = $('<td />', {
            text: CaclPPMRound(value.TotalCheck, value.TotalNG),
            rowspan: 2
        })
        var col2 = $('<td />', {
            text: addCommas(value.TotalCheck) + " pcs"
        })

        var row2 = $('<tr />', {

        })
        var col3 = $('<td />', {
            text: addCommas(value.TotalNG) + " NG"
        })


        row.append(col)
        row.append(col1)
        row.append(col2)
        row2.append(col3)
        $('#area_body').append(row)
        $('#area_body').append(row2)
        totalCheck += value.TotalCheck
        totalNG += value.TotalNG
    });

    var row = $('<tr />', {

    })
    var col = $('<th />', {
        text: "Grand Total",
        class: "font-weight-bold bg-secondary2"
    })
    var col1 = $('<td />', {
        text: CaclPPMRound(totalCheck, totalNG),
        class: "font-weight-bold bg-secondary2"
    })
    var col2 = $('<td />', {
        class: "bg-secondary2"
    })
    var span1 = $('<span />', {
        text: addCommas(totalCheck) + " pcs",
        class: "font-weight-bold"
    })
    var br = $('<br />')
    var span2 = $('<span />', {
        text: addCommas(totalNG) + " NG",
        class: "font-weight-bold "
    })
    col2.append(span1)
    col2.append(br)
    col2.append(span2)
    row.append(col)
    row.append(col1)
    row.append(col2)
    $('#area_body').append(row)
}
function settingIncrementTime(listCustomer, listIncrements) {
    console.log("")
    var listProjectByAreas = []
    var listIncrement = []
    var listAreaByDate = []
    var start = moment($('#filter_date_from').val())
    var end = moment($('#filter_date_to').val())
    for (var date = start; date <= end; date = date.add(1, 'days')) {
        var currentDate = date.format("YYYY-MM-DD")
        var totalCheck = 0
        var totalNG = 0
        var listByDate = listIncrements.filter(m => m.DateStr == currentDate)
        if (listByDate != null) {
            $.each(listByDate, function (i, v) {
                totalCheck += v.TotalCheck
                totalNG += v.TotalNG
            })
        }
        var ppm = CaclPPMRound(totalCheck, totalNG)
        listIncrement.push({
            totalCheck: totalCheck,
            totalNG: totalNG,
            ppm: ppm,
            deviation: 50 - ppm,
            date: date,
            dateStr: date.format('DD')
        })
    }
    $.each(listCustomer, function (index, value) {
        var countCustomer = value.list.length
        var itemArea = {
            area: value.Area,
            list: []
        }
        $.each(value.list, function (i, v) {
            var listByDate = []
            var start = moment($('#filter_date_from').val())
            var end = moment($('#filter_date_to').val())

            for (var date = start; date <= end; date = date.add(1, 'days')) {
                var currentDate = date.format("YYYY-MM-DD")
                if (i == 0) {
                    var currentAreaByDates = listIncrements.filter(m => m.DateStr == currentDate && m.Area == value.Area)
                    var totalCheck = 0
                    var totalNG = 0
                    $.each(currentAreaByDates, function (i1, v1) {
                        totalCheck += v1.TotalCheck
                        totalNG += v1.TotalNG
                    })
                    itemArea.list.push({
                        totalCheck: totalCheck,
                        totalNG: totalNG,
                        dateIndex: date.format('DD'),
                        ppm: CaclPPMRound(totalCheck, totalNG)
                    })

                }
                var currentProjectByDate = listIncrements.find(m => m.DateStr == currentDate && m.Customer == v.Customer)
                var item = {}
                if (currentProjectByDate != null) {
                    item = {
                        totalCheck: currentProjectByDate.TotalCheck,
                        totalNG: currentProjectByDate.TotalNG,
                        dateIndex: date.format('DD'),
                        ppm: CaclPPMRound(currentProjectByDate.TotalCheck, currentProjectByDate.TotalNG)
                    }
                } else {
                    item = {
                        totalCheck: 0,
                        totalNG: 0,
                        dateIndex: date.format('DD'),
                        ppm: 0
                    }

                }
                item.deviation = 50 - item.ppm
                listByDate.push(item)
            }
            var area = {
                area: value.Area,
                countCustomer: countCustomer,
                customer: v.Customer,
                type: "Check",
                list: listByDate
            }
            var areaNG = {
                area: value.Area,
                countCustomer: countCustomer,
                customer: v.Customer,
                type: "NG",
                list: listByDate
            }
            listProjectByAreas.push(area)
            listProjectByAreas.push(areaNG)
        })
        listAreaByDate.push(itemArea)
    })

    $('#list_date').empty();
    $('#body').empty();
    var th1 = $('<th />', {
        width: "50px",
    })
    var th2 = $('<th />', {
        width: "50px",
    })
    var th3 = $('<th />', {
        width: "50px",
        text: "Ngày"
    })
    $('#list_date').append(th3)
    $('#list_date').append(th1)
    $('#list_date').append(th2)

    var row = $('<tr />')
    var th = $('<th />', {
        text: "Incremental TimeLine",
        colspan: 2
    })
    row.append(th)
    var td = $('<td />')
    var span = $('<span />', {
        text: "Check(pcs)"
    })
    var br = $('<br />')
    var span1 = $('<span />', {
        text: "NG"
    })
    var br1 = $('<br />')
    var span2 = $('<span />', {
        text: "PPM"
    })
    var br2 = $('<br />')
    var span3 = $('<span />', {
        text: "Deviation"
    })
    var br3 = $('<br />')
    td.append(span)
    td.append(br)
    td.append(span1)
    td.append(br1)
    td.append(span2)
    td.append(br2)
    td.append(span3)
    td.append(br3)
    row.append(td)
    var totalCheck = 0
    var totalNG = 0
    $.each(listIncrement, function (index, value) {
        var th3 = $('<th />', {
            width: "50px",
            text: value.dateStr
        })
        var td = $('<td />')
        var span = $('<span />', {
            text: value.totalCheck == 0 ? "-" : addCommas(value.totalCheck)
        })

        var br = $('<br />')
        var span1 = $('<span />', {
            text: value.totalNG == 0 ? "-" : addCommas(value.totalNG)
        })
        var br1 = $('<br />')
        var span2 = $('<span />', {
            text: value.ppm == 0 ? "-" : value.ppm
        })
        var br2 = $('<br />')
        var span3 = $('<span />', {
            text: value.deviation
        })
        var br3 = $('<br />')
        td.append(span)
        td.append(br)
        td.append(span1)
        td.append(br1)
        td.append(span2)
        td.append(br2)
        td.append(span3)
        td.append(br3)
        row.append(td)
        totalCheck += value.totalCheck
        totalNG += value.totalNG
        $('#list_date').append(th3)
    })
    var ppm = totalCheck == 0 ? 0 : Math.round(totalNG * 1000000 / totalCheck)
    var deviation = 50 - ppm
    var td = $('<td />')
    var span = $('<span />', {
        text: totalCheck == 0 ? "-" : addCommas(totalCheck)
    })

    var br = $('<br />')
    var span1 = $('<span />', {
        text: totalNG == 0 ? "-" : addCommas(totalNG)
    })
    var br1 = $('<br />')
    var span2 = $('<span />', {
        text: ppm == 0 ? "-" : ppm
    })
    var br2 = $('<br />')
    var span3 = $('<span />', {
        text: deviation
    })
    var br3 = $('<br />')
    td.append(span)
    td.append(br)
    td.append(span1)
    td.append(br1)
    td.append(span2)
    td.append(br2)
    td.append(span3)
    td.append(br3)
    row.append(td)
    var th3 = $('<th />', {
        width: "50px",
        text: "Total"
    })
    $('#list_date').append(th3)
    $('#body').append(row)
    var row1 = $('<tr />', {
        colspan: 2,
        text: "PROJECT",
        class: "font-weight-bold p-2"
    })
    $('#body').append(row1)

    var oldArea = '';
    var oldCus = '';

    $.each(listProjectByAreas, function (index, value) {
        var row = $('<tr />', {

        })
        if (oldArea != value.area) {
            var td = $('<td />', {
                text: value.area,
                class: 'font-weight-bold',
                rowspan: value.countCustomer * 2,
                style: 'vertical-align : middle;text-align:center'
            })
            oldArea = value.area;
            oldCus = ''
        }
        if (oldCus != value.customer) {
            var td1 = $('<td />', {
                text: value.customer,
                rowspan: 2
            })
            oldCus = value.customer
        }

        var td2 = $('<td />', {
            text: value.type == 'Check' ? 'Check(pcs)' : 'NG',
            class: value.type == 'Check' ? 'bg-light1' : 'bg-ng'
        })
        row.append(td)
        row.append(td1)
        row.append(td2)
        var totalCheck = 0
        var totalNG = 0
        $.each(value.list, function (index, v) {

            if (value.type == 'Check') {
                var td3 = $('<td />', {
                    class: "bg-light1"
                })
                var span3 = $('<span />', {
                    text: v.totalCheck == 0 ? '-' : addCommas(v.totalCheck)
                })
                td3.append(span3)
                totalCheck += v.totalCheck
            }
            if (value.type == 'NG') {
                var td3 = $('<td />', {

                })
                var span3 = $('<span />', {
                    text: v.totalNG == 0 ? '-' : addCommas(v.totalNG)
                })
                td3.append(span3)
                totalNG += v.totalNG
            }
            row.append(td3)
        })

        if (value.type == 'Check') {
            var td3 = $('<td />', {
                class: "bg-light"
            })
            var span3 = $('<span />', {
                text: totalCheck == 0 ? '-' : addCommas(totalCheck)
            })
            td3.append(span3)
        }
        if (value.type == 'NG') {
            var td3 = $('<td />', {

            })
            var span3 = $('<span />', {
                text: totalNG == 0 ? '-' : addCommas(totalNG)
            })
            td3.append(span3)
        }
        row.append(td3)
        $('#body').append(row)
    })
    var color = [
        "#9bc57e",
        "#ffd34c",
        "#677ca0",
        "#8bf595"]
    $.each(listAreaByDate, function (index, value) {

        var row = $('<tr />', {
            class: 'bg-light'
        })

        var th = $('<th />', {
            text: value.area,
            colspan: 2,

            class: 'font-weight-bold',
            style: 'vertical-align : middle;text-align:center; background-color:' + color[index] + ';'
        })
        row.append(th)
        var td = $('<td />', {
            style: ' background-color:' + color[index] + ';'
        })
        var span1 = $('<span />', {
            text: 'Check(pcs)'
        })
        var br1 = $('<br />')
        var span2 = $('<span />', {
            text: 'NG'
        })
        var br2 = $('<br />')
        var span3 = $('<span />', {
            text: 'PPM'
        })
        td.append(span1)
        td.append(br1)
        td.append(span2)
        td.append(br2)
        td.append(span3)
        row.append(td)
        $.each(value.list, function (i, v) {
            var td = $('<td />', {
                style: ' background-color:' + color[index] + ';'
            })
            var span1 = $('<span />', {
                text: v.totalCheck == 0 ? '-' : addCommas(v.totalCheck)
            })
            var br1 = $('<br />')
            var span2 = $('<span />', {
                text: v.totalNG == 0 ? '-' : addCommas(v.totalNG)
            })
            var br2 = $('<br />')
            var span3 = $('<span />', {
                text: v.ppm == 0 ? '-' : v.ppm
            })
            td.append(span1)
            td.append(br1)
            td.append(span2)
            td.append(br2)
            td.append(span3)
            row.append(td)
        })
        $('#body').append(row)
    })
    var row = $('<tr />', {
        class: "bg-total"
    })
    var th = $('<th />', {
        text: "TOTAL",
        colspan: 2,
        class: 'font-weight-bold',
        style: 'vertical-align : middle;text-align:center'
    })
    row.append(th)
    var td = $('<td />', {
        class: 'font-weight-bold'
    })
    var span1 = $('<span />', {
        text: 'Check(pcs)'
    })
    var br1 = $('<br />')
    var span2 = $('<span />', {
        text: 'NG'
    })
    var br2 = $('<br />')
    var span3 = $('<span />', {
        text: 'PPM'
    })
    td.append(span1)
    td.append(br1)
    td.append(span2)
    td.append(br2)
    td.append(span3)
    row.append(td)
    var totalCheck = 0
    var totalNG = 0
    $.each(listIncrement, function (index, value) {
        var td = $('<td />', {
            class: 'font-weight-bold'
        })
        var span1 = $('<span />', {
            text: value.totalCheck == 0 ? '-' : addCommas(value.totalCheck)
        })
        totalCheck += value.totalCheck
        var br1 = $('<br />')
        var span2 = $('<span />', {
            text: value.totalNG == 0 ? '-' : addCommas(value.totalNG)
        })
        totalNG += value.totalNG
        var br2 = $('<br />')
        var span3 = $('<span />', {
            text: value.ppm == 0 ? '-' : value.ppm
        })
        td.append(span1)
        td.append(br1)
        td.append(span2)
        td.append(br2)
        td.append(span3)
        row.append(td)
    })
    var ppm = 0;
    if (totalCheck != 0)
        ppm = Math.round(totalNG * 1000000 / totalCheck)
    var td = $('<td />', {
        class: 'font-weight-bold'
    })
    var span1 = $('<span />', {
        text: totalCheck == 0 ? '-' : addCommas(totalCheck)
    })
    totalCheck += totalCheck
    var br1 = $('<br />')
    var span2 = $('<span />', {
        text: totalNG == 0 ? '-' : addCommas(totalNG)
    })
    var br2 = $('<br />')
    var span3 = $('<span />', {
        text: ppm == 0 ? '-' : ppm
    })
    td.append(span1)
    td.append(br1)
    td.append(span2)
    td.append(br2)
    td.append(span3)
    row.append(td)
    $('#body').append(row)
}
function loadData() {
    $('.loading').show()
    $('#btn_filter').prop('disabled', true)
    var station = []
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
    $.ajax({
        url: "/OQC/LoadDataAeaOverview",
        data: {
            startDate: $('#filter_date_from').val(),
            endDate: $('#filter_date_to').val(),
            oqcProcess: station.toString()
        },
        success: function (response) {
            settingAreaTable(response.listArea)
            settingChartFailRate(response.listArea)
            settingChartPerformance(response.listArea)
            settingIncrementTime(response.listCustomer, response.listIncrements)
            $('.loading').hide()
            $('#btn_filter').prop('disabled', false)
        },
        error: function (e) {
            console.log(e);
            $('.loading').hide()
            $('#btn_filter').prop('disabled', false)
        }
    });

}
