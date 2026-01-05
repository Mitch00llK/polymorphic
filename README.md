# Polymorphic

> **The adaptable page builder** — Lightweight. Powerful. Polymorphic.

A modern, lightweight WordPress page builder designed for agencies and professionals who demand speed without sacrificing power.

## ✨ Features

- **Drag-and-drop builder** — Intuitive visual editing with React and dnd-kit
- **Minimal database footprint** — Single postmeta storage with JSON
- **Blazing fast** — Transient caching for <500ms frontend load times
- **Modern stack** — React 18, TypeScript, Zustand for state management
- **Developer-friendly** — Extensive hooks, filters, and REST API
- **Responsive design** — Built-in breakpoint system (desktop/tablet/mobile)

## 📋 Requirements

- PHP 8.0 or higher
- WordPress 6.0 or higher
- Node.js 18+ (for development)

## 🚀 Quick Start

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/polymorphic.git
cd polymorphic

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Start development server
npm run dev
```

### WordPress Installation

1. Symlink or copy the plugin to your WordPress installation:
   ```bash
   ln -s /path/to/polymorphic /path/to/wordpress/wp-content/plugins/polymorphic
   ```

2. Activate the plugin in WordPress admin

3. Create or edit a page to access the builder

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

| Document | Description |
|----------|-------------|
| [Project Overview](docs/00-project-overview.md) | Brand, positioning, and success metrics |
| [Architecture](docs/01-architecture.md) | Technical design and system diagrams |
| [Coding Standards](docs/02-coding-standards.md) | Naming conventions and code style |
| [Component Library](docs/03-component-library.md) | Component specifications |
| [Database Schema](docs/04-database-schema.md) | JSON structure and storage |
| [API Reference](docs/05-api-reference.md) | REST endpoints and hooks |
| [Security](docs/06-security.md) | Security implementation |
| [Roadmap](docs/07-roadmap.md) | Development timeline |
| [Licensing](docs/08-licensing.md) | Licensing strategy |
| [Marketing](docs/09-marketing.md) | Go-to-market plan |

## 🧩 MVP Components

| Component | Description |
|-----------|-------------|
| **Section** | Full-width layout container |
| **Container** | Constrained content wrapper |
| **Heading** | H1-H6 text elements |
| **Text** | Rich text/paragraph content |
| **Image** | Responsive images |
| **Button** | Call-to-action buttons |

## 🛠 Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run lint         # Run ESLint and stylelint
npm run lint:fix     # Fix linting issues
npm run test         # Run tests
```

### PHP Commands

```bash
composer lint        # Run PHP CodeSniffer
composer lint:fix    # Fix PHP linting issues
composer test        # Run PHPUnit tests
```

## 🔌 Extending

### Custom Components (PHP)

```php
add_filter('polymorphic/components/registry', function($components) {
    $components['custom-cta'] = MyPlugin\CustomCTA::class;
    return $components;
});
```

### Modify Render Output

```php
add_filter('polymorphic/render/component', function($html, $component) {
    if ($component['type'] === 'heading') {
        $html = '<div class="custom-wrapper">' . $html . '</div>';
    }
    return $html;
}, 10, 2);
```

### JavaScript Events

```javascript
window.polymorphic.on('component:added', (component) => {
    console.log('New component:', component.type);
});

window.polymorphic.on('save:complete', (response) => {
    console.log('Saved at:', response.modified);
});
```

## 📁 Project Structure

```
polymorphic/
├── docs/                    # Documentation
├── includes/                # PHP source files
│   ├── Admin/              # Admin pages and assets
│   ├── Api/                # REST API endpoints
│   ├── Components/         # Component classes
│   ├── Core/               # Core plugin classes
│   ├── Frontend/           # Frontend rendering
│   └── Helpers/            # Utility classes
├── src/                     # React source files
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript definitions
│   └── utils/              # Utility functions
├── assets/                  # Compiled assets (built)
└── languages/              # Translation files
```

## 🔒 Security

Polymorphic follows WordPress security best practices:

- All user inputs are sanitized
- All outputs are properly escaped
- Capability checks on all actions
- Nonce verification on all forms
- Prepared statements for database queries

## 📄 License

This project is licensed under the GPL v2 or later - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📧 Support

- **Documentation**: [polymorphic.dev/docs](https://polymorphic.dev/docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/polymorphic/issues)
- **Email**: support@polymorphic.dev

---

Made with ❤️ for the WordPress community
