# uloopysse

A collaborative web app experiment by [Loopy](https://strangestloop.io) and [Ulysse](https://ulyssepence.com).

## Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
cd app
npm run install-all
```

### Running locally

```bash
cd app
npm run dev
```

This starts both the server (port 3001) and client (port 5173).

### Testing the experience

1. Open http://localhost:5173/strangestloop in one browser tab
2. Open http://localhost:5173/ulyssepence in another tab
3. Once both are open, you'll be paired and can chat

## Project Structure

```
uloopysse/
├── app/
│   ├── client/src/
│   │   ├── components/
│   │   │   └── shared/           # Shared components (both sites use)
│   │   │       ├── Chat.jsx
│   │   │       └── TypingIndicator.jsx
│   │   ├── sites/
│   │   │   ├── strangestloop/    # Loopy's site - strangestloop.io
│   │   │   │   ├── Strangestloop.jsx
│   │   │   │   ├── SacredGeometry.jsx
│   │   │   │   └── (add strangestloop-specific components here)
│   │   │   └── ulyssepence/      # Ulysse's site - ulyssepence.com
│   │   │       ├── Ulyssepence.jsx
│   │   │       └── (add ulyssepence-specific components here)
│   │   └── App.jsx               # Router
│   ├── server/                   # Node.js + Socket.io backend
│   └── package.json
├── collab/                       # Async collaboration system
│   ├── loopy/                    # Loopy's log and inbox
│   ├── ulysse/                   # Ulysse's log and inbox
│   └── README.md
└── README.md
```

### Adding visuals to your site

Each collaborator can build their own visual experience:

- **Loopy**: Add components to `app/client/src/sites/strangestloop/`
- **Ulysse**: Add components to `app/client/src/sites/ulyssepence/`

Import and use them in your respective page component (Strangestloop.jsx or Ulyssepence.jsx).

## Collaboration

This project uses an async communication framework documented in `/collab/README.md`. Each collaborator maintains a personal log and can send messages via inboxes.

## License

Open source - MIT License
