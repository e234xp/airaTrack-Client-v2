<template>
  <div class="flex flex-col gap-4 mt-4">
    <AppLabel :label="'VMS'">
      <AppInput :dark="true" type="select" class="w-1/3" :options="vmOptions" v-model:modelInput="selectedVms" />
    </AppLabel>
    <AppLabel :label="$t('IpAddress')">
      <AppInput :dark="true" class="w-1/3" :rule="'ip'" @valid="onValid($event, 1)" v-model:modelInput="connect.ip" />
    </AppLabel>
    <AppLabel :label="$t('Port')">
      <AppInput :dark="true" class="w-1/3" v-model:modelInput="connect.port" />
    </AppLabel>
    <AppLabel :label="$t('Username')">
      <AppInput :dark="true" class="w-1/3" v-model:modelInput="login.username" />
    </AppLabel>
    <AppLabel :label="$t('LoginPassword')">
      <AppInput :dark="true" type="password" class="w-1/3" v-model:modelInput="login.password" />
    </AppLabel>
  </div>
  <div class="w-1/3 mt-6">
    <AppButton type="primary" :isEnable="isValid" class="mx-20 px-6" @click="onClick">
      {{ $t('Apply') }}</AppButton>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import useStore from '@/modules/config/stores/index';
import successStore from '@/components/AppSuccess/success';

const store = useStore();
const { getNxConfig, postNxConfig } = store;

const vmOptions = ref({
  'Network Optix 5.0 or later': 'bearer',
  'Network Optix 4 or earlier': 'basic',
  // 'Lilin Navigator': 'lilin',
  // 'Milstone XProtect': 'milestone',
  // 'Genetec Omnicast': 'genetec'
})
const selectedVms = ref('');
const connect = reactive({
  ip: '',
  port: ''
});
const login = reactive({
  username: '',
  password: ''
});
const serverId = ref('');

const valid = ref([true, true, true, true]);
const isValid = computed({
  get: () => valid.value.filter((item) => !item).length === 0
})

async function onClick() {
  const result = await postNxConfig({
    host: connect.ip,
    port: connect.port,
    username: login.username,
    password: login.password,
    server_id: serverId.value,
    authorization: selectedVms.value
  });
  if (result) successStore.show();
}

function onValid(val, idx) {
  valid.value[idx] = val;
}

onMounted(async () => {
  ({ host: connect.ip, password: login.password, port: connect.port, username: login.username, server_id: serverId.value, authorization: selectedVms.value } = await getNxConfig())
})

</script>