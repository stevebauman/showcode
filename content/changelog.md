## December 4th, 2022

**Changed**

-   Optimize themes tab with internal queue system and display spinner while loading

---

## October 24th, 2022

**Added**

-   Ability to duplicate tabs

---

## October 20th, 2022

**Changed**

-   Switch "Font Size" and "Line Height" select fields to text for unrestricted input

---

## October 10th, 2022

**Changed**

-   Further improve performance of the "Themes" tab

---

## October 2nd, 2022

**Fixed**

-   Custom scrollbar now works properly in Emoji picker

**Changed**

-   Code window width now expands to fix title without truncating text

---

## September 29th, 2022

**Added**

-   Custom scrollbars for unification of scrollable container UI
-   Always show scrollbars when content is hidden for clearer knowledge of scrollable containers
-   Scrolling vertically with a mouse wheel on horizontally scrolling containers will now scroll horizontally

---

## September 9th, 2022

**Added**

-   Code editor emoji picker

---

## August 21st, 2022

**Changed**

-   Proportionally scale UI elements when zooming on the canvas

---

## August 6th, 2022

**Added**

-   Six (6) new mesh gradient backgrounds
-   (Desktop) Ability to add a custom background using CSS

**Changed**

-   Moved custom backgrounds to the front of the backgrounds grid
-   Moved "Add Custom Background" button into backgrounds grid to reduce tab size

---

## July 30th, 2022

**Added**

-   Ability to change code editor font family
-   Ability to change code editor font ligatures
-   Ability to change code preview focus blur strength

**Fixed**

-   (Desktop) System fonts will be properly used in code preview (regression)
-   Performance issue where "Themes" preview tab remained rendered, causing code previews to be generated when off-tab

---

## July 24th, 2022

**Added**

-   Ability to change code window position
-   Ability to change border radius' per corner
-   Ability to change code window padding per side

**Fixed**

-   "Fit to Window" lock now properly respects window padding

---

## July 19th, 2022

**Added**

-   Ability to change code editor font size

**Fixed**

-   "Fit to Window" lock now properly respects window scale

---

## July 10th, 2022

**Added**

-   Move storage mechanism from LocalStorage to IndexedDB for un-capped storage limits

**Fixed**

-   Regression bug with "Fit to Window" button not properly resizing to the code window's width and height

---

## July 9th, 2022

**Added**

-   Ability to lock "Fit to Window" with padding constraints

---

## July 3rd, 2022

**Added**

-   Ability to change border styling (width, color)
-   Ability to change shadow styling (x, y, blur, spread & color)

---

## June 29th, 2022

**Added**

-   Close/open animations for tabs and preview controls
-   Rebuilt and integrated add/remove/focus line system to into code editor (Monaco)

---

## June 13th, 2022

**Added**

-   (Desktop) Ability to select system fonts in preview and preferences

---

## June 8th, 2022

**Fixed**

-   Light/Dark color scheme is now appropriately toggled when the OS color scheme is set to "auto"

**Added**

-   Light/Dark/Auto color scheme can now be toggled in the preferences modal
-   Light and Dark editor themes can now be selected in the preferences modal
-   Light/Dark color scheme is now toggled automatically when OS color scheme changes

---

## May 14th, 2022

**Fixed**

-   Aspect ratio is now properly maintained when resizing from any direction

**Changed**

-   Replaced image preview resizer with InteractJS
-   Implement project tab caching to increase performance with many open projects

---

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
