/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { BACKSPACE, ESCAPE, TAB } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, forwardRef, Host, Injector, Input, Optional, Output, Renderer2, Self, TemplateRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { slideMotion } from 'ng-zorro-antd/core/animation';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { reqAnimFrame } from 'ng-zorro-antd/core/polyfill';
import { NzTreeBase, NzTreeHigherOrderServiceToken } from 'ng-zorro-antd/core/tree';
import { InputBoolean, isNotNil } from 'ng-zorro-antd/core/util';
import { NzSelectSearchComponent } from 'ng-zorro-antd/select';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { merge, of as observableOf, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { NzTreeSelectService } from './tree-select.service';
export function higherOrderServiceFactory(injector) {
    return injector.get(NzTreeSelectService);
}
const NZ_CONFIG_MODULE_NAME = 'treeSelect';
const TREE_SELECT_DEFAULT_CLASS = 'ant-select-dropdown ant-select-tree-dropdown';
export class NzTreeSelectComponent extends NzTreeBase {
    constructor(nzTreeService, nzConfigService, renderer, cdr, elementRef, directionality, focusMonitor, noAnimation) {
        super(nzTreeService);
        this.nzConfigService = nzConfigService;
        this.renderer = renderer;
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.directionality = directionality;
        this.focusMonitor = focusMonitor;
        this.noAnimation = noAnimation;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.nzId = null;
        this.nzAllowClear = true;
        this.nzShowExpand = true;
        this.nzShowLine = false;
        this.nzDropdownMatchSelectWidth = true;
        this.nzCheckable = false;
        this.nzHideUnMatched = false;
        this.nzShowIcon = false;
        this.nzShowSearch = false;
        this.nzDisabled = false;
        this.nzAsyncData = false;
        this.nzMultiple = false;
        this.nzDefaultExpandAll = false;
        this.nzCheckStrictly = false;
        this.nzVirtualItemSize = 28;
        this.nzVirtualMaxBufferPx = 500;
        this.nzVirtualMinBufferPx = 28;
        this.nzVirtualHeight = null;
        this.nzNodes = [];
        this.nzOpen = false;
        this.nzSize = 'default';
        this.nzPlaceHolder = '';
        this.nzDropdownStyle = null;
        this.nzDisplayWith = (node) => node.title;
        this.nzMaxTagPlaceholder = null;
        this.nzOpenChange = new EventEmitter();
        this.nzCleared = new EventEmitter();
        this.nzRemoved = new EventEmitter();
        this.nzExpandChange = new EventEmitter();
        this.nzTreeClick = new EventEmitter();
        this.nzTreeCheckBoxChange = new EventEmitter();
        this.dropdownClassName = TREE_SELECT_DEFAULT_CLASS;
        this.isComposing = false;
        this.isDestroy = true;
        this.isNotFound = false;
        this.focused = false;
        this.inputValue = '';
        this.dropDownPosition = 'bottom';
        this.selectedNodes = [];
        this.expandedKeys = [];
        this.value = [];
        this.dir = 'ltr';
        this.destroy$ = new Subject();
        this.onChange = _value => { };
        this.onTouched = () => { };
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-select');
        this.renderer.addClass(this.elementRef.nativeElement, 'ant-select');
        this.renderer.addClass(this.elementRef.nativeElement, 'ant-tree-select');
    }
    set nzExpandedKeys(value) {
        this.expandedKeys = value;
    }
    get nzExpandedKeys() {
        return this.expandedKeys;
    }
    get treeTemplate() {
        return this.nzTreeTemplate || this.nzTreeTemplateChild;
    }
    get placeHolderDisplay() {
        return this.inputValue || this.isComposing || this.selectedNodes.length ? 'none' : 'block';
    }
    get isMultiple() {
        return this.nzMultiple || this.nzCheckable;
    }
    ngOnInit() {
        var _a;
        this.isDestroy = false;
        this.selectionChangeSubscription = this.subscribeSelectionChange();
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
            this.dir = direction;
            this.cdr.detectChanges();
        });
        this.dir = this.directionality.value;
        this.focusChangeSubscription = this.focusMonitor.monitor(this.elementRef, true).subscribe(focusOrigin => {
            if (!focusOrigin) {
                this.focused = false;
                this.cdr.markForCheck();
                Promise.resolve().then(() => {
                    this.onTouched();
                });
            }
            else {
                this.focused = true;
                this.cdr.markForCheck();
            }
        });
    }
    ngOnDestroy() {
        this.isDestroy = true;
        this.closeDropDown();
        this.selectionChangeSubscription.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
        this.focusChangeSubscription.unsubscribe();
    }
    isComposingChange(isComposing) {
        this.isComposing = isComposing;
    }
    setDisabledState(isDisabled) {
        this.nzDisabled = isDisabled;
        this.closeDropDown();
    }
    ngOnChanges(changes) {
        const { nzNodes, nzDropdownClassName } = changes;
        if (nzNodes) {
            this.updateSelectedNodes(true);
        }
        if (nzDropdownClassName) {
            const className = this.nzDropdownClassName && this.nzDropdownClassName.trim();
            this.dropdownClassName = className ? `${TREE_SELECT_DEFAULT_CLASS} ${className}` : TREE_SELECT_DEFAULT_CLASS;
        }
    }
    writeValue(value) {
        if (isNotNil(value)) {
            if (this.isMultiple && Array.isArray(value)) {
                this.value = value;
            }
            else {
                this.value = [value];
            }
            this.updateSelectedNodes(true);
        }
        else {
            this.value = [];
            this.selectedNodes.forEach(node => {
                this.removeSelected(node, false);
            });
            this.selectedNodes = [];
        }
        this.cdr.markForCheck();
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    onKeydown(event) {
        if (this.nzDisabled) {
            return;
        }
        switch (event.keyCode) {
            case ESCAPE:
                /**
                 * Skip the ESCAPE processing, it will be handled in {@link onOverlayKeyDown}.
                 */
                break;
            case TAB:
                this.closeDropDown();
                break;
            default:
                if (!this.nzOpen) {
                    this.openDropdown();
                }
        }
    }
    trigger() {
        if (this.nzDisabled || (!this.nzDisabled && this.nzOpen)) {
            this.closeDropDown();
        }
        else {
            this.openDropdown();
        }
    }
    openDropdown() {
        if (!this.nzDisabled) {
            this.nzOpen = true;
            this.nzOpenChange.emit(this.nzOpen);
            this.updateCdkConnectedOverlayStatus();
            if (this.nzShowSearch || this.isMultiple) {
                this.focusOnInput();
            }
        }
    }
    closeDropDown() {
        this.onTouched();
        this.nzOpen = false;
        this.inputValue = '';
        this.isNotFound = false;
        this.nzOpenChange.emit(this.nzOpen);
        this.cdr.markForCheck();
    }
    onKeyDownInput(e) {
        const keyCode = e.keyCode;
        const eventTarget = e.target;
        if (this.isMultiple && !eventTarget.value && keyCode === BACKSPACE) {
            e.preventDefault();
            if (this.selectedNodes.length) {
                const removeNode = this.selectedNodes[this.selectedNodes.length - 1];
                this.removeSelected(removeNode);
            }
        }
    }
    onExpandedKeysChange(value) {
        this.nzExpandChange.emit(value);
        this.expandedKeys = [...value.keys];
    }
    setInputValue(value) {
        this.inputValue = value;
        this.updatePosition();
    }
    removeSelected(node, emit = true) {
        node.isSelected = false;
        node.isChecked = false;
        if (this.nzCheckable) {
            this.nzTreeService.conduct(node, this.nzCheckStrictly);
        }
        else {
            this.nzTreeService.setSelectedNodeList(node, this.nzMultiple);
        }
        if (emit) {
            this.nzRemoved.emit(node);
        }
    }
    focusOnInput() {
        if (this.nzSelectSearchComponent) {
            this.nzSelectSearchComponent.focus();
        }
    }
    subscribeSelectionChange() {
        return merge(this.nzTreeClick.pipe(tap((event) => {
            const node = event.node;
            if (this.nzCheckable && !node.isDisabled && !node.isDisableCheckbox) {
                node.isChecked = !node.isChecked;
                node.isHalfChecked = false;
                if (!this.nzCheckStrictly) {
                    this.nzTreeService.conduct(node);
                }
            }
            if (this.nzCheckable) {
                node.isSelected = false;
            }
        }), filter((event) => {
            const node = event.node;
            return this.nzCheckable ? !node.isDisabled && !node.isDisableCheckbox : !node.isDisabled && node.isSelectable;
        })), this.nzCheckable ? this.nzTreeCheckBoxChange : observableOf(), this.nzCleared, this.nzRemoved).subscribe(() => {
            this.updateSelectedNodes();
            const value = this.selectedNodes.map(node => node.key);
            this.value = [...value];
            if (this.nzShowSearch || this.isMultiple) {
                this.inputValue = '';
                this.isNotFound = false;
            }
            if (this.isMultiple) {
                this.onChange(value);
                this.focusOnInput();
                this.updatePosition();
            }
            else {
                this.closeDropDown();
                this.onChange(value.length ? value[0] : null);
            }
        });
    }
    updateSelectedNodes(init = false) {
        if (init) {
            const nodes = this.coerceTreeNodes(this.nzNodes);
            this.nzTreeService.isMultiple = this.isMultiple;
            this.nzTreeService.isCheckStrictly = this.nzCheckStrictly;
            this.nzTreeService.initTree(nodes);
            if (this.nzCheckable) {
                this.nzTreeService.conductCheck(this.value, this.nzCheckStrictly);
            }
            else {
                this.nzTreeService.conductSelectedKeys(this.value, this.isMultiple);
            }
        }
        this.selectedNodes = [...(this.nzCheckable ? this.getCheckedNodeList() : this.getSelectedNodeList())];
    }
    updatePosition() {
        reqAnimFrame(() => {
            var _a, _b;
            (_b = (_a = this.cdkConnectedOverlay) === null || _a === void 0 ? void 0 : _a.overlayRef) === null || _b === void 0 ? void 0 : _b.updatePosition();
        });
    }
    onPositionChange(position) {
        this.dropDownPosition = position.connectionPair.originY;
    }
    onClearSelection() {
        this.selectedNodes.forEach(node => {
            this.removeSelected(node, false);
        });
        this.nzCleared.emit();
    }
    onClickOutside(event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.closeDropDown();
        }
    }
    setSearchValues($event) {
        Promise.resolve().then(() => {
            this.isNotFound = (this.nzShowSearch || this.isMultiple) && !!this.inputValue && $event.matchedKeys.length === 0;
        });
    }
    updateCdkConnectedOverlayStatus() {
        this.triggerWidth = this.cdkOverlayOrigin.elementRef.nativeElement.getBoundingClientRect().width;
    }
    trackValue(_index, option) {
        return option.key;
    }
}
NzTreeSelectComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-tree-select',
                exportAs: 'nzTreeSelect',
                animations: [slideMotion],
                template: `
    <ng-template
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayOrigin]="cdkOverlayOrigin"
      [cdkConnectedOverlayOpen]="nzOpen"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-select-tree-dropdown'"
      [cdkConnectedOverlayMinWidth]="$any(nzDropdownMatchSelectWidth ? null : triggerWidth)"
      [cdkConnectedOverlayWidth]="$any(nzDropdownMatchSelectWidth ? triggerWidth : null)"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="closeDropDown()"
      (positionChange)="onPositionChange($event)"
    >
      <div
        [@slideMotion]="'enter'"
        [ngClass]="dropdownClassName"
        [@.disabled]="noAnimation?.nzNoAnimation"
        [nzNoAnimation]="noAnimation?.nzNoAnimation"
        [class.ant-select-dropdown-placement-bottomLeft]="dropDownPosition === 'bottom'"
        [class.ant-select-dropdown-placement-topLeft]="dropDownPosition === 'top'"
        [class.ant-tree-select-dropdown-rtl]="dir === 'rtl'"
        [dir]="dir"
        [ngStyle]="nzDropdownStyle"
      >
        <nz-tree
          #treeRef
          [hidden]="isNotFound"
          nzNoAnimation
          nzSelectMode
          nzBlockNode
          [nzData]="nzNodes"
          [nzMultiple]="nzMultiple"
          [nzSearchValue]="inputValue"
          [nzHideUnMatched]="nzHideUnMatched"
          [nzShowIcon]="nzShowIcon"
          [nzCheckable]="nzCheckable"
          [nzAsyncData]="nzAsyncData"
          [nzShowExpand]="nzShowExpand"
          [nzShowLine]="nzShowLine"
          [nzExpandedIcon]="nzExpandedIcon"
          [nzExpandAll]="nzDefaultExpandAll"
          [nzExpandedKeys]="expandedKeys"
          [nzCheckedKeys]="nzCheckable ? value : []"
          [nzSelectedKeys]="!nzCheckable ? value : []"
          [nzTreeTemplate]="treeTemplate"
          [nzCheckStrictly]="nzCheckStrictly"
          [nzVirtualItemSize]="nzVirtualItemSize"
          [nzVirtualMaxBufferPx]="nzVirtualMaxBufferPx"
          [nzVirtualMinBufferPx]="nzVirtualMinBufferPx"
          [nzVirtualHeight]="nzVirtualHeight"
          (nzExpandChange)="onExpandedKeysChange($event)"
          (nzClick)="nzTreeClick.emit($event)"
          (nzCheckedKeysChange)="updateSelectedNodes()"
          (nzSelectedKeysChange)="updateSelectedNodes()"
          (nzCheckBoxChange)="nzTreeCheckBoxChange.emit($event)"
          (nzSearchValueChange)="setSearchValues($event)"
        ></nz-tree>
        <span *ngIf="nzNodes.length === 0 || isNotFound" class="ant-select-not-found">
          <nz-embed-empty [nzComponentName]="'tree-select'" [specificContent]="nzNotFoundContent"></nz-embed-empty>
        </span>
      </div>
    </ng-template>

    <div cdkOverlayOrigin class="ant-select-selector">
      <ng-container *ngIf="isMultiple">
        <nz-select-item
          *ngFor="let node of selectedNodes | slice: 0:nzMaxTagCount; trackBy: trackValue"
          [deletable]="true"
          [disabled]="node.isDisabled || nzDisabled"
          [label]="nzDisplayWith(node)"
          (delete)="removeSelected(node, true)"
        ></nz-select-item>

        <nz-select-item
          *ngIf="selectedNodes.length > nzMaxTagCount"
          [contentTemplateOutlet]="nzMaxTagPlaceholder"
          [contentTemplateOutletContext]="selectedNodes | slice: nzMaxTagCount"
          [deletable]="false"
          [disabled]="false"
          [label]="'+ ' + (selectedNodes.length - nzMaxTagCount) + ' ...'"
        ></nz-select-item>
      </ng-container>

      <nz-select-search
        [nzId]="nzId"
        [showInput]="nzShowSearch"
        (keydown)="onKeyDownInput($event)"
        (isComposingChange)="isComposing = $event"
        (valueChange)="setInputValue($event)"
        [value]="inputValue"
        [mirrorSync]="isMultiple"
        [disabled]="nzDisabled"
        [focusTrigger]="nzOpen"
      ></nz-select-search>

      <nz-select-placeholder
        *ngIf="nzPlaceHolder && selectedNodes.length === 0"
        [placeholder]="nzPlaceHolder"
        [style.display]="placeHolderDisplay"
      ></nz-select-placeholder>

      <nz-select-item
        *ngIf="!isMultiple && selectedNodes.length === 1 && !isComposing && inputValue === ''"
        [deletable]="false"
        [disabled]="false"
        [label]="nzDisplayWith(selectedNodes[0])"
      ></nz-select-item>

      <nz-select-arrow *ngIf="!isMultiple"></nz-select-arrow>

      <nz-select-clear *ngIf="nzAllowClear && !nzDisabled && selectedNodes.length" (clear)="onClearSelection()"></nz-select-clear>
    </div>
  `,
                providers: [
                    NzTreeSelectService,
                    {
                        provide: NzTreeHigherOrderServiceToken,
                        useFactory: higherOrderServiceFactory,
                        deps: [[new Self(), Injector]]
                    },
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NzTreeSelectComponent),
                        multi: true
                    }
                ],
                host: {
                    '[class.ant-select-lg]': 'nzSize==="large"',
                    '[class.ant-select-rtl]': 'dir==="rtl"',
                    '[class.ant-select-sm]': 'nzSize==="small"',
                    '[class.ant-select-disabled]': 'nzDisabled',
                    '[class.ant-select-single]': '!isMultiple',
                    '[class.ant-select-show-arrow]': '!isMultiple',
                    '[class.ant-select-show-search]': '!isMultiple',
                    '[class.ant-select-multiple]': 'isMultiple',
                    '[class.ant-select-allow-clear]': 'nzAllowClear',
                    '[class.ant-select-open]': 'nzOpen',
                    '[class.ant-select-focused]': 'nzOpen || focused',
                    '(click)': 'trigger()',
                    '(keydown)': 'onKeydown($event)'
                }
            },] }
];
NzTreeSelectComponent.ctorParameters = () => [
    { type: NzTreeSelectService },
    { type: NzConfigService },
    { type: Renderer2 },
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: FocusMonitor },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
NzTreeSelectComponent.propDecorators = {
    nzId: [{ type: Input }],
    nzAllowClear: [{ type: Input }],
    nzShowExpand: [{ type: Input }],
    nzShowLine: [{ type: Input }],
    nzDropdownMatchSelectWidth: [{ type: Input }],
    nzCheckable: [{ type: Input }],
    nzHideUnMatched: [{ type: Input }],
    nzShowIcon: [{ type: Input }],
    nzShowSearch: [{ type: Input }],
    nzDisabled: [{ type: Input }],
    nzAsyncData: [{ type: Input }],
    nzMultiple: [{ type: Input }],
    nzDefaultExpandAll: [{ type: Input }],
    nzCheckStrictly: [{ type: Input }],
    nzVirtualItemSize: [{ type: Input }],
    nzVirtualMaxBufferPx: [{ type: Input }],
    nzVirtualMinBufferPx: [{ type: Input }],
    nzVirtualHeight: [{ type: Input }],
    nzExpandedIcon: [{ type: Input }],
    nzNotFoundContent: [{ type: Input }],
    nzNodes: [{ type: Input }],
    nzOpen: [{ type: Input }],
    nzSize: [{ type: Input }],
    nzPlaceHolder: [{ type: Input }],
    nzDropdownStyle: [{ type: Input }],
    nzDropdownClassName: [{ type: Input }],
    nzExpandedKeys: [{ type: Input }],
    nzDisplayWith: [{ type: Input }],
    nzMaxTagCount: [{ type: Input }],
    nzMaxTagPlaceholder: [{ type: Input }],
    nzOpenChange: [{ type: Output }],
    nzCleared: [{ type: Output }],
    nzRemoved: [{ type: Output }],
    nzExpandChange: [{ type: Output }],
    nzTreeClick: [{ type: Output }],
    nzTreeCheckBoxChange: [{ type: Output }],
    nzSelectSearchComponent: [{ type: ViewChild, args: [NzSelectSearchComponent, { static: false },] }],
    treeRef: [{ type: ViewChild, args: ['treeRef', { static: false },] }],
    cdkOverlayOrigin: [{ type: ViewChild, args: [CdkOverlayOrigin, { static: true },] }],
    cdkConnectedOverlay: [{ type: ViewChild, args: [CdkConnectedOverlay, { static: false },] }],
    nzTreeTemplate: [{ type: Input }],
    nzTreeTemplateChild: [{ type: ContentChild, args: ['nzTreeTemplate', { static: true },] }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzTreeSelectComponent.prototype, "nzAllowClear", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzTreeSelectComponent.prototype, "nzShowExpand", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzTreeSelectComponent.prototype, "nzShowLine", void 0);
__decorate([
    InputBoolean(),
    WithConfig(),
    __metadata("design:type", Boolean)
], NzTreeSelectComponent.prototype, "nzDropdownMatchSelectWidth", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzTreeSelectComponent.prototype, "nzCheckable", void 0);
__decorate([
    InputBoolean(),
    WithConfig(),
    __metadata("design:type", Boolean)
], NzTreeSelectComponent.prototype, "nzHideUnMatched", void 0);
__decorate([
    InputBoolean(),
    WithConfig(),
    __metadata("design:type", Boolean)
], NzTreeSelectComponent.prototype, "nzShowIcon", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzTreeSelectComponent.prototype, "nzShowSearch", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTreeSelectComponent.prototype, "nzDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTreeSelectComponent.prototype, "nzAsyncData", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTreeSelectComponent.prototype, "nzMultiple", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTreeSelectComponent.prototype, "nzDefaultExpandAll", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTreeSelectComponent.prototype, "nzCheckStrictly", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzTreeSelectComponent.prototype, "nzSize", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1zZWxlY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tcG9uZW50cy90cmVlLXNlbGVjdC90cmVlLXNlbGVjdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVqRCxPQUFPLEVBQWEsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDL0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFrQyxNQUFNLHNCQUFzQixDQUFDO0FBQzdHLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixJQUFJLEVBQ0osUUFBUSxFQUNSLEtBQUssRUFJTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxJQUFJLEVBRUosV0FBVyxFQUNYLFNBQVMsRUFDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzNELE9BQU8sRUFBZSxlQUFlLEVBQUUsVUFBVSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDckYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRTNELE9BQU8sRUFFTCxVQUFVLEVBRVYsNkJBQTZCLEVBRzlCLE1BQU0seUJBQXlCLENBQUM7QUFFakMsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztB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ZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQgeyBGb2N1c01vbml0b3IgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5cbmltcG9ydCB7IERpcmVjdGlvbiwgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBCQUNLU1BBQ0UsIEVTQ0FQRSwgVEFCIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7IENka0Nvbm5lY3RlZE92ZXJsYXksIENka092ZXJsYXlPcmlnaW4sIENvbm5lY3RlZE92ZXJsYXlQb3NpdGlvbkNoYW5nZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0LFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgU2VsZixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IHNsaWRlTW90aW9uIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2FuaW1hdGlvbic7XG5pbXBvcnQgeyBOekNvbmZpZ0tleSwgTnpDb25maWdTZXJ2aWNlLCBXaXRoQ29uZmlnIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2NvbmZpZyc7XG5pbXBvcnQgeyBOek5vQW5pbWF0aW9uRGlyZWN0aXZlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL25vLWFuaW1hdGlvbic7XG5pbXBvcnQgeyByZXFBbmltRnJhbWUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvcG9seWZpbGwnO1xuXG5pbXBvcnQge1xuICBOekZvcm1hdEVtaXRFdmVudCxcbiAgTnpUcmVlQmFzZSxcbiAgTnpUcmVlQmFzZVNlcnZpY2UsXG4gIE56VHJlZUhpZ2hlck9yZGVyU2VydmljZVRva2VuLFxuICBOelRyZWVOb2RlLFxuICBOelRyZWVOb2RlT3B0aW9uc1xufSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHJlZSc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIE5nU3R5bGVJbnRlcmZhY2UsIE56U2l6ZUxEU1R5cGUsIE9uQ2hhbmdlVHlwZSwgT25Ub3VjaGVkVHlwZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS90eXBlcyc7XG5pbXBvcnQgeyBJbnB1dEJvb2xlYW4sIGlzTm90TmlsIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuaW1wb3J0IHsgTnpTZWxlY3RTZWFyY2hDb21wb25lbnQgfSBmcm9tICduZy16b3Jyby1hbnRkL3NlbGVjdCc7XG5pbXBvcnQgeyBOelRyZWVDb21wb25lbnQgfSBmcm9tICduZy16b3Jyby1hbnRkL3RyZWUnO1xuXG5pbXBvcnQgeyBtZXJnZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgdGFrZVVudGlsLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBOelRyZWVTZWxlY3RTZXJ2aWNlIH0gZnJvbSAnLi90cmVlLXNlbGVjdC5zZXJ2aWNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGhpZ2hlck9yZGVyU2VydmljZUZhY3RvcnkoaW5qZWN0b3I6IEluamVjdG9yKTogTnpUcmVlQmFzZVNlcnZpY2Uge1xuICByZXR1cm4gaW5qZWN0b3IuZ2V0KE56VHJlZVNlbGVjdFNlcnZpY2UpO1xufVxuXG5jb25zdCBOWl9DT05GSUdfTU9EVUxFX05BTUU6IE56Q29uZmlnS2V5ID0gJ3RyZWVTZWxlY3QnO1xuY29uc3QgVFJFRV9TRUxFQ1RfREVGQVVMVF9DTEFTUyA9ICdhbnQtc2VsZWN0LWRyb3Bkb3duIGFudC1zZWxlY3QtdHJlZS1kcm9wZG93bic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ256LXRyZWUtc2VsZWN0JyxcbiAgZXhwb3J0QXM6ICduelRyZWVTZWxlY3QnLFxuICBhbmltYXRpb25zOiBbc2xpZGVNb3Rpb25dLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgY2RrQ29ubmVjdGVkT3ZlcmxheVxuICAgICAgbnpDb25uZWN0ZWRPdmVybGF5XG4gICAgICBbY2RrQ29ubmVjdGVkT3ZlcmxheU9yaWdpbl09XCJjZGtPdmVybGF5T3JpZ2luXCJcbiAgICAgIFtjZGtDb25uZWN0ZWRPdmVybGF5T3Blbl09XCJuek9wZW5cIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlUcmFuc2Zvcm1PcmlnaW5Pbl09XCInLmFudC1zZWxlY3QtdHJlZS1kcm9wZG93bidcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlNaW5XaWR0aF09XCIkYW55KG56RHJvcGRvd25NYXRjaFNlbGVjdFdpZHRoID8gbnVsbCA6IHRyaWdnZXJXaWR0aClcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlXaWR0aF09XCIkYW55KG56RHJvcGRvd25NYXRjaFNlbGVjdFdpZHRoID8gdHJpZ2dlcldpZHRoIDogbnVsbClcIlxuICAgICAgKG92ZXJsYXlPdXRzaWRlQ2xpY2spPVwib25DbGlja091dHNpZGUoJGV2ZW50KVwiXG4gICAgICAoZGV0YWNoKT1cImNsb3NlRHJvcERvd24oKVwiXG4gICAgICAocG9zaXRpb25DaGFuZ2UpPVwib25Qb3NpdGlvbkNoYW5nZSgkZXZlbnQpXCJcbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIFtAc2xpZGVNb3Rpb25dPVwiJ2VudGVyJ1wiXG4gICAgICAgIFtuZ0NsYXNzXT1cImRyb3Bkb3duQ2xhc3NOYW1lXCJcbiAgICAgICAgW0AuZGlzYWJsZWRdPVwibm9BbmltYXRpb24/Lm56Tm9BbmltYXRpb25cIlxuICAgICAgICBbbnpOb0FuaW1hdGlvbl09XCJub0FuaW1hdGlvbj8ubnpOb0FuaW1hdGlvblwiXG4gICAgICAgIFtjbGFzcy5hbnQtc2VsZWN0LWRyb3Bkb3duLXBsYWNlbWVudC1ib3R0b21MZWZ0XT1cImRyb3BEb3duUG9zaXRpb24gPT09ICdib3R0b20nXCJcbiAgICAgICAgW2NsYXNzLmFudC1zZWxlY3QtZHJvcGRvd24tcGxhY2VtZW50LXRvcExlZnRdPVwiZHJvcERvd25Qb3NpdGlvbiA9PT0gJ3RvcCdcIlxuICAgICAgICBbY2xhc3MuYW50LXRyZWUtc2VsZWN0LWRyb3Bkb3duLXJ0bF09XCJkaXIgPT09ICdydGwnXCJcbiAgICAgICAgW2Rpcl09XCJkaXJcIlxuICAgICAgICBbbmdTdHlsZV09XCJuekRyb3Bkb3duU3R5bGVcIlxuICAgICAgPlxuICAgICAgICA8bnotdHJlZVxuICAgICAgICAgICN0cmVlUmVmXG4gICAgICAgICAgW2hpZGRlbl09XCJpc05vdEZvdW5kXCJcbiAgICAgICAgICBuek5vQW5pbWF0aW9uXG4gICAgICAgICAgbnpTZWxlY3RNb2RlXG4gICAgICAgICAgbnpCbG9ja05vZGVcbiAgICAgICAgICBbbnpEYXRhXT1cIm56Tm9kZXNcIlxuICAgICAgICAgIFtuek11bHRpcGxlXT1cIm56TXVsdGlwbGVcIlxuICAgICAgICAgIFtuelNlYXJjaFZhbHVlXT1cImlucHV0VmFsdWVcIlxuICAgICAgICAgIFtuekhpZGVVbk1hdGNoZWRdPVwibnpIaWRlVW5NYXRjaGVkXCJcbiAgICAgICAgICBbbnpTaG93SWNvbl09XCJuelNob3dJY29uXCJcbiAgICAgICAgICBbbnpDaGVja2FibGVdPVwibnpDaGVja2FibGVcIlxuICAgICAgICAgIFtuekFzeW5jRGF0YV09XCJuekFzeW5jRGF0YVwiXG4gICAgICAgICAgW256U2hvd0V4cGFuZF09XCJuelNob3dFeHBhbmRcIlxuICAgICAgICAgIFtuelNob3dMaW5lXT1cIm56U2hvd0xpbmVcIlxuICAgICAgICAgIFtuekV4cGFuZGVkSWNvbl09XCJuekV4cGFuZGVkSWNvblwiXG4gICAgICAgICAgW256RXhwYW5kQWxsXT1cIm56RGVmYXVsdEV4cGFuZEFsbFwiXG4gICAgICAgICAgW256RXhwYW5kZWRLZXlzXT1cImV4cGFuZGVkS2V5c1wiXG4gICAgICAgICAgW256Q2hlY2tlZEtleXNdPVwibnpDaGVja2FibGUgPyB2YWx1ZSA6IFtdXCJcbiAgICAgICAgICBbbnpTZWxlY3RlZEtleXNdPVwiIW56Q2hlY2thYmxlID8gdmFsdWUgOiBbXVwiXG4gICAgICAgICAgW256VHJlZVRlbXBsYXRlXT1cInRyZWVUZW1wbGF0ZVwiXG4gICAgICAgICAgW256Q2hlY2tTdHJpY3RseV09XCJuekNoZWNrU3RyaWN0bHlcIlxuICAgICAgICAgIFtuelZpcnR1YWxJdGVtU2l6ZV09XCJuelZpcnR1YWxJdGVtU2l6ZVwiXG4gICAgICAgICAgW256VmlydHVhbE1heEJ1ZmZlclB4XT1cIm56VmlydHVhbE1heEJ1ZmZlclB4XCJcbiAgICAgICAgICBbbnpWaXJ0dWFsTWluQnVmZmVyUHhdPVwibnpWaXJ0dWFsTWluQnVmZmVyUHhcIlxuICAgICAgICAgIFtuelZpcnR1YWxIZWlnaHRdPVwibnpWaXJ0dWFsSGVpZ2h0XCJcbiAgICAgICAgICAobnpFeHBhbmRDaGFuZ2UpPVwib25FeHBhbmRlZEtleXNDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgKG56Q2xpY2spPVwibnpUcmVlQ2xpY2suZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAobnpDaGVja2VkS2V5c0NoYW5nZSk9XCJ1cGRhdGVTZWxlY3RlZE5vZGVzKClcIlxuICAgICAgICAgIChuelNlbGVjdGVkS2V5c0NoYW5nZSk9XCJ1cGRhdGVTZWxlY3RlZE5vZGVzKClcIlxuICAgICAgICAgIChuekNoZWNrQm94Q2hhbmdlKT1cIm56VHJlZUNoZWNrQm94Q2hhbmdlLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgKG56U2VhcmNoVmFsdWVDaGFuZ2UpPVwic2V0U2VhcmNoVmFsdWVzKCRldmVudClcIlxuICAgICAgICA+PC9uei10cmVlPlxuICAgICAgICA8c3BhbiAqbmdJZj1cIm56Tm9kZXMubGVuZ3RoID09PSAwIHx8IGlzTm90Rm91bmRcIiBjbGFzcz1cImFudC1zZWxlY3Qtbm90LWZvdW5kXCI+XG4gICAgICAgICAgPG56LWVtYmVkLWVtcHR5IFtuekNvbXBvbmVudE5hbWVdPVwiJ3RyZWUtc2VsZWN0J1wiIFtzcGVjaWZpY0NvbnRlbnRdPVwibnpOb3RGb3VuZENvbnRlbnRcIj48L256LWVtYmVkLWVtcHR5PlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgPGRpdiBjZGtPdmVybGF5T3JpZ2luIGNsYXNzPVwiYW50LXNlbGVjdC1zZWxlY3RvclwiPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImlzTXVsdGlwbGVcIj5cbiAgICAgICAgPG56LXNlbGVjdC1pdGVtXG4gICAgICAgICAgKm5nRm9yPVwibGV0IG5vZGUgb2Ygc2VsZWN0ZWROb2RlcyB8IHNsaWNlOiAwOm56TWF4VGFnQ291bnQ7IHRyYWNrQnk6IHRyYWNrVmFsdWVcIlxuICAgICAgICAgIFtkZWxldGFibGVdPVwidHJ1ZVwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cIm5vZGUuaXNEaXNhYmxlZCB8fCBuekRpc2FibGVkXCJcbiAgICAgICAgICBbbGFiZWxdPVwibnpEaXNwbGF5V2l0aChub2RlKVwiXG4gICAgICAgICAgKGRlbGV0ZSk9XCJyZW1vdmVTZWxlY3RlZChub2RlLCB0cnVlKVwiXG4gICAgICAgID48L256LXNlbGVjdC1pdGVtPlxuXG4gICAgICAgIDxuei1zZWxlY3QtaXRlbVxuICAgICAgICAgICpuZ0lmPVwic2VsZWN0ZWROb2Rlcy5sZW5ndGggPiBuek1heFRhZ0NvdW50XCJcbiAgICAgICAgICBbY29udGVudFRlbXBsYXRlT3V0bGV0XT1cIm56TWF4VGFnUGxhY2Vob2xkZXJcIlxuICAgICAgICAgIFtjb250ZW50VGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInNlbGVjdGVkTm9kZXMgfCBzbGljZTogbnpNYXhUYWdDb3VudFwiXG4gICAgICAgICAgW2RlbGV0YWJsZV09XCJmYWxzZVwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cImZhbHNlXCJcbiAgICAgICAgICBbbGFiZWxdPVwiJysgJyArIChzZWxlY3RlZE5vZGVzLmxlbmd0aCAtIG56TWF4VGFnQ291bnQpICsgJyAuLi4nXCJcbiAgICAgICAgPjwvbnotc2VsZWN0LWl0ZW0+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cblxuICAgICAgPG56LXNlbGVjdC1zZWFyY2hcbiAgICAgICAgW256SWRdPVwibnpJZFwiXG4gICAgICAgIFtzaG93SW5wdXRdPVwibnpTaG93U2VhcmNoXCJcbiAgICAgICAgKGtleWRvd24pPVwib25LZXlEb3duSW5wdXQoJGV2ZW50KVwiXG4gICAgICAgIChpc0NvbXBvc2luZ0NoYW5nZSk9XCJpc0NvbXBvc2luZyA9ICRldmVudFwiXG4gICAgICAgICh2YWx1ZUNoYW5nZSk9XCJzZXRJbnB1dFZhbHVlKCRldmVudClcIlxuICAgICAgICBbdmFsdWVdPVwiaW5wdXRWYWx1ZVwiXG4gICAgICAgIFttaXJyb3JTeW5jXT1cImlzTXVsdGlwbGVcIlxuICAgICAgICBbZGlzYWJsZWRdPVwibnpEaXNhYmxlZFwiXG4gICAgICAgIFtmb2N1c1RyaWdnZXJdPVwibnpPcGVuXCJcbiAgICAgID48L256LXNlbGVjdC1zZWFyY2g+XG5cbiAgICAgIDxuei1zZWxlY3QtcGxhY2Vob2xkZXJcbiAgICAgICAgKm5nSWY9XCJuelBsYWNlSG9sZGVyICYmIHNlbGVjdGVkTm9kZXMubGVuZ3RoID09PSAwXCJcbiAgICAgICAgW3BsYWNlaG9sZGVyXT1cIm56UGxhY2VIb2xkZXJcIlxuICAgICAgICBbc3R5bGUuZGlzcGxheV09XCJwbGFjZUhvbGRlckRpc3BsYXlcIlxuICAgICAgPjwvbnotc2VsZWN0LXBsYWNlaG9sZGVyPlxuXG4gICAgICA8bnotc2VsZWN0LWl0ZW1cbiAgICAgICAgKm5nSWY9XCIhaXNNdWx0aXBsZSAmJiBzZWxlY3RlZE5vZGVzLmxlbmd0aCA9PT0gMSAmJiAhaXNDb21wb3NpbmcgJiYgaW5wdXRWYWx1ZSA9PT0gJydcIlxuICAgICAgICBbZGVsZXRhYmxlXT1cImZhbHNlXCJcbiAgICAgICAgW2Rpc2FibGVkXT1cImZhbHNlXCJcbiAgICAgICAgW2xhYmVsXT1cIm56RGlzcGxheVdpdGgoc2VsZWN0ZWROb2Rlc1swXSlcIlxuICAgICAgPjwvbnotc2VsZWN0LWl0ZW0+XG5cbiAgICAgIDxuei1zZWxlY3QtYXJyb3cgKm5nSWY9XCIhaXNNdWx0aXBsZVwiPjwvbnotc2VsZWN0LWFycm93PlxuXG4gICAgICA8bnotc2VsZWN0LWNsZWFyICpuZ0lmPVwibnpBbGxvd0NsZWFyICYmICFuekRpc2FibGVkICYmIHNlbGVjdGVkTm9kZXMubGVuZ3RoXCIgKGNsZWFyKT1cIm9uQ2xlYXJTZWxlY3Rpb24oKVwiPjwvbnotc2VsZWN0LWNsZWFyPlxuICAgIDwvZGl2PlxuICBgLFxuICBwcm92aWRlcnM6IFtcbiAgICBOelRyZWVTZWxlY3RTZXJ2aWNlLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE56VHJlZUhpZ2hlck9yZGVyU2VydmljZVRva2VuLFxuICAgICAgdXNlRmFjdG9yeTogaGlnaGVyT3JkZXJTZXJ2aWNlRmFjdG9yeSxcbiAgICAgIGRlcHM6IFtbbmV3IFNlbGYoKSwgSW5qZWN0b3JdXVxuICAgIH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOelRyZWVTZWxlY3RDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmFudC1zZWxlY3QtbGddJzogJ256U2l6ZT09PVwibGFyZ2VcIicsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LXJ0bF0nOiAnZGlyPT09XCJydGxcIicsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LXNtXSc6ICduelNpemU9PT1cInNtYWxsXCInLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1kaXNhYmxlZF0nOiAnbnpEaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LXNpbmdsZV0nOiAnIWlzTXVsdGlwbGUnLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1zaG93LWFycm93XSc6ICchaXNNdWx0aXBsZScsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LXNob3ctc2VhcmNoXSc6ICchaXNNdWx0aXBsZScsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LW11bHRpcGxlXSc6ICdpc011bHRpcGxlJyxcbiAgICAnW2NsYXNzLmFudC1zZWxlY3QtYWxsb3ctY2xlYXJdJzogJ256QWxsb3dDbGVhcicsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LW9wZW5dJzogJ256T3BlbicsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LWZvY3VzZWRdJzogJ256T3BlbiB8fCBmb2N1c2VkJyxcbiAgICAnKGNsaWNrKSc6ICd0cmlnZ2VyKCknLFxuICAgICcoa2V5ZG93biknOiAnb25LZXlkb3duKCRldmVudCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTnpUcmVlU2VsZWN0Q29tcG9uZW50IGV4dGVuZHMgTnpUcmVlQmFzZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgcmVhZG9ubHkgX256TW9kdWxlTmFtZTogTnpDb25maWdLZXkgPSBOWl9DT05GSUdfTU9EVUxFX05BTUU7XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256QWxsb3dDbGVhcjogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpTaG93RXhwYW5kOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uelNob3dMaW5lOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekRyb3Bkb3duTWF0Y2hTZWxlY3RXaWR0aDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpDaGVja2FibGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256SGlkZVVuTWF0Y2hlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpTaG93SWNvbjogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpTaG93U2VhcmNoOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekRpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekFzeW5jRGF0YTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpNdWx0aXBsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpEZWZhdWx0RXhwYW5kQWxsOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekNoZWNrU3RyaWN0bHk6IEJvb2xlYW5JbnB1dDtcblxuICBASW5wdXQoKSBueklkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56QWxsb3dDbGVhcjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuelNob3dFeHBhbmQ6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpTaG93TGluZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgQFdpdGhDb25maWcoKSBuekRyb3Bkb3duTWF0Y2hTZWxlY3RXaWR0aDogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekNoZWNrYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgQFdpdGhDb25maWcoKSBuekhpZGVVbk1hdGNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIEBXaXRoQ29uZmlnKCkgbnpTaG93SWNvbjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpTaG93U2VhcmNoOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekRpc2FibGVkID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekFzeW5jRGF0YSA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpNdWx0aXBsZSA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpEZWZhdWx0RXhwYW5kQWxsID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekNoZWNrU3RyaWN0bHkgPSBmYWxzZTtcbiAgQElucHV0KCkgbnpWaXJ0dWFsSXRlbVNpemUgPSAyODtcbiAgQElucHV0KCkgbnpWaXJ0dWFsTWF4QnVmZmVyUHggPSA1MDA7XG4gIEBJbnB1dCgpIG56VmlydHVhbE1pbkJ1ZmZlclB4ID0gMjg7XG4gIEBJbnB1dCgpIG56VmlydHVhbEhlaWdodDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIG56RXhwYW5kZWRJY29uPzogVGVtcGxhdGVSZWY8eyAkaW1wbGljaXQ6IE56VHJlZU5vZGU7IG9yaWdpbjogTnpUcmVlTm9kZU9wdGlvbnMgfT47XG4gIEBJbnB1dCgpIG56Tm90Rm91bmRDb250ZW50Pzogc3RyaW5nO1xuICBASW5wdXQoKSBuek5vZGVzOiBBcnJheTxOelRyZWVOb2RlIHwgTnpUcmVlTm9kZU9wdGlvbnM+ID0gW107XG4gIEBJbnB1dCgpIG56T3BlbiA9IGZhbHNlO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZygpIG56U2l6ZTogTnpTaXplTERTVHlwZSA9ICdkZWZhdWx0JztcbiAgQElucHV0KCkgbnpQbGFjZUhvbGRlciA9ICcnO1xuICBASW5wdXQoKSBuekRyb3Bkb3duU3R5bGU6IE5nU3R5bGVJbnRlcmZhY2UgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpEcm9wZG93bkNsYXNzTmFtZT86IHN0cmluZztcbiAgQElucHV0KClcbiAgc2V0IG56RXhwYW5kZWRLZXlzKHZhbHVlOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuZXhwYW5kZWRLZXlzID0gdmFsdWU7XG4gIH1cbiAgZ2V0IG56RXhwYW5kZWRLZXlzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbmRlZEtleXM7XG4gIH1cblxuICBASW5wdXQoKSBuekRpc3BsYXlXaXRoOiAobm9kZTogTnpUcmVlTm9kZSkgPT4gc3RyaW5nIHwgdW5kZWZpbmVkID0gKG5vZGU6IE56VHJlZU5vZGUpID0+IG5vZGUudGl0bGU7XG4gIEBJbnB1dCgpIG56TWF4VGFnQ291bnQhOiBudW1iZXI7XG4gIEBJbnB1dCgpIG56TWF4VGFnUGxhY2Vob2xkZXI6IFRlbXBsYXRlUmVmPHsgJGltcGxpY2l0OiBOelRyZWVOb2RlW10gfT4gfCBudWxsID0gbnVsbDtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56T3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56Q2xlYXJlZCA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56UmVtb3ZlZCA9IG5ldyBFdmVudEVtaXR0ZXI8TnpUcmVlTm9kZT4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56RXhwYW5kQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxOekZvcm1hdEVtaXRFdmVudD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56VHJlZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxOekZvcm1hdEVtaXRFdmVudD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56VHJlZUNoZWNrQm94Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxOekZvcm1hdEVtaXRFdmVudD4oKTtcblxuICBAVmlld0NoaWxkKE56U2VsZWN0U2VhcmNoQ29tcG9uZW50LCB7IHN0YXRpYzogZmFsc2UgfSkgbnpTZWxlY3RTZWFyY2hDb21wb25lbnQhOiBOelNlbGVjdFNlYXJjaENvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgndHJlZVJlZicsIHsgc3RhdGljOiBmYWxzZSB9KSB0cmVlUmVmITogTnpUcmVlQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKENka092ZXJsYXlPcmlnaW4sIHsgc3RhdGljOiB0cnVlIH0pIGNka092ZXJsYXlPcmlnaW4hOiBDZGtPdmVybGF5T3JpZ2luO1xuICBAVmlld0NoaWxkKENka0Nvbm5lY3RlZE92ZXJsYXksIHsgc3RhdGljOiBmYWxzZSB9KSBjZGtDb25uZWN0ZWRPdmVybGF5ITogQ2RrQ29ubmVjdGVkT3ZlcmxheTtcblxuICBASW5wdXQoKSBuelRyZWVUZW1wbGF0ZSE6IFRlbXBsYXRlUmVmPHsgJGltcGxpY2l0OiBOelRyZWVOb2RlOyBvcmlnaW46IE56VHJlZU5vZGVPcHRpb25zIH0+O1xuICBAQ29udGVudENoaWxkKCduelRyZWVUZW1wbGF0ZScsIHsgc3RhdGljOiB0cnVlIH0pIG56VHJlZVRlbXBsYXRlQ2hpbGQhOiBUZW1wbGF0ZVJlZjx7ICRpbXBsaWNpdDogTnpUcmVlTm9kZTsgb3JpZ2luOiBOelRyZWVOb2RlT3B0aW9ucyB9PjtcbiAgZ2V0IHRyZWVUZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjx7ICRpbXBsaWNpdDogTnpUcmVlTm9kZTsgb3JpZ2luOiBOelRyZWVOb2RlT3B0aW9ucyB9PiB7XG4gICAgcmV0dXJuIHRoaXMubnpUcmVlVGVtcGxhdGUgfHwgdGhpcy5uelRyZWVUZW1wbGF0ZUNoaWxkO1xuICB9XG5cbiAgZHJvcGRvd25DbGFzc05hbWUgPSBUUkVFX1NFTEVDVF9ERUZBVUxUX0NMQVNTO1xuICB0cmlnZ2VyV2lkdGg/OiBudW1iZXI7XG4gIGlzQ29tcG9zaW5nID0gZmFsc2U7XG4gIGlzRGVzdHJveSA9IHRydWU7XG4gIGlzTm90Rm91bmQgPSBmYWxzZTtcbiAgZm9jdXNlZCA9IGZhbHNlO1xuICBpbnB1dFZhbHVlID0gJyc7XG4gIGRyb3BEb3duUG9zaXRpb246ICd0b3AnIHwgJ2NlbnRlcicgfCAnYm90dG9tJyA9ICdib3R0b20nO1xuICBzZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XG4gIGZvY3VzQ2hhbmdlU3Vic2NyaXB0aW9uITogU3Vic2NyaXB0aW9uO1xuICBzZWxlY3RlZE5vZGVzOiBOelRyZWVOb2RlW10gPSBbXTtcbiAgZXhwYW5kZWRLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICB2YWx1ZTogc3RyaW5nW10gPSBbXTtcbiAgZGlyOiBEaXJlY3Rpb24gPSAnbHRyJztcblxuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBvbkNoYW5nZTogT25DaGFuZ2VUeXBlID0gX3ZhbHVlID0+IHt9O1xuICBvblRvdWNoZWQ6IE9uVG91Y2hlZFR5cGUgPSAoKSA9PiB7fTtcblxuICBnZXQgcGxhY2VIb2xkZXJEaXNwbGF5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXRWYWx1ZSB8fCB0aGlzLmlzQ29tcG9zaW5nIHx8IHRoaXMuc2VsZWN0ZWROb2Rlcy5sZW5ndGggPyAnbm9uZScgOiAnYmxvY2snO1xuICB9XG5cbiAgZ2V0IGlzTXVsdGlwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubnpNdWx0aXBsZSB8fCB0aGlzLm56Q2hlY2thYmxlO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgbnpUcmVlU2VydmljZTogTnpUcmVlU2VsZWN0U2VydmljZSxcbiAgICBwdWJsaWMgbnpDb25maWdTZXJ2aWNlOiBOekNvbmZpZ1NlcnZpY2UsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgcHJpdmF0ZSBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBASG9zdCgpIEBPcHRpb25hbCgpIHB1YmxpYyBub0FuaW1hdGlvbj86IE56Tm9BbmltYXRpb25EaXJlY3RpdmVcbiAgKSB7XG4gICAgc3VwZXIobnpUcmVlU2VydmljZSk7XG4gICAgLy8gVE9ETzogbW92ZSB0byBob3N0IGFmdGVyIFZpZXcgRW5naW5lIGRlcHJlY2F0aW9uXG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYW50LXNlbGVjdCcpO1xuICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdhbnQtc2VsZWN0Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2FudC10cmVlLXNlbGVjdCcpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pc0Rlc3Ryb3kgPSBmYWxzZTtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMuc3Vic2NyaWJlU2VsZWN0aW9uQ2hhbmdlKCk7XG5cbiAgICB0aGlzLmRpcmVjdGlvbmFsaXR5LmNoYW5nZT8ucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoZGlyZWN0aW9uOiBEaXJlY3Rpb24pID0+IHtcbiAgICAgIHRoaXMuZGlyID0gZGlyZWN0aW9uO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0pO1xuICAgIHRoaXMuZGlyID0gdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZTtcblxuICAgIHRoaXMuZm9jdXNDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLmZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuZWxlbWVudFJlZiwgdHJ1ZSkuc3Vic2NyaWJlKGZvY3VzT3JpZ2luID0+IHtcbiAgICAgIGlmICghZm9jdXNPcmlnaW4pIHtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5pc0Rlc3Ryb3kgPSB0cnVlO1xuICAgIHRoaXMuY2xvc2VEcm9wRG93bigpO1xuICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZm9jdXNDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIGlzQ29tcG9zaW5nQ2hhbmdlKGlzQ29tcG9zaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5pc0NvbXBvc2luZyA9IGlzQ29tcG9zaW5nO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5uekRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLmNsb3NlRHJvcERvd24oKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IG56Tm9kZXMsIG56RHJvcGRvd25DbGFzc05hbWUgfSA9IGNoYW5nZXM7XG4gICAgaWYgKG56Tm9kZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlU2VsZWN0ZWROb2Rlcyh0cnVlKTtcbiAgICB9XG4gICAgaWYgKG56RHJvcGRvd25DbGFzc05hbWUpIHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IHRoaXMubnpEcm9wZG93bkNsYXNzTmFtZSAmJiB0aGlzLm56RHJvcGRvd25DbGFzc05hbWUudHJpbSgpO1xuICAgICAgdGhpcy5kcm9wZG93bkNsYXNzTmFtZSA9IGNsYXNzTmFtZSA/IGAke1RSRUVfU0VMRUNUX0RFRkFVTFRfQ0xBU1N9ICR7Y2xhc3NOYW1lfWAgOiBUUkVFX1NFTEVDVF9ERUZBVUxUX0NMQVNTO1xuICAgIH1cbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IHN0cmluZ1tdIHwgc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGlzTm90TmlsKHZhbHVlKSkge1xuICAgICAgaWYgKHRoaXMuaXNNdWx0aXBsZSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZhbHVlID0gW3ZhbHVlIGFzIHN0cmluZ107XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkTm9kZXModHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmFsdWUgPSBbXTtcbiAgICAgIHRoaXMuc2VsZWN0ZWROb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkKG5vZGUsIGZhbHNlKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zZWxlY3RlZE5vZGVzID0gW107XG4gICAgfVxuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IHN0cmluZ1tdIHwgc3RyaW5nIHwgbnVsbCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIG9uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm56RGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIEVTQ0FQRTpcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNraXAgdGhlIEVTQ0FQRSBwcm9jZXNzaW5nLCBpdCB3aWxsIGJlIGhhbmRsZWQgaW4ge0BsaW5rIG9uT3ZlcmxheUtleURvd259LlxuICAgICAgICAgKi9cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFRBQjpcbiAgICAgICAgdGhpcy5jbG9zZURyb3BEb3duKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKCF0aGlzLm56T3Blbikge1xuICAgICAgICAgIHRoaXMub3BlbkRyb3Bkb3duKCk7XG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0cmlnZ2VyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm56RGlzYWJsZWQgfHwgKCF0aGlzLm56RGlzYWJsZWQgJiYgdGhpcy5uek9wZW4pKSB7XG4gICAgICB0aGlzLmNsb3NlRHJvcERvd24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuRHJvcGRvd24oKTtcbiAgICB9XG4gIH1cblxuICBvcGVuRHJvcGRvd24oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm56RGlzYWJsZWQpIHtcbiAgICAgIHRoaXMubnpPcGVuID0gdHJ1ZTtcbiAgICAgIHRoaXMubnpPcGVuQ2hhbmdlLmVtaXQodGhpcy5uek9wZW4pO1xuICAgICAgdGhpcy51cGRhdGVDZGtDb25uZWN0ZWRPdmVybGF5U3RhdHVzKCk7XG4gICAgICBpZiAodGhpcy5uelNob3dTZWFyY2ggfHwgdGhpcy5pc011bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuZm9jdXNPbklucHV0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvc2VEcm9wRG93bigpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIHRoaXMubnpPcGVuID0gZmFsc2U7XG4gICAgdGhpcy5pbnB1dFZhbHVlID0gJyc7XG4gICAgdGhpcy5pc05vdEZvdW5kID0gZmFsc2U7XG4gICAgdGhpcy5uek9wZW5DaGFuZ2UuZW1pdCh0aGlzLm56T3Blbik7XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBvbktleURvd25JbnB1dChlOiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGUua2V5Q29kZTtcbiAgICBjb25zdCBldmVudFRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaWYgKHRoaXMuaXNNdWx0aXBsZSAmJiAhZXZlbnRUYXJnZXQudmFsdWUgJiYga2V5Q29kZSA9PT0gQkFDS1NQQUNFKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAodGhpcy5zZWxlY3RlZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCByZW1vdmVOb2RlID0gdGhpcy5zZWxlY3RlZE5vZGVzW3RoaXMuc2VsZWN0ZWROb2Rlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZChyZW1vdmVOb2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkV4cGFuZGVkS2V5c0NoYW5nZSh2YWx1ZTogTnpGb3JtYXRFbWl0RXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLm56RXhwYW5kQ2hhbmdlLmVtaXQodmFsdWUpO1xuICAgIHRoaXMuZXhwYW5kZWRLZXlzID0gWy4uLnZhbHVlLmtleXMhXTtcbiAgfVxuXG4gIHNldElucHV0VmFsdWUodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMudXBkYXRlUG9zaXRpb24oKTtcbiAgfVxuXG4gIHJlbW92ZVNlbGVjdGVkKG5vZGU6IE56VHJlZU5vZGUsIGVtaXQ6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgbm9kZS5pc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgbm9kZS5pc0NoZWNrZWQgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5uekNoZWNrYWJsZSkge1xuICAgICAgdGhpcy5uelRyZWVTZXJ2aWNlLmNvbmR1Y3Qobm9kZSwgdGhpcy5uekNoZWNrU3RyaWN0bHkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm56VHJlZVNlcnZpY2Uuc2V0U2VsZWN0ZWROb2RlTGlzdChub2RlLCB0aGlzLm56TXVsdGlwbGUpO1xuICAgIH1cblxuICAgIGlmIChlbWl0KSB7XG4gICAgICB0aGlzLm56UmVtb3ZlZC5lbWl0KG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGZvY3VzT25JbnB1dCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5uelNlbGVjdFNlYXJjaENvbXBvbmVudCkge1xuICAgICAgdGhpcy5uelNlbGVjdFNlYXJjaENvbXBvbmVudC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIHN1YnNjcmliZVNlbGVjdGlvbkNoYW5nZSgpOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIHRoaXMubnpUcmVlQ2xpY2sucGlwZShcbiAgICAgICAgdGFwKChldmVudDogTnpGb3JtYXRFbWl0RXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBub2RlID0gZXZlbnQubm9kZSE7XG4gICAgICAgICAgaWYgKHRoaXMubnpDaGVja2FibGUgJiYgIW5vZGUuaXNEaXNhYmxlZCAmJiAhbm9kZS5pc0Rpc2FibGVDaGVja2JveCkge1xuICAgICAgICAgICAgbm9kZS5pc0NoZWNrZWQgPSAhbm9kZS5pc0NoZWNrZWQ7XG4gICAgICAgICAgICBub2RlLmlzSGFsZkNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5uekNoZWNrU3RyaWN0bHkpIHtcbiAgICAgICAgICAgICAgdGhpcy5uelRyZWVTZXJ2aWNlLmNvbmR1Y3Qobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLm56Q2hlY2thYmxlKSB7XG4gICAgICAgICAgICBub2RlLmlzU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBmaWx0ZXIoKGV2ZW50OiBOekZvcm1hdEVtaXRFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5vZGUgPSBldmVudC5ub2RlITtcbiAgICAgICAgICByZXR1cm4gdGhpcy5uekNoZWNrYWJsZSA/ICFub2RlLmlzRGlzYWJsZWQgJiYgIW5vZGUuaXNEaXNhYmxlQ2hlY2tib3ggOiAhbm9kZS5pc0Rpc2FibGVkICYmIG5vZGUuaXNTZWxlY3RhYmxlO1xuICAgICAgICB9KVxuICAgICAgKSxcbiAgICAgIHRoaXMubnpDaGVja2FibGUgPyB0aGlzLm56VHJlZUNoZWNrQm94Q2hhbmdlIDogb2JzZXJ2YWJsZU9mKCksXG4gICAgICB0aGlzLm56Q2xlYXJlZCxcbiAgICAgIHRoaXMubnpSZW1vdmVkXG4gICAgKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZE5vZGVzKCk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc2VsZWN0ZWROb2Rlcy5tYXAobm9kZSA9PiBub2RlLmtleSEpO1xuICAgICAgdGhpcy52YWx1ZSA9IFsuLi52YWx1ZV07XG4gICAgICBpZiAodGhpcy5uelNob3dTZWFyY2ggfHwgdGhpcy5pc011bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9ICcnO1xuICAgICAgICB0aGlzLmlzTm90Rm91bmQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlzTXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuZm9jdXNPbklucHV0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xvc2VEcm9wRG93bigpO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlLmxlbmd0aCA/IHZhbHVlWzBdIDogbnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVTZWxlY3RlZE5vZGVzKGluaXQ6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmIChpbml0KSB7XG4gICAgICBjb25zdCBub2RlcyA9IHRoaXMuY29lcmNlVHJlZU5vZGVzKHRoaXMubnpOb2Rlcyk7XG4gICAgICB0aGlzLm56VHJlZVNlcnZpY2UuaXNNdWx0aXBsZSA9IHRoaXMuaXNNdWx0aXBsZTtcbiAgICAgIHRoaXMubnpUcmVlU2VydmljZS5pc0NoZWNrU3RyaWN0bHkgPSB0aGlzLm56Q2hlY2tTdHJpY3RseTtcbiAgICAgIHRoaXMubnpUcmVlU2VydmljZS5pbml0VHJlZShub2Rlcyk7XG4gICAgICBpZiAodGhpcy5uekNoZWNrYWJsZSkge1xuICAgICAgICB0aGlzLm56VHJlZVNlcnZpY2UuY29uZHVjdENoZWNrKHRoaXMudmFsdWUsIHRoaXMubnpDaGVja1N0cmljdGx5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubnpUcmVlU2VydmljZS5jb25kdWN0U2VsZWN0ZWRLZXlzKHRoaXMudmFsdWUsIHRoaXMuaXNNdWx0aXBsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RlZE5vZGVzID0gWy4uLih0aGlzLm56Q2hlY2thYmxlID8gdGhpcy5nZXRDaGVja2VkTm9kZUxpc3QoKSA6IHRoaXMuZ2V0U2VsZWN0ZWROb2RlTGlzdCgpKV07XG4gIH1cblxuICB1cGRhdGVQb3NpdGlvbigpOiB2b2lkIHtcbiAgICByZXFBbmltRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5jZGtDb25uZWN0ZWRPdmVybGF5Py5vdmVybGF5UmVmPy51cGRhdGVQb3NpdGlvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Qb3NpdGlvbkNoYW5nZShwb3NpdGlvbjogQ29ubmVjdGVkT3ZlcmxheVBvc2l0aW9uQ2hhbmdlKTogdm9pZCB7XG4gICAgdGhpcy5kcm9wRG93blBvc2l0aW9uID0gcG9zaXRpb24uY29ubmVjdGlvblBhaXIub3JpZ2luWTtcbiAgfVxuXG4gIG9uQ2xlYXJTZWxlY3Rpb24oKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3RlZE5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkKG5vZGUsIGZhbHNlKTtcbiAgICB9KTtcbiAgICB0aGlzLm56Q2xlYXJlZC5lbWl0KCk7XG4gIH1cblxuICBvbkNsaWNrT3V0c2lkZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgdGhpcy5jbG9zZURyb3BEb3duKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0U2VhcmNoVmFsdWVzKCRldmVudDogTnpGb3JtYXRFbWl0RXZlbnQpOiB2b2lkIHtcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuaXNOb3RGb3VuZCA9ICh0aGlzLm56U2hvd1NlYXJjaCB8fCB0aGlzLmlzTXVsdGlwbGUpICYmICEhdGhpcy5pbnB1dFZhbHVlICYmICRldmVudC5tYXRjaGVkS2V5cyEubGVuZ3RoID09PSAwO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlQ2RrQ29ubmVjdGVkT3ZlcmxheVN0YXR1cygpOiB2b2lkIHtcbiAgICB0aGlzLnRyaWdnZXJXaWR0aCA9IHRoaXMuY2RrT3ZlcmxheU9yaWdpbi5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gIH1cblxuICB0cmFja1ZhbHVlKF9pbmRleDogbnVtYmVyLCBvcHRpb246IE56VHJlZU5vZGUpOiBzdHJpbmcge1xuICAgIHJldHVybiBvcHRpb24ua2V5ITtcbiAgfVxufVxuIl19