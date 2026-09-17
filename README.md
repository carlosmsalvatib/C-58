# Sistema de Gestión Código-58

Plataforma integral de consultoría empresarial, formalización jurídica y aceleración comercial para emprendedores.

![Código-58 Logo](assets/img/logo.png)

---

## 🚀 Módulos Principales del Sistema

1. **Dashboard Ejecutivo**: Métricas en tiempo real, accesos rápidos y vista personalizada según el rol del usuario (`direccion`, `consultor`, `gestor_legal`, `comercial`).
2. **Directorio de Emprendedores**: Buscador inteligente y tabla interactiva con datos de identificación (Cédula/RIF), dirección física, contacto directo (WhatsApp, llamada, email) y catálogo de servicios que ofrece.
3. **Emprendedores**: Registro, actualización y expedientes completos de cada emprendedor.
4. **Asesorías**: Programación, calendario y seguimiento de sesiones de consultoría y diagnóstico.
5. **Procesos Legales**: Gestión de trámites jurídicos, expedientes y control documental.
6. **Contratos & Pagos**: Formalización comercial, cobros, anticipos y verificación de comprobantes.
7. **Reportes & Analíticas**: Gráficos interactivos con **Chart.js**, KPIs ejecutivos y exportación de informes a Excel / CSV.
8. **CMS del Sistema**: Control de activación y roles de cada módulo, catálogo de servicios y configuración corporativa.

---

## 🎨 Identidad Visual Oficial

- **Azul Marino Profundo**: `#161938` / `#1E224F`
- **Verde Azulado / Persian Teal**: `#008080` / `#0D9488`
- **Amarillo Ámbar / Warm Gold**: `#F59E0B`
- **Púrpura Real**: `#4A154B`

---

## ⚙️ Arquitectura de Ejecución (Node.js + React + Vite)

El proyecto ha sido migrado exitosamente a una arquitectura moderna basada en **React 18 + TypeScript + Vite** con **Tailwind CSS v4** y persistencia local (`localStorage`) que mantiene la fidelidad exacta de los modelos y datos de `database.sql`.

### Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en el puerto 3000.
- `npm run build`: Compila la aplicación optimizada para producción en `dist/`.
- `npm run lint`: Valida la sintaxis del proyecto con ESLint.

### Roles y Credenciales de Demostración

La plataforma incluye un selector rápido de perfiles en el encabezado y en la pantalla de acceso:

- **Dirección Ejecutiva:** `admin@consultoria.com` (Control total, KPIs, CMS y permisos)
- **Consultor Estratégico:** `consultor@consultoria.com` (Directorio, diagnósticos FDI, agenda de asesorías)
- **Gestor Legal:** `legal@consultoria.com` (Expedientes SAPI, redacción constitutiva, validación documental)
- **Comercial:** `comercial@consultoria.com` (Prospección, registro de contratos, cobros y abonos)
- **Contraseña universal:** `password`
