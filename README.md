# zara-phones

Aplicación web de catálogo de teléfonos móviles desarrollada como prueba técnica para Inditex/Zara. Permite explorar el catálogo, buscar por nombre o marca, consultar el detalle de cada dispositivo y gestionar un carrito de compras persistente.

## Requisitos previos

- Node.js >= 18
- npm >= 9

## Instalación y ejecución

```bash
npm install
cp .env.example .env   # rellenar API_KEY con la clave facilitada en el enunciado
npm start        # modo desarrollo — http://localhost:3000 (assets sin minimizar)
npm run build    # modo producción — assets concatenados y minimizados
npm test         # suite de tests con informe de cobertura
npm run lint     # ESLint sobre src/
npm run format   # Prettier sobre JS, JSX y SCSS
```

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
│   └── filters.js       # Colores disponibles para el filtro de la lista
├── context/
│   └── CartContext.jsx  # useReducer — ADD_ITEM / REMOVE_ITEM / LOAD_CART
├── hooks/
│   ├── useDebounce.js   # Debounce genérico vía useRef (sin dependencias externas)
│   ├── usePhone.js      # Fetch del detalle con caché en sessionStorage
│   └── usePhones.js     # Fetch de la lista con búsqueda y caché en sessionStorage
├── pages/
│   ├── CartPage/
│   ├── PhoneDetailPage/
│   └── PhoneListPage/
├── services/
│   └── api.js           # fetchProducts / fetchProductById — único punto de acceso a la API REST
└── styles/
    ├── _variables.scss  # Design system: colores, tipografía y espaciados como vars SCSS y CSS custom properties
    ├── _reset.scss
    ├── _container.scss
    ├── main.scss
    └── mixins/          # _breakpoints.scss · _typography.scss
```

## Decisiones técnicas

| Decisión | Motivo |
|----------|--------|
| **Caché sessionStorage** | Evita llamadas repetidas a la misma query durante la sesión; se invalida al cerrar la pestaña |
| **CartContext + useReducer** | Estado predecible con acciones tipadas; aislado y fácil de testear |
| **localStorage para el carrito** | Persistencia entre sesiones bajo la clave `zara_cart`; se hidrata en el primer render |
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

El header `x-api-key` se añade exclusivamente en `src/services/api.js`.

| Endpoint | Uso |
|----------|-----|
| `GET /products?search=query` | Lista de teléfonos (búsqueda delegada a la API) |
| `GET /products/:id` | Detalle de un teléfono |

## Testing

**54 tests** en 12 suites — Jest + Testing Library

| Fichero | Stmts |
|---------|-------|
| `PhoneDetailPage.jsx` | 100 % |
| `CartPage.jsx` | 100 % |
| `PhoneCard.jsx` | 100 % |
| `StorageSelector.jsx` | 100 % |
| `SpecsTable.jsx` | 100 % |
| `Navbar.jsx` | 100 % |
| `CartContext.jsx` | 94 % |
| `usePhones.js` | 96 % |
| `usePhone.js` | 91 % |
| `PhoneListPage.jsx` | 97 % |

Estrategias aplicadas: `jest.spyOn(global, 'fetch')` para control de red en hooks, `jest.useFakeTimers()` para el debounce, sessionStorage pre-cargado para verificar hits de caché, y `MemoryRouter` + `CartProvider` como wrappers en componentes con routing o contexto.

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
| Tests | ✅ 54 tests |
| Modo desarrollo y producción | ✅ |
| Variables CSS (opcional) | ✅ |

## Stack tecnológico

React 19 · React Router v7 · Context API + useReducer · Webpack 5 · SCSS · CSS Custom Properties · Jest · Testing Library · ESLint · Prettier
