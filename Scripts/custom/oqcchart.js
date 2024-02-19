function setFilterDateWhenChange() {
    $('#filter_date_from').val(moment().startOf('month').format('yyyy-MM-DD'));
    $('#filter_date_to').val(moment($('#filter_date_from').val()).endOf('month').format('yyyy-MM-DD'));
}

var area = '';
var response = {

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

    $('.area').click(function () {
        $('.area').each(function () {
            $(this).removeClass('bg-secondary1');
            $(this).removeClass('text-white');
        });
        oqc = []
        $('.oqc-process').each(function () {
            $(this).addClass('bg-secondary1');
            $(this).addClass('text-black');
            oqc.push($(this).text())
        });
        $(this).addClass('bg-secondary1');
        $(this).addClass('text-black');
        area = $(this).text();
        loadData();
    });

    $('#check_day').click(function () {
        checkShift();
    })
    $('#check_night').click(function () {
        checkShift();
    })

    loadData();

});
function checkShift() {
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
    var shift = ""
    if (!$('#check_day').prop('checked') && $('#check_night').prop('checked')) {
        shift = 'Night'
    } else if ($('#check_day').prop('checked') && !$('#check_night').prop('checked')) {
        shift = 'Day'
    }
    $.ajax({
        url: "/OQC/LoadDailyPerformance",
        data: { 
            area: area,
            startDate: $('#filter_date_from').val(),
            endDate: $('#filter_date_to').val(),
            oqcProcess: station.toString(),
            shift: shift
        },
        success: function (response) {
            settingChartDailyPerformance(response.dailyTotal)
        },
        error: function (e) {
            console.log(e);
        }
    });

}
function loadData() {
    $('.loading').show();
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
    $('#btn_filter').prop('disabled', true)
    $.ajax({
        url: "/OQC/LoadData",
        data: {
            area: area,
            startDate: $('#filter_date_from').val(),
            endDate: $('#filter_date_to').val(),
            oqcProcess: station.toString()
        },
        success: function (response) {
            settingChartDayNight(response.dayPerformance, response.nightPerformance)
            settingChartDailyPerformance(response.dailyTotal)
            settingChartFailRate(response.totalByFail)
            settingChartWo(response.woTotal, response.woNG, response.listCustomer)
            settingWeekly(response.listWeek, response.listCustomer)
            settingManPower(response.listByArea)
            $('.loading').hide();
            $('#btn_filter').prop('disabled', false)
        },
        error: function (e) {
            console.log(e);
            $('.loading').hide()
            $('#btn_filter').prop('disabled', false)
        }
    });

}
function comparePPM(a, b) {
    var nameA = a.ppm
    var nameB = b.ppm

    if (nameA > nameB) {
        return -1;
    }
    if (nameA < nameB) {
        return 1;
    }

    return 0;
}


