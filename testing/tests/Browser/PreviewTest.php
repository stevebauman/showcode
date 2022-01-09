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
                    $preview->within('@capture', function (Browser $capture) {
                        $capture->assertVisible('@background-candy');
                    });
                    
                    $preview->click('@button-background-sky');
                    
                    $preview->within('@capture', function (Browser $capture) {
                        $capture
                            ->assertMissing('@background-candy')
                            ->assertVisible('@background-sky');
                    });
                });
        });
    }
}
