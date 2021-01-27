var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var pagingRepeaterCtrl;
        (function (pagingRepeaterCtrl) {
            var PagingRepeaterCtrlItemAddParams = /** @class */ (function () {
                function PagingRepeaterCtrlItemAddParams() {
                }
                return PagingRepeaterCtrlItemAddParams;
            }());
            pagingRepeaterCtrl.PagingRepeaterCtrlItemAddParams = PagingRepeaterCtrlItemAddParams;
            var PagingRepeaterCtrlItemRemoveParams = /** @class */ (function () {
                function PagingRepeaterCtrlItemRemoveParams() {
                }
                return PagingRepeaterCtrlItemRemoveParams;
            }());
            pagingRepeaterCtrl.PagingRepeaterCtrlItemRemoveParams = PagingRepeaterCtrlItemRemoveParams;
            var PagingRepeaterCtrlModel = /** @class */ (function () {
                function PagingRepeaterCtrlModel(params, componentInfo) {
                    this.isError = ko.observable(false);
                    this.subscriptions = [];
                    this.isInternalIndexChange = false;
                    this.iconLeftClass = _.isString(params.IconLeftClass) ? params.IconLeftClass : 'fa fa-caret-left';
                    this.iconRightClass = _.isString(params.IconRightClass) ? params.IconRightClass : 'fa fa-caret-right';
                    this.iconAddClass = _.isString(params.IconAddClass) ? params.IconAddClass : 'fa fa-plus';
                    this.iconRemoveClass = _.isString(params.IconRemoveClass) ? params.IconRemoveClass : 'fa fa-minus';
                    this.iconsAdditionalClass = _.isString(params.IconsAdditionalClass) ? params.IconsAdditionalClass : 'fa-lg fa-fw';
                    this.leftButtonClass = ko.observable('sffw-paging-repeater-ctrl-left'
                        + this.getFullCssClass(this.iconLeftClass));
                    this.rightButtonClass = ko.observable('sffw-paging-repeater-ctrl-right'
                        + this.getFullCssClass(this.iconRightClass));
                    this.addButtonClass = ko.observable('sffw-paging-repeater-ctrl-add'
                        + this.getFullCssClass(this.iconAddClass));
                    this.removeButtonClass = ko.observable('sffw-paging-repeater-ctrl-remove'
                        + this.getFullCssClass(this.iconRemoveClass));
                    this.collection = params.Data;
                    this.count = ko.pureComputed(this.getCollectionCount, this);
                    this.indexAsNumber = ko.pureComputed(this.getIndexAsNumber, this);
                    this.index = params.Index;
                    this.indexString = ko.observable('');
                    if (this.count() > 0) {
                        var indexValue = this.index();
                        if (indexValue && indexValue > 0 && indexValue <= this.count()) {
                            this.setNewIndex(this.index());
                        }
                        else {
                            this.setNewIndex(1);
                        }
                    }
                    else {
                        this.setNewIndex(0);
                    }
                    this.captionAttName = params.CaptionAtt;
                    this.allowAdd = params.AllowAdd;
                    this.allowRemove = params.AllowRemove;
                    this.showAdd = _.isUndefined(params.ShowAdd) ? true : params.ShowAdd;
                    this.showRemove = _.isUndefined(params.ShowRemove) ? true : params.ShowRemove;
                    this.checkItemIsValidBeforeIndexChange = params.CheckItemIsValidBeforeIndexChange;
                    this.indicateDataErrors = params.IndicateDataErrors;
                    this.keepArrowsTogether = !!params.KeepArrowsTogether;
                    this.title = ko.pureComputed(this.getTitle, this);
                    this.leftButtonEnabled = ko.pureComputed(this.getLeftButtonEnabled, this);
                    this.leftButtonEnabledBindingValue = ko.pureComputed(this.getLeftButtonEnabledBindingValue, this);
                    this.leftButtonAriaDisabledBindingValue = ko.pureComputed(this.getLeftButtonAriaDisabledBindingValue, this);
                    this.rightButtonEnabled = ko.pureComputed(this.getRightButtonEnabled, this);
                    this.rightButtonEnabledBindingValue = ko.pureComputed(this.getRightButtonEnabledBindingValue, this);
                    this.rightButtonAriaDisabledBindingValue = ko.pureComputed(this.getRightButtonAriaDisabledBindingValue, this);
                    this.addButtonEnabled = ko.pureComputed(this.getAddButtonEnabled, this);
                    this.addButtonEnabledBindingValue = ko.pureComputed(this.getAddButtonEnabledBindingValue, this);
                    this.addButtonAriaDisabledBindingValue = ko.pureComputed(this.getAddButtonAriaDisabledBindingValue, this);
                    this.removeButtonEnabled = ko.pureComputed(this.getRemoveButtonEnabled, this);
                    this.removeButtonEnabledBindingValue = ko.pureComputed(this.getRemoveButtonEnabledBindingValue, this);
                    this.removeButtonAriaDisabledBindingValue = ko.pureComputed(this.getRemoveButtonAriaDisabledBindingValue, this);
                    this.dataHasErrors = ko.pureComputed(this.getDataHasErrors, this);
                    this.itemAddHandler = params.OnItemAdd;
                    this.itemRemoveHandler = params.OnItemRemove;
                    this.subscriptions.push(this.collection.$items.subscribe(this.onCollectionArrayChange, this, 'arrayChange'));
                    this.subscriptions.push(this.indexString.subscribe(this.onIndexStringChange, this));
                    this.subscriptions.push(this.index.subscribe(this.onIndexChange, this));
                }
                PagingRepeaterCtrlModel.prototype.getCollectionCount = function () {
                    return this.collection.$items().length;
                };
                PagingRepeaterCtrlModel.prototype.getIndexAsNumber = function () {
                    if (this.index()) {
                        return this.index();
                    }
                    else {
                        return 0;
                    }
                };
                PagingRepeaterCtrlModel.prototype.getLeftButtonEnabled = function () {
                    return this.indexAsNumber() > 1;
                };
                PagingRepeaterCtrlModel.prototype.getLeftButtonEnabledBindingValue = function () {
                    var _a, _b;
                    if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                        return true;
                    }
                    else {
                        return this.leftButtonEnabled();
                    }
                };
                PagingRepeaterCtrlModel.prototype.getLeftButtonAriaDisabledBindingValue = function () {
                    var _a, _b;
                    if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                        return !(this.leftButtonEnabled());
                    }
                    else {
                        return null;
                    }
                };
                PagingRepeaterCtrlModel.prototype.getRightButtonEnabled = function () {
                    return this.indexAsNumber() < this.count();
                };
                PagingRepeaterCtrlModel.prototype.getRightButtonEnabledBindingValue = function () {
                    var _a, _b;
                    if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                        return true;
                    }
                    else {
                        return this.rightButtonEnabled();
                    }
                };
                PagingRepeaterCtrlModel.prototype.getRightButtonAriaDisabledBindingValue = function () {
                    var _a, _b;
                    if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                        return !(this.rightButtonEnabled());
                    }
                    else {
                        return null;
                    }
                };
                PagingRepeaterCtrlModel.prototype.getAddButtonEnabled = function () {
                    if (typeof this.allowAdd === 'boolean') {
                        return this.allowAdd === true;
                    }
                    if (typeof this.allowAdd === 'function') {
                        return this.allowAdd() === true;
                    }
                    return false;
                };
                PagingRepeaterCtrlModel.prototype.getAddButtonEnabledBindingValue = function () {
                    var _a, _b;
                    if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                        return true;
                    }
                    else {
                        return this.addButtonEnabled();
                    }
                };
                PagingRepeaterCtrlModel.prototype.getAddButtonAriaDisabledBindingValue = function () {
                    var _a, _b;
                    if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                        return !(this.addButtonEnabled());
                    }
                    else {
                        return null;
                    }
                };
                PagingRepeaterCtrlModel.prototype.getRemoveButtonEnabled = function () {
                    if (typeof this.allowRemove === 'boolean') {
                        return (this.allowRemove === true) && this.indexAsNumber() > 0;
                    }
                    if (typeof this.allowRemove === 'function') {
                        return (this.allowRemove() === true) && this.indexAsNumber() > 0;
                    }
                };
                PagingRepeaterCtrlModel.prototype.getRemoveButtonEnabledBindingValue = function () {
                    var _a, _b;
                    if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                        return true;
                    }
                    else {
                        return this.removeButtonEnabled();
                    }
                };
                PagingRepeaterCtrlModel.prototype.getRemoveButtonAriaDisabledBindingValue = function () {
                    var _a, _b;
                    if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                        return !(this.removeButtonEnabled());
                    }
                    else {
                        return null;
                    }
                };
                PagingRepeaterCtrlModel.prototype.setNewIndex = function (newIndex, checkIsValid) {
                    this.isError(false);
                    if (!!checkIsValid === true && ko.unwrap(this.checkItemIsValidBeforeIndexChange) === true) {
                        var currentIdx = this.indexAsNumber();
                        if (currentIdx > 0 && this.collection.$items().length > 0) {
                            var item = this.collection.$items()[currentIdx - 1];
                            this.isError(!item.$isValid());
                        }
                    }
                    if (!this.isError()) {
                        this.isInternalIndexChange = true;
                        this.index(newIndex);
                        this.indexString(newIndex.toString());
                        this.isInternalIndexChange = false;
                    }
                };
                PagingRepeaterCtrlModel.prototype.writeButtonDisabledErrToAriaLiveRegion = function () {
                    var msg = window.sf.localization.currentCulture().errorFormatter.formatButtonDisabled("");
                    sffw.safeWriteToAriaLiveRegion(msg);
                };
                PagingRepeaterCtrlModel.prototype.onLeftButtonClicked = function () {
                    var _a, _b;
                    var isEnabled = this.leftButtonEnabled();
                    if (isEnabled) {
                        var newIndex = this.indexAsNumber() - 1;
                        this.setNewIndex(newIndex, true);
                    }
                    else if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                        this.writeButtonDisabledErrToAriaLiveRegion();
                    }
                };
                PagingRepeaterCtrlModel.prototype.onRightButtonClicked = function () {
                    var _a, _b;
                    var isEnabled = this.rightButtonEnabled();
                    if (isEnabled) {
                        var newIndex = this.indexAsNumber() + 1;
                        this.setNewIndex(newIndex, true);
                    }
                    else if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                        this.writeButtonDisabledErrToAriaLiveRegion();
                    }
                };
                PagingRepeaterCtrlModel.prototype.onAddButtonClicked = function () {
                    var _this = this;
                    var _a, _b;
                    var isEnabled = this.addButtonEnabled();
                    if (isEnabled) {
                        this.collection.$addItem().then(function (item) {
                            var itemIndex = _this.collection.$items().length;
                            _this.setNewIndex(itemIndex, true);
                            if (_this.itemAddHandler) {
                                var itemAddParams = new PagingRepeaterCtrlItemAddParams();
                                itemAddParams.newItem = item;
                                _this.itemAddHandler(null, event, itemAddParams);
                            }
                        });
                    }
                    else if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                        this.writeButtonDisabledErrToAriaLiveRegion();
                    }
                };
                PagingRepeaterCtrlModel.prototype.onRemoveButtonClicked = function () {
                    var _a, _b;
                    var isEnabled = this.removeButtonEnabled();
                    var idx = this.indexAsNumber();
                    if (isEnabled) {
                        var item = this.collection.$items()[idx - 1];
                        this.collection.$items.remove(item);
                        if (idx > this.count() && this.count() > 0) {
                            var newIndex = this.count();
                            this.setNewIndex(newIndex, false);
                        }
                        if (this.itemRemoveHandler) {
                            var itemRemoveParams = new PagingRepeaterCtrlItemRemoveParams();
                            itemRemoveParams.removedItem = item;
                            this.itemRemoveHandler(null, event, itemRemoveParams);
                        }
                    }
                    else if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                        this.writeButtonDisabledErrToAriaLiveRegion();
                    }
                };
                PagingRepeaterCtrlModel.prototype.getTitle = function () {
                    var itemTitle = '';
                    if (this.captionAttName) {
                        var item = this.collection.$items()[this.indexAsNumber() - 1];
                        if (item) {
                            var titleAtt = item[this.captionAttName];
                            if (titleAtt) {
                                itemTitle = " - " + titleAtt.$asString();
                            }
                        }
                    }
                    return " / " + this.count() + itemTitle;
                };
                PagingRepeaterCtrlModel.prototype.getFullCssClass = function (cssClass) {
                    return " " + cssClass + " " + (_.isString(this.iconsAdditionalClass) ? this.iconsAdditionalClass : 'fa-lg fa-fw');
                };
                PagingRepeaterCtrlModel.prototype.getDataHasErrors = function () {
                    if (ko.unwrap(this.indicateDataErrors) === false) {
                        return null;
                    }
                    else {
                        // $isReportingErrors on collection will be added to SF > 1.82
                        var isReportingErrors = (typeof this.collection.$isReportingErrors === 'function') ? this.collection.$isReportingErrors() : true;
                        return isReportingErrors && this.collection.$validationErrors().length > 0;
                    }
                };
                PagingRepeaterCtrlModel.prototype.onCollectionArrayChange = function (collection) {
                    var cnt = collection.length;
                    if (this.indexAsNumber() === 0) {
                        var intl = cnt > 0 ? 1 : 0;
                        this.setNewIndex(intl);
                    }
                    else {
                        if (this.indexAsNumber() > cnt) {
                            this.setNewIndex(cnt);
                        }
                    }
                };
                PagingRepeaterCtrlModel.prototype.onIndexStringChange = function (newValue) {
                    var n = Number(newValue.trim());
                    if (_.isNaN(n) || n < 1 || n > this.count()) {
                        this.indexString(this.index().toString());
                    }
                    else {
                        if (this.index() !== n) {
                            this.isInternalIndexChange = true;
                            this.index(n);
                            this.isInternalIndexChange = false;
                        }
                    }
                };
                PagingRepeaterCtrlModel.prototype.onIndexChange = function (newValue) {
                    if (this.isInternalIndexChange === true) {
                        return;
                    }
                    // if someone from "outside" pushes out-of-range index value, we will ignore it
                    // PagingRepeater returns null as currently displayed item in that case
                    if (this.count() > 0) {
                        if (newValue && newValue > 0 && newValue <= this.count()) {
                            this.indexString(newValue.toString());
                        }
                        else {
                            console.error("PagingRepeaterCtrl: index value=" + newValue + " is out of range.");
                        }
                    }
                    else {
                        console.error("PagingRepeaterCtrl: index value=" + newValue + " is out of range.");
                    }
                };
                PagingRepeaterCtrlModel.prototype.dispose = function () {
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
                };
                return PagingRepeaterCtrlModel;
            }());
            pagingRepeaterCtrl.PagingRepeaterCtrlModel = PagingRepeaterCtrlModel;
        })(pagingRepeaterCtrl = components.pagingRepeaterCtrl || (components.pagingRepeaterCtrl = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var pagingRepeaterCtrl;
        (function (pagingRepeaterCtrl) {
            if (ko && !ko.components.isRegistered('sffw-paging-repeater-ctrl')) {
                ko.components.register('sffw-paging-repeater-ctrl', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.pagingRepeaterCtrl.PagingRepeaterCtrlModel(params, componentInfo); }
                    },
                    template: "\n<div data-bind=\"class: 'sffw-paging-repeater-ctrl-container', css: { 'has-errors': dataHasErrors }\">\n    <div style=\"display:table; float:right\">\n        <!-- ko ifnot: keepArrowsTogether -->\n        <button data-bind=\"css: rightButtonClass, enable: rightButtonEnabledBindingValue,\n            click: onRightButtonClicked, attr: {'aria-disabled': rightButtonAriaDisabledBindingValue }\"></button>\n        <!-- /ko -->\n        <!-- ko if: showAdd -->\n        <button data-bind=\"css: addButtonClass, enable: addButtonEnabledBindingValue,\n            click: onAddButtonClicked, attr: {'aria-disabled': addButtonAriaDisabledBindingValue }\"></button>\n        <!-- /ko -->\n        <!-- ko if: showRemove -->\n        <button data-bind=\"css: removeButtonClass, enable: removeButtonEnabledBindingValue,\n            click: onRemoveButtonClicked, attr: {'aria-disabled': removeButtonAriaDisabledBindingValue }\"></button>\n        <!-- /ko -->\n    </div>\n    <div style=\"display: flex; align-items: center; position: relative\">\n        <button data-bind=\"css: leftButtonClass, enable: leftButtonEnabledBindingValue,\n            click: onLeftButtonClicked, attr: {'aria-disabled': leftButtonAriaDisabledBindingValue }\"></button>\n        <!-- ko if: keepArrowsTogether -->\n        <button data-bind=\"css: rightButtonClass, enable: rightButtonEnabledBindingValue,\n            click: onRightButtonClicked, attr: {'aria-disabled': rightButtonAriaDisabledBindingValue }\"></button>\n        <!-- /ko -->\n        <input class=\"editor-value sffw-paging-repeater-ctrl-index-input\" data-bind=\"value: indexString\" type=\"text\">\n        <div data-bind=\"text: title\" class=\"sffw-paging-repeater-ctrl-title\"></div>\n        <span data-bind=\"visible: dataHasErrors\" class=\"sffw-paging-repeater-ctrl-error-icon\"></span>\n    </div>\n    <span class=\"sffw-paging-repeater-ctrl-error\" data-bind=\"visible: isError, text: $root.$localize('PagingRepeaterCtrl$$isNotValidMessage')\"></span>\n</div>\n"
                });
            }
        })(pagingRepeaterCtrl = components.pagingRepeaterCtrl || (components.pagingRepeaterCtrl = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function safeWriteToAriaLiveRegion(message) {
        if (message && window.sf.accessibility && window.sf.accessibility.ariaLiveRegion) {
            window.sf.accessibility.ariaLiveRegion.append(message);
        }
    }
    sffw.safeWriteToAriaLiveRegion = safeWriteToAriaLiveRegion;
})(sffw || (sffw = {}));
