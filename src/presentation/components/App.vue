<template>
  <!-- No changes to template section -->
</template>

<script setup>
import { onMounted } from "vue";
import { useBookStore } from "../stores/bookStore";

const store = useBookStore();

onMounted(async () => {
  await store.loadBooks();
});
</script>
