import { ref } from 'vue';

export default () => {
  const hasSubmitted = ref(false);

  function generateSubmit(fn) {
    return async () => {
      await fn();
      hasSubmitted.value = true;
    };
  }

  return {
    hasSubmitted,
    generateSubmit,
  };
};
