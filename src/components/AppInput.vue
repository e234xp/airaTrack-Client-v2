<template>
  <div>
    <div class="flex justify-between">
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
          class="shadow appearance-none border border-gray-500
          rounded w-full h-12 px-3 pr-8 text-gray-700"
          :class="{ 'border-red-500': isShowError }"
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
            class="text-gray-700 w-4 h-4"
          />
        </div>
      </div>
      <div
        v-else-if="type === 'checkbox'"
        class="text-white text-3xl"
      >
        <input
          type="checkbox"
          class="w-4 h-4 mr-2 focus:ring-2 focus:ring-primary-500"
        >
        {{ placeholder }}
      </div>
      <input
        v-else
        class="shadow appearance-none border rounded w-full h-12 px-3 text-gray-700 leading-tight focus:border-primary focus:shadow-outline"
        :class="{
          'border-red-500': isShowError
        }"
        :type="type"
        :placeholder="placeholder"
        v-model="input"
        @blur="handleBlur"
        @keydown.enter="$emit('submit')"
      >
    </div>
    <div
      v-if="isShowError"
      class="mt-1 text-red-500 text-s"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import {
  computed, defineProps, defineEmits, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelInput: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  rule: {
    type: String,
    default: 'required',
  },
  hasSubmitted: {
    type: Boolean,
    default: false,
  },
  svgIcon: {
    type: String,
    default: '',
  },
  options: {
    type: Object,
    default() {
      return {};
    },
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

const i18n = useI18n();
const validators = {
  required: {
    isPassed: () => !input.value,
    generateMessage: () => {
      const placeholder = props.placeholder ? props.placeholder : i18n.t('field');
      return i18n.t('requiredMessage', { placeholder });
    },
  },
};

const { isPassed, generateMessage } = validators[props.rule];
const isShowError = computed(() => {
  if (!props.rule) return false;

  return isPassed() && (hasTouched.value || props.hasSubmitted);
});
const errorMessage = computed(() => generateMessage());

</script>
