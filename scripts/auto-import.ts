// Главный скрипт для автоматического парсинга и импорта данных
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function autoImport() {
  try {
    console.log('🚀 Запускаем автоматический парсинг и импорт данных...')
    console.log('=' * 60)
    
    // Шаг 1: Парсинг buy.am
    console.log('\n📱 Шаг 1: Парсинг данных с buy.am...')
    try {
      const { stdout, stderr } = await execAsync('npx tsx scripts/parse-buy-am.ts')
      if (stdout) console.log(stdout)
      if (stderr) console.error(stderr)
      console.log('✅ Парсинг buy.am завершен')
    } catch (error) {
      console.error('❌ Ошибка при парсинге buy.am:', error)
      throw error
    }
    
    // Шаг 2: Импорт в базу данных
    console.log('\n📥 Шаг 2: Импорт данных в базу...')
    try {
      const { stdout, stderr } = await execAsync('npx tsx scripts/import-from-file.ts')
      if (stdout) console.log(stdout)
      if (stderr) console.error(stderr)
      console.log('✅ Импорт в базу завершен')
    } catch (error) {
      console.error('❌ Ошибка при импорте в базу:', error)
      throw error
    }
    
    console.log('\n🎉 Автоматический импорт завершен успешно!')
    console.log('=' * 60)
    console.log('📊 Результат:')
    console.log('  ✅ Данные спарсены с buy.am')
    console.log('  ✅ Данные сохранены в файлы (JSON и CSV)')
    console.log('  ✅ База данных заполнена')
    console.log('  ✅ Изображения скачаны')
    console.log('\n🌐 Теперь можете открыть сайт и проверить результат!')
    
  } catch (error) {
    console.error('\n❌ Критическая ошибка:', error)
    process.exit(1)
  }
}

// Запускаем автоматический импорт
autoImport()
