/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata, __rest } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { warnDeprecation } from 'ng-zorro-antd/core/logger';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { NzModalContentDirective } from './modal-content.directive';
import { NzModalFooterDirective } from './modal-footer.directive';
import { NzModalService } from './modal.service';
import { getConfigFromComponent } from './utils';
export class NzModalComponent {
    constructor(cdr, modal, viewContainerRef) {
        this.cdr = cdr;
        this.modal = modal;
        this.viewContainerRef = viewContainerRef;
        this.nzVisible = false;
        this.nzClosable = true;
        this.nzOkLoading = false;
        this.nzOkDisabled = false;
        this.nzCancelDisabled = false;
        this.nzCancelLoading = false;
        this.nzKeyboard = true;
        this.nzNoAnimation = false;
        this.nzCentered = false;
        this.nzZIndex = 1000;
        this.nzWidth = 520;
        this.nzCloseIcon = 'close';
        this.nzOkType = 'primary';
        this.nzOkDanger = false;
        this.nzIconType = 'question-circle'; // Confirm Modal ONLY
        this.nzModalType = 'default';
        this.nzAutofocus = 'auto';
        // TODO(@hsuanxyz) Input will not be supported
        this.nzOnOk = new EventEmitter();
        // TODO(@hsuanxyz) Input will not be supported
        this.nzOnCancel = new EventEmitter();
        this.nzAfterOpen = new EventEmitter();
        this.nzAfterClose = new EventEmitter();
        this.nzVisibleChange = new EventEmitter();
        this.modalRef = null;
    }
    set modalFooter(value) {
        if (value) {
            this.setFooterWithTemplate(value);
        }
    }
    get afterOpen() {
        // Observable alias for nzAfterOpen
        return this.nzAfterOpen.asObservable();
    }
    get afterClose() {
        // Observable alias for nzAfterClose
        return this.nzAfterClose.asObservable();
    }
    open() {
        if (!this.nzVisible) {
            this.nzVisible = true;
            this.nzVisibleChange.emit(true);
        }
        if (!this.modalRef) {
            const config = this.getConfig();
            this.modalRef = this.modal.create(config);
        }
    }
    close(result) {
        if (this.nzVisible) {
            this.nzVisible = false;
            this.nzVisibleChange.emit(false);
        }
        if (this.modalRef) {
            this.modalRef.close(result);
            this.modalRef = null;
        }
    }
    destroy(result) {
        this.close(result);
    }
    triggerOk() {
        var _a;
        (_a = this.modalRef) === null || _a === void 0 ? void 0 : _a.triggerOk();
    }
    triggerCancel() {
        var _a;
        (_a = this.modalRef) === null || _a === void 0 ? void 0 : _a.triggerCancel();
    }
    getContentComponent() {
        var _a;
        return (_a = this.modalRef) === null || _a === void 0 ? void 0 : _a.getContentComponent();
    }
    getElement() {
        var _a;
        return (_a = this.modalRef) === null || _a === void 0 ? void 0 : _a.getElement();
    }
    getModalRef() {
        return this.modalRef;
    }
    setFooterWithTemplate(templateRef) {
        this.nzFooter = templateRef;
        if (this.modalRef) {
            // If modalRef already created, set the footer in next tick
            Promise.resolve().then(() => {
                this.modalRef.updateConfig({
                    nzFooter: this.nzFooter
                });
            });
        }
        this.cdr.markForCheck();
    }
    getConfig() {
        const componentConfig = getConfigFromComponent(this);
        componentConfig.nzViewContainerRef = this.viewContainerRef;
        if (!this.nzContent && !this.contentFromContentChild) {
            componentConfig.nzContent = this.contentTemplateRef;
            warnDeprecation('Usage `<ng-content></ng-content>` is deprecated, which will be removed in 12.0.0. Please instead use `<ng-template nzModalContent></ng-template>` to declare the content of the modal.');
        }
        else {
            componentConfig.nzContent = this.nzContent || this.contentFromContentChild;
        }
        return componentConfig;
    }
    ngOnChanges(changes) {
        const { nzVisible } = changes, otherChanges = __rest(changes, ["nzVisible"]);
        if (Object.keys(otherChanges).length && this.modalRef) {
            this.modalRef.updateConfig(getConfigFromComponent(this));
        }
        if (nzVisible) {
            if (this.nzVisible) {
                this.open();
            }
            else {
                this.close();
            }
        }
    }
    ngOnDestroy() {
        var _a;
        (_a = this.modalRef) === null || _a === void 0 ? void 0 : _a._finishDialogClose();
    }
}
NzModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-modal',
                exportAs: 'nzModal',
                template: `
    <ng-template><ng-content></ng-content></ng-template>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
NzModalComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: NzModalService },
    { type: ViewContainerRef }
];
NzModalComponent.propDecorators = {
    nzMask: [{ type: Input }],
    nzMaskClosable: [{ type: Input }],
    nzCloseOnNavigation: [{ type: Input }],
    nzVisible: [{ type: Input }],
    nzClosable: [{ type: Input }],
    nzOkLoading: [{ type: Input }],
    nzOkDisabled: [{ type: Input }],
    nzCancelDisabled: [{ type: Input }],
    nzCancelLoading: [{ type: Input }],
    nzKeyboard: [{ type: Input }],
    nzNoAnimation: [{ type: Input }],
    nzCentered: [{ type: Input }],
    nzContent: [{ type: Input }],
    nzComponentParams: [{ type: Input }],
    nzFooter: [{ type: Input }],
    nzZIndex: [{ type: Input }],
    nzWidth: [{ type: Input }],
    nzWrapClassName: [{ type: Input }],
    nzClassName: [{ type: Input }],
    nzStyle: [{ type: Input }],
    nzTitle: [{ type: Input }],
    nzCloseIcon: [{ type: Input }],
    nzMaskStyle: [{ type: Input }],
    nzBodyStyle: [{ type: Input }],
    nzOkText: [{ type: Input }],
    nzCancelText: [{ type: Input }],
    nzOkType: [{ type: Input }],
    nzOkDanger: [{ type: Input }],
    nzIconType: [{ type: Input }],
    nzModalType: [{ type: Input }],
    nzAutofocus: [{ type: Input }],
    nzOnOk: [{ type: Input }, { type: Output }],
    nzOnCancel: [{ type: Input }, { type: Output }],
    nzAfterOpen: [{ type: Output }],
    nzAfterClose: [{ type: Output }],
    nzVisibleChange: [{ type: Output }],
    contentTemplateRef: [{ type: ViewChild, args: [TemplateRef, { static: true },] }],
    contentFromContentChild: [{ type: ContentChild, args: [NzModalContentDirective, { static: true, read: TemplateRef },] }],
    modalFooter: [{ type: ContentChild, args: [NzModalFooterDirective, { static: true, read: TemplateRef },] }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzMask", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzMaskClosable", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzCloseOnNavigation", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzVisible", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzClosable", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzOkLoading", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzOkDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzCancelDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzCancelLoading", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzKeyboard", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzModalComponent.prototype, "nzNoAnimation", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzModalComponent.prototype, "nzCentered", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzOkDanger", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tcG9uZW50cy9tb2RhbC9tb2RhbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBRU4sV0FBVyxFQUVYLFNBQVMsRUFDVCxnQkFBZ0IsRUFDakIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRTVELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUd2RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUlsRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDakQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBVWpELE1BQU0sT0FBTyxnQkFBZ0I7SUFrRjNCLFlBQW9CLEdBQXNCLEVBQVUsS0FBcUIsRUFBVSxnQkFBa0M7UUFBakcsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFoRTVGLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsZUFBVSxHQUFZLElBQUksQ0FBQztRQUMzQixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUM3QixpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUM5QixxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFDbEMsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFDakMsZUFBVSxHQUFZLElBQUksQ0FBQztRQUMzQixrQkFB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OzBCQUN6RSxZQUFZLFNBQUMsc0JBQXNCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7O0FBaERoRDtJQUFmLFlBQVksRUFBRTs7Z0RBQWtCO0FBQ2pCO0lBQWYsWUFBWSxFQUFFOzt3REFBMEI7QUFDekI7SUFBZixZQUFZLEVBQUU7OzZEQUErQjtBQUM5QjtJQUFmLFlBQVksRUFBRTs7bURBQTRCO0FBQzNCO0lBQWYsWUFBWSxFQUFFOztvREFBNEI7QUFDM0I7SUFBZixZQUFZLEVBQUU7O3FEQUE4QjtBQUM3QjtJQUFmLFlBQVksRUFBRTs7c0RBQStCO0FBQzlCO0lBQWYsWUFBWSxFQUFFOzswREFBbUM7QUFDbEM7SUFBZixZQUFZLEVBQUU7O3lEQUFrQztBQUNqQztJQUFmLFlBQVksRUFBRTs7b0RBQTRCO0FBQzNCO0lBQWYsWUFBWSxFQUFFOzt1REFBdUI7QUFDdEI7SUFBZixZQUFZLEVBQUU7O29EQUFvQjtBQWdCbkI7SUFBZixZQUFZLEVBQUU7O29EQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBUeXBlLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE56QnV0dG9uVHlwZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvYnV0dG9uJztcbmltcG9ydCB7IHdhcm5EZXByZWNhdGlvbiB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9sb2dnZXInO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgSW5wdXRCb29sZWFuIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBOek1vZGFsQ29udGVudERpcmVjdGl2ZSB9IGZyb20gJy4vbW9kYWwtY29udGVudC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTnpNb2RhbEZvb3RlckRpcmVjdGl2ZSB9IGZyb20gJy4vbW9kYWwtZm9vdGVyLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBOek1vZGFsTGVnYWN5QVBJIH0gZnJvbSAnLi9tb2RhbC1sZWdhY3ktYXBpJztcbmltcG9ydCB7IE56TW9kYWxSZWYgfSBmcm9tICcuL21vZGFsLXJlZic7XG5pbXBvcnQgeyBNb2RhbEJ1dHRvbk9wdGlvbnMsIE1vZGFsT3B0aW9ucywgTW9kYWxUeXBlcywgT25DbGlja0NhbGxiYWNrLCBTdHlsZU9iamVjdExpa2UgfSBmcm9tICcuL21vZGFsLXR5cGVzJztcbmltcG9ydCB7IE56TW9kYWxTZXJ2aWNlIH0gZnJvbSAnLi9tb2RhbC5zZXJ2aWNlJztcbmltcG9ydCB7IGdldENvbmZpZ0Zyb21Db21wb25lbnQgfSBmcm9tICcuL3V0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbnotbW9kYWwnLFxuICBleHBvcnRBczogJ256TW9kYWwnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZT48bmctY29udGVudD48L25nLWNvbnRlbnQ+PC9uZy10ZW1wbGF0ZT5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTnpNb2RhbENvbXBvbmVudDxUID0gTnpTYWZlQW55LCBSID0gTnpTYWZlQW55PiBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgTnpNb2RhbExlZ2FjeUFQSTxULCBSPiwgT25EZXN0cm95IHtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256TWFzazogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpNYXNrQ2xvc2FibGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256Q2xvc2VPbk5hdmlnYXRpb246IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256VmlzaWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpDbG9zYWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpPa0xvYWRpbmc6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256T2tEaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpDYW5jZWxEaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpDYW5jZWxMb2FkaW5nOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uektleWJvYXJkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uek5vQW5pbWF0aW9uOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uek9rRGFuZ2VyOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekNlbnRlcmVkOiBCb29sZWFuSW5wdXQ7XG5cbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56TWFzaz86IGJvb2xlYW47XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuek1hc2tDbG9zYWJsZT86IGJvb2xlYW47XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekNsb3NlT25OYXZpZ2F0aW9uPzogYm9vbGVhbjtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56VmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpDbG9zYWJsZTogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuek9rTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpPa0Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekNhbmNlbERpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekNhbmNlbExvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56S2V5Ym9hcmQ6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpOb0FuaW1hdGlvbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpDZW50ZXJlZCA9IGZhbHNlO1xuICBASW5wdXQoKSBuekNvbnRlbnQ/OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjx7fT4gfCBUeXBlPFQ+O1xuICBASW5wdXQoKSBuekNvbXBvbmVudFBhcmFtcz86IFQ7XG4gIEBJbnB1dCgpIG56Rm9vdGVyPzogc3RyaW5nIHwgVGVtcGxhdGVSZWY8e30+IHwgQXJyYXk8TW9kYWxCdXR0b25PcHRpb25zPFQ+PiB8IG51bGw7XG4gIEBJbnB1dCgpIG56WkluZGV4OiBudW1iZXIgPSAxMDAwO1xuICBASW5wdXQoKSBueldpZHRoOiBudW1iZXIgfCBzdHJpbmcgPSA1MjA7XG4gIEBJbnB1dCgpIG56V3JhcENsYXNzTmFtZT86IHN0cmluZztcbiAgQElucHV0KCkgbnpDbGFzc05hbWU/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIG56U3R5bGU/OiBvYmplY3Q7XG4gIEBJbnB1dCgpIG56VGl0bGU/OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjx7fT47XG4gIEBJbnB1dCgpIG56Q2xvc2VJY29uOiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjx2b2lkPiA9ICdjbG9zZSc7XG4gIEBJbnB1dCgpIG56TWFza1N0eWxlPzogU3R5bGVPYmplY3RMaWtlO1xuICBASW5wdXQoKSBuekJvZHlTdHlsZT86IFN0eWxlT2JqZWN0TGlrZTtcbiAgQElucHV0KCkgbnpPa1RleHQ/OiBzdHJpbmcgfCBudWxsO1xuICBASW5wdXQoKSBuekNhbmNlbFRleHQ/OiBzdHJpbmcgfCBudWxsO1xuICBASW5wdXQoKSBuek9rVHlwZTogTnpCdXR0b25UeXBlID0gJ3ByaW1hcnknO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpPa0RhbmdlcjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBuekljb25UeXBlOiBzdHJpbmcgPSAncXVlc3Rpb24tY2lyY2xlJzsgLy8gQ29uZmlybSBNb2RhbCBPTkxZXG4gIEBJbnB1dCgpIG56TW9kYWxUeXBlOiBNb2RhbFR5cGVzID0gJ2RlZmF1bHQnO1xuICBASW5wdXQoKSBuekF1dG9mb2N1czogJ29rJyB8ICdjYW5jZWwnIHwgJ2F1dG8nIHwgbnVsbCA9ICdhdXRvJztcblxuICAvLyBUT0RPKEBoc3Vhbnh5eikgSW5wdXQgd2lsbCBub3QgYmUgc3VwcG9ydGVkXG4gIEBJbnB1dCgpXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBuek9uT2s6IEV2ZW50RW1pdHRlcjxUPiB8IE9uQ2xpY2tDYWxsYmFjazxUPiB8IE56U2FmZUFueSA9IG5ldyBFdmVudEVtaXR0ZXI8VD4oKTtcblxuICAvLyBUT0RPKEBoc3Vhbnh5eikgSW5wdXQgd2lsbCBub3QgYmUgc3VwcG9ydGVkXG4gIEBJbnB1dCgpXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBuek9uQ2FuY2VsOiBFdmVudEVtaXR0ZXI8VD4gfCBPbkNsaWNrQ2FsbGJhY2s8VD4gfCBOelNhZmVBbnkgPSBuZXcgRXZlbnRFbWl0dGVyPFQ+KCk7XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56QWZ0ZXJPcGVuID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbnpBZnRlckNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcjxSPigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbnpWaXNpYmxlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYsIHsgc3RhdGljOiB0cnVlIH0pIGNvbnRlbnRUZW1wbGF0ZVJlZiE6IFRlbXBsYXRlUmVmPHt9PjtcbiAgQENvbnRlbnRDaGlsZChOek1vZGFsQ29udGVudERpcmVjdGl2ZSwgeyBzdGF0aWM6IHRydWUsIHJlYWQ6IFRlbXBsYXRlUmVmIH0pIGNvbnRlbnRGcm9tQ29udGVudENoaWxkITogVGVtcGxhdGVSZWY8TnpTYWZlQW55PjtcbiAgQENvbnRlbnRDaGlsZChOek1vZGFsRm9vdGVyRGlyZWN0aXZlLCB7IHN0YXRpYzogdHJ1ZSwgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgc2V0IG1vZGFsRm9vdGVyKHZhbHVlOiBUZW1wbGF0ZVJlZjxOelNhZmVBbnk+KSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNldEZvb3RlcldpdGhUZW1wbGF0ZSh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtb2RhbFJlZjogTnpNb2RhbFJlZiB8IG51bGwgPSBudWxsO1xuXG4gIGdldCBhZnRlck9wZW4oKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgLy8gT2JzZXJ2YWJsZSBhbGlhcyBmb3IgbnpBZnRlck9wZW5cbiAgICByZXR1cm4gdGhpcy5uekFmdGVyT3Blbi5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldCBhZnRlckNsb3NlKCk6IE9ic2VydmFibGU8Uj4ge1xuICAgIC8vIE9ic2VydmFibGUgYWxpYXMgZm9yIG56QWZ0ZXJDbG9zZVxuICAgIHJldHVybiB0aGlzLm56QWZ0ZXJDbG9zZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBtb2RhbDogTnpNb2RhbFNlcnZpY2UsIHByaXZhdGUgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikge31cblxuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5uelZpc2libGUpIHtcbiAgICAgIHRoaXMubnpWaXNpYmxlID0gdHJ1ZTtcbiAgICAgIHRoaXMubnpWaXNpYmxlQ2hhbmdlLmVtaXQodHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1vZGFsUmVmKSB7XG4gICAgICBjb25zdCBjb25maWcgPSB0aGlzLmdldENvbmZpZygpO1xuICAgICAgdGhpcy5tb2RhbFJlZiA9IHRoaXMubW9kYWwuY3JlYXRlKGNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgY2xvc2UocmVzdWx0PzogUik6IHZvaWQge1xuICAgIGlmICh0aGlzLm56VmlzaWJsZSkge1xuICAgICAgdGhpcy5uelZpc2libGUgPSBmYWxzZTtcbiAgICAgIHRoaXMubnpWaXNpYmxlQ2hhbmdlLmVtaXQoZmFsc2UpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1vZGFsUmVmKSB7XG4gICAgICB0aGlzLm1vZGFsUmVmLmNsb3NlKHJlc3VsdCk7XG4gICAgICB0aGlzLm1vZGFsUmVmID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95KHJlc3VsdD86IFIpOiB2b2lkIHtcbiAgICB0aGlzLmNsb3NlKHJlc3VsdCk7XG4gIH1cblxuICB0cmlnZ2VyT2soKTogdm9pZCB7XG4gICAgdGhpcy5tb2RhbFJlZj8udHJpZ2dlck9rKCk7XG4gIH1cblxuICB0cmlnZ2VyQ2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMubW9kYWxSZWY/LnRyaWdnZXJDYW5jZWwoKTtcbiAgfVxuXG4gIGdldENvbnRlbnRDb21wb25lbnQoKTogVCB8IHZvaWQge1xuICAgIHJldHVybiB0aGlzLm1vZGFsUmVmPy5nZXRDb250ZW50Q29tcG9uZW50KCk7XG4gIH1cblxuICBnZXRFbGVtZW50KCk6IEhUTUxFbGVtZW50IHwgdm9pZCB7XG4gICAgcmV0dXJuIHRoaXMubW9kYWxSZWY/LmdldEVsZW1lbnQoKTtcbiAgfVxuXG4gIGdldE1vZGFsUmVmKCk6IE56TW9kYWxSZWYgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5tb2RhbFJlZjtcbiAgfVxuXG4gIHByaXZhdGUgc2V0Rm9vdGVyV2l0aFRlbXBsYXRlKHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjx7fT4pOiB2b2lkIHtcbiAgICB0aGlzLm56Rm9vdGVyID0gdGVtcGxhdGVSZWY7XG4gICAgaWYgKHRoaXMubW9kYWxSZWYpIHtcbiAgICAgIC8vIElmIG1vZGFsUmVmIGFscmVhZHkgY3JlYXRlZCwgc2V0IHRoZSBmb290ZXIgaW4gbmV4dCB0aWNrXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5tb2RhbFJlZiEudXBkYXRlQ29uZmlnKHtcbiAgICAgICAgICBuekZvb3RlcjogdGhpcy5uekZvb3RlclxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDb25maWcoKTogTW9kYWxPcHRpb25zIHtcbiAgICBjb25zdCBjb21wb25lbnRDb25maWcgPSBnZXRDb25maWdGcm9tQ29tcG9uZW50KHRoaXMpO1xuICAgIGNvbXBvbmVudENvbmZpZy5uelZpZXdDb250YWluZXJSZWYgPSB0aGlzLnZpZXdDb250YWluZXJSZWY7XG4gICAgaWYgKCF0aGlzLm56Q29udGVudCAmJiAhdGhpcy5jb250ZW50RnJvbUNvbnRlbnRDaGlsZCkge1xuICAgICAgY29tcG9uZW50Q29uZmlnLm56Q29udGVudCA9IHRoaXMuY29udGVudFRlbXBsYXRlUmVmO1xuICAgICAgd2FybkRlcHJlY2F0aW9uKFxuICAgICAgICAnVXNhZ2UgYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gIGlzIGRlcHJlY2F0ZWQsIHdoaWNoIHdpbGwgYmUgcmVtb3ZlZCBpbiAxMi4wLjAuIFBsZWFzZSBpbnN0ZWFkIHVzZSBgPG5nLXRlbXBsYXRlIG56TW9kYWxDb250ZW50PjwvbmctdGVtcGxhdGU+YCB0byBkZWNsYXJlIHRoZSBjb250ZW50IG9mIHRoZSBtb2RhbC4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21wb25lbnRDb25maWcubnpDb250ZW50ID0gdGhpcy5uekNvbnRlbnQgfHwgdGhpcy5jb250ZW50RnJvbUNvbnRlbnRDaGlsZDtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBvbmVudENvbmZpZztcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IG56VmlzaWJsZSwgLi4ub3RoZXJDaGFuZ2VzIH0gPSBjaGFuZ2VzO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKG90aGVyQ2hhbmdlcykubGVuZ3RoICYmIHRoaXMubW9kYWxSZWYpIHtcbiAgICAgIHRoaXMubW9kYWxSZWYudXBkYXRlQ29uZmlnKGdldENvbmZpZ0Zyb21Db21wb25lbnQodGhpcykpO1xuICAgIH1cblxuICAgIGlmIChuelZpc2libGUpIHtcbiAgICAgIGlmICh0aGlzLm56VmlzaWJsZSkge1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLm1vZGFsUmVmPy5fZmluaXNoRGlhbG9nQ2xvc2UoKTtcbiAgfVxufVxuIl19