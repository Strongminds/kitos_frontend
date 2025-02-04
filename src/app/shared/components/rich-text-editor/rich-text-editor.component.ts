/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, forwardRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppRootUrlResolverService } from '../../services/app-root-url-resolver.service';
import { EditorComponent } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
})
export class RichTextEditorComponent implements AfterViewInit{
  @Input() formControl!: FormControl;
  @Input() defaultEditorContent: string | undefined = undefined;

  @ViewChild('editor') editorRef!: EditorComponent;

  public rootUrl: string;


  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private readonly rootUrlResolver: AppRootUrlResolverService,
  ) {
    this.rootUrl = this.rootUrlResolver.resolveRootUrl();

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.editorRef?.editor) {
        this.editorRef.editor.setContent(this.defaultEditorContent || 'dummy text');
      }
    }, 500);
  }

  writeValue(value: any): void {
    if (this.formControl) {
      this.formControl.setValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.formControl) {
      if (isDisabled) {
        this.formControl.disable();
      } else {
        this.formControl.enable();
      }
    }
  }

  onValueChange(value: any): void {
    this.onChange(value);
    this.onTouched();
  }
}
