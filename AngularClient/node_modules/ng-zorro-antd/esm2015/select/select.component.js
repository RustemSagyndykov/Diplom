/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, ENTER, ESCAPE, SPACE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Host, Input, Optional, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { slideMotion } from 'ng-zorro-antd/core/animation';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { reqAnimFrame } from 'ng-zorro-antd/core/polyfill';
import { InputBoolean, isNotNil } from 'ng-zorro-antd/core/util';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { NzOptionGroupComponent } from './option-group.component';
import { NzOptionComponent } from './option.component';
import { NzSelectTopControlComponent } from './select-top-control.component';
const defaultFilterOption = (searchValue, item) => {
    if (item && item.nzLabel) {
        return item.nzLabel.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    }
    else {
        return false;
    }
};
const ɵ0 = defaultFilterOption;
const NZ_CONFIG_MODULE_NAME = 'select';
export class NzSelectComponent {
    constructor(nzConfigService, cdr, elementRef, platform, focusMonitor, directionality, noAnimation) {
        this.nzConfigService = nzConfigService;
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.platform = platform;
        this.focusMonitor = focusMonitor;
        this.directionality = directionality;
        this.noAnimation = noAnimation;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.nzId = null;
        this.nzSize = 'default';
        this.nzOptionHeightPx = 32;
        this.nzOptionOverflowSize = 8;
        this.nzDropdownClassName = null;
        this.nzDropdownMatchSelectWidth = true;
        this.nzDropdownStyle = null;
        this.nzNotFoundContent = undefined;
        this.nzPlaceHolder = null;
        this.nzMaxTagCount = Infinity;
        this.nzDropdownRender = null;
        this.nzCustomTemplate = null;
        this.nzSuffixIcon = null;
        this.nzClearIcon = null;
        this.nzRemoveIcon = null;
        this.nzMenuItemSelectedIcon = null;
        this.nzTokenSeparators = [];
        this.nzMaxTagPlaceholder = null;
        this.nzMaxMultipleCount = Infinity;
        this.nzMode = 'default';
        this.nzFilterOption = defaultFilterOption;
        this.compareWith = (o1, o2) => o1 === o2;
        this.nzAllowClear = false;
        this.nzBorderless = false;
        this.nzShowSearch = false;
        this.nzLoading = false;
        this.nzAutoFocus = false;
        this.nzAutoClearSearchValue = true;
        this.nzServerSearch = false;
        this.nzDisabled = false;
        this.nzOpen = false;
        this.nzOptions = [];
        this.nzOnSearch = new EventEmitter();
        this.nzScrollToBottom = new EventEmitter();
        this.nzOpenChange = new EventEmitter();
        this.nzBlur = new EventEmitter();
        this.nzFocus = new EventEmitter();
        this.listOfValue$ = new BehaviorSubject([]);
        this.listOfTemplateItem$ = new BehaviorSubject([]);
        this.listOfTagAndTemplateItem = [];
        this.searchValue = '';
        this.isReactiveDriven = false;
        this.destroy$ = new Subject();
        this.onChange = () => { };
        this.onTouched = () => { };
        this.dropDownPosition = 'bottom';
        this.triggerWidth = null;
        this.listOfContainerItem = [];
        this.listOfTopItem = [];
        this.activatedValue = null;
        this.listOfValue = [];
        this.focused = false;
        this.dir = 'ltr';
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-select');
    }
    set nzShowArrow(value) {
        this._nzShowArrow = value;
    }
    get nzShowArrow() {
        return this._nzShowArrow === undefined ? this.nzMode === 'default' : this._nzShowArrow;
    }
    generateTagItem(value) {
        return {
            nzValue: value,
            nzLabel: value,
            type: 'item'
        };
    }
    onItemClick(value) {
        this.activatedValue = value;
        if (this.nzMode === 'default') {
            if (this.listOfValue.length === 0 || !this.compareWith(this.listOfValue[0], value)) {
                this.updateListOfValue([value]);
            }
            this.setOpenState(false);
        }
        else {
            const targetIndex = this.listOfValue.findIndex(o => this.compareWith(o, value));
            if (targetIndex !== -1) {
                const listOfValueAfterRemoved = this.listOfValue.filter((_, i) => i !== targetIndex);
                this.updateListOfValue(listOfValueAfterRemoved);
            }
            else if (this.listOfValue.length < this.nzMaxMultipleCount) {
                const listOfValueAfterAdded = [...this.listOfValue, value];
                this.updateListOfValue(listOfValueAfterAdded);
            }
            this.focus();
            if (this.nzAutoClearSearchValue) {
                this.clearInput();
            }
        }
    }
    onItemDelete(item) {
        const listOfSelectedValue = this.listOfValue.filter(v => !this.compareWith(v, item.nzValue));
        this.updateListOfValue(listOfSelectedValue);
        this.clearInput();
    }
    onHostClick() {
        if ((this.nzOpen && this.nzShowSearch) || this.nzDisabled) {
            return;
        }
        this.setOpenState(!this.nzOpen);
    }
    updateListOfContainerItem() {
        let listOfContainerItem = this.listOfTagAndTemplateItem
            .filter(item => !item.nzHide)
            .filter(item => {
            if (!this.nzServerSearch && this.searchValue) {
                return this.nzFilterOption(this.searchValue, item);
            }
            else {
                return true;
            }
        });
        if (this.nzMode === 'tags' && this.searchValue) {
            const matchedItem = this.listOfTagAndTemplateItem.find(item => item.nzLabel === this.searchValue);
            if (!matchedItem) {
                const tagItem = this.generateTagItem(this.searchValue);
                listOfContainerItem = [tagItem, ...listOfContainerItem];
                this.activatedValue = tagItem.nzValue;
            }
            else {
                this.activatedValue = matchedItem.nzValue;
            }
        }
        const activatedItem = listOfContainerItem.find(item => this.compareWith(item.nzValue, this.listOfValue[0])) || listOfContainerItem[0];
        this.activatedValue = (activatedItem && activatedItem.nzValue) || null;
        let listOfGroupLabel = [];
        if (this.isReactiveDriven) {
            listOfGroupLabel = [...new Set(this.nzOptions.filter(o => o.groupLabel).map(o => o.groupLabel))];
        }
        else {
            if (this.listOfNzOptionGroupComponent) {
                listOfGroupLabel = this.listOfNzOptionGroupComponent.map(o => o.nzLabel);
            }
        }
        /** insert group item **/
        listOfGroupLabel.forEach(label => {
            const index = listOfContainerItem.findIndex(item => label === item.groupLabel);
            if (index > -1) {
                const groupItem = { groupLabel: label, type: 'group', key: label };
                listOfContainerItem.splice(index, 0, groupItem);
            }
        });
        this.listOfContainerItem = [...listOfContainerItem];
        this.updateCdkConnectedOverlayPositions();
    }
    clearInput() {
        this.nzSelectTopControlComponent.clearInputValue();
    }
    updateListOfValue(listOfValue) {
        const covertListToModel = (list, mode) => {
            if (mode === 'default') {
                if (list.length > 0) {
                    return list[0];
                }
                else {
                    return null;
                }
            }
            else {
                return list;
            }
        };
        const model = covertListToModel(listOfValue, this.nzMode);
        if (this.value !== model) {
            this.listOfValue = listOfValue;
            this.listOfValue$.next(listOfValue);
            this.value = model;
            this.onChange(this.value);
        }
    }
    onTokenSeparate(listOfLabel) {
        const listOfMatchedValue = this.listOfTagAndTemplateItem
            .filter(item => listOfLabel.findIndex(label => label === item.nzLabel) !== -1)
            .map(item => item.nzValue)
            .filter(item => this.listOfValue.findIndex(v => this.compareWith(v, item)) === -1);
        if (this.nzMode === 'multiple') {
            this.updateListOfValue([...this.listOfValue, ...listOfMatchedValue]);
        }
        else if (this.nzMode === 'tags') {
            const listOfUnMatchedLabel = listOfLabel.filter(label => this.listOfTagAndTemplateItem.findIndex(item => item.nzLabel === label) === -1);
            this.updateListOfValue([...this.listOfValue, ...listOfMatchedValue, ...listOfUnMatchedLabel]);
        }
        this.clearInput();
    }
    onOverlayKeyDown(e) {
        if (e.keyCode === ESCAPE) {
            this.setOpenState(false);
        }
    }
    onKeyDown(e) {
        if (this.nzDisabled) {
            return;
        }
        const listOfFilteredOptionNotDisabled = this.listOfContainerItem.filter(item => item.type === 'item').filter(item => !item.nzDisabled);
        const activatedIndex = listOfFilteredOptionNotDisabled.findIndex(item => this.compareWith(item.nzValue, this.activatedValue));
        switch (e.keyCode) {
            case UP_ARROW:
                e.preventDefault();
                if (this.nzOpen) {
                    const preIndex = activatedIndex > 0 ? activatedIndex - 1 : listOfFilteredOptionNotDisabled.length - 1;
                    this.activatedValue = listOfFilteredOptionNotDisabled[preIndex].nzValue;
                }
                break;
            case DOWN_ARROW:
                e.preventDefault();
                if (this.nzOpen) {
                    const nextIndex = activatedIndex < listOfFilteredOptionNotDisabled.length - 1 ? activatedIndex + 1 : 0;
                    this.activatedValue = listOfFilteredOptionNotDisabled[nextIndex].nzValue;
                }
                else {
                    this.setOpenState(true);
                }
                break;
            case ENTER:
                e.preventDefault();
                if (this.nzOpen) {
                    if (isNotNil(this.activatedValue)) {
                        this.onItemClick(this.activatedValue);
                    }
                }
                else {
                    this.setOpenState(true);
                }
                break;
            case SPACE:
                if (!this.nzOpen) {
                    this.setOpenState(true);
                    e.preventDefault();
                }
                break;
            case TAB:
                this.setOpenState(false);
                break;
            case ESCAPE:
                /**
                 * Skip the ESCAPE processing, it will be handled in {@link onOverlayKeyDown}.
                 */
                break;
            default:
                if (!this.nzOpen) {
                    this.setOpenState(true);
                }
        }
    }
    setOpenState(value) {
        if (this.nzOpen !== value) {
            this.nzOpen = value;
            this.nzOpenChange.emit(value);
            this.onOpenChange();
            this.cdr.markForCheck();
        }
    }
    onOpenChange() {
        this.updateCdkConnectedOverlayStatus();
        this.clearInput();
    }
    onInputValueChange(value) {
        this.searchValue = value;
        this.updateListOfContainerItem();
        this.nzOnSearch.emit(value);
        this.updateCdkConnectedOverlayPositions();
    }
    onClearSelection() {
        this.updateListOfValue([]);
    }
    onClickOutside(event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.setOpenState(false);
        }
    }
    focus() {
        this.nzSelectTopControlComponent.focus();
    }
    blur() {
        this.nzSelectTopControlComponent.blur();
    }
    onPositionChange(position) {
        this.dropDownPosition = position.connectionPair.originY;
    }
    updateCdkConnectedOverlayStatus() {
        if (this.platform.isBrowser && this.originElement.nativeElement) {
            reqAnimFrame(() => {
                this.triggerWidth = this.originElement.nativeElement.getBoundingClientRect().width;
                this.cdr.markForCheck();
            });
        }
    }
    updateCdkConnectedOverlayPositions() {
        reqAnimFrame(() => {
            var _a, _b;
            (_b = (_a = this.cdkConnectedOverlay) === null || _a === void 0 ? void 0 : _a.overlayRef) === null || _b === void 0 ? void 0 : _b.updatePosition();
        });
    }
    writeValue(modelValue) {
        /** https://github.com/angular/angular/issues/14988 **/
        if (this.value !== modelValue) {
            this.value = modelValue;
            const covertModelToList = (model, mode) => {
                if (model === null || model === undefined) {
                    return [];
                }
                else if (mode === 'default') {
                    return [model];
                }
                else {
                    return model;
                }
            };
            const listOfValue = covertModelToList(modelValue, this.nzMode);
            this.listOfValue = listOfValue;
            this.listOfValue$.next(listOfValue);
            this.cdr.markForCheck();
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(disabled) {
        this.nzDisabled = disabled;
        if (disabled) {
            this.setOpenState(false);
        }
        this.cdr.markForCheck();
    }
    ngOnChanges(changes) {
        const { nzOpen, nzDisabled, nzOptions } = changes;
        if (nzOpen) {
            this.onOpenChange();
        }
        if (nzDisabled && this.nzDisabled) {
            this.setOpenState(false);
        }
        if (nzOptions) {
            this.isReactiveDriven = true;
            const listOfOptions = this.nzOptions || [];
            const listOfTransformedItem = listOfOptions.map(item => {
                return {
                    template: item.label instanceof TemplateRef ? item.label : null,
                    nzLabel: typeof item.label === 'string' ? item.label : null,
                    nzValue: item.value,
                    nzDisabled: item.disabled || false,
                    nzHide: item.hide || false,
                    nzCustomContent: item.label instanceof TemplateRef,
                    groupLabel: item.groupLabel || null,
                    type: 'item',
                    key: item.value
                };
            });
            this.listOfTemplateItem$.next(listOfTransformedItem);
        }
    }
    ngOnInit() {
        var _a;
        this.focusMonitor
            .monitor(this.elementRef, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe(focusOrigin => {
            if (!focusOrigin) {
                this.focused = false;
                this.cdr.markForCheck();
                this.nzBlur.emit();
                Promise.resolve().then(() => {
                    this.onTouched();
                });
            }
            else {
                this.focused = true;
                this.cdr.markForCheck();
                this.nzFocus.emit();
            }
        });
        combineLatest([this.listOfValue$, this.listOfTemplateItem$])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([listOfSelectedValue, listOfTemplateItem]) => {
            const listOfTagItem = listOfSelectedValue
                .filter(() => this.nzMode === 'tags')
                .filter(value => listOfTemplateItem.findIndex(o => this.compareWith(o.nzValue, value)) === -1)
                .map(value => this.listOfTopItem.find(o => this.compareWith(o.nzValue, value)) || this.generateTagItem(value));
            this.listOfTagAndTemplateItem = [...listOfTemplateItem, ...listOfTagItem];
            this.listOfTopItem = this.listOfValue
                .map(v => [...this.listOfTagAndTemplateItem, ...this.listOfTopItem].find(item => this.compareWith(v, item.nzValue)))
                .filter(item => !!item);
            this.updateListOfContainerItem();
        });
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
            this.dir = direction;
            this.cdr.detectChanges();
        });
        this.dir = this.directionality.value;
    }
    ngAfterContentInit() {
        if (!this.isReactiveDriven) {
            merge(this.listOfNzOptionGroupComponent.changes, this.listOfNzOptionComponent.changes)
                .pipe(startWith(true), switchMap(() => merge(...[
                this.listOfNzOptionComponent.changes,
                this.listOfNzOptionGroupComponent.changes,
                ...this.listOfNzOptionComponent.map(option => option.changes),
                ...this.listOfNzOptionGroupComponent.map(option => option.changes)
            ]).pipe(startWith(true))), takeUntil(this.destroy$))
                .subscribe(() => {
                const listOfOptionInterface = this.listOfNzOptionComponent.toArray().map(item => {
                    const { template, nzLabel, nzValue, nzDisabled, nzHide, nzCustomContent, groupLabel } = item;
                    return { template, nzLabel, nzValue, nzDisabled, nzHide, nzCustomContent, groupLabel, type: 'item', key: nzValue };
                });
                this.listOfTemplateItem$.next(listOfOptionInterface);
                this.cdr.markForCheck();
            });
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
NzSelectComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-select',
                exportAs: 'nzSelect',
                preserveWhitespaces: false,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NzSelectComponent),
                        multi: true
                    }
                ],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                animations: [slideMotion],
                template: `
    <nz-select-top-control
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [nzId]="nzId"
      [open]="nzOpen"
      [disabled]="nzDisabled"
      [mode]="nzMode"
      [@.disabled]="noAnimation?.nzNoAnimation"
      [nzNoAnimation]="noAnimation?.nzNoAnimation"
      [maxTagPlaceholder]="nzMaxTagPlaceholder"
      [removeIcon]="nzRemoveIcon"
      [placeHolder]="nzPlaceHolder"
      [maxTagCount]="nzMaxTagCount"
      [customTemplate]="nzCustomTemplate"
      [tokenSeparators]="nzTokenSeparators"
      [showSearch]="nzShowSearch"
      [autofocus]="nzAutoFocus"
      [listOfTopItem]="listOfTopItem"
      (inputValueChange)="onInputValueChange($event)"
      (tokenize)="onTokenSeparate($event)"
      (deleteItem)="onItemDelete($event)"
      (keydown)="onKeyDown($event)"
    ></nz-select-top-control>
    <nz-select-arrow
      *ngIf="nzShowArrow"
      [loading]="nzLoading"
      [search]="nzOpen && nzShowSearch"
      [suffixIcon]="nzSuffixIcon"
    ></nz-select-arrow>
    <nz-select-clear
      *ngIf="nzAllowClear && !nzDisabled && listOfValue.length"
      [clearIcon]="nzClearIcon"
      (clear)="onClearSelection()"
    ></nz-select-clear>
    <ng-template
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayMinWidth]="$any(nzDropdownMatchSelectWidth ? null : triggerWidth)"
      [cdkConnectedOverlayWidth]="$any(nzDropdownMatchSelectWidth ? triggerWidth : null)"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-select-dropdown'"
      [cdkConnectedOverlayPanelClass]="nzDropdownClassName!"
      [cdkConnectedOverlayOpen]="nzOpen"
      (overlayKeydown)="onOverlayKeyDown($event)"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="setOpenState(false)"
      (positionChange)="onPositionChange($event)"
    >
      <nz-option-container
        [ngStyle]="nzDropdownStyle"
        [itemSize]="nzOptionHeightPx"
        [maxItemLength]="nzOptionOverflowSize"
        [matchWidth]="nzDropdownMatchSelectWidth"
        [class.ant-select-dropdown-placement-bottomLeft]="dropDownPosition === 'bottom'"
        [class.ant-select-dropdown-placement-topLeft]="dropDownPosition === 'top'"
        [@slideMotion]="'enter'"
        [@.disabled]="noAnimation?.nzNoAnimation"
        [nzNoAnimation]="noAnimation?.nzNoAnimation"
        [listOfContainerItem]="listOfContainerItem"
        [menuItemSelectedIcon]="nzMenuItemSelectedIcon"
        [notFoundContent]="nzNotFoundContent"
        [activatedValue]="activatedValue"
        [listOfSelectedValue]="listOfValue"
        [dropdownRender]="nzDropdownRender"
        [compareWith]="compareWith"
        [mode]="nzMode"
        (keydown)="onKeyDown($event)"
        (itemClick)="onItemClick($event)"
        (scrollToBottom)="nzScrollToBottom.emit()"
      ></nz-option-container>
    </ng-template>
  `,
                host: {
                    '[class.ant-select-lg]': 'nzSize === "large"',
                    '[class.ant-select-sm]': 'nzSize === "small"',
                    '[class.ant-select-show-arrow]': `nzShowArrow`,
                    '[class.ant-select-disabled]': 'nzDisabled',
                    '[class.ant-select-show-search]': `(nzShowSearch || nzMode !== 'default') && !nzDisabled`,
                    '[class.ant-select-allow-clear]': 'nzAllowClear',
                    '[class.ant-select-borderless]': 'nzBorderless',
                    '[class.ant-select-open]': 'nzOpen',
                    '[class.ant-select-focused]': 'nzOpen || focused',
                    '[class.ant-select-single]': `nzMode === 'default'`,
                    '[class.ant-select-multiple]': `nzMode !== 'default'`,
                    '[class.ant-select-rtl]': `dir === 'rtl'`,
                    '(click)': 'onHostClick()'
                }
            },] }
];
NzSelectComponent.ctorParameters = () => [
    { type: NzConfigService },
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: Platform },
    { type: FocusMonitor },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
