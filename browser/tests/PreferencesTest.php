<?php

namespace Tests;

use Laravel\Dusk\Browser;
use Tests\Components\Preferences;
use Tests\Pages\App;

it('can open preferences modal', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App);

        $browser->within(new Preferences, function (Browser $browser) {
            $browser->open()->assertSee('Preferences');
        });
    });
});

it('can set editor position preference', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App);

        $classes = $browser->element('@page-0')->getAttribute('class');

        expect(str($classes)->contains('lg:flex-row-reverse'))->toBeFalse();

        $browser->within(new Preferences, function (Browser $browser) {
            $browser->open();

            $browser->select('@select-orientation', 'right');

            $browser->close();
        });

        $browser->click('@button-add-tab')->waitFor('@page-1');

        $classes = $browser->element('@page-1')->getAttribute('class');

        expect(str($classes)->contains('lg:flex-row-reverse'))->toBeTrue();
    });
});

it('can toggle strip initial PHP tag', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App);

        $browser->within(new Preferences, function (Browser $browser) {
            $browser->open();

            $browser
                ->assertSee('Preferences')
                ->click('@toggle-strip-php-tag')
                ->close();
        });

        $browser->waitForTextIn('@canvas', '<?php');
    });
});

it('can toggle always lock fit to window', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App);

        $browser->within(new Preferences, function (Browser $browser) {
            $browser->open();

            $browser
                ->assertSee('Preferences')
                ->click('@toggle-preview-lock-to-window')
                ->assertVisible('@input-preview-lock-to-window-padding-x')
                ->assertVisible('@input-preview-lock-to-window-padding-y')
                ->type('@input-preview-lock-to-window-padding-x', 200)
                ->type('@input-preview-lock-to-window-padding-y', 200)
                ->close();
        });

        $browser
            ->click('@button-add-tab')
            ->assertSeeIn('@canvas-height', 300)
            ->assertSeeIn('@canvas-width', 426);
    });
});
