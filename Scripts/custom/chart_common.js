function toString(tempDate) {
    return [tempDate.getMonth() + 1, tempDate.getDate(), tempDate.getFullYear()].join('/');
}

function CaclPPM(TotalCheck, TotalNG) {
    return TotalCheck == 0 ? 0 : Math.round((TotalNG * 1000000 / TotalCheck) * 100) / 100
}

function CaclPPMRound(TotalCheck, TotalNG) {
    return TotalCheck == 0 ? 0 : Math.round(TotalNG * 1000000 / TotalCheck)
}
function CaclPercent(TotalCheck, TotalNG) {
    return TotalCheck == 0 ? 0 : Math.round((TotalNG * 100 / TotalCheck) * 100) / 100
}
function ConvertDateToShort(dateStr, chart_view) {
    chart_view = chart_view.trim()
    var date = moment(dateStr)
    if (chart_view == 'Ngày') {
        return date.format('D.MMM')
    } else if (chart_view == 'Tuần') {
        return 'W' +  date.week()
    } else if (chart_view == "Tháng") {
        return date.format('MMM')
    } else if (chart_view == 'Năm') {
        return date.format('YYYY')
    }
    return date.format('D.MMM')
}

function SumTotalNG(list) {
    var TotalNG = 0
    $.each(list, function (index, value) {
        TotalNG += value.TotalNG
    })
    return TotalNG
}

function SumTotalCheck(list) {
    var TotalCheck = 0
    $.each(list, function (index, value) {
        TotalCheck += value.TotalCheck
    })
    return TotalCheck
}

function SumTotalWOReceived(list) {
    var TotalCheck = 0
    $.each(list, function (index, value) {
        TotalCheck += value.TotalWoReceived
    })
    return TotalCheck
}

function Sampling(TotalCheck, WoReceieved) {
    return WoReceieved == 0 ? 0 : Math.round((TotalCheck * 100 / WoReceieved) * 100) / 100
}

function NGRatingOver(PPM, Target) {
    return Target == 0 ? 0 : Math.round((PPM * 100 / Target) * 100) / 100
}

function rank(item, array) {

    array = array.sort(function (a, b) {
        return a - b;
    });

    array = array.reverse()
    var i = 1
    $.each(array, function (index, value) {
        if (item == value) return false
        else i++
    })
    return i
}

function SortByPPM(a, b) {
    var aName = a.PPM
    var bName = b.PPM
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}
function sortDesc(array) {
    
}
function getMaxRank(list) {
    var max = 1;
    $.each(list, function (index, value) {
        if(value.rank > max) max = value.rank
    })
    return max
}