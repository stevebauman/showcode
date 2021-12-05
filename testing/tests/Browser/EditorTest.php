<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\Browser\Pages\App;
use Tests\DuskTestCase;

class EditorTest extends DuskTestCase
{
    public function testTabSizeCanBeChanged()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(new App)
                ->select('@select-tab-size', '2')
                ->assertSeeIn('@select-tab-size', '2');
        });
    }

    public function testLanguageCanBeChanged()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(new App)
                ->select('@select-language', 'html')
                ->assertSeeIn('@select-language', 'html');
        });
    }

    public function testEditorsCanBeAdded()
    {
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
    }
}
