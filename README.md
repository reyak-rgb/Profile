# Reya Kuruvila · Portfolio

A static, dependency-free personal portfolio built with HTML, CSS and vanilla JavaScript.

## Structure
```
index.html   page content (About, Experience, Education, Research, Skills, Workshops, Contact)
style.css    styles, light/dark themes, responsive layout
main.js      theme toggle, mobile menu, scroll reveal, count-up stats, workshop tabs, hero graph animation
reya.jpg     profile photo
README.md
```

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy
Push to GitHub and enable **Settings → Pages → Deploy from branch (main, root)**. Any static host works (Netlify, Vercel, Cloudflare Pages).

## Editing content
All text lives in `index.html`. Colors are CSS variables at the top of `css/style.css`.
