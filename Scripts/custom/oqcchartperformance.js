
function setFilterDateWhenChange() {
    $('#filter_date_from').val(moment().startOf('month').format('yyyy-MM-DD'));
    $('#filter_date_to').val(moment($('#filter_date_from').val()).endOf('month').format('yyyy-MM-DD'));
}
var chart_view = '';

var CUSTOMER_COLOR = [
    {
        customer: "TOYODENSO",
        color: "#ef9a9a"
    },
    {
        customer: "NICHICON",
        color: "#ce93d8"
    },
    {
        customer: "KYOCERA",
        color: "#9fa8da"
    },
    {
        customer: "VALEO",
        color: "#81d4fa"
    },
    {
        customer: "YOKOWO",
        color: "#80cbc4"
    },
    {
        customer: "FORMLABS",
        color: "#c5e1a5"
    },
    {
        customer: "STANLEY",
        color: "#fff59d"
    },
    {
        customer: "NIHON",
        color: "#ffab91"
    },
    {
        customer: "YASKAWA",
        color: "#bcaaa4"
    },
    {
        customer: "CANON",
        color: "#ffb74d"
    },
    {
        customer: "FUJIFILM",
        color: "#4db6ac"
    },
    {
        customer: "ICHIKOH",
        color: "#e6ee9c"
    },
    {
        customer: "BROTHER",
        color: "#827717"
    },
    {
        customer: "HONDALOCK",
        color: "#64b5f6"
    }
]
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
        loadData()
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
        chart_view = $(this).text().trim();
        loadData();
    });


});
function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    } else {
        e.dataSeries.visible = true;
    }
    chart.render();
}

