<template>
  <div 
    v-if="isVisible" 
    class="absolute inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-auto"
  >
    <Card class="max-w-md mx-4 w-full">
      <CardContent class="py-12 text-center space-y-6">
        <div class="text-6xl mb-4">⏸️</div>
        <h2 class="text-4xl font-bold">{{ t('game.pause.title') }}</h2>
        <p class="text-muted-foreground">{{ t('game.pause.subtitle') }}</p>
        
        <div class="space-y-3 pt-4">
          <Button size="lg" class="w-full" @click="$emit('resume')">
            {{ t('game.pause.resumeButton') }}
          </Button>
          <Button variant="outline" size="lg" class="w-full" @click="$emit('end')">
            {{ t('game.pause.endButton') }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  isVisible: boolean
}

defineProps<Props>()
defineEmits<{
  resume: []
  end: []
}>()

const { t } = useI18n()
</script>
