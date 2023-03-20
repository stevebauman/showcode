import pest from '../assets/img/pest.png';

export default [
    {
        id: 'transparent',
        style: {
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
            backgroundImage: `linear-gradient(45deg, var(--color-ui-gray-900) 25%, transparent 0),
                        linear-gradient(-45deg, var(--color-ui-gray-900) 25%, transparent 0),
                        linear-gradient(45deg, transparent 75%, var(--color-ui-gray-900) 0),
                        linear-gradient(-45deg, transparent 75%, var(--color-ui-gray-900) 0)`,
        },
    },
    {
        id: 'teal',
        class: 'bg-gradient-to-bl from-green-400 to-blue-500',
    },
    {
        id: 'ocean',
        class: 'bg-gradient-to-tl from-sky-800 to-sky-400',
    },
    {
        id: 'candy',
        class: 'bg-gradient-to-bl from-pink-400 to-purple-500',
    },
    {
        id: 'sky',
        class: 'bg-gradient-to-br from-blue-700 to-blue-300',
    },
    {
        id: 'garden',
        class: 'bg-gradient-to-bl from-green-400 to-black',
    },
    {
        id: 'midnight',
        class: 'bg-gradient-to-tr from-black to-purple-800',
    },
    {
        id: 'sunset',
        class: 'bg-gradient-to-bl from-yellow-400 to-red-500',
    },
    {
        id: 'lavender',
        class: 'bg-gradient-to-bl from-blue-400 to-purple-500',
    },
    {
        id: 'pest',
        style: {
            backgroundSize: 'contain',
            backgroundImage: `url(${pest})`,
        },
    },
    {
        id: 'mesh-1',
        style: {
            backgroundColor: '#ff9b99',
            backgroundImage: `radial-gradient(at 35% 78%, hsla(257,65%,60%,1) 0px, transparent 50%),
                        radial-gradient(at 83% 33%, hsla(246,88%,76%,1) 0px, transparent 50%),
                        radial-gradient(at 82% 33%, hsla(260,69%,68%,1) 0px, transparent 50%),
                        radial-gradient(at 96% 86%, hsla(143,61%,73%,1) 0px, transparent 50%),
                        radial-gradient(at 69% 66%, hsla(164,70%,78%,1) 0px, transparent 50%),
                        radial-gradient(at 51% 17%, hsla(310,67%,68%,1) 0px, transparent 50%),
                        radial-gradient(at 38% 5%, hsla(39,84%,77%,1) 0px, transparent 50%)`,
        },
    },
    {
        id: 'mesh-2',
        style: {
            backgroundColor: '#ffc599',
            backgroundImage: `radial-gradient(at 81% 27%, hsla(331,60%,64%,1) 0px, transparent 50%),
                        radial-gradient(at 22% 7%, hsla(39,95%,79%,1) 0px, transparent 50%),
                        radial-gradient(at 22% 10%, hsla(277,75%,77%,1) 0px, transparent 50%),
                        radial-gradient(at 50% 85%, hsla(203,83%,79%,1) 0px, transparent 50%),
                        radial-gradient(at 77% 29%, hsla(155,60%,71%,1) 0px, transparent 50%),
                        radial-gradient(at 29% 60%, hsla(310,74%,63%,1) 0px, transparent 50%),
                        radial-gradient(at 82% 38%, hsla(268,78%,67%,1) 0px, transparent 50%)`,
        },
    },
    {
        id: 'mesh-3',
        style: {
            backgroundColor: '#99ffdb',
            backgroundImage: `radial-gradient(at 18% 56%, hsla(179,97%,68%,1) 0px, transparent 50%),
                        radial-gradient(at 2% 85%, hsla(258,68%,70%,1) 0px, transparent 50%),
                        radial-gradient(at 5% 32%, hsla(359,76%,71%,1) 0px, transparent 50%),
                        radial-gradient(at 93% 20%, hsla(337,89%,79%,1) 0px, transparent 50%),
                        radial-gradient(at 84% 18%, hsla(347,88%,73%,1) 0px, transparent 50%),
                        radial-gradient(at 8% 57%, hsla(260,72%,72%,1) 0px, transparent 50%),
                        radial-gradient(at 95% 8%, hsla(10,89%,69%,1) 0px, transparent 50%)`,
        },
    },
    {
        id: 'mesh-4',
        style: {
            backgroundColor: '#c999ff',
            backgroundImage: `radial-gradient(at 74% 83%, hsla(181,96%,75%,1) 0px, transparent 50%),
                        radial-gradient(at 6% 95%, hsla(292,83%,66%,1) 0px, transparent 50%),
                        radial-gradient(at 87% 94%, hsla(188,89%,64%,1) 0px, transparent 50%),
                        radial-gradient(at 87% 24%, hsla(204,74%,76%,1) 0px, transparent 50%),
                        radial-gradient(at 82% 50%, hsla(125,87%,77%,1) 0px, transparent 50%),
                        radial-gradient(at 94% 52%, hsla(332,69%,66%,1) 0px, transparent 50%),
                        radial-gradient(at 45% 15%, hsla(220,94%,72%,1) 0px, transparent 50%)`,
        },
    },
    {
        id: 'mesh-5',
        style: {
            backgroundColor: '#999cff',
            backgroundImage: `radial-gradient(at 84% 15%, hsla(357,86%,78%,1) 0px, transparent 50%),
                        radial-gradient(at 87% 98%, hsla(147,78%,66%,1) 0px, transparent 50%),
                        radial-gradient(at 68% 27%, hsla(177,69%,60%,1) 0px, transparent 50%),
                        radial-gradient(at 85% 72%, hsla(191,91%,65%,1) 0px, transparent 50%),
                        radial-gradient(at 60% 61%, hsla(271,70%,64%,1) 0px, transparent 50%),
                        radial-gradient(at 28% 66%, hsla(129,90%,75%,1) 0px, transparent 50%),
                        radial-gradient(at 15% 20%, hsla(186,73%,79%,1) 0px, transparent 50%)`,
        },
    },
    {
        id: 'mesh-6',
        style: {
            backgroundColor: '#99fffa',
            backgroundImage: `radial-gradient(at 83% 13%, hsla(264,83%,61%,1) 0px, transparent 50%),
                        radial-gradient(at 81% 25%, hsla(326,92%,69%,1) 0px, transparent 50%),
                        radial-gradient(at 22% 12%, hsla(249,97%,76%,1) 0px, transparent 50%),
                        radial-gradient(at 27% 53%, hsla(288,61%,55%,1) 0px, transparent 50%),
                        radial-gradient(at 2% 75%, hsla(210,85%,72%,1) 0px, transparent 50%),
                        radial-gradient(at 90% 99%, hsla(324,65%,60%,1) 0px, transparent 50%),
                        radial-gradient(at 63% 67%, hsla(216,96%,69%,1) 0px, transparent 50%)`,
        },
    },
    {
        id: 'conic-1',
        style: {
            background: 'conic-gradient(from 90deg at bottom right, cyan, rebeccapurple)',
        },
    },
    {
        id: 'conic-2',
        style: {
            background: 'conic-gradient(from 0.5turn at bottom center, lightblue, white)',
        },
    },
    {
        id: 'conic-3',
        style: {
            background: 'conic-gradient(at bottom left, deeppink, cyan)',
        },
    },
    {
        id: 'conic-4',
        style: {
            background:
                'conic-gradient(from 90deg at 25% -10%, #ff4500, #d3f340, #7bee85, #afeeee, #7bee85)',
        },
    },
    {
        id: 'conic-5',
        style: {
            background: 'conic-gradient(from -90deg at top left, black, white)',
        },
    },
    {
        id: 'conic-6',
        style: {
            background: 'conic-gradient(at top right, lime, cyan)',
        },
    },
    {
        id: 'conic-7',
        style: {
            background:
                'conic-gradient(from -0.5turn at bottom right, deeppink, cyan, rebeccapurple)',
        },
    },
    {
        id: 'conic-8',
        style: {
            background: 'conic-gradient(at top right, slategray, white)',
        },
    },
    {
        id: 'conic-9',
        style: {
            background: 'conic-gradient(from 0.5turn at 50% 110%, white, orange)',
        },
    },
    {
        id: 'conic-10',
        style: {
            background: 'conic-gradient(from 0.5turn at center left, lime, cyan)',
        },
    },
    {
        id: 'conic-11',
        style: {
            background: 'conic-gradient(from -90deg at 50% -25%, blue, blueviolet)',
        },
    },
    {
        id: 'conic-12',
        style: {
            background: 'conic-gradient(from 0.5turn at top right, darkseagreen, darkslategray)',
        },
    },
    {
        id: 'conic-13',
        style: {
            background: 'conic-gradient(from 90deg at 50% 0%, #111, 50%, #222, #111)',
        },
    },
    {
        id: 'conic-14',
        style: {
            background: 'conic-gradient(at top right, lightcyan, lightblue)',
        },
    },
    {
        id: 'conic-15',
        style: {
            background: `conic-gradient(
              from -135deg at -10% center,
              #ffa500,
              #ff7715,
              #ff522a,
              #ff3f47,
              #ff5482,
              #ff69b4
          )`,
        },
    },
    {
        id: 'conic-16',
        style: {
            background: 'conic-gradient(from -90deg at 50% 105%, white, orchid)',
        },
    },
    {
        id: 'conic-17',
        style: {
            background: 'conic-gradient(from -90deg at bottom center, papayawhip, peachpuff)',
        },
    },
    {
        id: 'conic-18',
        style: {
            background: 'conic-gradient(from -270deg at 50% -5%, yellow, yellowgreen)',
        },
    },
    {
        id: 'conic-19',
        style: {
            background: 'conic-gradient(from -90deg at 75% -25%, sienna, purple)',
        },
    },
    {
        id: 'conic-20',
        style: {
            background: `conic-gradient(
              from 90deg at 50% 125%,
              #20b2aa,
              #135da5,
              #0d0895,
              #4b0082,
              #4b0082,
              #0d0895,
              #135da5,
              #20b2aa
          )`,
        },
    },
    {
        id: 'conic-21',
        style: {
            background: 'conic-gradient(from -270deg at 110% 50%, cadetblue, darkgreen)',
        },
    },
    {
        id: 'conic-22',
        style: {
            background: 'conic-gradient(from -270deg at 75% 110%, fuchsia, floralwhite)',
        },
    },
    {
        id: 'conic-23',
        style: {
            background: 'conic-gradient(from -270deg at 75% 110%, midnightblue, lawngreen)',
        },
    },
    {
        id: 'conic-24',
        style: {
            background: 'conic-gradient(from 0.5turn at bottom left, deeppink, rebeccapurple)',
        },
    },
    {
        id: 'conic-25',
        style: {
            background: `conic-gradient(
              from 90deg at 50% 125%,
              #1f005c,
              #003298,
              #005ac6,
              #007fdc,
              #00a2d3,
              #00c4ae,
              #00e474,
              #00ff00,
              #1f005c,
              #003298,
              #005ac6,
              #007fdc,
              #00a2d3,
              #00c4ae,
              #00e474,
              #00ff00
          )`,
        },
    },
    {
        id: 'conic-26',
        style: {
            background: 'conic-gradient(at 0% 0%, snow, white)',
        },
    },
    {
        id: 'conic-27',
        style: {
            background:
                'conic-gradient(from 0.5turn at 0% 0%, #00c476, 10%, #82b0ff, 90%, #00c476)',
        },
    },
    {
        id: 'conic-28',
        style: {
            background: 'conic-gradient(at 125% 50%, #b78cf7, #ff7c94, #ffcf0d, #ff7c94, #b78cf7)',
        },
    },
    {
        id: 'conic-29',
        style: {
            background: `conic-gradient(
              from 90deg at 40% -25%,
              #ffd700,
              #f79d03,
              #ee6907,
              #e6390a,
              #de0d0d,
              #d61039,
              #cf1261,
              #c71585,
              #cf1261,
              #d61039,
              #de0d0d,
              #ee6907,
              #f79d03,
              #ffd700,
              #ffd700,
              #ffd700
          )`,
        },
    },
    {
        id: 'hyper-base',
        class: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
    },
    {
        id: 'hyper-oceanic',
        class: 'bg-gradient-to-r from-green-300 via-blue-500 to-purple-600',
    },
    {
        id: 'hyper-cotton-candy',
        class: 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
    },
    {
        id: 'hyper-gotham',
        class: 'bg-gradient-to-r from-gray-700 via-gray-900 to-black',
    },
    {
        id: 'hyper-sunset',
        class: 'bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100',
    },
    {
        id: 'hyper-mojave',
        class: 'bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500',
    },
    {
        id: 'hyper-beachside',
        class: 'bg-gradient-to-r from-yellow-200 via-green-200 to-green-500',
    },
    {
        id: 'hyper-gunmetal',
        class: 'bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600',
    },
    {
        id: 'hyper-peachy',
        class: 'bg-gradient-to-r from-red-200 via-red-300 to-yellow-200',
    },
    {
        id: 'hyper-seafoam',
        class: 'bg-gradient-to-r from-green-200 via-green-300 to-blue-500',
    },
    {
        id: 'hyper-pumpkin',
        class: 'bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700',
    },
    {
        id: 'hyper-pandora',
        class: 'bg-gradient-to-r from-green-200 via-green-400 to-purple-700',
    },
    {
        id: 'hyper-valentine',
        class: 'bg-gradient-to-r from-red-200 to-red-600',
    },
    {
        id: 'hyper-hawaii',
        class: 'bg-gradient-to-r from-green-300 via-yellow-300 to-pink-300',
    },
    {
        id: 'hyper-lavender',
        class: 'bg-gradient-to-r from-indigo-300 to-purple-400',
    },
    {
        id: 'hyper-wintergreen',
        class: 'bg-gradient-to-r from-green-200 to-green-500',
    },
    {
        id: 'hyper-huckleberry',
        class: 'bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800',
    },
    {
        id: 'hyper-blue-steel',
        class: 'bg-gradient-to-r from-gray-400 via-gray-600 to-blue-800',
    },
    {
        id: 'hyper-arendelle',
        class: 'bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500',
    },
    {
        id: 'hyper-spearmint',
        class: 'bg-gradient-to-r from-green-200 via-green-400 to-green-500',
    },
    {
        id: 'hyper-minnesota',
        class: 'bg-gradient-to-r from-purple-400 to-yellow-400',
    },
    {
        id: 'hyper-bombpop',
        class: 'bg-gradient-to-r from-red-400 via-gray-300 to-blue-500',
    },
    {
        id: 'hyper-acadia',
        class: 'bg-gradient-to-r from-red-800 via-yellow-600 to-yellow-500',
    },
    {
        id: 'hyper-sonora',
        class: 'bg-gradient-to-r from-yellow-200 to-yellow-500',
    },
    {
        id: 'hyper-paradise',
        class: 'bg-gradient-to-r from-blue-300 via-green-200 to-yellow-300',
    },
    {
        id: 'hyper-sierra-mist',
        class: 'bg-gradient-to-r from-yellow-200 via-green-200 to-green-300',
    },
    {
        id: 'hyper-creamsicle',
        class: 'bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400',
    },
    {
        id: 'hyper-midnight',
        class: 'bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900',
    },
    {
        id: 'hyper-borealis',
        class: 'bg-gradient-to-r from-green-300 to-purple-400',
    },
    {
        id: 'hyper-strawberry',
        class: 'bg-gradient-to-r from-yellow-200 via-pink-200 to-pink-400',
    },
    {
        id: 'hyper-flamingo',
        class: 'bg-gradient-to-r from-pink-400 to-pink-600',
    },
    {
        id: 'hyper-burning sunrise',
        class: 'bg-gradient-to-r from-yellow-600 to-red-600',
    },
    {
        id: 'hyper-apple',
        class: 'bg-gradient-to-r from-green-500 to-green-700',
    },
    {
        id: 'hyper-watermelon',
        class: 'bg-gradient-to-r from-red-500 to-green-500',
    },
    {
        id: 'hyper-flare',
        class: 'bg-gradient-to-r from-orange-600 to-orange-500',
    },
    {
        id: 'hyper-rasta',
        class: 'bg-gradient-to-r from-lime-600 via-yellow-300 to-red-600',
    },
    {
        id: 'hyper-lust',
        class: 'bg-gradient-to-r from-rose-700 to-pink-600',
    },
    {
        id: 'hyper-sublime',
        class: 'bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500',
    },
    {
        id: 'hyper-witch',
        class: 'bg-gradient-to-r from-blue-gray-900 via-purple-900 to-blue-gray-900',
    },
    {
        id: 'hyper-powerpuff',
        class: 'bg-gradient-to-r from-sky-400 via-rose-400 to-lime-400',
    },
    {
        id: 'hyper-solid-blue',
        class: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
    {
        id: 'hyper-ice',
        class: 'bg-gradient-to-r from-rose-100 to-teal-100',
    },
    {
        id: 'hyper-sky',
        class: 'bg-gradient-to-b from-sky-400 to-sky-200',
    },
    {
        id: 'hyper-horizon',
        class: 'bg-gradient-to-b from-orange-500 to-yellow-300',
    },
    {
        id: 'hyper-morning',
        class: 'bg-gradient-to-r from-rose-400 to-orange-300',
    },
    {
        id: 'hyper-space',
        class: 'bg-gradient-to-b from-cool-gray-900 to-bg-gradient-to-r-gray-600',
    },
    {
        id: 'hyper-earth',
        class: 'bg-gradient-to-r from-teal-200 to-lime-200',
    },
    {
        id: 'hyper-picture',
        class: 'bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400',
    },
    {
        id: 'hyper-messenger',
        class: 'bg-gradient-to-r from-sky-400 to-blue-500',
    },
    {
        id: 'hyper-sea',
        class: 'bg-gradient-to-r from-cyan-200 to-cyan-400',
    },
    {
        id: 'hyper-payment',
        class: 'bg-gradient-to-r from-sky-400 to-cyan-300',
    },
    {
        id: 'hyper-video',
        class: 'bg-gradient-to-r from-red-500 to-red-800',
    },
    {
        id: 'hyper-passion',
        class: 'bg-gradient-to-r from-rose-500 via-red-400 to-red-500',
    },
    {
        id: 'hyper-flower',
        class: 'bg-gradient-to-r from-violet-300 to-violet-400',
    },
    {
        id: 'hyper-cool-sunset',
        class: 'bg-gradient-to-r from-orange-300 to-rose-300',
    },
    {
        id: 'hyper-pink-neon',
        class: 'bg-gradient-to-r from-fuchsia-600 to-pink-600',
    },
    {
        id: 'hyper-blue-sand',
        class: 'bg-gradient-to-r from-blue-gray-500 to-yellow-100',
    },
    {
        id: 'hyper-emerald',
        class: 'bg-gradient-to-r from-emerald-500 to-lime-600',
    },
    {
        id: 'hyper-relaxed-rose',
        class: 'bg-gradient-to-r from-rose-300 to-rose-500',
    },
    {
        id: 'hyper-purple-haze',
        class: 'bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800',
    },
    {
        id: 'hyper-silver',
        class: 'bg-gradient-to-r from-cool-gray-100 to-cool-gray-300',
    },
    {
        id: 'hyper-orange-coral',
        class: 'bg-gradient-to-r from-orange-400 to-rose-400',
    },
    {
        id: 'hyper-blue-coral',
        class: 'bg-gradient-to-r from-blue-400 to-emerald-400',
    },
    {
        id: 'hyper-beam-of-light',
        class: 'bg-conic-to-t from-gray-900 via-gray-100 to-gray-900',
    },
    {
        id: 'hyper-safari-sunset',
        class: 'bg-conic-to-l from-yellow-500 via-purple-500 to-blue-500',
    },
    {
        id: 'hyper-high-tide',
        class: 'bg-conic-to-tl from-sky-500 via-orange-200 to-yellow-600',
    },
    {
        id: 'hyper-hunniepop',
        class: 'bg-conic-to-bl from-fuchsia-300 via-green-400 to-rose-700',
    },
    {
        id: 'hyper-soft-metal',
        class: 'bg-conic-to-r from-indigo-200 via-blue-gray-600 to-indigo-200',
    },
    {
        id: 'hyper-coral-sun',
        class: 'bg-conic-to-tl from-yellow-200 via-emerald-200 to-yellow-200',
    },
    {
        id: 'hyper-power-pink',
        class: 'bg-conic-to-l from-rose-500 to-indigo-700',
    },
    {
        id: 'hyper-powder-blue',
        class: 'bg-conic-to-l from-sky-400 to-blue-800',
    },
    {
        id: 'hyper-moody-sunset',
        class: 'bg-conic-to-l from-rose-900 via-amber-800 to-rose-400',
    },
    {
        id: 'hyper-burnt-sand',
        class: 'bg-conic-to-l from-yellow-200 via-red-500 to-fuchsia-500',
    },
    {
        id: 'hyper-blue-white-split',
        class: 'bg-conic-to-b from-white via-sky-500 to-sky-500',
    },
    {
        id: 'hyper-purple-beam',
        class: 'bg-gradient-to-bl from-indigo-900 via-indigo-400 to-indigo-900',
    },
    {
        id: 'hyper-sand-beam',
        class: 'bg-conic-to-t from-orange-900 via-amber-100 to-orange-900',
    },
    {
        id: 'hyper-island-waves',
        class: 'bg-gradient-to-r from-yellow-400 via-gray-50 to-teal-300',
    },
    {
        id: 'hyper-big-sur',
        class: 'bg-gradient-to-tr from-violet-500 to-orange-300',
    },
    {
        id: 'hyper-oahu',
        class: 'bg-gradient-to-t from-orange-400 to-sky-400',
    },
    {
        id: 'hyper-peach-pie',
        class: 'bg-conic-to-r from-red-900 via-violet-200 to-orange-500',
    },
    {
        id: 'hyper-salem',
        class: 'bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600',
    },
    {
        id: 'hyper-purple-burst',
        class: 'bg-radial from-purple-900 to-indigo-500',
    },
    {
        id: 'hyper-amber-sunrise',
        class: 'bg-radial-at-b from-amber-900 to-yellow-300',
    },
    {
        id: 'hyper-sky-sea',
        class: 'bg-radial-at-r from-sky-400 to-indigo-900',
    },
    {
        id: 'hyper-rocket-power',
        class: 'bg-radial-at-t from-amber-700 via-orange-300 to-rose-800',
    },
    {
        id: 'hyper-blue-flame',
        class: 'bg-radial-at-b from-amber-200 via-violet-600 to-sky-900',
    },
    {
        id: 'hyper-warm-glow',
        class: 'bg-radial-at-t from-cool-gray-300 via-fuchsia-600 to-orange-600',
    },
];
