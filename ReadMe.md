依赖 iCheck https://github.com/fronteed/iCheck

默认使用方法是在需要Checkbox的父tr中写入 data-content=“xxx” 属性

可在初始化的时候传入getContent:function(){}改变获取数据的行为(这个方法必须返回一个唯一的数据)

TableCheckbox.init({

totalElements: 10, 
一共有多少条数据

$allCheckbox: $('#table_all'),
全选按钮(可不写)

$pageCheckbox: $('#table_page'),
选择本页按钮(可不写)

$tbody: $('#table_tbody'),

groupCheckbox: 'tbody :checkbox'
勾选数据的元素的选择器(必须是包含在tbody下的元素)

})

TableCheckbox.reload(20)
重置，可以给定新的数据总数

TableCheckbox.reflection(true,true)
重载勾选(第一个参数为是否勾选已选元素的Checkbox，第二为是否重载Checkbox的样式 (翻页时调用，需要2个都为true))

TableCheckbox.setTotalElements(20)
给定新的数据总数

TableCheckbox.get()
返回选取的数据{“pool”:数据集(全选时是排除的，不是全选是选中的), “checkAll”: 是否全选}

TableCheckbox.set({“pool”:数据集(全选时是排除的，不是全选是选中的), “checkAll”: 是否全选})
设置数据

TableCheckbox.disable(true)
设置禁用,不写参数为切换是否禁用
