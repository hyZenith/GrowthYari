'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase-client'
import { Image, Loader2, UploadCloud, X } from 'lucide-react'
import { compressAndResizeImage } from '@/lib/image-utils'

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    disabled?: boolean
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return

        setLoading(true)
        setError(null)
        const file = acceptedFiles[0]

        try {
            // Compress and resize image
            const compressedFile = await compressAndResizeImage(file)

            const fileExt = compressedFile.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('events')
                .upload(filePath, compressedFile, {
                    cacheControl: '31536000', // 1 Year immutable cache
                    upsert: false
                })

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('events').getPublicUrl(filePath)

            onChange(data.publicUrl)
        } catch (err: any) {
            console.error('Error uploading image:', err)
            setError('Failed to upload image. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [onChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        },
        maxFiles: 1,
        disabled: disabled || loading
    })

    // Function to remove the selected image
    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange('')
    }

    return (
        <div className="w-full space-y-4">
            <div
                {...getRootProps()}
                className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${isDragActive ? 'border-emerald-600 bg-emerald-50' : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50'
                    } ${disabled || loading ? 'cursor-not-allowed opacity-60' : ''}`}
            >
                <input {...getInputProps()} />

                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                        <p className="text-sm text-slate-500">Uploading...</p>
                    </div>
                ) : value ? (
                    <div className="relative w-full overflow-hidden rounded-md border border-slate-200">
                        <img
                            src={value}
                            alt="Uploaded event image"
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={removeImage}
                            type="button"
                            className="absolute right-2 top-2 rounded-full bg-slate-900/70 p-1.5 text-white transition hover:bg-red-600/90"
                            title="Remove image"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <div className="rounded-full bg-slate-100 p-3 group-hover:bg-emerald-100">
                            <UploadCloud className="h-6 w-6 text-slate-500 group-hover:text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">
                                <span className="text-emerald-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-slate-500">SVG, PNG, JPG or WEBP (max. 800x400px)</p>
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}
