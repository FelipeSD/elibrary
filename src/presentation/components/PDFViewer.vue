<template>
  <Dialog
    v-model:visible="visible"
    :closable="true"
    :showHeader="false"
    :pt="{
      root: 'p-dialog-maximized',
    }"
    class="pdf-viewer-dialog"
    maximizable
    modal
  >
    <div class="pdf-container">
      <div class="absolute p-2 right-0 z-10">
        <Button
          @click="$emit('update:modelValue', false)"
          icon="pi pi-times"
          text
          rounded
          severity="contrast"
          size="small"
        />
      </div>
      <div
        class="flex w-full h-full flex-col items-center justify-center relative"
      >
        <div v-if="loadingProgress < 100">
          <Knob
            v-model="loadingProgress"
            :size="150"
            valueTemplate="{value}%"
            readonly
          />
        </div>

        <VuePdfEmbed
          v-if="pdfSource"
          :source="pdfSource"
          :page="currentPage"
          :width="500"
          @progress="onLoadingProgress"
        />

        <div
          class="absolute bottom-0 flex w-full items-center justify-center mt-4 gap-4"
          v-if="loadingProgress === 100"
        >
          <Slider
            v-if="totalPages"
            v-model="currentPage"
            :min="1"
            :max="totalPages"
            :step="1"
            class="w-1/2 mt-4"
          />
          <div class="ml-2 mt-4 text-sm text-gray-500">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import VuePdfEmbed, { useVuePdfEmbed } from "vue-pdf-embed";
import Slider from "primevue/slider";
import Knob from "primevue/knob";
import { useDebounce } from "../composables/useDebounce";

const props = defineProps({
  modelValue: Boolean,
  book: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "onPageChange"]);

const visible = ref(props.modelValue);
const currentPage = ref(props.book.currentPage);
const totalPages = ref(props.book.totalPages);
const pdfSource = ref(props.book.filePath);
const loadingProgress = ref(10);

const { debouncedCallback } = useDebounce();

watch(
  () => props.modelValue,
  (newValue) => {
    visible.value = newValue;
  }
);

watch(
  () => visible.value,
  (newValue) => {
    emit("update:modelValue", newValue);
  }
);

watch(
  () => currentPage.value,
  (newPage) => {
    debouncedCallback(() => {
      emit("onPageChange", newPage);
    }, 750);
  }
);

const onLoadingProgress = (progress) => {
  loadingProgress.value = Number(
    ((progress.loaded / progress.total) * 100).toFixed(0)
  );
};
</script>

<style>
.pdf-container {
  width: 100%;
  height: 100%;
}

canvas {
  width: 100% !important;
  height: calc(100vh - 5rem) !important;
}
</style>
