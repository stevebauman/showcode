## June 27th, 2022

**Added**

-   Rebuilt and integrated add/remove/focus line system to into code editor (Monaco)

## June 13th, 2022

**Added**

-   (Desktop) Ability to select system fonts in preview and preferences

## June 8th, 2022

**Fixed**

-   Light/Dark color scheme is now appropriately toggled when the OS color scheme is set to "auto"

**Added**

-   Light/Dark/Auto color scheme can now be toggled in the preferences modal
-   Light and Dark editor themes can now be selected in the preferences modal
-   Light/Dark color scheme is now toggled automatically when OS color scheme changes

## May 14th, 2022

**Fixed**

-   Aspect ratio is now properly maintained when resizing from any direction

**Changed**

-   Replaced image preview resizer with InteractJS
-   Implement project tab caching to increase performance with many open projects

## May 5th, 2022

**Added**

-   Frosted glass backdrop to modals
-   Replace custom global storage implementation with Pinia
-   Refactored entire localStorage mechanism to aid in future integrations
-   A cut-off overlay now appears when you shrink preview width past minimum dimensions

---

## April 29th, 2022

**Added**

-   Sortable tabs
-   Help Guide modal
-   Changelog modal (which you're reading now)
-   (Desktop) Help And GitHub links to "Help" OS menu
-   (Desktop) Ability to check for updates manually via the "File" OS menu

**Fixed**

-   (Desktop) Application auto-updater will now properly update to latest version
