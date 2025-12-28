import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const sizes = [192, 512]
const svgPath = join(__dirname, '../public/icon.svg')
const publicDir = join(__dirname, '../public')

console.log('Generating PWA icons...')

const svgBuffer = readFileSync(svgPath)

for (const size of sizes) {
  const outputPath = join(publicDir, `icon-${size}x${size}.png`)
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(outputPath)
  console.log(`✓ Generated ${size}x${size} icon`)
}

// Generate apple-touch-icon
const appleTouchPath = join(publicDir, 'apple-touch-icon.png')
await sharp(svgBuffer)
  .resize(180, 180)
  .png()
  .toFile(appleTouchPath)
console.log('✓ Generated apple-touch-icon.png')

console.log('All PWA icons generated successfully!')
