<template>
  <div class="flex flex-col gap-4 mt-4">
    <AppLabel :label="$t('DbFolder')">
      <AppInput :dark="true" class="w-1/3" v-model:modelInput="folder" />
    </AppLabel>
    <AppLabel :label="$t('SingleFileTime')">
      <AppInput :dark="true" type="select" class="w-1/3" :options="singleFileOption" v-model:modelInput="singleFileParse" />
    </AppLabel>
    <AppLabel :label="$t('RetentionDay')">
      <AppInput :dark="true" type="select" class="w-1/3" :options="faceRetentionOption"
        v-model:modelInput="faceRetentionParse" />
    </AppLabel>
    <AppLabel :label="$t('MergeScore')">
      <AppInput :dark="true" class="w-1/3" v-model:modelInput="mergeScoreParse" />
    </AppLabel>
  </div>
  <div class="w-1/3 mt-4">
    <AppButton type="primary" class="mx-20 px-6 py-2" @click="onApply">
      Apply</AppButton>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import useStore from '@/modules/config/stores/index';
import successStore from '@/components/AppSuccess/success';

const store = useStore();
const { getTrackConfig, postTrackConfig, getServerConfig, postServerConfig } = store;

const folder = ref('');

const singleFileOption = ref({
  '30': '30',
  '20': '20',
  '15': '15',
  '10': '10',
  '5': '5'
})
const singleFile = ref(0);
const singleFileParse = computed({
  get: () => (singleFile.value / (1000 * 60)).toString(),
  set: (val) => {
    singleFile.value = +val * (1000 * 60)
  }
})

const faceRetentionOption = ref({
  '90': '90',
  '60': '60',
  '30': '30',
  '15': '15',
  '7': '7',
  '1': '1'
})
const faceRetention = ref(0);
const faceRetentionParse = computed({
  get: () => (faceRetention.value / (1000 * 60 * 60 * 24)).toString(),
  set: (val) => {
    faceRetention.value = +val * (1000 * 60 * 60 * 24)
  }
})

const mergeScore = ref(0);
const mergeScoreParse = computed({
  get: () => (mergeScore.value).toString(),
  set: (val) => {
    mergeScore.value = +val;
  }
})

async function onApply() {
  const trackResult = await postTrackConfig({
    folder: folder.value,
    singleFile: singleFile.value,
    faceRetention: faceRetention.value
  })
  const serverResult = await postServerConfig({
    facemergescore: mergeScore.value
  })
  if (trackResult && serverResult) successStore.show();
}

onMounted(async () => {
  ({ db_root_folder: folder.value, single_file_time: singleFile.value, maintain_duration: faceRetention.value } = await getTrackConfig());
  ({ facemergescore: mergeScore.value } = await getServerConfig());
})

</script>