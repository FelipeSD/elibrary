<template>
  <Card
    v-tooltip.left="book.title"
    class="cursor-pointer relative"
    @click="openBook(book)"
    :pt="{
      body: 'p-0',
      content: 'relative',
    }"
  >
    <template #content v-if="loadingRemove">
      <BookCardSkeleton />
    </template>
    <template #content v-else>
      <img
        v-if="book.thumbnail"
        :src="book.thumbnail"
        :alt="book.title"
        class="w-full h-56 object-fill rounded-lg"
      />
      <div
        v-else
        class="w-full h-56 rounded-lg flex items-center justify-center"
      >
        <i class="pi pi-book text-4xl text-gray-400"></i>
      </div>
      <div class="absolute right-0 bottom-0 p-1">
        <Button
          icon="pi pi-ellipsis-v"
          aria-label="Options"
          variant="text"
          severity="secondary"
          size="small"
          rounded
          @click.stop="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        />
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      </div>
      <div class="badge" v-if="bookPercentageRead < 100">{{ bookPercentageRead }}%</div>
      <RibbonBadge v-else>Read</RibbonBadge>
    </template>
  </Card>
</template>

<script setup>
import { useConfirm, useToast } from "primevue";
import { computed, ref } from "vue";
import { useBookStore } from "../stores/bookStore";
import BookCardSkeleton from "./BookCardSkeleton.vue";
import RibbonBadge from "./RibbonBadge.vue";
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
});

const confirm = useConfirm();
const toast = useToast();
const store = useBookStore();
const { openBook, removeBook, loadingRemove } = store;

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
    message: `Do you want to delete ${props.book.title}?`,
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

<style>
.badge {
  position: absolute;
  top: 0;
  right: 10%;
  font-size: 0.6rem;
  padding: 0.3rem;
  min-width: 30px;
  text-align: center;
  background: var(--p-neutral-800);
}
.badge::after {
  content: "";
  display: block;
  position: absolute;
  top: 1.28rem;
  left: 0;
  right: 0;
  height: 10px;
  background: var(--p-neutral-800);
  clip-path: polygon(47% 50%, 0 0, 100% 0);
}
</style>
