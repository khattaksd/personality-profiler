import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import type { Plugin, ResolvedConfig, HmrContext } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface ObfuscationResult {
  message: string
  originalSize: number
  encodedSize: number
}

async function generateObfuscatedQuestions(rootDir: string): Promise<ObfuscationResult> {
  const questionsPath = path.join(rootDir, 'src/data/questions.json')
  const outputPath = path.join(rootDir, 'src/data/questions-obfuscated.ts')

  const questionsJson = fs.readFileSync(questionsPath, 'utf-8')
  const questions = JSON.parse(questionsJson)

  // Minify by re-stringifying with no whitespace
  const minified = JSON.stringify(questions)

  // Encode to base64
  const encoded = Buffer.from(minified).toString('base64')

  // Generate TypeScript file
  const tsContent = `// Auto-generated obfuscated questions data
// Do not edit manually

export const OBFUSCATED_QUESTIONS = '${encoded}'

export function decodeQuestions(): unknown[] {
  const decoded = atob(OBFUSCATED_QUESTIONS)
  return JSON.parse(decoded)
}
`

  fs.writeFileSync(outputPath, tsContent)

  return {
    message: `✓ Obfuscated questions written to ${outputPath}`,
    originalSize: questionsJson.length,
    encodedSize: encoded.length,
  }
}

export default function watchQuestionsPlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'watch-questions',

    async configResolved(resolvedConfig) {
      config = resolvedConfig

      try {
        if (config.command === 'serve') {
          console.log('🔍 Watching questions.json for changes...')
        }
        const result = await generateObfuscatedQuestions(config.root)
        console.log(result.message)
        console.log(`  Original size: ${result.originalSize} bytes`)
        console.log(`  Encoded size: ${result.encodedSize} bytes`)
      } catch (err) {
        console.error('✗ Initial obfuscation failed:', (err as Error).message)
      }
    },

    async handleHotUpdate({ file, server }: HmrContext) {
      const questionsPath = path.join(config.root, 'src/data/questions.json')

      if (path.resolve(file) === path.resolve(questionsPath)) {
        console.log('📝 questions.json changed, regenerating obfuscated version...')

        try {
          const result = await generateObfuscatedQuestions(config.root)
          console.log(result.message)
          console.log(`  Original size: ${result.originalSize} bytes`)
          console.log(`  Encoded size: ${result.encodedSize} bytes`)
          console.log('✓ Vite will hot reload')

          server.ws.send({ type: 'full-reload', path: '*' })
        } catch (err) {
          console.error('✗ Obfuscation failed:', (err as Error).message)
        }

        // Return empty to prevent default HMR
        return []
      }
    },
  }
}
