namespace sffw.components.pagingRepeaterCtrl {
    if (ko && !ko.components.isRegistered('sffw-paging-repeater-ctrl')) {
        ko.components.register('sffw-paging-repeater-ctrl', {
            viewModel: {
                createViewModel: (params: IPagingRepeaterCtrlModelParams, componentInfo: KnockoutComponentTypes.ComponentInfo): PagingRepeaterCtrlModel => new sffw.components.pagingRepeaterCtrl.PagingRepeaterCtrlModel(params, componentInfo)
            },
            template: `
<div data-bind="class: 'sffw-paging-repeater-ctrl-container', css: { 'has-errors': dataHasErrors }">
    <div style="display:table; float:right">
        <!-- ko ifnot: keepArrowsTogether -->
        <button data-bind="css: rightButtonClass, enable: rightButtonEnabledBindingValue,
            click: onRightButtonClicked, attr: {'aria-disabled': rightButtonAriaDisabledBindingValue }"></button>
        <!-- /ko -->
        <!-- ko if: showAdd -->
        <button data-bind="css: addButtonClass, enable: addButtonEnabledBindingValue,
            click: onAddButtonClicked, attr: {'aria-disabled': addButtonAriaDisabledBindingValue }"></button>
        <!-- /ko -->
        <!-- ko if: showRemove -->
        <button data-bind="css: removeButtonClass, enable: removeButtonEnabledBindingValue,
            click: onRemoveButtonClicked, attr: {'aria-disabled': removeButtonAriaDisabledBindingValue }"></button>
        <!-- /ko -->
    </div>
    <div style="display: flex; align-items: center; position: relative">
        <button data-bind="css: leftButtonClass, enable: leftButtonEnabledBindingValue,
            click: onLeftButtonClicked, attr: {'aria-disabled': leftButtonAriaDisabledBindingValue }"></button>
        <!-- ko if: keepArrowsTogether -->
        <button data-bind="css: rightButtonClass, enable: rightButtonEnabledBindingValue,
            click: onRightButtonClicked, attr: {'aria-disabled': rightButtonAriaDisabledBindingValue }"></button>
        <!-- /ko -->
        <input class="editor-value sffw-paging-repeater-ctrl-index-input" data-bind="value: indexString" type="text">
        <div data-bind="text: title" class="sffw-paging-repeater-ctrl-title"></div>
        <span data-bind="visible: dataHasErrors" class="sffw-paging-repeater-ctrl-error-icon"></span>
    </div>
    <span class="sffw-paging-repeater-ctrl-error" data-bind="visible: isError, text: $root.$localize('PagingRepeaterCtrl$$isNotValidMessage')"></span>
</div>
`
        });
    }
}