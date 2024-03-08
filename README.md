# Adaptive Game Engine

## Information
Engine for creating adaptive animations and small games.\
**Version backward compatibility is NOT supported.**

## Feed
### 1.3.1 : Adaptive Core 2.6.8 (09.03.2024)
- Core updated.

### Update 1.3.0 : AWT 2.5.0 (27.01.2024)
- Updated core.
- Added comments with descriptions to all components.

### Update 1.2.7 (12.01.2024) : 2.4.1
- Updated core.

### Update 1.2.6 (08.01.2024) : 2.3.8
- Now, the coordinate plane coincides with the mathematical coordinate plane.
- Added the `Entity.getAreaSector` function, which shows in which sector the object is located relative to it.
- Work on optimization.
- Added the `Corporeal.getCollision` function, which shows collision points of objects if they exist. To achieve this, you need to implement the `isMesh` function on objects - it indicates whether a point belongs to this object or not.

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