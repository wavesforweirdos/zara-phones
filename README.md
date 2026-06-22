# zara-phones

Aplicación web de catálogo de teléfonos móviles desarrollada como prueba técnica para Inditex/Zara. Permite explorar el catálogo, buscar por nombre o marca, ver el detalle de cada dispositivo y gestionar un carrito de compras persistente.

---

## Requisitos previos

- Node.js >= 18
- npm >= 9

## Instalación y ejecución

```bash
npm install
npm start        # modo desarrollo en http://localhost:3000
npm run build    # build de producción (assets concatenados y minimizados)
npm test         # tests con cobertura
npm run lint     # ESLint sobre src/
npm run format   # Prettier sobre JS, JSX y SCSS
```

---

## Vistas

| Ruta | Descripción |
|------|-------------|
| `/` | Cuadrícula con los primeros 20 teléfonos, buscador en tiempo real por nombre/marca vía API e indicador de resultados |
| `/phone/:id` | Detalle: imagen dinámica por color, selectores de almacenamiento y color, especificaciones técnicas, botón añadir al carrito y productos similares |
| `/cart` | Listado de ítems con imagen, especificaciones y precio individual, total y botón continuar comprando |

---

## Arquitectura y estructura

```
src/
├── components/   # PhoneCard, Navbar, SearchBar, ColorSelector, StorageSelector,
│                 # SpecsTable, SimilarPhones, Button
├── constants/    # filters.js — colores disponibles extraídos de la API
├── context/      # CartContext.jsx — useReducer + persistencia en localStorage
├── hooks/        # usePhones, usePhone (caché sessionStorage), useDebounce
├── pages/        # PhoneListPage, PhoneDetailPage, CartPage
├── services/     # api.js — wrapper centralizado con header x-api-key
└── styles/       # _variables.scss, _reset.scss, _container.scss, mixins/
```

---

## Decisiones técnicas

**Caché con sessionStorage** — Las respuestas de la API se cachean bajo la clave `phones_cache_<query>` (lista) y `phone_cache_<id>` (detalle). Evita llamadas repetidas durante la misma sesión sin necesidad de librerías externas.

**CartContext con useReducer** — Estado predecible con acciones tipadas (`ADD_ITEM`, `REMOVE_ITEM`, `LOAD_CART`). El carrito se hidrata desde `localStorage` (`zara_cart`) al montar la aplicación y se sincroniza en cada cambio.

**Debounce de 300 ms en la búsqueda** — Implementado con `useRef` + `clearTimeout` para evitar llamadas innecesarias a la API mientras el usuario escribe.

**Filtro por color en cliente** — El endpoint `GET /products` no devuelve metadatos de color. Los colores disponibles están definidos estáticamente en `src/constants/filters.js`, construidos consultando `GET /products/:id` sobre los 24 productos en paralelo (`Promise.all`) y deduplicando los valores de `colorOptions[].name`. En producción, esta lógica debería residir en el backend.

**Webpack 5** — Configuración diferenciada dev/prod. En producción: minificación CSS y JS, code splitting y assets con hash de contenido.

**Design system SCSS** — Variables CSS centralizadas en `_variables.scss` (colores, espaciados, tipografía) y mixins de breakpoints (`_breakpoints.scss`) para garantizar consistencia visual entre componentes.

---

## Testing

9 suites · **26 tests** · Jest + Testing Library

| Módulo | Cobertura (stmts) |
|--------|-------------------|
| CartPage | 100 % |
| PhoneCard | 100 % |
| StorageSelector | 100 % |
| CartContext | 94 % |
| Navbar | 100 % |
| usePhones | 96 % |
| usePhone | 91 % |
| ColorSelector | 88 % |
| SearchBar | 38 % |

Los tests de hooks mockan `global.fetch` con `jest.spyOn` y verifican que una segunda llamada con la misma query sirve desde `sessionStorage` sin invocar `fetch`.

---

## Stack tecnológico

| Categoría | Elección |
|-----------|----------|
| UI | React 19 |
| Routing | React Router DOM v7 |
| Estado global | Context API + useReducer |
| Estilos | SASS + CSS custom properties |
| Bundler | Webpack 5 |
| Testing | Jest + Testing Library |
| Calidad | ESLint + Prettier |

---

## Accesibilidad

- `<nav>` con `aria-label` en el Navbar
- `<main>` como landmark principal en cada página
- Todos los `<img>` con `alt` descriptivo
- Swatches de color con `aria-label="Color: {nombre}"` y `aria-pressed`
- Chips de almacenamiento con `role="radio"` dentro de `role="radiogroup"`
- Botón añadir con estado `disabled` y cursor `not-allowed` cuando faltan selecciones
- Contraste WCAG AA: texto negro sobre fondo blanco
