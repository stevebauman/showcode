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

it('can toggle top orientation', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App)
            ->within('@editors', function (Browser $browser) {
                $browser->click('@button-toggle-portrait');
            });

        $browser->within('@page-0', function (Browser $browser) {
            $browser->assertVisible('.gutter-vertical');
        });
    });
});

it('can resize editor panes', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App)
            ->with('@editors', function (Browser $browser) {
                $browser->click('@button-add');

                $editor = $browser->elements('@editor')[0];

                expect($editor->getAttribute('style'))->toEqual('height: calc(50% - 2.5px);');

                $browser->dragUp('.gutter-vertical', 200);

                expect($editor->getAttribute('style'))->toEqual('height: calc(30.8978% - 2.5px);');
            });
    });
});
