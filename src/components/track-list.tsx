"use client"

import { motion, AnimatePresence } from "framer-motion"

interface Track {
  trackName: string
  trackArtists: string
  album: string
  duration: string
}

interface TrackListProps {
  tracks: Track[]
  isVisible: boolean
}

export function TrackList({ tracks, isVisible }: TrackListProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 overflow-hidden"
        >
          <div className="border border-border bg-card/50 p-4">
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-xs text-muted-foreground">{index + 1}</span>
                    <div>
                      <p className="font-medium">{track.trackName}</p>
                      <p className="text-xs text-muted-foreground">{track.trackArtists}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{track.duration}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
