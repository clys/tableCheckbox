$(function () {
    DomeWebController.init();
});


DomeWebController = {
    pool: {
        element: {
            $tbody: null,
            $sp: null,
            $smp: null,
            $showData1: null
        }
    },
    getEle: function (k) {
        return this.pool.element[k];
    },
    setEle: function (k, v) {
        DomeWebController.pool.element[k] = v;
    },
    init: function () {
        DomeWebController.inits.element();
        DomeWebController.inits.event();

        DomeWebController.table.init();


        DomeWebController.tableCheckbox.init();

    },
    inits: {
        element: function () {
            DomeWebController.pool.element.$tbody = $('tbody');
            DomeWebController.pool.element.$sp = $('#sp');
            DomeWebController.pool.element.$smp = $('#smp');
        },
        event: function () {
            $("#prev").on("click", DomeWebController.table.prev);
            $("#next").on("click", DomeWebController.table.next);
        }
    },
    table: {
        page: 1,
        maxPage: 10,
        size: 10,
        init: function () {
            DomeWebController.table.build(DomeWebController.table.page, DomeWebController.table.size);
        },
        prev: function () {
            if (DomeWebController.table.page == 1) {
                return false;
            }
            DomeWebController.table.page--;
            DomeWebController.table.build(DomeWebController.table.page, DomeWebController.table.size);
        },
        next: function () {
            if (DomeWebController.table.page >= DomeWebController.table.maxPage) {
                return false;
            }
            DomeWebController.table.page++;
            DomeWebController.table.build(DomeWebController.table.page, DomeWebController.table.size);
        },
        build: function (page, size) {
            var html = "", n;
            for (var i = 0; i < size; i++) {
                n = i + (page - 1) * size;
                html += "<tr data-content='" + n + "'>" +
                    "<td><input type='checkbox'></td>" +
                    "<td><span>" + n + "</span></td>" +
                    "</tr>";

            }
            DomeWebController.getEle("$tbody").html(html);
            TableCheckbox.reflection(true, true);
            DomeWebController.getEle("$sp").text(page);
            DomeWebController.getEle("$smp").text(DomeWebController.table.maxPage);
        }
    },
    tableCheckbox: {
        init: function () {

            DomeWebController.tableCheckbox.inits.element();

            TableCheckbox.init({

                totalElements: 100,

                $allCheckbox: $('#all'),

                $pageCheckbox: $('#page'),

                $tbody: DomeWebController.getEle("$tbody"),

                groupCheckbox: 'tbody :checkbox'

            });
            DomeWebController.tableCheckbox.loopShow();
        },
        inits: {
            element: function () {
                DomeWebController.pool.element.$showData1 = $('#show_data_1');
            }
        },
        loopShow: function () {
            setInterval(DomeWebController.tableCheckbox.show, 233);
        },
        show: function () {
            DomeWebController.getEle("$showData1").text(JSON.stringify(TableCheckbox.get()));
        }
    }
};