# Blog Platform Frontend

A modern, high-performance blog application interface built with React, TypeScript, and Vite. This project features a polished UI with smooth animations, a rich text editor, and a responsive design powered by Tailwind CSS and NextUI.

## 🚀 Features

- **Modern UI/UX**: Built with NextUI and Tailwind CSS for a premium look and feel.
- **Rich Text Editing**: Integrated Tiptap editor for creating and editing blog posts.
- **Smooth Animations**: Enhanced user experience with Framer Motion transitions.
- **Responsive Design**: Fully responsive layout for mobile, tablet, and desktop.
- **Type Safety**: Comprehensive TypeScript support for robust development.
- **Routing**: Client-side routing with React Router DOM.
- **State Management**: Efficient data handling with Axios and React Hooks.

## 🛠️ Tech Stack

- **Core**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [NextUI](https://nextui.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Sanitization**: [DOMPurify](https://github.com/cure53/DOMPurify)

## 📋 Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher (bundled with Node.js)

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blog-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory if needed (e.g., for API base URL):

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with HMR |
| `npm run build` | Compiles TypeScript and builds the app for production |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs ESLint to check for code quality issues |
| `npm run clean` | Cleans build artifacts and node_modules |

## 🏗️ Project Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components
├── layouts/         # Page layouts (Main, Auth, etc.)
├── pages/           # Application pages (Home, Post, Login)
├── services/        # API service calls (Axios setup)
├── types/           # TypeScript type definitions
├── utils/           # Helper functions
├── App.tsx          # Main application component
└── main.tsx         # Entry point
```

## 🎨 Design System

This project uses a customized design system built on top of Tailwind CSS and NextUI.
- **Colors**: Defined in `tailwind.config.js`
- **Typography**: Uses modern sans-serif fonts
- **Components**: Modular and reusable components in `src/components`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