function settingChartDayNight(dayPerformance, nightPerformance) {
    $('#daynight').empty();
    var PPMDay = CaclPPM(dayPerformance.TotalCheck, dayPerformance.TotalNG)
    var PPMNight = CaclPPM(nightPerformance.TotalCheck, nightPerformance.TotalNG)
    var PPMTotal = CaclPPM(nightPerformance.TotalCheck + dayPerformance.TotalCheck, nightPerformance.TotalNG + dayPerformance.TotalNG)
    var row = $('<tr/>', {

    });
    var col1 = $('<td/>', {
        text: "INSPECT",
        class: "text-uppercase"
    });
    var col2 = $('<td/>', {
        text: addCommas(dayPerformance.TotalCheck)
    });
    var col3 = $('<td/>', {
        text: addCommas(nightPerformance.TotalCheck)
    });
    var col4 = $('<td/>', {
        text: addCommas(dayPerformance.TotalCheck + nightPerformance.TotalCheck)
    });

    row.append(col1);
    row.append(col2);
    row.append(col3);
    row.append(col4);

    $('#daynight').append(row)

    var rowNG = $('<tr/>', {

    });
    var col1NG = $('<td/>', {
        text: "NG",
        class: "text-uppercase"
    });
    var col2NG = $('<td/>', {
        text: addCommas(dayPerformance.TotalNG)
    });
    var col3NG = $('<td/>', {
        text: addCommas(nightPerformance.TotalNG)
    });
    var col4NG = $('<td/>', {
        text: addCommas(dayPerformance.TotalNG + nightPerformance.TotalNG)
    });

    rowNG.append(col1NG);
    rowNG.append(col2NG);
    rowNG.append(col3NG);
    rowNG.append(col4NG);

    $('#daynight').append(rowNG)

    var rowPPM = $('<tr/>', {

    });
    var col1PPM = $('<td/>', {
        text: "DETECTION",
        class: "text-uppercase"
    });
    var col2PPM = $('<td/>', {
        text: addCommas(PPMDay)
    });
    var col3PPM = $('<td/>', {
        text: addCommas(PPMNight)
    });
    var col4PPM = $('<td/>', {
        text: addCommas(PPMTotal)
    });

    rowPPM.append(col1PPM);
    rowPPM.append(col2PPM);
    rowPPM.append(col3PPM);
    rowPPM.append(col4PPM);

    $('#daynight').append(rowPPM)

    CanvasJS.addColorSet("color",
        [
            "#4e94d4",
            "#f67c28",
        ]);
    var chartDayNight = new CanvasJS.Chart("chartDayNight", {
        colorSet: "color",
        animationEnabled: true,
        theme: "dark1",
        title: {
            text: ""
        },
        axisY: {
            interval: 10,
            suffix: "%"
        },
        toolTip: {
            shared: true
        },
        legend: {
            horizontalAlign: "left", // "center" , "right"
            verticalAlign: "center",  // "top" , "bottom"
            fontSize: 12
        },
        data: [{
            type: "stackedBar100",
            toolTipContent: "{label}<br><b>{name}:</b> {y} (#percent%)",
            showInLegend: true,
            name: "Day",
            dataPoints: [
                { y: dayPerformance.TotalCheck, label: "INSPECT" },
                { y: dayPerformance.TotalNG, label: "NG" },
                { y: PPMDay, label: "DETECTION" },

            ]
        },
        {
            type: "stackedBar100",
            toolTipContent: "<b>{name}:</b> {y} (#percent%)",
            showInLegend: true,
            name: "Night",
            dataPoints: [
                { y: nightPerformance.TotalCheck, label: "INSPECT" },
                { y: nightPerformance.TotalNG, label: "NG" },
                { y: PPMNight, label: "DETECTION" }
            ]
        }]
    });
    chartDayNight.render();
}
function settingChartWo(woTotals, woNGs, listCustomer) {
    $('#woPerformance').empty();
    var grandTotalCheck = 0
    var grandTotalNG = 0
    var dataWoCheck = []
    var dataWoNG = []
    var dataWoDefection = []
    $.each(listCustomer, function (index, customer) {
        var TotalCheck = 0
        var TotalNG = 0
        var Ratio = 0
        var woCheck = woTotals.find(m => m.Customer == customer)
        if (woCheck != null) TotalCheck = woCheck.TotalCheck
        var woNG = woNGs.find(m => m.Customer == customer)
        if (woNG != null) TotalNG = woNG.TotalCheck
        Ratio = TotalCheck == 0 ? 0 : Math.round((TotalNG * 100 / TotalCheck) * 100) / 100
        grandTotalCheck += TotalCheck
        grandTotalNG += TotalNG
        dataWoCheck.push({
            label: customer,
            y: TotalCheck
        })
        dataWoNG.push({
            label: customer,
            y: TotalNG
        })
        dataWoDefection.push({
            label: customer,
            y: Ratio
        })
        var row = $('<tr/>', {

        });
        var col1 = $('<td/>', {
            text: customer,
            class: "text-uppercase"
        });
        var col2 = $('<td/>', {
            text: addCommas(TotalCheck)
        });
        var col3 = $('<td/>', {
            text: addCommas(TotalNG)
        });
        var col4 = $('<td/>', {
            text: Ratio
        });
        row.append(col1);
        row.append(col2);
        row.append(col3);
        row.append(col4);

        $('#woPerformance').append(row)
    });
    var row = $('<tr/>', {

    });
    var col1 = $('<td/>', {
        text: "Grand Total",
        class: "text-uppercase font-weight-bold"
    });
    var col2 = $('<td/>', {
        text: addCommas(grandTotalCheck),
        class: " font-weight-bold"
    });
    var col3 = $('<td/>', {
        text: addCommas(grandTotalNG),
        class: " font-weight-bold"
    });
    var col4 = $('<td/>', {
        text: grandTotalCheck == 0 ? 0 : Math.round((grandTotalNG * 100 / grandTotalCheck) * 100) / 100,
        class: " font-weight-bold"
    });

    row.append(col1);
    row.append(col2);
    row.append(col3);
    row.append(col4);

    $('#woPerformance').append(row)
    CanvasJS.addColorSet("color",
        [
            "#4e94d4",
            "#ff0000",
            "#9e9e9e",
        ]);

    var options = {
        animationEnabled: true,
        colorSet: "color",
        title: {
            text: "",
            fontSize: 12,
        },
        legend: {
            horizontalAlign: "center", // "center" , "right"
            verticalAlign: "bottom",  // "top" , "bottom"
            fontSize: 12
        },
        axisX: {
            labelFontSize: 10
        },
        axisY: {
            titleFontColor: "#01579b",
            titleFontSize: 12,
            labelFontColor: "#01579b",
            labelFontSize: 10,
            labelFontColor: "#111",
            title: "Tổng số WO check"

        },
        axisY2: [{
            titleFontColor: "#b71c1c",
            labelFontColor: "#b71c1c",
            titleFontSize: 12,
            labelFontSize: 12,
            labelFontColor: "#111",
            maximum: grandTotalNG > 100 ? grandTotalNG : 100,
        }],
        data: [

            {
                showInLegend: true,
                name: "Tổng số WO Check",
                dataPoints: dataWoCheck,
                indexLabel: "{y}",
                indexLabelFontSize: 10,
                type: "column",
                indexLabelPlacement: "outside",
                indexLabelOrientation: "horizontal",
            },
            {
                type: "stackedColumn",
                name: "Số WO NG",
                showInLegend: true,
                dataPoints: dataWoNG,
                axisYType: "secondary",


            },
            {
                type: "line",
                showInLegend: true,
                name: "Tỷ lệ WO NG(%)",
                dataPoints: dataWoDefection,
                axisYType: "secondary",
                indexLabel: "{y}",
                indexLabelFontSize: 10,
                indexLabelFontColor: "black",
                indexLabelBackgroundColor: "#fff8e1",
                indexLabelFontWeight: "bold",
            }]
    };
    new CanvasJS.Chart("chartWO", options).render();
}
function settingChartDailyPerformance(dailyTotal) {
    $('#daily').empty();
    var grandTotalCheck = 0
    var grandTotalNG = 0
    var dataDailyTotalCheck = []
    var dataDailyTotalNG = []
    var dataDailyPPM = []
    $.each(dailyTotal, function (index, value) {
        grandTotalCheck += value.TotalCheck
        grandTotalNG += value.TotalNG
        var ppm = value.TotalCheck == 0 ? 0 : Math.round(value.TotalNG * 1000000 / value.TotalCheck * 100) / 100
        dataDailyTotalCheck.push({
            label: value.Customer,
            y: value.TotalCheck
        })
        dataDailyTotalNG.push({
            label: value.Customer,
            y: value.TotalNG
        })
        dataDailyPPM.push({
            label: value.Customer,
            y: ppm
        })
        var row = $('<tr/>', {

        });
        var col1 = $('<td/>', {
            text: value.Customer,
            class: "text-uppercase"
        });
        var col2 = $('<td/>', {
            text: addCommas(value.TotalCheck)
        });
        var col3 = $('<td/>', {
            text: addCommas(value.TotalNG)
        });
        var col4 = $('<td/>', {
            text: ppm
        });
        row.append(col1);
        row.append(col2);
        row.append(col3);
        row.append(col4);

        $('#daily').append(row)
    });
    var row = $('<tr/>', {

    });
    var col1 = $('<td/>', {
        text: "Grand Total",
        class: "text-uppercase font-weight-bold"
    });
    var col2 = $('<td/>', {
        text: addCommas(grandTotalCheck),
        class: " font-weight-bold"
    });
    var col3 = $('<td/>', {
        text: addCommas(grandTotalNG),
        class: " font-weight-bold"
    });
    var col4 = $('<td/>', {
        text: grandTotalCheck == 0 ? 0 : Math.round(grandTotalNG * 1000000 / grandTotalCheck * 100) / 100,
        class: " font-weight-bold"
    });

    row.append(col1);
    row.append(col2);
    row.append(col3);
    row.append(col4);

    $('#daily').append(row)
    CanvasJS.addColorSet("color",
        [
            "#4e94d4",
            "#ff0000",

            "#9e9e9e",
        ]);
    var maxNG = Math.max.apply(Math, dataDailyTotalNG.map(function (o) { return o.y; }))
    var maxPPM = Math.max.apply(Math, dataDailyPPM.map(function (o) { return o.y; }))
    if (maxPPM > maxNG) {
        maxNG = maxPPM;
    }
    var options = {
        animationEnabled: true,
        colorSet: "color",
        title: {
            text: "",
            fontSize: 12,
        },
        legend: {
            horizontalAlign: "center", // "center" , "right"
            verticalAlign: "bottom",  // "top" , "bottom"
            fontSize: 12
        },
        axisX: {
            labelFontSize: 10,

        },
        axisY: {
            titleFontColor: "#01579b",
            titleFontSize: 14,
            labelFontColor: "#01579b",
            labelFontSize: 10,
            labelFontColor: "#111",
            title: "Số lượng kiểm tra(pcs)",
            minimum: 0
        },
        axisY2: [{
            titleFontColor: "#b71c1c",
            labelFontColor: "#b71c1c",
            titleFontSize: 14,
            labelFontSize: 12,
            labelFontColor: "#111",
            maximum: maxNG * 1.1,
            title: "Số lượng NG"
        }],
        data: [

            {
                showInLegend: true,
                name: "Số lượng kiểm tra(pcs)",
                dataPoints: dataDailyTotalCheck,
                indexLabel: "{y}",
                indexLabelFontSize: 10,
                type: "column",
                indexLabelPlacement: "outside",
                indexLabelOrientation: "horizontal",
            },
            {
                type: "stackedColumn",
                name: "Số lượng NG",
                showInLegend: true,
                dataPoints: dataDailyTotalNG,
                axisYType: "secondary",

            },
            {
                type: "line",
                showInLegend: true,
                name: "Defection(ppm)",
                dataPoints: dataDailyPPM,
                axisYType: "secondary",
                indexLabel: "{y}",
                indexLabelFontSize: 10,
                indexLabelFontColor: "black",
                indexLabelBackgroundColor: "#fff8e1",
                indexLabelFontWeight: "bold",
            }]
    };
    new CanvasJS.Chart("chartDaily", options).render();
}
function settingChartFailRate(totalByFail) {
    $('#fail_rate').empty();
    var TotalNG = 0
    var grandTotalNG = 0
    var dataChartFailRate = []
    $.each(totalByFail, function (index, value) {
        grandTotalNG += value.total
    })
    $.each(totalByFail, function (index, value) {
        TotalNG += value.total
        var ppm = grandTotalNG == 0 ? 0 : Math.round(TotalNG * 100 / grandTotalNG * 100) / 100;
        dataChartFailRate.push({
            label: value.defection,
            y: value.total
        })
        var row = $('<tr/>', {

        });
        var col1 = $('<td/>', {
            text: value.defection,
            class: "text-uppercase"
        });
        var col2 = $('<td/>', {
            text: value.total
        });

        var col3 = $('<td/>', {
            text: ppm
        });

        row.append(col1);
        row.append(col2);
        row.append(col3);

        $('#fail_rate').append(row)
    });
    var row = $('<tr/>', {

    });
    var col1 = $('<td/>', {
        text: "Grand Total",
        class: "text-uppercase font-weight-bold"
    });
    var col2 = $('<td/>', {
        text: grandTotalNG,
        class: "text-uppercase font-weight-bold"
    });


    row.append(col1);
    row.append(col2);

    $('#fail_rate').append(row)

    CanvasJS.addColorSet("colorFailRate",
        [
            "#70ad47",
            "#4472c4",
            "#4472c4"
        ]);

    var chart = new CanvasJS.Chart("chartFailRate", {
        colorSet: "colorFailRate",

        axisY: {
            title: "Số lượng NG",
            tickColor: "#8bc34a",
            labelFontColor: "#8bc34a",
            gridThickness: 0,
            labelFontSize: 10,
            fontSize: 10,
            titleFontSize: 10,
            labelFontColor: "#111"
        },
        axisY2: {
            title: "Cumulative",
            suffix: "%",
            gridThickness: 0,
            tickColor: "#C0504E",
            labelFontColor: "#111",
            labelFontSize: 10,
            titleFontSize: 10,
            minimum: 0
        },
        axisX: {
            labelAngle: -50,
            labelFontSize: 10,
            interval: 1
        },
        data: [{
            type: "column",
            dataPoints: dataChartFailRate
        }]
    });
    chart.render();
    var dps = [];
    var yValue, yTotal = 0, yPercent = 0;

    for (var i = 0; i < chart.data[0].dataPoints.length; i++)
        yTotal += chart.data[0].dataPoints[i].y;

    for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
        yValue = chart.data[0].dataPoints[i].y;
        yPercent += (yValue / yTotal * 100);
        dps.push({ label: chart.data[0].dataPoints[i].label, y: yPercent });
    }
    chart.addTo("data", { type: "line", axisYType: "secondary", yValueFormatString: "0.##\"%\"", indexLabel: "{y}", indexLabelFontColor: "#C24642", dataPoints: dps });
    chart.axisY[0].set("maximum", yTotal, false);
    chart.axisY2[0].set("maximum", 105, false);
    chart.axisY2[0].set("interval", 25);

}
function settingWeekly(listWeek, listCustomer) {
    $('#table_weekly').empty();
    var thead1 = $('<thead/>', {
        class: "bg-primary1 text-white"
    });
    var thead2 = $('<thead/>', {
        class: "bg-primary1 text-white"
    });


    var row1 = $('<tr/>', {
        class: "text-white"
    });
    var th1 = $('<th/>');

    var row2 = $('<tr/>', {
        class: "text-white"
    });
    var th2 = $('<th/>');

    row1.append(th1);
    row2.append(th2);

    $.each(listWeek, function (index, value) {
        var th = $('<th/>', {
            colspan: "3",
            text: value.date
        });
        row1.append(th);

        var thTotal = $('<th/>', {
            text: "Total(pcs)"
        });
        var thNG = $('<th/>', {
            text: "NG(pcs)"
        });
        var thPPM = $('<th/>', {
            text: "PPM"
        });
        row2.append(thTotal);
        row2.append(thNG);
        row2.append(thPPM);

    });
    var th = $('<th/>', {
        colspan: "3",
        text: ""
    });
    row1.append(th);
    var thTotal = $('<th/>', {
        text: "Total Check(pcs)"
    });
    var thNG = $('<th/>', {
        text: "Total NG(pcs)"
    });
    var thPPM = $('<th/>', {
        text: "PPM"
    });
    row2.append(thTotal);
    row2.append(thNG);
    row2.append(thPPM);
    thead1.append(row1);
    thead2.append(row2);
    $('#table_weekly').append(thead1);
    $('#table_weekly').append(thead2);
    var body = $('<tbody />')
    var listTotalByCus = []
    $.each(listCustomer, function (i, cus) {
        var rowCus = $('<tr/>', {
            id: cus,
        });
        var tdCus1 = $('<td/>', {
            text: cus
        })
        rowCus.append(tdCus1)
        body.append(rowCus)
        var totalCheck = 0
        var totalNG = 0
        $.each(listWeek, function (index, value) {
            var customerInfo = value.listByCus.find(obj => obj.Customer == cus);
            if (customerInfo != null) {
                totalCheck += customerInfo.TotalCheck
                totalNG += customerInfo.TotalNG
            }
        })
        listTotalByCus.push({
            Customer: cus,
            TotalCheck: totalCheck,
            TotalNG: totalNG,
            PPM: totalCheck == 0 ? 0 : Math.round((totalNG * 1000000 / totalCheck) * 100) / 100
        })
    })
    $('#table_weekly').append(body);

    $.each(listWeek, function (index, value) {
        $.each(listCustomer, function (i, customer) {
            var customerInfo = value.listByCus.find(obj => obj.Customer == customer);
            if (customerInfo != null) {
                var tdTotalCheck = $('<td />', {
                    text: customerInfo.TotalCheck == 0 ? "-" : addCommas(customerInfo.TotalCheck)
                })
                var tdTotalNG = $('<td />', {
                    text: customerInfo.TotalNG == 0 ? "-" : addCommas(customerInfo.TotalNG)
                })
                var tdPPM = $('<td />', {
                    text: customerInfo.TotalCheck == 0 ? "-" : Math.round((customerInfo.TotalNG * 1000000 / customerInfo.TotalCheck) * 100) / 100
                })

                $('#' + customer).append(tdTotalCheck)
                $('#' + customer).append(tdTotalNG)
                $('#' + customer).append(tdPPM)
            } else {
                var tdTotalCheck = $('<td />', {
                    text: "-"
                })
                var tdTotalNG = $('<td />', {
                    text: "-"
                })
                var tdPPM = $('<td />', {
                    text: "-"
                })

                $('#' + customer).append(tdTotalCheck)
                $('#' + customer).append(tdTotalNG)
                $('#' + customer).append(tdPPM)
            }

        })
    })
    $.each(listTotalByCus, function (index, value) {
        var tdTotalCheck = $('<td />', {
            text: addCommas(value.TotalCheck)
        })
        var tdTotalNG = $('<td />', {
            text: addCommas(value.TotalNG)
        })
        var tdPPM = $('<td />', {
            text: value.PPM
        })

        $('#' + value.Customer).append(tdTotalCheck)
        $('#' + value.Customer).append(tdTotalNG)
        $('#' + value.Customer).append(tdPPM)
    })

    var rowCus = $('<tr/>');
    var tdCus1 = $('<td/>', {
        text: "Grand Total",
        class: "font-weight-bold"
    })
    rowCus.append(tdCus1)
    var grandTotalCheck = 0
    var grandTotalNG = 0
    $.each(listWeek, function (index, value) {
        var TotalCheck = 0;
        var TotalNG = 0;

        $.each(value.listByCus, function (i, v) {
            TotalCheck += v.TotalCheck
            TotalNG += v.TotalNG
        })
        var tdTotalCheck = $('<td />', {
            text: TotalCheck == 0 ? "-" : addCommas(TotalCheck),
            class: "font-weight-bold"
        })
        var tdTotalNG = $('<td />', {
            text: TotalNG == 0 ? "-" : addCommas(TotalNG),
            class: "font-weight-bold"
        })
        var tdPPM = $('<td />', {
            text: TotalCheck == 0 ? "-" : Math.round((TotalNG * 1000000 / TotalCheck) * 100) / 100,
            class: "font-weight-bold"
        })
        rowCus.append(tdTotalCheck)
        rowCus.append(tdTotalNG)
        rowCus.append(tdPPM)
        grandTotalCheck += TotalCheck
        grandTotalNG += TotalNG
    })
    var tdTotalCheck = $('<td />', {
        text: grandTotalCheck == 0 ? "-" : addCommas(grandTotalCheck),
        class: "font-weight-bold"
    })
    var tdTotalNG = $('<td />', {
        text: grandTotalNG == 0 ? "-" : addCommas(grandTotalNG),
        class: "font-weight-bold"
    })
    var tdPPM = $('<td />', {
        text: grandTotalCheck == 0 ? "-" : Math.round((grandTotalNG * 1000000 / grandTotalCheck) * 100) / 100,
        class: "font-weight-bold"
    })
    rowCus.append(tdTotalCheck)
    rowCus.append(tdTotalNG)
    rowCus.append(tdPPM)
    body.append(rowCus)
}
function settingManPower(listByArea) {
    var areas = ["AUTO", "OA", "ID"]
    $('#man_power').empty()
    var grandTotalNG = 0
    var grandTotalCheck = 0
    $.each(areas, function (i, area) {
        var list = listByArea.filter(m => m.Area == area)
        var TotalCheck = 0
        var TotalNG = 0
        $.each(list, function (j, v) {
            TotalCheck += v.TotalCheck
            TotalNG += v.TotalNG
        })
        grandTotalNG += TotalNG
        grandTotalCheck += TotalCheck
        var row1 = $('<div/>', {
            class: "row border text-black font-small font-weight-bold bg-light"
        })
        var col1 = $('<div/>', {
            class: "col border p-2"
        })
        var icon = $('<i/>', {
            class: 'fas fa-chevron-down  icon_' + area,
            text: area
        })
        col1.append(icon)
        row1.append(col1)
        var col2 = $('<div/>', {
            class: "col border p-2",
            text: "TOTAL"
        })
        row1.append(col2)
        var col3 = $('<div/>', {
            class: "col border p-2",
            text: addCommas(TotalCheck)
        })
        row1.append(col3)
        var col4 = $('<div/>', {
            class: "col border p-2",
            text: TotalNG,
            id: "TotalNG_" + area
        })
        row1.append(col4)
        var col5 = $('<div/>', {
            class: "col border p-2",
            text: "%ng",
            id: "Percent_" + area
        })
        row1.append(col5)

        $('#man_power').append(row1)
        $(".icon_" + area).attr("data-toggle", "collapse");
        $(".icon_" + area).attr("data-target", "#" + area);
        var div = $('<div />', {
            class: " text-black collapse font-small",
            id: area
        })

        $.each(list, function (index, value) {
            var row = $('<div/>', {
                class: "row font-weight-normal"
            })
            var col1 = $('<div/>', {
                class: "col border p-2"
            })
            row.append(col1)
            var col2 = $('<div />', {
                class: "col border p-2",
                text: value.Inspeactor
            })
            row.append(col2)
            var col3 = $('<div />', {
                class: "col border p-2",
                text: addCommas(value.TotalCheck)
            })
            row.append(col3)
            var col4 = $('<div />', {
                class: "col border p-2",
                text: value.TotalNG
            })
            row.append(col4)
            var col5 = $('<div />', {
                class: "col border p-2",
                text: TotalNG == 0 ? 0 : Math.round((value.TotalNG * 100 / TotalNG) * 100) / 100 + "%"
            })
            row.append(col5)
            div.append(row)
        })
        $('#man_power').append(div)
    })

    var row = $('<div />', {
        class: "row bg-light font-small font-weight-bold text-black"

    })
    var col1 = $('<div />', {
        class: "col border p-2",
        text: "Grand Total"
    })
    row.append(col1)
    var col2 = $('<div />', {
        class: "col border p-2",
        text: ""
    })
    row.append(col2)
    var col3 = $('<div />', {
        class: "col border p-2",
        text: addCommas(grandTotalCheck)
    })
    row.append(col3)
    var col4 = $('<div />', {
        class: "col border p-2",
        text: addCommas(grandTotalNG)
    })
    row.append(col4)
    var col5 = $('<div />', {
        class: "col border p-2",
        text: "100%"
    })
    row.append(col5)
    $.each(areas, function (index, area) {
        var TotalNG = $("#TotalNG_" + area).text()
        $("#Percent_" + area).text(grandTotalNG == 0 ? 0 : Math.round((TotalNG * 100 / grandTotalNG) * 100) / 100 + "%")
    })
    $('#man_power').append(row)
}