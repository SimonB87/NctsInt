namespace sffw.components.pagingRepeaterCtrl {
    export interface IPagingRepeaterCtrlModelParams {
        Data: IDataCollection<IDataStruct>;
        Index: KnockoutObservable<number>;
        CaptionAtt?: string;
        AllowAdd: boolean | KnockoutObservable<boolean>;
        AllowRemove: boolean | KnockoutObservable<boolean>;
        ShowAdd: boolean | KnockoutObservable<boolean>;
        ShowRemove: boolean | KnockoutObservable<boolean>;
        IconLeftClass?: string;
        IconRightClass?: string;
        IconAddClass?: string;
        IconRemoveClass?: string;
        IconsAdditionalClass?: string;
        CheckItemIsValidBeforeIndexChange: boolean | KnockoutObservable<boolean>;
        IndicateDataErrors: boolean | KnockoutObservable<boolean>;

        KeepArrowsTogether?: string;
        OnItemAdd?: (data?: IPagingRepeaterCtrlModelParams, event?: Event, params?: IPagingRepeaterCtrlItemAddParams) => void;
        OnItemRemove?: (data?: IPagingRepeaterCtrlModelParams, event?: Event, params?: IPagingRepeaterCtrlItemRemoveParams) => void;
    }

    export interface IPagingRepeaterCtrlItemAddParams {
        newItem: IDataStruct;
    }

    export interface IPagingRepeaterCtrlItemRemoveParams {
        removedItem: IDataStruct;
    }

    export class PagingRepeaterCtrlItemAddParams implements IPagingRepeaterCtrlItemAddParams {
        public newItem: IDataStruct;
    }

    export class PagingRepeaterCtrlItemRemoveParams implements IPagingRepeaterCtrlItemRemoveParams {
        public removedItem: IDataStruct;
    }

    export class PagingRepeaterCtrlModel {
        public leftButtonClass: KnockoutObservable<string>;
        public rightButtonClass: KnockoutObservable<string>;
        public addButtonClass: KnockoutObservable<string>;
        public removeButtonClass: KnockoutObservable<string>;
        public title: KnockoutComputed<string>;
        public leftButtonEnabled: KnockoutComputed<boolean>;
        public leftButtonEnabledBindingValue: KnockoutComputed<boolean>;
        public leftButtonAriaDisabledBindingValue: KnockoutComputed<boolean>;
        public rightButtonEnabled: KnockoutComputed<boolean>;
        public rightButtonEnabledBindingValue: KnockoutComputed<boolean>;
        public rightButtonAriaDisabledBindingValue: KnockoutComputed<boolean>;
        public addButtonEnabled: KnockoutComputed<boolean>;
        public addButtonEnabledBindingValue: KnockoutComputed<boolean>;
        public addButtonAriaDisabledBindingValue: KnockoutComputed<boolean>;
        public removeButtonEnabled: KnockoutComputed<boolean>;
        public removeButtonEnabledBindingValue: KnockoutComputed<boolean>;
        public removeButtonAriaDisabledBindingValue: KnockoutComputed<boolean>;
        public showAdd: boolean | KnockoutObservable<boolean>;
        public showRemove: boolean | KnockoutObservable<boolean>;
        public isError: KnockoutObservable<boolean> = ko.observable(false);
        public dataHasErrors: KnockoutComputed<boolean>;
        public checkItemIsValidBeforeIndexChange: boolean | KnockoutObservable<boolean>;
        public indicateDataErrors: boolean | KnockoutObservable<boolean>;

        private captionAttName: string;
        private index: KnockoutObservable<number>;
        private indexString: KnockoutObservable<string>;
        private collection: IDataCollection<IDataStruct>;
        private count: KnockoutComputed<number>;
        private indexAsNumber: KnockoutComputed<number>;
        private allowAdd: boolean | KnockoutObservable<boolean>;
        private allowRemove: boolean | KnockoutObservable<boolean>;
        private iconLeftClass?: string;
        private iconRightClass?: string;
        private iconAddClass?: string;
        private iconRemoveClass?: string;
        private iconsAdditionalClass?: string;
        private itemAddHandler: (data?: IPagingRepeaterCtrlModelParams, event?: Event, params?: IPagingRepeaterCtrlItemAddParams) => void;
        private itemRemoveHandler: (data?: IPagingRepeaterCtrlModelParams, event?: Event, params?: IPagingRepeaterCtrlItemRemoveParams) => void;

        private subscriptions: KnockoutSubscription[] = [];
        private isInternalIndexChange = false;
        private keepArrowsTogether: boolean;
        private dataContext: IGeneratedDataContext;

        constructor(params: IPagingRepeaterCtrlModelParams, componentInfo: KnockoutComponentTypes.ComponentInfo) {
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
                const indexValue = this.index();
                if (indexValue && indexValue > 0 && indexValue <= this.count()) {
                    this.setNewIndex(this.index());
                } else {
                    this.setNewIndex(1);
                }
            } else {
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

        private getCollectionCount() {
            return this.collection.$items().length;
        }

        private getIndexAsNumber() {
            if (this.index()) {
                return this.index();
            } else {
                return 0;
            }
        }

        private getLeftButtonEnabled() {
            return this.indexAsNumber() > 1;
        }

        private getLeftButtonEnabledBindingValue() {
            if (window.sf.accessibility?.preferences?.focusableDisabledButtons) {
                return true;
            } else {
                return this.leftButtonEnabled();
            }
        }

        private getLeftButtonAriaDisabledBindingValue() {
            if (window.sf.accessibility?.preferences?.focusableDisabledButtons) {
                return !(this.leftButtonEnabled());
            } else {
                return null;
            }
        }

        private getRightButtonEnabled() {
            return this.indexAsNumber() < this.count();
        }

        private getRightButtonEnabledBindingValue() {
            if (window.sf.accessibility?.preferences?.focusableDisabledButtons) {
                return true;
            } else {
                return this.rightButtonEnabled();
            }
        }

        private getRightButtonAriaDisabledBindingValue() {
            if (window.sf.accessibility?.preferences?.focusableDisabledButtons) {
                return !(this.rightButtonEnabled());
            } else {
                return null;
            }
        }

        private getAddButtonEnabled() {
            if (typeof this.allowAdd === 'boolean') {
                return this.allowAdd === true;
            }
            if (typeof this.allowAdd === 'function') {
                return this.allowAdd() === true;
            }

            return false;
        }

        private getAddButtonEnabledBindingValue() {
            if (window.sf.accessibility?.preferences?.focusableDisabledButtons) {
                return true;
            } else {
                return this.addButtonEnabled();
            }
        }

        private getAddButtonAriaDisabledBindingValue() {
            if (window.sf.accessibility?.preferences?.focusableDisabledButtons) {
                return !(this.addButtonEnabled());
            } else {
                return null;
            }
        }

        private getRemoveButtonEnabled() {
            if (typeof this.allowRemove === 'boolean') {
                return (this.allowRemove === true) && this.indexAsNumber() > 0;
            }
            if (typeof this.allowRemove === 'function') {
                return (this.allowRemove() === true) && this.indexAsNumber() > 0;
            }
        }

        private getRemoveButtonEnabledBindingValue() {
            if (window.sf.accessibility?.preferences?.focusableDisabledButtons) {
                return true;
            } else {
                return this.removeButtonEnabled();
            }
        }

        private getRemoveButtonAriaDisabledBindingValue() {
            if (window.sf.accessibility?.preferences?.focusableDisabledButtons) {
                return !(this.removeButtonEnabled());
            } else {
                return null;
            }
        }

        private setNewIndex(newIndex: number, checkIsValid?: boolean) {
            this.isError(false);
            if (!!checkIsValid === true && ko.unwrap(this.checkItemIsValidBeforeIndexChange) === true) {
                const currentIdx = this.indexAsNumber();
                if (currentIdx > 0 && this.collection.$items().length > 0) {
                    const item = this.collection.$items()[currentIdx - 1];
                    this.isError(!item.$isValid());
                }
            }
            if (!this.isError()) {
                this.isInternalIndexChange = true;
                this.index(newIndex);
                this.indexString(newIndex.toString());
                this.isInternalIndexChange = false;
            }
        }

        private writeButtonDisabledErrToAriaLiveRegion() {
            const msg = window.sf.localization.currentCulture().errorFormatter.formatButtonDisabled("");
            sffw.safeWriteToAriaLiveRegion(msg);
        }

        public onLeftButtonClicked() {
            const isEnabled = this.leftButtonEnabled();
            if (isEnabled) {
                const newIndex = this.indexAsNumber() - 1;
                this.setNewIndex(newIndex, true);
            } else if (window.sf.accessibility?.preferences?.focusableDisabledButtons) {
                this.writeButtonDisabledErrToAriaLiveRegion();
            }
        }

        public onRightButtonClicked() {
            const isEnabled = this.rightButtonEnabled();
            if (isEnabled) {
                const newIndex = this.indexAsNumber() + 1;
                this.setNewIndex(newIndex, true);
            } else if (window.sf.accessibility?.preferences?.focusableDisabledButtons) {
                this.writeButtonDisabledErrToAriaLiveRegion();
            }
        }

        public onAddButtonClicked() {
            const isEnabled = this.addButtonEnabled();
            if (isEnabled) {
                this.collection.$addItem().then((item) => {
                    const itemIndex = this.collection.$items().length;
                    this.setNewIndex(itemIndex, true);
                    if (this.itemAddHandler) {
                        const itemAddParams = new PagingRepeaterCtrlItemAddParams();
                        itemAddParams.newItem = item;
                        this.itemAddHandler(null, event, itemAddParams);
                    }
                });
            } else if (window.sf.accessibility?.preferences?.focusableDisabledButtons) {
                this.writeButtonDisabledErrToAriaLiveRegion();
            }
        }

        public onRemoveButtonClicked() {
            const isEnabled = this.removeButtonEnabled();
            const idx = this.indexAsNumber();
            if (isEnabled) {
                const item = this.collection.$items()[idx - 1];
                this.collection.$items.remove(item);
                if (idx > this.count() && this.count() > 0) {
                    const newIndex = this.count();
                    this.setNewIndex(newIndex, false);
                }
                if (this.itemRemoveHandler) {
                    const itemRemoveParams =  new PagingRepeaterCtrlItemRemoveParams();
                    itemRemoveParams.removedItem = item;
                    this.itemRemoveHandler(null, event, itemRemoveParams);
                }
            } else if (window.sf.accessibility?.preferences?.focusableDisabledButtons) {
                this.writeButtonDisabledErrToAriaLiveRegion();
            }
        }

        private getTitle() {
            let itemTitle: string = '';
            if (this.captionAttName) {
                const item = this.collection.$items()[this.indexAsNumber() - 1];
                if (item) {
                    const titleAtt = item[this.captionAttName];
                    if (titleAtt) {
                        itemTitle = ` - ${titleAtt.$asString()}`;
                    }
                }
            }
            return ` / ${this.count()}${itemTitle}`;
        }

        private getFullCssClass(cssClass: string) {
            return ` ${cssClass} ${_.isString(this.iconsAdditionalClass) ? this.iconsAdditionalClass : 'fa-lg fa-fw'}`;
        }

        private getDataHasErrors(): boolean {
            if (ko.unwrap(this.indicateDataErrors) === false) {
                return null;
            } else {
                // $isReportingErrors on collection will be added to SF > 1.82
                const isReportingErrors: boolean = (typeof this.collection.$isReportingErrors === 'function') ? this.collection.$isReportingErrors() : true;
                return isReportingErrors && this.collection.$validationErrors().length > 0;
            }
        }

        private onCollectionArrayChange(collection: IDataStruct[]) {
            var cnt = collection.length;
            if (this.indexAsNumber() === 0) {
                const intl = cnt > 0 ? 1 : 0;
                this.setNewIndex(intl);
            } else {
                if (this.indexAsNumber() > cnt) {
                    this.setNewIndex(cnt);
                }
            }
        }

        private onIndexStringChange(newValue: string) {
            const n = Number(newValue.trim());
            if (_.isNaN(n) || n < 1 || n > this.count()) {
                this.indexString(this.index().toString());
            } else {
                if (this.index() !== n) {
                    this.isInternalIndexChange = true;
                    this.index(n);
                    this.isInternalIndexChange = false;
                }
            }
        }

        private onIndexChange(newValue: number) {
            if (this.isInternalIndexChange === true) {
                return;
            }
            // if someone from "outside" pushes out-of-range index value, we will ignore it
            // PagingRepeater returns null as currently displayed item in that case
            if (this.count() > 0) {
                if (newValue && newValue > 0 && newValue <= this.count()) {
                    this.indexString(newValue.toString());
                } else {
                    console.error(`PagingRepeaterCtrl: index value=${newValue} is out of range.`);
                }
            } else {
                console.error(`PagingRepeaterCtrl: index value=${newValue} is out of range.`);
            }
        }

        public dispose() {
            _.each(this.subscriptions, (sub) => {
                sub.dispose();
            });
        }
    }
}
