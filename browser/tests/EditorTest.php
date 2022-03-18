<?php

namespace Tests;

use Laravel\Dusk\Browser;
use Tests\Pages\App;

it('can change tab size', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App)
            ->select('@select-tab-size', '2')
            ->assertSeeIn('@select-tab-size', '2');
    });
});

it('can change language', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App)
            ->select('@select-language', 'html')
            ->assertSeeIn('@select-language', 'html');
    });
});

it('can add new editors', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App)
            ->with('@editors', function (Browser $editor) {
                $editors = $editor
                    ->click('@button-add')
                    ->click('@button-add')
                    ->elements('@editor');

                $this->assertCount(3, $editors);
            });
    });
});
