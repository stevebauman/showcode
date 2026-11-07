# Social preview

The shared Open Graph image is `public/images/social/showcode-workspace.jpg` (1200 × 630 JPEG).
The homepage, generator, and download page use this image through the shared head metadata in `nuxt.config.ts`. Generated Open Graph images are disabled for these routes so they do not replace the static artwork.

Generated with the built-in OpenAI image generation tool on November 7, 2026, then resized and encoded as a JPEG for delivery. The interface in this artwork is an illustrative rendering based on the application screenshots.

## References

- `public/images/download/workspace-v3@2x.png` — application layout and controls.
- `public/images/download/release-v3.png` — lighting and glass treatment.

## Generation prompt

Use case: ads-marketing
Asset type: final social sharing / Open Graph card for Showcode, landscape 1200:630 aspect ratio (approximately 1.905:1), polished premium desktop software launch art.
Create ONE beautifully composed finished image following the supplied real UI reference, not a grid of alternatives. This is an evergreen website social preview, not a version-specific release announcement.
Input image 1 is the real Showcode application UI and is the source of truth for the three-pane workspace, purple folded code-chevron logo, charcoal surfaces, rounded input fields, minimal icons, code preview, and floating pill toolbars. Input image 2 is a previous marketing image showing the desired refined glass and violet lighting; improve the balance and clarity.
Design: nearly black charcoal background, subtle diffuse violet/indigo atmospheric illumination concentrated behind the product, restrained bokeh. Left 38% contains a small accurate purple Showcode logo and wordmark 'Showcode', then a beautifully typeset large, left-aligned headline broken into three lines: 'Beautiful' / 'code.' / 'Beautifully shared.' Use modern neutral sans-serif, near-white, elegant medium weight; last line somewhat smaller so all text fits. Small muted descriptor at bottom left: 'Free. Open source. Yours.' and 'showcode.app'. Keep at least 60px safe margin.
Right 62% showcases a large crisp, believable Showcode desktop window occupying most of the right two thirds, with very slight perspective and softly rounded outer corners, realistic glass edge and shadow. Use the exact updated UI architecture: tab chrome at top, narrow code editor at left, beautiful purple/indigo gradient code canvas in center, compact inspector at right with W/H, Theme, Font size, and subtle switches; floating pill toolbars along the bottom. The hero code screenshot should be larger and clearly the focal point, using a short tasteful PHP snippet with colorful syntax and a tiny 'hello.php' title. No exaggerated texture or thick bevels.
One small floating translucent rounded settings panel with compact fields can overlap the far lower right of the workspace, showcasing frosted glass and refined tactile controls without clutter; its text may read 'Typography', 'Font size', '16', 'Line height', '24'. Align it carefully and keep away from main headline.
Quality: immaculate spacing, high-end software product photography / rendered interface composite, readable small UI, crisp large text, thoughtful negative space, calm and sophisticated. Restrained rather than flashy. Keep headline exactly spelled; no other marketing claims, no invented platform badges, no arbitrary icons, no duplicate main windows, no watermarks.

## Refinement

The final artwork removes the detached Typography panel, leaving the main application window as the only product visual. The original generation prompt above records the first version; this edit supersedes its floating-panel direction.

Edit prompt:

Edit this existing Showcode social image with one focused change: completely remove the separate floating 'Typography' settings popover in the bottom-right foreground, including its rounded glass box, shadow, and the 'Font size', '16', 'Line height', and '24' controls. Reconstruct the area it covered: continue the main application window's inspector and its bottom pill toolbar naturally, and the dark violet background outside the window. The only product visual should be the main Showcode application window. Keep everything else unchanged: exact logo and Showcode wordmark, headline 'Beautiful code.' and 'Beautifully shared.', footer 'Free. Open source. Yours.' and 'showcode.app', their typography and placement, window perspective and dimensions, the code screenshot, purple lighting, and overall layout. Preserve the built-in Typography section inside the right sidebar of the main window; remove ONLY the detached foreground popover. Do not add or replace it with any new inset, card, panel, or decoration. Preserve the existing wide aspect ratio.

A final accuracy pass restored the inspector's bottom navigation to Style, Themes, Backdrop, Scenes, and its sidebar-collapse icon, using the real application screenshot as reference.
