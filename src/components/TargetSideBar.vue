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
        !{{ $t('SelectTargetPrompt') }}
        而這些並不是完全重要，更加重要的問題是，要想清楚，排版，到底是一種怎麼樣的存在。一般來講，我們都必須務必慎重的考慮考慮。需要考慮周詳排版的影響及因應對策。培根說過一句很有意思的話，金錢是個好僕人，但在某些場合也會變成惡主人。
      </div>
    </div>

    <div class="mb-4">
      <div
        class="aira-button aira-button--primary mx-6 mb-4 py-3 font-bold
      aira-button--disable"
      >
        {{ $t('Upload') }}
      </div>
      <div
        class="aira-button aira-button--secondary mx-6 mb-4 py-3 font-bold
      aira-button--disable"
      >
        {{ $t('Upload') }}
      </div>
      <div
        class="aira-button aira-button--secondary mx-6 mb-4 py-3 font-bold
      aira-button--disable"
      >
        {{ $t('Upload') }}
      </div>
    </div>
  </div>
</template>
