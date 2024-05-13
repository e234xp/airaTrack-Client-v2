<template>
  <label class="switch">
    <input type="checkbox" v-model="input" :disabled="disabled">
    <span class="slider"></span>
  </label>
</template>

<script setup>
import {
  computed
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
  width: 3rem;
  height: 1.5rem;
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
  height: 1.25rem;
  width: 1.25rem;
  left: 0.125rem;
  top: 0.125rem;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: theme('colors.album-none');
}

input:checked+.slider:before {
  -webkit-transform: translateX(1.625rem);
  -ms-transform: translateX(1.625rem);
  transform: translateX(1.625rem);
}
</style>