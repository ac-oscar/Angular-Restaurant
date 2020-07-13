import { Directive, ElementRef, Renderer2, Host, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('mouseenter') onmouseenter() {
    this.renderer.addClass(this.el.nativeElement, 'hihglight');
  }

  @HostListener('mouseleave') onmouseleave() {
    this.renderer.removeClass(this.el.nativeElement, 'hihglight');
  }

}
