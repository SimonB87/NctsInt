var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var ViewSettingsModel = /** @class */ (function () {
            function ViewSettingsModel(params, componentInfo) {
                var _this = this;
                // IDataColumn arrays
                this.tmpVisibleCols = ko.observableArray();
                this.tmpHiddenCols = ko.observableArray();
                this.selectedHiddenCol = ko.observable();
                this.isEnabled = ko.observable(false);
                this.subscriptions = [];
                this.addColumn = function () {
                    var column = ko.unwrap(_this.selectedHiddenCol);
                    if (column) {
                        _this.tmpVisibleCols.push(column);
                        _this.tmpHiddenCols.remove(column);
                        var visStdCols = _.filter(_this.tmpVisibleCols(), function (col) {
                            return !col.IsReserved;
                        });
                        var visResCols = _.filter(_this.tmpVisibleCols(), function (col) {
                            return col.IsReserved;
                        });
                        _this.tmpVisibleCols(visStdCols.concat(visResCols));
                    }
                };
                this.onBtnRemoveCol = function (column) {
                    _this.tmpVisibleCols.remove(column);
                    _this.tmpHiddenCols.push(column);
                    var hdnStdCols = _.filter(_this.tmpHiddenCols(), function (col) {
                        return !col.IsReserved;
                    });
                    var hdnResCols = _.filter(_this.tmpHiddenCols(), function (col) {
                        return col.IsReserved;
                    });
                    _this.tmpHiddenCols(hdnStdCols.concat(hdnResCols));
                };
                this.onBtnVisibleColUp = function (column) {
                    var colIdx = _this.tmpVisibleCols.indexOf(column);
                    if (colIdx > 0) {
                        var prevCol = _this.tmpVisibleCols()[colIdx - 1];
                        // columns with DisableRemove=true have to be before all other columns and cannot change their position
                        if (prevCol.DisableRemove !== true) {
                            sffw.moveColumn(_this.tmpVisibleCols, column, 'up');
                        }
                    }
                };
                this.onBtnVisibleColDown = function (column) {
                    var colIdx = _this.tmpVisibleCols.indexOf(column);
                    if (colIdx < _this.tmpVisibleCols().length - 1) {
                        var nextCol = _this.tmpVisibleCols()[colIdx + 1];
                        // columns with IsReserved=true have to be after all other columns and cannot change their position
                        if (nextCol.IsReserved !== true) {
                            sffw.moveColumn(_this.tmpVisibleCols, column, 'down');
                        }
                    }
                };
                this.ctrlCore = params.controller.ctrlCore;
                this.dataContext = params.$parentData;
                this.iconUpClass = params.iconUpClass || 'fa fa-arrow-up';
                this.iconDownClass = params.iconDownClass || 'fa fa-arrow-down';
                this.iconLockClass = params.iconLockClass || 'fa fa-lock';
                this.iconTrashClass = params.iconTrashClass || 'fa fa-trash';
                this.subscriptions.push(this.ctrlCore.isViewSettingsComponentEnabled.subscribe(function (enabled) {
                    _this.isEnabled(enabled);
                    if (enabled) {
                        _this.initializeColumns();
                    }
                }));
                this.subscriptions.push(this.selectedHiddenCol.subscribe(this.addColumn));
                this.addColumnString = ko.pureComputed(function () {
                    return _this.dataContext.$localize('ListGridViewSettings$$addColumn');
                });
                this.ctrlCore.setViewSettingsComponentAvailable(true);
            }
            ViewSettingsModel.prototype.initializeColumns = function () {
                var _this = this;
                this.clearViewConfigArrays();
                _.each(this.ctrlCore.getVisibleColumnsCore(true), (function (col) {
                    _this.tmpVisibleCols.push(col);
                }));
                _.each(this.ctrlCore.getHiddenColumnsCore(), (function (col) {
                    _this.tmpHiddenCols.push(col);
                }));
            };
            ViewSettingsModel.prototype.onBtnApplyClick = function () {
                var newVisibleCols = _.map(this.tmpVisibleCols(), function (c) {
                    return c.DisplayColumnName ? c.DisplayColumnName : c.Name;
                });
                this.ctrlCore.setVisibleColumns(newVisibleCols);
            };
            ViewSettingsModel.prototype.onBtnCancelClick = function () {
                this.initializeColumns();
            };
            ViewSettingsModel.prototype.onBtnCloseClick = function () {
                this.ctrlCore.setViewSettingsComponentEnabled(!this.isEnabled());
            };
            ViewSettingsModel.prototype.onBtnResetClick = function () {
                this.ctrlCore.resetColumns();
                this.initializeColumns();
            };
            ViewSettingsModel.prototype.clearViewConfigArrays = function () {
                this.tmpVisibleCols.removeAll();
                this.tmpHiddenCols.removeAll();
            };
            ViewSettingsModel.prototype.dispose = function () {
                _.each(this.subscriptions, function (sub) {
                    sub.dispose();
                });
            };
            return ViewSettingsModel;
        }());
        components.ViewSettingsModel = ViewSettingsModel;
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        if (ko && !ko.components.isRegistered('sffw-viewsettings')) {
            ko.components.register('sffw-viewsettings', {
                viewModel: {
                    createViewModel: function (params, componentInfo) { return new sffw.components.ViewSettingsModel(params, componentInfo); }
                },
                synchronous: true,
                template: "\n<div class=\"sffw-viewsettings\" data-bind=\"visible: isEnabled()\">\n    <div class=\"sffw-viewsettings-inner-wrap\">\n        <span class=\"sffw-viewsettings-caption\" data-bind=\"text: $root.$localize('ListGridViewSettings$$mainCaption')\"></span>\n        <!-- left columns list -->\n        <div class=\"sffw-viewsettings-columns\">\n            <ul data-bind=\"foreach: tmpVisibleCols\">\n                <li>\n                    <div class=\"sffw-viewsettings-column-buttons-updown\">\n                        <!-- ko ifnot: ($data.DisableRemove || $data.IsReserved) -->\n                        <button data-bind=\"css: $parent.iconUpClass, click: $parent.onBtnVisibleColUp, attr: { 'aria-label': $root.$localize('ListGridViewSettings$$moveUp') }\"></button>\n                        <button data-bind=\"css: $parent.iconDownClass, click: $parent.onBtnVisibleColDown, attr: { 'aria-label': $root.$localize('ListGridViewSettings$$moveDown') }\"></button>\n                        <!-- /ko -->\n                    </div>\n                    <span data-bind=\"text: (IsCaptionLocalized === true ? $root.$localize(Caption) : Caption)\"></span>\n                    <div class=\"sffw-viewsettings-column-buttons\">\n                        <!-- ko if: $data.DisableRemove -->\n                        <span data-bind=\"css: $parent.iconLockClass, attr: { 'aria-label': $root.$localize('ListGridViewSettings$$removeDisabled') }\"></span>\n                        <!-- /ko -->\n                        <!-- ko ifnot: $data.DisableRemove -->\n                        <button data-bind=\"css: $parent.iconTrashClass, click: $parent.onBtnRemoveCol, attr: { 'aria-label': $root.$localize('ListGridViewSettings$$removeColumn') }\"></button>\n                        <!-- /ko -->\n                    </div>\n                </li>\n            </ul>\n        </div>\n        <!-- hidden columns -->\n        <div class=\"sffw-viewsettings-column-stack\">\n            <select data-bind=\"options: tmpHiddenCols, optionsText: function(item) {\n                return (item.IsCaptionLocalized === true ? $root.$localize(item.Caption) : item.Caption);\n            }, value: selectedHiddenCol, optionsCaption: addColumnString\"></select>\n        </div>\n        <hr>\n        <!-- buttons -->\n        <div class=\"sffw-viewsettings-footer\">\n            <button class=\"sffw-viewsettings-button\" data-bind=\"click: onBtnApplyClick, text: $root.$localize('ListGridViewSettings$$btnApply')\"></button>\n            <button class=\"sffw-viewsettings-button\" data-bind=\"click: onBtnCancelClick, text: $root.$localize('ListGridViewSettings$$btnCancel')\"></button>\n            <button class=\"sffw-viewsettings-button\" data-bind=\"click: onBtnResetClick, text: $root.$localize('ListGridViewSettings$$btnReset')\"></button>\n            <button class=\"sffw-viewsettings-button\" data-bind=\"click: onBtnCloseClick, text: $root.$localize('ListGridViewSettings$$btnClose')\"></button>\n        </div>\n    </div>\n</div>"
            });
        }
    })(components = sffw.components || (sffw.components = {}));
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
