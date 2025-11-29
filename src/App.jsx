"use client"

import { useState, useEffect } from "react"
import { startSpotifyLogin, getAccessToken } from "./services/authService"
import { getUserPlaylists, getPlaylistTracks } from "./services/spotifyApiCalls"
import { geminiRoast } from "./services/geminiService"

function App() {
  const [playlistId, setPlaylistId] = useState("")
  const [playlistItems, setPlaylistItems] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [tracks, setTracks] = useState([])
  const [roast, setRoast] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [roastHeight, setRoastHeight] = useState(200)
  const [isResizing, setIsResizing] = useState(false)

  const handleLogin = () => {
    startSpotifyLogin()
  }

  const selectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist)
    setPlaylistId(playlist.playlistId)
  }

  const sendToGemini = async () => {
    setIsLoading(true)
    setRoast("")
    getPlaylistTracks(playlistId).then(async (items) => {
      console.log(items)
      setTracks(items)

      const getRoast = await geminiRoast(items)
      setRoast(getRoast)
      setIsLoading(false)
      console.log("client side roast", getRoast)
    })
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("code")) {
      getAccessToken().then((tokens) => {
        if (tokens) {
          console.log(tokens)
          localStorage.setItem("access-token", tokens.accessToken)
          localStorage.setItem("refresh-token", tokens.refreshToken)
        }
      })
      console.log("Getting access to tokens and getting user's playlists")
      getUserPlaylists().then((items) => {
        setPlaylistItems(items)
        console.log(items)
      })
    } else {
      console.log("no access to token")
    }
  }, [])

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return
      const container = document.getElementById("right-panel")
      if (container) {
        const rect = container.getBoundingClientRect()
        const newHeight = e.clientY - rect.top
        setRoastHeight(Math.max(100, Math.min(newHeight, rect.height - 150)))
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="h-screen bg-[#121212] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="text-center py-4 md:py-6 px-4 md:px-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
          Spotify Playlist <span className="text-[#1db954]">Roaster</span>
        </h1>
        <p className="text-[#b3b3b3] text-xs md:text-sm">Let AI judge your questionable music taste</p>
      </header>

      {/* Connect Button - show when no playlists loaded */}
      {playlistItems.length === 0 && (
        <div className="flex-1 flex items-center justify-center px-4">
          <button
            className="flex items-center justify-center gap-3 bg-[#1db954] text-black px-6 md:px-8 py-3 md:py-3.5 rounded-full font-bold hover:bg-[#1ed760] hover:scale-[1.04] transition-all text-sm md:text-base"
            onClick={handleLogin}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Connect to Spotify
          </button>
        </div>
      )}

      {playlistItems.length > 0 && (
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 px-4 md:px-6 pb-4 md:pb-6 min-h-0 overflow-auto md:overflow-hidden">
          {/* Left Panel - Playlist Selection */}
          <div className="w-full md:w-1/2 flex flex-col min-h-[300px] md:min-h-0">
            <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 shrink-0">Select a playlist to roast</h2>
            <div className="flex-1 overflow-y-auto pr-1 md:pr-2">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {playlistItems.map((item) => (
                  <div
                    key={item.playlistId}
                    className={`bg-[#181818] rounded-lg p-2 md:p-3 cursor-pointer transition-all hover:bg-[#282828] border-2 ${
                      selectedPlaylist?.playlistId === item.playlistId
                        ? "border-[#1db954] bg-[#1a1a1a]"
                        : "border-transparent"
                    }`}
                    onClick={() => selectPlaylist(item)}
                  >
                    {item.playlistImage ? (
                      <img
                        src={item.playlistImage || "/placeholder.svg"}
                        alt={item.playlistName}
                        className="w-full aspect-square object-cover rounded mb-2 bg-[#282828]"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-[#282828] rounded mb-2 flex items-center justify-center">
                        <svg className="w-8 md:w-10 h-8 md:h-10 text-[#535353]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                      </div>
                    )}
                    <h4 className="font-bold text-xs md:text-sm truncate">{item.playlistName}</h4>
                    <p className="text-[10px] md:text-xs text-[#b3b3b3]">{item.trackCount} tracks</p>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="mt-3 md:mt-4 w-full bg-[#1db954] text-black py-2.5 md:py-3 px-4 md:px-6 rounded-full font-bold text-sm md:text-base hover:bg-[#1ed760] hover:scale-[1.01] transition-all disabled:bg-[#535353] disabled:text-[#b3b3b3] disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0 flex items-center justify-center gap-2"
              onClick={sendToGemini}
              disabled={!selectedPlaylist || isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Roasting...
                </>
              ) : selectedPlaylist ? (
                <span className="truncate">Roast "{selectedPlaylist.playlistName}"</span>
              ) : (
                "Select a playlist first"
              )}
            </button>
          </div>

          {/* Right Panel - Roast & Tracks */}
          <div id="right-panel" className="w-full md:w-1/2 flex flex-col min-h-[300px] md:min-h-0 gap-2">
            {/* Roast Section - Resizable */}
            {(isLoading || roast) && (
              <div
                className="bg-[#181818] rounded-lg p-4 md:p-5 flex flex-col shrink-0"
                style={{ height: roastHeight }}
              >
                <h2 className="text-base md:text-lg font-bold mb-2 md:mb-3 flex items-center gap-2 shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[#1db954]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 23c-1.1 0-1.99-.89-1.99-1.99h3.98c0 1.1-.89 1.99-1.99 1.99zm7-6v-5c0-3.07-1.63-5.64-4.5-6.32V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C8.63 6.36 7 8.92 7 12v5l-2 2v1h14v-1l-2-2z" />
                  </svg>
                  The Roast
                </h2>
                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="space-y-2 md:space-y-3">
                      <div className="h-3 md:h-4 bg-[#282828] rounded animate-pulse w-full" />
                      <div className="h-3 md:h-4 bg-[#282828] rounded animate-pulse w-11/12" />
                      <div className="h-3 md:h-4 bg-[#282828] rounded animate-pulse w-4/5" />
                      <div className="h-3 md:h-4 bg-[#282828] rounded animate-pulse w-9/12" />
                    </div>
                  ) : (
                    <p className="text-[#b3b3b3] text-sm md:text-base leading-relaxed whitespace-pre-wrap">{roast}</p>
                  )}
                </div>
              </div>
            )}

            {(isLoading || roast) && (
              <div
                className="h-2 bg-[#282828] hover:bg-[#1db954] rounded cursor-ns-resize transition-colors shrink-0 flex items-center justify-center"
                onMouseDown={handleMouseDown}
              >
                <div className="w-10 h-1 bg-[#535353] rounded" />
              </div>
            )}

            {/* Tracks Section */}
            {tracks.length > 0 ? (
              <div className="flex-1 flex flex-col min-h-0">
                <h2 className="text-base md:text-lg font-bold mb-2 md:mb-3 shrink-0">
                  Tracks in <span className="text-[#1db954]">{selectedPlaylist.playlistName}</span>
                </h2>
                <div className="flex-1 bg-[#181818] rounded-lg p-3 md:p-4 overflow-y-auto">
                  <ul>
                    {tracks.map((track, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 md:gap-3 py-2 md:py-2.5 border-b border-[#282828] last:border-b-0"
                      >
                        <span className="w-4 md:w-5 text-center text-[#b3b3b3] text-xs md:text-sm">{index + 1}</span>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-xs md:text-sm truncate">{track.trackName}</h5>
                          <p className="text-[10px] md:text-xs text-[#b3b3b3] truncate">
                            {track.trackArtists} • {track.album}
                          </p>
                        </div>
                        <span className="text-[#b3b3b3] text-[10px] md:text-xs tabular-nums">
                          {formatDuration(track.duration)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-[#181818] rounded-lg flex items-center justify-center min-h-[200px]">
                <div className="text-center text-[#b3b3b3]">
                  <svg
                    className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-3 md:mb-4 text-[#535353]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                  <p className="text-sm md:text-base">Select a playlist and hit roast</p>
                  <p className="text-xs md:text-sm mt-1">Tracks will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