function onChangeCheckStation() {
    loadData()
}
function makeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}
function settingChartPerformance(listIncrement) {
    var chartTotalCheck = []
    var chartTotalNG = []
    var chartTotalPPM = []
    $.each(listIncrement, function (index, value) {
        chartTotalCheck.push({
            label: ConvertDateToShort(value.DateStr, chart_view),
            y: value.TotalCheck
        })
        chartTotalNG.push({
            label: ConvertDateToShort(value.DateStr, chart_view),
            y: value.TotalNG
        })
        chartTotalPPM.push({
            label: ConvertDateToShort(value.DateStr, chart_view),
            y: CaclPPM(value.TotalCheck, value.TotalNG)
        })
    })

    CanvasJS.addColorSet("color",
        [
            "#4e94d4",
            "#ff0000",
            "#9e9e9e",
        ]);
    var maxNG = Math.max.apply(Math, chartTotalNG.map(function (o) { return o.y; }))
    var maxPPM = Math.max.apply(Math, chartTotalPPM.map(function (o) { return o.y; }))
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
            maximum: maxNG * 2,
            title: "Số lượng NG"
        }],
        data: [

            {
                showInLegend: true,
                name: "Số lượng kiểm tra(pcs)",
                dataPoints: chartTotalCheck,
                indexLabel: chart_view == "Ngày" ? "" : "{y}",
                indexLabelFontSize: 10,
                type: "column",
                indexLabelPlacement: "outside",
                indexLabelOrientation: "horizontal",
            },
            {
                type: "stackedColumn",
                name: "Số lượng NG",
                showInLegend: true,
                dataPoints: chartTotalNG,
                axisYType: "secondary",

            },
            {
                type: "line",
                showInLegend: true,
                name: "Defection(ppm)",
                dataPoints: chartTotalPPM,
                axisYType: "secondary",
                indexLabel: chart_view == "Ngày" ? "" : "{y}",
                indexLabelFontSize: 10,
                indexLabelFontColor: "black",
                indexLabelBackgroundColor: "#fff8e1",
                indexLabelFontWeight: "bold",
            }]
    };
    new CanvasJS.Chart("chartPerformance", options).render();
    $("#dateStr").empty()
    $("#dateStr").append($('<th/>', {
        text: '##########',
        class: 'text-white'
    }))
    $("#totalCheck").empty()
    $("#totalCheck").append(
        $('<td/>', {
            text: "Total Check"
        }))
    $("#totalNG").empty()
    $("#totalNG").append(
        $('<td/>', {
            text: "Total NG"
        }))
    $("#PPM").empty()
    $("#PPM").append(
        $('<td/>', {
            text: "PPM"
        }))


    $.each(listIncrement, function (index, value) {

        var th = $('<th />', {

        })
        var span1 = $('<span />', {
            text: "#",
            class: 'text-white'
        })
        var span2 = $('<span />', {
            text: "#",
            class: 'text-white'
        })
        var spanText = $('<span />', {
            text: ConvertDateToShort(value.DateStr, chart_view)
        })
        th.append(span1)
        th.append(spanText)
        th.append(span2)

        $("#dateStr").append(th)
        var tdTotalCheck = $('<td />', {
            text: value.TotalCheck == 0 ? '' : addCommas(value.TotalCheck)
        })
        $("#totalCheck").append(tdTotalCheck)

        var tdTotalNG = $('<td />', {
            text: value.TotalNG == 0 ? '' : addCommas(value.TotalNG)
        })
        $("#totalNG").append(tdTotalNG)
        var ppm = CaclPPM(value.TotalCheck, value.TotalNG)
        var tdPPM = $('<td />', {
            text: ppm == 0 ? '' : ppm
        })
        $("#PPM").append(tdPPM)

    })
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
        url: "/OQC/LoadDataPerformance",
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
            } else {
                settingChartPerformance(response.listIncrement)
                settingChartWo(response.listIncrementByWO)
                settingChartNGRate(response.dataChartDailyNGRate,response.listCustomer)
            }
            $('#btn_filter').prop('disabled', false)
        },
        error: function (e) {
            console.log(e);
            $('.loading').hide()
            $('#btn_filter').prop('disabled', false)
        }
    });

}
function settingChartWo(listIncrement) {
    var chartTotalCheck = []
    var chartTotalNG = []
    var chartTotalPercent = []
    $.each(listIncrement, function (index, value) {
        chartTotalCheck.push({
            label: ConvertDateToShort(value.DateStr, chart_view),
            y: value.TotalCheck
        })
        chartTotalNG.push({
            label: ConvertDateToShort(value.DateStr, chart_view),
            y: value.TotalNG
        })
        chartTotalPercent.push({
            label: ConvertDateToShort(value.DateStr, chart_view),
            y: CaclPercent(value.TotalCheck, value.TotalNG)
        })
    })
    var maxNG = Math.max.apply(Math, chartTotalNG.map(function (o) { return o.y; }))
    var maxPPM = Math.max.apply(Math, chartTotalPercent.map(function (o) { return o.y; }))
    if (maxPPM > maxNG) {
        maxNG = maxPPM;
    }
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
            maximum: maxNG * 2,
            title: "Số WO NG"
        }],
        data: [

            {
                showInLegend: true,
                name: "Tổng số WO Check",
                dataPoints: chartTotalCheck,
                indexLabel: chart_view == "Ngày" ? "" : "{y}",
                indexLabelFontSize: 10,
                type: "column",
                indexLabelPlacement: "outside",
                indexLabelOrientation: "horizontal",
            },
            {
                type: "stackedColumn",
                name: "Số WO NG",
                indexLabelFontSize: 10,
                indexLabelPlacement: "outside",
                indexLabelOrientation: "horizontal",
                showInLegend: true,
                dataPoints: chartTotalNG,
                axisYType: "secondary",
            },
            {
                type: "line",
                showInLegend: true,
                name: "Tỷ lệ WO NG(%)",
                dataPoints: chartTotalPercent,
                axisYType: "secondary",
                indexLabel: chart_view == "Ngày" ? "" : "{y}",
                indexLabelFontSize: 10,
                indexLabelFontColor: "black",
                indexLabelBackgroundColor: "#fff8e1",
                indexLabelFontWeight: "bold",
            }]
    };
    new CanvasJS.Chart("chartWOPerformance", options).render();
    $("#dateStrbyWO").empty()
    $("#dateStrbyWO").append($('<th/>', {
        text: '##########',
        class: 'text-white'
    }))
    $("#totalWO").empty()
    $("#totalWO").append(
        $('<td/>', {
            text: "Total WO"
        }))
    $("#totalWoNG").empty()
    $("#totalWoNG").append(
        $('<td/>', {
            text: "Total WO NG"
        }))
    $("#ratio").empty()
    $("#ratio").append(
        $('<td/>', {
            text: "Tỷ lệ(%)"
        }))

    $.each(listIncrement, function (index, value) {

        var th = $('<th />', {

        })
        var span1 = $('<span />', {
            text: "#",
            class: 'text-white'
        })
        var span2 = $('<span />', {
            text: "#",
            class: 'text-white'
        })
        var spanText = $('<span />', {
            text: ConvertDateToShort(value.DateStr, chart_view)
                
        })
        th.append(span1)
        th.append(spanText)
        th.append(span2)

        $("#dateStrbyWO").append(th)
        var tdTotalCheck = $('<td />', {
            text: value.TotalCheck == 0 ? '' : addCommas(value.TotalCheck)
        })
        $("#totalWO").append(tdTotalCheck)

        var tdTotalNG = $('<td />', {
            text: value.TotalNG == 0 ? '' : addCommas(value.TotalNG)
        })
        $("#totalWoNG").append(tdTotalNG)
        var percent = CaclPercent(value.TotalCheck,value.TotalNG)
        var tdPPM = $('<td />', {
            text: percent == 0 ? '' : percent
        })
        $("#ratio").append(tdPPM)

    })
}
function settingChartNGRate(dataChartDailyNGRate,listCustomer) {
    var dataChartDailyNGRate2 = []
    $.each(listCustomer, function (index, cus) {
        var item = {
            customer: cus,
            list:[]
        }
        $.each(dataChartDailyNGRate, function (index, value) {
            var rates = $.grep(value.listByCus, function (v) {
                return v.Customer === cus;
            });
            
            if (cus == "YASKAWA") {
                console.log("");
            }
            var totalCheck = 0
            var totalNG = 0
            $.each(rates, function (i,v) {
                totalCheck += v.TotalCheck
                totalNG += v.TotalNG
            })
            item.list.push({
                label: ConvertDateToShort(value.date, chart_view),
                y: totalCheck == 0 ? 0 : CaclPPM(totalCheck, totalNG)
            })
        })
        dataChartDailyNGRate2.push(item)

    })
    
    var data = []
    var colors = []
    $.each(dataChartDailyNGRate2, function (index, value) {
        var item = {
            type: "line",
            showInLegend: true,
            name: value.customer,
            dataPoints: value.list
        }
        data.push(item)
        var colorItem = CUSTOMER_COLOR.find(m => m.customer == value.customer)
        if (colorItem != null) {
            colors.push(colorItem.color);
        } else {
            colors.push("#111")
        }
    })
    CanvasJS.addColorSet("color",
        colors);
    var chart = new CanvasJS.Chart("chartNGRate", {
        colorSet: "color",
        animationEnabled: true,
        axisY: {
            title: "PPM",
            labelFontSize: 10,
            titleFontSize: 12,
            scaleBreaks: {
                autoCalculate: true
            }
        },
        toolTip: {
            shared: "true"
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
            horizontalAlign: "right", // "center" , "right"
            verticalAlign: "center",  // "top" , "bottom"
            fontSize: 12
        },
        data: data
    });
    chart.render();

    $("#dateStrbyCus").empty()
    $("#dateStrbyCus").append($('<th/>', {
        text: '##########',
        class: 'text-white'
    }))
    $("#bodyByCus").empty()
    $.each(dataChartDailyNGRate2, function (index, value) {
        if (index == 0) {
            $.each(value.list, function (i, v) {
                var th = $('<th />', {

                })
                var span1 = $('<span />', {
                    text: "#",
                    class: 'text-white'
                })
                var span2 = $('<span />', {
                    text: "#",
                    class: 'text-white'
                })
                var spanText = $('<span />', {
                    text: v.label
                })
                th.append(span1)
                th.append(spanText)
                th.append(span2)

                $("#dateStrbyCus").append(th)
            })
        }
        var colorItem = CUSTOMER_COLOR.find(m => m.customer == value.customer)
        var colorRow = '#fff'
        if (colorItem != null) {
            colorRow = colorItem.color
        }
        var tr = $('<tr />', {
            text: value.customer,
            class: "border border-dark",
            style: "background-color:" + colorRow
        })
        $.each(value.list, function (i, v) {
            var td = $('<td />', {
                text: v.y == 0 ? '-' : v.y
            })
            tr.append(td)
        })
        $('#bodyByCus').append(tr)

    })
}