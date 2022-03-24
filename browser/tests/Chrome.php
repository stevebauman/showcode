<?php

namespace Tests;

use Closure;
use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Laravel\Dusk\Chrome\SupportsChrome;

class Chrome
{
    use SupportsChrome;

    /**
     * The Chrome browser options.
     *
     * @var array
     */
    protected $options = [];

    /**
     * Constructor.
     *
     * @param array $options
     */
    public function __construct(array $options = [])
    {
        $this->options = $options;
    }

    /**
     * Stop the chrome driver upon destruct.
     *
     * @return void
     */
    public function __destruct()
    {
        $this->close();
    }

    /**
     * Start the Chrome driver.
     *
     * @return void
     */
    public function open(): void
    {
        static::startChromeDriver();
    }

    /**
     * Close the Chrome driver.
     *
     * @return void
     */
    public function close(): void
    {
        static::stopChromeDriver();
    }
    
    /**
     * Purposely left empty.
     *
     * @param Closure $callback
     *
     * @return void
     */
    public static function afterClass(Closure $callback)
    {
        // ..
    }

    /**
     * Get the web driver instance.
     *
     * @return RemoteWebDriver
     */
    public function getDriver()
    {
        $options = (new ChromeOptions)->addArguments([
            '--window-size=1920,1080',
            '--disable-gpu',
            $this->runHeadless(),
        ]);

        return RemoteWebDriver::create(
            'http://localhost:9515',
            DesiredCapabilities::chrome()->setCapability(
                ChromeOptions::CAPABILITY,
                $options
            )
        );
    }

    /**
     * Whether to run in headless mode.
     *
     * @return string|null
     */
    protected function runHeadless()
    {
        return ($this->options['headless'] ?? true) ? '--headless' : null;
    }
}
