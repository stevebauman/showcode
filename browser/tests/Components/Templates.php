<?php
 
namespace Tests\Components;

use Laravel\Dusk\Browser;
use Laravel\Dusk\Component;
 
class Templates extends Component
{
    /**
     * Get the root selector for the component.
     *
     * @return string
     */
    public function selector()
    {
        return '#__layout';
    }

    /**
     * Open the preferences modal.
     *
     * @param Browser $browser
     *
     * @return void
     */
    public function open(Browser $browser)
    {
        $browser
            ->click('@button-file')
            ->waitFor('@dropdown-file')
            ->clickLink('Open Saved Templates')
            ->waitFor('@modal-templates');
    }

    /**
     * Close the preferences. modal.
     *
     * @param Browser $browser
     *
     * @return void
     */
    public function close(Browser $browser)
    {
        $browser->click('.close-modal');
    }
}
