# Spotify Playlist Roaster

An interactive web application that lets users roast their Spotify playlists using Google's Gemini AI. Connect your Spotify account, select a playlist, and let AI humorously critique your music taste!

![Spotify Roaster Screenshot](https://via.placeholder.com/800x400/121212/1db954?text=Spotify+Roaster)

## Features

- **Spotify Integration**: Secure OAuth authentication with Spotify
- **Playlist Selection**: Browse and select from your Spotify playlists
- **AI Roast**: Send playlist data to Google Gemini AI for witty commentary
- **Track Display**: View detailed track information from your playlists
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Spotify-inspired dark UI with custom scrollbars

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **APIs**:
  - Spotify Web API (User playlists, track data)
  - Google Gemini AI API (Roasting functionality)
- **Deployment**: Ready for static hosting (Vercel, Netlify, etc.)

## Prerequisites

- Node.js 18+
- A Spotify Developer account
- A Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spotify-roaster.git
cd spotify-roaster
```

2. Install dependencies:
```bash
npm install
```

## Setup

### Spotify Configuration

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use an existing one
3. Add `http://localhost:5173` to your app's Redirect URIs
4. Copy your Client ID and Client Secret

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_CLIENT_ID=your_spotify_client_id
VITE_CLIENT_SECRET=your_spotify_client_secret
VITE_GEMINI_KEY=your_google_gemini_api_key
```

> **⚠️ Important**: Never commit your `.env` file to version control. It's already in `.gitignore`.

### Google Gemini Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Generate an API key
3. Add it to your `.env` as `VITE_GEMINI_KEY`

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:5173](http://localhost:5173) in your browser

3. Click "Connect to Spotify" to authenticate

4. Select a playlist from your collection

5. Hit the "Roast" button and enjoy the AI critique!

## Available Scripts

- `npm run dev` - Start development server (hot reload enabled)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run host` - Start dev server accessible on network
- `npm run dev-test` - Start dev server on all interfaces (0.0.0.0)

## Project Structure

```
spotify-roaster/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   ├── services/           # API service modules
│   │   ├── authService.js      # Spotify OAuth handling
│   │   ├── spotifyApiCalls.js  # Spotify API interactions
│   │   └── geminiService.js    # Gemini AI integration
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React entry point
│   ├── index.css           # Global styles & Tailwind imports
│   └── App.css             # Component-specific styles
├── .env                    # Environment variables (create locally)
├── package.json            # Dependencies and scripts
└── vite.config.js         # Vite configuration
```

## API Integrations

### Spotify Web API

- **Authentication**: PKCE OAuth flow for security
- **Scopes**: `user-read-private`, `playlist-read-private`, `playlist-read-collaborative`
- **Endpoints**: User playlists, playlist tracks

### Google Gemini AI

- **Model**: Uses Gemini 1.5 Pro for natural language roasting
- **Prompt Engineering**: Crafted prompts for humorous, engaging output
- **Rate Limiting**: Respects API quotas and best practices

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add new roaster modes'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

### Ideas for Improvement

- Add multiple AI models (GPT, Claude)
- Include playlist statistics and insights
- Social sharing features
- Playlist cover image analysis
- Mood-based playlist suggestions

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Spotify** for their amazing Web API
- **Google** for the powerful Gemini AI
- **Tailwind CSS** for the beautiful styling framework
- **Vite** for blazing fast development setup

---

Made with ❤️ and questionable music taste!
