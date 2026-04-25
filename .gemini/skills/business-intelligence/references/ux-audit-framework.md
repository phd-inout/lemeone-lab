# Lemeone UI/UX Code-Based Audit Framework

This framework allows the Cortex AI to evaluate the visual and interactive quality (D3 and D14) of a project by analyzing its code fingerprints.

## 1. Visual Trust & Consistency (D3/D14)
*   **Design Tokens**: Presence of `tailwind.config.ts`, `theme.json`, or CSS variables. 
    *   *High Quality*: Defined color palettes, spacing scales, and typography presets.
    *   *Low Quality*: Hardcoded hex values or arbitrary pixel values in components.
*   **Typography**: Use of systematic font-scaling and fluid typography.
*   **Asset Management**: Optimization of SVGs, use of modern image formats, and icon library consistency (e.g., Lucide, Phosphor).

## 2. Interactive Feedback & Motion (D3)
*   **Micro-interactions**: Usage of `framer-motion`, `gsap`, or CSS transitions.
    *   *Audit Point*: Are there animations for entry, exit, and state changes?
*   **Loading States**: Presence of Skeleton screens, loading spinners, or `Suspense` boundaries.
    *   *High Quality*: The UI feels "alive" and responsive during data fetching.

## 3. Onboarding & Friction (D5/D14)
*   **Onboarding Flow**: Code presence of multi-step forms, tour guides (e.g., `react-joyride`), or "empty states".
*   **Form UX**: Use of `react-hook-form`, `zod` for real-time validation, and clear error messaging.

## 4. Professionalism & Polish (D3)
*   **Component Composition**: Use of headless UI libraries (Radix, Headless UI, Ariakit). 
    *   *Significance*: Indicates focus on accessibility (ARIA) and robust interaction logic rather than just "pretty boxes".
*   **Responsive Rigor**: Evidence of mobile-first coding patterns and container queries.

## 5. Scoring Logic for AI
*   **Score 0.8+**: Project uses a strict design system, includes micro-interactions, handles all loading/error states, and prioritizes accessibility.
*   **Score 0.5**: Standard library usage (Tailwind default) with basic layouts but missing advanced polish.
*   **Score < 0.3**: No systematic styling, missing interactive feedback, and inconsistent component usage.
