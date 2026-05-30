# 🚀 PdfPix — Premium, Fast & Client-Side PDF Utilities

PdfPix is a clean, modern, and high-performance collection of PDF utility tools built using **Next.js**, **TypeScript**, and **Tailwind CSS v4**.

Designed to run **fully within the browser**, PdfPix processes all PDF manipulations directly on the client side using WebAssembly and modern browser APIs. No document metadata or content ever leaves the user's computer, ensuring absolute speed, privacy, and security.

---

## ✨ Features

- 📑 **Merge & Split PDF**: Seamlessly combine multiple files or extract pages with ease.
- 🎨 **Edit & Annotate**: Add text streams, drawing overlays, images, and shapes onto existing documents.
- 📝 **PDF to Word / Word to PDF**: Convert between common documentation layers with clean styling.
- 🖼️ **Image conversions**: Transform JPG/PNG/HTML streams directly into PDF vectors.
- 🔍 **AI OCR Extraction**: Extract selectable text blocks using on-demand intelligence layers.
- 🔒 **Security**: Add passwords, redact layers, or unlock restrictions instantly.

---

## 🛠️ Architecture (Client-Side First)

PdfPix is engineered for maximum speed and zero hosting costs:
* **No Custom Backend**: All core file processors (such as `pdf-lib` and `pdfjs-dist`) run locally inside browser sandboxes.
* **Serverless Edge Hooks**: Dynamic integrations (like Nvidia's AI OCR endpoints) are invoked securely from client-side layers.
* **Highly Portable**: Since there is no complex server component, it compiles into a standard bundle deployable on any modern cloud edge.

---

## ⚡ Local Development

Get the developer suite running locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view the suite.

3. **Validate Code Quality**:
   ```bash
   npm run check
   ```

---

## ☁️ Deploying to Cloudflare Pages

PdfPix is fully configured to compile and run on Cloudflare's global edge network using OpenNext:

1. **Link your Repository** on the Cloudflare Dashboard.
2. Select the **`Next.js`** framework preset in the dropdown.
3. Configure the following build settings:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Click **Save and Deploy**!

---

## 📄 License

Distributed under the **MIT License**. Created by [JCodesMore](https://github.com/JCodesMore).