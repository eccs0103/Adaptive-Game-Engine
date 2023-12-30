# Adaptive Game Engine

## Information
Engine for creating adaptive games. Based on Adaptive Webpage Template.

## Feed
### Update 1.2.0 (31.12.2023) : 2.3.6
- The context size will now adjust to the screen size.
- Numerous errors have been fixed.
- Measurement handling has been optimized.
- Added calculation of the global position through `Entity.globalPosition` and those who inherit it.
- Added the `InterfaceItem` component, representing a user interface element.
- Also added the `userInterface` constant, which serves as the parent for interface elements.
- Added the `Utilities.js` script, which includes the following components:
  - `Animator` helps create containers for animation.
  - `Walker` traverses the tree of `Node` and performs a series of auxiliary actions.
  - `Renderer` assists in rendering elements.

### Release 1.0.0 (30.12.2023) : 2.3.6
*First stable version.*