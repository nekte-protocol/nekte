# Plan: Landing Page + Docs Site

> Goal: Sitio profesional con landing page, docs searchables, API reference, desplegado en GitHub Pages.

---

## 1. Tool: Astro Starlight

| Tool | Evaluacion |
|------|-----------|
| **Astro Starlight** | Landing page custom + docs Starlight. Pagefind search gratis. Dark theme default. Component islands. **Elegido.** |
| Docusaurus | Maduro pero React-heavy, landing page menos flexible. |
| VitePress | Rapido pero Vue lock-in, landing limitada. |
| mkdocs-material | Bueno para Python-only, landing page rigida. |

---

## 2. Ubicacion

Dentro del monorepo: `website/` (anadido a pnpm workspace).

---

## 3. Estructura del sitio

```text
website/
  package.json
  astro.config.mjs
  tsconfig.json
  tailwind.config.mjs
  public/
    favicon.svg
    og-image.png
    robots.txt
    CNAME                               # nekte.dev
  src/
    assets/
      nekte-logo.svg
      hero-diagram.svg
    components/
      landing/
        Hero.astro                      # Tagline + 5-line code (TS/Python tabs)
        TokenSavings.astro              # Tabla de benchmarks
        Primitives.astro                # 8 primitivos en card grid
        Architecture.astro              # Diagrama hexagonal
        Comparison.astro                # MCP vs A2A vs NEKTE matrix
        Bridge.astro                    # "Trojan Horse" section
        QuickStart.astro                # npm/pip install tabs
        Footer.astro
      CodeExample.astro
      LanguageTabs.astro
    content/
      docs/
        getting-started/
          index.mdx                     # Quick start overview
          typescript.mdx                # TS client + server
          python.mdx                    # Python client + server
        protocol/
          overview.mdx                  # SPEC.md secciones 1-3
          primitives.mdx                # SPEC.md secciones 4.1-4.8
          task-lifecycle.mdx            # Seccion 5 + state machine
          agent-card.mdx                # Seccion 6
          transports.mdx                # Seccion 7 (HTTP, gRPC, WS, stdio)
          error-codes.mdx               # Seccion 9
        architecture/                   # NUEVO: explica DDD + Hexagonal
          overview.mdx                  # Por que hexagonal + DDD para un protocolo
          layers.mdx                    # Domain, Ports, Application, Adapters
          domain-model.mdx              # Aggregates, Value Objects, Domain Services
          ports-and-adapters.mdx        # Transport, CacheStore, StreamWriter, Auth
          dependency-rule.mdx           # Que puede importar que
          extending.mdx                 # Como anadir un nuevo transport/cache adapter
        api/
          typescript/
            client.mdx
            server.mdx
            core.mdx
          python/
            client.mdx
            server.mdx
        guides/
          progressive-discovery.mdx
          zero-schema.mdx
          streaming-delegate.mdx
          task-lifecycle.mdx
          mcp-bridge.mdx
          grpc.mdx
          authentication.mdx
          cache.mdx                     # SIEVE, GDSF, SWR
        examples/
          two-agents.mdx
          mcp-migration.mdx
        reference/
          spec.mdx
          protocol-flows.mdx
          benchmarks.mdx
          changelog.mdx
    pages/
      index.astro                       # Landing page
    styles/
      landing.css
      global.css
```

---

## 4. Seccion de Arquitectura (nuevo)

Lo que faltaba: documentar los patrones DDD + Hexagonal para que contribuidores y usuarios avanzados entiendan el diseno.

### 4.1 `architecture/overview.mdx`

Por que NEKTE usa hexagonal + DDD:
- El protocolo tiene multiples transports (HTTP, gRPC, WS, stdio) → ports & adapters natural
- Los tipos del protocolo son el domain model (Value Objects inmutables)
- Task lifecycle es un Aggregate Root con state machine validada
- Cache tiene domain logic pura (SIEVE) separada de infraestructura (Map)
- Los mismos patterns en TypeScript y Python → cross-SDK consistencia

### 4.2 `architecture/layers.mdx`

