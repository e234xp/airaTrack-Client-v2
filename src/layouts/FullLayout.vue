<template>
  <div class="w-full flex flex-col">
    <slot name="header" />
    <div
      class="flex-grow overflow-y-auto flex flex-col"
    >
      <slot name="grow" />
    </div>
  </div>
</template>
