import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Reserva } from './reserva';

describe('Reserva', () => {
  let component: Reserva;
  let fixture: ComponentFixture<Reserva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reserva],
    }).compileComponents();

    fixture = TestBed.createComponent(Reserva);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('1. debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('2. el formulario es inválido cuando no se ingresan los datos requeridos', () => {
    expect(component.form.invalid).toBe(true);
    expect(component.form.controls.nombre.hasError('required')).toBe(true);
    expect(component.form.controls.correo.hasError('required')).toBe(true);
    expect(component.form.controls.noches.hasError('required')).toBe(true);
  });

  it('3. el correo con formato incorrecto es inválido', () => {
    const correo = component.form.controls.correo;
    correo.setValue('alberto.utp');
    expect(correo.hasError('email')).toBe(true);
    expect(correo.valid).toBe(false);
  });

  it('4. regla de negocio: la reserva debe ser de 1 a 15 noches', () => {
    const noches = component.form.controls.noches;
    noches.setValue(0);
    expect(noches.hasError('min')).toBe(true);
    noches.setValue(16);
    expect(noches.hasError('max')).toBe(true);
  });

  it('5. el nombre debe tener al menos 3 caracteres', () => {
    const nombre = component.form.controls.nombre;
    nombre.setValue('Al');
    expect(nombre.hasError('minlength')).toBe(true);
  });

  it('6. el formulario es válido cuando todos los datos cumplen las condiciones', () => {
    component.form.setValue({ nombre: 'Alberto Ramirez', correo: 'alberto@utp.edu.pe', noches: 3 });
    expect(component.form.valid).toBe(true);
  });

  it('7. no permite enviar el formulario si los datos son inválidos', () => {
    component.enviar();
    expect(component.enviado()).toBe(false);
  });

  it('8. registra la reserva cuando los datos son válidos', () => {
    component.form.setValue({ nombre: 'Alberto Ramirez', correo: 'alberto@utp.edu.pe', noches: 3 });
    component.enviar();
    expect(component.enviado()).toBe(true);
  });

  it('9. el botón Reservar está deshabilitado con el formulario inválido', () => {
    fixture.detectChanges();
    const boton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(boton.disabled).toBe(true);
  });
});
