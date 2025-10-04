# Tailwind CSS Setup for JuanCharge

## 🎨 Tailwind CSS Configuration

This project now includes Tailwind CSS v4 with custom configurations optimized for the JuanCharge brand.

### ✅ What's Included

- **Tailwind CSS v4** with PostCSS processing
- **Custom color palette** with primary (green) and secondary (gray) shades
- **Glassmorphism utilities** for modern UI effects
- **Custom animations** and transitions
- **Brand-specific components** and utilities
- **VS Code IntelliSense** support

### 🎯 Custom Classes Available

#### Glassmorphism Effects
```css
.glass           /* White glassmorphic background */
.glass-dark      /* Dark glassmorphic background */
.glass-green     /* Green-tinted glassmorphic background */
```

#### Custom Buttons
```css
.btn-primary     /* Primary green button */
.btn-secondary   /* Secondary gray button */
```

#### Custom Inputs
```css
.input-primary   /* Styled form inputs with focus states */
```

#### Background Gradients
```css
.bg-gradient-green    /* Green gradient background */
.bg-gradient-glass    /* Glassmorphic gradient */
.text-gradient-green  /* Green gradient text */
```

#### Hover Effects
```css
.card-hover      /* Smooth hover animations for cards */
```

### 🎨 Color Palette

#### Primary (Brand Green)
- `primary-50` to `primary-900` - Green shades from lightest to darkest
- Main brand color: `primary-600` (#16a34a)

#### Secondary (Neutral Gray)
- `secondary-50` to `secondary-900` - Gray shades
- Text color: `secondary-700` (#334155)

### 🚀 Usage Examples

#### Basic Card with Glassmorphism
```vue
<template>
  <div class="glass rounded-xl p-6 card-hover">
    <h3 class="text-xl font-bold text-gradient-green">Card Title</h3>
    <p class="text-secondary-600">Card content here</p>
  </div>
</template>
```

#### Primary Button
```vue
<template>
  <button class="btn-primary">
    Click me
  </button>
</template>
```

#### Form Input
```vue
<template>
  <input class="input-primary" placeholder="Enter text" />
</template>
```

#### Background with Gradient
```vue
<template>
  <div class="bg-gradient-green min-h-screen">
    <!-- Content -->
  </div>
</template>
```

### 📁 File Structure
```
src/
├── assets/
│   └── css/
│       └── tailwind.css          # Main Tailwind file with custom utilities
├── main.js                       # Tailwind imported here
tailwind.config.js                # Tailwind configuration
postcss.config.js                 # PostCSS configuration
.vscode/
└── settings.json                 # VS Code IntelliSense settings
```

### 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 🎨 Combining with Quasar

Tailwind works alongside Quasar UI components. You can mix both:

```vue
<template>
  <!-- Quasar component with Tailwind classes -->
  <q-card class="glass rounded-xl card-hover">
    <q-card-section>
      <h3 class="text-gradient-green text-xl font-bold">
        Quasar + Tailwind
      </h3>
    </q-card-section>
  </q-card>
</template>
```

### 📝 Notes

- Tailwind classes have higher specificity than most Quasar styles
- Use `!important` utility (`!bg-red-500`) if you need to override Quasar styles
- The setup includes purging, so only used classes are included in the final build
- Custom utilities are available globally after importing the CSS file

### 🔧 Customization

To add more custom styles, edit:
- `tailwind.config.js` - For theme extensions and config
- `src/assets/css/tailwind.css` - For custom CSS utilities

### 📱 Responsive Design

All Tailwind responsive utilities work as expected:
```vue
<template>
  <div class="w-full md:w-1/2 lg:w-1/3">
    Responsive width
  </div>
</template>
```

Your Tailwind CSS setup is now complete and ready to use! 🎉