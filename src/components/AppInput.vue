<template>
  <div class="flex justify-between mb-1">
    <div
      v-if="svgIcon"
      class="border border-gray-500 bg-gray-700 rounded grid content-center"
    >
      <AppSvgIcon
        :name="svgIcon"
        class="text-gray-500 w-12 h-8"
      />
    </div>

    <div
      v-if="type === 'select'"
      class="relative w-full"
    >
      <select
        v-model="input"
        class="shadow appearance-none border border-gray-500 rounded w-full py-3 px-3 pr-8
          bg-secondary text-white"
        :class="{ 'border-note-500': isShowError }"
      >
        <option
          v-if="placeholder"
          value=""
        >
          {{ placeholder }}
        </option>
        <option
          v-for="(value, key) in options"
          :key="key"
          :value="value"
        >
          {{ key }}
        </option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0
            flex items-center px-2 text-gray-700"
      >
        <AppSvgIcon
          name="icon-chevron-botton"
          class="text-white w-4 h-4"
        />
      </div>
    </div>

    <input
      v-else
      class="shadow appearance-none border border-gray-500 rounded w-full py-3 px-3
          bg-secondary text-white"
      :class="{ 'border-note-500': isShowError }"
      :type="type"
      :placeholder="placeholder"
      v-model="input"
      @blur="handleBlur"
      @keydown.enter="$emit('submit')"
    >
  </div>

  <div
    v-if="isShowError"
    class="text-note-500 text-s"
  >
    {{ errorMessage }}
  </div>
</template>

<script setup>
import {
  computed, defineProps, defineEmits, ref,
} from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  svgIcon: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  validator: {
    type: Object,
    default() {
      return {
        rule: '',
        field: '',
      };
    },
  },
  hasSubmitted: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    default() {
      return {};
    },
  },
  modelInput: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelInput', 'submit']);
const input = computed({
  get: () => props.modelInput,
  set: (value) => emit('update:modelInput', value),
});

const hasTouched = ref(false);
const handleBlur = () => {
  hasTouched.value = true;
};

const validators = {
  required: {
    isPassed: () => !input.value,
    generateMessage: (field) => `The ${field} is required`,
  },
};

const { isPassed, generateMessage } = validators[props.validator.rule];
const isShowError = computed(() => {
  if (!props.validator.rule) return false;

  return isPassed() && (hasTouched.value || props.hasSubmitted);
});
const errorMessage = generateMessage(props.validator.field);

</script>
