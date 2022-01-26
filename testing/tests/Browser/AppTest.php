<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\Browser\Pages\App;
use Tests\DuskTestCase;

class AppTest extends DuskTestCase
{
    public function testPageLoads()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(new App)
                ->assertSee('Untitled Project');
        });
    }

    public function testDarkModeToggle()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(new App)
                ->assertVisible('.feather-sun')
                ->click('@button-toggle-dark')
                ->assertMissing('.feather-sun')
                ->assertVisible('.feather-moon')
                ->click('@button-toggle-dark')
                ->assertMissing('.feather-moon')
                ->assertVisible('.feather-sun');
        });
    }

    public function testTabsCanBeAdded()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(new App)
                ->click('@button-add-tab')
                ->assertVisible('@tab-1')
                ->click('@button-add-tab')
                // Desktop only.
                ->assertMissing('@tab-2');
        });
    }
    
    public function testTabsCanBeClosed()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(new App)
                ->click('@button-add-tab')
                ->waitFor('@tab-1')
                ->within('@tab-1', function (Browser $tab) {
                    $tab->click('@button-close-tab');
                })
                ->assertMissing('@tab-1')
                ->assertVisible('@tab-0');
        });
    }

    public function testTabsCanBeRenamed()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(new App)
                ->mouseover('@tab-0')
                ->click('@button-edit-tab')
                ->type('@input-tab-name', 'Foo bar')
                ->click('@button-edit-tab')
                ->assertSeeIn('@tab-0', 'Foo bar');
        });
    }
}
