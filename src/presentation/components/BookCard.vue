<template>
  <Card
    v-tooltip="book.title"
    class="cursor-pointer relative"
    @click="emit('openBook', book)"
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
          size="small"
          rounded
          @click.stop="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        />
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      </div>
      <div class="absolute bottom-0 left-0 right-0"></div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from "vue";
import { ref } from "vue";
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["openBook", "removeBook"]);

const bookPercentageRead = computed(() => {
  return Math.round((props.book.currentPage / props.book.totalPages) * 100);
});

const menu = ref();

const items = ref([
  {
    label: "Remove",
    icon: "pi pi-trash",
    action: () => {
      emit("removeBook", props.book.id);
    },
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>
