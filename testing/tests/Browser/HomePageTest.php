<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class HomePageTest extends DuskTestCase
{
    /**
     * A basic browser test example.
     *
     * @return void
     */
    public function testPageLoads()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                ->waitUntilMissing('#nuxt-loading')
                ->assertSee('File');
        });
    }
}
