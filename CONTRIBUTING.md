# Contributing

1. Fork this repo.
2. Run `npm install`.
3. Make your changes.
4. Update the tests and validate they all pass. Please keep coverage at 100% across all metrics.
5. Update the README to include any relevant changes to the source code. This includes updates to TSDocs, new methods,
   functionality, behavior etc.
6. Run `npm run build` to update the built files and include them in your PR.
7. Run an `npm test` to update test coverage information.
9. Open a Pull Request.

## Suggestions
* Please avoid adding any dependencies. Additional dev dependencies are okay, but I prefer this to remain at 0 production dependencies. Even for dev dependencies I'd like to keep it small.
* Don't worry updating the version in your PR. Based on the changes made, I'll update your PR when it's ready with the appropriate verion. I am using semantic versioning rules.
* Please follow the existing style and ensure any changes have complete documentation.
* Line length should not exceed to 72 characters in src files.

## Style Guide
* Use `const` wherever possible (prefering it over the `function` keyword).
* Specify return types on methods or functions.
* Line length for code should be a max of 72 characters.
* All methods should have TSDocs with examples if the method is sufficiently complex
* No default exports. Everything should be a named export.
