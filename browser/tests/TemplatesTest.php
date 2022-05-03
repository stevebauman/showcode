<?php

namespace Tests;

use Laravel\Dusk\Browser;
use Tests\Components\Templates;
use Tests\Pages\App;

afterEach(function () {
    $this->browse(function (Browser $browser) {
        $browser->script('window.localStorage.clear();');
    });
});

it('can save project as template', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App);

        $browser->within(new Templates, function (Browser $browser) {
            $browser->open();

            $browser->within('@templates', function (Browser $browser) {
                expect($browser->elements('> *'))->toHaveCount(1);
            });

            $browser->close();
        });
        
        $browser->click('@button-file')->clickLink('Save As Template');

        $browser->waitFor('@alert');

        $browser->assertSeeIn('@alert', 'Successfully saved template.');

        $browser->within(new Templates, function (Browser $browser) {
            $browser->open();

            $browser->within('@templates', function (Browser $browser) {
                expect($browser->elements('> *'))->toHaveCount(2);
            });
        });
    });
});