Las 4 capas con diagramas y ejemplos de cada SDK:

```text
Domain (pura, zero I/O)
  ├── Value Objects: TokenBudget, CapabilityRef, SseEvent
  ├── Aggregate Root: TaskEntry (state machine)
  ├── Domain Errors: TaskTransitionError, NekteProtocolError
  └── Pure Algorithms: SievePolicy, canonicalize(), resolve_budget()

Ports (interfaces/protocols, solo firmas)
  ├── Transport: rpc(), stream(), get(), close()
  ├── CacheStore: get(), set(), delete(), keys(), size, clear()
  ├── AuthHandler: authenticate()
  ├── DelegateHandler: (task, stream, context, signal) -> void
  └── StreamWriter: progress(), partial(), complete(), error()

Application (orquesta domain + ports)
  ├── NekteClient: Discovery + Invoke + Delegate + Task Lifecycle
  ├── NekteServer: Dispatch + Capability Registry + Task Registry
  ├── CapabilityCache: SWR + Negative + Revalidation
  └── RequestCoalescer: Thundering herd prevention

Adapters (implementa ports)
  ├── Outbound: HttpTransport, GrpcTransport, InMemoryCacheStore
  └── Inbound: HttpServer, SseStreamWriter, BearerAuth
```

### 4.3 `architecture/domain-model.mdx`

Mapeo DDD con diagramas:

| Patron | TypeScript | Python | Responsabilidad |
|--------|-----------|--------|----------------|
| Value Object | `TokenBudget` (type) | `TokenBudget` (Pydantic) | Inmutable, serializable |
| Aggregate Root | `TaskEntry` | `TaskEntry` | State machine con transiciones validadas |
| Domain Service | `CapabilityRegistry` | `CapabilityRegistry` | Register, filter, invoke |
| Repository | `TaskRegistry` | `TaskRegistry` | CRUD + cleanup + domain events |
| Application Service | `NekteClient` | `NekteClient` | Orquesta ports |
| Port | `Transport` (interface) | `Transport` (Protocol) | Contrato sin implementacion |
| Adapter | `HttpTransport` (class) | `HttpTransport` (class) | Implementa port con httpx/fetch |

### 4.4 `architecture/ports-and-adapters.mdx`

Para cada port, documentar:
- La interfaz completa con firmas
- Los adapters existentes (TS y Python)
- Como crear un adapter custom (con ejemplo)

### 4.5 `architecture/dependency-rule.mdx`

La regla de oro con diagrama de imports permitidos:

```text
Domain  ←── Ports  ←── Application  ←── Adapters
  ↑           ↑            ↑               ↑
  │           │            │               │
  NO importa  Solo         Solo            Puede
  NADA        Domain       Domain+Ports    importar
                                           TODO
```

Ejemplos concretos de violaciones y como corregirlas.

### 4.6 `architecture/extending.mdx`

Tutorial: "Como anadir un nuevo transport adapter"

1. Implementar la interfaz `Transport` (Port)
2. Registrarlo en el `NekteClient` via constructor
3. Tests: ejecutar contract tests contra el nuevo adapter
4. No tocar domain/ ni application/

Tutorial: "Como anadir un nuevo cache store"

1. Implementar la interfaz `CacheStore` (Port)
2. Asegurar que retorna `CacheGetResult` con freshness states
3. Ejecutar contract tests
4. Inyectar via `CacheConfig.store`

---

## 5. Landing Page — Secciones

### Hero

- Tagline: "Agent coordination that doesn't waste your context window."
- 5-line code con tabs TS/Python
- CTAs: "Get Started" + "Read the Spec"

### Token Savings

- Tabla de benchmarks (datos de SPEC.md)
- "-99% vs MCP"
- Enterprise: "$10,890/mo -> $146/mo"

### 8 Primitivos

- Card grid con icono + nombre + descripcion + token cost

### Arquitectura

- Diagrama hexagonal interactivo: Domain -> Ports -> Application -> Adapters
- Muestra los 4 transports como adapters intercambiables

### Comparacion

- Feature matrix: MCP vs A2A vs RTK vs NEKTE

