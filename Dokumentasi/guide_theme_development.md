# 🎨 Theme Development Guide

The **SIMAJU Core Framework** doesn't just provide a REST API (Backend); it also comes with capable *Server-Side Rendering* (SSR) capabilities using the EJS/Pug engine powered by the **Theme Engine** architecture.

A Theme is responsible for managing all UI/UX elements, layouts, and public assets (*CSS/JS*) that clients or customers will see directly in their web browsers.

---

## 1. Theme Concept in SIMAJU

Instead of mixing HTML code within the *Core* or *Modules*, you separate all visual designs into the `resources/views/themes/` folder.
This framework supports a **Switchable Themes** system, much like modern CMSs. You can change your application's appearance instantly just by changing the active theme name in the settings!

---

## 2. Theme Directory Structure

A theme consists of a collection of *Views* and an accompanying manifest. The standard structure looks like this:

```text
resources/
├── views/
│   └── themes/
│       └── corporate-modern/      # <--- Theme Name
│           ├── theme.json         # Theme Metadata (Required)
│           ├── layout.ejs         # Master Template (Header, Footer, Nav)
│           ├── index.ejs          # Main homepage
│           ├── auth/
│           │   ├── login.ejs      # Login page view
│           │   └── register.ejs   # Registration page view
│           └── partials/          # Code snippets (Sidebar, Modal)
└── assets/
    └── themes/
        └── corporate-modern/      # <--- Theme Public Assets
            ├── css/style.css
            ├── js/app.js
            └── img/logo.png
```

---

## 3. How to Build a Theme

### Step 1: Create the Directory and `theme.json` File
The `theme.json` file must be at the root of your theme folder. This file tells SIMAJU the theme's identity.

```json
{
  "name": "corporate-modern",
  "displayName": "Corporate Modern UI",
  "author": "Your Name",
  "version": "1.0.0",
  "description": "A corporate theme with a responsive modern look."
}
```

### Step 2: Building the Master Layout (`layout.ejs`)
So you don't have to write the `<html><head>` HTML code repeatedly, create a single master layout that contains the built-in EJS function, for example: `<%- body %>`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><%= pageTitle || 'Welcome' %></title>
    <!-- Automatically load public CSS from the public/assets folder -->
    <link rel="stylesheet" href="/assets/themes/corporate-modern/css/style.css">
</head>
<body>
    
    <header>
        <%- include('partials/navbar') %>
    </header>

    <main>
        <!-- Page-specific content will be rendered below -->
        <%- body %>
    </main>

    <footer>
        <p>&copy; 2026 Your Company</p>
    </footer>

</body>
</html>
```

### Step 3: Writing Page-Specific Content (`index.ejs`)
Other pages can use this master layout:

```html
<% layout('layout') %>

<div class="hero">
    <h1>Hello, <%= user ? user.name : 'Guest' %>!</h1>
    <p>This is the main page using the Corporate Modern theme.</p>
</div>
```

---

## 4. How to Activate a Theme

The theme system in SIMAJU Core can be changed via the `mji` CLI or the `simaju.json` configuration.

**Using CLI:**
```bash
mji theme:use corporate-modern
```
This command will automatically point the rendering engine to use the `corporate-modern` folder and expose `resources/assets/themes/corporate-modern/` into the static `public/` folder.

---

## 5. Asset Writing Standards (CSS & JS)
All assets (*CSS, JavaScript, Images, Fonts*) related to the theme's visual appearance **MUST NOT** be placed inside the `views` folder.
All assets must be placed separately in the `resources/assets/themes/<theme-name>/` folder. They can later be automatically built or *published* into the `public/` folder by the SIMAJU framework during deployment.
