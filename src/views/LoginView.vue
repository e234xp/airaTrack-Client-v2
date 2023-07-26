<template>
  <div class="h-full grid justify-center content-center">
    <div class="mb-2 flex justify-between">
      <div>
        <img
          :src="spiderman.base64Image.getSrc(airaTrack)"
          alt=""
          class="w-48"
        >
      </div>
      <div class="grid content-end text-white text-xl">
        {{ $t('Version') }}: {{ spiderman.system.version }}
      </div>
    </div>
    <div class="w-112 bg-secondary border-2 border-gray-500 shadow-md rounded mb-4 py-8 px-6">
      <div class="text-center mb-4 text-white font-bold text-3xl">
        {{ $t("LoginTitle") }}
      </div>
      <div class="text-center mb-4 text-white">
        {{ $t("LoginSubtitle") }}
      </div>

      <div class="mb-4">
        <AppInput
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

      <div class="mb-4 flex justify-center">
        <button
          class="aira-button aira-button--primary font-bold py-2 px-20"
          type="button"
          @click="handleLogin"
        >
          {{ $t("Login") }}
        </button>
      </div>
      <div
        class="aira-button align-baseline font-bold text-sm hover:text-blue-800"
        href="#"
      >
        <div class="grid content-center mr-1">
          <AppSvgIcon
            name="icon-question"
            class="text-white w-4 h-4"
          />
        </div>
        <button
          class="underline text-white"
        >
          {{ $t("ForgotPassword") }}
        </button>
      </div>
    </div>

    <div class="mb-2 flex justify-center text-xl text-white">
      <div class="grid content-center mx-2">
        Powered by
      </div>
      <img
        src="@/assets/images/logo.png"
        alt=""
        class="w-16"
      >
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import airaTrack from '@/assets/base64-images/airaTrack';
import useSubmit from '@/composable/useSubmit';

import useUserStore from '@/stores/user';
import useLanguageStore from '@/stores/language';
import useDevices from '@/stores/devices';

const spiderman = inject('$spiderman');

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

const { hasSubmitted, generateSubmit } = useSubmit();

// todo
const form = ref({
  username: 'Admin',
  password: '123456',
});

const handleLogin = generateSubmit(async () => {
  setUser(await loginUser(form.value));
  startMaintainUser();

  await setupResourses();
  router.push({ path: '/target' });
});

async function setupResourses() {
  setDevices(await getDevices(sessionId.value));
  setLiveDevices(await getLiveDevices(sessionId.value));
}
</script>
