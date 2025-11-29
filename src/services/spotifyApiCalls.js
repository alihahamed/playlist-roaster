export const getUserPlaylists = async () => {
  const accessToken = localStorage.getItem("access-token");

  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  const data = await response.json();
  console.log(data);

  return data.items.map((item) => ({
    playlistName: item.name,
    playlistId: item.id,
    playlistImage:
      item.images && item.images.length > 0 ? item.images[0].url : null,
    trackCount: item.tracks.total,
  }));
};

export const getPlaylistTracks = async (playlistId) => {
  const accessToken = localStorage.getItem("access-token");

  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  const data = await response.json()
  console.log(data)
  
  return data.items.map((item) => ({
    trackName:item.track.name,
    trackArtist:item.track.artists[0]?.name,
    album:item.track.album.name,
    duration: Math.floor(item.track.duration_ms / 1000)
  }))
};
