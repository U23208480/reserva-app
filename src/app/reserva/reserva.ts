import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reserva',
  imports: [ReactiveFormsModule],
  templateUrl: './reserva.html',
  styleUrl: './reserva.css',
})
export class Reserva {
  private fb = inject(FormBuilder);

  enviado = signal(false);

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    correo: ['', [Validators.required]],
    noches: [null as number | null, [Validators.required]],
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviado.set(true);
  }
}
