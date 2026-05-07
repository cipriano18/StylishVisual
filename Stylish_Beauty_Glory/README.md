# Stylish Beauty Glory

Aplicacion web para la gestion operativa y comercial de `Stylish Beauty Glory`.
El proyecto cubre la experiencia publica del negocio, autenticacion, agenda de clientes,
administracion de citas y modulos internos para ventas, proveedores, servicios,
portafolio, reportes y perfiles.

## Stack

- `React 19`
- `Vite 7`
- `React Router 7`
- `react-hot-toast`
- `react-select`
- `recharts`
- `swiper`
- `ESLint 9`

## Modulos principales

- `Home publica`: landing, portafolio resumido y acceso a registro/login.
- `Autenticacion`: login, registro con verificacion por codigo y recuperacion de contrasena.
- `Cliente`: agenda, reserva de citas, historial cercano, perfil y acceso al portafolio.
- `Administrador`: gestion de admins, usuarios, proveedores, servicios, ventas, cuentas por pagar, portafolio, citas, agenda y reportes.
- `Servicios compartidos`: capa `src/services` para consumo de API y renovacion de token.

## Estructura del proyecto

```text
src/
  assets/        Imagenes y recursos multimedia
  layouts/       Layouts principales de admin y cliente
  pages/         Pantallas publicas, admin, client y overlays
  routes/        Definicion central de rutas
  services/      Capa de acceso a API
  styles/        Hojas de estilo globales y por modulo
  utils/         Helpers reutilizables
```

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Variables y servicios

- La URL base del backend vive en [src/services/config.js](/C:/Users/Alvaro%20Artavia/Documents/GitHub/StylishVisual/Stylish_Beauty_Glory/src/services/config.js:1).
- La aplicacion persiste `access_token`, `refresh_token` y `user` en `localStorage`.
- La funcion [src/services/api.js](/C:/Users/Alvaro%20Artavia/Documents/GitHub/StylishVisual/Stylish_Beauty_Glory/src/services/api.js:1) centraliza requests autenticados y refresh de token.

## Flujo de trabajo recomendado

- Ejecutar `npm run lint` antes de cerrar cambios.
- Verificar `npm run build` cuando se toquen rutas, servicios o pantallas grandes.
- Limpiar primero comportamiento y estructura de codigo antes de entrar a refactors visuales/CSS.

## Estado de la limpieza

La base ya cuenta con:

- `lint` en cero errores.
- `build` de produccion pasando.
- layouts y overlays compartidos mas consistentes.
- flujos de login, registro y perfiles con menor duplicacion y mejor manejo de errores.

Siguiente etapa recomendada:

- limpieza y consolidacion de CSS compartido por layout, modulo y pagina.
- reduccion de `chunk` principal via code splitting cuando la base funcional este mas estable.
