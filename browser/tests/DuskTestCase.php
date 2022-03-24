<?php

namespace Tests;

use LaravelZero\Framework\Testing\TestCase;

abstract class DuskTestCase extends TestCase
{
    use CreatesApplication, CreatesBrowser;

    /**
     * Register the base URL with Dusk.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->setupBrowser('http://localhost:3000');
    }
}
