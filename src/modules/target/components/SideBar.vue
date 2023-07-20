<template>
  <div class="w-72 bg-gray-600 grid content-between">
    <div>
      <div
        class="mb-4 px-8 py-4 text-white text-left text-2xl font-bold"
      >
        {{ $t('Target') }}
      </div>

      <div class="aira-button aira-button--secondary mx-6 mb-8 py-3 font-bold">
        {{ $t('Upload') }}
      </div>

      <div class="mx-6 mb-8 break-words text-xl text-gray-300">
        {{ $t('SelectTargetPrompt') }}
      </div>
    </div>

    <div class="mb-4">
      <div
        class="aira-button aira-button--primary mx-6 mb-4 py-3 font-bold
      aira-button--disable"
      >
        {{ $t('Investigation') }}
      </div>
      <div
        class="aira-button aira-button--secondary mx-6 mb-4 py-3 font-bold
      aira-button--disable"
      >
        {{ $t('ClearSelection') }}
      </div>
      <div
        class="aira-button aira-button--secondary mx-6 mb-4 py-3 font-bold
      aira-button--disable"
      >
        {{ $t('SaveToAlbum') }}
      </div>
    </div>
  </div>
</template>
