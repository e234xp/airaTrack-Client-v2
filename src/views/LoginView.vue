<template>
  <div class="h-full grid justify-center content-center">
    <div class="mb-2 flex justify-between">
      <div>
        <img
          src="@/assets/images/logo-track.png"
          alt=""
          class="h-6"
        >
      </div>
      <div class="flex content-end text-white text-xl">
        <span v-if="path === '/m'">Mobile</span><span v-else>{{ $t('Version') }}</span>: {{ spiderman.system.version }}
      </div>
    </div>
    <div class="sm:w-full md:w-112 bg-panel shadow-cus rounded mb-4 py-8 px-6">
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

      <AppButton
        class="mx-10 mb-4 py-2 px-20"
        :is-Enable="form.username !== '' && form.password !== ''"
        @click="handleLogin"
      >
        {{ $t("Login") }}
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
    </div>

    <div class="mb-2 flex justify-center text-xl text-white">
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

import { ref } from 'vue';
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

const handleLogin = generateSubmit(async () => {
  setUser(await loginUser(form.value));
  setRole(await getUserGroup());
  startMaintainUser();
  const { host, password, username, authorization } = await getNxConfig();

  await setupResources({ host, password, username, authorization });

  const { license } = await getLicense();
  // const { host, password, username } = await getNxConfig();
  if (license.length === 0 && host === '127.0.0.1' && password === '' && username === '' && false) {
    router.push({ path: '/initial' });
  } else {
    if (path.value === '/m' || path.value === '/upload-mobile') router.push({ path: '/upload-mobile' });
    else router.push({ path: '/target' });
  }
});

async function setupResources(vms) {
  setDevices(await getDevices(sessionId.value), vms);
  setLiveDevices(await getLiveDevices(sessionId.value));
  setAlbums(await getAlbums(sessionId.value));
  await Promise.allSettled(albums.value.map(async (item) => {
    await getAlbumData(item.albumId);
  }));
}
</script>
