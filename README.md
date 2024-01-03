# Adaptive Game Engine

## Information
Engine for creating adaptive games. Based on Adaptive Webpage Template.

## Feed
### Update 1.2.4 (03.01.2024) : 2.3.7
- Updated the core.
- Now, each connected element will trigger an event `new Event("render")` during rendering.
- The `Group` collection can now be initialized with initial elements.
- Additionally, you can get the length of the collection using `Group.size`.
- Added the `UserInterface` class and its initial instance `userInterface`. `UserInterface` is an object that automatically transforms to the full screen size. The transformation of this object cannot be manually changed, and it can only be adopted from `Progenitor`.
- Optimized functions of the `Renderer` class.

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