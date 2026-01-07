---
description: Standard development workflow for Polymorphic page builder
---

# Development Workflow

## Quick Start

// turbo-all
1. Navigate to the project directory
```bash
cd /Users/mitch/Desktop/GitHub/polymorphic
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## WordPress Local Development

1. Symlink plugin to WordPress installation
```bash
ln -s /Users/mitch/Desktop/GitHub/polymorphic /path/to/wordpress/wp-content/plugins/polymorphic
```

2. Activate the plugin in WordPress admin

3. Start the development watch mode
```bash
npm run dev
```

## Testing

1. Run PHP unit tests
```bash
composer test
```

2. Run JavaScript tests
```bash
npm test
```

3. Run linting
```bash
npm run lint
composer lint
```

## Building

1. Development build (with source maps)
```bash
npm run build:dev
```

2. Production build (minified)
```bash
npm run build
```

## Code Standards

- Follow WordPress Coding Standards for PHP
- Follow Airbnb JavaScript Style Guide for JS/React
- Use ESLint and Prettier for formatting
- Run `npm run lint:fix` before committing

refference files in the docs directory