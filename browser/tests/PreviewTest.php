<?php

namespace Tests;

use Laravel\Dusk\Browser;
use Tests\Pages\App;

it('can change backgrounds', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App)
            ->within('@preview', function (Browser $preview) {
                $preview->within('@canvas', function (Browser $capture) {
                    $capture->assertVisible('@background-candy');
                });
                
                $preview
                    ->click('@button-tab-backgrounds')
                    ->click('@button-background-sky');
                
                $preview->within('@canvas', function (Browser $capture) {
                    $capture
                        ->assertMissing('@background-candy')
                        ->assertVisible('@background-sky');
                });
            });
    });
});

it('can change themes', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit(new App)
            ->within('@preview', function (Browser $preview) {
                $preview->within('@canvas', function (Browser $capture) {
                    $capture->assertVisible('@window-github-light');
                });
                
                $preview
                    ->click('@button-tab-themes')
                    ->waitFor('@button-theme-github-dark')
                    ->click('@button-theme-github-dark');
                
                $preview->within('@canvas', function (Browser $capture) {
                    $capture
                        ->assertMissing('@window-github-light')
                        ->assertVisible('@window-github-dark');
                });
            });
    });
});
