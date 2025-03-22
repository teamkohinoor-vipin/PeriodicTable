# 3D Interactive Periodic Table

![Periodic Table Preview](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/og2.jpg-5EeQ7LnPeYzqkGjJV7H7y3xKbkfv9k.jpeg)

A modern, interactive 3D periodic table of elements built with Next.js, Three.js, and TypeScript. Explore chemical elements in an immersive 3D environment with detailed information, properties, and visualizations.

## 🌟 Features

- **Interactive 3D Visualization**: Rotate, zoom, and explore the periodic table in 3D space
- **Detailed Element Information**: View comprehensive data for each element including:
  - Basic properties (atomic number, mass, category)
  - Electron configuration
  - Discovery information
  - Applications and uses
  - Hazard information with visual indicators
- **Atomic Model Visualization**: Interactive Bohr model representation of each element
- **Category & Property Filtering**: Filter elements by:
  - Chemical categories (alkali metals, noble gases, etc.)
  - Properties (radioactive, toxic, flammable, etc.)
- **Advanced Search**: Search elements by name, symbol, atomic number, category, or property
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Accessibility Features**: Screen reader support and keyboard navigation

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D Rendering**: [Three.js](https://threejs.org/)
- **State Management**: React Hooks
- **Animations**: TWEEN.js
- **Icons**: [Lucide React](https://lucide.dev/)

### Data
- **Element Data**: [Periodic-Table-JSON](https://github.com/Bowserinator/Periodic-Table-JSON)
- **Custom Data Processing**: TypeScript utilities for element categorization and hazard identification

### Architecture
- **Component-Based Design**: Modular React components for maintainability
- **Responsive Layout**: Mobile-first approach with adaptive UI
- **Client-Side Rendering**: Three.js visualization with React integration
- **Dynamic Routing**: Next.js App Router for seamless navigation
- **Theme System**: Next-themes for dark/light mode support

## 📊 Project Structure

- `app/`: Next.js app directory with pages and layouts
- `components/`: React components for UI elements
- `lib/`: Utility functions and Three.js implementations
- `public/`: Static assets
- `styles/`: CSS and styling files
- `types/`: TypeScript type definitions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Saganaki22/PeriodicTable.git
   cd periodic-table
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Run the development server
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Data sourced from reliable chemical databases and resources
- Inspired by modern scientific visualization tools 
