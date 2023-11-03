<template>
  <div class="flex items-center bg-ctrl-secondary rounded-full text-white text-base border border-transparent">
    <div class="relative rounded-2xl px-6 h-full py-2 cursor-pointer text-base leading-4"
      :class="[item.value === value ? 'bg-ctrl-switch shadow-tog selected' : '']" @click="$emit('select', item.value)"
      v-for="(item, idx) in list" :key="idx">
      <template v-if="item.text">
        {{ item.text }}
      </template>
      <template v-if="item.icon">
        <AppSvgIcon
          :name="item.icon"
          class="w-4 h-4"
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
.select {
  box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.20) inset;
}

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