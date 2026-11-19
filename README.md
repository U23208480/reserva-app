# reserva-app — Reserva de habitación

Aplicación Angular con un formulario de reserva de habitación, pruebas automáticas y un flujo de integración y entrega continua (CI/CD) con GitHub Actions y despliegue en Netlify.

- **Repositorio:** https://github.com/U23208480/reserva-app
- **Aplicación publicada:** https://reserva-app-utp.netlify.app/reserva

## Formulario

Ruta: `/reserva` (la raíz `/` redirige a esta ruta). Se usa **Reactive Forms**.

| Campo | Reglas de validación |
|---|---|
| Nombre completo | Obligatorio, mínimo 3 caracteres |
| Correo electrónico | Obligatorio, formato de correo válido |
| Número de noches | Obligatorio, mínimo 1 y máximo 15 (regla de negocio) |

Mientras el formulario sea inválido, el botón **Reservar** permanece deshabilitado y el método `enviar()` no registra la reserva.

## Pruebas automáticas

Archivo: `src/app/reserva/reserva.spec.ts` (Vitest + TestBed).

1. Creación correcta del componente.
2. Formulario inválido cuando no se ingresan los datos requeridos.
3. Correo con formato incorrecto es inválido.
4. Regla de negocio: la reserva debe ser de 1 a 15 noches.
5. El nombre debe tener al menos 3 caracteres.
6. Formulario válido cuando todos los datos cumplen las condiciones.
7. No permite enviar el formulario si los datos son inválidos.
8. Registra la reserva cuando los datos son válidos.
9. El botón Reservar está deshabilitado con el formulario inválido.

```bash
npm install
npm start          # http://localhost:4200/reserva
npm run test:ci    # ejecuta las pruebas una sola vez
npm run build      # genera dist/reserva-app/browser
```

**Demostración de una prueba fallida:** en `src/app/reserva/reserva.ts` se cambia `Validators.min(1)` por `Validators.min(0)`. La prueba 4 falla porque ahora se acepta una reserva de 0 noches. Al restaurar `min(1)` las pruebas vuelven a pasar.

## Flujo CI/CD

Archivo: `.github/workflows/ci-cd.yml`

```text
Push a main / Pull Request
        ↓
CI: obtener código → preparar Node 22 → npm ci → pruebas → build → artifact
        ↓
¿Pruebas correctas?
   NO → el pipeline se detiene, no hay despliegue
   SÍ → CD (solo en push a main): descargar artifact → desplegar en Netlify
        ↓
https://reserva-app-utp.netlify.app
```

### Elementos del YAML

- **`on`**: eventos que disparan el workflow (push y pull_request hacia `main`).
- **`jobs`**: trabajos independientes que corren en su propia máquina virtual (`ci` y `cd`).
- **`steps`**: pasos que se ejecutan en orden dentro de cada job.
- **`uses`**: ejecuta una acción ya existente (por ejemplo `actions/checkout`, `actions/setup-node`).
- **`run`**: ejecuta un comando de terminal (por ejemplo `npm ci`, `npm run test:ci`).
- **`needs: ci`**: el job `cd` solo empieza si `ci` terminó con éxito. Si una prueba falla, `cd` no se ejecuta.
- **`if: github.event_name == 'push' && github.ref == 'refs/heads/main'`**: el despliegue solo ocurre con un push a `main`. En un Pull Request se ejecuta el CI, pero el job `cd` aparece como omitido (*skipped*).

### Build

- **Directorio del resultado:** `dist/reserva-app/browser`
- **Archivos publicados:** `index.html`, `main-*.js`, `styles-*.css`, `favicon.ico` y `_redirects`.
- **Por qué no se publica el código fuente:** el navegador no ejecuta TypeScript ni plantillas sin compilar; el build genera archivos optimizados y minificados, y así no se exponen `node_modules`, la configuración ni el código fuente del proyecto.

El job `ci` guarda el build como *artifact* y el job `cd` descarga ese mismo artifact para desplegarlo, de modo que se publica exactamente la versión que pasó las pruebas.

### Secrets

Las credenciales no están en el YAML. Se guardan cifradas en **Settings → Secrets and variables → Actions**:

- `NETLIFY_AUTH_TOKEN`: token de acceso de Netlify.
- `NETLIFY_SITE_ID`: identificador del sitio en Netlify.

En el workflow se leen como `${{ secrets.NOMBRE }}` y en los logs aparecen ocultos como `***`.

### Recarga de rutas

El archivo `public/_redirects` (`/*  /index.html  200`) hace que Netlify responda con `index.html` en cualquier ruta, para que al recargar `https://reserva-app-utp.netlify.app/reserva` no se produzca un error 404 y Angular resuelva la ruta.
