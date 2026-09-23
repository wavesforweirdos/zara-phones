# zara-phones

Aplicación web de catálogo de teléfonos móviles desarrollada como prueba técnica para Inditex/Zara. Permite explorar el catálogo, buscar por nombre o marca, consultar el detalle de cada dispositivo y gestionar un carrito de compras persistente.

**Demo:** https://zara-phones.vercel.app/

## Requisitos previos

- Node.js >= 18
- npm >= 9

## Instalación y ejecución

```bash
npm install
cp .env.example .env    # rellenar API_KEY con la clave facilitada en el enunciado
npm start               # modo desarrollo — http://localhost:3000 (assets sin minimizar)
npm run build           # modo producción — assets concatenados y minimizados
npm test                # tests unitarios e integración (Jest) con informe de cobertura
npm run test:e2e        # tests end-to-end (Playwright)
npm run lint            # ESLint sobre src/
npm run typecheck       # comprobación de tipos con tsc --noEmit
npm run format          # Prettier sobre TS, TSX, SCSS y e2e
npm run validate        # lint + typecheck + format + test
```

La primera vez que se lancen los e2e hay que descargar el navegador: `npx playwright install chromium`.

## Vistas implementadas

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | Listado | Cuadrícula de 20 teléfonos, buscador en tiempo real con debounce, filtro por color, contador de resultados |
| `/phone/:id` | Detalle | Imagen dinámica por color, selectores de almacenamiento y color, precio en tiempo real, botón "Añadir" deshabilitado hasta selección completa, especificaciones técnicas, productos similares con carrusel |
| `/cart` | Carrito | Lista de productos con imagen/specs/precio, botón "Eliminar", total de la compra, "Continue Shopping" |

## Arquitectura y estructura

```
src/
├── components/
│   ├── Button/          # Botón reutilizable (variantes primary / secondary)
│   ├── ColorSelector/   # Swatches de color con estado seleccionado
│   ├── Navbar/          # Header sticky con logo y badge del carrito
│   ├── PhoneCard/       # Tarjeta (imagen, marca, nombre, precio)
│   ├── SearchBar/       # Input con debounce, contador de resultados y filtro de color
│   ├── SimilarPhones/   # Carrusel horizontal con scrollbar personalizado arrastrable
│   ├── SpecsTable/      # Tabla de especificaciones técnicas
│   └── StorageSelector/ # Chips de almacenamiento (radio group accesible)
├── constants/
│   └── filters.ts       # Colores disponibles para el filtro de la lista
├── context/
│   └── CartContext.tsx  # useReducer — ADD_ITEM / REMOVE_ITEM / LOAD_CART
├── hooks/
│   ├── useDebounce.ts   # Debounce genérico vía useRef (sin dependencias externas)
│   ├── usePhone.ts      # Fetch del detalle con caché en sessionStorage y AbortController
│   └── usePhones.ts     # Fetch de la lista con búsqueda, caché en sessionStorage y AbortController
├── pages/
│   ├── CartPage/
│   ├── PhoneDetailPage/
│   └── PhoneListPage/
├── services/
│   └── api.ts           # fetchProducts / fetchProductById — único punto de acceso a la API REST
├── test-utils/          # Helpers tipados para mockear fetch en tests
├── types/               # Tipos de dominio (PhoneSummary, PhoneDetail, CartItem, CartAction…)
└── styles/
    ├── _variables.scss  # Design system: colores, tipografía y espaciados como vars SCSS y CSS custom properties
    ├── _reset.scss
    ├── _container.scss
    ├── main.scss
    └── mixins/          # _breakpoints.scss · _typography.scss
e2e/                     # Tests end-to-end con Playwright y API simulada
```

## Decisiones técnicas

| Decisión | Motivo |
|----------|--------|
| **TypeScript estricto** | Tipos de dominio compartidos entre servicio, hooks, contexto y componentes; sustituye a PropTypes con comprobación en compilación. Babel (`@babel/preset-typescript`) solo elimina tipos para mantener Webpack y Jest rápidos; la comprobación la hace `tsc --noEmit` en `npm run validate` |
| **AbortController en las peticiones** | Al cambiar la búsqueda, cambiar de producto o desmontar la vista se cancela la petición en curso: una respuesta lenta y obsoleta nunca sobrescribe a una más reciente y no se actualiza estado de componentes desmontados |
| **API key en variables de entorno** | Fuera del código y del repositorio (ver sección API) |
| **Caché sessionStorage** | Evita llamadas repetidas a la misma query durante la sesión; se invalida al cerrar la pestaña |
| **CartContext + useReducer** | Estado predecible con acciones tipadas; aislado y fácil de testear |
| **localStorage para el carrito** | Persistencia entre sesiones bajo la clave `zara_cart`; se lee de forma síncrona como estado inicial del reducer, así el efecto que guarda el carrito no puede sobrescribirlo antes de cargarlo |
| **URL search params** | La búsqueda vive en `?search=query` — el estado es compartible y navegable con el historial del browser |
| **CSS custom properties + SCSS vars** | Todas las variables del design system en un único fichero (`_variables.scss`); las propiedades CSS quedan disponibles para sobreescritura en runtime |
| **Debounce 300 ms con useRef** | Sin dependencias externas; el timer se limpia correctamente al desmontar |
| **Webpack 5 dev/prod** | Code splitting, minificación y hashes de contenido solo en producción; source maps en desarrollo |
| **Filtro por color en cliente** | El endpoint `GET /products` no expone metadatos de color; los colores se resuelven bajo demanda con `Promise.all` sobre `GET /products/:id` y se cachean en sessionStorage. En producción esta lógica debería residir en el backend |

## API

