'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { deleteBookmark } from '@/app/actions'
import { Trash2, ExternalLink, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Bookmark = {
    id: string
    title: string
    url: string
    created_at: string
}

export default function BookmarkList({ initialBookmarks, userId }: { initialBookmarks: Bookmark[], userId: string }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const supabase = createClient()

    useEffect(() => {
        // Update local state if initialBookmarks changes (e.g. after revalidatePath)
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    useEffect(() => {
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((current) => [payload.new as Bookmark, ...current])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((current) =>
                            current.filter((bookmark) => bookmark.id !== payload.old.id)
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, userId])

    const handleDelete = async (id: string) => {
        // Optimistic update
        setBookmarks((current) => current.filter((b) => b.id !== id))
        await deleteBookmark(id)
    }

    if (bookmarks.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800"
            >
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No bookmarks yet. Add one to get started!</p>
            </motion.div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
                {bookmarks.map((bookmark) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        key={bookmark.id}
                        className="group relative p-6 bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-gray-700 transition-all hover:shadow-xl hover:shadow-blue-900/5 dark:hover:shadow-blue-900/10"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="relative">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-200 truncate pr-6" title={bookmark.title}>
                                        {bookmark.title}
                                    </h3>
                                </div>

                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 mt-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors truncate"
                                >
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=32`}
                                        alt=""
                                        className="w-4 h-4 rounded-full opacity-70"
                                    />
                                    <span className="truncate">{new URL(bookmark.url).hostname}</span>
                                    <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                                </a>
                            </div>
                            <button
                                onClick={() => handleDelete(bookmark.id)}
                                className="absolute top-4 right-4 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                aria-label="Delete bookmark"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )

}
