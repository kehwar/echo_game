<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
    <div class="flex justify-around items-center h-16 max-w-7xl mx-auto px-4">
      <NuxtLink 
        to="/" 
        class="flex flex-col items-center justify-center flex-1 py-2 transition-colors"
        :class="isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
      >
        <Grid3x3 :size="24" />
        <span class="text-xs mt-1">{{ t('bottomNav.decks') }}</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/history" 
        class="flex flex-col items-center justify-center flex-1 py-2 transition-colors"
        :class="isActive('/history') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
      >
        <History :size="24" />
        <span class="text-xs mt-1">{{ t('bottomNav.history') }}</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/decks/manage" 
        class="flex flex-col items-center justify-center flex-1 py-2 transition-colors"
        :class="isActive('/decks/manage') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
      >
        <FolderEdit :size="24" />
        <span class="text-xs mt-1">{{ t('bottomNav.userDecks') }}</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/settings" 
        class="flex flex-col items-center justify-center flex-1 py-2 transition-colors"
        :class="isActive('/settings') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
      >
        <Settings :size="24" />
        <span class="text-xs mt-1">{{ t('bottomNav.settings') }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Grid3x3, History, FolderEdit, Settings } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>
