import PestBlack from '../assets/img/pest-black.png';
import PestWhite from '../assets/img/pest-white.png';

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
        id: 'pest-black',
        style: {
            backgroundSize: 'cover',
            backgroundImage: `url(${PestBlack})`,
        },
    },
    {
        id: 'pest-white',
        style: {
            backgroundSize: 'cover',
            backgroundImage: `url(${PestWhite})`,
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
        id: 'codioful-crosscheck-pattern',
        style: {
            background:
                'radial-gradient(65% 100% at 50% 0%, #00FF94 0%, rgba(0, 255, 148, 0.25) 100%), linear-gradient(230deg, #000000 25%, #170059 100%), linear-gradient(215deg, #FFEBB9 10%, #19004E 80%), radial-gradient(100% 245% at 100% 100%, #FFFFFF 0%, #000353 100%), linear-gradient(125deg, #1400FF 0%, #3A0000 100%), linear-gradient(225deg, #00F0FF 30%, #000B6F 45%, #00EBFC 45%, #001676 65%, #00E1F6 65%, #001676 85%, #00ECFD 85%, #001676 100%), linear-gradient(135deg, #00F0FF 0%, #000B6F 15%, #00EBFC 15%, #001676 35%, #00E1F6 35%, #001676 55%, #00ECFD 55%, #001676 100%)',
            backgroundBlendMode:
                'soft-light, screen, overlay, overlay, difference, overlay, normal',
        },
    },
    {
        id: 'codioful-tired-journey',
        style: {
            background:
                'radial-gradient(65% 100% at 50% 0%, #18005B 0%, #000000 100%), radial-gradient(circle at 30% 45%, #FF0000 0%, #FF0000 5%, #FFFF00 5%, #FFFF00 10%, #00FF00 10%, #00FF00 15%, #00FFFF 15%, #00FFFF 20%, #0000FF 20%, #0000FF 30%, #FF00FF 30%, #FF00FF 40%, #FF0000 40%), radial-gradient(circle at 50% 0%, #FF0000 0%, #FF0000 5%, #FFFF00 5%, #FFFF00 10%, #00FF00 10%, #00FF00 20%, #00FFFF 20%, #00FFFF 30%, #0000FF 30%, #0000FF 40%, #FF00FF 40%, #FF00FF 50%, #FF0000 50%), conic-gradient(from 15deg at 20% 420%, #FF0000 0deg, #FF0000 55deg, #FFFF00 60deg, #FFFF00 120deg, #00FF00 120deg, #00FF00 180deg, #00FFFF 180deg, #00FFFF 240deg, #0000FF 240deg, #0000FF 300deg, #FF00FF 310deg, #FF00FF 360deg, #FF0000 360deg)',
            backgroundBlendMode: 'screen, multiply, multiply, normal',
        },
    },
    {
        id: 'codioful-shattered-feelings',
        style: {
            background:
                'linear-gradient(115deg, #000000 0%, #00C508 55%, #000000 100%), linear-gradient(115deg, #0057FF 0%, #020077 100%), conic-gradient(from 110deg at -5% 35%, #000000 0deg, #FAFF00 360deg), conic-gradient(from 220deg at 30% 30%, #FF0000 0deg, #0000FF 220deg, #240060 360deg), conic-gradient(from 235deg at 60% 35%, #0089D7 0deg, #0000FF 180deg, #240060 360deg)',
            backgroundBlendMode: 'soft-light, soft-light, overlay, screen, normal',
        },
    },
    {
        id: 'codioful-fractured-angle',
        style: {
            background:
                'linear-gradient(245deg, #000000 0%, #FDFF96 100%), linear-gradient(245deg, #0038FF 0%, #000000 100%), radial-gradient(100% 225% at 100% 0%, #4200FF 0%, #001169 100%), linear-gradient(245deg, #000000 0%, #FFB800 100%), radial-gradient(115% 107% at 40% 100%, #EAF5FF 0%, #EAF5FF 40%, #A9C6DE calc(40% + 1px), #A9C6DE 70%, #247E6C calc(70% + 2px), #247E6C 85%, #E4C666 calc(85% + 2px), #E4C666 100%), linear-gradient(65deg, #083836 0%, #083836 40%, #66D37E calc(40% + 1px), #66D37E 60%, #C6E872 calc(60% + 1px), #C6E872 100%)',
            backgroundBlendMode: 'overlay, screen, overlay, hard-light, overlay, normal',
        },
    },
    {
        id: 'codioful-circle-acquired',
        style: {
            background:
                'linear-gradient(115deg, #FF9797 0%, #0F0068 100%), linear-gradient(245deg, #A8FFE5 0%, #0500FF 100%), radial-gradient(100% 225% at 100% 0%, #FF003D 0%, #000000 100%), radial-gradient(90% 160% at 0% 100%, #E42C64 0%, #E42C64 30%, #614AD3 calc(30% + 1px), #614AD3 60%, #2D248A calc(60% + 1px), #2D248A 70%, #121B74 calc(70% + 1px), #121B74 100%), linear-gradient(100deg, #48466F 9%, #48466D 35%, #3D84A8 calc(35% + 1px), #3D84A8 65%, #46CDCF calc(65% + 1px), #46CDCF 70%, #ABEDD8 calc(70% + 1px), #ABEDD8 100%)',
            backgroundBlendMode: 'overlay, overlay, overlay, overlay, normal',
        },
    },
    {
        id: 'codioful-faded-sun',
        style: {
            background:
                'radial-gradient(ellipse farthest-side at 76% 77%, rgba(245, 228, 212, 0.25) 4%, rgba(255, 255, 255, 0) calc(4% + 1px)), radial-gradient(circle at 76% 40%, #fef6ec 4%, rgba(255, 255, 255, 0) 4.18%), linear-gradient(135deg, #ff0000 0%, #000036 100%), radial-gradient(ellipse at 28% 0%, #ffcfac 0%, rgba(98, 149, 144, 0.5) 100%), linear-gradient(180deg, #cd6e8a 0%, #f5eab0 69%, #d6c8a2 70%, #a2758d 100%)',
            backgroundBlendMode: 'normal, normal, screen, overlay, normal',
        },
    },
    {
        id: 'codioful-descend-sun',
        style: {
            background:
                'linear-gradient(45deg, #000850 0%, #000320 100%), radial-gradient(100% 225% at 100% 0%, #FF6928 0%, #000000 100%), linear-gradient(225deg, #FF7A00 0%, #000000 100%), linear-gradient(135deg, #CDFFEB 10%, #CDFFEB 35%, #009F9D 35%, #009F9D 60%, #07456F 60%, #07456F 67%, #0F0A3C 67%, #0F0A3C 100%)',
            backgroundBlendMode: 'screen, overlay, hard-light, normal',
        },
    },
    {
        id: 'codioful-own-pattern',
        style: {
            background:
                'radial-gradient(100% 225% at 100% 0%, #FAFF00 0%, #000000 100%), linear-gradient(235deg, #DB00FF 0%, #000000 100%), linear-gradient(45deg, #241E92 0%, #241E92 40%, #5432D3 40%, #5432D3 50%, #7B6CF6 50%, #7B6CF6 70%, #E5A5FF 70%, #E5A5FF 100%), linear-gradient(180deg, #01024E 0%, #01024E 43%, #543864 43%, #543864 62%, #8B4367 62%, #8B4367 80%, #FF6464 80%, #FF6464 100%)',
            backgroundBlendMode: 'overlay, hard-light, overlay, normal',
        },
    },
    {
        id: 'codioful-elaborated-time',
        style: {
            background:
                'linear-gradient(125deg, #ECFCFF 0%, #ECFCFF 40%, #B2FCFF calc(40% + 1px), #B2FCFF 60%, #5EDFFF calc(60% + 1px), #5EDFFF 72%, #3E64FF calc(72% + 1px), #3E64FF 100%)',
        },
    },
    {
        id: 'codioful-green-iceland',
        style: {
            background:
                'radial-gradient(100% 135% at 90% 0%, #00FF66 0%, #00FF66 33%, #00FFFF calc(33% + 1px), #00FFFF 75%, #EB00FF calc(75% + 1px), #EB00FF 100%), radial-gradient(circle at 60% 110%, #00FF66 0%, #00FF66 33%, #00FFFF calc(33% + 1px), #00FFFF 66%, #EB00FF calc(66% + 1px), #EB00FF 100%), radial-gradient(100% 225% at 0% 0%, #00FF66 0%, #00FF66 33%, #00FFFF calc(33% + 1px), #00FFFF 66%, #EB00FF calc(66% + 1px), #EB00FF 100%)',
            backgroundBlendMode: 'multiply, multiply, normal',
        },
    },
    {
        id: 'codioful-warm-welcome',
        style: {
            background:
                'radial-gradient(100% 225% at 100% 0%, #FAFF00 0%, #000000 100%), linear-gradient(235deg, #FF7A00 0%, #000000 100%), linear-gradient(20deg, #241E92 0%, #241E92 30%, #5432D3 calc(30% + 1px), #5432D3 35%, #7B6CF6 calc(35% + 1px), #7B6CF6 50%, #E5A5FF calc(50% + 1px), #E5A5FF 100%), linear-gradient(120deg, #110133 0%, #110133 40%, #00918E calc(40% + 1px), #00918E 60%, #4DD599 calc(60% + 1px), #4DD599 70%, #FFDC34 calc(70% + 1px), #FFDC34 100%)',
            backgroundBlendMode: 'overlay, hard-light, overlay, normal',
        },
    },
    {
        id: 'codioful-sluggish-steps',
        style: {
            background:
                'linear-gradient(55deg, #000850 0%, #000320 100%), radial-gradient(100% 225% at 100% 0%, #FF6928 0%, #000000 100%), linear-gradient(235deg, #BDFF00 0%, #000000 100%), linear-gradient(180deg, #002BDC 0%, #002BDC 45%, #2F4BFF 45%, #2F4BFF 60%, #00A6E7 60%, #00A6E7 80%, #FFE37F 80%, #FFE37F 100%)',
            backgroundBlendMode: 'screen, overlay, hard-light, normal',
        },
    },
    {
        id: 'codioful-weird-opinion',
        style: {
            background:
                'linear-gradient(120deg, #FF0000 0%, #2400FF 100%), linear-gradient(120deg, #FA00FF 0%, #208200 100%), linear-gradient(130deg, #00F0FF 0%, #000000 100%), radial-gradient(110% 140% at 15% 90%, #ffffff 0%, #1700A4 100%), radial-gradient(100% 100% at 50% 0%, #AD00FF 0%, #00FFE0 100%), radial-gradient(100% 100% at 50% 0%, #00FFE0 0%, #7300A9 80%), linear-gradient(30deg, #7ca304 0%, #2200AA 100%)',
            backgroundBlendMode:
                'overlay, color, overlay, difference, color-dodge, difference, normal',
        },
    },
    {
        id: 'codioful-colored-petal',
        style: {
            background:
                'radial-gradient(circle at 50% 50%, #FFFFFF 0%, #000000 100%), conic-gradient(red, yellow, lime, aqua, blue, fuchsia, red)',
            backgroundBlendMode: 'color-dodge, normal',
        },
    },
    {
        id: 'codioful-village-pattern',
        style: {
            background:
                'radial-gradient(100% 225% at 100% 0%, #120037 0%, #000000 100%), linear-gradient(35deg, #C0FFC7 0%, #17001F 75%), linear-gradient(55deg, #2400FF 0%, #000000 100%), linear-gradient(90deg, #FFE037 0%, #FFE037 40%, #1DCD9F 40%, #1DCD9F 50%, #088C6F 50%, #088C6F 70%, #23033C 70%, #23033C 100%), linear-gradient(180deg, #FF8FE5 0%, #FF8FE5 45%, #FBFF64 45%, #FBFF64 60%, #76E3FF 60%, #76E3FF 80%, #6EB6E7 80%, #6EB6E7 100%)',
            backgroundBlendMode: 'screen, overlay, overlay, darken, normal',
        },
    },
    {
        id: 'codioful-surface-shifting',
        style: {
            background:
                'linear-gradient(180deg, #0C003C 0%, #BFFFAF 100%), linear-gradient(165deg, #480045 25%, #E9EAAF 100%), linear-gradient(145deg, #480045 25%, #E9EAAF 100%), linear-gradient(300deg, rgba(233, 223, 255, 0) 0%, #AF89FF 100%), linear-gradient(90deg, #45EBA5 0%, #45EBA5 30%, #21ABA5 30%, #21ABA5 60%, #1D566E 60%, #1D566E 70%, #163A5F 70%, #163A5F 100%)',
            backgroundBlendMode: 'overlay, overlay, overlay, multiply, normal',
        },
    },
    {
        id: 'codioful-x-gate',
        style: {
            background:
                'linear-gradient(235deg, #FFFFFF 0%, #000F25 100%), linear-gradient(180deg, #6100FF 0%, #000000 100%), linear-gradient(235deg, #FFA3AC 0%, #FFA3AC 40%, #00043C calc(40% + 1px), #00043C 60%, #005D6C calc(60% + 1px), #005D6C 70%, #00C9B1 calc(70% + 1px), #00C9B1 100%), linear-gradient(125deg, #FFA3AC 0%, #FFA3AC 40%, #00043C calc(40% + 1px), #00043C 60%, #005D6C calc(60% + 1px), #005D6C 70%, #00C9B1 calc(70% + 1px), #00C9B1 100%)',
            backgroundBlendMode: 'soft-light, screen, darken, normal',
        },
    },
    {
        id: 'codioful-dusky-pattern',
        style: {
            background:
                'linear-gradient(125deg, #00FF57 0%, #010033 40%, #460043 70%, #F0FFC5 100%), linear-gradient(55deg, #0014C9 0%, #410060 100%), linear-gradient(300deg, #FFC700 0%, #001AFF 100%), radial-gradient(135% 215% at 115% 40%, #393939 0%, #393939 40%, #849561 calc(40% + 1px), #849561 60%, #EED690 calc(60% + 1px), #EED690 80%, #ECEFD8 calc(80% + 1px), #ECEFD8 100%), linear-gradient(125deg, #282D4F 0%, #282D4F 40%, #23103A calc(40% + 1px), #23103A 70%, #A0204C calc(70% + 1px), #A0204C 88%, #FF6C00 calc(88% + 1px), #FF6C00 100%)',
            backgroundBlendMode: 'overlay, screen, overlay, overlay, normal',
        },
    },
    {
        id: 'codioful-abstract-leafs',
        style: {
            background:
                'linear-gradient(235deg, #BABC4A 0%, #000000 100%), linear-gradient(235deg, #0026AC 0%, #282534 100%), linear-gradient(235deg, #00FFD1 0%, #000000 100%), radial-gradient(120% 185% at 25% -25%, #EEEEEE 0%, #EEEEEE 40%, #7971EA calc(40% + 1px), #7971EA 50%, #393E46 calc(50% + 1px), #393E46 70%, #222831 calc(70% + 1px), #222831 100%), radial-gradient(70% 140% at 90% 10%, #F5F5C6 0%, #F5F5C6 30%, #7DA87B calc(30% + 1px), #7DA87B 60%, #326765 calc(60% + 1px), #326765 80%, #27253D calc(80% + 1px), #27253D 100%)',
            backgroundBlendMode: 'overlay, lighten, overlay, color-burn, normal',
        },
    },
    {
        id: 'codioful-colorful-candy',
        style: {
            background:
                'linear-gradient(120deg, #FFFFFF 0%, #FF006B 100%), linear-gradient(235deg, #FFFFFF 0%, #FF006B 100%), linear-gradient(235deg, #FFFFFF 0%, #000000 100%), linear-gradient(90deg, #FFE037 0%, #FFE037 40%, #1DCD9F 40%, #1DCD9F 50%, #088C6F 50%, #088C6F 70%, #23033C 70%, #23033C 100%)',
            backgroundBlendMode: 'overlay, overlay, overlay, normal',
        },
    },
    {
        id: 'codioful-execute-pink',
        style: {
            background:
                'linear-gradient(125deg, #FFFFFF 0%, #000000 100%), linear-gradient(200deg, #FFD9E8 0%, #FFD9E8 50%, #DE95BA calc(50% + 1px), #DE95BA 60%, #7F4A88 calc(60% + 1px), #7F4A88 75%, #4A266A calc(75% + 1px), #4A266A 100%), linear-gradient(113deg, #FFD9E8 0%, #FFD9E8 40%, #DE95BA calc(40% + 1px), #DE95BA 50%, #7F4A88 calc(50% + 1px), #7F4A88 70%, #4A266A calc(70% + 1px), #4A266A 100%)',
            backgroundBlendMode: 'overlay, overlay, normal',
        },
    },
    {
        id: 'codioful-pretty-heroic',
        style: {
            background:
                'radial-gradient(100% 225% at 100% 0%, #FF0000 0%, #000000 100%), linear-gradient(236deg, #00C2FF 0%, #000000 100%), linear-gradient(135deg, #CDFFEB 0%, #CDFFEB 36%, #009F9D 36%, #009F9D 60%, #07456F 60%, #07456F 67%, #0F0A3C 67%, #0F0A3C 100%)',
            backgroundBlendMode: 'overlay, hard-light, normal',
        },
    },
    {
        id: 'codioful-coffeescript',
        style: {
            background:
                'linear-gradient(123deg, #FFFCAC 0%, #FFFFFF 67%), linear-gradient(180deg, #D8D8D8 0%, #6B0000 100%), linear-gradient(142deg, #F9F5F0 0%, #F9F5F0 33%, #F2EAD3 calc(33% + 1px), #F2EAD3 56%, #F4991A calc(56% + 1px), #F4991A 62%, #321313 calc(62% + 1px), #321313 100%)',
            backgroundBlendMode: 'multiply, overlay, normal',
        },
    },
    {
        id: 'codioful-candy-bar',
        style: {
            background:
                'linear-gradient(123deg, #2E99B0 0%, #2E99B0 40%, #FCD77F calc(40% + 1px), #FCD77F 60%, #FF2E4C calc(60% + 1px), #FF2E4C 75%, #1E1548 calc(75% + 1px), #1E1548 100%)',
        },
    },
    {
        id: 'codioful-inferior-trouble',
        style: {
            background:
                'linear-gradient(180deg, #012b35 0%, #00172C 100%), linear-gradient(36deg, #FAFF00 0%, #800000 73%), linear-gradient(110deg, #001D38 30%, #FBFF49 100%), linear-gradient(140deg, #61FF00 0%, #040EFF 72%), linear-gradient(127deg, #FFB800 0%, #02004D 100%), linear-gradient(140deg, #6DCA4C 28%, #CD0000 100%), radial-gradient(100% 100% at 70% 0%, #7A3B00 0%, #49B8A4 100%)',
            backgroundBlendMode:
                'overlay, color-dodge, difference, difference, difference, color-dodge, normal',
        },
    },
    {
        id: 'codioful-secret-wave',
        style: {
            background:
                'linear-gradient(121deg, #AD00FF 0%, #0C0056 100%), linear-gradient(121deg, #FA00FF 0%, rgba(0, 255, 71, 0) 100%), linear-gradient(127deg, #00F0FF 0%, #A80000 100%), radial-gradient(107% 142% at 15% 104%, #F3D0FC 0%, #1700A4 100%), radial-gradient(100% 100% at 50% 0%, #7300A9 0%, #00FFE0 100%), radial-gradient(100% 100% at 50% 0%, #7300A9 0%, #00FFE0 100%), linear-gradient(127deg, #B7D500 0%, #2200AA 100%)',
            backgroundBlendMode:
                'overlay, color, overlay, difference, color-dodge, difference, normal',
        },
    },
    {
        id: 'codioful-cherish-portray',
        style: {
            background:
                'linear-gradient(125deg, #FDFF9C 0%, #0500FF 100%), linear-gradient(180deg, #D3D3D3 0%, #161616 100%), linear-gradient(310deg, #00F0FF 0%, #00F0FF 20%, #0017E3 calc(20% + 1px), #0017E3 40%, #000F8F calc(40% + 1px), #000F8F 70%, #00073F calc(70% + 1px), #00073F 100%), linear-gradient(285deg, #FFB6B9 0%, #FFB6B9 35%, #FAE3D9 calc(35% + 1px), #FAE3D9 45%, #BBDED6 calc(45% + 1px), #BBDED6 65%, #61C0BF calc(65% + 1px), #61C0BF 100%)',
            backgroundBlendMode: 'overlay, overlay, exclusion, normal',
        },
    },
    {
        id: 'codioful-fearless-hue',
        style: {
            background:
                'linear-gradient(123deg, #FFFFFF 0%, #00B2FF 100%), linear-gradient(236deg, #BAFF99 0%, #005E64 100%), linear-gradient(180deg, #FFFFFF 0%, #002A5A 100%), linear-gradient(225deg, #0094FF 20%, #BFF4ED 45%, #280F34 45%, #280F34 70%, #FF004E 70%, #E41655 85%, #B30753 85%, #B30753 100%), linear-gradient(135deg, #0E0220 15%, #0E0220 35%, #E40475 35%, #E40475 60%, #48E0E4 60%, #48E0E4 68%, #D7FBF6 68%, #D7FBF6 100%)',
            backgroundBlendMode: 'overlay, overlay, overlay, darken, normal',
        },
    },
    {
        id: 'codioful-obedient-shade',
        style: {
            background:
                'linear-gradient(123deg, #461B93 0%, #461B93 40%, #6A3CBC calc(40% + 1px), #6A3CBC 60%, #8253D7 calc(60% + 1px), #8253D7 70%, #F78F1E calc(70% + 1px), #F78F1E 100%)',
        },
    },
    {
        id: 'codioful-eminent-wheel',
        style: {
            background:
                'conic-gradient(from 30deg, #FF0000 0%, #FFFF00 33.3%, #00FF00 33.4%, #00FFFF 66.6%, #0000FF 66.7%, #FF00FF 100%, #FF0000 100%)',
        },
    },
    {
        id: 'codioful-renowned-red',
        style: {
            background:
                'linear-gradient(60deg, #2B2E4A 0%, #2B2E4A 30%, #E84545 calc(30% + 1px), #E84545 60%, #903749 calc(60% + 1px), #903749 70%, #53354A calc(70% + 1px), #53354A 100%)',
        },
    },
    {
        id: 'codioful-faded-narrative',
        style: {
            background:
                'linear-gradient(70deg, #F9ED69 0%, #F9ED69 40%, #F08A5D calc(40% + 1px), #F08A5D 60%, #B83B5E calc(60% + 1px), #B83B5E 70%, #6A2C70 calc(70% + 1px), #6A2C70 100%)',
        },
    },
    {
        id: 'codioful-cheerful-orange',
        style: {
            background:
                'linear-gradient(40deg, #155263 9%, #155263 43%, #FF6F3C calc(43% + 1px), #FF6F3C 52%, #FF9A3C calc(52% + 1px), #FF9A3C 80%, #FFC93C calc(80% + 1px), #FFC93C 100%)',
        },
    },
    {
        id: 'codioful-unmatched-eclipse',
        style: {
            background:
                'linear-gradient(55deg, #212121 0%, #212121 40%, #323232 calc(40% + 1px), #323232 60%, #008F95 calc(60% + 1px), #008F95 70%, #14FFEC calc(70% + 1px), #14FFEC 100%)',
        },
    },
    {
        id: 'codioful-common-yarn',
        style: {
            background:
                'linear-gradient(288deg, #FFB6B9 0%, #FFB6B9 35%, #FAE3D9 calc(35% + 1px), #FAE3D9 45%, #BBDED6 calc(45% + 1px), #BBDED6 65%, #61C0BF calc(65% + 1px), #61C0BF 100%)',
        },
    },
    {
        id: 'codioful-satisfied-sepia',
        style: {
            background:
                'linear-gradient(110deg, #FFD9E8 4%, #FFD9E8 40%, #DE95BA calc(40% + 1px), #DE95BA 50%, #7F4A88 calc(50% + 1px), #7F4A88 70%, #4A266A calc(70% + 1px), #4A266A 100%)',
        },
    },
    {
        id: 'codioful-irritable-hero',
        style: {
            background:
                'linear-gradient(90deg, #00F0FF 0%, #00F0FF 40%, #0017E3 40%, #0017E3 60%, #000F8F 60%, #000F8F 70%, #00073F 70%, #00073F 100%)',
        },
    },
    {
        id: 'codioful-shipshape-mood',
        style: {
            background:
                'linear-gradient(56deg, rgb(255, 180, 172) 0%, rgb(255, 180, 172) 40%, rgb(103, 145, 134) calc(40% + 1px), rgb(103, 145, 134) 50%, rgb(38, 78, 112) calc(50% + 1px), rgb(38, 78, 112) 70%, rgb(255, 235, 211) calc(70% + 1px), rgb(255, 235, 211) 100%)',
        },
    },
    {
        id: 'codioful-virtual-shapes',
        style: {
            background:
                'linear-gradient(65deg, rgb(7, 26, 82) 3%, rgb(7, 26, 82) 40%, rgb(8, 105, 114) calc(40% + 1px), rgb(8, 105, 114) 60%, rgb(23, 185, 120) calc(60% + 1px), rgb(23, 185, 120) 68%, rgb(167, 255, 131) calc(68% + 1px), rgb(167, 255, 131) 100%)',
        },
    },
    {
        id: 'codioful-sensitive-destination',
        style: {
            background:
                'linear-gradient(120deg, #FF00C7 0%, #51003F 100%), linear-gradient(120deg, #0030AD 0%, #00071A 100%), linear-gradient(180deg, #000346 0%, #FF0000 100%), linear-gradient(60deg, #0029FF 0%, #AA0014 100%), radial-gradient(100% 165% at 100% 100%, #FF00A8 0%, #00FF47 100%), radial-gradient(100% 150% at 0% 0%, #FFF500 0%, #51D500 100%)',
            backgroundBlendMode: 'overlay, color-dodge, overlay, overlay, difference, normal',
        },
    },
    {
        id: 'codioful-whimsical-orb',
        style: {
            background:
                'linear-gradient(320.54deg, #00069F 0%, #120010 72.37%), linear-gradient(58.72deg, #69D200 0%, #970091 100%), linear-gradient(121.28deg, #8CFF18 0%, #6C0075 100%), linear-gradient(121.28deg, #8000FF 0%, #000000 100%), linear-gradient(180deg, #00FF19 0%, #24FF00 0.01%, #2400FF 100%), linear-gradient(52.23deg, #0500FF 0%, #FF0000 100%), linear-gradient(121.28deg, #32003A 0%, #FF4040 100%), radial-gradient(50% 72.12% at 50% 50%, #EB00FF 0%, #110055 100%)',
            backgroundBlendMode:
                'screen, color-dodge, color-burn, screen, overlay, difference, color-dodge, normal',
        },
    },
    {
        id: 'codioful-happy-journey',
        style: {
            background:
                'linear-gradient(45deg, #C7F5FE 10%, #C7F5FE 40%, #FCC8F8 40%, #FCC8F8 60%, #EAB4F8 60%, #EAB4F8 65%, #F3F798 65%, #F3F798 90%)',
        },
    },
    {
        id: 'codioful-layered-rays',
        style: {
            background:
                'linear-gradient(200deg, rgb(255, 255, 255) 10%, rgb(0, 6, 47) 80%), linear-gradient(110deg, rgb(255, 65, 65) 30%, rgb(0, 28, 100) 110%), radial-gradient(100% 220% at 100% 0%, rgb(128, 0, 255) 0%, rgb(255, 255, 255) 30%, rgb(0, 160, 255) 100%), linear-gradient(60deg, rgb(34, 0, 242) 0%, rgb(83, 0, 0) 100%), linear-gradient(150deg, rgb(185, 0, 255) 0%, rgb(0, 136, 123) 90%), linear-gradient(220deg, rgb(252, 0, 0) 0%, rgba(0, 50, 255, 1) 75%), linear-gradient(220deg, rgb(0, 255, 55) 0%, rgb(255, 223, 0) 70%), radial-gradient(55% 100% at 50% 0%, rgb(2, 1, 1) 0%, rgb(0, 52, 187) 100%)',
            backgroundBlendMode:
                'overlay, overlay, color-burn, screen, color-burn, difference, color-dodge, normal',
        },
    },
    {
        id: 'codioful-pipe-dream',
        style: {
            background:
                'linear-gradient(238.72deg, #FFB864 0%, #006C4C 100%), radial-gradient(100% 224.43% at 0% 0%, #FCC482 0%, #002E74 100%), linear-gradient(121.28deg, #FFEAB6 0%, #00563C 100%), linear-gradient(229.79deg, #7534FF 0%, #248900 94.19%), radial-gradient(56.26% 101.79% at 50% 0%, #8F00FF 0%, #493500 100%), linear-gradient(65.05deg, #6F0072 0%, #FFD600 100%)',
            backgroundBlendMode: 'overlay, screen, color-burn, hard-light, screen, normal',
        },
    },
    {
        id: 'codioful-unreal-shot',
        style: {
            background:
                'linear-gradient(180deg, #F7D6FF 0%, #005686 100%), linear-gradient(180deg, #FFFFFF 0%, #060046 100%), linear-gradient(127.43deg, #FF0099 0%, #1A003C 100%), linear-gradient(307.27deg, #FF0000 0.37%, #3300C6 100%), radial-gradient(50% 71.96% at 50% 50%, #004584 0%, #00FFB2 100%), radial-gradient(100% 140% at 100% 0%, #5ED500 0%, #2200AA 100%)',
            backgroundBlendMode: 'soft-light, overlay, difference, difference, color-burn, normal',
        },
    },
    {
        id: 'codioful-gleaming-fate',
        style: {
            background:
                'linear-gradient(121.28deg, #31BC00 0%, #000000 100%), linear-gradient(180deg, #5200FF 0%, #1A0050 100%), linear-gradient(341.1deg, #FF0000 7.52%, #1700A4 77.98%), radial-gradient(49.82% 80.51% at 49.82% 50%, #5A0069 0%, #FF3D00 100%), radial-gradient(50% 72.12% at 50% 50%, #EB00FF 0%, #110055 100%)',
            backgroundBlendMode: 'color-dodge, overlay, difference, difference, normal',
        },
    },
    {
        id: 'codioful-water-ripple',
        style: {
            background:
                'linear-gradient(301.28deg, #FFFFFF 51.74%, #1B00C0 100%), linear-gradient(121.28deg, #003077 0%, #88DBFF 100%), radial-gradient(100% 188.01% at 76.14% 0%, #43DDFF 0%, #FF0000 100%), linear-gradient(0deg, #DB00FF 0%, #14FF00 100%), radial-gradient(59.2% 100% at 50% 100%, #D50000 0%, #00B2FF 100%), radial-gradient(100% 148.07% at 0% 0%, #D50000 0%, #00FFFF 100%)',
            backgroundBlendMode: 'multiply, overlay, overlay, overlay, difference, normal',
        },
    },
    {
        id: 'codioful-ideal-fiction',
        style: {
            background:
                'linear-gradient(180deg, #1400FF 0%, #000000 100%), linear-gradient(154.03deg, #33FF00 0%, #FF003D 74.04%), linear-gradient(341.1deg, #F0B4FF 7.52%, #1700A4 77.98%), radial-gradient(49.82% 80.51% at 49.82% 50%, #8100A2 0%, #FF3D00 100%), radial-gradient(50% 72.12% at 50% 50%, #EB00FF 0%, #110055 100%)',
            backgroundBlendMode: 'overlay, difference, difference, difference, normal',
        },
    },
    {
        id: 'codioful-irregular-sky',
        style: {
            background:
                'linear-gradient(90deg, #FF0000 0%, #7D9C00 100%), linear-gradient(238.72deg, #EBFF00 0%, #7700D5 100%), linear-gradient(64.82deg, #AD00FF 0%, #FF0000 100%), radial-gradient(100% 144.76% at 0% 0%, #FF0000 0%, #1400FF 100%), radial-gradient(100% 140% at 100% 0%, #A6FF60 0%, #2700C1 100%)',
            backgroundBlendMode: 'overlay, color-dodge, difference, color-dodge, normal',
        },
    },
    {
        id: 'codioful-artificial-nature',
        style: {
            background:
                'linear-gradient(140.54deg, #608D00 0%, #D30000 72.37%), linear-gradient(58.72deg, #0029FF 0%, #8FFF00 100%), radial-gradient(100% 164.72% at 100% 100%, #6100FF 0%, #00FF57 100%), radial-gradient(100% 148.07% at 0% 0%, #FFF500 0%, #51D500 100%)',
            backgroundBlendMode: 'color-dodge, overlay, difference, normal',
        },
    },
    {
        id: 'codioful-new-blush',
        style: {
            background:
                'linear-gradient(121.28deg, #DC8400 0%, #FFFFFF 40.08%), linear-gradient(140.54deg, #FF0000 0%, #0047FF 72.37%), linear-gradient(121.28deg, #00E384 0%, #FF0000 100%), linear-gradient(121.28deg, #FA00FF 0%, #00FF38 100%), linear-gradient(127.43deg, #00F0FF 0%, #A80000 100%), radial-gradient(100.47% 100% at 50% 100%, #70FF00 0%, #680199 100%), linear-gradient(127.43deg, #B7D500 0%, #2200AA 100%)',
            backgroundBlendMode: 'darken, hue, overlay, color, color-dodge, difference, normal',
        },
    },
    {
        id: 'codioful-first-chapter',
        style: {
            background:
                'linear-gradient(238.72deg, #FFE5C7 0%, #00C288 100%), radial-gradient(90.88% 100% at 50% 0%, #439246 0%, #183766 100%), linear-gradient(121.28deg, #FFEAB6 0%, #003C2A 100%), radial-gradient(64.89% 100% at 50% 0%, #80BAFF 0%, #001E41 100%), linear-gradient(65.05deg, #6F0072 0%, #FFC700 100%)',
            backgroundBlendMode: 'overlay, screen, color-burn, lighten, normal',
        },
    },
    {
        id: 'codioful-illusive-love',
        style: {
            background:
                'linear-gradient(58.72deg, #FF20DB 0%, #FFFFFF 100%), linear-gradient(180deg, #FFFFFF 0%, #060046 100%), linear-gradient(64.82deg, #AD00FF 0%, #FF0000 100%), linear-gradient(307.27deg, #FF9900 0.37%, #150052 100%), radial-gradient(67.08% 100% at 50% 0%, #76005C 0%, #0500FF 100%), radial-gradient(100% 140% at 100% 0%, #5ED500 0%, #2200AA 100%)',
            backgroundBlendMode: 'soft-light, overlay, difference, difference, color-burn, normal',
        },
    },
    {
        id: 'codioful-biotic-green',
        style: {
            background:
                'linear-gradient(58.72deg, #000000 0%, #020063 100%), linear-gradient(360deg, #FF004D 0%, #D459FF 100%), radial-gradient(62.17% 100% at 50% 100%, #FF00F5 0%, #00FF75 100%), radial-gradient(50% 69.28% at 50% 50%, #AAD500 0%, #49006B 100%), radial-gradient(100% 148.07% at 0% 0%, #D50000 0%, #00FFFF 100%)',
            backgroundBlendMode: 'screen, color-burn, difference, difference, normal',
        },
    },
    {
        id: 'codioful-new-collaboration',
        style: {
            background:
                'linear-gradient(238.72deg, #0044A9 0%, #F700A3 100%), radial-gradient(100% 188.01% at 76.14% 0%, #43DDFF 0%, #FF0000 100%), linear-gradient(0deg, #DB00FF 0%, #14FF00 100%), radial-gradient(59.2% 100% at 50% 100%, #6A00D5 0%, #00E0FF 100%), radial-gradient(100% 148.07% at 0% 0%, #FF9900 0%, #001AFF 100%)',
            backgroundBlendMode: 'hard-light, overlay, color-burn, color-burn, normal',
        },
    },
    {
        id: 'codioful-chroma-serenity',
        style: {
            background:
                'linear-gradient(50.22deg, #0066FF 0%, #FFAA7A 51.63%), linear-gradient(238.72deg, #FF0000 0%, #000000 100%), linear-gradient(301.28deg, #FF0000 0%, #735A00 100%), linear-gradient(121.28deg, #207A00 0%, #950000 100%), linear-gradient(238.72deg, #FFB800 0%, #000000 100%), linear-gradient(238.72deg, #00D1FF 0%, #00FF38 100%), linear-gradient(58.72deg, #B80000 0%, #1B00C2 100%), linear-gradient(125.95deg, #00E0FF 10.95%, #87009D 100%), linear-gradient(263.7deg, #B60000 3.43%, #B100A0 96.57%), linear-gradient(130.22deg, #DBFF00 18.02%, #3300FF 100%)',
            backgroundBlendMode:
                'multiply, color-dodge, difference, color-dodge, difference, lighten, difference, color-dodge, difference, normal',
        },
    },
    {
        id: 'codioful-red-legacy',
        style: {
            background:
                'linear-gradient(238.72deg, #FF0000 0%, #56124F 100%), linear-gradient(127.43deg, #00FFFF 0%, #FF4444 100%), radial-gradient(100.22% 100% at 70.57% 0%, #FF0000 0%, #00FFE0 100%), linear-gradient(127.43deg, #B7D500 0%, #3300FF 100%)',
            backgroundBlendMode: 'hard-light, color-burn, color-dodge, normal',
        },
    },
    {
        id: 'codioful-undefined-ways',
        style: {
            background:
                'linear-gradient(301.28deg, #00C2FF 54.38%, rgba(0, 255, 224, 0) 100%), linear-gradient(129.96deg, #FF2F2F 10.43%, #000460 92.78%), radial-gradient(100% 246.94% at 100% 0%, #8000FF 0%, #BA75FF 54.17%, #FF0000 100%), linear-gradient(58.72deg, #2200F2 0%, #530000 100%), linear-gradient(154.03deg, #FF0000 0%, #00FF94 74.04%), linear-gradient(301.27deg, #FF0000 0%, #0038FF 84.63%), linear-gradient(136.23deg, #00C2FF 11.12%, #FF0000 86.47%), radial-gradient(57.37% 100% at 50% 0%, #B50000 0%, #0034BB 100%)',
            backgroundBlendMode:
                'multiply, overlay, color-burn, screen, difference, difference, difference, normal',
        },
    },
    {
        id: 'codioful-colorful-utopia',
        style: {
            background:
                'linear-gradient(121.28deg, #010012 0%, #00FF94 100%), linear-gradient(180deg, #00647A 0%, #FFFFFF 100%), linear-gradient(244.35deg, #FFB26A 0%, #C15151 50.58%, #00A3FF 100%), linear-gradient(244.35deg, #E03F3F 0%, #00114B 49.48%, #FF0000 100%), radial-gradient(100% 233.99% at 0% 100%, #FF0000 0%, #AD00FF 100%), linear-gradient(307.27deg, #096F5C 0.37%, #687EB5 50.19%, #8877CE 100%), radial-gradient(100% 140% at 100% 0%, #FF00C7 0%, #006C7A 49.48%, #FF9900 100%)',
            backgroundBlendMode:
                'overlay, difference, overlay, overlay, difference, color-dodge, normal',
        },
    },
    {
        id: 'codioful-space-playground',
        style: {
            background:
                'linear-gradient(300deg, rgb(0, 3, 71) 10%, rgb(0, 0, 0) 100%), linear-gradient(300deg, rgb(255, 255, 255) 120%, rgb(36, 0, 255) 100%), linear-gradient(190deg, rgb(0, 68, 170) 0%, rgb(255, 255, 255) 100%), radial-gradient(100% 200% at 70% 0%, rgb(67, 221, 255) 0%, rgb(255, 0, 0) 100%), linear-gradient(0deg, rgb(219, 0, 255) 0%, rgb(58, 255, 40) 100%), radial-gradient(200% 100% at 50% 80%, rgb(106, 0, 213) 0%, rgb(0, 224, 255) 100%), radial-gradient(100% 150% at 0% 0%, rgb(0, 255, 255) 5%, rgb(255, 0, 0) 100%)',
            backgroundBlendMode:
                'lighten, multiply, overlay, overlay, color-burn, color-burn, normal',
        },
    },
    {
        id: 'codioful-faded-desire',
        style: {
            background:
                'linear-gradient(238.72deg, #0044A9 0%, #F700A3 100%), radial-gradient(100% 188.01% at 76.14% 0%, #43DDFF 0%, #FF0000 100%), linear-gradient(0deg, #DB00FF 0%, #14FF00 100%), radial-gradient(59.2% 100% at 50% 0%, #8000FF 0%, #0085FF 100%), radial-gradient(100% 148.07% at 0% 0%, #FC8800 0%, #00FF94 100%)',
            backgroundBlendMode: 'hard-light, overlay, color-burn, color-burn, normal',
        },
    },
    {
        id: 'codioful-red-fairy',
        style: {
            background:
                'linear-gradient(129.96deg, #FF2F2F 10.43%, #000460 92.78%), radial-gradient(100% 246.94% at 100% 0%, #FFFFFF 0%, #020063 100%), linear-gradient(58.72deg, #2200F2 0%, #530000 100%), linear-gradient(154.03deg, #B70000 0%, #FF003D 74.04%), linear-gradient(341.1deg, #FF0000 7.52%, #0038FF 77.98%), linear-gradient(136.23deg, #00C2FF 11.12%, #FF0000 86.47%), radial-gradient(57.37% 100% at 50% 0%, #B50000 0%, #0034BB 100%)',
            backgroundBlendMode:
                'overlay, color-burn, screen, overlay, difference, difference, normal',
        },
    },
    {
        id: 'codioful-teal-eclipse',
        style: {
            background:
                'linear-gradient(238.72deg, #EBFF00 0%, #7700D5 100%), linear-gradient(64.82deg, #AD00FF 0%, #FF0000 100%), linear-gradient(65.03deg, #00FFFF 0%, #FF0000 99.79%), radial-gradient(67.08% 100% at 50% 0%, #FF00C7 0%, #1400FF 100%), radial-gradient(100% 140% at 100% 0%, #5ED500 0%, #2200AA 100%)',
            backgroundBlendMode: 'color-dodge, difference, lighten, color-dodge, normal',
        },
    },
    {
        id: 'codioful-hallucinatory',
        style: {
            background:
                'linear-gradient(90deg, #FF0000 0%, #7D9C00 100%), linear-gradient(238.72deg, #EBFF00 0%, #7700D5 100%), linear-gradient(64.82deg, #AD00FF 0%, #FF0000 100%), linear-gradient(65.03deg, #00B2FF 0%, #FF0000 99.79%), radial-gradient(100% 144.76% at 0% 0%, #FF0000 0%, #1400FF 100%), radial-gradient(100% 140% at 100% 0%, #A6FF60 0%, #2700C1 100%)',
            backgroundBlendMode: 'overlay, color-dodge, difference, lighten, color-dodge, normal',
        },
    },
    {
        id: 'codioful-radial-ridge',
        style: {
            background:
                'linear-gradient(121.28deg, #03002C 0%, #00FF94 100%), linear-gradient(180deg, #00647A 0%, #FFFFFF 100%), linear-gradient(244.35deg, #FF8282 0%, #E86B6B 50.58%, #001B29 100%), linear-gradient(244.35deg, #E03F3F 0%, #00114B 49.48%, #FF0000 100%), radial-gradient(100% 216.55% at 0% 0%, #2400FF 0%, #FF0000 44.27%, #610051 100%), linear-gradient(307.27deg, #096F5C 0.37%, #687EB5 50.19%, #8877CE 100%), radial-gradient(56.34% 100% at 36.02% 0%, #FF00C7 0%, #006C7A 38.54%, #FF9900 100%)',
            backgroundBlendMode:
                'overlay, difference, overlay, overlay, difference, color-dodge, normal',
        },
    },
    {
        id: 'codioful-bright-rain',
        style: {
            background:
                'radial-gradient(50% 123.47% at 50% 50%, #00FF94 0%, #720059 100%), linear-gradient(121.28deg, #669600 0%, #FF0000 100%), linear-gradient(360deg, #0029FF 0%, #8FFF00 100%), radial-gradient(100% 164.72% at 100% 100%, #6100FF 0%, #00FF57 100%), radial-gradient(100% 148.07% at 0% 0%, #FFF500 0%, #51D500 100%)',
            backgroundBlendMode: 'screen, color-dodge, overlay, difference, normal',
        },
    },
    {
        id: 'codioful-romantic-sun',
        style: {
            background:
                'linear-gradient(180deg, #FFB7B7 0%, #727272 100%), radial-gradient(60.91% 100% at 50% 0%, #FFD1D1 0%, #260000 100%), linear-gradient(238.72deg, #FFDDDD 0%, #720066 100%), linear-gradient(127.43deg, #00FFFF 0%, #FF4444 100%), radial-gradient(100.22% 100% at 70.57% 0%, #FF0000 0%, #00FFE0 100%), linear-gradient(127.43deg, #B7D500 0%, #3300FF 100%)',
            backgroundBlendMode: 'screen, overlay, hard-light, color-burn, color-dodge, normal',
        },
    },
    {
        id: 'codioful-special-sage',
        style: {
            background:
                'linear-gradient(121.28deg, #03002C 0%, #00FF94 100%), linear-gradient(180deg, #00647A 0%, #FFFFFF 100%), linear-gradient(244.35deg, #FF8282 0%, #E86B6B 50.58%, #001B29 100%), linear-gradient(244.35deg, #E03F3F 0%, #00114B 49.48%, #FF0000 100%), radial-gradient(100% 216.55% at 0% 0%, #2400FF 0%, #FF0000 44.27%, #610051 100%), linear-gradient(307.27deg, #096F5C 0.37%, #687EB5 50.19%, #8877CE 100%), radial-gradient(56.34% 100% at 36.02% 0%, #FF00C7 0%, #006C7A 38.54%, #FF9900 100%)',
            backgroundBlendMode:
                'overlay, difference, exclusion, overlay, difference, color-dodge, normal',
        },
    },
    {
        id: 'codioful-soft-weather',
        style: {
            background:
                'radial-gradient(80.99% 100% at 50% 0%, #00FF0A 0%, #36008E 100%), radial-gradient(50% 123.47% at 50% 50%, #EFE7C8 0%, #36008E 100%), linear-gradient(301.28deg, #FF006B 0%, #48DD9E 100%), linear-gradient(294.84deg, #5A60E4 0%, #D30000 100%), linear-gradient(52.29deg, #000000 0%, #00FF85 100%), radial-gradient(100% 138.69% at 100% 0%, #0007A5 0%, #FF7A00 100%), radial-gradient(70.41% 100% at 50% 0%, #D5B300 0%, #2200AA 100%)',
            backgroundBlendMode: 'screen, screen, lighten, overlay, lighten, difference, normal',
        },
    },
    {
        id: 'codioful-dual-personality',
        style: {
            background:
                'linear-gradient(328.78deg, #030086 14.45%, #BD6177 84.36%), linear-gradient(301.28deg, #209B4A 0%, #7000FF 100%), radial-gradient(100% 138.56% at 100% 0%, #D50000 0%, #00FFE0 100%), radial-gradient(100% 148.07% at 0% 0%, #D50000 0%, #00FFFF 100%)',
            backgroundBlendMode: 'soft-light, overlay, difference, normal',
        },
    },
    {
        id: 'codioful-holographic-painting',
        style: {
            background:
                'radial-gradient(50% 123.47% at 50% 50%, #00FF94 0%, #FF00C7 100%), linear-gradient(121.28deg, #213100 0%, #FF0000 100%), linear-gradient(360deg, #0029FF 0%, #8FFF00 100%), linear-gradient(114.9deg, #00C6A2 0%, #6A45A8 100%), radial-gradient(100% 148.07% at 0% 0%, #FFFFFF 0%, #1DCD00 100%)',
            backgroundBlendMode: 'screen, color-dodge, overlay, difference, normal',
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
        class: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500',
    },
    {
        id: 'hyper-oceanic',
        class: 'bg-gradient-to-br from-green-300 via-blue-500 to-purple-600',
    },
    {
        id: 'hyper-cotton-candy',
        class: 'bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400',
    },
    {
        id: 'hyper-gotham',
        class: 'bg-gradient-to-br from-gray-700 via-gray-900 to-black',
    },
    {
        id: 'hyper-sunset',
        class: 'bg-gradient-to-br from-indigo-200 via-red-200 to-yellow-100',
    },
    {
        id: 'hyper-mojave',
        class: 'bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500',
    },
    {
        id: 'hyper-beachside',
        class: 'bg-gradient-to-br from-yellow-200 via-green-200 to-green-500',
    },
    {
        id: 'hyper-gunmetal',
        class: 'bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600',
    },
    {
        id: 'hyper-peachy',
        class: 'bg-gradient-to-br from-red-200 via-red-300 to-yellow-200',
    },
    {
        id: 'hyper-seafoam',
        class: 'bg-gradient-to-br from-green-200 via-green-300 to-blue-500',
    },
    {
        id: 'hyper-pumpkin',
        class: 'bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700',
    },
    {
        id: 'hyper-pandora',
        class: 'bg-gradient-to-br from-green-200 via-green-400 to-purple-700',
    },
    {
        id: 'hyper-valentine',
        class: 'bg-gradient-to-br from-red-200 to-red-600',
    },
    {
        id: 'hyper-hawaii',
        class: 'bg-gradient-to-br from-green-300 via-yellow-300 to-pink-300',
    },
    {
        id: 'hyper-lavender',
        class: 'bg-gradient-to-br from-indigo-300 to-purple-400',
    },
    {
        id: 'hyper-wintergreen',
        class: 'bg-gradient-to-br from-green-200 to-green-500',
    },
    {
        id: 'hyper-huckleberry',
        class: 'bg-gradient-to-br from-purple-200 via-purple-400 to-purple-800',
    },
    {
        id: 'hyper-blue-steel',
        class: 'bg-gradient-to-br from-gray-400 via-gray-600 to-blue-800',
    },
    {
        id: 'hyper-arendelle',
        class: 'bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500',
    },
    {
        id: 'hyper-spearmint',
        class: 'bg-gradient-to-br from-green-200 via-green-400 to-green-500',
    },
    {
        id: 'hyper-minnesota',
        class: 'bg-gradient-to-br from-purple-400 to-yellow-400',
    },
    {
        id: 'hyper-bombpop',
        class: 'bg-gradient-to-br from-red-400 via-gray-300 to-blue-500',
    },
    {
        id: 'hyper-acadia',
        class: 'bg-gradient-to-br from-red-800 via-yellow-600 to-yellow-500',
    },
    {
        id: 'hyper-sonora',
        class: 'bg-gradient-to-br from-yellow-200 to-yellow-500',
    },
    {
        id: 'hyper-paradise',
        class: 'bg-gradient-to-br from-blue-300 via-green-200 to-yellow-300',
    },
    {
        id: 'hyper-sierra-mist',
        class: 'bg-gradient-to-br from-yellow-200 via-green-200 to-green-300',
    },
    {
        id: 'hyper-creamsicle',
        class: 'bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400',
    },
    {
        id: 'hyper-midnight',
        class: 'bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900',
    },
    {
        id: 'hyper-borealis',
        class: 'bg-gradient-to-br from-green-300 to-purple-400',
    },
    {
        id: 'hyper-strawberry',
        class: 'bg-gradient-to-br from-yellow-200 via-pink-200 to-pink-400',
    },
    {
        id: 'hyper-flamingo',
        class: 'bg-gradient-to-br from-pink-400 to-pink-600',
    },
    {
        id: 'hyper-burning sunrise',
        class: 'bg-gradient-to-br from-yellow-600 to-red-600',
    },
    {
        id: 'hyper-apple',
        class: 'bg-gradient-to-br from-green-500 to-green-700',
    },
    {
        id: 'hyper-watermelon',
        class: 'bg-gradient-to-br from-red-500 to-green-500',
    },
    {
        id: 'hyper-flare',
        class: 'bg-gradient-to-br from-orange-600 to-orange-500',
    },
    {
        id: 'hyper-rasta',
        class: 'bg-gradient-to-br from-lime-600 via-yellow-300 to-red-600',
    },
    {
        id: 'hyper-lust',
        class: 'bg-gradient-to-br from-rose-700 to-pink-600',
    },
    {
        id: 'hyper-sublime',
        class: 'bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500',
    },
    {
        id: 'hyper-witch',
        class: 'bg-gradient-to-br from-blue-gray-900 via-purple-900 to-blue-gray-900',
    },
    {
        id: 'hyper-powerpuff',
        class: 'bg-gradient-to-br from-sky-400 via-rose-400 to-lime-400',
    },
    {
        id: 'hyper-solid-blue',
        class: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
        id: 'hyper-ice',
        class: 'bg-gradient-to-br from-rose-100 to-teal-100',
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
        class: 'bg-gradient-to-br from-rose-400 to-orange-300',
    },
    {
        id: 'hyper-space',
        class: 'bg-gradient-to-b from-cool-gray-900 to-bg-gradient-to-br-gray-600',
    },
    {
        id: 'hyper-earth',
        class: 'bg-gradient-to-br from-teal-200 to-lime-200',
    },
    {
        id: 'hyper-picture',
        class: 'bg-gradient-to-br from-fuchsia-500 via-red-600 to-orange-400',
    },
    {
        id: 'hyper-messenger',
        class: 'bg-gradient-to-br from-sky-400 to-blue-500',
    },
    {
        id: 'hyper-sea',
        class: 'bg-gradient-to-br from-cyan-200 to-cyan-400',
    },
    {
        id: 'hyper-payment',
        class: 'bg-gradient-to-br from-sky-400 to-cyan-300',
    },
    {
        id: 'hyper-video',
        class: 'bg-gradient-to-br from-red-500 to-red-800',
    },
    {
        id: 'hyper-passion',
        class: 'bg-gradient-to-br from-rose-500 via-red-400 to-red-500',
    },
    {
        id: 'hyper-flower',
        class: 'bg-gradient-to-br from-violet-300 to-violet-400',
    },
    {
        id: 'hyper-cool-sunset',
        class: 'bg-gradient-to-br from-orange-300 to-rose-300',
    },
    {
        id: 'hyper-pink-neon',
        class: 'bg-gradient-to-br from-fuchsia-600 to-pink-600',
    },
    {
        id: 'hyper-blue-sand',
        class: 'bg-gradient-to-br from-blue-gray-500 to-yellow-100',
    },
    {
        id: 'hyper-emerald',
        class: 'bg-gradient-to-br from-emerald-500 to-lime-600',
    },
    {
        id: 'hyper-relaxed-rose',
        class: 'bg-gradient-to-br from-rose-300 to-rose-500',
    },
    {
        id: 'hyper-purple-haze',
        class: 'bg-gradient-to-br from-purple-800 via-violet-900 to-purple-800',
    },
    {
        id: 'hyper-silver',
        class: 'bg-gradient-to-br from-cool-gray-100 to-cool-gray-300',
    },
    {
        id: 'hyper-orange-coral',
        class: 'bg-gradient-to-br from-orange-400 to-rose-400',
    },
    {
        id: 'hyper-blue-coral',
        class: 'bg-gradient-to-br from-blue-400 to-emerald-400',
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
        class: 'bg-gradient-to-br from-yellow-400 via-gray-50 to-teal-300',
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
