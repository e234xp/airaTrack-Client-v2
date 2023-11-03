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
      <div class="grid content-end text-white text-xl">
        {{ $t('Version') }}: {{ spiderman.system.version }}
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

      <div class="mb-4">
        <AppInput
          dark
          type="select"
          svg-icon="icon-language"
          :options="{
            English: 'en',
            繁體中文: 'zh',
          }"
          v-model:modelInput="language"
          rule="required"
          :has-submitted="hasSubmitted"
        />
      </div>

      <div class="mb-6">
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
      </div>

      <AppButton
        class="mx-10 mb-4 py-2 px-20"
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

const router = useRouter();

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);
const { loginUser, setUser, startMaintainUser } = userStore;

const languageStore = useLanguageStore();
const { language } = storeToRefs(languageStore);

const devicesStore = useDevices();
const {
  getDevices, setDevices, getLiveDevices, setLiveDevices,
} = devicesStore;

const albumsStore = useAlbums();
const { getAlbums, setAlbums } = albumsStore;

const { hasSubmitted, generateSubmit } = useSubmit();

// FIXME: 拿掉 帳號密碼
const form = ref({
  username: 'Admin',
  password: '123456',
  mode: 'general',
});

const handleLogin = generateSubmit(async () => {
  setUser(await loginUser(form.value));
  startMaintainUser();

  await setupResources();

  if (form.value.mode === 'general') router.push({ path: '/target' });
  if (form.value.mode === 'upload') router.push({ path: '/upload-mobile' });
});

async function setupResources() {
  setDevices(await getDevices(sessionId.value));
  setLiveDevices(await getLiveDevices(sessionId.value));
  setAlbums(await getAlbums(sessionId.value));
}
</script>
