<template>
  <div class="flex flex-col gap-4 mt-4">
    <AppLabel :label="'VMS'">
      <AppInput :dark="true" type="select" class="w-1/3" :options="vmOptions" v-model:modelInput="selectedVms" />
    </AppLabel>
    <AppLabel :label="$t('IpAddress')">
      <AppInput :dark="true" class="w-1/3" :rule="'ip'" @valid="onValid($event, 1)" v-model:modelInput="connect.ip" />
    </AppLabel>
    <AppLabel :label="$t('Port')">
      <AppInput :dark="true" class="w-1/3" :rule="'port'" v-model:modelInput="connect.port" />
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
import { useI18n } from 'vue-i18n';
import useStore from '@/modules/config/stores/index';
import successStore from '@/components/AppSuccess/success';

const store = useStore();
const { getNxConfig, postNxConfig, postNxServerInfo } = store;

const i18n = useI18n();

const vmOptions = ref({
  [`${i18n.t('Nx5Later')}`]: 'bearer',
  [`${i18n.t('Nx4Before')}`]: 'basic',
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

const valid = ref([true, true, true, true]);
const isValid = computed({
  get: () => valid.value.filter((item) => !item).length === 0
})

async function onClick() {
  const [{ id }] = await postNxServerInfo({
    host: connect.ip,
    port: connect.port,
    username: login.username,
    password: login.password,
  });
  if (id) {
    const result = await postNxConfig({
      host: connect.ip,
      port: connect.port,
      username: login.username,
      password: login.password,
      server_id: id,
      authorization: selectedVms.value
    });
    if (result) successStore.show();
  }
}

function onValid(val, idx) {
  valid.value[idx] = val;
}

onMounted(async () => {
  ({ host: connect.ip, password: login.password, port: connect.port, username: login.username, authorization: selectedVms.value } = await getNxConfig())
})

</script>