Base URL: `https://prueba-tecnica-api-tienda-moviles.onrender.com`

La URL base y la API key **no están en el código**: se leen de variables de entorno en tiempo de build.

| Variable | Descripción |
|----------|-------------|
| `API_BASE_URL` | URL base de la API |
| `API_KEY` | Valor del header `x-api-key` |

- En local se cargan desde `.env` (ignorado por git; plantilla en `.env.example`) mediante `dotenv` y se inyectan con `DefinePlugin` de Webpack.
- En Vercel se configuran en *Project Settings → Environment Variables*.
- El build falla con un mensaje explícito si falta alguna.
- Los tests usan valores ficticios definidos en `jest.setup.env.js`.

> **Limitación conocida:** en una SPA sin backend cualquier valor inyectado en build acaba en el bundle público. Mover la key a `.env` evita exponerla en el repositorio, pero protegerla de verdad requeriría un proxy en servidor (p. ej. una función serverless) que añada el header. La key la facilita el enunciado y es compartida, por lo que su rotación depende del propietario de la API; la versión anterior del repositorio la contenía en el historial.

El header `x-api-key` se añade exclusivamente en `src/services/api.ts`.

| Endpoint | Uso |
|----------|-----|
| `GET /products?search=query` | Lista de teléfonos (búsqueda delegada a la API) |
| `GET /products/:id` | Detalle de un teléfono |

## Testing

### Unitarios e integración

**66 tests** en 14 suites — Jest + Testing Library. Todas las dependencias de testing (incluida `@testing-library/dom`, peer de `@testing-library/react`) están declaradas en `package.json`, por lo que `npm install && npm test` funciona sin pasos extra.

| Fichero | Stmts |
|---------|-------|
| `api.ts` | 100 % |
| `CartPage.tsx` | 100 % |
| `PhoneCard.tsx` | 100 % |
| `StorageSelector.tsx` | 100 % |
| `SpecsTable.tsx` | 100 % |
| `Navbar.tsx` | 100 % |
| `PhoneListPage.tsx` | 98 % |
| `usePhones.ts` | 97 % |
| `PhoneDetailPage.tsx` | 96 % |
| `usePhone.ts` | 93 % |
| `CartContext.tsx` | 91 % |

Estrategias aplicadas: `jest.spyOn(globalThis, 'fetch')` con helpers tipados (`src/test-utils/fetch.ts`) para control de red, peticiones que solo se resuelven al abortarse para verificar la cancelación, `jest.useFakeTimers()` para el debounce, sessionStorage pre-cargado para verificar hits de caché, `StrictMode` para reproducir la doble ejecución de efectos, y `MemoryRouter` + `CartProvider` como wrappers.

### End-to-end

**6 tests** con Playwright (Chromium) sobre el servidor de desarrollo de Webpack:

- Búsqueda: filtra vía API, el debounce evita enviar términos parciales, limpiar restaura el catálogo, clic en tarjeta abre el detalle
- Carrito: añadir desde el detalle (botón deshabilitado hasta elegir almacenamiento y color), persistencia tras recargar, eliminar y actualizar el total

La API se simula con `page.route` (`e2e/fixtures/api.js`) y la configuración usa una URL y una key ficticias, así los e2e son deterministas, no necesitan la key real y no dependen de que el servidor de onrender esté despierto. El test de persistencia detectó un bug real de hidratación del carrito bajo `StrictMode`, ya corregido.

## Accesibilidad

- `<nav>` con `aria-label` en el Navbar; `<main>` como landmark en cada página
- Todos los `<img>` con `alt` descriptivo o `aria-hidden="true"` cuando son decorativos
- Swatches de color con `aria-label="Color: {nombre}"` y `aria-pressed`
- Chips de almacenamiento con `role="radio"` dentro de `role="radiogroup"`
- Botón "Añadir" con `disabled` y `cursor: not-allowed` hasta selección completa
- Resultados de búsqueda con `aria-live="polite"` para lectores de pantalla
- Contraste WCAG AA: texto negro (#000000) sobre fondo blanco (#ffffff)

## Requisitos del enunciado

| Requisito | Estado |
|-----------|--------|
| Cuadrícula con 20 teléfonos | ✅ |
| Búsqueda en tiempo real vía API | ✅ |
| Indicador de número de resultados | ✅ |
| Navbar con badge del carrito | ✅ |
| Carrito persistente (localStorage) | ✅ |
| Vista detalle con selectores y precio dinámico | ✅ |
| Botón "Añadir" deshabilitado hasta selección completa | ✅ |
| Sección "Productos similares" | ✅ |
| Vista carrito con eliminar y total | ✅ |
| Diseño responsive (mobile / tablet / desktop) | ✅ |
| Accesibilidad | ✅ |
| Linter (ESLint) y formatter (Prettier) | ✅ |
| Tests | ✅ 66 unitarios/integración + 6 e2e |
| Modo desarrollo y producción | ✅ |
| Variables CSS (opcional) | ✅ |
| Despliegue (opcional) | ✅ [Vercel](https://zara-phones.vercel.app/) |

## Despliegue

Desplegado en **Vercel**: https://zara-phones.vercel.app/

- Cada push a `master` genera un despliegue de producción (`npm run build` → `dist/`).
- `vercel.json` redirige todas las rutas a `index.html` para que las rutas de la SPA (`/cart`, `/phone/:id`) funcionen al recargar o al abrirlas directamente.
- Las variables `API_BASE_URL` y `API_KEY` se definen en *Project Settings → Environment Variables*.

## Stack tecnológico

React 19 · TypeScript · React Router v7 · Context API + useReducer · Webpack 5 · SCSS · CSS Custom Properties · Jest · Testing Library · Playwright · ESLint · Prettier · Vercel
