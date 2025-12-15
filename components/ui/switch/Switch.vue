<script setup>
import { reactiveOmit } from "@vueuse/core";
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps({
  defaultValue: { type: Boolean, required: false },
  modelValue: { type: [Boolean, null], required: false },
  disabled: { type: Boolean, required: false },
  id: { type: String, required: false },
  value: { type: String, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  name: { type: String, required: false },
  required: { type: Boolean, required: false },
  class: { type: null, required: false },
});

const emits = defineEmits(["update:modelValue"]);

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    :class="
      cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        props.class,
      )
    "
  >
    <SwitchThumb
      :class="
        cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5',
        )
      "
    >
      <slot name="thumb" />
    </SwitchThumb>
  </SwitchRoot>
</template>
