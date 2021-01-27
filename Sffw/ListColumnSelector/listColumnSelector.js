var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var listColumnSelector;
        (function (listColumnSelector) {
            var ListColumnSelector = /** @class */ (function () {
                function ListColumnSelector(datacontext, args) {
                    this.subscriptions = [];
                    if (args.controller) {
                        if (args.controller.IsGlobal) {
                            this.controller = datacontext.$globals.$api[args.controller.Reference];
                        }
                        else {
                            this.controller = datacontext.$api[args.controller.Reference];
                        }
                    }
                    var locF;
                    if (typeof datacontext.$entities.$localizeText === 'function') {
                        locF = datacontext.$entities.$localizeText;
                    }
                    else {
                        throw new Error('Localization function was not found');
                    }
                    // inject component
                    var componentParams = 'controller: controller, locF: locF';
                    var $injected = this.$columnSelectorComponent = $("<sffw-listcolumn-selector params=\"" + componentParams + "\"></sffw-listcolumn-selector>");
                    $injected.insertAfter("#mainFormHolder");
                    var vm = { controller: this.controller, locF: locF };
                    ko.applyBindings(vm, $injected[0]);
                }
                ListColumnSelector.prototype.dispose = function () {
                    _.each(this.subscriptions, function (sub) { return sub.dispose(); });
                    ko.cleanNode(this.$columnSelectorComponent[0]);
                    this.$columnSelectorComponent.remove();
                };
                return ListColumnSelector;
            }());
            listColumnSelector.ListColumnSelector = ListColumnSelector;
        })(listColumnSelector = api.listColumnSelector || (api.listColumnSelector = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.api.listColumnSelector.ListColumnSelector;
    });
}
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var listColumnSelector;
        (function (listColumnSelector) {
            var ListColumnSelectorModel = /** @class */ (function () {
                function ListColumnSelectorModel(params, componentInfo) {
                    var _this = this;
                    // IDataColumn arrays
                    this.tmpVisibleCols = ko.observableArray();
                    this.tmpHiddenCols = ko.observableArray();
                    // arrays for selected
                    this.selectedVisibleCols = ko.observableArray();
                    this.selectedHiddenCols = ko.observableArray();
                    this.isEnabled = ko.observable(false);
                    this.subscriptions = [];
                    this.onBtnVisibleColUp = function (column) {
                        sffw.moveColumn(_this.tmpVisibleCols, column, 'up');
                    };
                    this.onBtnVisibleColDown = function (column) {
                        sffw.moveColumn(_this.tmpVisibleCols, column, 'down');
                    };
                    if (params.controller) {
                        this.ctrlCore = params.controller.ctrlCore;
                        this.ctrlCore.setViewSettingsComponentAvailable(true);
                        this.subscriptions.push(this.ctrlCore.isViewSettingsComponentEnabled.subscribe(function (enabled) {
                            _this.isEnabled(enabled);
                            if (enabled) {
                                _this.initializeColumns();
                                // inject backdrop
                                _this.$componentBackdrop = $("<div class=\"sffw-listcolumn-selector-modal-backdrop fade in\"></div>");
                                _this.$componentBackdrop.insertAfter("#mainFormHolder");
                            }
                            else {
                                // remove backdrop
                                _this.$componentBackdrop.remove();
                            }
                        }));
                    }
                    this.locF = params.locF;
                }
                ListColumnSelectorModel.prototype.initializeColumns = function () {
                    var _this = this;
                    this.clearViewConfigArrays();
                    _.each(this.ctrlCore.getVisibleColumnsCore(), (function (col) {
                        _this.tmpVisibleCols.push(col);
                    }));
                    _.each(this.ctrlCore.getHiddenColumnsCore(), (function (col) {
                        _this.tmpHiddenCols.push(col);
                    }));
                };
                ListColumnSelectorModel.prototype.onBtnApplyClick = function () {
                    var newVisibleCols = _.map(this.tmpVisibleCols(), function (c) {
                        return c.DisplayColumnName ? c.DisplayColumnName : c.Name;
                    });
                    this.ctrlCore.setVisibleColumns(newVisibleCols);
                };
                ListColumnSelectorModel.prototype.onBtnCloseClick = function () {
                    this.ctrlCore.setViewSettingsComponentEnabled(!this.isEnabled());
                };
                ListColumnSelectorModel.prototype.onBtnResetClick = function () {
                    this.ctrlCore.resetColumns();
                    this.initializeColumns();
                };
                ListColumnSelectorModel.prototype.clearViewConfigArrays = function () {
                    this.selectedVisibleCols.removeAll();
                    this.selectedHiddenCols.removeAll();
                    this.tmpVisibleCols.removeAll();
                    this.tmpHiddenCols.removeAll();
                };
                ListColumnSelectorModel.prototype.onBtnColsToLeftClick = function () {
                    var _this = this;
                    var sc = this.selectedVisibleCols();
                    var selectedColums = _.filter(this.tmpVisibleCols(), function (col) {
                        return _.indexOf(sc, col) > -1;
                    });
                    _.each(selectedColums, function (col) {
                        _this.tmpHiddenCols.push(col);
                    });
                    this.tmpVisibleCols(this.tmpVisibleCols().filter(function (col) {
                        return _.indexOf(sc, col) === -1;
                    }));
                    this.selectedVisibleCols.removeAll();
                };
                ListColumnSelectorModel.prototype.onBtnColsToRightClick = function () {
                    var _this = this;
                    var sc = this.selectedHiddenCols();
                    var selectedColums = _.filter(this.tmpHiddenCols(), function (col) {
                        return _.indexOf(sc, col) > -1;
                    });
                    _.each(selectedColums, function (col) {
                        _this.tmpVisibleCols.push(col);
                    });
                    this.tmpHiddenCols(this.tmpHiddenCols().filter(function (col) {
                        return _.indexOf(sc, col) === -1;
                    }));
                    this.selectedHiddenCols.removeAll();
                };
                ListColumnSelectorModel.prototype.dispose = function () {
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
                    if (this.$componentBackdrop) {
                        ko.cleanNode(this.$componentBackdrop[0]);
                        this.$componentBackdrop.remove();
                        this.$componentBackdrop = null;
                    }
                };
                return ListColumnSelectorModel;
            }());
            listColumnSelector.ListColumnSelectorModel = ListColumnSelectorModel;
        })(listColumnSelector = api.listColumnSelector || (api.listColumnSelector = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var listColumnSelector;
        (function (listColumnSelector) {
            if (ko && !ko.components.isRegistered('sffw-listcolumn-selector')) {
                ko.components.register('sffw-listcolumn-selector', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new listColumnSelector.ListColumnSelectorModel(params, componentInfo); }
                    },
                    template: "\n<div class=\"sffw-listcolumn-selector-container\" data-bind=\"visible: isEnabled()\">\n    <div class=\"sffw-listcolumn-selector\">\n        <!-- left columns list -->\n        <div class=\"sffw-listcolumn-selector-columns columns-excluded\">\n            <span data-bind=\"text: $root.locF('ListColumnSelector$$excludedColumns')\"></span>\n            <ul data-bind=\"foreach: tmpHiddenCols\">\n                <li>\n                    <label>\n                        <input type=\"checkbox\" data-bind=\"value: name, checkedValue: $data, checked: $parent.selectedHiddenCols\" />\n                        <span data-bind=\"text: (IsCaptionLocalized === true ? $root.locF(Caption) : Caption)\" />\n                    </label>\n                </li>\n            </ul>\n        </div>\n        <!-- buttons -->\n        <div class=\"sffw-listcolumn-selector-buttons\">\n            <button class=\"sffw-listcolumn-selector-button\" data-bind=\"click: onBtnColsToRightClick, attr: { 'aria-label': $root.locF('ListColumnSelector$$moveRight') }\">--></button>\n            <button class=\"sffw-listcolumn-selector-button\" data-bind=\"click: onBtnColsToLeftClick, attr: { 'aria-label': $root.locF('ListColumnSelector$$moveLeft') }\"><--</button>\n            <button class=\"sffw-listcolumn-selector-button\" data-bind=\"click: onBtnApplyClick, text: $root.locF('ListColumnSelector$$btnApply')\"></button>\n            <button class=\"sffw-listcolumn-selector-button\" data-bind=\"click: onBtnResetClick, text: $root.locF('ListColumnSelector$$btnReset')\"></button>\n            <button class=\"sffw-listcolumn-selector-button\" data-bind=\"click: onBtnCloseClick, text: $root.locF('ListColumnSelector$$btnClose')\"></button>\n        </div>\n        <!-- right columns list -->\n        <div class=\"sffw-listcolumn-selector-columns\">\n            <span data-bind=\"text: $root.locF('ListColumnSelector$$selectedColumns')\"></span>\n            <ul data-bind=\"foreach: tmpVisibleCols\">\n                <li>\n                    <label>\n                        <input type=\"checkbox\" data-bind=\"value: name, checkedValue: $data, checked: $parent.selectedVisibleCols\" />\n                        <span data-bind=\"text: (IsCaptionLocalized === true ? $root.locF(Caption) : Caption)\" />\n                    </label>\n                    <div>\n                        <button data-bind=\"click: $parent.onBtnVisibleColUp, attr: { 'aria-label': $root.locF('ListColumnSelector$$moveUp') }\">&uarr;</button>\n                        <button data-bind=\"click: $parent.onBtnVisibleColDown, attr: { 'aria-label': $root.locF('ListColumnSelector$$moveDown') }\">&darr;</button>\n                    </div>\n                </li>\n            </ul>\n        </div>\n    </div>\n</div>"
                });
            }
        })(listColumnSelector = api.listColumnSelector || (api.listColumnSelector = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function assert(condition, message) {
        if (!condition) {
            if (message) {
                console.error('Assertion failed: ' + message);
            }
            else {
                console.error('Assertion failed');
            }
        }
    }
    sffw.assert = assert;
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function moveColumn(array, item, direction) {
        var currentPos = array.indexOf(item);
        if (direction === 'up') {
            if (currentPos > 0) {
                array.splice(currentPos, 1);
                array.splice(currentPos - 1, 0, item);
            }
        }
        if (direction === 'down') {
            if (currentPos < array().length - 1) {
                array.splice(currentPos, 1);
                array.splice(currentPos + 1, 0, item);
            }
        }
    }
    sffw.moveColumn = moveColumn;
})(sffw || (sffw = {}));
