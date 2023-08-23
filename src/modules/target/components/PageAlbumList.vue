<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <NavigationBar />
      </template>

      <template #grow>
        <div class="mx-4 my-3">
          <div class="aira-row-auto-3">
            <div
              v-for="i in 100"
              :key="i"
              class="mb-4 flex flex-col justify-self-center"
            >
              <AppSvgIcon
                name="icon-folder"
                class="w-32 h-32"
              />
              <div class="text-center text-white text-xl">
                1213
              </div>
            </div>
          </div>
        </div>
      </template>
    </FullLayout>

    <SideBar />
  </ProgressBarLayout>
</template>

<script setup>
import NavigationBar from '@/modules/target/components/NavigationBar.vue';
import SideBar from '@/modules/target/components/SideBar.vue';
import AppSvgIcon from '../../../components/AppSvgIcon.vue';

</script>
