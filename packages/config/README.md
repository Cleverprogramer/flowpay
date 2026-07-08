# @flowpay/config

Shared TypeScript configuration for the Flowpay workspace.

This package keeps compiler defaults consistent across apps and packages, so each workspace can extend one base file instead of drifting into its own TypeScript rules.

## Files

| File | Purpose |
| --- | --- |
| `tsconfig.base.json` | Shared strict TypeScript settings, module resolution, path behavior, and compiler defaults |
| `package.json` | Private workspace package identity |

## Usage

Workspace `tsconfig.json` files extend the base config:

```json
{
  "extends": "@flowpay/config/tsconfig.base.json"
}
```

## Development Notes

- Keep this package small and boring.
- Prefer shared compiler behavior here when it applies to every workspace.
- Avoid app-specific paths or runtime assumptions in the base config.
