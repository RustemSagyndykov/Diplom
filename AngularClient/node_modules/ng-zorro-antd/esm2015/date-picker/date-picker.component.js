/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Host, Input, Optional, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { CandyDate, cloneDate } from 'ng-zorro-antd/core/time';
import { InputBoolean, toBoolean, valueFunctionProp } from 'ng-zorro-antd/core/util';
import { DateHelperService, NzI18nService } from 'ng-zorro-antd/i18n';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePickerService } from './date-picker.service';
import { Directionality } from '@angular/cdk/bidi';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { NzPickerComponent } from './picker.component';
const POPUP_STYLE_PATCH = { position: 'relative' }; // Aim to override antd's style to support overlay's position strategy (position:absolute will cause it not working beacuse the overlay can't get the height/width of it's content)
const NZ_CONFIG_MODULE_NAME = 'datePicker';
/**
 * The base picker for all common APIs
 */
export class NzDatePickerComponent {
    constructor(nzConfigService, datePickerService, i18n, cdr, renderer, elementRef, dateHelper, directionality, noAnimation) {
        this.nzConfigService = nzConfigService;
        this.datePickerService = datePickerService;
        this.i18n = i18n;
        this.cdr = cdr;
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.dateHelper = dateHelper;
        this.directionality = directionality;
        this.noAnimation = noAnimation;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.isRange = false; // Indicate whether the value is a range value
        this.focused = false;
        this.dir = 'ltr';
        this.panelMode = 'date';
        this.destroyed$ = new Subject();
        this.isCustomPlaceHolder = false;
        this.isCustomFormat = false;
        this.showTime = false;
        // --- Common API
        this.nzAllowClear = true;
        this.nzAutoFocus = false;
        this.nzDisabled = false;
        this.nzBorderless = false;
        this.nzInputReadOnly = false;
        this.nzInline = false;
        this.nzPlaceHolder = '';
        this.nzPopupStyle = POPUP_STYLE_PATCH;
        this.nzSize = 'default';
        this.nzShowToday = true;
        this.nzMode = 'date';
        this.nzShowNow = true;
        this.nzDefaultPickerValue = null;
        this.nzSeparator = undefined;
        this.nzSuffixIcon = 'calendar';
        this.nzId = null;
        // TODO(@wenqi73) The PanelMode need named for each pickers and export
        this.nzOnPanelChange = new EventEmitter();
        this.nzOnCalendarChange = new EventEmitter();
        this.nzOnOk = new EventEmitter();
        this.nzOnOpenChange = new EventEmitter();
        // ------------------------------------------------------------------------
        // | Control value accessor implements
        // ------------------------------------------------------------------------
        // NOTE: onChangeFn/onTouchedFn will not be assigned if user not use as ngModel
        this.onChangeFn = () => void 0;
        this.onTouchedFn = () => void 0;
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-picker');
    }
    get nzShowTime() {
        return this.showTime;
    }
    set nzShowTime(value) {
        this.showTime = typeof value === 'object' ? value : toBoolean(value);
    }
    ngOnInit() {
        var _a;
        // Subscribe the every locale change if the nzLocale is not handled by user
        if (!this.nzLocale) {
            this.i18n.localeChange.pipe(takeUntil(this.destroyed$)).subscribe(() => this.setLocale());
        }
        // Default value
        this.datePickerService.isRange = this.isRange;
        this.datePickerService.initValue();
        this.datePickerService.emitValue$.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            var _a, _b, _c, _d;
            const value = this.datePickerService.value;
            this.datePickerService.initialValue = cloneDate(value);
            if (this.isRange) {
                const vAsRange = value;
                if (vAsRange.length) {
                    this.onChangeFn([(_b = (_a = vAsRange[0]) === null || _a === void 0 ? void 0 : _a.nativeDate) !== null && _b !== void 0 ? _b : null, (_d = (_c = vAsRange[1]) === null || _c === void 0 ? void 0 : _c.nativeDate) !== null && _d !== void 0 ? _d : null]);
                }
                else {
                    this.onChangeFn([]);
                }
            }
            else {
                if (value) {
                    this.onChangeFn(value.nativeDate);
                }
                else {
                    this.onChangeFn(null);
                }
            }
            this.onTouchedFn();
            // When value emitted, overlay will be closed
            this.close();
        });
        this.setModeAndFormat();
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroyed$)).subscribe((direction) => {
            this.dir = direction;
            this.cdr.detectChanges();
        });
        this.dir = this.directionality.value;
    }
    ngOnChanges(changes) {
        var _a, _b;
        if (changes.nzPopupStyle) {
            // Always assign the popup style patch
            this.nzPopupStyle = this.nzPopupStyle ? Object.assign(Object.assign({}, this.nzPopupStyle), POPUP_STYLE_PATCH) : POPUP_STYLE_PATCH;
        }
        // Mark as customized placeholder by user once nzPlaceHolder assigned at the first time
        if ((_a = changes.nzPlaceHolder) === null || _a === void 0 ? void 0 : _a.currentValue) {
            this.isCustomPlaceHolder = true;
        }
        if ((_b = changes.nzFormat) === null || _b === void 0 ? void 0 : _b.currentValue) {
            this.isCustomFormat = true;
        }
        if (changes.nzLocale) {
            // The nzLocale is currently handled by user
            this.setDefaultPlaceHolder();
        }
        if (changes.nzRenderExtraFooter) {
            this.extraFooter = valueFunctionProp(this.nzRenderExtraFooter);
        }
        if (changes.nzMode) {
            this.setDefaultPlaceHolder();
            this.setModeAndFormat();
        }
    }
    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
    setModeAndFormat() {
        const inputFormats = {
            year: 'yyyy',
            month: 'yyyy-MM',
            week: this.i18n.getDateLocale() ? 'RRRR-II' : 'yyyy-ww',
            date: this.nzShowTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'
        };
        if (!this.nzMode) {
            this.nzMode = 'date';
        }
        this.panelMode = this.isRange ? [this.nzMode, this.nzMode] : this.nzMode;
        // Default format when it's empty
        if (!this.isCustomFormat) {
            this.nzFormat = inputFormats[this.nzMode];
        }
    }
    /**
     * Triggered when overlayOpen changes (different with realOpenState)
     * @param open The overlayOpen in picker component
     */
    onOpenChange(open) {
        this.nzOnOpenChange.emit(open);
    }
    open() {
        this.picker.showOverlay();
    }
    close() {
        this.picker.hideOverlay();
    }
    writeValue(value) {
        this.setValue(value);
        this.cdr.markForCheck();
    }
    registerOnChange(fn) {
        this.onChangeFn = fn;
    }
    registerOnTouched(fn) {
        this.onTouchedFn = fn;
    }
    setDisabledState(isDisabled) {
        this.nzDisabled = isDisabled;
        this.cdr.markForCheck();
    }
    // ------------------------------------------------------------------------
    // | Internal methods
    // ------------------------------------------------------------------------
    // Reload locale from i18n with side effects
    setLocale() {
        this.nzLocale = this.i18n.getLocaleData('DatePicker', {});
        this.setDefaultPlaceHolder();
        this.cdr.markForCheck();
    }
    setDefaultPlaceHolder() {
        if (!this.isCustomPlaceHolder && this.nzLocale) {
            const defaultPlaceholder = {
                year: this.getPropertyOfLocale('yearPlaceholder'),
                month: this.getPropertyOfLocale('monthPlaceholder'),
                week: this.getPropertyOfLocale('weekPlaceholder'),
                date: this.getPropertyOfLocale('placeholder')
            };
            const defaultRangePlaceholder = {
                year: this.getPropertyOfLocale('rangeYearPlaceholder'),
                month: this.getPropertyOfLocale('rangeMonthPlaceholder'),
                week: this.getPropertyOfLocale('rangeWeekPlaceholder'),
                date: this.getPropertyOfLocale('rangePlaceholder')
            };
            this.nzPlaceHolder = this.isRange
                ? defaultRangePlaceholder[this.nzMode]
                : defaultPlaceholder[this.nzMode];
        }
    }
    getPropertyOfLocale(type) {
        return this.nzLocale.lang[type] || this.i18n.getLocaleData(`DatePicker.lang.${type}`);
    }
    // Safe way of setting value with default
    setValue(value) {
        const newValue = this.datePickerService.makeValue(value);
        this.datePickerService.setValue(newValue);
        this.datePickerService.initialValue = newValue;
    }
    onFocusChange(value) {
        this.focused = value;
        // TODO: avoid autoFocus cause change after checked error
        if (this.focused) {
            this.renderer.addClass(this.elementRef.nativeElement, 'ant-picker-focused');
        }
        else {
            this.renderer.removeClass(this.elementRef.nativeElement, 'ant-picker-focused');
        }
    }
    onPanelModeChange(panelMode) {
        this.nzOnPanelChange.emit(panelMode);
    }
    // Emit nzOnCalendarChange when select date by nz-range-picker
    onCalendarChange(value) {
        if (this.isRange && Array.isArray(value)) {
            const rangeValue = value.filter(x => x instanceof CandyDate).map(x => x.nativeDate);
            this.nzOnCalendarChange.emit(rangeValue);
        }
    }
    onResultOk() {
        var _a, _b;
        if (this.isRange) {
            const value = this.datePickerService.value;
            if (value.length) {
                this.nzOnOk.emit([((_a = value[0]) === null || _a === void 0 ? void 0 : _a.nativeDate) || null, ((_b = value[1]) === null || _b === void 0 ? void 0 : _b.nativeDate) || null]);
            }
            else {
                this.nzOnOk.emit([]);
            }
        }
        else {
            if (this.datePickerService.value) {
                this.nzOnOk.emit(this.datePickerService.value.nativeDate);
            }
            else {
                this.nzOnOk.emit(null);
            }
        }
    }
}
NzDatePickerComponent.decorators = [
    { type: Component, args: [{
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                selector: 'nz-date-picker,nz-week-picker,nz-month-picker,nz-year-picker,nz-range-picker',
                exportAs: 'nzDatePicker',
                template: `
    <div
      nz-picker
      [isRange]="isRange"
      [open]="nzOpen"
      [dir]="dir"
      [separator]="nzSeparator"
      [disabled]="nzDisabled"
      [inputReadOnly]="nzInputReadOnly"
      [inline]="nzInline"
      [format]="nzFormat"
      [allowClear]="nzAllowClear"
      [autoFocus]="nzAutoFocus"
      [placeholder]="nzPlaceHolder"
      style="display: inherit; align-items: center; width: 100%;"
      [dropdownClassName]="nzDropdownClassName"
      [class.ant-picker-dropdown-rtl]="dir === 'rtl'"
      [popupStyle]="nzPopupStyle"
      [noAnimation]="!!noAnimation?.nzNoAnimation"
      [suffixIcon]="nzSuffixIcon"
      (openChange)="onOpenChange($event)"
      (focusChange)="onFocusChange($event)"
      [nzId]="nzId"
    >
      <date-range-popup
        [isRange]="isRange"
        [inline]="nzInline"
        [defaultPickerValue]="nzDefaultPickerValue"
        [showWeek]="nzMode === 'week'"
        [panelMode]="panelMode"
        (panelModeChange)="onPanelModeChange($event)"
        (calendarChange)="onCalendarChange($event)"
        [locale]="nzLocale?.lang!"
        [showToday]="nzMode === 'date' && nzShowToday && !isRange && !nzShowTime"
        [showNow]="nzMode === 'date' && nzShowNow && !isRange && !!nzShowTime"
        [showTime]="nzShowTime"
        [dateRender]="nzDateRender"
        [disabledDate]="nzDisabledDate"
        [disabledTime]="nzDisabledTime"
        [extraFooter]="extraFooter"
        [ranges]="nzRanges"
        [dir]="dir"
        (resultOk)="onResultOk()"
      ></date-range-popup>
    </div>
  `,
                host: {
                    '[class.ant-picker-range]': `isRange`,
                    '[class.ant-picker-large]': `nzSize === 'large'`,
                    '[class.ant-picker-small]': `nzSize === 'small'`,
                    '[class.ant-picker-disabled]': `nzDisabled`,
                    '[class.ant-picker-rtl]': `dir === 'rtl'`,
                    '[class.ant-picker-borderless]': `nzBorderless`,
                    '[class.ant-picker-inline]': `nzInline`,
                    '(click)': 'picker.onClickInputBox($event)'
                },
                providers: [
                    DatePickerService,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        multi: true,
                        useExisting: forwardRef(() => NzDatePickerComponent)
                    }
                ]
            },] }
];
NzDatePickerComponent.ctorParameters = () => [
    { type: NzConfigService },
    { type: DatePickerService },
    { type: NzI18nService },
    { type: ChangeDetectorRef },
    { type: Renderer2 },
    { type: ElementRef },
    { type: DateHelperService },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
NzDatePickerComponent.propDecorators = {
    nzAllowClear: [{ type: Input }],
    nzAutoFocus: [{ type: Input }],
    nzDisabled: [{ type: Input }],
    nzBorderless: [{ type: Input }],
    nzInputReadOnly: [{ type: Input }],
    nzInline: [{ type: Input }],
    nzOpen: [{ type: Input }],
    nzDisabledDate: [{ type: Input }],
    nzLocale: [{ type: Input }],
    nzPlaceHolder: [{ type: Input }],
    nzPopupStyle: [{ type: Input }],
    nzDropdownClassName: [{ type: Input }],
    nzSize: [{ type: Input }],
    nzFormat: [{ type: Input }],
    nzDateRender: [{ type: Input }],
    nzDisabledTime: [{ type: Input }],
    nzRenderExtraFooter: [{ type: Input }],
    nzShowToday: [{ type: Input }],
    nzMode: [{ type: Input }],
    nzShowNow: [{ type: Input }],
    nzRanges: [{ type: Input }],
    nzDefaultPickerValue: [{ type: Input }],
    nzSeparator: [{ type: Input }],
    nzSuffixIcon: [{ type: Input }],
    nzId: [{ type: Input }],
    nzOnPanelChange: [{ type: Output }],
    nzOnCalendarChange: [{ type: Output }],
    nzOnOk: [{ type: Output }],
    nzOnOpenChange: [{ type: Output }],
    picker: [{ type: ViewChild, args: [NzPickerComponent, { static: true },] }],
    nzShowTime: [{ type: Input }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzAllowClear", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzAutoFocus", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzBorderless", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzInputReadOnly", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzInline", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzOpen", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzShowToday", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzShowNow", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzDatePickerComponent.prototype, "nzSeparator", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzDatePickerComponent.prototype, "nzSuffixIcon", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tcG9uZW50cy9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixJQUFJLEVBQ0osS0FBSyxFQUlMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUdULFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFtQixNQUFNLHlCQUF5QixDQUFDO0FBRWhGLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckYsT0FBTyxFQUFFLGlCQUFpQixFQUE0RCxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNoSSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRCxPQUFPLEVBQWEsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFlLGVBQWUsRUFBRSxVQUFVLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUd2RCxNQUFNLGlCQUFpQixHQUFHLEVB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QUE2QjtBQUU1QjtJQUFmLFlBQVksRUFBRTs7d0RBQTJCO0FBRzVCO0lBQWIsVUFBVSxFQUFFOzswREFBa0M7QUFDakM7SUFBYixVQUFVLEVBQUU7OzJEQUE0RCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEhvc3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTnpOb0FuaW1hdGlvbkRpcmVjdGl2ZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9uby1hbmltYXRpb24nO1xuaW1wb3J0IHsgQ2FuZHlEYXRlLCBjbG9uZURhdGUsIENvbXBhdGlibGVWYWx1ZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS90aW1lJztcbmltcG9ydCB7IEJvb2xlYW5JbnB1dCwgRnVuY3Rpb25Qcm9wLCBOelNhZmVBbnksIE9uQ2hhbmdlVHlwZSwgT25Ub3VjaGVkVHlwZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS90eXBlcyc7XG5pbXBvcnQgeyBJbnB1dEJvb2xlYW4sIHRvQm9vbGVhbiwgdmFsdWVGdW5jdGlvblByb3AgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdXRpbCc7XG5pbXBvcnQgeyBEYXRlSGVscGVyU2VydmljZSwgTnpEYXRlUGlja2VySTE4bkludGVyZmFjZSwgTnpEYXRlUGlja2VyTGFuZ0kxOG5JbnRlcmZhY2UsIE56STE4blNlcnZpY2UgfSBmcm9tICduZy16b3Jyby1hbnRkL2kxOG4nO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRGF0ZVBpY2tlclNlcnZpY2UgfSBmcm9tICcuL2RhdGUtcGlja2VyLnNlcnZpY2UnO1xuXG5pbXBvcnQgeyBEaXJlY3Rpb24sIERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgTnpDb25maWdLZXksIE56Q29uZmlnU2VydmljZSwgV2l0aENvbmZpZyB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9jb25maWcnO1xuaW1wb3J0IHsgTnpQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL3BpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29tcGF0aWJsZURhdGUsIERpc2FibGVkVGltZUZuLCBOekRhdGVNb2RlLCBQcmVzZXRSYW5nZXMsIFN1cHBvcnRUaW1lT3B0aW9ucyB9IGZyb20gJy4vc3RhbmRhcmQtdHlwZXMnO1xuXG5jb25zdCBQT1BVUF9TVFlMRV9QQVRDSCA9IHsgcG9zaXRpb246ICdyZWxhdGl2ZScgfTsgLy8gQWltIHRvIG92ZXJyaWRlIGFudGQncyBzdHlsZSB0byBzdXBwb3J0IG92ZXJsYXkncyBwb3NpdGlvbiBzdHJhdGVneSAocG9zaXRpb246YWJzb2x1dGUgd2lsbCBjYXVzZSBpdCBub3Qgd29ya2luZyBiZWFjdXNlIHRoZSBvdmVybGF5IGNhbid0IGdldCB0aGUgaGVpZ2h0L3dpZHRoIG9mIGl0J3MgY29udGVudClcbmNvbnN0IE5aX0NPTkZJR19NT0RVTEVfTkFNRTogTnpDb25maWdLZXkgPSAnZGF0ZVBpY2tlcic7XG5cbmV4cG9ydCB0eXBlIE56RGF0ZVBpY2tlclNpemVUeXBlID0gJ2xhcmdlJyB8ICdkZWZhdWx0JyB8ICdzbWFsbCc7XG5cbi8qKlxuICogVGhlIGJhc2UgcGlja2VyIGZvciBhbGwgY29tbW9uIEFQSXNcbiAqL1xuQENvbXBvbmVudCh7XG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzZWxlY3RvcjogJ256LWRhdGUtcGlja2VyLG56LXdlZWstcGlja2VyLG56LW1vbnRoLXBpY2tlcixuei15ZWFyLXBpY2tlcixuei1yYW5nZS1waWNrZXInLFxuICBleHBvcnRBczogJ256RGF0ZVBpY2tlcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgbnotcGlja2VyXG4gICAgICBbaXNSYW5nZV09XCJpc1JhbmdlXCJcbiAgICAgIFtvcGVuXT1cIm56T3BlblwiXG4gICAgICBbZGlyXT1cImRpclwiXG4gICAgICBbc2VwYXJhdG9yXT1cIm56U2VwYXJhdG9yXCJcbiAgICAgIFtkaXNhYmxlZF09XCJuekRpc2FibGVkXCJcbiAgICAgIFtpbnB1dFJlYWRPbmx5XT1cIm56SW5wdXRSZWFkT25seVwiXG4gICAgICBbaW5saW5lXT1cIm56SW5saW5lXCJcbiAgICAgIFtmb3JtYXRdPVwibnpGb3JtYXRcIlxuICAgICAgW2FsbG93Q2xlYXJdPVwibnpBbGxvd0NsZWFyXCJcbiAgICAgIFthdXRvRm9jdXNdPVwibnpBdXRvRm9jdXNcIlxuICAgICAgW3BsYWNlaG9sZGVyXT1cIm56UGxhY2VIb2xkZXJcIlxuICAgICAgc3R5bGU9XCJkaXNwbGF5OiBpbmhlcml0OyBhbGlnbi1pdGVtczogY2VudGVyOyB3aWR0aDogMTAwJTtcIlxuICAgICAgW2Ryb3Bkb3duQ2xhc3NOYW1lXT1cIm56RHJvcGRvd25DbGFzc05hbWVcIlxuICAgICAgW2NsYXNzLmFudC1waWNrZXItZHJvcGRvd24tcnRsXT1cImRpciA9PT0gJ3J0bCdcIlxuICAgICAgW3BvcHVwU3R5bGVdPVwibnpQb3B1cFN0eWxlXCJcbiAgICAgIFtub0FuaW1hdGlvbl09XCIhIW5vQW5pbWF0aW9uPy5uek5vQW5pbWF0aW9uXCJcbiAgICAgIFtzdWZmaXhJY29uXT1cIm56U3VmZml4SWNvblwiXG4gICAgICAob3BlbkNoYW5nZSk9XCJvbk9wZW5DaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAoZm9jdXNDaGFuZ2UpPVwib25Gb2N1c0NoYW5nZSgkZXZlbnQpXCJcbiAgICAgIFtueklkXT1cIm56SWRcIlxuICAgID5cbiAgICAgIDxkYXRlLXJhbmdlLXBvcHVwXG4gICAgICAgIFtpc1JhbmdlXT1cImlzUmFuZ2VcIlxuICAgICAgICBbaW5saW5lXT1cIm56SW5saW5lXCJcbiAgICAgICAgW2RlZmF1bHRQaWNrZXJWYWx1ZV09XCJuekRlZmF1bHRQaWNrZXJWYWx1ZVwiXG4gICAgICAgIFtzaG93V2Vla109XCJuek1vZGUgPT09ICd3ZWVrJ1wiXG4gICAgICAgIFtwYW5lbE1vZGVdPVwicGFuZWxNb2RlXCJcbiAgICAgICAgKHBhbmVsTW9kZUNoYW5nZSk9XCJvblBhbmVsTW9kZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgKGNhbGVuZGFyQ2hhbmdlKT1cIm9uQ2FsZW5kYXJDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgIFtsb2NhbGVdPVwibnpMb2NhbGU/LmxhbmchXCJcbiAgICAgICAgW3Nob3dUb2RheV09XCJuek1vZGUgPT09ICdkYXRlJyAmJiBuelNob3dUb2RheSAmJiAhaXNSYW5nZSAmJiAhbnpTaG93VGltZVwiXG4gICAgICAgIFtzaG93Tm93XT1cIm56TW9kZSA9PT0gJ2RhdGUnICYmIG56U2hvd05vdyAmJiAhaXNSYW5nZSAmJiAhIW56U2hvd1RpbWVcIlxuICAgICAgICBbc2hvd1RpbWVdPVwibnpTaG93VGltZVwiXG4gICAgICAgIFtkYXRlUmVuZGVyXT1cIm56RGF0ZVJlbmRlclwiXG4gICAgICAgIFtkaXNhYmxlZERhdGVdPVwibnpEaXNhYmxlZERhdGVcIlxuICAgICAgICBbZGlzYWJsZWRUaW1lXT1cIm56RGlzYWJsZWRUaW1lXCJcbiAgICAgICAgW2V4dHJhRm9vdGVyXT1cImV4dHJhRm9vdGVyXCJcbiAgICAgICAgW3Jhbmdlc109XCJuelJhbmdlc1wiXG4gICAgICAgIFtkaXJdPVwiZGlyXCJcbiAgICAgICAgKHJlc3VsdE9rKT1cIm9uUmVzdWx0T2soKVwiXG4gICAgICA+PC9kYXRlLXJhbmdlLXBvcHVwPlxuICAgIDwvZGl2PlxuICBgLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5hbnQtcGlja2VyLXJhbmdlXSc6IGBpc1JhbmdlYCxcbiAgICAnW2NsYXNzLmFudC1waWNrZXItbGFyZ2VdJzogYG56U2l6ZSA9PT0gJ2xhcmdlJ2AsXG4gICAgJ1tjbGFzcy5hbnQtcGlja2VyLXNtYWxsXSc6IGBuelNpemUgPT09ICdzbWFsbCdgLFxuICAgICdbY2xhc3MuYW50LXBpY2tlci1kaXNhYmxlZF0nOiBgbnpEaXNhYmxlZGAsXG4gICAgJ1tjbGFzcy5hbnQtcGlja2VyLXJ0bF0nOiBgZGlyID09PSAncnRsJ2AsXG4gICAgJ1tjbGFzcy5hbnQtcGlja2VyLWJvcmRlcmxlc3NdJzogYG56Qm9yZGVybGVzc2AsXG4gICAgJ1tjbGFzcy5hbnQtcGlja2VyLWlubGluZV0nOiBgbnpJbmxpbmVgLFxuICAgICcoY2xpY2spJzogJ3BpY2tlci5vbkNsaWNrSW5wdXRCb3goJGV2ZW50KSdcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRGF0ZVBpY2tlclNlcnZpY2UsXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE56RGF0ZVBpY2tlckNvbXBvbmVudClcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTnpEYXRlUGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICByZWFkb25seSBfbnpNb2R1bGVOYW1lOiBOekNvbmZpZ0tleSA9IE5aX0NPTkZJR19NT0RVTEVfTkFNRTtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256QWxsb3dDbGVhcjogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpBdXRvRm9jdXM6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256RGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256Qm9yZGVybGVzczogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpJbnB1dFJlYWRPbmx5OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9ueklubGluZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpPcGVuOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uelNob3dUb2RheTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpTaG93Tm93OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uek1vZGU6IE56RGF0ZU1vZGUgfCBOekRhdGVNb2RlW10gfCBzdHJpbmcgfCBzdHJpbmdbXSB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uelNob3dUaW1lOiBCb29sZWFuSW5wdXQgfCBTdXBwb3J0VGltZU9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkO1xuXG4gIGlzUmFuZ2U6IGJvb2xlYW4gPSBmYWxzZTsgLy8gSW5kaWNhdGUgd2hldGhlciB0aGUgdmFsdWUgaXMgYSByYW5nZSB2YWx1ZVxuICBmb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG4gIGV4dHJhRm9vdGVyPzogVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IHN0cmluZztcbiAgZGlyOiBEaXJlY3Rpb24gPSAnbHRyJztcblxuICBwdWJsaWMgcGFuZWxNb2RlOiBOekRhdGVNb2RlIHwgTnpEYXRlTW9kZVtdID0gJ2RhdGUnO1xuICBwcml2YXRlIGRlc3Ryb3llZCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlIGlzQ3VzdG9tUGxhY2VIb2xkZXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBpc0N1c3RvbUZvcm1hdDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIHNob3dUaW1lOiBTdXBwb3J0VGltZU9wdGlvbnMgfCBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gLS0tIENvbW1vbiBBUElcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56QWxsb3dDbGVhcjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekF1dG9Gb2N1czogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpCb3JkZXJsZXNzOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBueklucHV0UmVhZE9ubHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56SW5saW5lOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuek9wZW4/OiBib29sZWFuO1xuICBASW5wdXQoKSBuekRpc2FibGVkRGF0ZT86IChkOiBEYXRlKSA9PiBib29sZWFuO1xuICBASW5wdXQoKSBuekxvY2FsZSE6IE56RGF0ZVBpY2tlckkxOG5JbnRlcmZhY2U7XG4gIEBJbnB1dCgpIG56UGxhY2VIb2xkZXI6IHN0cmluZyB8IHN0cmluZ1tdID0gJyc7XG4gIEBJbnB1dCgpIG56UG9wdXBTdHlsZTogb2JqZWN0ID0gUE9QVVBfU1RZTEVfUEFUQ0g7XG4gIEBJbnB1dCgpIG56RHJvcGRvd25DbGFzc05hbWU/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIG56U2l6ZTogTnpEYXRlUGlja2VyU2l6ZVR5cGUgPSAnZGVmYXVsdCc7XG4gIEBJbnB1dCgpIG56Rm9ybWF0ITogc3RyaW5nO1xuICBASW5wdXQoKSBuekRhdGVSZW5kZXI/OiBUZW1wbGF0ZVJlZjxOelNhZmVBbnk+IHwgc3RyaW5nIHwgRnVuY3Rpb25Qcm9wPFRlbXBsYXRlUmVmPERhdGU+IHwgc3RyaW5nPjtcbiAgQElucHV0KCkgbnpEaXNhYmxlZFRpbWU/OiBEaXNhYmxlZFRpbWVGbjtcbiAgQElucHV0KCkgbnpSZW5kZXJFeHRyYUZvb3Rlcj86IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBzdHJpbmcgfCBGdW5jdGlvblByb3A8VGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IHN0cmluZz47XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuelNob3dUb2RheTogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIG56TW9kZTogTnpEYXRlTW9kZSA9ICdkYXRlJztcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56U2hvd05vdzogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIG56UmFuZ2VzPzogUHJlc2V0UmFuZ2VzO1xuICBASW5wdXQoKSBuekRlZmF1bHRQaWNrZXJWYWx1ZTogQ29tcGF0aWJsZURhdGUgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBuelNlcGFyYXRvcj86IHN0cmluZyA9IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBuelN1ZmZpeEljb246IHN0cmluZyB8IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gPSAnY2FsZW5kYXInO1xuICBASW5wdXQoKSBueklkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvLyBUT0RPKEB3ZW5xaTczKSBUaGUgUGFuZWxNb2RlIG5lZWQgbmFtZWQgZm9yIGVhY2ggcGlja2VycyBhbmQgZXhwb3J0XG4gIEBPdXRwdXQoKSByZWFkb25seSBuek9uUGFuZWxDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE56RGF0ZU1vZGUgfCBOekRhdGVNb2RlW10gfCBzdHJpbmcgfCBzdHJpbmdbXT4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56T25DYWxlbmRhckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8RGF0ZSB8IG51bGw+PigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbnpPbk9rID0gbmV3IEV2ZW50RW1pdHRlcjxDb21wYXRpYmxlRGF0ZSB8IG51bGw+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuek9uT3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBAVmlld0NoaWxkKE56UGlja2VyQ29tcG9uZW50LCB7IHN0YXRpYzogdHJ1ZSB9KSBwaWNrZXIhOiBOelBpY2tlckNvbXBvbmVudDtcblxuICBASW5wdXQoKSBnZXQgbnpTaG93VGltZSgpOiBTdXBwb3J0VGltZU9wdGlvbnMgfCBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG93VGltZTtcbiAgfVxuXG4gIHNldCBuelNob3dUaW1lKHZhbHVlOiBTdXBwb3J0VGltZU9wdGlvbnMgfCBib29sZWFuKSB7XG4gICAgdGhpcy5zaG93VGltZSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyB2YWx1ZSA6IHRvQm9vbGVhbih2YWx1ZSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgbnpDb25maWdTZXJ2aWNlOiBOekNvbmZpZ1NlcnZpY2UsXG4gICAgcHVibGljIGRhdGVQaWNrZXJTZXJ2aWNlOiBEYXRlUGlja2VyU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgaTE4bjogTnpJMThuU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBkYXRlSGVscGVyOiBEYXRlSGVscGVyU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICBASG9zdCgpIEBPcHRpb25hbCgpIHB1YmxpYyBub0FuaW1hdGlvbj86IE56Tm9BbmltYXRpb25EaXJlY3RpdmVcbiAgKSB7XG4gICAgLy8gVE9ETzogbW92ZSB0byBob3N0IGFmdGVyIFZpZXcgRW5naW5lIGRlcHJlY2F0aW9uXG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYW50LXBpY2tlcicpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gU3Vic2NyaWJlIHRoZSBldmVyeSBsb2NhbGUgY2hhbmdlIGlmIHRoZSBuekxvY2FsZSBpcyBub3QgaGFuZGxlZCBieSB1c2VyXG4gICAgaWYgKCF0aGlzLm56TG9jYWxlKSB7XG4gICAgICB0aGlzLmkxOG4ubG9jYWxlQ2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveWVkJCkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLnNldExvY2FsZSgpKTtcbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IHZhbHVlXG4gICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5pc1JhbmdlID0gdGhpcy5pc1JhbmdlO1xuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuaW5pdFZhbHVlKCk7XG4gICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5lbWl0VmFsdWUkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveWVkJCkpLnN1YnNjcmliZShfID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuaW5pdGlhbFZhbHVlID0gY2xvbmVEYXRlKHZhbHVlKTtcbiAgICAgIGlmICh0aGlzLmlzUmFuZ2UpIHtcbiAgICAgICAgY29uc3QgdkFzUmFuZ2UgPSB2YWx1ZSBhcyBDYW5keURhdGVbXTtcbiAgICAgICAgaWYgKHZBc1JhbmdlLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMub25DaGFuZ2VGbihbdkFzUmFuZ2VbMF0/Lm5hdGl2ZURhdGUgPz8gbnVsbCwgdkFzUmFuZ2VbMV0/Lm5hdGl2ZURhdGUgPz8gbnVsbF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub25DaGFuZ2VGbihbXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgIHRoaXMub25DaGFuZ2VGbigodmFsdWUgYXMgQ2FuZHlEYXRlKS5uYXRpdmVEYXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlRm4obnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMub25Ub3VjaGVkRm4oKTtcbiAgICAgIC8vIFdoZW4gdmFsdWUgZW1pdHRlZCwgb3ZlcmxheSB3aWxsIGJlIGNsb3NlZFxuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRNb2RlQW5kRm9ybWF0KCk7XG5cbiAgICB0aGlzLmRpcmVjdGlvbmFsaXR5LmNoYW5nZT8ucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95ZWQkKSkuc3Vic2NyaWJlKChkaXJlY3Rpb246IERpcmVjdGlvbikgPT4ge1xuICAgICAgdGhpcy5kaXIgPSBkaXJlY3Rpb247XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG4gICAgdGhpcy5kaXIgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzLm56UG9wdXBTdHlsZSkge1xuICAgICAgLy8gQWx3YXlzIGFzc2lnbiB0aGUgcG9wdXAgc3R5bGUgcGF0Y2hcbiAgICAgIHRoaXMubnpQb3B1cFN0eWxlID0gdGhpcy5uelBvcHVwU3R5bGUgPyB7IC4uLnRoaXMubnpQb3B1cFN0eWxlLCAuLi5QT1BVUF9TVFlMRV9QQVRDSCB9IDogUE9QVVBfU1RZTEVfUEFUQ0g7XG4gICAgfVxuXG4gICAgLy8gTWFyayBhcyBjdXN0b21pemVkIHBsYWNlaG9sZGVyIGJ5IHVzZXIgb25jZSBuelBsYWNlSG9sZGVyIGFzc2lnbmVkIGF0IHRoZSBmaXJzdCB0aW1lXG4gICAgaWYgKGNoYW5nZXMubnpQbGFjZUhvbGRlcj8uY3VycmVudFZhbHVlKSB7XG4gICAgICB0aGlzLmlzQ3VzdG9tUGxhY2VIb2xkZXIgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLm56Rm9ybWF0Py5jdXJyZW50VmFsdWUpIHtcbiAgICAgIHRoaXMuaXNDdXN0b21Gb3JtYXQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLm56TG9jYWxlKSB7XG4gICAgICAvLyBUaGUgbnpMb2NhbGUgaXMgY3VycmVudGx5IGhhbmRsZWQgYnkgdXNlclxuICAgICAgdGhpcy5zZXREZWZhdWx0UGxhY2VIb2xkZXIoKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5uelJlbmRlckV4dHJhRm9vdGVyKSB7XG4gICAgICB0aGlzLmV4dHJhRm9vdGVyID0gdmFsdWVGdW5jdGlvblByb3AodGhpcy5uelJlbmRlckV4dHJhRm9vdGVyISk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMubnpNb2RlKSB7XG4gICAgICB0aGlzLnNldERlZmF1bHRQbGFjZUhvbGRlcigpO1xuICAgICAgdGhpcy5zZXRNb2RlQW5kRm9ybWF0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95ZWQkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3llZCQuY29tcGxldGUoKTtcbiAgfVxuXG4gIHNldE1vZGVBbmRGb3JtYXQoKTogdm9pZCB7XG4gICAgY29uc3QgaW5wdXRGb3JtYXRzOiB7IFtrZXkgaW4gTnpEYXRlTW9kZV0/OiBzdHJpbmcgfSA9IHtcbiAgICAgIHllYXI6ICd5eXl5JyxcbiAgICAgIG1vbnRoOiAneXl5eS1NTScsXG4gICAgICB3ZWVrOiB0aGlzLmkxOG4uZ2V0RGF0ZUxvY2FsZSgpID8gJ1JSUlItSUknIDogJ3l5eXktd3cnLCAvLyBGb3JtYXQgZm9yIHdlZWtcbiAgICAgIGRhdGU6IHRoaXMubnpTaG93VGltZSA/ICd5eXl5LU1NLWRkIEhIOm1tOnNzJyA6ICd5eXl5LU1NLWRkJ1xuICAgIH07XG5cbiAgICBpZiAoIXRoaXMubnpNb2RlKSB7XG4gICAgICB0aGlzLm56TW9kZSA9ICdkYXRlJztcbiAgICB9XG5cbiAgICB0aGlzLnBhbmVsTW9kZSA9IHRoaXMuaXNSYW5nZSA/IFt0aGlzLm56TW9kZSwgdGhpcy5uek1vZGVdIDogdGhpcy5uek1vZGU7XG5cbiAgICAvLyBEZWZhdWx0IGZvcm1hdCB3aGVuIGl0J3MgZW1wdHlcbiAgICBpZiAoIXRoaXMuaXNDdXN0b21Gb3JtYXQpIHtcbiAgICAgIHRoaXMubnpGb3JtYXQgPSBpbnB1dEZvcm1hdHNbdGhpcy5uek1vZGUgYXMgTnpEYXRlTW9kZV0hO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyZWQgd2hlbiBvdmVybGF5T3BlbiBjaGFuZ2VzIChkaWZmZXJlbnQgd2l0aCByZWFsT3BlblN0YXRlKVxuICAgKiBAcGFyYW0gb3BlbiBUaGUgb3ZlcmxheU9wZW4gaW4gcGlja2VyIGNvbXBvbmVudFxuICAgKi9cbiAgb25PcGVuQ2hhbmdlKG9wZW46IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLm56T25PcGVuQ2hhbmdlLmVtaXQob3Blbik7XG4gIH1cblxuICBwdWJsaWMgb3BlbigpOiB2b2lkIHtcbiAgICB0aGlzLnBpY2tlci5zaG93T3ZlcmxheSgpO1xuICB9XG5cbiAgcHVibGljIGNsb3NlKCk6IHZvaWQge1xuICAgIHRoaXMucGlja2VyLmhpZGVPdmVybGF5KCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gfCBDb250cm9sIHZhbHVlIGFjY2Vzc29yIGltcGxlbWVudHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gTk9URTogb25DaGFuZ2VGbi9vblRvdWNoZWRGbiB3aWxsIG5vdCBiZSBhc3NpZ25lZCBpZiB1c2VyIG5vdCB1c2UgYXMgbmdNb2RlbFxuICBvbkNoYW5nZUZuOiBPbkNoYW5nZVR5cGUgPSAoKSA9PiB2b2lkIDA7XG4gIG9uVG91Y2hlZEZuOiBPblRvdWNoZWRUeXBlID0gKCkgPT4gdm9pZCAwO1xuXG4gIHdyaXRlVmFsdWUodmFsdWU6IENvbXBhdGlibGVEYXRlKTogdm9pZCB7XG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBPbkNoYW5nZVR5cGUpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlRm4gPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBPblRvdWNoZWRUeXBlKTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWRGbiA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5uekRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyB8IEludGVybmFsIG1ldGhvZHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmVsb2FkIGxvY2FsZSBmcm9tIGkxOG4gd2l0aCBzaWRlIGVmZmVjdHNcbiAgcHJpdmF0ZSBzZXRMb2NhbGUoKTogdm9pZCB7XG4gICAgdGhpcy5uekxvY2FsZSA9IHRoaXMuaTE4bi5nZXRMb2NhbGVEYXRhKCdEYXRlUGlja2VyJywge30pO1xuICAgIHRoaXMuc2V0RGVmYXVsdFBsYWNlSG9sZGVyKCk7XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBwcml2YXRlIHNldERlZmF1bHRQbGFjZUhvbGRlcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNDdXN0b21QbGFjZUhvbGRlciAmJiB0aGlzLm56TG9jYWxlKSB7XG4gICAgICBjb25zdCBkZWZhdWx0UGxhY2Vob2xkZXI6IHsgW2tleSBpbiBOekRhdGVNb2RlXT86IHN0cmluZyB9ID0ge1xuICAgICAgICB5ZWFyOiB0aGlzLmdldFByb3BlcnR5T2ZMb2NhbGUoJ3llYXJQbGFjZWhvbGRlcicpLFxuICAgICAgICBtb250aDogdGhpcy5nZXRQcm9wZXJ0eU9mTG9jYWxlKCdtb250aFBsYWNlaG9sZGVyJyksXG4gICAgICAgIHdlZWs6IHRoaXMuZ2V0UHJvcGVydHlPZkxvY2FsZSgnd2Vla1BsYWNlaG9sZGVyJyksXG4gICAgICAgIGRhdGU6IHRoaXMuZ2V0UHJvcGVydHlPZkxvY2FsZSgncGxhY2Vob2xkZXInKVxuICAgICAgfTtcblxuICAgICAgY29uc3QgZGVmYXVsdFJhbmdlUGxhY2Vob2xkZXI6IHsgW2tleSBpbiBOekRhdGVNb2RlXT86IHN0cmluZ1tdIH0gPSB7XG4gICAgICAgIHllYXI6IHRoaXMuZ2V0UHJvcGVydHlPZkxvY2FsZSgncmFuZ2VZZWFyUGxhY2Vob2xkZXInKSxcbiAgICAgICAgbW9udGg6IHRoaXMuZ2V0UHJvcGVydHlPZkxvY2FsZSgncmFuZ2VNb250aFBsYWNlaG9sZGVyJyksXG4gICAgICAgIHdlZWs6IHRoaXMuZ2V0UHJvcGVydHlPZkxvY2FsZSgncmFuZ2VXZWVrUGxhY2Vob2xkZXInKSxcbiAgICAgICAgZGF0ZTogdGhpcy5nZXRQcm9wZXJ0eU9mTG9jYWxlKCdyYW5nZVBsYWNlaG9sZGVyJylcbiAgICAgIH07XG5cbiAgICAgIHRoaXMubnpQbGFjZUhvbGRlciA9IHRoaXMuaXNSYW5nZVxuICAgICAgICA/IGRlZmF1bHRSYW5nZVBsYWNlaG9sZGVyW3RoaXMubnpNb2RlIGFzIE56RGF0ZU1vZGVdIVxuICAgICAgICA6IGRlZmF1bHRQbGFjZWhvbGRlclt0aGlzLm56TW9kZSBhcyBOekRhdGVNb2RlXSE7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRQcm9wZXJ0eU9mTG9jYWxlPFQgZXh0ZW5kcyBrZXlvZiBOekRhdGVQaWNrZXJMYW5nSTE4bkludGVyZmFjZT4odHlwZTogVCk6IE56RGF0ZVBpY2tlckxhbmdJMThuSW50ZXJmYWNlW1RdIHtcbiAgICByZXR1cm4gdGhpcy5uekxvY2FsZS5sYW5nW3R5cGVdIHx8IHRoaXMuaTE4bi5nZXRMb2NhbGVEYXRhKGBEYXRlUGlja2VyLmxhbmcuJHt0eXBlfWApO1xuICB9XG5cbiAgLy8gU2FmZSB3YXkgb2Ygc2V0dGluZyB2YWx1ZSB3aXRoIGRlZmF1bHRcbiAgcHJpdmF0ZSBzZXRWYWx1ZSh2YWx1ZTogQ29tcGF0aWJsZURhdGUpOiB2b2lkIHtcbiAgICBjb25zdCBuZXdWYWx1ZTogQ29tcGF0aWJsZVZhbHVlID0gdGhpcy5kYXRlUGlja2VyU2VydmljZS5tYWtlVmFsdWUodmFsdWUpO1xuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2Uuc2V0VmFsdWUobmV3VmFsdWUpO1xuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuaW5pdGlhbFZhbHVlID0gbmV3VmFsdWU7XG4gIH1cblxuICBvbkZvY3VzQ2hhbmdlKHZhbHVlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5mb2N1c2VkID0gdmFsdWU7XG4gICAgLy8gVE9ETzogYXZvaWQgYXV0b0ZvY3VzIGNhdXNlIGNoYW5nZSBhZnRlciBjaGVja2VkIGVycm9yXG4gICAgaWYgKHRoaXMuZm9jdXNlZCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2FudC1waWNrZXItZm9jdXNlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnYW50LXBpY2tlci1mb2N1c2VkJyk7XG4gICAgfVxuICB9XG5cbiAgb25QYW5lbE1vZGVDaGFuZ2UocGFuZWxNb2RlOiBOekRhdGVNb2RlIHwgTnpEYXRlTW9kZVtdKTogdm9pZCB7XG4gICAgdGhpcy5uek9uUGFuZWxDaGFuZ2UuZW1pdChwYW5lbE1vZGUpO1xuICB9XG5cbiAgLy8gRW1pdCBuek9uQ2FsZW5kYXJDaGFuZ2Ugd2hlbiBzZWxlY3QgZGF0ZSBieSBuei1yYW5nZS1waWNrZXJcbiAgb25DYWxlbmRhckNoYW5nZSh2YWx1ZTogQ29tcGF0aWJsZVZhbHVlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNSYW5nZSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgY29uc3QgcmFuZ2VWYWx1ZSA9IHZhbHVlLmZpbHRlcih4ID0+IHggaW5zdGFuY2VvZiBDYW5keURhdGUpLm1hcCh4ID0+IHghLm5hdGl2ZURhdGUpO1xuICAgICAgdGhpcy5uek9uQ2FsZW5kYXJDaGFuZ2UuZW1pdChyYW5nZVZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBvblJlc3VsdE9rKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZSBhcyBDYW5keURhdGVbXTtcbiAgICAgIGlmICh2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5uek9uT2suZW1pdChbdmFsdWVbMF0/Lm5hdGl2ZURhdGUgfHwgbnVsbCwgdmFsdWVbMV0/Lm5hdGl2ZURhdGUgfHwgbnVsbF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5uek9uT2suZW1pdChbXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlKSB7XG4gICAgICAgIHRoaXMubnpPbk9rLmVtaXQoKHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWUgYXMgQ2FuZHlEYXRlKS5uYXRpdmVEYXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubnpPbk9rLmVtaXQobnVsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=