<template>
  <div
      class="w-full relative bg-white pt-[30px] pr-[30px] pb-[22px] pl-[30px] max-w-[280px] h-auto aspect-[294/426] mx-auto rounded-lg flex flex-col justify-start shadow-md animate-pulse
           [@media(max-width:800px)]:max-w-[200px]
           [@media(max-width:500px)]:max-w-[160px]
           [@media(max-width:400px)]:max-w-[140px]
           [@media(max-width:500px)]:aspect-[1/1.5]
           [@media(max-width:400px)]:aspect-[1/1.6]"
  >
    <div class="flex relative flex-col items-center justify-center">
      <div class="absolute flex items-center justify-center h-[31px] w-[31px] z-10 -top-3 right-1
                  [@media(max-width:500px)]:h-[24px] [@media(max-width:500px)]:w-[24px]
                  [@media(max-width:400px)]:h-[20px] [@media(max-width:400px)]:w-[20px]">
        <div class="bg-gray-200 rounded-full w-full h-full" />
      </div>

      <div class="block mb-6">
        <div class="rounded-lg bg-gray-200 w-[180px] h-[180px]
                    [@media(max-width:800px)]:w-[140px] [@media(max-width:800px)]:h-[140px]
                    [@media(max-width:500px)]:w-[120px] [@media(max-width:500px)]:h-[120px]
                    [@media(max-width:400px)]:w-[100px] [@media(max-width:400px)]:h-[100px]" />
      </div>

      <div class="product-name min-h-[44px] w-full">
        <div class="bg-gray-200 h-[22px] w-full rounded mb-1
                    [@media(max-width:500px)]:h-[16px]
                    [@media(max-width:400px)]:h-[14px]" />
      </div>
    </div>

    <div class="product-reviews mb-[27px] flex items-center gap-2 w-full">
      <div class="bg-gray-200 rounded-full w-[18px] h-[18px]
                  [@media(max-width:500px)]:w-[14px] [@media(max-width:500px)]:h-[14px]
                  [@media(max-width:400px)]:w-[12px] [@media(max-width:400px)]:h-[12px]" />
      <div class="bg-gray-200 h-4 w-1/2 rounded
                  [@media(max-width:500px)]:h-3 [@media(max-width:400px)]:h-2.5" />
    </div>

    <div class="flex relative items-center justify-between w-full">
      <div class="flex flex-col gap-1">
        <div class="bg-gray-200 h-4 w-16 rounded
                    [@media(max-width:500px)]:w-12 [@media(max-width:500px)]:h-3
                    [@media(max-width:400px)]:w-10 [@media(max-width:400px)]:h-2.5" />
        <div class="bg-gray-200 h-6 w-20 rounded
                    [@media(max-width:500px)]:w-14 [@media(max-width:500px)]:h-4
                    [@media(max-width:400px)]:w-12 [@media(max-width:400px)]:h-3.5" />
      </div>
      <div class="bg-gray-200 w-[47px] h-[47px] rounded-full
                  [@media(max-width:500px)]:w-[36px] [@media(max-width:500px)]:h-[36px]
                  [@media(max-width:400px)]:w-[30px] [@media(max-width:400px)]:h-[30px]" />
    </div>
  </div>
</template>
