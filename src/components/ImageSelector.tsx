'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Upload, 
  Search, 
  X, 
  Image as ImageIcon,
  Check,
  Loader2
} from 'lucide-react'
import Image from 'next/image'

interface ImageSelectorProps {
  value: string
  onChange: (imagePath: string) => void
  className?: string
}

interface ImageFile {
  name: string
  path: string
  category?: string
}

export default function ImageSelector({ value, onChange, className = '' }: ImageSelectorProps) {
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery')
  const [images, setImages] = useState<ImageFile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Загружаем список существующих изображений
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Получаем список изображений из API
        const response = await fetch('/api/images')
        if (response.ok) {
          const imageList = await response.json()
          setImages(imageList)
        }
      } catch (error) {
        console.error('Error loading images:', error)
      }
    }

    loadImages()
  }, [])

  // Фильтруем изображения по поисковому запросу
  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Обработка загрузки файлов
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return

    setUploading(true)
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Проверяем тип файла
        if (!file.type.startsWith('image/')) {
          alert(`Файл ${file.name} не является изображением`)
          continue
        }

        // Проверяем размер файла (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`Файл ${file.name} слишком большой (максимум 5MB)`)
          continue
        }

        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const result = await response.json()
          
          // Добавляем новое изображение в список
          setImages(prev => [...prev, {
            name: file.name,
            path: result.path
          }])
          
          // Если это первое загруженное изображение, выбираем его
          if (i === 0 && !value) {
            onChange(result.path)
          }
        } else {
          const error = await response.json()
          alert(`Ошибка загрузки ${file.name}: ${error.message}`)
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Ошибка загрузки изображений')
    } finally {
      setUploading(false)
    }
  }

  // Обработка drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  // Обработка клика по файлу
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFileUpload(files)
    }
  }

  // Выбор изображения из галереи
  const selectImage = (imagePath: string) => {
    onChange(imagePath)
  }

  // Удаление выбранного изображения
  const clearImage = () => {
    onChange('')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Предпросмотр выбранного изображения */}
      {value && (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Предпросмотр"
              fill
              className="object-cover"
              onError={(e) => {
                // Если изображение не загружается, показываем placeholder
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Вкладки */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'gallery'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('gallery')}
        >
          Галерея
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'upload'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('upload')}
        >
          Загрузить
        </button>
      </div>

      {/* Содержимое вкладок */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск изображений..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Галерея изображений */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
            {filteredImages.map((image) => (
              <button
                key={image.path}
                type="button"
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  value === image.path
                    ? 'border-orange-500 ring-2 ring-orange-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => selectImage(image.path)}
              >
                <Image
                  src={image.path}
                  alt={image.name}
                  fill
                  className="object-cover"
                />
                {value === image.path && (
                  <div className="absolute inset-0 bg-orange-500 bg-opacity-20 flex items-center justify-center">
                    <Check className="h-6 w-6 text-orange-600" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Изображения не найдены</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="space-y-4">
          {/* Drag & Drop область */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Перетащите изображения сюда
            </p>
            <p className="text-sm text-gray-500 mb-4">
              или нажмите кнопку для выбора файлов
            </p>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? 'Загрузка...' : 'Выбрать файлы'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="text-xs text-gray-500 text-center">
            Поддерживаемые форматы: JPG, PNG, GIF, WebP. Максимальный размер: 5MB
          </div>
        </div>
      )}
    </div>
  )
}
