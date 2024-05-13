<template>
  <div class="w-full flex flex-col" style="height: calc(100% - 4rem)">
    <div class="mt-2">
      <AppInput :dark="true" class="w-1/3 float-left mr-4" :rule="''" v-model:modelInput="license" />
      <AppButton :type="'primary'" :isEnable="license !== ''" class="px-5 float-left mt-1 mr-4" @click="onActivate">
        {{ $t('Activate') }}
      </AppButton>
      <AppButton :type="'primary'" class="px-5 float-left mt-1" @click="setModal('restart')">
        {{ $t('Restart') }}
      </AppButton>
    </div>
    <AppDataTable :columns="column" :dataList="pageData" v-if="pageData.length !== 0">
      <template #trial="props">
        {{ props.data.trial > 0 ? props.data.trial : '' }}
      </template>
      <template #status="props">
        <span class="text-red-500 border-2 border-red-500 px-2 py-1 rounded" v-if="props.data.status === 'error'">
          {{ $t('Error') }}
        </span>
        <span class="text-orange-500 border-2 border-orange-500 px-2 py-1 rounded" v-else-if="props.data.status === 'expired'">
          {{ $t('Expired') }}
        </span>
        <span class="text-green-500 border-2 border-green-500 px-2 py-1 rounded" v-else>
          {{ $t('Activated') }}
        </span>
      </template>
      <template #archive="props">
        <div class="flex justify-center">
          <AppSvgIcon name="icon-check" class="text-white w-4 h-4" v-if="props.data.archive" />
        </div>
      </template>
    </AppDataTable>
  </div>

  <ModalRestart @confirm="onRestart"></ModalRestart>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import spiderman from '@/spiderman';
import useStore from '@/modules/config/stores/index';
import successStore from '@/components/AppSuccess/success';
import modalStore from '@/components/AppModal/modal';
import AppDataTable from '@/components/AppDataTable.vue';
import ModalRestart from './ModalRestart.vue';

const store = useStore();
const { getLicense, restartLicense, activateLicense, setModal } = store;

const i18n = useI18n();

const license = ref('');
const pageData = ref([]);

const column = ref([
  {
    width: '35%',
    key: 'license',
    text: i18n.t('LicenseKey')
  },
  {
    width: '15%',
    key: 'status',
    align: 'center',
    text: i18n.t('Status')
  },
  {
    width: '10%',
    key: 'trial',
    align: 'center',
    text: i18n.t('TrialDays')
  },
  {
    width: '15%',
    key: 'expire',
    text: i18n.t('ExpireDate')
  },
  {
    width: '15%',
    key: 'live',
    align: 'center',
    text: i18n.t('NumOfLive')
  },
  {
    width: '10%',
    key: 'archive',
    align: 'center',
    text: i18n.t('Archive')
  }
])

function parseData(item) {
  return {
    ...item,
    status: getStatus(item),
    trial: item.trial_days,
    expire: item.trial_end_time ? spiderman.dayjs(item.trial_end_time * 1000).format('YYYY/MM/DD HH:mm:ss') : '',
    live: item.channel_amount,
    archive: item.frs
  }
}

function getStatus(data) {
  if (data.license_is_expired) {
    return 'expired';
  } else {
    return data.license_is_legitimate ? 'activated' : 'error';
  }
}

async function onActivate() {
  const { message } = await activateLicense(license.value);
  if (message === 'ok') {
    license.value = '';
    successStore.show('ActiveHint');
    await updateLicense();
  }
}

async function onRestart() {
  const { message } = await restartLicense();
  if (message === 'ok') {
    successStore.show();
    setModal('restart');
  }
}

async function updateLicense() {
  const { license } = await getLicense();
  pageData.value = license.map((item) => parseData(item));
}

onMounted(async () => {
  await updateLicense();
})

</script>