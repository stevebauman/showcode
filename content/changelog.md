## May 6th, 2024

**Changed**

- Light and dark application color schemes now have a more consistent color palette
- Default dark editor theme is now `Merbivore`

---

## May 3rd, 2024

**Added**

- Ability to save custom background colors

**Changed**

- Merge header toggles into one popover

---

## April 28th, 2024

**Added**

- Ability to select custom background colors

---

## April 19th, 2024

**Added**

- X social network badge icon

---

## April 18th, 2024

**Added**

- Ability to display a social network badge on the code preview

---

## January 1st, 2024

**Added**

- Ability to export snippet's JSON for a Showcode API request

**Fixed**

- Code preview height input field

---

## December 18th, 2023

**Added**

- [Bluloco Dark theme](https://github.com/uloco/theme-bluloco-dark)
- [Bluloco Light Theme](https://github.com/uloco/theme-bluloco-light)
- [Rajoyish Light Theme](https://github.com/rajoyish/rajoyish-light-theme)

## December 16th, 2023

**Added**

- [Wes Bos Cobalt2 theme](https://github.com/wesbos/cobalt2-vscode)
- [Geist Mono font](https://vercel.com/font/mono)

---

## December 15th, 2023

**Changed**

- Remove borders from inputs and other UI elements for a flatter and cleaner look

**Fixed**

- Truncate long tab names to prevent conflicting with tab actions dropdown

---

## May 11th, 2023

**Added**

- Handpicked backgrounds from https://codioful.com

---

## March 23rd, 2023

**Added**

- White Pest background image
- "API" button for quick access to API docs website

**Changed**

- Always show "Close Tab" button when tab is active and on mouse hover
- Code window now has a border accent to appear more like a real OS window

**Fixed**

- Faux menu colour on High Contrast theme is now appropriately coloured

---

## March 20th, 2023

**Added**

- Pest background image

---

## February 19th, 2023

**Changed**

- Show close button on left side of tabs and center title

---

## January 30th, 2023

**Added**

- Ability to toggle the display of "dividers" when multiple code editors exist
- (Web) Display error message when attempting to copy with no clipboard access

**Changed**

- Removed border effects around UI for a flatter interface 

---

## January 28th, 2023

**Added**

- Hovering over a background now displays a tooltip of its name for use in Showcode API

---

## January 25th, 2023

**Added**

- Closing a project that has been modified will now ask for confirmation before doing so

**Changed**

- Removed glass effect on modal backdrops
- Replaced tab actions with an options dropdown

**Fixed**

- Debounced opacity slider for better performance

---

## January 16th, 2023

**Added**

- Allow code window to be grabbed for moving canvas around
- Show hover border around title to further indicate the title input field

---

## January 13th, 2023

**Changed**

- Reduce rendered code length on "Themes" tab to improve performance

---

## January 4th, 2023

**Added**

- Ability to toggle code window header accent for cleaner shots

---

## December 5th, 2022

**Changed**

- Updated design language of buttons, inputs, modals, and popovers

---

## December 4th, 2022

**Changed**

- Optimize themes tab with internal queue system and display spinner while loading

---

## October 24th, 2022

**Added**

- Ability to duplicate tabs

---

## October 20th, 2022

**Changed**

- Switch "Font Size" and "Line Height" select fields to text for unrestricted input

---

## October 10th, 2022

**Changed**

- Further improve performance of the "Themes" tab

---

## October 2nd, 2022

**Fixed**

- Custom scrollbar now works properly in Emoji picker

**Changed**

- Code window width now expands to fix title without truncating text

---

## September 29th, 2022

**Added**

- Custom scrollbars for unification of scrollable container UI
- Always show scrollbars when content is hidden for clearer knowledge of scrollable containers
- Scrolling vertically with a mouse wheel on horizontally scrolling containers will now scroll horizontally

---

## September 9th, 2022

**Added**

- Code editor emoji picker

---

## August 21st, 2022

**Changed**

- Proportionally scale UI elements when zooming on the canvas

---

## August 6th, 2022

**Added**

- Six (6) new mesh gradient backgrounds
- (Desktop) Ability to add a custom background using CSS

**Changed**

- Moved custom backgrounds to the front of the backgrounds grid
- Moved "Add Custom Background" button into backgrounds grid to reduce tab size

---

## July 30th, 2022

**Added**

- Ability to change code editor font family
- Ability to change code editor font ligatures
- Ability to change code preview focus blur strength

**Fixed**

- (Desktop) System fonts will be properly used in code preview (regression)
- Performance issue where "Themes" preview tab remained rendered, causing code previews to be generated when off-tab

---

## July 24th, 2022

**Added**

- Ability to change code window position
- Ability to change border radius' per corner
- Ability to change code window padding per side

**Fixed**

- "Fit to Window" lock now properly respects window padding

---

## July 19th, 2022

**Added**

- Ability to change code editor font size

**Fixed**

- "Fit to Window" lock now properly respects window scale

---

## July 10th, 2022

**Added**

- Move storage mechanism from LocalStorage to IndexedDB for un-capped storage limits

**Fixed**

- Regression bug with "Fit to Window" button not properly resizing to the code window's width and height

---

## July 9th, 2022

**Added**

- Ability to lock "Fit to Window" with padding constraints

---

## July 3rd, 2022

**Added**

- Ability to change border styling (width, color)
- Ability to change shadow styling (x, y, blur, spread & color)

---

## June 29th, 2022

**Added**

- Close/open animations for tabs and preview controls
- Rebuilt and integrated add/remove/focus line system to into code editor (Monaco)

---

## June 13th, 2022

**Added**

- (Desktop) Ability to select system fonts in preview and preferences

---

## June 8th, 2022

**Fixed**

- Light/Dark color scheme is now appropriately toggled when the OS color scheme is set to "auto"

**Added**

- Light/Dark/Auto color scheme can now be toggled in the preferences modal
- Light and Dark editor themes can now be selected in the preferences modal
- Light/Dark color scheme is now toggled automatically when OS color scheme changes

---

## May 14th, 2022

**Fixed**

- Aspect ratio is now properly maintained when resizing from any direction

**Changed**

- Replaced image preview resizer with InteractJS
- Implement project tab caching to increase performance with many open projects

---

## May 5th, 2022

**Added**

- Frosted glass backdrop to modals
- Replace custom global storage implementation with Pinia
- Refactored entire localStorage mechanism to aid in future integrations
- A cut-off overlay now appears when you shrink preview width past minimum dimensions

---

## April 29th, 2022

**Added**

- Sortable tabs
- Help Guide modal
- Changelog modal (which you're reading now)
- (Desktop) Help And GitHub links to "Help" OS menu
- (Desktop) Ability to check for updates manually via the "File" OS menu

**Fixed**

- (Desktop) Application auto-updater will now properly update to latest version
