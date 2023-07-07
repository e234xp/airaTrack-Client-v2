<template>
  <div class="h-full grid justify-center content-center">
    <div class="mb-2 flex justify-between">
      <div>
        <img
          :src="airaTrack"
          alt=""
          class="w-48"
        >
      </div>
      <div class="grid content-end text-white text-xl">
        Version:
      </div>
    </div>
    <form class="w-112 bg-secondary border-2 border-gray-500 shadow-md rounded mb-4 py-8 px-6">
      <div class="text-center mb-4 text-white font-bold text-3xl">
        {{ $t("LoginTitle") }}
      </div>
      <div class="text-center mb-4 text-white">
        {{ $t("LoginSubtitle") }}
      </div>

      <div class="mb-4">
        <div class="flex justify-between mb-1">
          <div class="border border-gray-500 bg-gray-700 rounded grid content-center">
            <SvgIcon
              name="icon-person"
              class="text-gray-500 w-12 h-8"
            />
          </div>
          <input
            class="shadow appearance-none border border-gray-500 rounded w-full py-3 px-3
          bg-secondary text-white"
            type="text"
            :placeholder="$t('LoginUsername')"
          >
        </div>
      </div>

      <div class="mb-4">
        <div class="flex justify-between mb-1">
          <div class="border border-gray-500 bg-gray-700 rounded grid content-center">
            <SvgIcon
              name="icon-lock"
              class="text-gray-500 w-12 h-8"
            />
          </div>
          <input
            class="shadow appearance-none border border-gray-500 rounded w-full py-3 px-3
          bg-secondary text-white
          border-note-500"
            type="text"
            :placeholder="$t('LoginPassword')"
          >
        </div>

        <div class="text-note-500 text-s">
          The Username field is required
        </div>
      </div>

      <div class="mb-4">
        <div class="flex justify-between mb-1">
          <div class="border border-gray-500 bg-gray-700 rounded grid content-center">
            <SvgIcon
              name="icon-language"
              class="text-gray-500 w-12 h-8"
            />
          </div>

          <div class="relative w-full">
            <select
              class="shadow appearance-none border border-gray-500 rounded w-full py-3 px-3 pr-8
          bg-secondary text-white
          "
            >
              <option>New Mexico</option>
              <option>Missouri</option>
              <option>Texas</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0
            flex items-center px-2 text-gray-700"
            >
              <SvgIcon
                name="icon-chevron-botton"
                class="text-white w-4 h-4"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4 flex justify-center">
        <button
          class="bg-primary hover:bg-primary-hover transition text-white font-bold py-2 px-20
           rounded"
          type="button"
        >
          {{ $t("Login") }}
        </button>
      </div>
      <div
        class="flex justify-center align-baseline font-bold text-sm hover:text-blue-800"
        href="#"
      >
        <div class="grid content-center mr-1">
          <SvgIcon
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
    </form>

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
import airaTrackLogo from '@/assets/base64-images/airaTrackLogo';

const airaTrack = `data:image/png;base64, ${airaTrackLogo}`;
</script>