### Bridge

- "Trojan Horse" diagram
- "90%+ savings, zero backend changes, day 1"

### Quick Start

- Tabs: `npm install @nekte/client` / `pip install nekte`

---

## 6. Migracion de contenido

| Fuente | Destino | Tratamiento |
|--------|---------|-------------|
| docs/SPEC.md | Split en protocol/*.mdx + reference/spec.mdx | Dividir por seccion |
| docs/GETTING_STARTED.md | getting-started/typescript.mdx | MDX + tabs |
| docs/PROTOCOL_FLOWS.md | reference/protocol-flows.mdx | Mermaid rendering |
| docs/CACHE_ARCHITECTURE.md | guides/cache.mdx | Traducir a ingles |
| README.md | Landing page components | Descomponer |
| **(nuevo)** | architecture/*.mdx | Escribir desde cero |

---

## 7. API Reference

### TypeScript (auto-generado)

```json
{
  "scripts": {
    "generate:api": "typedoc --plugin typedoc-plugin-markdown --out src/content/docs/api/typescript ../packages/client/src/index.ts ../packages/server/src/index.ts ../packages/core/src/index.ts",
    "build": "pnpm generate:api && astro build"
  }
}
```

La API reference debe mostrar claramente a que capa pertenece cada clase:
- `[Domain]` para Value Objects y Aggregates
- `[Port]` para interfaces
- `[Application]` para services
- `[Adapter]` para implementaciones

### Python (manual hasta estabilizar)

Paginas con firmas de API agrupadas por capa.

---

## 8. SEO

```js
export default defineConfig({
  site: 'https://nekte.dev',
  integrations: [
    starlight({
      title: 'NEKTE Protocol',
      description: 'Token-efficient agent-to-agent coordination protocol',
      social: { github: 'https://github.com/nekte-protocol/nekte' },
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: '/og-image.png' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
      ],
      editLink: { baseUrl: 'https://github.com/nekte-protocol/nekte/edit/main/website/' },
    }),
    sitemap(),
  ],
});
```

---

## 9. Deployment

### GitHub Actions

```yaml
name: Deploy Docs
on:
  push:
    branches: [main]
    paths: ['website/**', 'docs/**', 'packages/*/src/**']
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter website build
      - uses: actions/upload-pages-artifact@v3
        with: { path: website/dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Custom Domain + Analytics

- `website/public/CNAME` con `nekte.dev`
- Plausible analytics (privacy-first, sin cookies)

---

## 10. Fases de Implementacion

| Fase | Trabajo | Esfuerzo | Deps |
|------|---------|----------|------|
| **F1: Scaffold** | Astro + Starlight + workspace | 0.5 dias | Ninguna |
| **F2: Landing page** | Hero, TokenSavings, Primitives, Architecture, Comparison, Bridge, QuickStart | 2-3 dias | F1 |
| **F3: Content migration** | Split SPEC.md, convertir docs existentes | 2 dias | F1 |
| **F4: Architecture docs** | overview, layers, domain-model, ports-and-adapters, dependency-rule, extending | 2-3 dias | F3 |
| **F5: API reference** | TypeDoc setup + integracion Starlight | 1-2 dias | F1 |
| **F6: Guides** | discovery, zero-schema, streaming, bridge, cache, grpc | 2-3 dias | F3 |
| **F7: SEO + analytics + CI** | Meta tags, sitemap, Plausible, GitHub Actions | 1 dia | F2 |
| **F8: Polish** | Responsive, search, dark/light, code tabs | 1-2 dias | F2-F6 |

**Total: ~12-16 dias.**

---

## 11. Criterios de Exito

- Landing page Lighthouse >90
- Pagefind search funcional
- API reference auto-generada en cada push
- **Seccion Architecture completa**: 6 paginas explicando DDD + Hexagonal
- **API reference etiquetada por capa**: [Domain], [Port], [Application], [Adapter]
- Mermaid diagrams renderizan correctamente
- SEO: Open Graph, sitemap, structured data
- Mobile responsive
- Deploy automatico en push a main
