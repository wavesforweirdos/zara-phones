# zara-phones

## Descripción

Aplicación web de catálogo de teléfonos móviles desarrollada como prueba técnica. Permite explorar, buscar y gestionar un carrito de compras.

## Requisitos previos

- Node.js >= 18
- npm >= 9

## Instalación y ejecución

```bash
npm install
npm start        # modo desarrollo en http://localhost:3000
npm run build    # build de producción
npm test         # tests con cobertura
npm run lint     # ESLint
npm run format   # Prettier
```

## Arquitectura y estructura

- `src/components/` — componentes reutilizables (PhoneCard, Navbar, SearchBar, ColorSelector, StorageSelector, SpecsTable, SimilarPhones)
- `src/pages/` — vistas principales (PhoneListPage, PhoneDetailPage, CartPage)
- `src/context/` — CartContext con useReducer y persistencia en localStorage
- `src/hooks/` — usePhones, usePhone, useDebounce con caché en sessionStorage
- `src/services/` — capa de acceso a la API REST
- `src/styles/` — design system: variables SCSS, mixins de tipografía y breakpoints
- `src/assets/` — SVGs (logo, bag, close)

## Decisiones técnicas

- **Caché con sessionStorage** — evita llamadas repetidas a la API en la misma sesión
- **CartContext con useReducer** — estado predecible con acciones tipadas (ADD_ITEM, REMOVE_ITEM, LOAD_CART)
- **Persistencia del carrito** — localStorage bajo la clave `zara_cart`
- **Webpack 5** — configuración diferenciada dev/prod con code splitting en producción
- **SCSS con design system propio** — variables centralizadas y mixins de tipografía para consistencia visual
- **Debounce en búsqueda** — 300ms para evitar llamadas innecesarias a la API mientras el usuario escribe

## Testing

26 tests con Jest y Testing Library. Cobertura principal:

- CartContext, CartPage, PhoneCard, Navbar, StorageSelector: ~94–100%
- usePhones, usePhone: ~91–96%

## Stack tecnológico

React 19, React Router v7, Context API, Webpack 5, SCSS, Jest, Testing Library, ESLint, Prettier
