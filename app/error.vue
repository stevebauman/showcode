<template>
    <div
        class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#09090b] text-white antialiased"
    >
        <!-- Background Gradients -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div
                class="absolute -left-[10%] -top-[25%] h-[150%] w-[150%] bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.15),transparent_40%)]"
            ></div>
            <div
                class="absolute -right-[10%] top-[10%] h-[100%] w-[100%] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_40%)]"
            ></div>
        </div>

        <div
            class="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pb-16 pt-16 text-center sm:pb-24 sm:pt-24 lg:px-8"
        >
            <!-- Header/Logo -->
            <div class="mb-10 flex justify-center sm:mb-12">
                <Logo class="h-20 w-20 drop-shadow-2xl" />
            </div>

            <!-- Hero Content -->
            <div class="mx-auto max-w-3xl text-center">
                <p class="mb-4 text-xl font-bold uppercase tracking-widest text-indigo-400">
                    {{ error.statusCode === 404 ? '404' : 'Error' }}
                </p>

                <h1 class="mb-6 text-5xl font-black tracking-tight text-white sm:text-7xl">
                    {{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
                </h1>

                <p class="mx-auto mb-10 mt-6 max-w-xl text-lg leading-8 text-zinc-400 sm:text-xl">
                    {{
                        error.statusCode === 404
                            ? "Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist."
                            : error.message || 'An unexpected error occurred.'
                    }}
                </p>

                <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        @click="handleError"
                        size="lg"
                        class="w-full rounded-full bg-white px-8 py-6 text-lg font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 sm:w-auto"
                    >
                        Go back home
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    error: Object,
});

const handleError = () => clearError({ redirect: '/' });
</script>
