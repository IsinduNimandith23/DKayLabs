# Fonts

Drop the Neue Machina files here. The `@font-face` blocks at the top of
`app/globals.css` look for these exact names:

| File                          | Weight | Used for                          |
| ----------------------------- | ------ | --------------------------------- |
| `NeueMachina-Ultralight.*`    | 200    | —                                 |
| `NeueMachina-Light.*`         | 300    | white headline words              |
| `NeueMachina-Regular.*`       | 400    | "Build"                           |
| `NeueMachina-Medium.*`        | 500    | —                                 |
| `NeueMachina-Bold.*`          | 700    | —                                 |
| `NeueMachina-Ultrabold.*`     | 800    | orange headline words, "Together?" |
| `NeueMachina-Black.*`         | 900    | —                                 |

`.otf` and `.ttf` are both declared per weight, so the release's mix of the
two works as shipped — no renaming or conversion needed. Any weight whose
file is absent silently falls back to Plus Jakarta Sans.

Reach for `font-machina` in markup (see `tailwind.config.ts`).
