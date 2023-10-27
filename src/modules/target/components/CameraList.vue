<template>
    <div class="bg-third w-60 p-4 flex flex-col gap-2 rounded-lg" style="max-height: 50vh; ">
        <div v-for="item in list">
          <AppCheckBox :placeholder="item.name" :modelInput="isChecked(item.id)" :disabled="isChecked(item.id) && selected.length === 1" @onChange="onCheck(item.id)">
            {{  item.name }}
          </AppCheckBox>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
  list: {
    type: Array,
    default: [],
  },
  selected: {
    type: Array,
    default: [],
  },
});

const emit = defineEmits([
  'update:selectCamera',
  'update:unSelectCamera'
]);

function isChecked(id) {
  return props.selected.indexOf(id) >= 0;
}

function onCheck(id) {
  const idx = props.selected.indexOf(id);
  if (idx < 0) {
    emit('update:selectCamera', id);
  } else {
    if (props.selected.length === 1) return;
    emit('update:unSelectCamera', id);
  }
}
</script>

<style>
</style>