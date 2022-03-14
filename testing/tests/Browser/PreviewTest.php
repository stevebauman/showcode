<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\Browser\Pages\App;
use Tests\DuskTestCase;

class PreviewTest extends DuskTestCase
{
    public function testBackgroundSelection()
    {
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
    }

    public function testThemeSwitching()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(new App)
                ->within('@preview', function (Browser $preview) {
                    $preview->within('@canvas', function (Browser $capture) {
                        $capture->assertVisible('@window-github-light');
                    });
                    
                    $preview
                        ->click('@button-tab-themes')
                        ->waitFor('@select-theme-dark-plus')
                        ->select('@select-theme-dark-plus');
                    
                    $preview->within('@canvas', function (Browser $capture) {
                        $capture
                            ->assertMissing('@window-github-light')
                            ->assertVisible('@window-github-dark');
                    });
                });
        });
    }
}
