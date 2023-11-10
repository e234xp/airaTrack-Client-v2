<template>
  <div class="h-full w-full flex flex-col">
    <slot name="header" />
    <div
      class="flex-grow overflow-y-auto flex flex-col mr-2"
    >
      <slot name="grow" />
    </div>
    <slot name="footer" />
  </div>
</template>
