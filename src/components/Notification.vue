<template>
  <div 
    class="notification"
    :class="[type, { 'show': show, 'hide': !show }]"
    @animationend="handleAnimationEnd"
  >
    <div class="notification-content">
      <div class="icon-container">
        <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
        <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
      <div class="text-container">
        <h3 class="title">{{ title }}</h3>
        <p class="message">{{ message }}</p>
      </div>
      <button class="close-button" @click="closeNotification">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close'])
const show = ref(true)
let timeoutId = null

onMounted(() => {
  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      show.value = false
    }, props.duration)
  }
})

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})

function closeNotification() {
  show.value = false
}

function handleAnimationEnd(event) {
  if (event.animationName === 'slideOut') {
    emit('close')
  }
}
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 350px;
  z-index: 1000;
  transform: translateX(100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.notification.show {
  animation: slideIn 0.5s forwards;
}

.notification.hide {
  animation: slideOut 0.5s forwards;
}

.notification-content {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: rgba(0, 0, 139, 0.95);
  border-left: 4px solid;
}

.notification.success {
  border-left-color: #4CAF50;
}

.notification.error {
  border-left-color: #F44336;
}

.notification.info {
  border-left-color: #2196F3;
}

.icon-container {
  margin-right: 15px;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success .icon-container {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.error .icon-container {
  background-color: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.info .icon-container {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196F3;
}

.text-container {
  flex: 1;
}

.title {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: bold;
  color: #f39c12;
}

.message {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.close-button {
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.3s ease;
  margin-left: 10px;
}

.close-button:hover {
  color: #f39c12;
}

@keyframes slideIn {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@media (max-width: 480px) {
  .notification {
    width: calc(100% - 40px);
  }
}
</style> 