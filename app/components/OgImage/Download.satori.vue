<template>
    <div
        class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#09090b] text-white"
    >
        <div
            class="absolute -left-40 -top-40 h-[700px] w-[700px] rounded-full"
            style="background: radial-gradient(circle, rgba(79,70,229,0.35), transparent 60%)"
        />
        <div
            class="absolute -right-40 -bottom-40 h-[700px] w-[700px] rounded-full"
            style="background: radial-gradient(circle, rgba(168,85,247,0.35), transparent 60%)"
        />
        <div
            class="absolute inset-0"
            style="background: linear-gradient(180deg, rgba(9,9,11,0) 0%, rgba(9,9,11,0.6) 100%)"
        />

        <div class="relative flex flex-col items-center justify-center px-20 text-center">
            <div class="mb-10 flex items-center justify-center">
                <svg
                    width="120"
                    height="84"
                    viewBox="0 0 620 436"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M264.335 416.59C251.515 429.41 234.712 435.814 217.913 435.814C201.111 435.814 184.308 429.41 171.484 416.586L19.2272 264.325C-6.40907 238.693 -6.40907 197.118 19.2272 171.482L151.686 39.023C107.299 91.3271 109.789 169.825 159.161 219.198C161.738 221.775 164.387 224.216 167.119 226.534L264.327 323.742C289.967 349.382 289.967 390.953 264.335 416.59Z"
                        fill="url(#og_p0)"
                    />
                    <path
                        d="M158.19 218.214C108.817 168.841 107.299 91.3272 151.686 39.0232L167.286 23.4231C178.258 14.1037 190.385 6.85933 203.15 1.67392C224.453 -3.22473 247.732 2.62969 264.327 19.2254C277.143 32.0455 283.555 48.8523 283.555 65.6551C283.555 82.4578 277.151 99.2566 264.335 112.077L158.496 217.912L158.19 218.214"
                        fill="url(#og_p1)"
                    />
                    <path
                        d="M355.669 19.2254C368.485 6.40524 385.288 0.00114294 402.091 0.00114294C418.889 0.00114294 435.692 6.40525 448.516 19.2294L600.773 171.486C626.409 197.122 626.409 238.697 600.773 264.329L468.314 396.792C512.705 344.488 510.211 265.99 460.839 216.617C458.262 214.04 455.613 211.599 452.881 209.281L355.673 112.073C330.033 86.4325 330.033 44.8577 355.669 19.2254Z"
                        fill="url(#og_p2)"
                    />
                    <path
                        d="M461.747 217.537C511.12 266.91 512.705 344.488 468.314 396.792L452.714 412.392C441.742 421.707 429.615 428.956 416.85 434.141C395.547 439.04 372.269 433.185 355.673 416.59C342.857 403.769 336.445 386.963 336.445 370.16C336.445 353.357 342.849 336.554 355.669 323.738L461.504 217.903L461.747 217.537"
                        fill="url(#og_p3)"
                    />
                    <defs>
                        <linearGradient
                            id="og_p0"
                            x1="0"
                            y1="435.814"
                            x2="375.401"
                            y2="167.541"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#FAB2FF" />
                            <stop offset="1" stop-color="#1904E5" />
                        </linearGradient>
                        <linearGradient
                            id="og_p1"
                            x1="264.331"
                            y1="19.2294"
                            x2="111.769"
                            y2="171.792"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#5A31B2" />
                            <stop offset="1" stop-color="#141622" />
                        </linearGradient>
                        <linearGradient
                            id="og_p2"
                            x1="336.442"
                            y1="396.792"
                            x2="711.843"
                            y2="128.52"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#FAB2FF" />
                            <stop offset="1" stop-color="#1904E5" />
                        </linearGradient>
                        <linearGradient
                            id="og_p3"
                            x1="355.641"
                            y1="416.554"
                            x2="508.204"
                            y2="263.991"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#5A31B3" />
                            <stop offset="1" stop-color="#141622" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div class="flex flex-col items-center text-center">
                <div
                    class="text-[80px] font-black leading-[1.05] tracking-tight text-white"
                >
                    Design beautiful
                </div>
                <div
                    class="text-[80px] font-black leading-[1.05] tracking-tight"
                    style="background: linear-gradient(90deg, #818cf8 0%, #c084fc 50%, #f472b6 100%); -webkit-background-clip: text; background-clip: text; color: transparent"
                >
                    code screenshots
                </div>
            </div>

            <div class="mt-10 text-[28px] font-medium text-zinc-400">
                {{ tagline }}
            </div>

            <div class="mt-12 flex items-center gap-4">
                <div
                    class="flex items-center rounded-full bg-white px-8 py-4 text-[24px] font-semibold text-zinc-950"
                >
                    Download for Desktop
                </div>
                <div class="text-[20px] font-medium text-zinc-500">
                    macOS · Windows · Linux
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    tagline: {
        type: String,
        default: 'Showcode for Desktop. Now completely free.',
    },
});
</script>
