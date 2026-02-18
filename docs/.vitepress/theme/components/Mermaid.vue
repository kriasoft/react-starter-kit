<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useData } from "vitepress";

const props = defineProps<{ code: string }>();
const { isDark } = useData();
const container = ref<HTMLElement | null>(null);
const svg = ref("");

const theme = computed(() => (isDark.value ? "dark" : "default"));

const liveUrl = computed(() => {
  const state = JSON.stringify({
    code: props.code,
    mermaid: { theme: theme.value },
  });
  const bytes = new TextEncoder().encode(state);
  const binary = Array.from(bytes, (b) => String.fromCodePoint(b)).join("");
  return `https://mermaid.live/view#base64:${btoa(binary)}`;
});

async function render() {
  if (!container.value || !props.code) return;

  const { default: mermaid } = await import("mermaid");
  mermaid.initialize({
    startOnLoad: false,
    theme: theme.value,
    securityLevel: "loose",
  });

  const id = `mermaid-${Math.random().toString(36).slice(2)}`;
  const { svg: rendered } = await mermaid.render(id, props.code);
  svg.value = rendered;
}

onMounted(render);
watch([() => props.code, theme], render);
</script>

<template>
  <div class="mermaid-wrapper">
    <div ref="container" class="mermaid-container" v-html="svg" />
    <a
      :href="liveUrl"
      target="_blank"
      rel="noopener"
      class="fullscreen-link"
      title="Open in fullscreen"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
      </svg>
    </a>
  </div>
</template>

<style scoped>
.mermaid-wrapper {
  position: relative;
  margin: 1.5rem 0;
}

.mermaid-container {
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

.mermaid-container :deep(svg) {
  max-width: 100%;
  height: auto;
}

.fullscreen-link {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  opacity: 0;
  transition:
    opacity 0.2s,
    color 0.2s;
}

.mermaid-wrapper:hover .fullscreen-link {
  opacity: 1;
}

.fullscreen-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
