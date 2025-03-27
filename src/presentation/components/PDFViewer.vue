<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '100vw', height: '100vh' }"
    :closable="true"
    class="pdf-viewer-dialog"
    maximizable
    modal
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="text-xl font-bold">{{ book.title }}</h2>
        <div class="flex items-center gap-2">
          <span class="text-sm">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
        </div>
      </div>
    </template>

    <div class="pdf-container">
      <VuePdfEmbed
        v-if="pdfSource"
        :source="pdfSource"
        :page="currentPage"
        class="w-full h-full"
      >
        <template #loading>
          <div class="flex items-center justify-center h-full">
            <ProgressSpinner />
          </div>
        </template>
      </VuePdfEmbed>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import VuePdfEmbed, { useVuePdfEmbed } from "vue-pdf-embed";

const props = defineProps({
  modelValue: Boolean,
  book: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const visible = ref(props.modelValue);
const currentPage = ref(props.book.currentPage);
const totalPages = ref(props.book.totalPages);
const pdfSource = ref(props.book.filePath);

// Synchronize v-model
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
</script>

<style scoped>
.pdf-viewer-dialog {
  max-width: 100vw !important;
  max-height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
}

.pdf-container {
  width: 100%;
  height: calc(100vh - 120px);
  overflow: hidden;
  background-color: #f5f5f5;
}
</style>
