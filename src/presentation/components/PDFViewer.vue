<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :style="{ width: '100vw', height: '100vh' }"
    :closable="true"
    class="pdf-viewer-dialog"
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
        v-if="pdfUrl"
        :source="doc"
        :page="currentPage"
        @num-pages="onNumPages"
        @page-loaded="onPageLoaded"
        @loaded="onLoaded"
        @error="onError"
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

const emit = defineEmits(["update:modelValue", "progress-saved"]);

const visible = ref(props.modelValue);
const currentPage = ref(1);
const totalPages = ref(0);
const saving = ref(false);
const pdfUrl = ref("");

const { doc } = useVuePdfEmbed({ source: props.book.filePath });

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

// Load PDF on mount
onMounted(async () => {
  try {
    // Set PDF URL (replace with your method of obtaining PDF)
    pdfUrl.value = props.book.filePath;
  } catch (error) {
    console.error("Error loading PDF:", error);
  }
});

// PDF Event Handlers
const onNumPages = (numPages) => {
  totalPages.value = numPages;
};

const onPageLoaded = (page) => {
  currentPage.value = page;
};

// Page Navigation
const goToPage = (page) => {
  currentPage.value = page;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Save Progress (optional)
const saveProgress = async () => {
  try {
    saving.value = true;
    // Implement your progress saving logic here
    emit("progress-saved", currentPage.value);
  } catch (error) {
    console.error("Error saving progress:", error);
  } finally {
    saving.value = false;
  }
};

// Close Modal
const close = () => {
  visible.value = false;
  saveProgress();
};
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
