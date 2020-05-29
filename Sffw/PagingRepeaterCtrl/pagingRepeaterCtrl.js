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
                    this.useFontAwesome = params.UseFontAwesome === false ? false : true;
                    this.iconLeftClass = params.IconLeftClass ? params.IconLeftClass : 'fa-caret-left';
                    this.iconRightClass = params.IconRightClass ? params.IconRightClass : 'fa-caret-right';
                    this.iconAddClass = params.IconAddClass ? params.IconAddClass : 'fa-plus';
                    this.iconRemoveClass = params.IconRemoveClass ? params.IconRemoveClass : 'fa-minus';
                    this.iconSizeClass = params.IconSizeClass ? params.IconSizeClass : 'fa-lg';
                    this.iconsFixedWidth = params.IconsFixedWidth === false ? false : true;
                    this.leftButtonClass = ko.observable('sffw-paging-repeater-ctrl-left'
                        + this.getFontAwesomeIconClasses(this.iconLeftClass));
                    this.rightButtonClass = ko.observable('sffw-paging-repeater-ctrl-right'
                        + this.getFontAwesomeIconClasses(this.iconRightClass));
                    this.addButtonClass = ko.observable('sffw-paging-repeater-ctrl-add'
                        + this.getFontAwesomeIconClasses(this.iconAddClass));
                    this.removeButtonClass = ko.observable('sffw-paging-repeater-ctrl-remove'
                        + this.getFontAwesomeIconClasses(this.iconRemoveClass));
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
                    this.checkItemIsValidBeforeIndexChange = params.CheckItemIsValidBeforeIndexChange;
                    this.title = ko.pureComputed(this.getTitle, this);
                    this.leftButtonEnabled = ko.pureComputed(this.getLeftButtonEnabled, this);
                    this.rightButtonEnabled = ko.pureComputed(this.getRightButtonEnabled, this);
                    this.addButtonEnabled = ko.pureComputed(this.getAddButtonEnabled, this);
                    this.removeButtonEnabled = ko.pureComputed(this.getRemoveButtonEnabled, this);
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
                PagingRepeaterCtrlModel.prototype.getRightButtonEnabled = function () {
                    return this.indexAsNumber() < this.count();
                };
                PagingRepeaterCtrlModel.prototype.getAddButtonEnabled = function () {
                    if (typeof this.allowAdd === 'boolean') {
                        return this.allowAdd;
                    }
                    if (typeof this.allowAdd === 'function') {
                        return this.allowAdd();
                    }
                    return false;
                };
                PagingRepeaterCtrlModel.prototype.getRemoveButtonEnabled = function () {
                    if (typeof this.allowRemove === 'boolean') {
                        return this.allowRemove && this.indexAsNumber() > 0;
                    }
                    if (typeof this.allowRemove === 'function') {
                        return this.allowRemove() && this.indexAsNumber() > 0;
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
                PagingRepeaterCtrlModel.prototype.onLeftButtonClicked = function () {
                    if (this.leftButtonEnabled()) {
                        var newIndex = this.indexAsNumber() - 1;
                        this.setNewIndex(newIndex, true);
                    }
                };
                PagingRepeaterCtrlModel.prototype.onRightButtonClicked = function () {
                    if (this.rightButtonEnabled()) {
                        var newIndex = this.indexAsNumber() + 1;
                        this.setNewIndex(newIndex, true);
                    }
                };
                PagingRepeaterCtrlModel.prototype.onAddButtonClicked = function () {
                    var _this = this;
                    if (this.addButtonEnabled()) {
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
                };
                PagingRepeaterCtrlModel.prototype.onRemoveButtonClicked = function () {
                    var idx = this.indexAsNumber();
                    if (idx > 0) {
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
                };
                PagingRepeaterCtrlModel.prototype.dispose = function () {
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
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
                PagingRepeaterCtrlModel.prototype.getFontAwesomeIconClasses = function (baseIconName) {
                    return this.useFontAwesome ? " fa " + baseIconName + " " + this.iconSizeClass + (this.iconsFixedWidth ? ' fa-fw' : '') : '';
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
                    template: "\n<div class=\"sffw-paging-repeater-ctrl-container\">\n    <div style=\"display:table; float:right\">\n        <button data-bind=\"css: rightButtonClass, enable: rightButtonEnabled, click: onRightButtonClicked\"></button>\n        <button data-bind=\"css: addButtonClass, enable: addButtonEnabled, click: onAddButtonClicked\"></button>\n        <button data-bind=\"css: removeButtonClass, enable: removeButtonEnabled, click: onRemoveButtonClicked\"></button>\n        </div>\n    <div style=\"display: flex; align-items: center\">\n        <button data-bind=\"css: leftButtonClass, enable: leftButtonEnabled, click: onLeftButtonClicked\"></button>\n        <input class=\"editor-value sffw-paging-repeater-ctrl-index-input\" data-bind=\"value: indexString\" type=\"text\">\n        <div data-bind=\"text: title\" class=\"sffw-paging-repeater-ctrl-title\"></div>\n    </div>\n    <span class=\"sffw-paging-repeater-ctrl-error\" data-bind=\"visible: isError, text: $root.$localize('PagingRepeaterCtrl$$isNotValidMessage')\"></span>\n</div>\n"
                });
            }
        })(pagingRepeaterCtrl = components.pagingRepeaterCtrl || (components.pagingRepeaterCtrl = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
