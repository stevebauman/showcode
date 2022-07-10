<?php

namespace Tests;

use Laravel\Dusk\Browser;
use Tests\Components\Templates;
use Tests\Pages\App;
use Tests\Pages\Buy;

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

        $browser->within('@alert', function (Browser $browser) {
            $browser->assertSee('Successfully saved template.');
            $browser->click('.close-alert')->waitUntilMissing('@alert');
        });

        $browser->within(new Templates, function (Browser $browser) {
            $browser->open();

            $browser->within('@templates', function (Browser $browser) {
                expect($browser->elements('> *'))->toHaveCount(2);
            });
        });
    });
});

it('can delete existing template', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App);

        $browser->click('@button-file')->clickLink('Save As Template');

        $browser->waitFor('@alert');
        
        $browser->within('@alert', function (Browser $browser) {
            $browser->assertSee('Successfully saved template.');
            $browser->click('.close-alert')->waitUntilMissing('@alert');
        });

        $browser->within(new Templates, function (Browser $browser) {
            $browser->open();

            $browser->within('@templates', function (Browser $browser) {
                expect($browser->elements('> *'))->toHaveCount(2);
            });

            $browser->click('@button-remove-template')
                ->assertDialogOpened('Delete this template?')
                ->acceptDialog();

            $browser->within('@templates', function (Browser $browser) {
                expect($browser->elements('> *'))->toHaveCount(1);
            });
        });
    });
});

it('can import templates from previous version', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new Buy);

        $json = json_encode(
            json_decode(file_get_contents(__DIR__.'/fixtures/template.json'))
        );

        $browser->script(
            <<<JS
            window.indexedDB.deleteDatabase('keyval-store');
            
            window.localStorage.clear();
            window.localStorage.setItem('templates', '[$json]');
            JS
        );

        $browser->visit(new App);

        $browser->within(new Templates, function (Browser $browser) {
            $browser->open();

            $browser->within('@templates', function (Browser $browser) {
                expect($browser->elements('> *'))->toHaveCount(2);

                $browser->click('[data-template-id="fbd16ec6-75d3-40e1-b76a-de26a5906532"]');
            });
        });

        $browser
            ->waitFor('@tab-1')
            ->click('@tab-1')
            ->within('@page-1', function (Browser $browser) {
                $browser->assertSeeIn('@canvas', 'This is an example');
                $browser->assertVisible('@window-github-dark-dimmed');
            });
    });
});
