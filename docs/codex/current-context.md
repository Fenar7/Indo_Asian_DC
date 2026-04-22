# Current Project Context

## Project Overview

This repository is a Next.js app initialized in the current root folder with:

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- SCSS for global and route-level styling

The project is currently being built as a static frontend first. The focus so far has been pixel-accurate UI implementation from Figma and attached screenshots. Functional behavior such as authentication, live filters, cart state, product data, and API wiring has not been implemented yet.

## Styling System

### Global Fonts

SF Pro Display is configured globally from:

- `public/fonts/SFPro`

The font is loaded through `@font-face` definitions in:

- `src/app/globals.scss`

It is available:

- as the global app font
- in SCSS via the `$font-sf-pro` token
- in Tailwind utilities through `font-sans` and `font-sf-pro`

### Global Color Tokens

The current shared design tokens are defined in:

- `src/styles/_tokens.scss`

Available SCSS variables:

- `$pure-black: #000`
- `$pure-white: #fff`
- `$hash-grey-2: #767676`
- `$cloud-grey: #e3e5e6`
- `$main-cta-red: #dc2b1b`
- `$stroke-grey: #dedede`

These are also exposed through CSS variables in `globals.scss` and mapped into Tailwind-style utility usage, so they can be used in class names like:

- `bg-main-cta-red`
- `text-hash-grey-2`
- `border-stroke-grey`
- `bg-cloud-grey`
- `text-pure-white`

### Sass Injection

Shared Sass tokens are automatically injected into every `.scss` file through:

- `next.config.ts`

This means route-level SCSS files can directly use global Sass variables without manually importing the token file.

## Global Files

### `src/app/globals.scss`

Contains:

- Tailwind import
- `@font-face` declarations for SF Pro Display
- CSS variable mappings for design tokens
- app-wide resets and base styles

### `src/app/layout.tsx`

The layout was simplified to use the global SF Pro setup instead of the default Next.js font helpers. Metadata has been updated for this project.

## Current Routes

### `/`

File:

- `src/app/page.tsx`

Purpose:

- Temporary visual token-check page

This page was created only to confirm:

- SF Pro font rendering
- global color token wiring
- Tailwind utility access to the theme

It is not intended as the final homepage.

### `/login`

Files:

- `src/app/login/page.tsx`
- `src/app/login/style.scss`

Purpose:

- Static login page UI matching the provided screenshot

Implementation notes:

- Uses the existing required container shell
- Styled closely to the supplied design
- Not functional yet
- No auth wiring yet

### `/shop-page`

Files:

- `src/app/shop-page/page.tsx`
- `src/app/shop-page/style.scss`
- `src/components/shop-page/ShopPageScreen.tsx`

Purpose:

- Static shop/listing page based on Figma and attached screenshots

Current structure:

- header with logo, search, cart
- hero banner slider
- category/collection chips
- filter bar
- left category rail
- product listing grid
- right cart panel

Implementation notes:

- Built as reusable pieces inside `ShopPageScreen`
- Hero is already implemented as a simple auto-rotating slider
- Product cards are currently static mock data
- Left category list and cart panel are static
- Layout is responsive across desktop, tablet, and mobile

### `/product-detail`

Files:

- `src/app/product-detail/page.tsx`
- `src/app/product-detail/style.scss`
- `src/components/product-detail/ProductDetailScreen.tsx`

Purpose:

- Static product detail page based on Figma and attached screenshots

Current structure:

- header with logo, search, cart
- breadcrumb pills
- main product gallery with stacked thumbnails
- offer/fresh-made badges
- title, price, quantity control, add-to-cart CTA
- product information block
- related products grid

Implementation notes:

- Built as reusable sections inside `ProductDetailScreen`
- Related products are static mock items
- Quantity control is purely visual for now
- Responsive behavior is implemented

## Asset Source Status

Important current limitation:

- Some page imagery and icons are still using temporary Figma MCP asset URLs

This currently affects:

- `/shop-page`
- `/product-detail`

These URLs are time-limited and will expire. Before production work or long-term continuation, the assets should be downloaded into `public/` and all component references should be updated to local files.

## Reusable Component Direction

The project is moving toward a reusable static-to-dynamic architecture. The current direction is:

- route file stays thin
- route-level SCSS controls page-specific layout
- screen/component files hold reusable UI sections
- cards, sliders, panels, and product blocks should remain reusable for later data wiring

This has already started in:

- `src/components/shop-page/ShopPageScreen.tsx`
- `src/components/product-detail/ProductDetailScreen.tsx`

## Key Conventions Followed So Far

- Keep the route-level outer wrapper structure the user requested
- Use the existing Tailwind `container` wrapper with no extra arbitrary route padding at the wrapper level
- Use SCSS for pixel-specific route styling
- Use globally defined fonts and colors only
- Build static UI first, then wire functionality later
- Keep layouts responsive from the beginning

## Lint / Verification Status

The current implemented pages have been checked with:

- `npm run lint`

At the time of writing this document, lint passes after the recent route work.

## What Is Not Done Yet

The following is still pending:

- real authentication flow for `/login`
- localizing all remote Figma assets into `public/`
- real hero slider data
- real category/filter/search functionality on `/shop-page`
- cart state and dynamic cart UI
- real product data and API integration
- interactive product gallery behavior on `/product-detail`
- functional quantity selector
- shared extracted product card component across shop and product detail pages

## Recommended Next Steps

The most practical next steps are:

1. Move all temporary Figma asset URLs into local `public/` files.
2. Extract common shared components:
   - header
   - search field
   - cart button
   - product card
3. Replace static arrays with structured mock data files.
4. Wire the routes to real data later without changing visual layout code.
5. Add true interactivity only after the static fidelity is locked.

## Important Files Snapshot

- `next.config.ts`
- `src/styles/_tokens.scss`
- `src/app/globals.scss`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/login/page.tsx`
- `src/app/login/style.scss`
- `src/app/shop-page/page.tsx`
- `src/app/shop-page/style.scss`
- `src/components/shop-page/ShopPageScreen.tsx`
- `src/app/product-detail/page.tsx`
- `src/app/product-detail/style.scss`
- `src/components/product-detail/ProductDetailScreen.tsx`

