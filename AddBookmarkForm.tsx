'use client'

import { addBookmark } from '@/app/actions'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

export default function AddBookmarkForm() {
    const formRef = useRef<HTMLFormElement>(null)

    return (
        <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            ref={formRef}
            action={async (formData) => {
                await addBookmark(formData)
                formRef.current?.reset()
            }}
            className="p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm dark:shadow-none"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                    <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Add New Bookmark</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <input
                    name="title"
                    type="text"
                    placeholder="Website Title"
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
                <input
                    name="url"
                    type="url"
                    placeholder="https://example.com"
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
                <button
                    type="submit"
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                >
                    Add Bookmark
                </button>
            </div>
        </motion.form>
    )
}