NzSelectComponent.propDecorators = {
    nzId: [{ type: Input }],
    nzSize: [{ type: Input }],
    nzOptionHeightPx: [{ type: Input }],
    nzOptionOverflowSize: [{ type: Input }],
    nzDropdownClassName: [{ type: Input }],
    nzDropdownMatchSelectWidth: [{ type: Input }],
    nzDropdownStyle: [{ type: Input }],
    nzNotFoundContent: [{ type: Input }],
    nzPlaceHolder: [{ type: Input }],
    nzMaxTagCount: [{ type: Input }],
    nzDropdownRender: [{ type: Input }],
    nzCustomTemplate: [{ type: Input }],
    nzSuffixIcon: [{ type: Input }],
    nzClearIcon: [{ type: Input }],
    nzRemoveIcon: [{ type: Input }],
    nzMenuItemSelectedIcon: [{ type: Input }],
    nzTokenSeparators: [{ type: Input }],
    nzMaxTagPlaceholder: [{ type: Input }],
    nzMaxMultipleCount: [{ type: Input }],
    nzMode: [{ type: Input }],
    nzFilterOption: [{ type: Input }],
    compareWith: [{ type: Input }],
    nzAllowClear: [{ type: Input }],
    nzBorderless: [{ type: Input }],
    nzShowSearch: [{ type: Input }],
    nzLoading: [{ type: Input }],
    nzAutoFocus: [{ type: Input }],
    nzAutoClearSearchValue: [{ type: Input }],
    nzServerSearch: [{ type: Input }],
    nzDisabled: [{ type: Input }],
    nzOpen: [{ type: Input }],
    nzOptions: [{ type: Input }],
    nzShowArrow: [{ type: Input }],
    nzOnSearch: [{ type: Output }],
    nzScrollToBottom: [{ type: Output }],
    nzOpenChange: [{ type: Output }],
    nzBlur: [{ type: Output }],
    nzFocus: [{ type: Output }],
    originElement: [{ type: ViewChild, args: [CdkOverlayOrigin, { static: true, read: ElementRef },] }],
    cdkConnectedOverlay: [{ type: ViewChild, args: [CdkConnectedOverlay, { static: true },] }],
    nzSelectTopControlComponent: [{ type: ViewChild, args: [NzSelectTopControlComponent, { static: true },] }],
    listOfNzOptionComponent: [{ type: ContentChildren, args: [NzOptionComponent, { descendants: true },] }],
    listOfNzOptionGroupComponent: [{ type: ContentChildren, args: [NzOptionGroupComponent, { descendants: true },] }],
    nzOptionGroupComponentElement: [{ type: ViewChild, args: [NzOptionGroupComponent, { static: true, read: ElementRef },] }],
    nzSelectTopControlComponentElement: [{ type: ViewChild, args: [NzSelectTopControlComponent, { static: true, read: ElementRef },] }]
};
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzSuffixIcon", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzAllowClear", void 0);
__decorate([
    WithConfig(),
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzBorderless", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzShowSearch", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzLoading", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzAutoFocus", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzAutoClearSearchValue", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzServerSearch", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzOpen", void 0);
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbXBvbmVudHMvc2VsZWN0L3NlbGVjdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWEsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDeEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFrQyxNQUFNLHNCQUFzQixDQUFDO0FBQzdHLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLElBQUksRUFDSixLQUFLLEVBSUwsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBRVQsV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMzRCxPQUFPLEVBQWUsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3JGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUUzRCxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLHlCQUF5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Q0FDL0MsU0FBUyxTQUFDLDJCQUEyQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtzQ0FDdkQsZUFBZSxTQUFDLGlCQUFpQixFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTsyQ0FDeEQsZUFBZSxTQUFDLHNCQUFzQixFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTs0Q0FDN0QsU0FBUyxTQUFDLHNCQUFzQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2lEQUNwRSxTQUFTLFNBQUMsMkJBQTJCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7O0FBeEMxRTtJQURDLFVBQVUsRUFBMEM7O3VEQUNPO0FBVW5DO0lBQWYsWUFBWSxFQUFFOzt1REFBc0I7QUFDRTtJQUF0QyxVQUFVLEVBQVc7SUFBRSxZQUFZLEVBQUU7O3VEQUFzQjtBQUM1QztJQUFmLFlBQVksRUFBRTs7dURBQXNCO0FBQ3JCO0lBQWYsWUFBWSxFQUFFOztvREFBbUI7QUFDbEI7SUFBZixZQUFZLEVBQUU7O3NEQUFxQjtBQUNwQjtJQUFmLFlBQVksRUFBRTs7aUVBQStCO0FBQzlCO0lBQWYsWUFBWSxFQUFFOzt5REFBd0I7QUFDdkI7SUFBZixZQUFZLEVBQUU7O3FEQUFvQjtBQUNuQjtJQUFmLFlBQVksRUFBRTs7aURBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgRm9jdXNNb25pdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IERPV05fQVJST1csIEVOVEVSLCBFU0NBUEUsIFNQQUNFLCBUQUIsIFVQX0FSUk9XIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7IENka0Nvbm5lY3RlZE92ZXJsYXksIENka092ZXJsYXlPcmlnaW4sIENvbm5lY3RlZE92ZXJsYXlQb3NpdGlvbkNoYW5nZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IHNsaWRlTW90aW9uIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2FuaW1hdGlvbic7XG5pbXBvcnQgeyBOekNvbmZpZ0tleSwgTnpDb25maWdTZXJ2aWNlLCBXaXRoQ29uZmlnIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2NvbmZpZyc7XG5pbXBvcnQgeyBOek5vQW5pbWF0aW9uRGlyZWN0aXZlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL25vLWFuaW1hdGlvbic7XG5pbXBvcnQgeyByZXFBbmltRnJhbWUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvcG9seWZpbGwnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBOelNhZmVBbnksIE9uQ2hhbmdlVHlwZSwgT25Ub3VjaGVkVHlwZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS90eXBlcyc7XG5pbXBvcnQgeyBJbnB1dEJvb2xlYW4sIGlzTm90TmlsIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBtZXJnZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE56T3B0aW9uR3JvdXBDb21wb25lbnQgfSBmcm9tICcuL29wdGlvbi1ncm91cC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTnpPcHRpb25Db21wb25lbnQgfSBmcm9tICcuL29wdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgTnpTZWxlY3RUb3BDb250cm9sQ29tcG9uZW50IH0gZnJvbSAnLi9zZWxlY3QtdG9wLWNvbnRyb2wuY29tcG9uZW50JztcbmltcG9ydCB7IE56RmlsdGVyT3B0aW9uVHlwZSwgTnpTZWxlY3RJdGVtSW50ZXJmYWNlLCBOelNlbGVjdE1vZGVUeXBlLCBOelNlbGVjdE9wdGlvbkludGVyZmFjZSB9IGZyb20gJy4vc2VsZWN0LnR5cGVzJztcblxuY29uc3QgZGVmYXVsdEZpbHRlck9wdGlvbjogTnpGaWx0ZXJPcHRpb25UeXBlID0gKHNlYXJjaFZhbHVlOiBzdHJpbmcsIGl0ZW06IE56U2VsZWN0SXRlbUludGVyZmFjZSk6IGJvb2xlYW4gPT4ge1xuICBpZiAoaXRlbSAmJiBpdGVtLm56TGFiZWwpIHtcbiAgICByZXR1cm4gaXRlbS5uekxhYmVsLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2hWYWx1ZS50b0xvd2VyQ2FzZSgpKSA+IC0xO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuY29uc3QgTlpfQ09ORklHX01PRFVMRV9OQU1FOiBOekNvbmZpZ0tleSA9ICdzZWxlY3QnO1xuXG5leHBvcnQgdHlwZSBOelNlbGVjdFNpemVUeXBlID0gJ2xhcmdlJyB8ICdkZWZhdWx0JyB8ICdzbWFsbCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ256LXNlbGVjdCcsXG4gIGV4cG9ydEFzOiAnbnpTZWxlY3QnLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOelNlbGVjdENvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGFuaW1hdGlvbnM6IFtzbGlkZU1vdGlvbl0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG56LXNlbGVjdC10b3AtY29udHJvbFxuICAgICAgY2RrT3ZlcmxheU9yaWdpblxuICAgICAgI29yaWdpbj1cImNka092ZXJsYXlPcmlnaW5cIlxuICAgICAgW256SWRdPVwibnpJZFwiXG4gICAgICBbb3Blbl09XCJuek9wZW5cIlxuICAgICAgW2Rpc2FibGVkXT1cIm56RGlzYWJsZWRcIlxuICAgICAgW21vZGVdPVwibnpNb2RlXCJcbiAgICAgIFtALmRpc2FibGVkXT1cIm5vQW5pbWF0aW9uPy5uek5vQW5pbWF0aW9uXCJcbiAgICAgIFtuek5vQW5pbWF0aW9uXT1cIm5vQW5pbWF0aW9uPy5uek5vQW5pbWF0aW9uXCJcbiAgICAgIFttYXhUYWdQbGFjZWhvbGRlcl09XCJuek1heFRhZ1BsYWNlaG9sZGVyXCJcbiAgICAgIFtyZW1vdmVJY29uXT1cIm56UmVtb3ZlSWNvblwiXG4gICAgICBbcGxhY2VIb2xkZXJdPVwibnpQbGFjZUhvbGRlclwiXG4gICAgICBbbWF4VGFnQ291bnRdPVwibnpNYXhUYWdDb3VudFwiXG4gICAgICBbY3VzdG9tVGVtcGxhdGVdPVwibnpDdXN0b21UZW1wbGF0ZVwiXG4gICAgICBbdG9rZW5TZXBhcmF0b3JzXT1cIm56VG9rZW5TZXBhcmF0b3JzXCJcbiAgICAgIFtzaG93U2VhcmNoXT1cIm56U2hvd1NlYXJjaFwiXG4gICAgICBbYXV0b2ZvY3VzXT1cIm56QXV0b0ZvY3VzXCJcbiAgICAgIFtsaXN0T2ZUb3BJdGVtXT1cImxpc3RPZlRvcEl0ZW1cIlxuICAgICAgKGlucHV0VmFsdWVDaGFuZ2UpPVwib25JbnB1dFZhbHVlQ2hhbmdlKCRldmVudClcIlxuICAgICAgKHRva2VuaXplKT1cIm9uVG9rZW5TZXBhcmF0ZSgkZXZlbnQpXCJcbiAgICAgIChkZWxldGVJdGVtKT1cIm9uSXRlbURlbGV0ZSgkZXZlbnQpXCJcbiAgICAgIChrZXlkb3duKT1cIm9uS2V5RG93bigkZXZlbnQpXCJcbiAgICA+PC9uei1zZWxlY3QtdG9wLWNvbnRyb2w+XG4gICAgPG56LXNlbGVjdC1hcnJvd1xuICAgICAgKm5nSWY9XCJuelNob3dBcnJvd1wiXG4gICAgICBbbG9hZGluZ109XCJuekxvYWRpbmdcIlxuICAgICAgW3NlYXJjaF09XCJuek9wZW4gJiYgbnpTaG93U2VhcmNoXCJcbiAgICAgIFtzdWZmaXhJY29uXT1cIm56U3VmZml4SWNvblwiXG4gICAgPjwvbnotc2VsZWN0LWFycm93PlxuICAgIDxuei1zZWxlY3QtY2xlYXJcbiAgICAgICpuZ0lmPVwibnpBbGxvd0NsZWFyICYmICFuekRpc2FibGVkICYmIGxpc3RPZlZhbHVlLmxlbmd0aFwiXG4gICAgICBbY2xlYXJJY29uXT1cIm56Q2xlYXJJY29uXCJcbiAgICAgIChjbGVhcik9XCJvbkNsZWFyU2VsZWN0aW9uKClcIlxuICAgID48L256LXNlbGVjdC1jbGVhcj5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgIGNka0Nvbm5lY3RlZE92ZXJsYXlcbiAgICAgIG56Q29ubmVjdGVkT3ZlcmxheVxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlNaW5XaWR0aF09XCIkYW55KG56RHJvcGRvd25NYXRjaFNlbGVjdFdpZHRoID8gbnVsbCA6IHRyaWdnZXJXaWR0aClcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlXaWR0aF09XCIkYW55KG56RHJvcGRvd25NYXRjaFNlbGVjdFdpZHRoID8gdHJpZ2dlcldpZHRoIDogbnVsbClcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlPcmlnaW5dPVwib3JpZ2luXCJcbiAgICAgIFtjZGtDb25uZWN0ZWRPdmVybGF5VHJhbnNmb3JtT3JpZ2luT25dPVwiJy5hbnQtc2VsZWN0LWRyb3Bkb3duJ1wiXG4gICAgICBbY2RrQ29ubmVjdGVkT3ZlcmxheVBhbmVsQ2xhc3NdPVwibnpEcm9wZG93bkNsYXNzTmFtZSFcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlPcGVuXT1cIm56T3BlblwiXG4gICAgICAob3ZlcmxheUtleWRvd24pPVwib25PdmVybGF5S2V5RG93bigkZXZlbnQpXCJcbiAgICAgIChvdmVybGF5T3V0c2lkZUNsaWNrKT1cIm9uQ2xpY2tPdXRzaWRlKCRldmVudClcIlxuICAgICAgKGRldGFjaCk9XCJzZXRPcGVuU3RhdGUoZmFsc2UpXCJcbiAgICAgIChwb3NpdGlvbkNoYW5nZSk9XCJvblBvc2l0aW9uQ2hhbmdlKCRldmVudClcIlxuICAgID5cbiAgICAgIDxuei1vcHRpb24tY29udGFpbmVyXG4gICAgICAgIFtuZ1N0eWxlXT1cIm56RHJvcGRvd25TdHlsZVwiXG4gICAgICAgIFtpdGVtU2l6ZV09XCJuek9wdGlvbkhlaWdodFB4XCJcbiAgICAgICAgW21heEl0ZW1MZW5ndGhdPVwibnpPcHRpb25PdmVyZmxvd1NpemVcIlxuICAgICAgICBbbWF0Y2hXaWR0aF09XCJuekRyb3Bkb3duTWF0Y2hTZWxlY3RXaWR0aFwiXG4gICAgICAgIFtjbGFzcy5hbnQtc2VsZWN0LWRyb3Bkb3duLXBsYWNlbWVudC1ib3R0b21MZWZ0XT1cImRyb3BEb3duUG9zaXRpb24gPT09ICdib3R0b20nXCJcbiAgICAgICAgW2NsYXNzLmFudC1zZWxlY3QtZHJvcGRvd24tcGxhY2VtZW50LXRvcExlZnRdPVwiZHJvcERvd25Qb3NpdGlvbiA9PT0gJ3RvcCdcIlxuICAgICAgICBbQHNsaWRlTW90aW9uXT1cIidlbnRlcidcIlxuICAgICAgICBbQC5kaXNhYmxlZF09XCJub0FuaW1hdGlvbj8ubnpOb0FuaW1hdGlvblwiXG4gICAgICAgIFtuek5vQW5pbWF0aW9uXT1cIm5vQW5pbWF0aW9uPy5uek5vQW5pbWF0aW9uXCJcbiAgICAgICAgW2xpc3RPZkNvbnRhaW5lckl0ZW1dPVwibGlzdE9mQ29udGFpbmVySXRlbVwiXG4gICAgICAgIFttZW51SXRlbVNlbGVjdGVkSWNvbl09XCJuek1lbnVJdGVtU2VsZWN0ZWRJY29uXCJcbiAgICAgICAgW25vdEZvdW5kQ29udGVudF09XCJuek5vdEZvdW5kQ29udGVudFwiXG4gICAgICAgIFthY3RpdmF0ZWRWYWx1ZV09XCJhY3RpdmF0ZWRWYWx1ZVwiXG4gICAgICAgIFtsaXN0T2ZTZWxlY3RlZFZhbHVlXT1cImxpc3RPZlZhbHVlXCJcbiAgICAgICAgW2Ryb3Bkb3duUmVuZGVyXT1cIm56RHJvcGRvd25SZW5kZXJcIlxuICAgICAgICBbY29tcGFyZVdpdGhdPVwiY29tcGFyZVdpdGhcIlxuICAgICAgICBbbW9kZV09XCJuek1vZGVcIlxuICAgICAgICAoa2V5ZG93bik9XCJvbktleURvd24oJGV2ZW50KVwiXG4gICAgICAgIChpdGVtQ2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50KVwiXG4gICAgICAgIChzY3JvbGxUb0JvdHRvbSk9XCJuelNjcm9sbFRvQm90dG9tLmVtaXQoKVwiXG4gICAgICA+PC9uei1vcHRpb24tY29udGFpbmVyPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmFudC1zZWxlY3QtbGddJzogJ256U2l6ZSA9PT0gXCJsYXJnZVwiJyxcbiAgICAnW2NsYXNzLmFudC1zZWxlY3Qtc21dJzogJ256U2l6ZSA9PT0gXCJzbWFsbFwiJyxcbiAgICAnW2NsYXNzLmFudC1zZWxlY3Qtc2hvdy1hcnJvd10nOiBgbnpTaG93QXJyb3dgLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1kaXNhYmxlZF0nOiAnbnpEaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LXNob3ctc2VhcmNoXSc6IGAobnpTaG93U2VhcmNoIHx8IG56TW9kZSAhPT0gJ2RlZmF1bHQnKSAmJiAhbnpEaXNhYmxlZGAsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LWFsbG93LWNsZWFyXSc6ICduekFsbG93Q2xlYXInLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1ib3JkZXJsZXNzXSc6ICduekJvcmRlcmxlc3MnLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1vcGVuXSc6ICduek9wZW4nLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1mb2N1c2VkXSc6ICduek9wZW4gfHwgZm9jdXNlZCcsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LXNpbmdsZV0nOiBgbnpNb2RlID09PSAnZGVmYXVsdCdgLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1tdWx0aXBsZV0nOiBgbnpNb2RlICE9PSAnZGVmYXVsdCdgLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1ydGxdJzogYGRpciA9PT0gJ3J0bCdgLFxuICAgICcoY2xpY2spJzogJ29uSG9zdENsaWNrKCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTnpTZWxlY3RDb21wb25lbnQgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcyB7XG4gIHJlYWRvbmx5IF9uek1vZHVsZU5hbWU6IE56Q29uZmlnS2V5ID0gTlpfQ09ORklHX01PRFVMRV9OQU1FO1xuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekFsbG93Q2xlYXI6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256Qm9yZGVybGVzczogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpTaG93U2VhcmNoOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekxvYWRpbmc6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256QXV0b0ZvY3VzOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekF1dG9DbGVhclNlYXJjaFZhbHVlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uelNlcnZlclNlYXJjaDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpEaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpPcGVuOiBCb29sZWFuSW5wdXQ7XG5cbiAgQElucHV0KCkgbnpJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIG56U2l6ZTogTnpTZWxlY3RTaXplVHlwZSA9ICdkZWZhdWx0JztcbiAgQElucHV0KCkgbnpPcHRpb25IZWlnaHRQeCA9IDMyO1xuICBASW5wdXQoKSBuek9wdGlvbk92ZXJmbG93U2l6ZSA9IDg7XG4gIEBJbnB1dCgpIG56RHJvcGRvd25DbGFzc05hbWU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBuekRyb3Bkb3duTWF0Y2hTZWxlY3RXaWR0aCA9IHRydWU7XG4gIEBJbnB1dCgpIG56RHJvcGRvd25TdHlsZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBuek5vdEZvdW5kQ29udGVudDogc3RyaW5nIHwgVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgbnpQbGFjZUhvbGRlcjogc3RyaW5nIHwgVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBuek1heFRhZ0NvdW50ID0gSW5maW5pdHk7XG4gIEBJbnB1dCgpIG56RHJvcGRvd25SZW5kZXI6IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpDdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8eyAkaW1wbGljaXQ6IE56U2VsZWN0SXRlbUludGVyZmFjZSB9PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKVxuICBAV2l0aENvbmZpZzxUZW1wbGF0ZVJlZjxOelNhZmVBbnk+IHwgc3RyaW5nIHwgbnVsbD4oKVxuICBuelN1ZmZpeEljb246IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpDbGVhckljb246IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpSZW1vdmVJY29uOiBUZW1wbGF0ZVJlZjxOelNhZmVBbnk+IHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIG56TWVudUl0ZW1TZWxlY3RlZEljb246IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpUb2tlblNlcGFyYXRvcnM6IHN0cmluZ1tdID0gW107XG4gIEBJbnB1dCgpIG56TWF4VGFnUGxhY2Vob2xkZXI6IFRlbXBsYXRlUmVmPHsgJGltcGxpY2l0OiBOelNhZmVBbnlbXSB9PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBuek1heE11bHRpcGxlQ291bnQgPSBJbmZpbml0eTtcbiAgQElucHV0KCkgbnpNb2RlOiBOelNlbGVjdE1vZGVUeXBlID0gJ2RlZmF1bHQnO1xuICBASW5wdXQoKSBuekZpbHRlck9wdGlvbjogTnpGaWx0ZXJPcHRpb25UeXBlID0gZGVmYXVsdEZpbHRlck9wdGlvbjtcbiAgQElucHV0KCkgY29tcGFyZVdpdGg6IChvMTogTnpTYWZlQW55LCBvMjogTnpTYWZlQW55KSA9PiBib29sZWFuID0gKG8xOiBOelNhZmVBbnksIG8yOiBOelNhZmVBbnkpID0+IG8xID09PSBvMjtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56QWxsb3dDbGVhciA9IGZhbHNlO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZzxib29sZWFuPigpIEBJbnB1dEJvb2xlYW4oKSBuekJvcmRlcmxlc3MgPSBmYWxzZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56U2hvd1NlYXJjaCA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpMb2FkaW5nID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekF1dG9Gb2N1cyA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpBdXRvQ2xlYXJTZWFyY2hWYWx1ZSA9IHRydWU7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuelNlcnZlclNlYXJjaCA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpEaXNhYmxlZCA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpPcGVuID0gZmFsc2U7XG4gIEBJbnB1dCgpIG56T3B0aW9uczogTnpTZWxlY3RPcHRpb25JbnRlcmZhY2VbXSA9IFtdO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBuelNob3dBcnJvdyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX256U2hvd0Fycm93ID0gdmFsdWU7XG4gIH1cbiAgZ2V0IG56U2hvd0Fycm93KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9uelNob3dBcnJvdyA9PT0gdW5kZWZpbmVkID8gdGhpcy5uek1vZGUgPT09ICdkZWZhdWx0JyA6IHRoaXMuX256U2hvd0Fycm93O1xuICB9XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56T25TZWFyY2ggPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56U2Nyb2xsVG9Cb3R0b20gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuek9wZW5DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuekJsdXIgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuekZvY3VzID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBAVmlld0NoaWxkKENka092ZXJsYXlPcmlnaW4sIHsgc3RhdGljOiB0cnVlLCByZWFkOiBFbGVtZW50UmVmIH0pIG9yaWdpbkVsZW1lbnQhOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKENka0Nvbm5lY3RlZE92ZXJsYXksIHsgc3RhdGljOiB0cnVlIH0pIGNka0Nvbm5lY3RlZE92ZXJsYXkhOiBDZGtDb25uZWN0ZWRPdmVybGF5O1xuICBAVmlld0NoaWxkKE56U2VsZWN0VG9wQ29udHJvbENvbXBvbmVudCwgeyBzdGF0aWM6IHRydWUgfSkgbnpTZWxlY3RUb3BDb250cm9sQ29tcG9uZW50ITogTnpTZWxlY3RUb3BDb250cm9sQ29tcG9uZW50O1xuICBAQ29udGVudENoaWxkcmVuKE56T3B0aW9uQ29tcG9uZW50LCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pIGxpc3RPZk56T3B0aW9uQ29tcG9uZW50ITogUXVlcnlMaXN0PE56T3B0aW9uQ29tcG9uZW50PjtcbiAgQENvbnRlbnRDaGlsZHJlbihOek9wdGlvbkdyb3VwQ29tcG9uZW50LCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pIGxpc3RPZk56T3B0aW9uR3JvdXBDb21wb25lbnQhOiBRdWVyeUxpc3Q8TnpPcHRpb25Hcm91cENvbXBvbmVudD47XG4gIEBWaWV3Q2hpbGQoTnpPcHRpb25Hcm91cENvbXBvbmVudCwgeyBzdGF0aWM6IHRydWUsIHJlYWQ6IEVsZW1lbnRSZWYgfSkgbnpPcHRpb25Hcm91cENvbXBvbmVudEVsZW1lbnQhOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKE56U2VsZWN0VG9wQ29udHJvbENvbXBvbmVudCwgeyBzdGF0aWM6IHRydWUsIHJlYWQ6IEVsZW1lbnRSZWYgfSkgbnpTZWxlY3RUb3BDb250cm9sQ29tcG9uZW50RWxlbWVudCE6IEVsZW1lbnRSZWY7XG4gIHByaXZhdGUgbGlzdE9mVmFsdWUkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxOelNhZmVBbnlbXT4oW10pO1xuICBwcml2YXRlIGxpc3RPZlRlbXBsYXRlSXRlbSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PE56U2VsZWN0SXRlbUludGVyZmFjZVtdPihbXSk7XG4gIHByaXZhdGUgbGlzdE9mVGFnQW5kVGVtcGxhdGVJdGVtOiBOelNlbGVjdEl0ZW1JbnRlcmZhY2VbXSA9IFtdO1xuICBwcml2YXRlIHNlYXJjaFZhbHVlOiBzdHJpbmcgPSAnJztcbiAgcHJpdmF0ZSBpc1JlYWN0aXZlRHJpdmVuID0gZmFsc2U7XG4gIHByaXZhdGUgdmFsdWU6IE56U2FmZUFueSB8IE56U2FmZUFueVtdO1xuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3QoKTtcbiAgcHJpdmF0ZSBfbnpTaG93QXJyb3c6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIG9uQ2hhbmdlOiBPbkNoYW5nZVR5cGUgPSAoKSA9PiB7fTtcbiAgb25Ub3VjaGVkOiBPblRvdWNoZWRUeXBlID0gKCkgPT4ge307XG4gIGRyb3BEb3duUG9zaXRpb246ICd0b3AnIHwgJ2NlbnRlcicgfCAnYm90dG9tJyA9ICdib3R0b20nO1xuICB0cmlnZ2VyV2lkdGg6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBsaXN0T2ZDb250YWluZXJJdGVtOiBOelNlbGVjdEl0ZW1JbnRlcmZhY2VbXSA9IFtdO1xuICBsaXN0T2ZUb3BJdGVtOiBOelNlbGVjdEl0ZW1JbnRlcmZhY2VbXSA9IFtdO1xuICBhY3RpdmF0ZWRWYWx1ZTogTnpTYWZlQW55IHwgbnVsbCA9IG51bGw7XG4gIGxpc3RPZlZhbHVlOiBOelNhZmVBbnlbXSA9IFtdO1xuICBmb2N1c2VkID0gZmFsc2U7XG4gIGRpcjogRGlyZWN0aW9uID0gJ2x0cic7XG5cbiAgZ2VuZXJhdGVUYWdJdGVtKHZhbHVlOiBzdHJpbmcpOiBOelNlbGVjdEl0ZW1JbnRlcmZhY2Uge1xuICAgIHJldHVybiB7XG4gICAgICBuelZhbHVlOiB2YWx1ZSxcbiAgICAgIG56TGFiZWw6IHZhbHVlLFxuICAgICAgdHlwZTogJ2l0ZW0nXG4gICAgfTtcbiAgfVxuXG4gIG9uSXRlbUNsaWNrKHZhbHVlOiBOelNhZmVBbnkpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2YXRlZFZhbHVlID0gdmFsdWU7XG4gICAgaWYgKHRoaXMubnpNb2RlID09PSAnZGVmYXVsdCcpIHtcbiAgICAgIGlmICh0aGlzLmxpc3RPZlZhbHVlLmxlbmd0aCA9PT0gMCB8fCAhdGhpcy5jb21wYXJlV2l0aCh0aGlzLmxpc3RPZlZhbHVlWzBdLCB2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVMaXN0T2ZWYWx1ZShbdmFsdWVdKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0T3BlblN0YXRlKGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdGFyZ2V0SW5kZXggPSB0aGlzLmxpc3RPZlZhbHVlLmZpbmRJbmRleChvID0+IHRoaXMuY29tcGFyZVdpdGgobywgdmFsdWUpKTtcbiAgICAgIGlmICh0YXJnZXRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgY29uc3QgbGlzdE9mVmFsdWVBZnRlclJlbW92ZWQgPSB0aGlzLmxpc3RPZlZhbHVlLmZpbHRlcigoXywgaSkgPT4gaSAhPT0gdGFyZ2V0SW5kZXgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxpc3RPZlZhbHVlKGxpc3RPZlZhbHVlQWZ0ZXJSZW1vdmVkKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5saXN0T2ZWYWx1ZS5sZW5ndGggPCB0aGlzLm56TWF4TXVsdGlwbGVDb3VudCkge1xuICAgICAgICBjb25zdCBsaXN0T2ZWYWx1ZUFmdGVyQWRkZWQgPSBbLi4udGhpcy5saXN0T2ZWYWx1ZSwgdmFsdWVdO1xuICAgICAgICB0aGlzLnVwZGF0ZUxpc3RPZlZhbHVlKGxpc3RPZlZhbHVlQWZ0ZXJBZGRlZCk7XG4gICAgICB9XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICBpZiAodGhpcy5uekF1dG9DbGVhclNlYXJjaFZhbHVlKSB7XG4gICAgICAgIHRoaXMuY2xlYXJJbnB1dCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uSXRlbURlbGV0ZShpdGVtOiBOelNlbGVjdEl0ZW1JbnRlcmZhY2UpOiB2b2lkIHtcbiAgICBjb25zdCBsaXN0T2ZTZWxlY3RlZFZhbHVlID0gdGhpcy5saXN0T2ZWYWx1ZS5maWx0ZXIodiA9PiAhdGhpcy5jb21wYXJlV2l0aCh2LCBpdGVtLm56VmFsdWUpKTtcbiAgICB0aGlzLnVwZGF0ZUxpc3RPZlZhbHVlKGxpc3RPZlNlbGVjdGVkVmFsdWUpO1xuICAgIHRoaXMuY2xlYXJJbnB1dCgpO1xuICB9XG5cbiAgb25Ib3N0Q2xpY2soKTogdm9pZCB7XG4gICAgaWYgKCh0aGlzLm56T3BlbiAmJiB0aGlzLm56U2hvd1NlYXJjaCkgfHwgdGhpcy5uekRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zZXRPcGVuU3RhdGUoIXRoaXMubnpPcGVuKTtcbiAgfVxuXG4gIHVwZGF0ZUxpc3RPZkNvbnRhaW5lckl0ZW0oKTogdm9pZCB7XG4gICAgbGV0IGxpc3RPZkNvbnRhaW5lckl0ZW0gPSB0aGlzLmxpc3RPZlRhZ0FuZFRlbXBsYXRlSXRlbVxuICAgICAgLmZpbHRlcihpdGVtID0+ICFpdGVtLm56SGlkZSlcbiAgICAgIC5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5uelNlcnZlclNlYXJjaCAmJiB0aGlzLnNlYXJjaFZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubnpGaWx0ZXJPcHRpb24odGhpcy5zZWFyY2hWYWx1ZSwgaXRlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIGlmICh0aGlzLm56TW9kZSA9PT0gJ3RhZ3MnICYmIHRoaXMuc2VhcmNoVmFsdWUpIHtcbiAgICAgIGNvbnN0IG1hdGNoZWRJdGVtID0gdGhpcy5saXN0T2ZUYWdBbmRUZW1wbGF0ZUl0ZW0uZmluZChpdGVtID0+IGl0ZW0ubnpMYWJlbCA9PT0gdGhpcy5zZWFyY2hWYWx1ZSk7XG4gICAgICBpZiAoIW1hdGNoZWRJdGVtKSB7XG4gICAgICAgIGNvbnN0IHRhZ0l0ZW0gPSB0aGlzLmdlbmVyYXRlVGFnSXRlbSh0aGlzLnNlYXJjaFZhbHVlKTtcbiAgICAgICAgbGlzdE9mQ29udGFpbmVySXRlbSA9IFt0YWdJdGVtLCAuLi5saXN0T2ZDb250YWluZXJJdGVtXTtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRWYWx1ZSA9IHRhZ0l0ZW0ubnpWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVkVmFsdWUgPSBtYXRjaGVkSXRlbS5uelZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBhY3RpdmF0ZWRJdGVtID0gbGlzdE9mQ29udGFpbmVySXRlbS5maW5kKGl0ZW0gPT4gdGhpcy5jb21wYXJlV2l0aChpdGVtLm56VmFsdWUsIHRoaXMubGlzdE9mVmFsdWVbMF0pKSB8fCBsaXN0T2ZDb250YWluZXJJdGVtWzBdO1xuICAgIHRoaXMuYWN0aXZhdGVkVmFsdWUgPSAoYWN0aXZhdGVkSXRlbSAmJiBhY3RpdmF0ZWRJdGVtLm56VmFsdWUpIHx8IG51bGw7XG4gICAgbGV0IGxpc3RPZkdyb3VwTGFiZWw6IEFycmF5PHN0cmluZyB8IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBudWxsPiA9IFtdO1xuICAgIGlmICh0aGlzLmlzUmVhY3RpdmVEcml2ZW4pIHtcbiAgICAgIGxpc3RPZkdyb3VwTGFiZWwgPSBbLi4ubmV3IFNldCh0aGlzLm56T3B0aW9ucy5maWx0ZXIobyA9PiBvLmdyb3VwTGFiZWwpLm1hcChvID0+IG8uZ3JvdXBMYWJlbCEpKV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmxpc3RPZk56T3B0aW9uR3JvdXBDb21wb25lbnQpIHtcbiAgICAgICAgbGlzdE9mR3JvdXBMYWJlbCA9IHRoaXMubGlzdE9mTnpPcHRpb25Hcm91cENvbXBvbmVudC5tYXAobyA9PiBvLm56TGFiZWwpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKiogaW5zZXJ0IGdyb3VwIGl0ZW0gKiovXG4gICAgbGlzdE9mR3JvdXBMYWJlbC5mb3JFYWNoKGxhYmVsID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gbGlzdE9mQ29udGFpbmVySXRlbS5maW5kSW5kZXgoaXRlbSA9PiBsYWJlbCA9PT0gaXRlbS5ncm91cExhYmVsKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGNvbnN0IGdyb3VwSXRlbSA9IHsgZ3JvdXBMYWJlbDogbGFiZWwsIHR5cGU6ICdncm91cCcsIGtleTogbGFiZWwgfSBhcyBOelNlbGVjdEl0ZW1JbnRlcmZhY2U7XG4gICAgICAgIGxpc3RPZkNvbnRhaW5lckl0ZW0uc3BsaWNlKGluZGV4LCAwLCBncm91cEl0ZW0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMubGlzdE9mQ29udGFpbmVySXRlbSA9IFsuLi5saXN0T2ZDb250YWluZXJJdGVtXTtcbiAgICB0aGlzLnVwZGF0ZUNka0Nvbm5lY3RlZE92ZXJsYXlQb3NpdGlvbnMoKTtcbiAgfVxuXG4gIGNsZWFySW5wdXQoKTogdm9pZCB7XG4gICAgdGhpcy5uelNlbGVjdFRvcENvbnRyb2xDb21wb25lbnQuY2xlYXJJbnB1dFZhbHVlKCk7XG4gIH1cblxuICB1cGRhdGVMaXN0T2ZWYWx1ZShsaXN0T2ZWYWx1ZTogTnpTYWZlQW55W10pOiB2b2lkIHtcbiAgICBjb25zdCBjb3ZlcnRMaXN0VG9Nb2RlbCA9IChsaXN0OiBOelNhZmVBbnlbXSwgbW9kZTogTnpTZWxlY3RNb2RlVHlwZSk6IE56U2FmZUFueVtdIHwgTnpTYWZlQW55ID0+IHtcbiAgICAgIGlmIChtb2RlID09PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiBsaXN0WzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbGlzdDtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IG1vZGVsID0gY292ZXJ0TGlzdFRvTW9kZWwobGlzdE9mVmFsdWUsIHRoaXMubnpNb2RlKTtcbiAgICBpZiAodGhpcy52YWx1ZSAhPT0gbW9kZWwpIHtcbiAgICAgIHRoaXMubGlzdE9mVmFsdWUgPSBsaXN0T2ZWYWx1ZTtcbiAgICAgIHRoaXMubGlzdE9mVmFsdWUkLm5leHQobGlzdE9mVmFsdWUpO1xuICAgICAgdGhpcy52YWx1ZSA9IG1vZGVsO1xuICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBvblRva2VuU2VwYXJhdGUobGlzdE9mTGFiZWw6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgY29uc3QgbGlzdE9mTWF0Y2hlZFZhbHVlID0gdGhpcy5saXN0T2ZUYWdBbmRUZW1wbGF0ZUl0ZW1cbiAgICAgIC5maWx0ZXIoaXRlbSA9PiBsaXN0T2ZMYWJlbC5maW5kSW5kZXgobGFiZWwgPT4gbGFiZWwgPT09IGl0ZW0ubnpMYWJlbCkgIT09IC0xKVxuICAgICAgLm1hcChpdGVtID0+IGl0ZW0ubnpWYWx1ZSlcbiAgICAgIC5maWx0ZXIoaXRlbSA9PiB0aGlzLmxpc3RPZlZhbHVlLmZpbmRJbmRleCh2ID0+IHRoaXMuY29tcGFyZVdpdGgodiwgaXRlbSkpID09PSAtMSk7XG4gICAgaWYgKHRoaXMubnpNb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxpc3RPZlZhbHVlKFsuLi50aGlzLmxpc3RPZlZhbHVlLCAuLi5saXN0T2ZNYXRjaGVkVmFsdWVdKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubnpNb2RlID09PSAndGFncycpIHtcbiAgICAgIGNvbnN0IGxpc3RPZlVuTWF0Y2hlZExhYmVsID0gbGlzdE9mTGFiZWwuZmlsdGVyKFxuICAgICAgICBsYWJlbCA9PiB0aGlzLmxpc3RPZlRhZ0FuZFRlbXBsYXRlSXRlbS5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLm56TGFiZWwgPT09IGxhYmVsKSA9PT0gLTFcbiAgICAgICk7XG4gICAgICB0aGlzLnVwZGF0ZUxpc3RPZlZhbHVlKFsuLi50aGlzLmxpc3RPZlZhbHVlLCAuLi5saXN0T2ZNYXRjaGVkVmFsdWUsIC4uLmxpc3RPZlVuTWF0Y2hlZExhYmVsXSk7XG4gICAgfVxuICAgIHRoaXMuY2xlYXJJbnB1dCgpO1xuICB9XG5cbiAgb25PdmVybGF5S2V5RG93bihlOiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gRVNDQVBFKSB7XG4gICAgICB0aGlzLnNldE9wZW5TdGF0ZShmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgb25LZXlEb3duKGU6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5uekRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGxpc3RPZkZpbHRlcmVkT3B0aW9uTm90RGlzYWJsZWQgPSB0aGlzLmxpc3RPZkNvbnRhaW5lckl0ZW0uZmlsdGVyKGl0ZW0gPT4gaXRlbS50eXBlID09PSAnaXRlbScpLmZpbHRlcihpdGVtID0+ICFpdGVtLm56RGlzYWJsZWQpO1xuICAgIGNvbnN0IGFjdGl2YXRlZEluZGV4ID0gbGlzdE9mRmlsdGVyZWRPcHRpb25Ob3REaXNhYmxlZC5maW5kSW5kZXgoaXRlbSA9PiB0aGlzLmNvbXBhcmVXaXRoKGl0ZW0ubnpWYWx1ZSwgdGhpcy5hY3RpdmF0ZWRWYWx1ZSkpO1xuICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICBjYXNlIFVQX0FSUk9XOlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLm56T3Blbikge1xuICAgICAgICAgIGNvbnN0IHByZUluZGV4ID0gYWN0aXZhdGVkSW5kZXggPiAwID8gYWN0aXZhdGVkSW5kZXggLSAxIDogbGlzdE9mRmlsdGVyZWRPcHRpb25Ob3REaXNhYmxlZC5sZW5ndGggLSAxO1xuICAgICAgICAgIHRoaXMuYWN0aXZhdGVkVmFsdWUgPSBsaXN0T2ZGaWx0ZXJlZE9wdGlvbk5vdERpc2FibGVkW3ByZUluZGV4XS5uelZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBET1dOX0FSUk9XOlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLm56T3Blbikge1xuICAgICAgICAgIGNvbnN0IG5leHRJbmRleCA9IGFjdGl2YXRlZEluZGV4IDwgbGlzdE9mRmlsdGVyZWRPcHRpb25Ob3REaXNhYmxlZC5sZW5ndGggLSAxID8gYWN0aXZhdGVkSW5kZXggKyAxIDogMDtcbiAgICAgICAgICB0aGlzLmFjdGl2YXRlZFZhbHVlID0gbGlzdE9mRmlsdGVyZWRPcHRpb25Ob3REaXNhYmxlZFtuZXh0SW5kZXhdLm56VmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRPcGVuU3RhdGUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLm56T3Blbikge1xuICAgICAgICAgIGlmIChpc05vdE5pbCh0aGlzLmFjdGl2YXRlZFZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy5vbkl0ZW1DbGljayh0aGlzLmFjdGl2YXRlZFZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRPcGVuU3RhdGUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgICBpZiAoIXRoaXMubnpPcGVuKSB7XG4gICAgICAgICAgdGhpcy5zZXRPcGVuU3RhdGUodHJ1ZSk7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUQUI6XG4gICAgICAgIHRoaXMuc2V0T3BlblN0YXRlKGZhbHNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVTQ0FQRTpcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNraXAgdGhlIEVTQ0FQRSBwcm9jZXNzaW5nLCBpdCB3aWxsIGJlIGhhbmRsZWQgaW4ge0BsaW5rIG9uT3ZlcmxheUtleURvd259LlxuICAgICAgICAgKi9cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoIXRoaXMubnpPcGVuKSB7XG4gICAgICAgICAgdGhpcy5zZXRPcGVuU3RhdGUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRPcGVuU3RhdGUodmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5uek9wZW4gIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLm56T3BlbiA9IHZhbHVlO1xuICAgICAgdGhpcy5uek9wZW5DaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgICB0aGlzLm9uT3BlbkNoYW5nZSgpO1xuICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgb25PcGVuQ2hhbmdlKCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlQ2RrQ29ubmVjdGVkT3ZlcmxheVN0YXR1cygpO1xuICAgIHRoaXMuY2xlYXJJbnB1dCgpO1xuICB9XG5cbiAgb25JbnB1dFZhbHVlQ2hhbmdlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNlYXJjaFZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy51cGRhdGVMaXN0T2ZDb250YWluZXJJdGVtKCk7XG4gICAgdGhpcy5uek9uU2VhcmNoLmVtaXQodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlQ2RrQ29ubmVjdGVkT3ZlcmxheVBvc2l0aW9ucygpO1xuICB9XG5cbiAgb25DbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZUxpc3RPZlZhbHVlKFtdKTtcbiAgfVxuXG4gIG9uQ2xpY2tPdXRzaWRlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICB0aGlzLnNldE9wZW5TdGF0ZShmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgZm9jdXMoKTogdm9pZCB7XG4gICAgdGhpcy5uelNlbGVjdFRvcENvbnRyb2xDb21wb25lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIGJsdXIoKTogdm9pZCB7XG4gICAgdGhpcy5uelNlbGVjdFRvcENvbnRyb2xDb21wb25lbnQuYmx1cigpO1xuICB9XG5cbiAgb25Qb3NpdGlvbkNoYW5nZShwb3NpdGlvbjogQ29ubmVjdGVkT3ZlcmxheVBvc2l0aW9uQ2hhbmdlKTogdm9pZCB7XG4gICAgdGhpcy5kcm9wRG93blBvc2l0aW9uID0gcG9zaXRpb24uY29ubmVjdGlvblBhaXIub3JpZ2luWTtcbiAgfVxuXG4gIHVwZGF0ZUNka0Nvbm5lY3RlZE92ZXJsYXlTdGF0dXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGxhdGZvcm0uaXNCcm93c2VyICYmIHRoaXMub3JpZ2luRWxlbWVudC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICByZXFBbmltRnJhbWUoKCkgPT4ge1xuICAgICAgICB0aGlzLnRyaWdnZXJXaWR0aCA9IHRoaXMub3JpZ2luRWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUNka0Nvbm5lY3RlZE92ZXJsYXlQb3NpdGlvbnMoKTogdm9pZCB7XG4gICAgcmVxQW5pbUZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMuY2RrQ29ubmVjdGVkT3ZlcmxheT8ub3ZlcmxheVJlZj8udXBkYXRlUG9zaXRpb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBuekNvbmZpZ1NlcnZpY2U6IE56Q29uZmlnU2VydmljZSxcbiAgICBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHByaXZhdGUgZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgQEhvc3QoKSBAT3B0aW9uYWwoKSBwdWJsaWMgbm9BbmltYXRpb24/OiBOek5vQW5pbWF0aW9uRGlyZWN0aXZlXG4gICkge1xuICAgIC8vIFRPRE86IG1vdmUgdG8gaG9zdCBhZnRlciBWaWV3IEVuZ2luZSBkZXByZWNhdGlvblxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FudC1zZWxlY3QnKTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUobW9kZWxWYWx1ZTogTnpTYWZlQW55IHwgTnpTYWZlQW55W10pOiB2b2lkIHtcbiAgICAvKiogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTQ5ODggKiovXG4gICAgaWYgKHRoaXMudmFsdWUgIT09IG1vZGVsVmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBtb2RlbFZhbHVlO1xuICAgICAgY29uc3QgY292ZXJ0TW9kZWxUb0xpc3QgPSAobW9kZWw6IE56U2FmZUFueVtdIHwgTnpTYWZlQW55LCBtb2RlOiBOelNlbGVjdE1vZGVUeXBlKTogTnpTYWZlQW55W10gPT4ge1xuICAgICAgICBpZiAobW9kZWwgPT09IG51bGwgfHwgbW9kZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgICByZXR1cm4gW21vZGVsXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBsaXN0T2ZWYWx1ZSA9IGNvdmVydE1vZGVsVG9MaXN0KG1vZGVsVmFsdWUsIHRoaXMubnpNb2RlKTtcbiAgICAgIHRoaXMubGlzdE9mVmFsdWUgPSBsaXN0T2ZWYWx1ZTtcbiAgICAgIHRoaXMubGlzdE9mVmFsdWUkLm5leHQobGlzdE9mVmFsdWUpO1xuICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogT25DaGFuZ2VUeXBlKTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IE9uVG91Y2hlZFR5cGUpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShkaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMubnpEaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgIGlmIChkaXNhYmxlZCkge1xuICAgICAgdGhpcy5zZXRPcGVuU3RhdGUoZmFsc2UpO1xuICAgIH1cbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IG56T3BlbiwgbnpEaXNhYmxlZCwgbnpPcHRpb25zIH0gPSBjaGFuZ2VzO1xuICAgIGlmIChuek9wZW4pIHtcbiAgICAgIHRoaXMub25PcGVuQ2hhbmdlKCk7XG4gICAgfVxuICAgIGlmIChuekRpc2FibGVkICYmIHRoaXMubnpEaXNhYmxlZCkge1xuICAgICAgdGhpcy5zZXRPcGVuU3RhdGUoZmFsc2UpO1xuICAgIH1cbiAgICBpZiAobnpPcHRpb25zKSB7XG4gICAgICB0aGlzLmlzUmVhY3RpdmVEcml2ZW4gPSB0cnVlO1xuICAgICAgY29uc3QgbGlzdE9mT3B0aW9ucyA9IHRoaXMubnpPcHRpb25zIHx8IFtdO1xuICAgICAgY29uc3QgbGlzdE9mVHJhbnNmb3JtZWRJdGVtID0gbGlzdE9mT3B0aW9ucy5tYXAoaXRlbSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdGVtcGxhdGU6IGl0ZW0ubGFiZWwgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZiA/IGl0ZW0ubGFiZWwgOiBudWxsLFxuICAgICAgICAgIG56TGFiZWw6IHR5cGVvZiBpdGVtLmxhYmVsID09PSAnc3RyaW5nJyA/IGl0ZW0ubGFiZWwgOiBudWxsLFxuICAgICAgICAgIG56VmFsdWU6IGl0ZW0udmFsdWUsXG4gICAgICAgICAgbnpEaXNhYmxlZDogaXRlbS5kaXNhYmxlZCB8fCBmYWxzZSxcbiAgICAgICAgICBuekhpZGU6IGl0ZW0uaGlkZSB8fCBmYWxzZSxcbiAgICAgICAgICBuekN1c3RvbUNvbnRlbnQ6IGl0ZW0ubGFiZWwgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZixcbiAgICAgICAgICBncm91cExhYmVsOiBpdGVtLmdyb3VwTGFiZWwgfHwgbnVsbCxcbiAgICAgICAgICB0eXBlOiAnaXRlbScsXG4gICAgICAgICAga2V5OiBpdGVtLnZhbHVlXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIHRoaXMubGlzdE9mVGVtcGxhdGVJdGVtJC5uZXh0KGxpc3RPZlRyYW5zZm9ybWVkSXRlbSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5mb2N1c01vbml0b3JcbiAgICAgIC5tb25pdG9yKHRoaXMuZWxlbWVudFJlZiwgdHJ1ZSlcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoZm9jdXNPcmlnaW4gPT4ge1xuICAgICAgICBpZiAoIWZvY3VzT3JpZ2luKSB7XG4gICAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgdGhpcy5uekJsdXIuZW1pdCgpO1xuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgIHRoaXMubnpGb2N1cy5lbWl0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIGNvbWJpbmVMYXRlc3QoW3RoaXMubGlzdE9mVmFsdWUkLCB0aGlzLmxpc3RPZlRlbXBsYXRlSXRlbSRdKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoW2xpc3RPZlNlbGVjdGVkVmFsdWUsIGxpc3RPZlRlbXBsYXRlSXRlbV0pID0+IHtcbiAgICAgICAgY29uc3QgbGlzdE9mVGFnSXRlbSA9IGxpc3RPZlNlbGVjdGVkVmFsdWVcbiAgICAgICAgICAuZmlsdGVyKCgpID0+IHRoaXMubnpNb2RlID09PSAndGFncycpXG4gICAgICAgICAgLmZpbHRlcih2YWx1ZSA9PiBsaXN0T2ZUZW1wbGF0ZUl0ZW0uZmluZEluZGV4KG8gPT4gdGhpcy5jb21wYXJlV2l0aChvLm56VmFsdWUsIHZhbHVlKSkgPT09IC0xKVxuICAgICAgICAgIC5tYXAodmFsdWUgPT4gdGhpcy5saXN0T2ZUb3BJdGVtLmZpbmQobyA9PiB0aGlzLmNvbXBhcmVXaXRoKG8ubnpWYWx1ZSwgdmFsdWUpKSB8fCB0aGlzLmdlbmVyYXRlVGFnSXRlbSh2YWx1ZSkpO1xuICAgICAgICB0aGlzLmxpc3RPZlRhZ0FuZFRlbXBsYXRlSXRlbSA9IFsuLi5saXN0T2ZUZW1wbGF0ZUl0ZW0sIC4uLmxpc3RPZlRhZ0l0ZW1dO1xuICAgICAgICB0aGlzLmxpc3RPZlRvcEl0ZW0gPSB0aGlzLmxpc3RPZlZhbHVlXG4gICAgICAgICAgLm1hcCh2ID0+IFsuLi50aGlzLmxpc3RPZlRhZ0FuZFRlbXBsYXRlSXRlbSwgLi4udGhpcy5saXN0T2ZUb3BJdGVtXS5maW5kKGl0ZW0gPT4gdGhpcy5jb21wYXJlV2l0aCh2LCBpdGVtLm56VmFsdWUpKSEpXG4gICAgICAgICAgLmZpbHRlcihpdGVtID0+ICEhaXRlbSk7XG4gICAgICAgIHRoaXMudXBkYXRlTGlzdE9mQ29udGFpbmVySXRlbSgpO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLmRpcmVjdGlvbmFsaXR5LmNoYW5nZT8ucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoZGlyZWN0aW9uOiBEaXJlY3Rpb24pID0+IHtcbiAgICAgIHRoaXMuZGlyID0gZGlyZWN0aW9uO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kaXIgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1JlYWN0aXZlRHJpdmVuKSB7XG4gICAgICBtZXJnZSh0aGlzLmxpc3RPZk56T3B0aW9uR3JvdXBDb21wb25lbnQuY2hhbmdlcywgdGhpcy5saXN0T2ZOek9wdGlvbkNvbXBvbmVudC5jaGFuZ2VzKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICBzdGFydFdpdGgodHJ1ZSksXG4gICAgICAgICAgc3dpdGNoTWFwKCgpID0+XG4gICAgICAgICAgICBtZXJnZShcbiAgICAgICAgICAgICAgLi4uW1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdE9mTnpPcHRpb25Db21wb25lbnQuY2hhbmdlcyxcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RPZk56T3B0aW9uR3JvdXBDb21wb25lbnQuY2hhbmdlcyxcbiAgICAgICAgICAgICAgICAuLi50aGlzLmxpc3RPZk56T3B0aW9uQ29tcG9uZW50Lm1hcChvcHRpb24gPT4gb3B0aW9uLmNoYW5nZXMpLFxuICAgICAgICAgICAgICAgIC4uLnRoaXMubGlzdE9mTnpPcHRpb25Hcm91cENvbXBvbmVudC5tYXAob3B0aW9uID0+IG9wdGlvbi5jaGFuZ2VzKVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICApLnBpcGUoc3RhcnRXaXRoKHRydWUpKVxuICAgICAgICAgICksXG4gICAgICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgbGlzdE9mT3B0aW9uSW50ZXJmYWNlID0gdGhpcy5saXN0T2ZOek9wdGlvbkNvbXBvbmVudC50b0FycmF5KCkubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSwgbnpMYWJlbCwgbnpWYWx1ZSwgbnpEaXNhYmxlZCwgbnpIaWRlLCBuekN1c3RvbUNvbnRlbnQsIGdyb3VwTGFiZWwgfSA9IGl0ZW07XG4gICAgICAgICAgICByZXR1cm4geyB0ZW1wbGF0ZSwgbnpMYWJlbCwgbnpWYWx1ZSwgbnpEaXNhYmxlZCwgbnpIaWRlLCBuekN1c3RvbUNvbnRlbnQsIGdyb3VwTGFiZWwsIHR5cGU6ICdpdGVtJywga2V5OiBuelZhbHVlIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5saXN0T2ZUZW1wbGF0ZUl0ZW0kLm5leHQobGlzdE9mT3B0aW9uSW50ZXJmYWNlKTtcbiAgICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=