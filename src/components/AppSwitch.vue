<template>
  <div class="flex items-center bg-ctrl-secondary rounded-full text-white text-base border border-white shadow-btn">
    <div class="relative h-full py-2 cursor-pointer text-base leading-4 text-center hover:bg-ctrl-secondary-hover"
      :class="[item.value === value ? '!bg-ctrl-primary' : '', idx === 0 ? 'rounded-s-full' : '', idx === list.length - 1 ? 'rounded-e-full' : '']"
      @click="$emit('select', item.value)"
      style="min-width: 5rem"
      v-for="(item, idx) in list" :key="idx">
      <template v-if="item.text">
        {{ item.text }}
      </template>
      <template v-if="item.icon">
        <AppSvgIcon
          :name="item.icon"
          class="w-4 h-4 mx-auto"
        />
      </template>
    </div>
  </div>
</template>

<script setup>

defineProps({
  value: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default: [],
  }
});

defineEmits(['select']);

</script>

<style>

.selected::before {
  content: '';
  display: block;
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: 1rem;
  border: 2px solid #576264;
}
</style>