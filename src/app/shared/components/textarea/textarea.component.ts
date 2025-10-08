import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgClass, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/select';
import { BaseFormComponent } from '../../base/base-form.component';

@Component({
  selector: 'app-textarea',
  templateUrl: 'textarea.component.html',
  styleUrls: ['textarea.component.scss'],
  imports: [NgIf, MatFormField, FormsModule, ReactiveFormsModule, MatLabel, MatInput, CdkTextareaAutosize, NgClass],
})
export class TextAreaComponent extends BaseFormComponent<string> implements AfterViewInit {
  @Input() public autosizeMinRows = 4;
  @Input() public autosizeMaxRows = 20;

  public initialized = false;

  ngAfterViewInit(): void {
    //This fix ensures that cdkTextareaAutosize is ready to perform correct autosizing.
    //Without this delay, the autosizing will not correctly autosize on load (will add additional spacing below the text)
    //Doing it after one js check to prevent violating the angular lifecycle rules
    setTimeout(() => (this.initialized = true));
  }

  @ViewChild('autosizeTextarea') textarea!: ElementRef<HTMLTextAreaElement>;

  scrollWithTextOnInput() {
    // wait until the browser has applied the autosize height then scroll if needed
    requestAnimationFrame(() => {
      const ta = this.textarea?.nativeElement;
      if (!ta) return;
      if (ta.scrollHeight > ta.clientHeight) {
        ta.scrollTop = ta.scrollHeight;
      }
    });
  }
}
