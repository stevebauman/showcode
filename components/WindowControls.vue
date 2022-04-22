<template>
    <div class="flex items-center justify-end w-full h-full window-controls">
        <button
            aria-label="minimize"
            title="Minimize"
            tabindex="-1"
            class="flex window-control minimize -iz"
        >
            <svg aria-hidden="true" version="1.1" width="10" height="10">
                <path d="M 0,5 10,5 10,6 0,6 Z"></path>
            </svg>
        </button>

        <button aria-label="restore" title="Restore" tabindex="-1" class="window-control restore">
            <svg aria-hidden="true" version="1.1" width="10" height="10">
                <path
                    d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z"
                ></path>
            </svg>
        </button>

        <button aria-label="close" title="Close" tabindex="-1" class="window-control close">
            <svg aria-hidden="true" version="1.1" width="10" height="10">
                <path
                    d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z"
                ></path>
            </svg>
        </button>
    </div>
</template>

<style>
.window-controls {
    flex-grow: 0;
    flex-shrink: 0;
    margin-left: auto;
}
.window-controls button {
    @apply inline-flex items-center justify-center;
    -webkit-app-region: no-drag;
    position: relative;
    width: 45px;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    border: none;
    box-shadow: none;
    border-radius: 0;
    color: #a0a0a0;
    background-color: transparent;
    transition: background-color 0.25s ease;
    line-height: 10px;
    /* https://css-tricks.com/cascading-svg-fill-color/ */
}
.window-controls button:focus {
    outline: none;
}
.window-controls button:hover {
    background-color: #888;
    color: #fff;
}
.window-controls button:hover:active {
    background-color: #666;
    transition: none;
}
.window-controls button.close:hover {
    background-color: #e81123;
    color: #fff;
}
.window-controls button.close:hover:active {
    background-color: #bf0f1d;
    transition: none;
}
.window-controls button svg {
    fill: currentColor;
}
</style>
