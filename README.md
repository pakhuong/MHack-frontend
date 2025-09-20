# MHack Frontend

## Core Technologies

- ✅ **React 19** with TypeScript
- ✅ **Vite** for build tooling and dev server
- ✅ **ESLint** with TypeScript and React rules
- ✅ **Prettier** for code formatting
- ✅ **Ant Design** component library
- ✅ **Redux Toolkit** for state management
- ✅ **RTK Query** for API calls (with JSONPlaceholder example)
- ✅ **React Router** for routing
- ✅ **Tailwind CSS** for styling

## Key Features Implemented

- **Redux Store** with RTK Query middleware
- **API Service** with sample endpoints (posts, users)
- **React Router** with Home and About pages
- **Example Components** demonstrating Ant Design + Tailwind integration
- **TypeScript** throughout with proper type definitions
- **ESLint + Prettier** configuration with auto-fix scripts

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Check code quality
npm run lint:fix   # Auto-fix ESLint issues
npm run format     # Format code with Prettier
npm run typecheck  # TypeScript type checking
```

### Project Structure

```text
src/
├── app/
│   ├── store.ts      # Redux store configuration
│   └── hooks.ts      # Typed Redux hooks
├── services/
│   └── api.ts        # RTK Query API service
├── routes/
│   └── index.tsx     # React Router configuration
├── pages/
│   ├── Home.tsx      # Home page with posts example
│   └── About.tsx     # About page with users example
├── components/       # Ready for your components
└── assets/          # Static assets
```

### **Example Usage**

The application demonstrates:

- **API calls** with RTK Query (fetching posts and users)
- **Ant Design components** (Cards, Buttons, Typography, etc.)
- **Tailwind CSS** utility classes for responsive design
- **Redux state management** with typed hooks
- **React Router** navigation between pages
