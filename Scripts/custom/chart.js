$(function () {
   
})

function onMonth() {
    if (validateMonth()) {
        $('#btn_view_chart').removeAttr('disabled');
        
    } else $('#btn_view_chart').attr('disabled', 'disabled');
}
function validateMonth() {
    var monthStart = $('#start').val();
    var monthEnd = $('#end').val();
    var dateStart = new Date(monthStart + '-01');
    var dateEnd = new Date(monthEnd + '-01');
    return (dateStart < dateEnd);
}

function onViewChart() {
    var monthStart = $('#start').val()+'-01';
    var monthEnd = $('#end').val()+'-01';
    $.ajax({
        url: "/Claim/DrawChart",
        data: { start: monthStart, end: monthEnd },
        success: function (res) {
            drawChart(res.barLabels, res.barDatas, res.pieLabels, res.pieDatas);
        }
    });
}
function RandomColor() {
    var hex = (Math.round(Math.random() * 0xffffff)).toString(16);
    while (hex.length < 6) hex = "0" + hex;
    return "#"+hex;
}
function drawChart(barLabels, barDatas, pieLabels, pieDatas) {
    var backgroundColors = [];
    for (var i = 0; i < barLabels.length; i++) {
        backgroundColors[i] = "#f990a7";
    }
    var backgroundColorPies = [];
    for (var i = 0; i < barDatas.length; i++) {
        backgroundColorPies[i] = RandomColor();
    }
    var barChartData =
    {
        labels: barLabels,
        datasets: [{
            label: 'Số lượng claim',
            backgroundColor: backgroundColors,
            borderWidth: 2,
            data: barDatas
        }]
    };

    var PieChartData =
    {
        labels: pieLabels,
        datasets: [{
            label: 'ProductWise Sales Count',
            backgroundColor: backgroundColorPies,
            borderWidth: 2,
            data: pieDatas
        }]
    };

    var ctx1 = document.getElementById("pie_chart").getContext("2d");
    new Chart(ctx1,
        {
            type: 'pie',
            data: PieChartData,
            options:
            {
                title:
                {
                    display: true,
                    text: "Biểu đồ Claim theo khách hàng"
                },
                responsive: true,
                maintainAspectRatio: true
            }
        });
    var ctx2 = document.getElementById("barcanvas").getContext("2d");
    new Chart(ctx2,
        {
            type: 'bar',
            data: barChartData,
            options:
            {
                responsive: true,
                title: { display: true, text: 'Biểu đồ Claim theo tháng' },
                legend: { position: 'bottom' },
                scales: {
                    xAxes: [{ gridLines: { display: false }, display: true, scaleLabel: { display: false, labelString: '' } }],
                    yAxes: [{ gridLines: { display: false }, display: true, scaleLabel: { display: false, labelString: '' }, ticks: { stepSize: 1, beginAtZero: true } }]
                }
            },
        });
}