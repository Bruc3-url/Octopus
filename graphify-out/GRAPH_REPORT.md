# Graph Report - Octopus  (2026-10-27)

## Corpus Check
- Corpus is ~1,450 words - fits in a single context window. You may not need a graph.

## Summary
- 137 nodes · 164 edges · 29 communities (9 shown, 20 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 1% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Expo workflow and agent rules
- Expo app configuration
- Core Expo runtime dependencies
- Project reset script
- Package manifest and dev tooling
- TypeScript path configuration
- Android adaptive icon config
- npm scripts
- Supabase client setup
- expo-device dependency
- expo-font dependency
- expo-image dependency
- expo-linking dependency
- expo-splash-screen dependency
- expo-status-bar dependency
- expo-symbols dependency
- expo-system-ui dependency
- @expo/ui dependency
- react dependency
- react-dom dependency
- gesture-handler dependency
- reanimated dependency
- safe-area-context dependency
- screens dependency
- url-polyfill dependency
- react-native-web dependency
- worklets dependency

## God Nodes (most connected - your core abstractions)
1. `expo` - 13 edges
2. `scripts` - 7 edges
3. `adaptiveIcon` - 5 edges
4. `Yostin (mobile app agent persona)` - 4 edges
5. `Expo Go limited to bundled native modules` - 4 edges
6. `android` - 3 edges
7. `web` - 3 edges
8. `experiments` - 3 edges
9. `@supabase/supabase-js` - 3 edges
10. `compilerOptions` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Active graphify graph consultation directive` --semantically_similar_to--> `Do not trust training data: fetch versioned Expo docs`  [INFERRED] [semantically similar]
  .github/agents/yostin.agent.md → AGENTS.md
- `Yostin (mobile app agent persona)` --conceptually_related_to--> `Expo Go as a limited sandbox`  [INFERRED]
  .github/agents/yostin.agent.md → README.md
- `File-based routing via src/app` --semantically_similar_to--> `Expo Router file-based navigation in src/app`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Expo Go as a limited sandbox` --semantically_similar_to--> `Expo Go limited to bundled native modules`  [INFERRED] [semantically similar]
  README.md → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Expo Go limitation to development build workflow** — _github_agents_yostin_agent_yostin, agents_expo_go_native_module_limit, agents_expo_development_build, readme_expo_go_limited_sandbox, agents_prefer_expo_modules [INFERRED 0.85]

## Communities (29 total, 20 thin omitted)

### Community 0 - "Expo workflow and agent rules"
Cohesion: 0.15
Nodes (12): Active graphify graph consultation directive, Yostin (mobile app agent persona), EAS cloud build, submit and OTA updates, Development build fallback for native code, Expo Go limited to bundled native modules, Expo Router file-based navigation in src/app, Run lint and typecheck before declaring a task done, CLAUDE.md (@AGENTS.md include) (+4 more)

### Community 1 - "Expo app configuration"
Cohesion: 0.11
Nodes (17): reactCompiler, typedRoutes, expo, experiments, icon, ios, name, orientation (+9 more)

### Community 2 - "Core Expo runtime dependencies"
Cohesion: 0.15
Nodes (13): dependencies, expo@~58.0.19, expo-constants@~58.0.13, expo-glass-effect@~58.0.5, expo-router@~58.0.26, expo-web-browser@~58.0.6, react-native@0.88.0, expo (+5 more)

### Community 3 - "Project reset script"
Cohesion: 0.15
Nodes (8): exampleAssets, exampleDirPath, fs, oldDirs, path, readline, rl, root

### Community 4 - "Package manifest and dev tooling"
Cohesion: 0.24
Nodes (9): devDependencies, @types/react@~19.3.0, typescript@~6.0.3, main, name, private, version, @types/react (+1 more)

### Community 5 - "TypeScript path configuration"
Cohesion: 0.25
Nodes (7): expo/tsconfig.base, compilerOptions, paths, strict, extends, include, @/assets/*

### Community 6 - "Android adaptive icon config"
Cohesion: 0.29
Nodes (7): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, android

### Community 7 - "npm scripts"
Cohesion: 0.29
Nodes (7): scripts, android, ios, lint, reset-project, start, web

### Community 8 - "Supabase client setup"
Cohesion: 0.50
Nodes (3): @supabase/supabase-js@^2.118.0, @supabase/supabase-js, supabase

## Ambiguous Edges - Review These
- `Expo Router file-based navigation in src/app` → `Continuous Native Generation (do not hand-edit ios/android)`  [AMBIGUOUS]
  AGENTS.md · relation: conceptually_related_to

## Knowledge Gaps
- **5 isolated node(s):** `expo/tsconfig.base`, `Run lint and typecheck before declaring a task done`, `CLAUDE.md (@AGENTS.md include)`, `create-expo-app starter scaffold`, `reset-project script`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 54 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Core Expo runtime dependencies` to `Package manifest and dev tooling`, `Supabase client setup`, `expo-device dependency`, `expo-font dependency`, `expo-image dependency`, `expo-linking dependency`, `expo-splash-screen dependency`, `expo-status-bar dependency`, `expo-symbols dependency`, `expo-system-ui dependency`, `@expo/ui dependency`, `react dependency`, `react-dom dependency`, `gesture-handler dependency`, `reanimated dependency`, `safe-area-context dependency`, `screens dependency`, `url-polyfill dependency`, `react-native-web dependency`, `worklets dependency`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Yostin (mobile app agent persona)` (e.g. with `AGENTS.md` and `Expo Go as a limited sandbox`) actually correct?**
  _`Yostin (mobile app agent persona)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `expo/tsconfig.base`, `Run lint and typecheck before declaring a task done`, `CLAUDE.md (@AGENTS.md include)` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Expo workflow and agent rules` be split into smaller, more focused modules?**
  _Cohesion score 0.14619883040935672 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `npm scripts` to `Package manifest and dev tooling`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `Expo app configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Expo Router file-based navigation in src/app` and `Continuous Native Generation (do not hand-edit ios/android)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._