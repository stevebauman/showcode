<?php

namespace Tests;

use Laravel\Dusk\Browser;
use Tests\Pages\App;

it('can load', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App)
            ->waitForText('Untitled Project');
    });
});

it('can toggle dark mode', function () {
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
});

it('can add tabs', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App)
            ->click('@button-add-tab')
            ->assertVisible('@tab-1')
            ->click('@button-add-tab')
            // Desktop only.
            ->assertMissing('@tab-2');
    });
});

it('can remove tabs', function () {
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
});

it('can rename tabs', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App)
            ->mouseover('@tab-0')
            ->click('@button-edit-tab')
            ->type('@input-tab-name', 'Foo bar')
            ->click('@button-edit-tab')
            ->assertSeeIn('@tab-0', 'Foo bar');
    });
});
