# KonaAI UI – Copilot Instructions

## Big Picture Architecture
- **Monorepo managed by Nx**: Contains multiple Angular applications and shared libraries. Key apps are in `apps/`, shared code in `shared/`.
- **Main app**: `apps/KonaAI2` is the primary Angular application. Features are organized by domain in `src/app/` subfolders.
- **Shared libraries**: Reusable logic and models live in `shared/src/lib/`.
- **Standalone Angular components**: Many features use Angular's standalone component architecture for modularity.

## Developer Workflows
- **Start dev server**: `npx nx serve KonaAI2`
- **Build production**: `npx nx build KonaAI2`
- **Run unit tests**: `npx nx test shared` (for shared lib), `npx nx test KonaAI2` (for app)
- **Explore Nx graph**: `npx nx graph` for project dependencies
- **Generate new code**: Use Nx generators, e.g. `npx nx g @nx/angular:app demo` or `npx nx g @nx/angular:lib mylib`

## Project-Specific Patterns & Conventions
- **Feature folders**: Each domain (e.g. `documents`, `insights-entity-trans`) has its own folder with component, styles, tests, and README.
- **Routing**: Feature modules define their own routes, e.g. `/insights/entity-trans` for entity transaction insights.
- **Responsive design**: Use CSS Grid, Flexbox, and custom properties for theming (see feature READMEs for details).
- **Document management**: The `documents` feature supports file type icons, upload actions, and table-based UI.
- **Entity insights**: The `insights-entity-trans` feature provides risk analysis and transaction filtering.

## Integration Points
- **Angular Router**: Used for navigation between features.
- **Nx plugins**: For code generation and project management.
- **External dependencies**: Angular, Nx, and standard web libraries. See `package.json` for details.

## Key Files & Directories
- `apps/KonaAI2/src/app/` – Main app features
- `shared/src/lib/` – Shared logic and models
- `apps/KonaAI2/src/app/documents/README.md` – Documents feature details
- `apps/KonaAI2/src/app/insights/insights-entity-trans/README.md` – Entity transaction insights details
- `OrgKonaAI/README.md` – Nx workspace overview and commands

## Example: Adding a New Feature
1. Create a new folder in `apps/KonaAI2/src/app/`.
2. Add component, styles, tests, and a README describing usage and conventions.
3. Register routes in the app's routing module.
4. Use Nx generators for boilerplate if possible.

## References
- [Nx Documentation](https://nx.dev)
- [Angular Documentation](https://angular.io)

---
**Update this file if major architectural or workflow changes are made.**
