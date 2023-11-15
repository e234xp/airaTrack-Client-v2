<template>
  <svg aria-hidden="true">
    <use
      :href="symbolId"
      :fill="color"
      :stroke="stroke === '' ? undefined : stroke"
    />
  </svg>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'AppSvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#333',
    },
    stroke: {
      type: String,
      default: '',
    }
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`);
    return { symbolId };
  },
});
</script>
