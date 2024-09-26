<template>
  <div class="h-full grid justify-center content-center">
    <div class="mb-2 flex justify-between items-center">
      <div>
        <img
          src="@/assets/images/logo-track.png"
          alt=""
          class="h-8"
        >
      </div>
      <div class="flex content-end text-white text-xl">
        <span v-if="path === '/m'">Mobile</span><span v-else>{{ $t('Version') }}</span>: {{ spiderman.system.version }}
      </div>
    </div>
    <div class="relative sm:w-full md:w-112 bg-panel shadow-cus rounded mb-4 py-8 px-6">
      <div class="text-center mb-4 text-white font-bold text-3xl">
        {{ $t("LoginTitle") }}
      </div>
      <div class="text-center mb-4 text-white">
        {{ $t("LoginSubtitle") }}
      </div>

      <div class="mb-4">
        <AppInput
          dark
          svg-icon="icon-person"
          :placeholder="$t('LoginUsername')"
          v-model:modelInput="form.username"
          rule="required"
          @submit="handleLogin"
          :has-submitted="hasSubmitted"
        />
      </div>

      <div class="mb-4">
        <AppInput
          dark
          type="password"
          svg-icon="icon-lock"
          :placeholder="$t('LoginPassword')"
          v-model:modelInput="form.password"
          rule="required"
          @submit="handleLogin"
          :has-submitted="hasSubmitted"
        />
      </div>

      <div class="mb-6">
        <AppInput
          dark
          type="select"
          svg-icon="icon-language"
          :options="{
            English: 'en',
            繁體中文: 'zh',
            日本語: 'ja',
            'Bahasa Indonesia': 'id',
            'Tiếng Việt': 'vi'
          }"
          v-model:modelInput="language"
          rule="required"
          :has-submitted="hasSubmitted"
        />
      </div>

      <!-- <div class="mb-6">
        <AppInput
          dark
          type="select"
          svg-icon="icon-gear"
          :options="{
            [$t('GeneralMode')]: 'general',
            [$t('UploadMode')]: 'upload',
          }"
          v-model:modelInput="form.mode"
          rule="required"
          :has-submitted="hasSubmitted"
        />
      </div> -->

      <div class="text-center text-orange-400" v-if="restTime > 0">
        {{ $t('BlockHint').replace('$N', restTime) }}
      </div>

      <AppButton
        class="mx-10 mb-4 py-2 px-20"
        :is-Enable="form.username !== '' && form.password !== '' && !isLoading"
        @click="handleLogin"
        v-else
      >
        <AppSvgIcon
          name="icon-loading"
          color="#FFFFFF"
          class="animate-spin w-4 h-4"
          v-if="isLoading"
        />
        <template v-else>{{ $t("Login") }}</template>
      </AppButton>

      <div class="flex justify-center">
        <div class="grid content-center mr-1">
          <AppSvgIcon
            name="icon-question"
            class="text-white w-4 h-4"
          />
        </div>
        <AppButton
          type="transparent"
          class="underline"
          :is-Enable="form.username !== ''"
          @click="() => openReset = true"
        >
          {{ $t("ForgotPassword") }}
        </AppButton>
      </div>
      <div class="absolute bottom-2 w-[calc(100%-3rem)] text-center text-orange-400" v-if="errCount > 7">
        {{ $t('ErrHint') }}
      </div>
    </div>

    <div class="mb-2 flex justify-center items-center text-xl text-white">
      <div class="grid content-center mx-2">
        Powered by
      </div>
      <img
        src="@/assets/images/logo.png"
        alt=""
        class="h-6"
      >
    </div>
  </div>
  <ModalResetPassword :name="form.username" @close="() => openReset = false" v-if="openReset"></ModalResetPassword>
</template>

<script setup>
import spiderman from '@/spiderman';

import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import useSubmit from '@/composable/useSubmit';

import useUserStore from '@/stores/user';
import useLanguageStore from '@/stores/language';
import useDevices from '@/stores/devices';
import useAlbums from '@/stores/albums';

import useConfigStore from '@/modules/config/stores';

import ModalResetPassword from './ModalResetPassword.vue';

const router = useRouter();

const userStore = useUserStore();
const { sessionId, path } = storeToRefs(userStore);
const { loginUser, setUser, startMaintainUser, setRole } = userStore;

const languageStore = useLanguageStore();
const { language } = storeToRefs(languageStore);

const devicesStore = useDevices();
const {
  getDevices, setDevices, getLiveDevices, setLiveDevices,
} = devicesStore;

const albumsStore = useAlbums();
const { getAlbums, setAlbums, getAlbumData } = albumsStore;
const { albums } = storeToRefs(albumsStore);

const { hasSubmitted, generateSubmit } = useSubmit();

const { getUserGroup, getLicense, getNxConfig } = useConfigStore();

// FIXME: 拿掉 帳號密碼
const form = ref({
  username: '',
  password: '',
  mode: '',
});

const openReset = ref(false);
const isLoading = ref(false);
const restTime = ref(0);

const errCount = ref(0);

const handleLogin = generateSubmit(async () => {
  isLoading.value = true;
  try {
    setUser(await loginUser(form.value));
    setRole(await getUserGroup());
    startMaintainUser();
    const { host, password, username, authorization } = await getNxConfig();

    const device = (username === '' || password === '') ? [] : await getDevices(sessionId.value)
    const live = (username === '' || password === '') ? [] : await getLiveDevices(sessionId.value)
    
    setDevices(device, { host, password, username, authorization });
    setLiveDevices(live);

    await setupResources();

    const { license } = await getLicense();
    // const { host, password, username } = await getNxConfig();
    if (license.length === 0 && host === '127.0.0.1' && password === '' && username === '' && false) {
      router.push({ path: '/initial' });
    } else {
      if (path.value === '/m' || path.value === '/upload-mobile') router.push({ path: '/upload-mobile' });
      else router.push({ path: '/target' });
    }
  } catch (error) {
    isLoading.value = false;
    errCount.value += 1;
    if (errCount.value >= 10) {
      errCount.value = 0;
      localStorage.setItem('failTime', getFailTime());
      restTime.value = 10;
    }
    // console.error(error);
  }
});

function getFailTime() {
  const test = Date.now().toString();
  const temp = test.split('');
  let result = '';
  temp.forEach((item) => {
    result += `${item}${Math.floor(Math.random(0, 1) * 9)}`;
  });
  return result;
}

function parseFailTime(val) {
  const temp = val.split('');
  const result = [];
  for (let i = 0; i < temp.length; i += 2) {
    result.push(temp[i]);
  }
  return +(result.join(''));
}

async function setupResources() {
  setAlbums(await getAlbums(sessionId.value));
  await Promise.allSettled(albums.value.map(async (item) => {
    await getAlbumData(item.albumId);
  }));
}

onBeforeMount(() => {
  const failTime = localStorage.getItem('failTime');
  if (failTime) {
    if (failTime.length === 26) {
      restTime.value = Math.round(10 - ((Date.now() - parseFailTime(failTime)) / 1000 / 60));
      if (restTime.value <= 0) {
        localStorage.removeItem('failTime');
        restTime.value = 0;
      }
    } else restTime.value = 10;
  }
});
</script>
