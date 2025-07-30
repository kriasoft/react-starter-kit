<template>
  <div class="github-stats">
    <a
      href="https://github.com/kriasoft/react-starter-kit/stargazers"
      class="stat-item"
    >
      <svg
        class="stat-icon"
        aria-hidden="true"
        height="16"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
      >
        <path
          d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.192L.644 6.57a.75.75 0 0 1 .416-1.28l4.21-.611L7.14.67A.75.75 0 0 1 8 .25Z"
        ></path>
      </svg>
      <span class="stat-count">23k</span>
    </a>
    <a
      href="https://github.com/kriasoft/react-starter-kit/forks"
      class="stat-item"
    >
      <svg
        class="stat-icon"
        aria-hidden="true"
        height="16"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
      >
        <path
          d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.5 0a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm-3.25 8a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"
        ></path>
      </svg>
      <span class="stat-count">4.2k</span>
    </a>
  </div>
</template>

<style scoped>
.github-stats {
  display: flex;
  align-items: center;
  padding-left: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  padding-left: 8px;
  text-decoration: none;
  transition: color 0.2s;
}

.stat-item:hover {
  color: var(--vp-c-text-1);
}

.stat-icon {
  fill: currentColor;
  flex-shrink: 0;
}

.stat-count {
  font-weight: 500;
}
</style>
