<template>
  <Dialog
    :visible="showPDFViewer"
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
          @click="close"
          icon="pi pi-times"
          rounded
          severity="secondary"
          size="small"
        />
      </div>
      <div class="flex w-full h-full flex-col items-center justify-center">
        <div v-if="loadingProgress < 100">
          <Knob
            v-model="loadingProgress"
            :size="150"
            valueTemplate="{value}%"
            readonly
          />
        </div>

        <VuePdfEmbed
          :source="pdfSource"
          :page="currentPage"
          :width="500"
          @progress="onLoadingProgress"
          :scale="3"
        />

        <div class="absolute right-0 top-1/2 -translate-y-1/2">
          <PDFControlBox>
            <div class="flex flex-col items-center">
              <Input v-model.number="currentPage" class="max-w-10 mb-2" />
              <span class="mb-4">
                {{ totalPages }}
              </span>
              <Button
                icon="pi pi-chevron-up"
                size="small"
                rounded
                text
                :disabled="currentPage === 1"
                @click="currentPage--"
              />
              <Button
                icon="pi pi-chevron-down"
                size="small"
                rounded
                text
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              />
            </div>
          </PDFControlBox>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from "primevue/dialog";
import Knob from "primevue/knob";
import { ref, watch } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import { useDebounce } from "../composables/useDebounce";
import { useBookStore } from "../stores/bookStore";
import PDFControlBox from "./PDFControlBox.vue";

const emit = defineEmits(["onReadBookPage"]);

const store = useBookStore();
const { closePDFViewer, showPDFViewer, currentBook } = store;

const { debouncedCallback } = useDebounce();

const currentPage = ref(currentBook.currentPage);
const totalPages = ref(currentBook.totalPages);
const pdfSource = ref(currentBook.filePath);
const loadingProgress = ref(0);

watch(
  () => currentPage.value,
  (newPage) => {
    debouncedCallback(() => {
      emit("onReadBookPage", newPage);
    });
  }
);

const onLoadingProgress = (progress) => {
  loadingProgress.value = Number(
    ((progress.loaded / progress.total) * 100).toFixed(0)
  );
};

function close() {
  emit("onReadBookPage", currentPage.value);
  closePDFViewer();
}
</script>

<style>
.pdf-container {
  width: 100%;
  height: 100%;
}

canvas {
  width: 100% !important;
  max-height: calc(100vh - 5rem) !important;
}
</style>
