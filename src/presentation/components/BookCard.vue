<template>
  <Card
    v-tooltip.left="book.title"
    class="cursor-pointer relative"
    @click="openBook(book)"
    :dt="{
      'body.padding': 0,
    }"
  >
    <template #content>
      <img
        v-if="book.thumbnail"
        :src="book.thumbnail"
        :alt="book.title"
        class="w-full h-56 object-contain rounded-lg"
      />
      <div
        v-else
        class="w-full h-56 rounded-lg flex items-center justify-center"
      >
        <i class="pi pi-book text-4xl text-gray-400"></i>
      </div>
      <div class="absolute right-0 top-0 p-2">
        <Button
          icon="pi pi-ellipsis-v"
          aria-label="Options"
          variant="text"
          severity="contrast"
          size="small"
          rounded
          @click.stop="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        />
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      </div>
      <div
        class="absolute bottom-0 left-0 right-0 text-center dark:bg-slate-700 bg-slate-50 dark:text-white text-black"
      >
        {{ bookPercentageRead }}%
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useConfirm, useToast } from "primevue";
import { computed, ref } from "vue";
import { useBookStore } from "../stores/bookStore";
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
});

const confirm = useConfirm();
const toast = useToast();
const store = useBookStore();
const { openBook, removeBook } = store;

const bookPercentageRead = computed(() => {
  return Math.round((props.book.currentPage / props.book.totalPages) * 100);
});

const menu = ref();

const items = ref([
  {
    label: "Remove",
    icon: "pi pi-trash",
    command: () => {
      remove();
    },
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

function remove() {
  confirm.require({
    message: `Do you want to delete ${book.title}?`,
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: async () => {
      await removeBook(props.book.id);
      toast.add({
        severity: "info",
        summary: "Confirmed",
        detail: "Record deleted",
        life: 3000,
      });
    },
  });
}
</script>
