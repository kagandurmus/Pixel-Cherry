# Pixel Cherry

Privacy-first image compression web app built with **Next.js** and **TypeScript**.  
Compress JPG, PNG, WebP, and HEIC images directly in your browser without uploading files to a server.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://pixel-cherry.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

[**Live Demo →**](https://pixel-cherry.vercel.app/)

---

## Why Pixel Cherry?

Most image compression tools send files to a remote server. Pixel Cherry takes a different approach: all processing happens locally in the browser, so your images stay on your device.

This makes it useful for:
- Privacy-conscious users.
- Developers looking for a client-side image compression example.
- Anyone who wants a fast image optimizer without signups, uploads, or API limits.

---

## Features

- **100% client-side processing** — images never leave your device.
- **Smart compression** — reduce file size while keeping acceptable visual quality.
- **Supports multiple formats** — JPG, PNG, WebP, and HEIC.
- **Instant results** — no waiting for server uploads or background processing.
- **Mobile-friendly UI** — works on desktop and mobile browsers.
- **Dark mode** — clean modern interface.
- **Forkable and self-hostable** — deploy your own version easily.

---

## Use Cases

- Compress screenshots before sharing or uploading.
- Reduce image size for websites, forms, and email attachments.
- Optimize photos directly on-device.
- Learn how browser-based image compression works in a modern Next.js app.
- Fork and customize for your own SaaS, productivity tool, or internal workflow.

---

## Tech Stack

- **Next.js 15**
- **TypeScript**
- Browser-based image processing
- Modern responsive UI
- Vercel deployment

---

## Live Demo

Try the app here:  
[https://pixel-cherry.vercel.app/](https://pixel-cherry.vercel.app/)

---

## Quick Start

### Clone the repository

```bash
git clone https://github.com/kagandurmus/Pixel-Cherry.git
cd Pixel-Cherry
```

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Project Structure

```bash
Pixel-Cherry/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── ImageUploader.tsx
│   └── ResultDisplay.tsx
├── lib/
│   └── imageCompression.ts
└── public/
    └── logo.png
```

---

## Self-Hosting

You can easily fork and host your own version of Pixel Cherry.

### Deploy on Vercel
1. Fork this repository.
2. Import the fork into Vercel.
3. Deploy with default settings.

### Run on your own infrastructure
You can also clone the repo and deploy it anywhere that supports Next.js.

This project is intentionally simple to fork, customize, and extend.

---

## Customization Ideas

If you fork this project, you could extend it with:
- Batch compression.
- Drag-and-drop multi-file support.
- Adjustable quality settings.
- Resize before compression.
- Before/after image comparison slider.
- Download as ZIP.
- PWA/offline support.
- EXIF metadata handling.
- Squoosh-style advanced compression controls.

---

## Why Developers May Find This Useful

Pixel Cherry is not just a consumer-facing utility. It is also a useful reference project for developers who want to study:

- Client-side file processing.
- Browser-based image optimization.
- Privacy-first frontend architecture.
- Building lightweight utility apps with Next.js.
- Designing tools that avoid backend costs.

---

## Contributing

Contributions, forks, and improvements are welcome.

You can help by:
- Reporting bugs.
- Suggesting features.
- Improving compression quality or performance.
- Enhancing format support.
- Submitting pull requests.

If you fork this project and build something cool on top of it, that is encouraged.

---

## Roadmap

Planned or possible future improvements:
- Better compression controls.
- Bulk image processing.
- More format-specific optimization.
- Faster processing for large images.
- Improved mobile UX.
- Offline-first support.

---

## License

MIT License.  
You are free to use, modify, fork, and self-host this project.

---

## Author

**Kağan Durmuş**

If this project helped you, consider giving it a star on GitHub.
