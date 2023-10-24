<template>
  <label class="switch">
    <input type="checkbox" v-model="input">
    <span class="slider"></span>
  </label>
</template>

<script setup>
import {
  computed, defineProps, defineEmits, ref,
} from 'vue';

const props = defineProps({
  value: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['change']);

const input = computed({
  get: () => props.value,
  set: (value) => emit('change', value),
});
</script>

<style>
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  top: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: theme('colors.primary');
}

input:checked+.slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
</style>