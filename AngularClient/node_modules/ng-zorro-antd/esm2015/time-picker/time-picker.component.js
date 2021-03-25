/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { Directionality } from '@angular/cdk/bidi';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Optional, Output, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isValid } from 'date-fns';
import { slideMotion } from 'ng-zorro-antd/core/animation';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { warn } from 'ng-zorro-antd/core/logger';
import { InputBoolean, isNil } from 'ng-zorro-antd/core/util';
import { DateHelperService, NzI18nService } from 'ng-zorro-antd/i18n';
import { of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
const NZ_CONFIG_MODULE_NAME = 'timePicker';
export class NzTimePickerComponent {
    constructor(nzConfigService, i18n, element, renderer, cdr, dateHelper, platform, elementRef, directionality) {
        this.nzConfigService = nzConfigService;
        this.i18n = i18n;
        this.element = element;
        this.renderer = renderer;
        this.cdr = cdr;
        this.dateHelper = dateHelper;
        this.platform = platform;
        this.elementRef = elementRef;
        this.directionality = directionality;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.destroy$ = new Subject();
        this.isInit = false;
        this.focused = false;
        this.inputValue = '';
        this.value = null;
        this.preValue = null;
        this.i18nPlaceHolder$ = of(undefined);
        this.overlayPositions = [
            {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top',
                offsetY: 3
            }
        ];
        this.dir = 'ltr';
        this.nzId = null;
        this.nzSize = null;
        this.nzHourStep = 1;
        this.nzMinuteStep = 1;
        this.nzSecondStep = 1;
        this.nzClearText = 'clear';
        this.nzNowText = '';
        this.nzOkText = '';
        this.nzPopupClassName = '';
        this.nzPlaceHolder = '';
        this.nzFormat = 'HH:mm:ss';
        this.nzOpen = false;
        this.nzUse12Hours = false;
        this.nzSuffixIcon = 'clock-circle';
        this.nzOpenChange = new EventEmitter();
        this.nzHideDisabledOptions = false;
        this.nzAllowEmpty = true;
        this.nzDisabled = false;
        this.nzAutoFocus = false;
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-picker');
    }
    emitValue(value) {
        this.setValue(value, true);
        if (this._onChange) {
            this._onChange(this.value);
        }
        if (this._onTouched) {
            this._onTouched();
        }
    }
    setValue(value, syncPreValue = false) {
        if (syncPreValue) {
            this.preValue = isValid(value) ? new Date(value) : null;
        }
        this.value = isValid(value) ? new Date(value) : null;
        this.inputValue = this.dateHelper.format(value, this.nzFormat);
        this.cdr.markForCheck();
    }
    open() {
        if (this.nzDisabled || this.nzOpen) {
            return;
        }
        this.focus();
        this.nzOpen = true;
        this.nzOpenChange.emit(this.nzOpen);
    }
    close() {
        this.nzOpen = false;
        this.cdr.markForCheck();
        this.nzOpenChange.emit(this.nzOpen);
    }
    updateAutoFocus() {
        if (this.isInit && !this.nzDisabled) {
            if (this.nzAutoFocus) {
                this.renderer.setAttribute(this.inputRef.nativeElement, 'autofocus', 'autofocus');
            }
            else {
                this.renderer.removeAttribute(this.inputRef.nativeElement, 'autofocus');
            }
        }
    }
    onClickClearBtn(event) {
        event.stopPropagation();
        this.emitValue(null);
    }
    onClickOutside(event) {
        if (!this.element.nativeElement.contains(event.target)) {
            this.setCurrentValueAndClose();
        }
    }
    onFocus(value) {
        this.focused = value;
    }
    focus() {
        if (this.inputRef.nativeElement) {
            this.inputRef.nativeElement.focus();
        }
    }
    blur() {
        if (this.inputRef.nativeElement) {
            this.inputRef.nativeElement.blur();
        }
    }
    onKeyupEsc() {
        this.setValue(this.preValue);
    }
    onKeyupEnter() {
        if (this.nzOpen && isValid(this.value)) {
            this.setCurrentValueAndClose();
        }
        else if (!this.nzOpen) {
            this.open();
        }
    }
    onInputChange(str) {
        if (!this.platform.TRIDENT && document.activeElement === this.inputRef.nativeElement) {
            this.open();
            this.parseTimeString(str);
        }
    }
    onPanelValueChange(value) {
        this.setValue(value);
        this.focus();
    }
    setCurrentValueAndClose() {
        this.emitValue(this.value);
        this.close();
    }
    ngOnInit() {
        var _a;
        this.inputSize = Math.max(8, this.nzFormat.length) + 2;
        this.origin = new CdkOverlayOrigin(this.element);
        this.i18nPlaceHolder$ = this.i18n.localeChange.pipe(map((nzLocale) => nzLocale.TimePicker.placeholder));
        this.dir = this.directionality.value;
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
            this.dir = direction;
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    ngOnChanges(changes) {
        const { nzUse12Hours, nzFormat, nzDisabled, nzAutoFocus } = changes;
        if (nzUse12Hours && !nzUse12Hours.previousValue && nzUse12Hours.currentValue && !nzFormat) {
            this.nzFormat = 'h:mm:ss a';
        }
        if (nzDisabled) {
            const value = nzDisabled.currentValue;
            const input = this.inputRef.nativeElement;
            if (value) {
                this.renderer.setAttribute(input, 'disabled', '');
            }
            else {
                this.renderer.removeAttribute(input, 'disabled');
            }
        }
        if (nzAutoFocus) {
            this.updateAutoFocus();
        }
    }
    parseTimeString(str) {
        const value = this.dateHelper.parseTime(str, this.nzFormat) || null;
        if (isValid(value)) {
            this.value = value;
            this.cdr.markForCheck();
        }
    }
    ngAfterViewInit() {
        this.isInit = true;
        this.updateAutoFocus();
    }
    writeValue(time) {
        let result;
        if (time instanceof Date) {
            result = time;
        }
        else if (isNil(time)) {
            result = null;
        }
        else {
            warn('Non-Date type is not recommended for time-picker, use "Date" type.');
            result = new Date(time);
        }
        this.setValue(result, true);
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.nzDisabled = isDisabled;
        this.cdr.markForCheck();
    }
}
NzTimePickerComponent.decorators = [
    { type: Component, args: [{
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                selector: 'nz-time-picker',
                exportAs: 'nzTimePicker',
                template: `
    <div class="ant-picker-input">
      <input
        #inputElement
        [attr.id]="nzId"
        type="text"
        [size]="inputSize"
        [placeholder]="nzPlaceHolder || (i18nPlaceHolder$ | async)"
        [(ngModel)]="inputValue"
        [disabled]="nzDisabled"
        (focus)="onFocus(true)"
        (blur)="onFocus(false)"
        (keyup.enter)="onKeyupEnter()"
        (keyup.escape)="onKeyupEsc()"
        (ngModelChange)="onInputChange($event)"
      />
      <span class="ant-picker-suffix">
        <ng-container *nzStringTemplateOutlet="nzSuffixIcon; let suffixIcon">
          <i nz-icon [nzType]="suffixIcon"></i>
        </ng-container>
      </span>
      <span *ngIf="nzAllowEmpty && !nzDisabled && value" class="ant-picker-clear" (click)="onClickClearBtn($event)">
        <i nz-icon nzType="close-circle" nzTheme="fill" [attr.aria-label]="nzClearText" [attr.title]="nzClearText"></i>
      </span>
    </div>

    <ng-template
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayPositions]="overlayPositions"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="nzOpen"
      [cdkConnectedOverlayOffsetY]="-2"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-picker-dropdown'"
      (detach)="close()"
      (overlayOutsideClick)="onClickOutside($event)"
    >
      <div [@slideMotion]="'enter'" class="ant-picker-dropdown">
        <div class="ant-picker-panel-container">
          <div tabindex="-1" class="ant-picker-panel">
            <nz-time-picker-panel
              [ngClass]="nzPopupClassName"
              [format]="nzFormat"
              [nzHourStep]="nzHourStep"
              [nzMinuteStep]="nzMinuteStep"
              [nzSecondStep]="nzSecondStep"
              [nzDisabledHours]="nzDisabledHours"
              [nzDisabledMinutes]="nzDisabledMinutes"
              [nzDisabledSeconds]="nzDisabledSeconds"
              [nzPlaceHolder]="nzPlaceHolder || (i18nPlaceHolder$ | async)"
              [nzHideDisabledOptions]="nzHideDisabledOptions"
              [nzUse12Hours]="nzUse12Hours"
              [nzDefaultOpenValue]="nzDefaultOpenValue"
              [nzAddOn]="nzAddOn"
              [nzClearText]="nzClearText"
              [nzNowText]="nzNowText"
              [nzOkText]="nzOkText"
              [nzAllowEmpty]="nzAllowEmpty"
              [(ngModel)]="value"
              (ngModelChange)="onPanelValueChange($event)"
              (closePanel)="setCurrentValueAndClose()"
            ></nz-time-picker-panel>
          </div>
        </div>
      </div>
    </ng-template>
  `,
                host: {
                    '[class.ant-picker-large]': `nzSize === 'large'`,
                    '[class.ant-picker-small]': `nzSize === 'small'`,
                    '[class.ant-picker-disabled]': `nzDisabled`,
                    '[class.ant-picker-focused]': `focused`,
                    '[class.ant-picker-rtl]': `dir === 'rtl'`,
                    '(click)': 'open()'
                },
                animations: [slideMotion],
                providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: NzTimePickerComponent, multi: true }]
            },] }
];
NzTimePickerComponent.ctorParameters = () => [
    { type: NzConfigService },
    { type: NzI18nService },
    { type: ElementRef },
    { type: Renderer2 },
    { type: ChangeDetectorRef },
    { type: DateHelperService },
    { type: Platform },
    { type: ElementRef },
    { type: Directionality, decorators: [{ type: Optional }] }
];
NzTimePickerComponent.propDecorators = {
    inputRef: [{ type: ViewChild, args: ['inputElement', { static: true },] }],
    nzId: [{ type: Input }],
    nzSize: [{ type: Input }],
    nzHourStep: [{ type: Input }],
    nzMinuteStep: [{ type: Input }],
    nzSecondStep: [{ type: Input }],
    nzClearText: [{ type: Input }],
    nzNowText: [{ type: Input }],
    nzOkText: [{ type: Input }],
    nzPopupClassName: [{ type: Input }],
    nzPlaceHolder: [{ type: Input }],
    nzAddOn: [{ type: Input }],
    nzDefaultOpenValue: [{ type: Input }],
    nzDisabledHours: [{ type: Input }],
    nzDisabledMinutes: [{ type: Input }],
    nzDisabledSeconds: [{ type: Input }],
    nzFormat: [{ type: Input }],
    nzOpen: [{ type: Input }],
    nzUse12Hours: [{ type: Input }],
    nzSuffixIcon: [{ type: Input }],
    nzOpenChange: [{ type: Output }],
    nzHideDisabledOptions: [{ type: Input }],
    nzAllowEmpty: [{ type: Input }],
    nzDisabled: [{ type: Input }],
    nzAutoFocus: [{ type: Input }]
};
__decorate([
    WithConfig(),
    __metadata("design:type", Number)
], NzTimePickerComponent.prototype, "nzHourStep", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Number)
], NzTimePickerComponent.prototype, "nzMinuteStep", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Number)
], NzTimePickerComponent.prototype, "nzSecondStep", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzTimePickerComponent.prototype, "nzClearText", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzTimePickerComponent.prototype, "nzNowText", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzTimePickerComponent.prototype, "nzOkText", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzTimePickerComponent.prototype, "nzPopupClassName", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzTimePickerComponent.prototype, "nzFormat", void 0);
__decorate([
    WithConfig(),
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzTimePickerComponent.prototype, "nzUse12Hours", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzTimePickerComponent.prototype, "nzSuffixIcon", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTimePickerComponent.prototype, "nzHideDisabledOptions", void 0);
__decorate([
    WithConfig(),
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzTimePickerComponent.prototype, "nzAllowEmpty", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTimePickerComponent.prototype, "nzDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTimePickerComponent.prototype, "nzAutoFocus", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tcG9uZW50cy90aW1lLXBpY2tlci90aW1lLXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFBYSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQTBCLE1BQU0sc0JBQXNCLENBQUM7QUFDaEYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2pELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFJTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFFVCxXQUFXLEVBQ1gsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNuQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFM0QsT0FBTyxFQUFlLGVBQWUsRUFBRSxVQUFVLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFakQsT0FBTyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsaUJBQWlCLEVBQW1CLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3ZGLE9BQU8sRUFBYyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7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QVUsRUFBRTs7MERBQStCO0FBQzlCO0lBQWIsVUFBVSxFQUFFOzt3REFBd0I7QUFDdkI7SUFBYixVQUFVLEVBQUU7O3VEQUF1QjtBQUN0QjtJQUFiLFVBQVUsRUFBRTs7K0RBQStCO0FBTzlCO0lBQWIsVUFBVSxFQUFFOzt1REFBK0I7QUFFZDtJQUE3QixVQUFVLEVBQUU7SUFBRSxZQUFZLEVBQUU7OzJEQUErQjtBQUM5QztJQUFiLFVBQVUsRUFBRTs7MkRBQWdFO0FBSTdEO0lBQWYsWUFBWSxFQUFFOztvRUFBK0I7QUFDaEI7SUFBN0IsVUFBVSxFQUFFO0lBQUUsWUFBWSxFQUFFOzsyREFBOEI7QUFDM0M7SUFBZixZQUFZLEVBQUU7O3lEQUFvQjtBQUNuQjtJQUFmLFlBQVksRUFBRTs7MERBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IENka092ZXJsYXlPcmlnaW4sIENvbm5lY3Rpb25Qb3NpdGlvblBhaXIgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IGlzVmFsaWQgfSBmcm9tICdkYXRlLWZucyc7XG5pbXBvcnQgeyBzbGlkZU1vdGlvbiB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9hbmltYXRpb24nO1xuXG5pbXBvcnQgeyBOekNvbmZpZ0tleSwgTnpDb25maWdTZXJ2aWNlLCBXaXRoQ29uZmlnIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2NvbmZpZyc7XG5pbXBvcnQgeyB3YXJuIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2xvZ2dlcic7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIE56U2FmZUFueSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS90eXBlcyc7XG5pbXBvcnQgeyBJbnB1dEJvb2xlYW4sIGlzTmlsIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuaW1wb3J0IHsgRGF0ZUhlbHBlclNlcnZpY2UsIE56STE4bkludGVyZmFjZSwgTnpJMThuU2VydmljZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvaTE4bic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmNvbnN0IE5aX0NPTkZJR19NT0RVTEVfTkFNRTogTnpDb25maWdLZXkgPSAndGltZVBpY2tlcic7XG5cbkBDb21wb25lbnQoe1xuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgc2VsZWN0b3I6ICduei10aW1lLXBpY2tlcicsXG4gIGV4cG9ydEFzOiAnbnpUaW1lUGlja2VyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiYW50LXBpY2tlci1pbnB1dFwiPlxuICAgICAgPGlucHV0XG4gICAgICAgICNpbnB1dEVsZW1lbnRcbiAgICAgICAgW2F0dHIuaWRdPVwibnpJZFwiXG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgW3NpemVdPVwiaW5wdXRTaXplXCJcbiAgICAgICAgW3BsYWNlaG9sZGVyXT1cIm56UGxhY2VIb2xkZXIgfHwgKGkxOG5QbGFjZUhvbGRlciQgfCBhc3luYylcIlxuICAgICAgICBbKG5nTW9kZWwpXT1cImlucHV0VmFsdWVcIlxuICAgICAgICBbZGlzYWJsZWRdPVwibnpEaXNhYmxlZFwiXG4gICAgICAgIChmb2N1cyk9XCJvbkZvY3VzKHRydWUpXCJcbiAgICAgICAgKGJsdXIpPVwib25Gb2N1cyhmYWxzZSlcIlxuICAgICAgICAoa2V5dXAuZW50ZXIpPVwib25LZXl1cEVudGVyKClcIlxuICAgICAgICAoa2V5dXAuZXNjYXBlKT1cIm9uS2V5dXBFc2MoKVwiXG4gICAgICAgIChuZ01vZGVsQ2hhbmdlKT1cIm9uSW5wdXRDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAvPlxuICAgICAgPHNwYW4gY2xhc3M9XCJhbnQtcGlja2VyLXN1ZmZpeFwiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuelN0cmluZ1RlbXBsYXRlT3V0bGV0PVwibnpTdWZmaXhJY29uOyBsZXQgc3VmZml4SWNvblwiPlxuICAgICAgICAgIDxpIG56LWljb24gW256VHlwZV09XCJzdWZmaXhJY29uXCI+PC9pPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxzcGFuICpuZ0lmPVwibnpBbGxvd0VtcHR5ICYmICFuekRpc2FibGVkICYmIHZhbHVlXCIgY2xhc3M9XCJhbnQtcGlja2VyLWNsZWFyXCIgKGNsaWNrKT1cIm9uQ2xpY2tDbGVhckJ0bigkZXZlbnQpXCI+XG4gICAgICAgIDxpIG56LWljb24gbnpUeXBlPVwiY2xvc2UtY2lyY2xlXCIgbnpUaGVtZT1cImZpbGxcIiBbYXR0ci5hcmlhLWxhYmVsXT1cIm56Q2xlYXJUZXh0XCIgW2F0dHIudGl0bGVdPVwibnpDbGVhclRleHRcIj48L2k+XG4gICAgICA8L3NwYW4+XG4gICAgPC9kaXY+XG5cbiAgICA8bmctdGVtcGxhdGVcbiAgICAgIGNka0Nvbm5lY3RlZE92ZXJsYXlcbiAgICAgIG56Q29ubmVjdGVkT3ZlcmxheVxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlQb3NpdGlvbnNdPVwib3ZlcmxheVBvc2l0aW9uc1wiXG4gICAgICBbY2RrQ29ubmVjdGVkT3ZlcmxheU9yaWdpbl09XCJvcmlnaW5cIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlPcGVuXT1cIm56T3BlblwiXG4gICAgICBbY2RrQ29ubmVjdGVkT3ZlcmxheU9mZnNldFldPVwiLTJcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlUcmFuc2Zvcm1PcmlnaW5Pbl09XCInLmFudC1waWNrZXItZHJvcGRvd24nXCJcbiAgICAgIChkZXRhY2gpPVwiY2xvc2UoKVwiXG4gICAgICAob3ZlcmxheU91dHNpZGVDbGljayk9XCJvbkNsaWNrT3V0c2lkZSgkZXZlbnQpXCJcbiAgICA+XG4gICAgICA8ZGl2IFtAc2xpZGVNb3Rpb25dPVwiJ2VudGVyJ1wiIGNsYXNzPVwiYW50LXBpY2tlci1kcm9wZG93blwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW50LXBpY2tlci1wYW5lbC1jb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cImFudC1waWNrZXItcGFuZWxcIj5cbiAgICAgICAgICAgIDxuei10aW1lLXBpY2tlci1wYW5lbFxuICAgICAgICAgICAgICBbbmdDbGFzc109XCJuelBvcHVwQ2xhc3NOYW1lXCJcbiAgICAgICAgICAgICAgW2Zvcm1hdF09XCJuekZvcm1hdFwiXG4gICAgICAgICAgICAgIFtuekhvdXJTdGVwXT1cIm56SG91clN0ZXBcIlxuICAgICAgICAgICAgICBbbnpNaW51dGVTdGVwXT1cIm56TWludXRlU3RlcFwiXG4gICAgICAgICAgICAgIFtuelNlY29uZFN0ZXBdPVwibnpTZWNvbmRTdGVwXCJcbiAgICAgICAgICAgICAgW256RGlzYWJsZWRIb3Vyc109XCJuekRpc2FibGVkSG91cnNcIlxuICAgICAgICAgICAgICBbbnpEaXNhYmxlZE1pbnV0ZXNdPVwibnpEaXNhYmxlZE1pbnV0ZXNcIlxuICAgICAgICAgICAgICBbbnpEaXNhYmxlZFNlY29uZHNdPVwibnpEaXNhYmxlZFNlY29uZHNcIlxuICAgICAgICAgICAgICBbbnpQbGFjZUhvbGRlcl09XCJuelBsYWNlSG9sZGVyIHx8IChpMThuUGxhY2VIb2xkZXIkIHwgYXN5bmMpXCJcbiAgICAgICAgICAgICAgW256SGlkZURpc2FibGVkT3B0aW9uc109XCJuekhpZGVEaXNhYmxlZE9wdGlvbnNcIlxuICAgICAgICAgICAgICBbbnpVc2UxMkhvdXJzXT1cIm56VXNlMTJIb3Vyc1wiXG4gICAgICAgICAgICAgIFtuekRlZmF1bHRPcGVuVmFsdWVdPVwibnpEZWZhdWx0T3BlblZhbHVlXCJcbiAgICAgICAgICAgICAgW256QWRkT25dPVwibnpBZGRPblwiXG4gICAgICAgICAgICAgIFtuekNsZWFyVGV4dF09XCJuekNsZWFyVGV4dFwiXG4gICAgICAgICAgICAgIFtuek5vd1RleHRdPVwibnpOb3dUZXh0XCJcbiAgICAgICAgICAgICAgW256T2tUZXh0XT1cIm56T2tUZXh0XCJcbiAgICAgICAgICAgICAgW256QWxsb3dFbXB0eV09XCJuekFsbG93RW1wdHlcIlxuICAgICAgICAgICAgICBbKG5nTW9kZWwpXT1cInZhbHVlXCJcbiAgICAgICAgICAgICAgKG5nTW9kZWxDaGFuZ2UpPVwib25QYW5lbFZhbHVlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgICAoY2xvc2VQYW5lbCk9XCJzZXRDdXJyZW50VmFsdWVBbmRDbG9zZSgpXCJcbiAgICAgICAgICAgID48L256LXRpbWUtcGlja2VyLXBhbmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmFudC1waWNrZXItbGFyZ2VdJzogYG56U2l6ZSA9PT0gJ2xhcmdlJ2AsXG4gICAgJ1tjbGFzcy5hbnQtcGlja2VyLXNtYWxsXSc6IGBuelNpemUgPT09ICdzbWFsbCdgLFxuICAgICdbY2xhc3MuYW50LXBpY2tlci1kaXNhYmxlZF0nOiBgbnpEaXNhYmxlZGAsXG4gICAgJ1tjbGFzcy5hbnQtcGlja2VyLWZvY3VzZWRdJzogYGZvY3VzZWRgLFxuICAgICdbY2xhc3MuYW50LXBpY2tlci1ydGxdJzogYGRpciA9PT0gJ3J0bCdgLFxuICAgICcoY2xpY2spJzogJ29wZW4oKSdcbiAgfSxcbiAgYW5pbWF0aW9uczogW3NsaWRlTW90aW9uXSxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE56VGltZVBpY2tlckNvbXBvbmVudCwgbXVsdGk6IHRydWUgfV1cbn0pXG5leHBvcnQgY2xhc3MgTnpUaW1lUGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICByZWFkb25seSBfbnpNb2R1bGVOYW1lOiBOekNvbmZpZ0tleSA9IE5aX0NPTkZJR19NT0RVTEVfTkFNRTtcblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpVc2UxMkhvdXJzOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekhpZGVEaXNhYmxlZE9wdGlvbnM6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256QWxsb3dFbXB0eTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpEaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpBdXRvRm9jdXM6IEJvb2xlYW5JbnB1dDtcblxuICBwcml2YXRlIF9vbkNoYW5nZT86ICh2YWx1ZTogRGF0ZSB8IG51bGwpID0+IHZvaWQ7XG4gIHByaXZhdGUgX29uVG91Y2hlZD86ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBpc0luaXQgPSBmYWxzZTtcbiAgZm9jdXNlZCA9IGZhbHNlO1xuICBpbnB1dFZhbHVlOiBzdHJpbmcgPSAnJztcbiAgdmFsdWU6IERhdGUgfCBudWxsID0gbnVsbDtcbiAgcHJlVmFsdWU6IERhdGUgfCBudWxsID0gbnVsbDtcbiAgb3JpZ2luITogQ2RrT3ZlcmxheU9yaWdpbjtcbiAgaW5wdXRTaXplPzogbnVtYmVyO1xuICBpMThuUGxhY2VIb2xkZXIkOiBPYnNlcnZhYmxlPHN0cmluZyB8IHVuZGVmaW5lZD4gPSBvZih1bmRlZmluZWQpO1xuICBvdmVybGF5UG9zaXRpb25zOiBDb25uZWN0aW9uUG9zaXRpb25QYWlyW10gPSBbXG4gICAge1xuICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgIG9yaWdpblk6ICdib3R0b20nLFxuICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICBvdmVybGF5WTogJ3RvcCcsXG4gICAgICBvZmZzZXRZOiAzXG4gICAgfVxuICBdO1xuICBkaXI6IERpcmVjdGlvbiA9ICdsdHInO1xuXG4gIEBWaWV3Q2hpbGQoJ2lucHV0RWxlbWVudCcsIHsgc3RhdGljOiB0cnVlIH0pIGlucHV0UmVmITogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PjtcbiAgQElucHV0KCkgbnpJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIG56U2l6ZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIEBXaXRoQ29uZmlnKCkgbnpIb3VyU3RlcDogbnVtYmVyID0gMTtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBuek1pbnV0ZVN0ZXA6IG51bWJlciA9IDE7XG4gIEBJbnB1dCgpIEBXaXRoQ29uZmlnKCkgbnpTZWNvbmRTdGVwOiBudW1iZXIgPSAxO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZygpIG56Q2xlYXJUZXh0OiBzdHJpbmcgPSAnY2xlYXInO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZygpIG56Tm93VGV4dDogc3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIEBXaXRoQ29uZmlnKCkgbnpPa1RleHQ6IHN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZygpIG56UG9wdXBDbGFzc05hbWU6IHN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBuelBsYWNlSG9sZGVyID0gJyc7XG4gIEBJbnB1dCgpIG56QWRkT24/OiBUZW1wbGF0ZVJlZjx2b2lkPjtcbiAgQElucHV0KCkgbnpEZWZhdWx0T3BlblZhbHVlPzogRGF0ZTtcbiAgQElucHV0KCkgbnpEaXNhYmxlZEhvdXJzPzogKCkgPT4gbnVtYmVyW107XG4gIEBJbnB1dCgpIG56RGlzYWJsZWRNaW51dGVzPzogKGhvdXI6IG51bWJlcikgPT4gbnVtYmVyW107XG4gIEBJbnB1dCgpIG56RGlzYWJsZWRTZWNvbmRzPzogKGhvdXI6IG51bWJlciwgbWludXRlOiBudW1iZXIpID0+IG51bWJlcltdO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZygpIG56Rm9ybWF0OiBzdHJpbmcgPSAnSEg6bW06c3MnO1xuICBASW5wdXQoKSBuek9wZW4gPSBmYWxzZTtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBASW5wdXRCb29sZWFuKCkgbnpVc2UxMkhvdXJzOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBXaXRoQ29uZmlnKCkgbnpTdWZmaXhJY29uOiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjxOelNhZmVBbnk+ID0gJ2Nsb2NrLWNpcmNsZSc7XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56T3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpIaWRlRGlzYWJsZWRPcHRpb25zID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBXaXRoQ29uZmlnKCkgQElucHV0Qm9vbGVhbigpIG56QWxsb3dFbXB0eTogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekRpc2FibGVkID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekF1dG9Gb2N1cyA9IGZhbHNlO1xuXG4gIGVtaXRWYWx1ZSh2YWx1ZTogRGF0ZSB8IG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLnNldFZhbHVlKHZhbHVlLCB0cnVlKTtcblxuICAgIGlmICh0aGlzLl9vbkNoYW5nZSkge1xuICAgICAgdGhpcy5fb25DaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX29uVG91Y2hlZCkge1xuICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0VmFsdWUodmFsdWU6IERhdGUgfCBudWxsLCBzeW5jUHJlVmFsdWU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmIChzeW5jUHJlVmFsdWUpIHtcbiAgICAgIHRoaXMucHJlVmFsdWUgPSBpc1ZhbGlkKHZhbHVlKSA/IG5ldyBEYXRlKHZhbHVlISkgOiBudWxsO1xuICAgIH1cbiAgICB0aGlzLnZhbHVlID0gaXNWYWxpZCh2YWx1ZSkgPyBuZXcgRGF0ZSh2YWx1ZSEpIDogbnVsbDtcbiAgICB0aGlzLmlucHV0VmFsdWUgPSB0aGlzLmRhdGVIZWxwZXIuZm9ybWF0KHZhbHVlLCB0aGlzLm56Rm9ybWF0KTtcbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubnpEaXNhYmxlZCB8fCB0aGlzLm56T3Blbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZvY3VzKCk7XG4gICAgdGhpcy5uek9wZW4gPSB0cnVlO1xuICAgIHRoaXMubnpPcGVuQ2hhbmdlLmVtaXQodGhpcy5uek9wZW4pO1xuICB9XG5cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5uek9wZW4gPSBmYWxzZTtcbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICB0aGlzLm56T3BlbkNoYW5nZS5lbWl0KHRoaXMubnpPcGVuKTtcbiAgfVxuXG4gIHVwZGF0ZUF1dG9Gb2N1cygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0luaXQgJiYgIXRoaXMubnpEaXNhYmxlZCkge1xuICAgICAgaWYgKHRoaXMubnpBdXRvRm9jdXMpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5pbnB1dFJlZi5uYXRpdmVFbGVtZW50LCAnYXV0b2ZvY3VzJywgJ2F1dG9mb2N1cycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5pbnB1dFJlZi5uYXRpdmVFbGVtZW50LCAnYXV0b2ZvY3VzJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25DbGlja0NsZWFyQnRuKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5lbWl0VmFsdWUobnVsbCk7XG4gIH1cblxuICBvbkNsaWNrT3V0c2lkZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgdGhpcy5zZXRDdXJyZW50VmFsdWVBbmRDbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIG9uRm9jdXModmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmZvY3VzZWQgPSB2YWx1ZTtcbiAgfVxuXG4gIGZvY3VzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlucHV0UmVmLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuaW5wdXRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIGJsdXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW5wdXRSZWYubmF0aXZlRWxlbWVudCkge1xuICAgICAgdGhpcy5pbnB1dFJlZi5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9XG4gIH1cblxuICBvbktleXVwRXNjKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmFsdWUodGhpcy5wcmVWYWx1ZSk7XG4gIH1cblxuICBvbktleXVwRW50ZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubnpPcGVuICYmIGlzVmFsaWQodGhpcy52YWx1ZSkpIHtcbiAgICAgIHRoaXMuc2V0Q3VycmVudFZhbHVlQW5kQ2xvc2UoKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLm56T3Blbikge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgb25JbnB1dENoYW5nZShzdHI6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5wbGF0Zm9ybS5UUklERU5UICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMuaW5wdXRSZWYubmF0aXZlRWxlbWVudCkge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICB0aGlzLnBhcnNlVGltZVN0cmluZyhzdHIpO1xuICAgIH1cbiAgfVxuXG4gIG9uUGFuZWxWYWx1ZUNoYW5nZSh2YWx1ZTogRGF0ZSk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuICAgIHRoaXMuZm9jdXMoKTtcbiAgfVxuXG4gIHNldEN1cnJlbnRWYWx1ZUFuZENsb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuZW1pdFZhbHVlKHRoaXMudmFsdWUpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBuekNvbmZpZ1NlcnZpY2U6IE56Q29uZmlnU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgaTE4bjogTnpJMThuU2VydmljZSxcbiAgICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGRhdGVIZWxwZXI6IERhdGVIZWxwZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eVxuICApIHtcbiAgICAvLyBUT0RPOiBtb3ZlIHRvIGhvc3QgYWZ0ZXIgVmlldyBFbmdpbmUgZGVwcmVjYXRpb25cbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhbnQtcGlja2VyJyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmlucHV0U2l6ZSA9IE1hdGgubWF4KDgsIHRoaXMubnpGb3JtYXQubGVuZ3RoKSArIDI7XG4gICAgdGhpcy5vcmlnaW4gPSBuZXcgQ2RrT3ZlcmxheU9yaWdpbih0aGlzLmVsZW1lbnQpO1xuXG4gICAgdGhpcy5pMThuUGxhY2VIb2xkZXIkID0gdGhpcy5pMThuLmxvY2FsZUNoYW5nZS5waXBlKG1hcCgobnpMb2NhbGU6IE56STE4bkludGVyZmFjZSkgPT4gbnpMb2NhbGUuVGltZVBpY2tlci5wbGFjZWhvbGRlcikpO1xuXG4gICAgdGhpcy5kaXIgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlO1xuICAgIHRoaXMuZGlyZWN0aW9uYWxpdHkuY2hhbmdlPy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKChkaXJlY3Rpb246IERpcmVjdGlvbikgPT4ge1xuICAgICAgdGhpcy5kaXIgPSBkaXJlY3Rpb247XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3QgeyBuelVzZTEySG91cnMsIG56Rm9ybWF0LCBuekRpc2FibGVkLCBuekF1dG9Gb2N1cyB9ID0gY2hhbmdlcztcbiAgICBpZiAobnpVc2UxMkhvdXJzICYmICFuelVzZTEySG91cnMucHJldmlvdXNWYWx1ZSAmJiBuelVzZTEySG91cnMuY3VycmVudFZhbHVlICYmICFuekZvcm1hdCkge1xuICAgICAgdGhpcy5uekZvcm1hdCA9ICdoOm1tOnNzIGEnO1xuICAgIH1cbiAgICBpZiAobnpEaXNhYmxlZCkge1xuICAgICAgY29uc3QgdmFsdWUgPSBuekRpc2FibGVkLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5pbnB1dFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoaW5wdXQsICdkaXNhYmxlZCcsICcnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQXR0cmlidXRlKGlucHV0LCAnZGlzYWJsZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG56QXV0b0ZvY3VzKSB7XG4gICAgICB0aGlzLnVwZGF0ZUF1dG9Gb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIHBhcnNlVGltZVN0cmluZyhzdHI6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRlSGVscGVyLnBhcnNlVGltZShzdHIsIHRoaXMubnpGb3JtYXQpIHx8IG51bGw7XG4gICAgaWYgKGlzVmFsaWQodmFsdWUpKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pc0luaXQgPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlQXV0b0ZvY3VzKCk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHRpbWU6IERhdGUgfCBudWxsIHwgdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgbGV0IHJlc3VsdDogRGF0ZSB8IG51bGw7XG5cbiAgICBpZiAodGltZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHJlc3VsdCA9IHRpbWU7XG4gICAgfSBlbHNlIGlmIChpc05pbCh0aW1lKSkge1xuICAgICAgcmVzdWx0ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgd2FybignTm9uLURhdGUgdHlwZSBpcyBub3QgcmVjb21tZW5kZWQgZm9yIHRpbWUtcGlja2VyLCB1c2UgXCJEYXRlXCIgdHlwZS4nKTtcbiAgICAgIHJlc3VsdCA9IG5ldyBEYXRlKHRpbWUpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0VmFsdWUocmVzdWx0LCB0cnVlKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh0aW1lOiBEYXRlIHwgbnVsbCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5uekRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxufVxuIl19