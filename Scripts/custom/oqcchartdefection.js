
function setFilterDateWhenChange() {
    $('#filter_date_from').val(moment().startOf('month').format('yyyy-MM-DD'));
    $('#filter_date_to').val(moment($('#filter_date_from').val()).endOf('month').format('yyyy-MM-DD'));
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
    loadData()

    $('#filter_text').keyup(function (e) {
        if (e.keyCode == 13) {
            loadData()
        }
    });

});
function onChangeCheckStation() {
   
    loadData(station.toString())
}
function loadData(station = '') {
    $('.loading').show()
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
    $('#btn_filter').prop('disabled', true)
    $.ajax({
        url: "/OQC/LoaDataChartDefection",
        data: {
            startDate: $('#filter_date_from').val(),
            endDate: $('#filter_date_to').val(),
            station: station.toString()
        },
        success: function (response) {
            settingChartDefection(response.listCustomer, response.listData, response.targets, response.listNGPhoto)
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
var listNGPhoto = null;
function settingChartDefection(listCustomer, listData, targets, listNGPhoto) {
    this.listNGPhoto = listNGPhoto
    var thead = $('#thead').empty()
    var thead = $('#body').empty()

    var thArea = $('<th />', {
        text: "OQC Productivity",
        width: "8%",
        colspan: 2,
        class: 'bg-light'
    })
    var th1 = $('<th />', {
        text: "Check Quantity(pcs)",
        width: "50",
        class: 'bg-check'
    })
    var th2 = $('<th />', {
        text: "WO Received",
        width: "50",
        class: 'bg-check'
    })
    var th3 = $('<th />', {
        text: "Sampling (Inspect Qty vs WO)",
        width: "50",
        class: 'bg-light'
    })
    var th4 = $('<th />', {
        text: "PPM",
        width: "50",
        class: 'bg-light'
    })
    var th5 = $('<th />', {
        text: "Target(ppm)",
        width: "50",
        class: 'bg-light'
    })
    var th6 = $('<th />', {
        text: "% NG Rating Over",
        width: "50",
        class: 'bg-ranking'
    })
    var th7 = $('<th />', {
        text: "Ranking",
        width: "50",
        class: 'bg-ranking'
    })
    var th8 = $('<th />', {
        text: "Total NG",
        width: "50"
    })
    thead.append(thArea)
    thead.append(th1)
    thead.append(th2)
    thead.append(th3)
    thead.append(th4)
    thead.append(th5)
    thead.append(th6)
    thead.append(th7)
    thead.append(th8)
    var listDefection = []
    $.each(listData, function (index, value) {
        if (value.Defection != '' && !listDefection.includes(value.Defection.trim())) {
            listDefection.push(value.Defection.trim())
        }
    })
    var listDefectionByArea = []
    var listPPM = []
    var listRankArea = []
    $.each(listCustomer, function (index, value) {
        var rank = {
            area: value.name,
            list: []
        }
        var areaList = {
            area: value.name,
            list: []
        }
        var itemAll = {
            area: value.name,
            customer: 'Subtotal ' + value.name,
            totalCheck: 0,
            WOReceived: 0,
            Sampling: 0,
            PPM: 0,
            Target: targets.find(m => m.Area == value.name).Target,
            NGRatingOver: 0,
            Ranking: 0,
            totalNG: 0,
            list: []
        }
        $.each(value.list, function (i, v) {
            var item = {
                area: value.name,
                customer: v.Customer,
                totalCheck: 0,
                WOReceived: 0,
                Sampling: 0,
                PPM: 0,
                Target: itemAll.Target,
                NGRatingOver: 0,
                Ranking: 0,
                totalNG: 0,
                list: []
            }
            var totalByCus = listData.filter(m => m.Customer == v.Customer);
            item.totalCheck += totalByCus != null ? SumTotalCheck(totalByCus) : 0

            item.WOReceived += totalByCus != null ? SumTotalWOReceived(totalByCus) : 0
            item.Sampling = Sampling(item.totalCheck, item.WOReceived)
            itemAll.totalCheck += item.totalCheck
            itemAll.WOReceived += item.WOReceived
            $.each(listDefection, function (j, defection) {
                var defectionObj = listData.filter(m => m.Customer == v.Customer && m.Defection.trim() == defection.trim())
                var numberNG = defectionObj != null ? SumTotalNG(defectionObj) : 0
                item.list.push({
                    name: defection,
                    numberNG: numberNG,
                    defectionTotalNG: []
                })
                item.totalNG += numberNG
            })
            item.PPM = CaclPPMRound(item.totalCheck, item.totalNG)
            item.NGRatingOver = NGRatingOver(item.PPM, item.Target)
            if (!listPPM.includes(item.PPM)) {
                listPPM.push(item.PPM)
            }

            areaList.list.push(item)
        })

        $.each(listDefection, function (j, defection) {

            var TotalNG = 0
            $.each(value.list, function (i, v) {
                var defectionObj = listData.filter(m => m.Customer == v.Customer && m.Defection.trim() == defection.trim())
                TotalNG += defectionObj != null ? SumTotalNG(defectionObj) : 0
            })
            itemAll.list.push({
                name: defection,
                numberNG: TotalNG,
                defectionTotalNG: []
            })
            itemAll.totalNG += TotalNG
            rank.list.push({
                numberNG: TotalNG,
                rank: 0
            })
        })
        listRankArea.push(rank)
        itemAll.Sampling = Sampling(itemAll.totalCheck, itemAll.WOReceived)
        itemAll.PPM = CaclPPMRound(itemAll.totalCheck, itemAll.totalNG)
        itemAll.NGRatingOver = NGRatingOver(itemAll.PPM, itemAll.Target)
        areaList.list.push(itemAll)
        listDefectionByArea.push(areaList)
    })
    $.each(listDefectionByArea, function (index, value) {
        $.each(value.list, function (i, v) {
            if (!v.customer.includes('Subtotal'))
                v.Ranking = rank(v.PPM, listPPM)
        })
    })
    var rankTotal = {
        area: "Total",
        list: []
    }
    var listDefectionAll = []
    var areaListAllItem = {
        area: "UMCVN",
        customer: 'Total',
        totalCheck: SumTotalCheck(listData),
        WOReceived: SumTotalWOReceived(listData),
        Sampling: 0,
        PPM: 0,
        Target: targets.find(m => m.Area == 'ALL').Target,
        NGRatingOver: 0,
        Ranking: 0,
        totalNG: 0,
        list: []
    }
    areaListAllItem.Sampling = Sampling(areaListAllItem.totalCheck, areaListAllItem.WOReceived)
    $.each(listDefection, function (j, defection) {
        var TotalNG = 0
        if (defection.includes('Thiếu Thiếc')) {
            console.log('')
        }
        var defectionObj = listData.filter(m => m.Defection.trim() == defection.trim())
        TotalNG += defectionObj != null ? SumTotalNG(defectionObj) : 0
        listDefectionAll.push({
            name: defection,
            numberNG: TotalNG,
            defectionTotalNG: []
        })
        areaListAllItem.totalNG += TotalNG
        rankTotal.list.push({
            numberNG: TotalNG,
            rank: 0
        })
    })
    listRankArea.push(rankTotal)
    areaListAllItem.PPM = CaclPPMRound(areaListAllItem.totalCheck, areaListAllItem.totalNG)
    areaListAllItem.NGRatingOver = NGRatingOver(areaListAllItem.PPM, areaListAllItem.Target)
    areaListAllItem.list = listDefectionAll
    var areaListAll = {
        area: "UMCVN",
        list: [areaListAllItem]
    }
    
    listDefectionByArea.push(areaListAll)
    $.each(listDefectionByArea, function (index, value) {
        if (index == 0) {
            $.each(value.list[0].list, function (i, v) {
                var th = $('<th />', {
                    text: v.name,
                    width: '50'
                })
                thead.append(th)
            })
        }

        $.each(value.list, function (i1, v1) {
            var row = $('<tr />')
            if (i1 == 0) {
                var td = $('<td />', {
                    text: value.area,
                    rowspan: value.list.length == 1 ? 1 : value.list.length - 1,
                    style: 'vertical-align : middle;text-align:center',
                    class: 'font-weight-bold'
                })
                row.append(td);
            }


            var td1 = $('<td />', {
                text: v1.customer,
                class: 'font-weight-bold text-danger'
            })
            if (i1 == value.list.length - 1 && v1.customer != 'Total') {
                td1 = $('<td />', {
                    text: v1.customer,
                    colspan: 2,
                    class: 'font-weight-bold font-italic ',
                    style: 'vertical-align : middle;text-align:center',
                })
            }
            var td2 = $('<td />', {
                text: addCommas(v1.totalCheck),
                class: 'bg-check'
            })
            var td3 = $('<td />', {
                text: addCommas(v1.WOReceived),
                class: 'bg-check'
            })
            var td4 = $('<td />', {
                text: v1.Sampling + '%',
                class: 'bg-light'
            })
            var classPPM = 'bg-light'
            if (v1.Ranking > 0 && v1.Ranking <= 4) {
                classPPM = 'text-danger bg-ng'
            }
            var td5 = $('<td />', {
                text: v1.PPM,
                class: classPPM
            })
            var td6 = $('<td />', {
                text: v1.Target,
                class: 'bg-light'
            })
            var td7 = $('<td />', {
                text: v1.NGRatingOver,
                class: 'bg-ranking'
            })
            var td8 = $('<td />', {
                text: v1.Ranking == 0 ? '' : v1.Ranking,
                class: 'bg-ranking'
            })

            var td9 = $('<td />', {
                text: v1.totalNG,
                class: v1.totalNG == 0 ? 'bg-success font-weight-bold' : 'bg-warning font-weight-bold'
            })
            if (i1 == value.list.length - 1) {

                td9 = $('<td />', {
                    text: v1.totalNG,
                    class: 'bg-check'
                })
            }


            row.append(td1)
            row.append(td2)
            row.append(td3)
            row.append(td4)
            row.append(td5)
            row.append(td6)
            row.append(td7)
            row.append(td8)
            row.append(td9)

            $.each(v1.list, function (i, v) {
                var td = $('<td />', {
                    text: v.numberNG == 0 ? "" : v.numberNG
                })
                if (i1 != value.list.length - 1) {
                    if (v.numberNG == 0) {
                        td = $('<td />', {
                            class: 'bg-success'
                        })
                    } else {
                        td = $('<td />', {
                            class: 'bg-warning'
                        })
                        var p = $('<span />', {

                        });
                        var widthImage = 250;
                        if (v.defectionTotalNG.length > 5) {
                            widthImage = ($(window).width() - 20) / v.defectionTotalNG.length
                        }

                        var btn = $('<button />', {
                            class: 'hiddentxt border-0 bg-warning btn-ng',
                            name: value.area + "," + v1.customer + "," + i,
                            style: 'width:100%;height:20px',
                            text: v.numberNG == 0 ? '' : v.numberNG,
                            mouseover: function (e) {
                                var position = $(this).offset()
                                span1.addClass('d-block')
                                var left = position.left - (widthImage * v.defectionTotalNG.length) / 2

                                var space = left + (widthImage * v.defectionTotalNG.length) - $(window).width()
                                if (space > 0) {
                                    left = left - space;
                                }
                                if (left < 0) left = 0
                                span1.css('left', left + 'px')
                                span1.css('top', (position.top - widthImage) + 'px')

                            },
                            mouseout: function (e) {
                                span1.removeClass('d-block')

                            },
                            click: function (e) {

                                try {
                                    var info = $(this).attr('name');
                                    var infos = info.split(',')
                                    var listArea = listDefectionByArea.find(m => m.area == infos[0]);
                                    var listCustomer = listArea.list.find(m => m.customer == infos[1])
                                    var defection = listCustomer.list[infos[2]].name.trim()
                                    var ngInfo = listNGPhoto.filter(m => m.Customer == listCustomer.customer && m.Defection.trim() == defection)
                                    var numberImageinRow = 2;
                                    $('#listImageNG').empty()
                                    document.getElementById("exampleModalLongTitle").innerText = "Hình ảnh NG: " + defection;
                                    for (var ngIndex = 0; ngIndex < ngInfo.length; ngIndex = ngIndex + numberImageinRow) {
                                        var rowImage = $('<div />', {
                                            class: 'row'
                                        })
                                        for (var colIndex = ngIndex; colIndex < (ngIndex + numberImageinRow); colIndex++) {
                                            if (colIndex >= ngInfo.length) break;
                                            var text = $('<span />', {
                                                text: colIndex + 1,
                                                class: 'font-weight-bold text-danger'
                                            })
                                            var image1 = $('<img />', {
                                                src: ngInfo[colIndex].NGPhoto,
                                                style: 'width:100%;margin: 0 auto;height:auto',

                                                class: "border border-1"

                                            })

                                            var col1 = $('<div />', {
                                                class: 'col'
                                            })
                                            col1.append(text)
                                            col1.append(image1)
                                            rowImage.append(col1)
                                        }

                                        $('#listImageNG').append(rowImage)
                                    }
                                    //$.each(ngInfo, function (ngIndex, ngValue) {

                                    //    var image = $('<img />', {
                                    //        src: ngValue.NG_Photo,

                                    //        height: 250,
                                    //        style:'width:70%;margin: 0 auto',
                                    //        class: "border border-1"

                                    //    })

                                    //    $('#listImageNG').append(image)
                                    //})
                                    $('#imageNGModal').modal('show')

                                } catch (e) {
                                    console.log(e)
                                }

                            }
                        })
                        var span1 = $('<span />', {
                            class: 'hiddenimg '
                        })

                        $.each(v.defectionTotalNG, function (defIndex, defValue) {
                            var image = $('<img />', {
                                src: defValue.NG_Photo,
                                width: widthImage,
                                class: "border border-1"

                            })
                            span1.append(image)

                        })

                        p.append(btn)
                        p.append(span1)
                        td.append(p)

                    }

                }

                row.append(td)
            })
            $('#body').append(row)
        })



    })

    $.each(listRankArea, function (index, value) {
        var listNG = []
        $.each(value.list, function (i, v) {
            if (!listNG.includes(v.numberNG))
                listNG.push(v.numberNG)
        })
        $.each(value.list, function (i, v) {
            v.rank = rank(v.numberNG, listNG)
        })
    })
    $.each(listRankArea, function (index, value) {

        var row = $('<tr />', {
        })
        var td1 = $('<td />', {
            colspan: 9
        })
        var td2 = $('<td />', {
            text: value.area,
            style: 'vertical-align : middle;text-align:center',
            class: 'font-weight-bold'
        })
        row.append(td1)
        row.append(td2)
        var maxRank = getMaxRank(value.list)
        var max = 0
        if (maxRank == 1) max = 0
        else max = maxRank > 3 ? 3 : 1
        $.each(value.list, function (i, v) {

            td = $('<td />', {
                text: v.rank == 0 ? "" : v.rank,
                class: v.rank <= max ? 'text-danger bg-ng' : ''

            })
            row.append(td)
        })
        $('#body').append(row)
    })
}
