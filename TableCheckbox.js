var TableCheckbox = {
    ver: '0.1.2',
    checkAll: false,
    pool: {},
    $allCheckbox: null,
    $pageCheckbox: null,
    groupCheckbox: '',
    totalElements: 0,
    disabled: false,
    lock: false,
    disable: function (disabled) {
        if (typeof disabled === "boolean") {
            TableCheckbox.disabled = disabled;
        } else {
            TableCheckbox.disabled = !TableCheckbox.disabled;
        }
        TableCheckbox.disableCss();
        return this;
    },
    disableCss: function () {
        var Fn;
        if (TableCheckbox.disabled) {
            Fn = TableCheckbox.addDisableCss;
        } else {
            Fn = TableCheckbox.removeDisableCss;
        }
        if (null != TableCheckbox.$allCheckbox) {
            Fn.apply(this, TableCheckbox.$allCheckbox);
        }
        if (null != TableCheckbox.$pageCheckbox) {
            Fn.apply(this, TableCheckbox.$pageCheckbox);
        }
        Fn.apply(this, [$(TableCheckbox.groupCheckbox)]);
        return this;
    },
    addDisableCss: function ($ele) {
        if (typeof $ele !== "undefined") {
            $($ele).iCheck('disable')
        }
    },
    removeDisableCss: function ($ele) {
        if (typeof $ele !== "undefined") {
            $($ele).iCheck('enable')
        }
    },
    init: function (params) {
        if (typeof params === "undefined") {
            $.error('初始化TableCheckbox时没有传入参数');
            return false;
        }
        TableCheckbox.totalElements = params.totalElements;
        TableCheckbox.$allCheckbox = params.$allCheckbox;
        TableCheckbox.$pageCheckbox = params.$pageCheckbox;
        TableCheckbox.groupCheckbox = params.groupCheckbox;


        if (typeof TableCheckbox.totalElements === "undefined") {
            $.error('初始化TableCheckbox时没有传入数据总数(totalElements)');
            return false;
        } else {
            TableCheckbox.totalElements = parseInt(TableCheckbox.totalElements, 10);
        }

        if (typeof TableCheckbox.groupCheckbox === "undefined") {
            $.error('初始化TableCheckbox时没有传入行Checkbox组选择器(groupCheckbox)');
            return false;
        }

        if (typeof params.$tbody === "undefined") {
            $.error('初始化TableCheckbox时没有传入tbody对象($tbody)');
            return false;
        }

        if (typeof TableCheckbox.$allCheckbox !== "undefined") {
            TableCheckbox.initICheck(TableCheckbox.$allCheckbox);
            TableCheckbox.$allCheckbox.unbind('ifChanged').on('ifChanged', TableCheckbox.clickedAll);
        }

        if (typeof TableCheckbox.$pageCheckbox !== "undefined") {
            TableCheckbox.initICheck(TableCheckbox.$pageCheckbox);
            TableCheckbox.$pageCheckbox.unbind('ifChanged').on('ifChanged', TableCheckbox.clickedPage);
        }
        TableCheckbox.initICheck($(TableCheckbox.groupCheckbox));
        params.$tbody.unbind('ifChanged').on('ifChanged', ':checkbox', TableCheckbox.clickedOne);

        if (typeof params.getContent === "function") {
            TableCheckbox.getContent = params.getContent;
        }
        return this;
    },
    reload: function (totalElements) {
        TableCheckbox.checkAll = false;
        if (typeof totalElements !== 'undefined') {
            TableCheckbox.totalElements = parseInt(totalElements, 10);
        } else {
            TableCheckbox.totalElements = 0;
        }
        TableCheckbox.clearPool();
        TableCheckbox.reflection();
        return this;
    },
    setTotalElements: function (totalElements) {
        if (typeof totalElements !== 'undefined') {
            TableCheckbox.totalElements = parseInt(totalElements, 10);
        }
        return this;
    },
    getContent: function ($ele) {
        if (typeof $ele === "undefined") {
            return null;
        }
        return $($ele).parents('tr').attr('data-content');
    },
    isChecked: function ($ele) {
        return $($ele).prop('checked');
    },
    initICheck: function ($input) {
        if (typeof $input !== "undefined" && $($input).size() != 0) {
            $($input).iCheck();
        }
        return this;
    },
    clickedAll: function () {
        if (TableCheckbox.disabled || TableCheckbox.lock) {
            return this;
        }
        var $ele = $(this);
        TableCheckbox.checkAll = TableCheckbox.isChecked($ele);
        TableCheckbox.clearPool();
        TableCheckbox.reflection(true);
        return this;
    },
    clickedPage: function () {
        if (TableCheckbox.disabled || TableCheckbox.lock) {
            return this;
        }
        var $ele = $(this);
        var $inputs = $(TableCheckbox.groupCheckbox);
        if (TableCheckbox.isChecked($ele)) {
            TableCheckbox.checkedPoolControl($inputs);
        } else {
            TableCheckbox.deCheckedPoolControl($inputs);
        }
        TableCheckbox.reflection(true);
        return this;
    },
    clickedOne: function () {
        if (TableCheckbox.disabled || TableCheckbox.lock) {
            return this;
        }
        var $ele = $(this);
        if (TableCheckbox.isChecked($ele)) {
            TableCheckbox.checkedPoolControl($ele);
        } else {
            TableCheckbox.deCheckedPoolControl($ele);
        }
        TableCheckbox.reflection(false);
        return this;
    },
    checkedPoolControl: function ($ele) {
        if (TableCheckbox.checkAll) {
            TableCheckbox.removePool($ele);
        } else {
            TableCheckbox.pushPool($ele);
        }
        return this;
    },
    deCheckedPoolControl: function ($ele) {
        if (TableCheckbox.checkAll) {
            TableCheckbox.pushPool($ele);
        } else {
            TableCheckbox.removePool($ele);
        }
        return this;
    },
    pushPool: function ($ele, arr) {
        if (typeof $ele !== "undefined" || (typeof arr !== "undefined" && null != arr)) {
            var arrIsNull = null == arr;
            var size;
            if (arrIsNull) {
                $ele = $($ele);
                size = $ele.size();
            } else {
                size = arr.length;
            }
            var content;
            for (var i = 0; i < size; i++) {
                if (arrIsNull) {
                    content = TableCheckbox.getContent($ele.eq(i));
                } else {
                    content = arr[i];
                }
                if (typeof content !== "undefined") {
                    TableCheckbox.pool[content] = "";
                }
            }
        }
        return this;
    },
    removePool: function ($ele, arr) {
        if (typeof $ele !== "undefined" || (typeof arr !== "undefined" && null != arr)) {
            var arrIsNull = null == arr;
            var size;
            if (arrIsNull) {
                $ele = $($ele);
                size = $ele.size();
            } else {
                size = arr.length;
            }
            var content;
            for (var i = 0; i < size; i++) {
                if (arrIsNull) {
                    content = TableCheckbox.getContent($ele.eq(i));
                } else {
                    content = arr[i];
                }
                if (typeof content !== "undefined") {
                    delete TableCheckbox.pool[content];
                }
            }
        }
        return this;
    },
    clearPool: function () {
        TableCheckbox.pool = {};
        return this;
    },
    reflection: function (isRedraw, reloadICheck) {
        TableCheckbox.lock = true;
        if (typeof reloadICheck === "boolean" && reloadICheck) {
            TableCheckbox.initICheck($(TableCheckbox.groupCheckbox));
        }
        var $group = $(TableCheckbox.groupCheckbox);
        if (typeof isRedraw !== "undefined" && isRedraw) {
            var content;
            var $oneEle;
            for (var i = 0, size = $group.size(); i < size; i++) {
                $oneEle = $group.eq(i);
                content = TableCheckbox.getContent($oneEle);
                if (TableCheckbox.checkAll) {
                    if (typeof TableCheckbox.pool[content] === "undefined") {
                        TableCheckbox.pick($oneEle);
                    } else {
                        TableCheckbox.dePick($oneEle);
                    }
                } else {
                    if (typeof TableCheckbox.pool[content] !== "undefined") {
                        TableCheckbox.pick($oneEle);
                    } else {
                        TableCheckbox.dePick($oneEle);
                    }
                }
            }
        }
        if (null != TableCheckbox.$pageCheckbox && $group.size() != 0) {
            if ($(TableCheckbox.groupCheckbox + ":checked").size() == $group.size()) {
                TableCheckbox.pick(TableCheckbox.$pageCheckbox);
            } else {
                TableCheckbox.dePick(TableCheckbox.$pageCheckbox);
            }
        }
        if (null != TableCheckbox.$allCheckbox) {
            var poolLength = _.keys(TableCheckbox.pool).length;
            if ((TableCheckbox.checkAll && poolLength == 0) || (!TableCheckbox.checkAll && poolLength >= TableCheckbox.totalElements)) {
                TableCheckbox.pick(TableCheckbox.$allCheckbox);
            } else {
                TableCheckbox.dePick(TableCheckbox.$allCheckbox);
            }
        }
        TableCheckbox.lock = false;
        return this;
    },
    pick: function ($ele) {
        if (typeof $ele !== "undefined") {
            $($ele).iCheck('check');
        }
        return this;
    },
    dePick: function ($ele) {
        if (typeof $ele !== "undefined") {
            $($ele).iCheck('uncheck');
        }
        return this;
    },
    get: function () {
        return {"pool": _.keys(TableCheckbox.pool), "checkAll": TableCheckbox.checkAll};
    },
    set: function (params) {
        if (typeof params !== "undefined") {
            if (typeof params['pool'] !== "undefined") {
                var pool = params['pool'];
                TableCheckbox.clearPool();
                for (var i = 0, len = pool.length; i < len; i++) {
                    TableCheckbox.pushPool(null, pool[i]);
                }
            }
            if (typeof params['checkAll'] !== "undefined") {
                TableCheckbox.checkAll = params['checkAll'];
            }
        }
        TableCheckbox.reflection(true);
    },
    versions: function () {
        return TableCheckbox.ver;
    }
};
