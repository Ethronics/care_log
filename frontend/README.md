# Log My Care - Frontend

React + Vite frontend application for Log My Care - Smart Edition.

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vanilla CSS** - Styling

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # API services
├── utils/          # Utility functions
├── styles/         # Additional CSS files
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

## Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## API Integration

The API service is configured in `src/services/api.ts` and automatically:
- Adds authentication tokens to requests
- Handles 401 errors (unauthorized)
- Provides a base URL from environment variables
