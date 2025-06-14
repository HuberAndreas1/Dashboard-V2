# HTL Leonding Dashboard - "Tag der offenen Tür"

## Project Overview
This project is a React + TypeScript dashboard designed to manage and configure the "Tag der offenen Tür" event for HTL Leonding. It provides tools for organizing student assignments, managing event stops, and categorizing participants.

## Features
- **Student Management**: Add, update, and delete student assignments.
- **Event Configuration**: Organize stops and assignments for the event.
- **Categorization**: Automatically categorize students based on their assignments.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used
- **React**: Frontend framework for building user interfaces.
- **TypeScript**: Strongly typed programming language for better code quality.
- **Vite**: Fast development environment and build tool.
- **CSS**: Custom styles for the dashboard.

## Project Structure
```
src/
  assets/         # Static assets like images
  components/     # Reusable UI components
    global/       # Global utilities like theme provider
    pages/        # Page-specific components (e.g., students.tsx)
    ui/           # UI elements like buttons, tables, and dialogs
  hooks/          # Custom React hooks
  lib/            # Utility functions
  styles/         # Global CSS styles
  types/          # TypeScript type definitions
  utils/          # Helper functions
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/HTL-Leonding-Dashboard.git
   ```
2. Navigate to the project directory:
   ```bash
   cd HTL-Leonding-Dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```

### Build
Create a production build:
```bash
npm run build
```

### Linting
Run ESLint:
```bash
npm run lint
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.
