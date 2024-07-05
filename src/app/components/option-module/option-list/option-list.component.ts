import { Component, Inject, OnInit } from '@angular/core';
import { Option } from '../../../models/option/option';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OptionApiService } from '../../../services/option/option-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-option-list',
  templateUrl: './option-list.component.html',
  styleUrl: './option-list.component.css',
})
export class OptionListComponent implements OnInit {
  options: Option[] = [];
  optionForm!: FormGroup;
  isStarted!: boolean;

  constructor(
    private fb: FormBuilder,
    private optionApiService: OptionApiService,
    public dialogRef: MatDialogRef<OptionListComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { votingId: string; isStarted: boolean }
  ) {}

  ngOnInit(): void {
    this.isStarted = this.data.isStarted;
    this.optionForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          this.nameValidator.bind(this),
        ],
      ],
    });
    this.loadOptions();
    if (this.isStarted) {
      this.optionForm.disable(); // Deshabilitar el formulario si la votación ha comenzado
    }
  }

  loadOptions(): void {
    this.optionApiService
      .getOptionById(this.data.votingId)
      .subscribe((options) => {
        this.options = options;
      });
  }

  nameValidator(control: any): { [key: string]: boolean } | null {
    const name = control.value.trim().toLowerCase();
    if (this.options.some((option) => option.name.toLowerCase() === name)) {
      return { nameExists: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.optionForm.valid) {
      const name = this.optionForm.value.name.trim();
      this.optionApiService.createOption(this.data.votingId, name).subscribe(
        () => {
          this.loadOptions();
          this.optionForm.reset();
        },
        (error) => {
          console.error('Error al crear la opción', error);
        }
      );
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
