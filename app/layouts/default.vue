<template>
  <div class="min-h-screen flex flex-col">
    <div class="w-full main-banner px-8 mx-auto mt-[92px] mb-[53px]">
      <div class="mx-auto w-full max-w-[1756px]">
        <ClientOnly>
          <Swiper v-bind="swiperOptions" :modules="modules" class="rounded-lg">
            <SwiperSlide v-for="(src, i) in images" :key="i">
              <NuxtImg
                :src="src.replace('/_nuxt/public', '')"
                format="webp"
                class="w-full object-cover rounded-lg"
                alt="swiper-image"
                loading="lazy"
                decoding="async"
                width="1756"
                height="250"
                :modifiers="{ quality: 90 }"
              />
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </div>
    </div>

    <main class="flex-1 pt-4 px-4 pb-0">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ref, onMounted } from 'vue';

const modules = [Navigation, Pagination, Autoplay];

const images = ['/images/banner-image.webp', '/images/banner-image.webp', '/images/banner-image.webp'];// или проп/стейт
const swiperOptions = {
  slidesPerView: 1,
  loop: true,
  autoplay: { delay: 4000 },
  pagination: { clickable: true },
  navigation: true,
};

const hydrated = ref(false);
onMounted(() => {
  hydrated.value = true;
});
</script>

<style scoped>
:deep(.swiper-pagination) {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

:deep(.swiper-pagination-bullet) {
  background-color: #d6d6eb;
  opacity: 1;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #7e5bef;
}

@media (max-width: 1400px) {
  .main-banner {
    margin-top: 34px;
  }
}

@media (max-width: 750px) {
  .main-banner {
    display: none;
  }
}

@media (max-width: 500px) {
  main {
    padding: 0;
  }
}
</style>
