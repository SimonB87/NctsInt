var fp = window.flatpickr;
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var list;
        (function (list) {
            'use strict';
            var handlers = ko.bindingHandlers;
            var fpChangeHandler = function (par, selectedDates, dateStr, instance) {
                if (par.att && par.element) {
                    par.att(selectedDates[0]);
                }
            };
            handlers.filterDatePicker = handlers.filterDatePicker || {
                init: function (element, valueAccessor) {
                    $(element).attr('autocomplete', 'off');
                    var att = valueAccessor();
                    var onChangePar = {
                        att: att,
                        element: element
                    };
                    var config = {
                        allowInput: true,
                        enableTime: false,
                        onChange: fpChangeHandler.bind(null, onChangePar)
                    };
                    if (window.sf.localization.currentCulture() && typeof (window.sf.localization.currentCulture().strToDate) === 'function') {
                        config.parseDate = window.sf.localization.currentCulture().strToDate;
                    }
                    var prepareFlatPickrCulture = function () {
                        if (currentCultureCode()) {
                            _.forOwn(window.sf.localization.currentCulture().flatpickrConfig, function (value, key) {
                                if (key !== 'dateFormat') {
                                    config[key] = value;
                                }
                                else {
                                    // remove time from dateFormat
                                    config[key] = value.toString().replace(' H:i', '');
                                }
                            });
                            var cultureConfig = config.l10ns;
                            fp.l10ns[currentCultureCode()] = cultureConfig;
                        }
                    };
                    var currentCultureCode = window.sf.localization.currentCultureCode;
                    if (currentCultureCode()) {
                        prepareFlatPickrCulture();
                        config.locale = currentCultureCode();
                    }
                    var flatpickr = new window.flatpickr(element, config);
                    var subscription = att.subscribe(function () {
                        if (att()) {
                            flatpickr.setDate(att());
                        }
                        else {
                            flatpickr.clear();
                        }
                    });
                    // set value to current attribute value
                    flatpickr.setDate(att() || null, true);
                    element.value = att();
                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        subscription.dispose();
                        cultureChangeSubscription.dispose();
                        flatpickr.destroy();
                        att = null;
                        config = null;
                        flatpickr = null;
                    });
                    var cultureChangeSubscription = currentCultureCode.subscribe(function () {
                        prepareFlatPickrCulture();
                        flatpickr.set('locale', currentCultureCode());
                        flatpickr.set('dateFormat', config.dateFormat);
                        if (typeof (window.sf.localization.currentCulture().strToDate) === 'function') {
                            flatpickr.set('parseDate', window.sf.localization.currentCulture().strToDate);
                        }
                        flatpickr.setDate(att() || null, false);
                    });
                }
            };
            handlers.winsize = handlers.winsize || {
                init: function (element, valueAccessor) {
                    var resizeHandler = function () {
                        var value = valueAccessor();
                        value({ width: $(window).width(), height: $(window).height() });
                    };
                    $(window).on('resize', resizeHandler);
                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        $(window).off('resize', resizeHandler);
                    });
                }
            };
            var FilterOptionsWidget = /** @class */ (function () {
                function FilterOptionsWidget(element, isExpandedAtt, viewModel) {
                    var _this = this;
                    this.element = element;
                    this.isExpandedAtt = isExpandedAtt;
                    this.viewModel = viewModel;
                    this.$cbox = $(element).find('[role="combobox"]');
                    this.$lbox = $(element).find('[role="listbox"]');
                    // Events
                    this.$cbox.on('click', function (e) {
                        _this.toggleLB();
                        // if any other widget is opened then close it
                        var $others = $('div[role="combobox"]').filter(function (i, comboDiv) {
                            return !_this.$cbox.is(comboDiv);
                        });
                        _.each($others, function (comboDiv) {
                            var widget = $(comboDiv).parent().data('ui-filterOptionsWidget');
                            if (widget && widget.isOpen()) {
                                widget.closeLB();
                            }
                        });
                        e.stopPropagation();
                    });
                    var altPressed = false;
                    this.$cbox.on('keydown', function (e) {
                        switch (e.which) {
                            case 18:
                                altPressed = true;
                                break;
                            case 9:
                                if (_this.isOpen()) {
                                    _this.closeLB();
                                }
                                return true;
                            case 13:
                            case 32:
                                _this.toggleLB();
                                if (_this.isOpen()) {
                                    _this.$lbox.focus();
                                    _this.setActiveDescendant(_this.getDefaultOption());
                                }
                                e.preventDefault();
                                break;
                            case 38:
                                if (altPressed === true) {
                                    _this.closeLB();
                                }
                                else if (!_this.isOpen()) {
                                    _this.openLB();
                                    _this.$lbox.focus();
                                    _this.setActiveDescendant(_this.getDefaultOption());
                                    e.preventDefault();
                                }
                                break;
                            case 40:
                                if (!_this.isOpen()) {
                                    _this.openLB();
                                }
                                _this.$lbox.focus();
                                _this.setActiveDescendant(_this.getDefaultOption());
                                e.preventDefault();
                                break;
                            default:
                                return true;
                        }
                        return false;
                    });
                    this.$cbox.on('keyup', function (e) {
                        if (e.which === 18) {
                            altPressed = false;
                        }
                    });
                    this.$lbox.on('keydown', function (e) {
                        switch (e.which) {
                            case 18:
                                altPressed = true;
                                break;
                            case 9:
                                if (_this.isOpen()) {
                                    _this.closeLB();
                                }
                                return true;
                            case 27:
                                if (_this.isOpen()) {
                                    _this.closeLB();
                                    _this.$cbox.focus();
                                }
                                break;
                            case 13:
                                _this.toggleSelection(_this.getActiveDescendant());
                                _this.closeLB();
                                _this.$cbox.focus();
                                break;
                            case 32:
                                _this.toggleSelection(_this.getActiveDescendant());
                                e.preventDefault();
                                break;
                            case 38:
                                if (altPressed === true) {
                                    _this.closeLB();
                                    _this.$cbox.focus();
                                }
                                else {
                                    _this.setActiveDescendant(_this.getPreviousOption());
                                    e.preventDefault();
                                }
                                break;
                            case 40:
                                _this.setActiveDescendant(_this.getNextOption());
                                e.preventDefault();
                                break;
                            default:
                                return true;
                        }
                        return false;
                    });
                    this.$lbox.on('keyup', function (e) {
                        if (e.which === 18) {
                            altPressed = false;
                        }
                    });
                    $('html').on('click', function () {
                        if (_this.isOpen()) {
                            _this.closeLB();
                        }
                    });
                    $('html').on('keydown', function (e) {
                        if (e.which === 27 && _this.isOpen()) {
                            _this.closeLB();
                        }
                    });
                }
                FilterOptionsWidget.prototype.isOpen = function () {
                    if (this.$cbox.attr('aria-expanded') === 'true') {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                FilterOptionsWidget.prototype.openLB = function () {
                    this.$cbox.attr('aria-expanded', 'true');
                    this.$lbox.show();
                    this.isExpandedAtt(true);
                };
                FilterOptionsWidget.prototype.closeLB = function () {
                    this.$cbox.attr('aria-expanded', 'false');
                    this.$lbox.hide();
                    this.clearActiveDescendant();
                    this.isExpandedAtt(false);
                };
                FilterOptionsWidget.prototype.toggleLB = function () {
                    if (this.isOpen()) {
                        this.closeLB();
                        this.$cbox.focus();
                    }
                    else {
                        this.openLB();
                    }
                };
                FilterOptionsWidget.prototype.getActiveDescendant = function () {
                    if (this.$lbox.attr('aria-activedescendant')) {
                        return $('#' + this.$lbox.attr('aria-activedescendant'));
                    }
                    return null;
                };
                FilterOptionsWidget.prototype.setActiveDescendant = function ($option) {
                    var optionLi = $option.prop('tagName').toLowerCase() === 'li' ? $option : $option.parent();
                    if (this.getActiveDescendant()) {
                        this.getActiveDescendant().removeClass('activedescendant');
                    }
                    this.$lbox.attr('aria-activedescendant', optionLi.attr('id'));
                    $('#' + this.$lbox.attr('aria-activedescendant')).attr('class', 'activedescendant');
                    // if listbox is scrollable (max visible filter options is set), option can be out of listbox visible area -> scroll
                    var optionTop = optionLi.offset().top;
                    var selectTop = this.$lbox.offset().top;
                    this.$lbox.scrollTop(this.$lbox.scrollTop() + (optionTop - selectTop));
                };
                FilterOptionsWidget.prototype.clearActiveDescendant = function () {
                    if (this.getActiveDescendant()) {
                        this.getActiveDescendant().removeClass('activedescendant');
                    }
                    this.$lbox.attr('aria-activedescendant', '');
                };
                FilterOptionsWidget.prototype.toggleSelection = function ($option) {
                    var optionCheckbox = $option.find('input[type="checkbox"]');
                    if ($option.attr('aria-selected') === 'true') {
                        // aria-selected is changed in rendering template when filterEnumSelectedValue is changed
                        // $option.attr('aria-selected', 'false');
                        this.viewModel.filterEnumSelectedValue.remove(optionCheckbox.attr('value'));
                    }
                    else {
                        // $option.attr('aria-selected', 'true');
                        this.viewModel.filterEnumSelectedValue.push(optionCheckbox.attr('value'));
                    }
                };
                FilterOptionsWidget.prototype.getDefaultOption = function () {
                    if ($('li[aria-selected="true"]', this.$lbox).length > 0) {
                        return $('li[aria-selected="true"]', this.$lbox).eq(0);
                    }
                    else {
                        return $('li:first-child', this.$lbox);
                    }
                };
                FilterOptionsWidget.prototype.getNextOption = function () {
                    if (this.getActiveDescendant()) {
                        var ad_index = this.getActiveDescendant().index();
                        if (ad_index === $('li', this.$lbox).length - 1) {
                            return $('li:first-child', this.$lbox);
                        }
                        else {
                            return $('li', this.$lbox).eq(ad_index + 1);
                        }
                    }
                    else {
                        return this.getDefaultOption();
                    }
                };
                FilterOptionsWidget.prototype.getPreviousOption = function () {
                    if (this.getActiveDescendant()) {
                        var ad_index = this.getActiveDescendant().index();
                        if (ad_index === 0) {
                            return $('li:last-child', this.$lbox);
                        }
                        else {
                            return $('li', this.$lbox).eq(ad_index - 1);
                        }
                    }
                    else {
                        return this.getDefaultOption();
                    }
                };
                // call after li items are rendered
                FilterOptionsWidget.prototype.registerClickHandlers = function () {
                    var _this = this;
                    $('li', this.$lbox).on('click', function (e) {
                        _this.toggleSelection($(e.currentTarget));
                        _this.setActiveDescendant($(e.currentTarget));
                        e.stopPropagation();
                    });
                    $('li input[type=checkbox]', this.$lbox).on('click', function (e) {
                        _this.setActiveDescendant($(e.currentTarget));
                        e.stopPropagation();
                    });
                };
                return FilterOptionsWidget;
            }());
            handlers.filterOptionsSelect = handlers.filterOptionsSelect || {
                init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    $(element).data('ui-filterOptionsWidget', new FilterOptionsWidget(element, valueAccessor(), viewModel));
                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        $(element).removeData('ui-filterOptionsWidget');
                    });
                }
            };
            handlers.filterOptionsAfterRender = handlers.filterOptionsAfterRender || {
                update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    ko.unwrap(valueAccessor());
                    var lbox = $(element);
                    var widget = lbox.parent().data('ui-filterOptionsWidget');
                    if (widget) {
                        widget.registerClickHandlers();
                    }
                }
            };
        })(list = components.list || (components.list = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var list;
        (function (list) {
            var SelectOption = /** @class */ (function () {
                function SelectOption(value, text, ariaLabel) {
                    this.value = value;
                    this.text = text;
                    this.ariaLabel = ariaLabel;
                }
                return SelectOption;
            }());
            list.SelectOption = SelectOption;
            var ListColumnModel = /** @class */ (function () {
                function ListColumnModel(column, dc, maxVisibleFilterOptions, colDefIndex) {
                    var _this = this;
                    this.colDefIndex = colDefIndex;
                    this.localization = window.sf.localization;
                    this.filterText = ko.observable('');
                    this.isFilterActive = ko.observable(false);
                    this.width = ko.observable('');
                    this.hasEnumFilter = ko.observable(false);
                    this.formatAsAmount = false;
                    this.formatAsCurrency = false;
                    this.filterEnumOptions = ko.observableArray([]);
                    this.filterEnumSelectedValue = ko.observableArray([]);
                    this.filterEnumRepositionTrigger = ko.observable(0);
                    this.filterBoolSelectedValue = ko.observable();
                    // filter date range (type Date)
                    this.filterDateRangeFrom = ko.observable();
                    this.filterDateRangeTo = ko.observable();
                    // displayed filter date according to culture info (type String)
                    this.filterDisplayFrom = ko.observable('');
                    this.filterDisplayTo = ko.observable('');
                    this.ddFilterFocus = ko.observable();
                    this.ddFocus = ko.observable();
                    this.boolOptions = ko.observableArray();
                    // helper observable for handling windows resize and re-setting position in filterDropDownLeft()
                    this.windowSize = ko.observable();
                    this.filterDropDownExpanded = ko.observable();
                    this.filterDropDownHeight = ko.pureComputed(function () {
                        if (_this.filterDropDownExpanded() && _.isNumber(ko.unwrap(_this.maxVisibleFilterOptions))) {
                            var ddElem = $("#" + _this.ddFilterUniqueId);
                            var itmHeight = ddElem.find('li').first().outerHeight();
                            var borderHeight = ddElem.outerHeight() - ddElem.innerHeight();
                            return ((ko.unwrap(_this.maxVisibleFilterOptions) * itmHeight) + borderHeight).toString() + 'px';
                        }
                        return null;
                    });
                    this.filterDropDownLeft = ko.pureComputed(function () {
                        if (_this.filterDropDownExpanded() === true) {
                            // dummy read to force recalc when windowSize changed
                            _this.windowSize();
                            // dummy read to force recalc when selection changed
                            _this.filterEnumRepositionTrigger();
                            var posLeft = null;
                            var comboRoleDiv = $("#" + _this.filterUniqueId).parent();
                            var dd = $("#" + _this.ddFilterUniqueId);
                            var ddWidth = dd.outerWidth();
                            var comboRoleDivPos = comboRoleDiv.offset().left;
                            var comboRoleDivWidth = comboRoleDiv.outerWidth();
                            var winWidth = $(window).innerWidth();
                            // wrapper element has now position relative, so filterDd can have left 0px
                            // only if items are wide and we are out of window width, we position filterDd to the right edge of filter value element
                            if (comboRoleDivPos + ddWidth >= winWidth) {
                                posLeft = comboRoleDivWidth - ddWidth;
                            }
                            else {
                                posLeft = 0;
                            }
                            return posLeft + "px";
                        }
                        return 0;
                    });
                    this.filterDropDownMinWidth = ko.pureComputed(function () {
                        if (_this.filterDropDownExpanded() === true) {
                            // dummy read to force recalc when windowSize changed
                            _this.windowSize();
                            // dummy read to force recalc when selection changed
                            _this.filterEnumRepositionTrigger();
                            var comboRoleDiv = $("#" + _this.filterUniqueId).parent();
                            var minWidth = comboRoleDiv.outerWidth();
                            return minWidth + "px";
                        }
                        return null;
                    });
                    this.ddOverflow = ko.observable();
                    this.subscriptions = [];
                    this.dataContext = dc;
                    if (column.DisplayColumnName && column.DisplayColumnName.length > 0) {
                        this.dispName = column.DisplayColumnName;
                    }
                    if (column.Name && column.Name.length > 0) {
                        this.name = column.Name;
                        this.dispName = this.dispName || this.name;
                    }
                    this.dataType = this.dispDataType = column.DataType && column.DataType.length > 0 ? column.DataType : 'string';
                    if (column.DisplayDataType && column.DisplayDataType.length > 0) {
                        this.dispDataType = column.DisplayDataType;
                    }
                    this.caption = column.Caption;
                    if (column.ColumnWidth && column.ColumnWidth.length > 0) {
                        this.width(column.ColumnWidth);
                    }
                    this.isCaptionLocalized = column.IsCaptionLocalized === true ? true : false;
                    this.isHtml = column.IsHtml;
                    if (column.formatAsAmount) {
                        this.formatAsAmount = column.formatAsAmount;
                    }
                    if (column.formatAsCurrency) {
                        this.formatAsCurrency = column.formatAsCurrency;
                    }
                    this.filterOptionSourceDisplayMember = column.filterOptionSourceDisplayMember;
                    if (column.filterOptionSource) {
                        this.filterOptionSource = column.filterOptionSource;
                        this.filterEnumOptions(this.getFilterEnumOptionsFromSource());
                        this.hasEnumFilter(true);
                        this.subscriptions.push(this.filterOptionSource.items.subscribe(this.onFilterOptionSourceChanged, this));
                    }
                    else if (column.filterOptions && column.filterOptions.length > 0) {
                        _.each(column.filterOptions, function (item) {
                            _this.filterEnumOptions.push(item);
                        });
                        this.hasEnumFilter(true);
                    }
                    this.maxVisibleFilterOptions = maxVisibleFilterOptions;
                    this.filterEnabled = (this.dataType === 'string' || this.dataType === 'integer' || this.dataType === 'decimal' ||
                        this.dataType === 'bool' || this.dataType === 'date') && (column.EnableFilter !== false);
                    this.titleTextAttName = column.TitleTextAttName;
                    if (this.dataType === 'bool') {
                        this.createLocalizedBoolFilterOptions();
                        this.subscriptions.push(window.sf.localization.currentCultureCode.subscribe(function () {
                            _this.createLocalizedBoolFilterOptions();
                        }));
                    }
                    if (this.dataType === 'date') {
                        this.subscriptions.push(this.filterDateRangeFrom.subscribe(function (newVal) {
                            if (newVal != null) {
                                _this.filterDisplayFrom(_this.localization.currentCulture().dateToStr(newVal));
                            }
                            else {
                                _this.filterDisplayFrom('');
                            }
                        }));
                        this.subscriptions.push(this.filterDateRangeTo.subscribe(function (newVal) {
                            if (newVal != null) {
                                _this.filterDisplayTo(_this.localization.currentCulture().dateToStr(newVal));
                            }
                            else {
                                _this.filterDisplayTo('');
                            }
                        }));
                        this.subscriptions.push(this.filterDisplayFrom.subscribe(function (newVal) {
                            if (newVal === '') {
                                _this.filterDateRangeFrom(null);
                            }
                        }));
                        this.subscriptions.push(this.filterDisplayTo.subscribe(function (newVal) {
                            if (newVal === '') {
                                _this.filterDateRangeTo(null);
                            }
                        }));
                    }
                    if (this.hasEnumFilter() === true) {
                        var uniqueId = sffw.generateRandomId();
                        this.filterUniqueId = this.dispName + "-" + uniqueId;
                        this.ddFilterUniqueId = this.dispName + "-dd-" + uniqueId;
                        this.filterEnumSelectedOptionText = ko.pureComputed(this.getfilterEnumSelectedOptionText, this);
                        this.ddOverflow(this.getFilterDdOverflow());
                    }
                }
                ListColumnModel.prototype.createLocalizedBoolFilterOptions = function () {
                    var culture = window.sf.localization.currentCulture();
                    this.boolOptions.removeAll();
                    this.boolOptions.push(new SelectOption(null, '', this.dataContext.$localize('ListGrid2$$notSet')));
                    this.boolOptions.push(new SelectOption(true, culture.boolToStr(true)));
                    this.boolOptions.push(new SelectOption(false, culture.boolToStr(false)));
                };
                ListColumnModel.prototype.setOptionAriaLabel = function (option, item) {
                    if (item.ariaLabel) {
                        $(option).attr('aria-label', item.ariaLabel);
                    }
                };
                ListColumnModel.prototype.getfilterEnumSelectedOptionText = function () {
                    var _this = this;
                    var result = _.map(this.filterEnumSelectedValue(), function (filterVal) {
                        var itm = _.find(_this.filterEnumOptions(), function (filterOption) {
                            return filterOption.value === filterVal;
                        });
                        return itm ? itm.isLocalized === true ? _this.dataContext.$localize(itm.text) : ko.unwrap(itm.text) : filterVal;
                    });
                    return result;
                };
                ListColumnModel.prototype.getFilterEnumOptionsFromSource = function () {
                    var result = [];
                    var displayMemberName = this.filterOptionSourceDisplayMember || this.filterOptionSource.getDisplayMemberName();
                    var valueMemberName = this.filterOptionSource.getValueMemberName();
                    var codelistItems = _.orderBy(this.filterOptionSource.items(), displayMemberName);
                    _.each(codelistItems, function (itm) {
                        var item;
                        if (itm[displayMemberName]) {
                            item = { value: itm[valueMemberName].toString(), text: itm[displayMemberName] };
                        }
                        else {
                            item = { value: itm[valueMemberName].toString(), text: itm[valueMemberName] };
                        }
                        result.push(item);
                    });
                    return result;
                };
                ListColumnModel.prototype.getFilterDdOverflow = function () {
                    var mfo = ko.unwrap(this.maxVisibleFilterOptions);
                    if (_.isNumber(mfo) && this.filterEnumOptions().length > mfo) {
                        // in FF default overflow in combination with max-height eats inner horizontal space and long items are wrapping
                        return '-moz-scrollbars-vertical';
                    }
                    return null;
                };
                ListColumnModel.prototype.onFilterOptionSourceChanged = function () {
                    this.filterEnumOptions.removeAll();
                    this.filterEnumOptions(this.getFilterEnumOptionsFromSource());
                    this.ddOverflow(this.getFilterDdOverflow());
                };
                ListColumnModel.prototype.clearFilterValue = function () {
                    if (this.isFilterActive() === false) {
                        return;
                    }
                    this.isFilterActive(false);
                    if (this.hasEnumFilter() === true) {
                        this.filterEnumSelectedValue.removeAll();
                    }
                    else {
                        switch (this.dataType) {
                            case 'string':
                            case 'integer':
                            case 'decimal':
                                this.filterText('');
                                break;
                            case 'date':
                                this.filterDateRangeFrom(null);
                                this.filterDateRangeTo(null);
                                break;
                            case 'bool':
                                this.filterBoolSelectedValue(null);
                                break;
                        }
                    }
                };
                ListColumnModel.prototype.dispose = function () {
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
                };
                return ListColumnModel;
            }());
            list.ListColumnModel = ListColumnModel;
        })(list = components.list || (components.list = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var list;
        (function (list) {
            'use strict';
            var ListDataRecord = /** @class */ (function () {
                function ListDataRecord($dataStruct, columns, rowSelectedPropName, rowMarkedPropName, checkboxInRowAttName) {
                    var _this = this;
                    this.$dataStruct = $dataStruct;
                    this.rowSelectedPropName = rowSelectedPropName;
                    this.rowMarkedPropName = rowMarkedPropName;
                    this.checkboxInRowAttName = checkboxInRowAttName;
                    this.$rowCss = ko.pureComputed(function () {
                        var classes = [];
                        // marked rows should not apply any additional styles (selected, odd-even, hover...)
                        if (_this.$marked()) {
                            classes.push('sffw-list-marked-row');
                        }
                        else {
                            if (_this.$selected()) {
                                classes.push('sffw-list-selected-row');
                            }
                            if (_this.$colorIndicator()) {
                                classes.push('sffw-list-colorindicator-' + _this.$colorIndicator().toLowerCase());
                            }
                        }
                        return classes.join(' ');
                    });
                    if (typeof ($dataStruct[this.rowSelectedPropName]) !== 'undefined') {
                        this.$selected = $dataStruct[this.rowSelectedPropName].$value;
                    }
                    else {
                        this.$selected = ko.observable(false);
                    }
                    if (typeof ($dataStruct[this.rowMarkedPropName]) !== 'undefined') {
                        this.$marked = $dataStruct[this.rowMarkedPropName].$value;
                    }
                    else {
                        this.$marked = ko.observable(false);
                    }
                    if (typeof ($dataStruct[this.checkboxInRowAttName]) !== 'undefined') {
                        this.$checkbox = $dataStruct[this.checkboxInRowAttName].$hasValue() ? $dataStruct[this.checkboxInRowAttName].$value : ko.observable(false);
                    }
                    else {
                        this.$checkbox = ko.observable();
                    }
                    this.$colorIndicator = ko.observable();
                    var culture = window.sf.localization.currentCulture();
                    _.forEach(columns, function (column) {
                        var attValue = $dataStruct[column.dispName];
                        switch (column.dispDataType) {
                            case 'string':
                            case 'integer':
                                if (attValue === null || _.isUndefined(attValue) || (typeof (attValue.$hasValue) === 'function' && attValue.$hasValue() === false)) {
                                    _this[column.dispName] = '';
                                }
                                else if (column.formatAsAmount || column.formatAsCurrency) {
                                    _this[column.dispName] = sffw.formatAsAmountOrCurrency(typeof (attValue.$asString) === 'function' ? attValue.$asString() : attValue, column.formatAsAmount, column.formatAsCurrency);
                                }
                                else {
                                    _this[column.dispName] = typeof (attValue.$asString) === 'function' ? attValue.$asString() : attValue;
                                }
                                break;
                            case 'decimal':
                                if (attValue === null || _.isUndefined(attValue) || (typeof (attValue.$hasValue) === 'function' && attValue.$hasValue() === false)) {
                                    _this[column.dispName] = '';
                                }
                                else if (column.formatAsAmount || column.formatAsCurrency) {
                                    _this[column.dispName] = sffw.formatAsAmountOrCurrency(typeof (attValue.$asString) === 'function' ? attValue.$asString() : culture.decimalToStr(attValue), column.formatAsAmount, column.formatAsCurrency);
                                }
                                else {
                                    _this[column.dispName] = typeof (attValue.$asString) === 'function' ? attValue.$asString() : culture.decimalToStr(attValue);
                                }
                                break;
                            case 'date':
                                if (attValue === null || _.isUndefined(attValue) || (typeof (attValue.$hasValue) === 'function' && attValue.$hasValue() === false)) {
                                    _this[column.dispName] = '';
                                }
                                else {
                                    _this[column.dispName] = typeof (attValue.$asString) === 'function' ? attValue.$asString() : culture.dateToStr(moment(attValue).toDate());
                                }
                                break;
                            case 'bool':
                                if (attValue === null || _.isUndefined(attValue) || (typeof (attValue.$hasValue) === 'function' && attValue.$hasValue() === false)) {
                                    _this[column.dispName] = '';
                                }
                                else {
                                    _this[column.dispName] = typeof (attValue.$asString) === 'function' ? attValue.$asString() : culture.boolToStr(attValue);
                                }
                                break;
                            default:
                                throw new Error("Unknown column type " + column.dataType + " in ListGridDataRecord constructor");
                        }
                        if (column.dispName === 'ColorIndicator' && attValue) {
                            _this.$colorIndicator(attValue);
                        }
                    });
                }
                return ListDataRecord;
            }());
            list.ListDataRecord = ListDataRecord;
        })(list = components.list || (components.list = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var list;
        (function (list) {
            var ListViewModel = /** @class */ (function () {
                function ListViewModel(params, componentInfo) {
                    var _this = this;
                    this.columns = [];
                    this.visibleColumns = ko.observableArray();
                    this.hiddenColumns = ko.observableArray();
                    this.reservedColumns = ko.observableArray();
                    this.records = ko.observableArray();
                    this.pageBackEnabled = ko.pureComputed(function () {
                        return _this.pageNumber() > 1;
                    });
                    this.pageBackEnabledBindingValue = ko.pureComputed(function () {
                        var _a, _b;
                        if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                            return true;
                        }
                        else {
                            return _this.pageBackEnabled();
                        }
                    });
                    this.pageBackAriaDisabledBindingValue = ko.pureComputed(function () {
                        var _a, _b;
                        if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                            return !(_this.pageBackEnabled());
                        }
                        else {
                            return null;
                        }
                    });
                    this.pageForwardEnabled = ko.pureComputed(function () {
                        return _this.pageNumber() < _this.pagesCount();
                    });
                    this.pageForwardEnabledBindingValue = ko.pureComputed(function () {
                        var _a, _b;
                        if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                            return true;
                        }
                        else {
                            return _this.pageForwardEnabled();
                        }
                    });
                    this.pageForwardAriaDisabledBindingValue = ko.pureComputed(function () {
                        var _a, _b;
                        if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                            return !(_this.pageForwardEnabled());
                        }
                        else {
                            return null;
                        }
                    });
                    this.orderByColumnName = ko.pureComputed(function () {
                        return _this.ctrlCore.getSortingColumn();
                    }, this);
                    this.isDescending = ko.pureComputed(function () {
                        return _this.ctrlCore.getSortingOrder() && _this.ctrlCore.getSortingOrder() === 'desc';
                    }, this);
                    this.checkboxColumnVisible = ko.observable(false);
                    this.pageSizeValues = ko.observableArray([5, 10, 20, 30]);
                    this.allRowsChecked = ko.pureComputed(function () {
                        return _.every(_this.getRecordsWithCheckbox(), function (row) {
                            sffw.assert(_.isFunction(row.$selected));
                            return row.$selected();
                        });
                    }, this);
                    this.isAnyFilterActive = ko.pureComputed(function () {
                        return _.some(_this.visibleColumns(), function (col) {
                            return col.isFilterActive() === true;
                        });
                    }, this);
                    this.subscriptions = [];
                    this.isViewSettingsComponentAvailable = ko.observable(false);
                    this.onMultipleDropdownChange = function (col, newValue) {
                        if (_.isArray(newValue)) {
                            _this.ctrlCore.setTextFilter(col.name, col.filterEnumSelectedValue().join(','));
                            col.isFilterActive(_this.ctrlCore.isFilterActive(col.name));
                        }
                    };
                    this.onFilterDropdownChange = function (col, newValue) {
                        var boolVal = null;
                        if (col.dataType === 'bool' && (newValue === true || newValue === false)) {
                            boolVal = newValue;
                        }
                        if (boolVal != null) {
                            _this.ctrlCore.setBooleanFilter(col.name, boolVal);
                        }
                        else {
                            _this.ctrlCore.setBooleanFilter(col.name, null);
                        }
                        col.isFilterActive(_this.ctrlCore.isFilterActive(col.name));
                    };
                    this.onFilterDateFromChange = function (col, newValue) {
                        _this.ctrlCore.setDateRangeFilterStart(col.name, col.filterDateRangeFrom());
                        col.isFilterActive(_this.ctrlCore.isFilterActive(col.name));
                    };
                    this.onFilterDateToChange = function (col, newValue) {
                        _this.ctrlCore.setDateRangeFilterEnd(col.name, col.filterDateRangeTo());
                        col.isFilterActive(_this.ctrlCore.isFilterActive(col.name));
                    };
                    this.onFilterChanged = function (col, newValue) {
                        // if value is not trimmed, we do it first, which will trigger another event later
                        var trimmed = newValue.trim();
                        if (trimmed !== newValue) {
                            return;
                        }
                        _this.ctrlCore.setTextFilter(col.name, col.filterText());
                        col.isFilterActive(_this.ctrlCore.isFilterActive(col.name));
                    };
                    this.onPageMinClick = function () {
                        var _a, _b;
                        var isEnabled = _this.pageBackEnabled();
                        if (isEnabled) {
                            _this.page('1');
                        }
                        else if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                            _this.writeButtonDisabledErrToAriaLiveRegion();
                        }
                    };
                    this.onPageMaxClick = function () {
                        var _a, _b;
                        var isEnabled = _this.pageForwardEnabled();
                        if (isEnabled) {
                            var newPageNum = _this.pagesCount();
                            _this.page(newPageNum.toString());
                        }
                        else if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                            _this.writeButtonDisabledErrToAriaLiveRegion();
                        }
                    };
                    this.onPageForwardClick = function () {
                        var _a, _b;
                        var isEnabled = _this.pageForwardEnabled();
                        if (isEnabled) {
                            if (_this.pageNumber() < _this.pagesCount()) {
                                var newPageNum = _this.pageNumber() + 1;
                                _this.page(newPageNum.toString());
                            }
                        }
                        else if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                            _this.writeButtonDisabledErrToAriaLiveRegion();
                        }
                    };
                    this.onPageBackClick = function () {
                        var _a, _b;
                        var isEnabled = _this.pageBackEnabled();
                        if (isEnabled) {
                            if (_this.pageNumber() > 1) {
                                var newPageNum = _this.pageNumber() - 1;
                                _this.page(newPageNum.toString());
                            }
                        }
                        else if ((_b = (_a = window.sf.accessibility) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.focusableDisabledButtons) {
                            _this.writeButtonDisabledErrToAriaLiveRegion();
                        }
                    };
                    this.onPageRefreshClick = function () {
                        _this.clearSelection();
                        _this.ctrlCore.loadData();
                    };
                    this.onColumnHeaderClick = function (column) {
                        _this.ctrlCore.changeSortColumnOrDirection(column.name);
                        _this.clearSelection();
                    };
                    this.onViewSettingsClick = function () {
                        var promiseChain = Promise.resolve();
                        promiseChain = promiseChain.then(function () {
                            _this.ctrlCore.setViewSettingsComponentEnabled(!_this.ctrlCore.isViewSettingsComponentEnabled());
                        });
                        if (_this.onViewSettingsClickHandler) {
                            promiseChain = promiseChain.then(function () {
                                return _this.onViewSettingsClickHandler();
                            });
                        }
                        return promiseChain;
                    };
                    this.dataContext = params.$parentData;
                    this.listName = params.listName;
                    this.selectionChangeHandler = params.onSelectionChange;
                    this.ctrlCore = params.controller.ctrlCore;
                    this.maxVisibleFilterOptions = params.maxVisibleFilterOptions;
                    if (typeof params.showCheckboxes !== 'undefined') {
                        if (_.isFunction(params.showCheckboxes)) {
                            this.checkboxColumnVisible = params.showCheckboxes;
                        }
                        else {
                            this.checkboxColumnVisible(params.showCheckboxes);
                        }
                    }
                    else {
                        this.checkboxColumnVisible(false);
                    }
                    this.onViewSettingsClickHandler = params.onViewSettingsButtonClicked;
                    this.onRowsChangedHandler = params.onRowsChanged;
                    this.onRowClickHandler = params.onRowClicked;
                    this.isMultiselect = params.isMultiselect;
                    this.allowSelectAll = params.allowSelectAll;
                    this.rowSelectedPropName = params.isRowSelectedAttName || '_selected';
                    this.rowMarkedPropName = params.isRowMarkedAttName || '_marked';
                    this.checkboxInRowAttName = params.showCheckboxInRowAttName || '_checkbox';
                    this.lastClickedRowSelectWhenCheckboxesOff = params.lastClickedRowSelectWhenCheckboxesOff;
                    this.pagingControlsPosition = params.pagingControlsPosition || 'bottom';
                    this.pagingTemplate = [];
                    if (params.pagingTemplate != null && params.pagingTemplate !== '') {
                        this.pagingTemplate = params.pagingTemplate.split('|');
                    }
                    this.dataCollection = params.dataCollection;
                    this.selectedRowReference = params.lastClickedRow;
                    this.savedState = params.savedState;
                    this.savedStateOptions = params.savedStateOptions;
                    this.savedColumns = params.savedColumns;
                    this.allowFilterClearIcon = params.allowFilterClearIcon;
                    this.useArrowKeys = params.useArrowKeys;
                    this.viewSettingsButtonTitle = params.viewSettingsButtonTitle;
                    this.createColumns(params.columns);
                    var wasCtrlReady = this.ctrlCore.isReady();
                    if (wasCtrlReady === true) {
                        this.ctrlCore.isReady(false);
                    }
                    this.ctrlCore.initColumns(params.columns, this.reservedColumns());
                    if (this.savedColumns) {
                        var cols = ko.unwrap(this.savedColumns);
                        if (cols && cols.length > 0) {
                            this.ctrlCore.setVisibleColumns(JSON.parse(cols));
                            this.setColumnsVisibilityAndOrder();
                        }
                    }
                    this.pageNumber = this.ctrlCore.activePage;
                    this.page = ko.observable(_.isNumber(this.pageNumber()) ? this.pageNumber().toString() : '');
                    this.error = this.ctrlCore.error;
                    this.isLoading = this.ctrlCore.isLoading;
                    this.ctrlCore.listName = params.listName;
                    this.recordsCount = this.ctrlCore.rowCount;
                    this.pageSize = this.ctrlCore.pageSize;
                    this.isViewSettingsComponentAvailable(this.ctrlCore.isViewSettingsComponentAvailable());
                    this.subscriptions.push(this.ctrlCore.isViewSettingsComponentAvailable.subscribe(function (isViewSettingsComponentAvailable) {
                        _this.isViewSettingsComponentAvailable(isViewSettingsComponentAvailable);
                    }));
                    // there is always at least 1 page even if there is no record
                    this.pagesCount = ko.pureComputed(function () { return Math.ceil(_this.recordsCount() / _this.ctrlCore.pageSize()) || 1; });
                    this.subscriptions.push(this.pageNumber.subscribe(function (newPageNum) {
                        _this.page(newPageNum.toString());
                    }));
                    this.subscriptions.push(this.page.subscribe(function (newPageStr) {
                        var n = Number(_this.page().trim());
                        if (_.isNaN(n) || n < 1 || n > _this.pagesCount() || !_.isInteger(n)) {
                            _this.page(_this.pageNumber().toString());
                        }
                        else {
                            if (_this.pageNumber() !== n) {
                                _this.pageNumber(n);
                            }
                        }
                    }));
                    this.subscriptions.push(this.ctrlCore.isReady.subscribe(function (isReady) {
                        if (isReady) {
                            _this.setColumnFilters();
                            _this.setColumnsVisibilityAndOrder();
                        }
                    }));
                    if (this.savedState) {
                        var state = ko.unwrap(this.savedState);
                        if (state && state.length > 0) {
                            this.ctrlCore.loadState(state);
                        }
                    }
                    this.setColumnFilters();
                    this.subscriptions.push(this.ctrlCore.rows.subscribe(this.onRowsChange, this, 'arrayChange'));
                    this.ctrlCore.onClearState = function () {
                        _this.clearViewModelVisibleFilters();
                    };
                    if (wasCtrlReady === true) {
                        this.ctrlCore.isReady(true);
                    }
                }
                ListViewModel.prototype.getRecordsWithCheckbox = function () {
                    var _this = this;
                    return _.filter(this.records(), function (r) {
                        return _this.isCheckboxOnRow(r);
                    });
                };
                ListViewModel.prototype.clearViewModelVisibleFilters = function () {
                    _.each(this.columns, function (col) {
                        col.clearFilterValue();
                    });
                };
                ListViewModel.prototype.onRowsChange = function () {
                    var _this = this;
                    this.records.removeAll();
                    this.clearSelection();
                    var newDataRecords = [];
                    var promiseChain = this.dataCollection.$fromJson(this.ctrlCore.rows()).then(function () {
                        newDataRecords = _.map(_this.dataCollection.$items(), function (obj) {
                            return new list.ListDataRecord(obj, _this.columns, _this.rowSelectedPropName, _this.rowMarkedPropName, _this.checkboxInRowAttName);
                        });
                        _.each(newDataRecords, function (r) {
                            _this.records.push(r);
                        });
                        // triggers repositioning of expanded enum filters if needed
                        _.each(_this.visibleColumns(), function (col) {
                            if (col.hasEnumFilter()) {
                                var nextValue = col.filterEnumRepositionTrigger() + 1;
                                col.filterEnumRepositionTrigger(nextValue);
                            }
                        });
                        if (_this.savedState) {
                            var opts = _this.savedStateOptions || null;
                            _this.savedState(_this.ctrlCore.saveState(opts));
                        }
                        return _this.setFocusedRow(_this.ctrlCore.focusedRecordIndex());
                    });
                    if (this.onRowsChangedHandler) {
                        promiseChain = promiseChain.then(function () {
                            return _this.onRowsChangedHandler();
                        });
                    }
                    return promiseChain;
                };
                ListViewModel.prototype.setFocusedRow = function (index) {
                    if (index >= 0 && index < this.records().length) {
                        var focusedRecord = this.records()[index];
                        var onRc = this.onRowClick(focusedRecord, null, null);
                        if (onRc !== true) {
                            return onRc;
                        }
                    }
                };
                ListViewModel.prototype.selectionChange = function (row) {
                    var _this = this;
                    sffw.assert(!!row);
                    sffw.assert(_.isFunction(row.$selected));
                    var promiseChain = Promise.resolve();
                    if (this.selectedRow === row) {
                        // click on selected row does nothing
                        return promiseChain;
                    }
                    if (this.selectedRow) {
                        this.selectedRow.$selected(false);
                    }
                    this.selectedRow = row;
                    if (this.lastClickedRowSelectWhenCheckboxesOff && !this.checkboxColumnVisible()) {
                        row.$selected(true);
                    }
                    // nastaveni posledniho oznaceneho radku
                    if (this.selectedRowReference && row.$dataStruct) {
                        promiseChain = promiseChain.then(function () {
                            return _this.selectedRowReference.$emptyRecursive();
                        })
                            .then(function () {
                            return _this.selectedRowReference.$fromJson(row.$dataStruct.$createJsonObj());
                        });
                    }
                    if (this.selectionChangeHandler) {
                        promiseChain = promiseChain.then(function () {
                            return _this.selectionChangeHandler();
                        });
                    }
                    return promiseChain;
                };
                ListViewModel.prototype.createColumns = function (columns) {
                    var _this = this;
                    _(columns).each(function (c, index) {
                        var column = new list.ListColumnModel(c, _this.dataContext, _this.maxVisibleFilterOptions, index);
                        _this.columns.push(column);
                        if (c.IsVisible !== false) { // may be undefined because of default value
                            _this.visibleColumns.push(column);
                        }
                        else {
                            _this.hiddenColumns.push(column);
                        }
                        if (c.DataType === 'bool') {
                            _this.subscriptions.push(column.filterBoolSelectedValue.subscribe(_.partial(_this.onFilterDropdownChange, column)));
                        }
                        else if (c.DataType === 'date') {
                            _this.subscriptions.push(column.filterDateRangeFrom.subscribe(_.partial(_this.onFilterDateFromChange, column)));
                            _this.subscriptions.push(column.filterDateRangeTo.subscribe(_.partial(_this.onFilterDateToChange, column)));
                        }
                        else if (column.hasEnumFilter() === true) {
                            _this.subscriptions.push(column.filterEnumSelectedValue.subscribe(_.partial(_this.onMultipleDropdownChange, column)));
                        }
                        else {
                            _this.subscriptions.push(column.filterText.subscribe(_.partial(_this.onFilterChanged, column)));
                        }
                    });
                    this.isAnyFilterEnabled = _.some(this.columns, function (c) {
                        return c.filterEnabled === true;
                    });
                };
                ListViewModel.prototype.setColumnFilters = function () {
                    var _this = this;
                    _.each(this.columns, function (col) {
                        var colFilter = _.find(_this.ctrlCore.columnFilters(), function (cf) { return cf.name === col.name; });
                        if (colFilter) {
                            if (colFilter.type === 'text') {
                                if (col.hasEnumFilter() === true) {
                                    if (colFilter.getValue().length > 0) {
                                        col.filterEnumSelectedValue(colFilter.getValue().split(','));
                                        col.isFilterActive(colFilter.hasValue());
                                    }
                                }
                                else {
                                    switch (col.dataType) {
                                        case 'string':
                                        case 'integer':
                                        case 'decimal':
                                            col.filterText(colFilter.getValue());
                                            col.isFilterActive(colFilter.hasValue());
                                            break;
                                    }
                                }
                            }
                            if (colFilter.type === 'boolean') {
                                switch (col.dataType) {
                                    case 'bool':
                                        col.filterBoolSelectedValue(colFilter.getValue());
                                        col.isFilterActive(colFilter.hasValue());
                                        break;
                                }
                            }
                            if (colFilter.type === 'date') {
                                switch (col.dataType) {
                                    case 'date':
                                        col.filterDateRangeFrom(colFilter.getStart());
                                        col.filterDateRangeTo(colFilter.getEnd());
                                        col.isFilterActive(colFilter.hasValue());
                                        break;
                                }
                            }
                        }
                        else {
                            col.clearFilterValue();
                        }
                    });
                };
                ListViewModel.prototype.writeButtonDisabledErrToAriaLiveRegion = function () {
                    var msg = window.sf.localization.currentCulture().errorFormatter.formatButtonDisabled("");
                    sffw.safeWriteToAriaLiveRegion(msg);
                };
                ListViewModel.prototype.clearSelection = function () {
                    var _this = this;
                    var promiseChain = Promise.resolve();
                    if (this.selectedRow) {
                        this.selectedRow.$selected(null);
                        this.selectedRow = null;
                    }
                    if (this.selectedRowReference) {
                        promiseChain = promiseChain.then(function () {
                            return _this.selectedRowReference.$emptyRecursive();
                        });
                    }
                    if (this.selectionChangeHandler) {
                        promiseChain = promiseChain.then(function () {
                            return _this.selectionChangeHandler();
                        });
                    }
                    return promiseChain;
                };
                ListViewModel.prototype.onRowClick = function (row, column, event) {
                    var _this = this;
                    if (event && event.ctrlKey) {
                        return true;
                    }
                    if (event) {
                        event.preventDefault();
                        $(event.target).closest('tr').focus();
                    }
                    return this.selectionChange(row).then(function () {
                        if (_this.onRowClickHandler) {
                            _this.onRowClickHandler(_this, event, { columnName: column ? column.dispName : null });
                        }
                    });
                };
                ListViewModel.prototype.CheckboxSelect = function (row, index) {
                    var _this = this;
                    sffw.assert(!!row);
                    sffw.assert(_.isFunction(row.$selected));
                    var promiseChain = Promise.resolve();
                    // nastaveni posledniho oznaceneho radku
                    if (this.selectedRowReference && row.$dataStruct) {
                        promiseChain = promiseChain.then(function () {
                            return _this.selectedRowReference.$emptyRecursive();
                        })
                            .then(function () {
                            var jsonObj = typeof (row.$dataStruct.$createJsonObj) === 'function' ? row.$dataStruct.$createJsonObj() : row.$dataStruct;
                            return _this.selectedRowReference.$fromJson(jsonObj);
                        });
                    }
                    promiseChain = promiseChain.then(function () {
                        var selected = row.$selected();
                        var att = null;
                        if (!_this.isMultiselect) {
                            _.each(_this.records(), function (r) {
                                r.$selected(false);
                            });
                            // nastaveni promene v kolekci
                            _.each(_this.dataCollection.$items(), function (item) {
                                att = item[_this.rowSelectedPropName];
                                if (att) {
                                    att.$value(false);
                                }
                            });
                            _this.records()[index()].$selected(selected);
                        }
                        att = _this.dataCollection.$items()[index()][_this.rowSelectedPropName];
                        if (att) {
                            att.$value(selected);
                        }
                    });
                    return true;
                };
                ListViewModel.prototype.checkAllRows = function () {
                    var _this = this;
                    if (this.isMultiselect) {
                        var isChecked_1 = this.allRowsChecked();
                        _.each(this.getRecordsWithCheckbox(), function (r) {
                            sffw.assert(_.isFunction(r.$selected));
                            r.$selected(!isChecked_1);
                        });
                        // nastaveni promene v kolekci
                        var itemsWithCheckbox = _.filter(this.dataCollection.$items(), function (item) {
                            var att = item[_this.checkboxInRowAttName];
                            if (att) {
                                return ko.unwrap(att.$value()) === true;
                            }
                            else {
                                return true;
                            }
                        });
                        _.each(itemsWithCheckbox, function (item) {
                            var att = item[_this.rowSelectedPropName];
                            if (att) {
                                att.$value(!isChecked_1);
                            }
                        });
                    }
                    return true;
                };
                ListViewModel.prototype.isCheckboxOnRow = function (record) {
                    return ko.unwrap(this.checkboxColumnVisible) && (ko.unwrap(record.$checkbox) !== false);
                };
                // List controller holds current column visibility and order
                // that can be different than at design-time
                ListViewModel.prototype.setColumnsVisibilityAndOrder = function () {
                    var _this = this;
                    var orderedCols = this.ctrlCore.getVisibleColumns();
                    if (orderedCols) {
                        var tmpReservedCols_1 = [];
                        _.each(this.reservedColumns(), function (col) {
                            col.IsVisible = false;
                            tmpReservedCols_1.push(col);
                        });
                        var tmpVisibleCols_1 = [];
                        _.each(orderedCols, function (cName) {
                            var cModel = _.find(_this.columns, function (col) {
                                return col.dispName === cName;
                            });
                            if (cModel) {
                                tmpVisibleCols_1.push(cModel);
                            }
                            else {
                                var resCol = _.find(tmpReservedCols_1, function (col) {
                                    return col.DisplayColumnName ? col.DisplayColumnName === cName : col.Name === cName;
                                });
                                if (resCol) {
                                    resCol.IsVisible = true;
                                }
                            }
                        });
                        this.visibleColumns(tmpVisibleCols_1);
                        this.reservedColumns(tmpReservedCols_1);
                        var tmpHiddenCols = _.filter(this.columns, function (col) {
                            var vc = _.find(_this.visibleColumns(), function (visCol) {
                                return col.dispName === visCol.dispName;
                            });
                            return vc === undefined;
                        });
                        this.hiddenColumns(tmpHiddenCols);
                    }
                    if (this.savedColumns) {
                        this.savedColumns(JSON.stringify(orderedCols));
                    }
                };
                ListViewModel.prototype.onRowKeyDown = function (row, event) {
                    if (!this.useArrowKeys) {
                        return true;
                    }
                    switch (event.keyCode) {
                        case 40:
                            if (event.target) {
                                event.preventDefault();
                                var i = this.records().indexOf(row);
                                this.setFocusedRow(i + 1);
                                $(event.target).next('tr').focus();
                                return false;
                            }
                        case 38:
                            if (event.target) {
                                event.preventDefault();
                                var i = this.records().indexOf(row);
                                this.setFocusedRow(i - 1);
                                $(event.target).prev('tr').focus();
                                return false;
                            }
                        default:
                            return true;
                    }
                };
                ListViewModel.prototype.onRowKeyUp = function (row, event, viewModel) {
                    switch (event.keyCode) {
                        case 13:
                            if (event.target && event.target.localName == 'tr') {
                                viewModel.onRowClick(row);
                                return true;
                            }
                        default:
                            return true;
                    }
                };
                ListViewModel.prototype.dispose = function () {
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
                    _(this.columns).each(function (column) {
                        column.dispose();
                    });
                };
                return ListViewModel;
            }());
            list.ListViewModel = ListViewModel;
        })(list = components.list || (components.list = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var list;
        (function (list) {
            if (ko && !ko.components.isRegistered('sffw-list')) {
                ko.components.register('sffw-list', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.list.ListViewModel(params, componentInfo); }
                    },
                    synchronous: true,
                    template: "\n<div class=\"sffw-list\">\n    <!-- ko if: pagingControlsPosition === 'top' || pagingControlsPosition === 'both' -->\n    <div class=\"sffw-list-paging-top\">\n        <!-- ko foreach: pagingTemplate -->\n            <span data-bind=\"template: { name: $data }\"></span>\n        <!-- /ko -->\n    </div>\n    <!-- /ko -->\n\n    <table role=\"table\" data-bind=\"attr: { 'aria-rowcount': recordsCount }\">\n        <thead>\n            <!-- captions -->\n            <tr>\n            <!-- ko if: checkboxColumnVisible -->\n                <!-- ko if: isMultiselect && allowSelectAll  -->\n                    <th style=\"width: 2%; text-align: center;\"><span>\n                        <input tabindex=\"0\" type=\"checkbox\" data-bind=\"checked: allRowsChecked, click: function(data, event){ return checkAllRows(); }, clickBubble: false, attr: { 'aria-label': $root.$localize('List$$selectAll') }\"></input>\n                    </span></th>\n                <!-- /ko -->\n                <!-- ko ifnot: isMultiselect && allowSelectAll  -->\n                    <th style=\"width: 2%;\"></th>\n                <!-- /ko -->\n            <!-- /ko -->\n            <!-- ko foreach: visibleColumns -->\n                <th data-bind=\"style: { width: $data.width }, css: { 'enum-th' : dataType == 'date' },\n                    winsize: windowSize,\n                    attr: { 'aria-sort': ($parent.orderByColumnName() === name) ? $parent.isDescending() ? 'descending' : 'ascending' : 'none' }\"\n                    class=\"noselect\">\n                    <div role=\"button\" data-bind=\"click: $parent.onColumnHeaderClick,\n                        attr: { 'aria-label': $root.$localize('List$$sort') + ' ' +  (isCaptionLocalized == true ?  $root.$localize(caption) :  ko.unwrap(caption)) + ' ' + (($parent.orderByColumnName() === name) ? $parent.isDescending() ? $root.$localize('List$$ascending') : $root.$localize('List$$descending') : $root.$localize('List$$ascending')) }\">\n                        <span data-bind=\"text: (isCaptionLocalized == true ?  $root.$localize(caption) :  caption),\n                            css: {'sffw-list-sort-active': ($parent.orderByColumnName() === name)}\">\n                        </span>\n                        <div class=\"sffw-list-display-inline sffw-list-ordering-glyph\">\n                            <span data-bind=\"visible: ($parent.orderByColumnName() === name) && !$parent.isDescending()\"><i class=\"fa fa-sort-alpha-asc\"></i></span>\n                            <span data-bind=\"visible: ($parent.orderByColumnName() === name) && $parent.isDescending()\"><i class=\"fa fa-sort-alpha-desc\"></i></span>\n                        </div>\n                    </div>\n                    <!-- ko if: $parent.isAnyFilterEnabled -->\n                    <div class=\"sffw-list-filter-wrap\">\n                        <!-- ko if: dataType == 'bool' -->\n                            <div class=\"sffw-list-filter-wrap-value\"><select data-bind=\"options: boolOptions,\n                                    value: filterBoolSelectedValue,\n                                    optionsText: 'text',\n                                    optionsValue: 'value',\n                                    optionsAfterRender: setOptionAriaLabel,\n                                    css: {'sffw-list-filter-active': isFilterActive},\n                                    enable: filterEnabled,\n                                    style: { visibility: filterEnabled ? '' : 'hidden' },\n                                    attr: {'aria-label': (isCaptionLocalized == true ?  $root.$localize(caption) :  ko.unwrap(caption)) + ' ' + $root.$localize('List$$filterValue')}\" class=\"sffw-list-filter\"></select>\n                            </div>\n                        <!-- /ko -->\n                        <!-- ko if: dataType == 'date' -->\n                            <div class=\"sffw-list-filter-wrap-value\"><input type=\"text\" autocomplete=\"off\" style=\"width: 46%; display: inline-block; float: left;\" class=\"sffw-list-filter\" data-bind=\"filterDatePicker: filterDateRangeFrom,\n                                value: filterDisplayFrom,\n                                css: {'sffw-list-filter-active': isFilterActive},\n                                enable: filterEnabled,\n                                style: { visibility: filterEnabled ? '' : 'hidden' },\n                                attr: { placeholder: $root.$localize('List$$fromPlaceholderLocalization'),\n                                    'aria-label': (isCaptionLocalized == true ?  $root.$localize(caption) :  ko.unwrap(caption)) + ' (' + $root.$localize('List$$fromPlaceholderLocalization') + ') ' + $root.$localize('List$$filterValue') }\"/>\n                            <span data-bind=\"style: { visibility: filterEnabled ? '' : 'hidden' }\" style=\"display: inline-block; font-weight: bold; width: 8%; text-align: center;\">-</span>\n                            <input type=\"text\" autocomplete=\"off\" style=\"width: 46%; display: inline-block; float: right;\" class=\"sffw-list-filter\" data-bind=\"filterDatePicker: filterDateRangeTo,\n                                value: filterDisplayTo,\n                                css: {'sffw-list-filter-active': isFilterActive},\n                                enable: filterEnabled,\n                                style: { visibility: filterEnabled ? '' : 'hidden'},\n                                attr: { placeholder: $root.$localize('List$$toPlaceholderLocalization'),\n                                    'aria-label': (isCaptionLocalized == true ?  $root.$localize(caption) :  ko.unwrap(caption)) + ' (' + $root.$localize('List$$toPlaceholderLocalization') + ') ' + $root.$localize('List$$filterValue') }\"/>\n                            </div>\n                        <!-- /ko -->\n                        <!-- ko if: hasEnumFilter() === true -->\n                        <div class=\"sffw-list-filter-wrap-value\" data-bind=\"filterOptionsSelect: filterDropDownExpanded\">\n                            <div role=\"combobox\"\n                                data-bind=\"attr: { 'aria-label': (isCaptionLocalized == true ?  $root.$localize(caption) :  ko.unwrap(caption)) + ' ' + $root.$localize('List$$filter')},\n                                style: { visibility: filterEnabled ? '' : 'hidden' }\"\n                                tabindex=\"0\" class=\"sffw-list-dd-filter\">\n\n                                <input type=\"text\" data-bind=\"value: filterEnumSelectedOptionText, attr:{ id: filterUniqueId,\n                                    'aria-label': (isCaptionLocalized == true ?  $root.$localize(caption) :  ko.unwrap(caption)) + ' ' + $root.$localize('List$$filterValue')},\n                                    css: { 'sffw-list-filter-active' : isFilterActive }\"\n                                    class=\"sffw-list-filter\" readonly autocomplete=\"off\" tabindex=\"-1\" />\n                            </div>\n                            <ul data-bind=\"style: { left: filterDropDownLeft, 'max-height': filterDropDownHeight, 'min-width': filterDropDownMinWidth, overflow: ddOverflow },\n                                attr: { id: ddFilterUniqueId },\n                                foreach: filterEnumOptions,\n                                filterOptionsAfterRender: filterEnumOptions\"\n                                role=\"listbox\" aria-multiselectable=\"true\" tabindex=\"-1\" class=\"sffw-list-dd\">\n                                <li role=\"option\" data-bind=\"attr:{ id: $parent.ddFilterUniqueId + '-' + $data.value, 'aria-selected': ($parent.filterEnumSelectedValue.indexOf($data.value) > -1 ? 'true' : 'false') }\">\n                                    <input data-bind=\"checked: $parent.filterEnumSelectedValue,\n                                        attr: { value: $data.value,\n                                        'aria-label': ($data.isLocalized === true ? $root.$localize($data.text) : $data.text) }\"\n                                        type=\"checkbox\" tabindex=\"-1\" />\n                                    <span data-bind=\"text: ($data.isLocalized === true ? $root.$localize($data.text) : $data.text)\" aria-hidden=\"true\">\n                                </li>\n                            </ul>\n                        </div>\n                        <!-- /ko -->\n                        <!-- ko ifnot: hasEnumFilter() === true -->\n                            <!-- ko if: dataType != 'bool' && dataType != 'date' && dataType != 'datetime' -->\n                                <div class=\"sffw-list-filter-wrap-value\"><input type=\"text\" autocomplete=\"off\" class=\"sffw-list-filter\" data-bind=\"textInput: filterText,\n                                    css: {'sffw-list-filter-active': isFilterActive},\n                                    enable: filterEnabled,\n                                    style: { visibility: filterEnabled ? '' : 'hidden' },\n                                    attr: {'aria-label': (isCaptionLocalized == true ?  $root.$localize(caption) :  ko.unwrap(caption)) + ' ' + $root.$localize('List$$filterValue')}\" />\n                                </div>\n                            <!-- /ko -->\n                        <!-- /ko -->\n                        <div data-bind=\"visible: $parent.allowFilterClearIcon\" class=\"sffw-list-display-inline sffw-list-clear-glyph\">\n                            <button data-bind=\"attr: { 'aria-disabled': isFilterActive() ? 'false' : 'true' }, click: clearFilterValue, clickBubble: false\"><i class=\"fa fa-remove\"></i></button>\n                        </div>\n                    </div>\n                    <!-- /ko -->\n                </th>\n            <!-- /ko -->\n            </tr>\n        </thead>\n        <tbody data-bind=\"foreach: { data: records, as: 'record' }\">\n        <tr data-bind=\"event: { keydown: function(data, event){ return $parent.onRowKeyDown(record, event); },\n            keyup: function(data, event){ return $parent.onRowKeyUp(record, event, $parent); }},\n            css: $rowCss\" tabindex=\"0\" role=\"button\">\n                <!-- ko if: $parent.checkboxColumnVisible -->\n                    <td style=\"width: 2%; text-align: center;\">\n                        <!-- ko if: $parent.isCheckboxOnRow(record) -->\n                        <span><input tabindex=\"0\" type=\"checkbox\" data-bind=\"checked: record.$selected, click: function(data, event){ $parent.CheckboxSelect(record, $index); return true;}, clickBubble: false\"></input></span>\n                        <!-- /ko -->\n                    </td>\n                <!-- /ko -->\n\n                <!-- ko foreach: { data: $parent.visibleColumns, as: 'column' } -->\n                    <!-- ko if: column.isHtml -->\n                        <td>\n                            <a tabindex=\"-1\" data-bind=\"click: function(data, event){ return $parents[1].onRowClick(record, column, event); }, clickBubble: false, html: record[column.dispName]\"></a>\n                        </td>\n                    <!-- /ko -->\n                    <!-- ko if: !column.isHtml -->\n                        <td>\n                            <a tabindex=\"-1\" data-bind=\"click: function(data, event){ return $parents[1].onRowClick(record, column, event); }, clickBubble: false, text: record[column.dispName]\"></a>\n                        </td>\n                    <!-- /ko -->\n                <!-- /ko -->\n            </tr>\n        </tbody>\n    </table>\n\n    <!-- ko if: pagingControlsPosition === 'bottom' || pagingControlsPosition === 'both' -->\n    <div class=\"sffw-list-paging\">\n        <!-- ko foreach: pagingTemplate -->\n            <span data-bind=\"template: { name: $data }\"></span>\n        <!-- /ko -->\n    </div>\n    <!-- /ko -->\n\n\n    <script type=\"text/html\" id=\"$first\">\n        <button class=\"sffw-list-paging-button\" data-bind=\"click: $parent.onPageMinClick, enable: $parent.pageBackEnabledBindingValue,\n            attr: { 'title': $root.$localize('List$$firstPageAriaLabel'),\n                    'aria-label': $root.$localize('List$$firstPageAriaLabel'),\n                    'aria-disabled': $parent.pageBackAriaDisabledBindingValue }\">\n            <i class=\"fa fa-fast-backward\"></i>\n        </button>\n    </script>\n\n    <script type=\"text/html\" id=\"$previous\">\n        <button class=\"sffw-list-paging-button\" data-bind=\"click: $parent.onPageBackClick, enable: $parent.pageBackEnabledBindingValue,\n            attr: { 'title': $root.$localize('List$$prevPageAriaLabel'),\n                    'aria-label': $root.$localize('List$$prevPageAriaLabel'),\n                    'aria-disabled': $parent.pageBackAriaDisabledBindingValue }\">\n            <i class=\"fa fa-play fa-flip-horizontal\"></i>\n        </button>\n    </script>\n\n    <script type=\"text/html\" id=\"$editableCurrentPage\">\n        <input type=\"number\" autocomplete=\"off\" data-bind=\"textInput: $parent.page, attr: { 'aria-label': $root.$localize('List$$pageNumAriaLabel') }\" width=\"10\" style=\"display: inline-block;\" class=\"sffw-list-paging-pageinput\">\n        <span class=\"sffw-list-paging-spin\" data-bind=\"visible: $parent.isLoading() && !$parent.error()\"><i class=\"fa fa-refresh fa-spin\"></i></span>\n        <span class=\"sffw-list-paging-spin\" data-bind=\"visible: !$parent.isLoading() && !$parent.error()\">/</span>\n        <span class=\"sffw-list-paging-spin sffw-list-paging-spin-error\" data-bind=\"visible: $parent.error\"><i class=\"fa fa-exclamation-triangle\"></i></span>\n        <span class=\"sffw-list-paging-pagemax\" data-bind=\"text: $parent.pagesCount\" width=\"10\" style=\"display: inline-block;\"></span>\n    </script>\n\n    <script type=\"text/html\" id=\"$records\">\n        <span style=\"margin-left: 3px;\">(<span data-bind=\"text: $parent.recordsCount\"></span><span data-bind=\"text: $root.$localize('List$$recordsLocalization')\" style=\"margin-left: 3px;\"></span>)</span>\n    </script>\n\n    <script type=\"text/html\" id=\"$refresh\">\n        <button class=\"sffw-list-paging-button\" data-bind=\"click: $parent.onPageRefreshClick,\n            attr: { 'title': $root.$localize('List$$refreshPageAriaLabel'),\n                    'aria-label': $root.$localize('List$$refreshPageAriaLabel') }\">\n            <i class=\"fa fa-refresh\"></i>\n        </button>\n    </script>\n\n    <script type=\"text/html\" id=\"$next\">\n        <button class=\"sffw-list-paging-button\" data-bind=\"click: $parent.onPageForwardClick, enable: $parent.pageForwardEnabledBindingValue,\n            attr: { 'title': $root.$localize('List$$nextPageAriaLabel'),\n                    'aria-label': $root.$localize('List$$nextPageAriaLabel'),\n                    'aria-disabled': $parent.pageForwardAriaDisabledBindingValue }\">\n            <i class=\"fa fa-play\"></i>\n        </button>\n    </script>\n\n    <script type=\"text/html\" id=\"$last\">\n        <button class=\"sffw-list-paging-button\" data-bind=\"click: $parent.onPageMaxClick, enable: $parent.pageForwardEnabledBindingValue,\n            attr: { 'title': $root.$localize('List$$lastPageAriaLabel'),\n                    'aria-label': $root.$localize('List$$lastPageAriaLabel'),\n                    'aria-disabled': $parent.pageForwardAriaDisabledBindingValue }\">\n            <i class=\"fa fa-fast-forward\"></i>\n        </button>\n    </script>\n\n    <script type=\"text/html\" id=\"$pageSize\">\n        <select style=\"margin:0 3px 0 3px;\" data-bind=\"options: $parent.pageSizeValues, value: $parent.pageSize, attr: { 'aria-label': $root.$localize('List$$pageSizeAriaLabel') }\"></select>\n    </script>\n\n    <script type=\"text/html\" id=\"$viewSettings\">\n    <!-- ko if: $parent.isViewSettingsComponentAvailable() === true -->\n        <button class=\"sffw-list-paging-button sffw-list-view-settings-button\" data-bind=\"click: $parent.onViewSettingsClick,\n            attr: { 'title': $parent.viewSettingsButtonTitle ? $parent.viewSettingsButtonTitle : $root.$localize('List$$viewSettings'),\n                    'aria-label': $parent.viewSettingsButtonTitle ? $parent.viewSettingsButtonTitle : $root.$localize('List$$viewSettings') }\">\n            <i class=\"fa fa-cog\"></i>\n        </button>\n    <!-- /ko -->\n    </script>\n\n    <div class=\"sffw-list-error\" data-bind=\"visible: error, text: error\"></div>\n</div>"
                });
            }
        })(list = components.list || (components.list = {}));
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
    function formatAsAmountOrCurrency(strValue, formatAsAmount, formatAsCurrency, minDecPlaces) {
        if (!strValue) {
            return '';
        }
        if (!formatAsAmount && !formatAsCurrency) {
            return strValue;
        }
        var decimalSign = window.sf.localization.currentCulture().getDecimalSign();
        var thousandSign = window.sf.localization.currentCulture().getThousandSign();
        var places = 0; // pocet destinych pozic
        if (formatAsCurrency) {
            places = 2;
        }
        if (formatAsAmount) {
            places = 6;
        }
        var symbol = '\u20AC'; // euro znak
        var normalizedNumberStr = strValue.replace(decimalSign, '.');
        if (_.isNaN(Number(normalizedNumberStr))) {
            return '';
        }
        var numValue = new Big(normalizedNumberStr);
        var numberParts = numValue.toFixed().split('.');
        var sign = numValue.lt(0) ? '-' : '';
        var integralPart = numValue.abs().round(0, 0).toString(); // absolutní hodnota celočíselné části
        var leftover = integralPart.length > 3 ? (integralPart.length) % 3 : 0;
        var decimalPart = '';
        if (numberParts.length > 1) {
            var decPlacesStr = numberParts[1].substr(0, places);
            if (minDecPlaces && minDecPlaces > 0 && decPlacesStr.length < minDecPlaces) {
                decPlacesStr = decPlacesStr.concat(Array(minDecPlaces - decPlacesStr.length + 1).join("0"));
            }
            decimalPart = "" + decimalSign + decPlacesStr;
        }
        else if (minDecPlaces && minDecPlaces > 0) {
            decimalPart = "" + decimalSign + Array(minDecPlaces + 1).join("0");
        }
        return sign + (leftover ? integralPart.substr(0, leftover) + thousandSign : '') + integralPart.substr(leftover).replace(/(\d{3})(?=\d)/g, '$1' + thousandSign)
            + decimalPart
            + (formatAsCurrency ? " " + symbol : '');
    }
    sffw.formatAsAmountOrCurrency = formatAsAmountOrCurrency;
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function generateRandomId() {
        return "" + Date.now() + Math.random().toString(16).substr(2, 5).toUpperCase();
    }
    sffw.generateRandomId = generateRandomId;
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
