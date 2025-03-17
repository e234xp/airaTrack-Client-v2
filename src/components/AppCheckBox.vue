<template>
  <div class="flex justify-between w-full">
    <label class="flex items-center select-none ">
      <label id="🔗CheckBox">
        <input id="🔗CheckBox__Input" type="checkbox" v-model="input" :value="value" @change="$emit('onChange')" :disabled="disabled"
          :checked="checked">
      </label>
      <div class="pl-2">
        <slot />
      </div>
    </label>

    <div v-if="isShowError" class="mt-1 text-red-500 text-s">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import {
  computed, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelInput: {
    type: [Array, Boolean],
    default() {
      return [];
    },
  },
  value: {
    type: [Object, String, Number],
    default() {
      return null;
    },
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
  disabled: {
    type: Boolean,
    default: false,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelInput', 'submit', 'onChange']);
const input = computed({
  get: () => props.modelInput,
  set: (value) => emit('update:modelInput', value),
});


const hasTouched = ref(false);

const i18n = useI18n();
const validators = {
  required: {
    isPassed: () => !input.value,
    generateMessage: () => {
      const placeholder = props.placeholder ? props.placeholder : i18n.t('field');
      return i18n.t('RequiredMessage', { placeholder });
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

<style>
#🔗CheckBox {
  position: relative;
  left: 2px;
  width: 16px;
  height: 16px;
  box-shadow: 0 0 0 1px #959595, 0 0 0 2px #5f5f5f;
  background-color: #1f1f1f;
}

#🔗CheckBox__Input {
  position: absolute;
  visibility: hidden;
}

#🔗CheckBox:has(#🔗CheckBox__Input:checked) {
  & {
    box-shadow: 0 0 0 1px #e3e3e3, 0 0 0 2px #7f7f7f;
  }

  /* 打勾圖案 */
  &::after {
    content: '';
    display: block;
    background-image: url('@/assets/images/btn-check.png');
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    transform: translate(20%, 25%);
  }
}
</style>