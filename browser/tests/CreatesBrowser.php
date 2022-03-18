<?php

namespace Tests;

use Laravel\Dusk\Browser;
use Laravel\Dusk\Concerns\ProvidesBrowser;

trait CreatesBrowser
{
    use ProvidesBrowser;

    /**
     * The dusk driver.
     *
     * @var Chrome
     */
    protected $driver;

    /**
     * Setup the browser.
     *
     * @return void
     */
    public function setupBrowser($url = '/', array $options = [])
    {
        $this->driver = new Chrome($options);

        Browser::$baseUrl = $url;

        Browser::$storeScreenshotsAt = base_path('tests/screenshots');

        Browser::$storeConsoleLogAt = base_path('tests/console');

        Browser::$storeSourceAt = base_path('tests/source');

        $this->driver->open();
    }

    /**
     * Get the Laravel Dusk driver.
     *
     * @return Chrome
     */
    protected function driver()
    {
        return $this->driver->getDriver();
    }
}
