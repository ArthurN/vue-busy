<template>
  <div class="spinner" :style="{ 'border-color': color }" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Spinner",
  props: {
    color: {
      type: String,
      default: "blue",
    },
  },
});
</script>

<style>
.spinner {
  font-size: 50px;
  box-sizing: border-box;
  border-width: 2px;
  border-style: solid;
  width: 1em;
  height: 1em;
  border-radius: 0.5em;
  -webkit-animation: spin 1s linear infinite;
  -moz-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
  border-top-color: white !important;
}

@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}

@-moz-keyframes spin {
  to {
    -ms-transform: rotate(360deg);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
