import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_OG_IMAGE_HEIGHT,
  SITE_OG_IMAGE_WIDTH,
  SITE_URL,
  getCanonicalUrl,
  getPathForSeoId,
} from "@/lib/site";

export interface ToolSEOInfo {
  id: string;
  title: string;
  description: string;
  keywords: string;
  heading: string;
  steps: string[];
  faqs: { question: string; answer: string }[];
}

export const seoData: Record<string, ToolSEOInfo> = {
  merge: {
    id: "merge",
    title: "Merge PDF - Combine PDF Files Online Free | PdfPix",
    description: "Combine multiple PDF documents into one single PDF file online for free. Drag and drop to reorder pages and merge PDFs in seconds. 100% private in-browser processing.",
    keywords: "merge pdf, combine pdf, combine pdf files, join pdf, merge pdf online free, merge pdfs in-browser",
    heading: "Merge PDF Files",
    steps: [
      "Select the PDF files you want to combine by clicking 'Select PDF files' or dragging them into the drop zone.",
      "Drag and drop the file cards to arrange them in the exact order you want them merged.",
      "Click the 'Merge PDFs!' button to combine your files locally in your browser and automatically download the merged document."
    ],
    faqs: [
      { question: "Is it safe to merge my PDFs with PdfPix?", answer: "Yes, absolutely. Unlike other online tools that upload your files to external servers, PdfPix processes all documents locally inside your web browser. Your confidential documents never leave your computer." },
      { question: "Is there a limit on how many files I can merge?", answer: "No. Since the processing runs locally on your own computer, there are no artificial limits or queues. You can merge as many PDF files as your computer's browser memory can handle." },
      { question: "Does merging PDFs preserve formatting and page size?", answer: "Yes, PdfPix preserves all original fonts, styles, layouts, graphics, and page sizes of each PDF being merged." }
    ]
  },
  split: {
    id: "split",
    title: "Split PDF - Extract Pages from PDF Online Free | PdfPix",
    description: "Split PDF pages or extract custom page ranges into independent PDF files online. Free, fast, and secure PDF page extractor processing entirely in your browser.",
    keywords: "split pdf, extract pages from pdf, split pdf online, divide pdf, separate pdf pages, free pdf splitter",
    heading: "Split PDF File",
    steps: [
      "Choose the PDF file you wish to split by selecting it or dragging it into the converter.",
      "Specify your split options, such as extracting all pages, custom ranges, or separating specific pages.",
      "Click the 'Split PDF!' button to extract the pages in seconds and save your new PDFs."
    ],
    faqs: [
      { question: "Can I extract specific page ranges from a PDF?", answer: "Yes, you can extract individual pages, sequential ranges (e.g., pages 5-10), or multiple non-adjacent ranges at the same time." },
      { question: "Will my split files remain secure?", answer: "Yes, all splitting and extraction are done locally in your browser. Your files are not uploaded to any server, guaranteeing complete privacy." },
      { question: "Is this PDF splitter free to use?", answer: "Yes, PdfPix is 100% free with no hidden charges, sign-ups, or limits." }
    ]
  },
  compress: {
    id: "compress",
    title: "Compress PDF - Reduce PDF File Size Online Free | PdfPix",
    description: "Compress and make your PDF file size smaller while maintaining maximum quality. Free online PDF compressor processing securely in-browser.",
    keywords: "compress pdf, reduce pdf size, make pdf smaller, shrink pdf file, compress pdf online, secure pdf compressor",
    heading: "Compress PDF",
    steps: [
      "Upload your PDF document into the compressor container.",
      "Choose your desired level of compression (Extreme, Recommended, or Low Compression).",
      "Click the 'Compress PDF!' button to shrink the file size and instantly download the optimized PDF."
    ],
    faqs: [
      { question: "Does compressing a PDF reduce its visual quality?", answer: "PdfPix uses smart compression algorithms that optimize text and compress images without visibly degrading document clarity." },
      { question: "Why is local PDF compression better?", answer: "Local compression is faster because you don't need to upload heavy files to a server, and it keeps your private files secure on your own machine." },
      { question: "Can I compress password-protected PDFs?", answer: "You will need to unlock the PDF first using our Unlock PDF tool before compressing it." }
    ]
  },
  "pdf-to-word": {
    id: "pdf-to-word",
    title: "PDF to Word Converter - Convert PDF to DOCX Free | PdfPix",
    description: "Convert PDF documents to editable Microsoft Word files (DOC/DOCX) online for free. Highly accurate conversion, maintaining original layouts. Secure browser processing.",
    keywords: "pdf to word, convert pdf to word, pdf to docx, pdf to doc, convert pdf to docx free, online pdf to word",
    heading: "Convert PDF to Word",
    steps: [
      "Upload the PDF document you want to convert to Word.",
      "Click the 'Convert to Word' button to start processing.",
      "Download your fully editable Microsoft Word (.docx) file immediately after conversion."
    ],
    faqs: [
      { question: "Can I edit the converted Word document?", answer: "Yes. The output DOCX file is fully editable in Microsoft Word, Google Docs, or any compatible word processor." },
      { question: "Is the formatting preserved after PDF to Word conversion?", answer: "Our advanced parser retains paragraphs, lists, tables, and alignment as closely as possible to the original PDF." },
      { question: "Are scanned PDFs convertible to Word?", answer: "For scanned PDFs, we recommend using our OCR PDF tool first to convert the images to text before saving to Word." }
    ]
  },
  "pdf-to-ppt": {
    id: "pdf-to-ppt",
    title: "PDF to PowerPoint Converter - Convert PDF to PPT Free | PdfPix",
    description: "Convert PDF to PowerPoint presentation slideshows (PPT/PPTX) online for free. Clean layouts, editable elements, and secure local processing.",
    keywords: "pdf to powerpoint, pdf to ppt, pdf to pptx, convert pdf to powerpoint online, free pdf to ppt converter",
    heading: "Convert PDF to PowerPoint",
    steps: [
      "Drag and drop your PDF file or click to upload it.",
      "Initiate the conversion process by clicking the 'Convert to PPTX' button.",
      "Download the editable PowerPoint slideshow (.pptx) to your device."
    ],
    faqs: [
      { question: "Are individual PDF pages converted into slides?", answer: "Yes, each page in your PDF file is converted into an individual slide in the resulting PowerPoint presentation." },
      { question: "Is my privacy protected during PDF to PPT conversion?", answer: "Absolutely. All processing occurs locally on your machine, ensuring your slideshow contents remain private." },
      { question: "Do I need PowerPoint installed to convert?", answer: "No, the conversion is handled entirely in your web browser. You can open the output file in PowerPoint, Google Slides, or Keynote." }
    ]
  },
  "pdf-to-excel": {
    id: "pdf-to-excel",
    title: "PDF to Excel Converter - Convert PDF to XLS Free | PdfPix",
    description: "Extract data and tables from PDF to Excel spreadsheets (XLS/XLSX) online for free. Highly accurate row/column mapping. Secure in-browser conversion.",
    keywords: "pdf to excel, pdf to xlsx, pdf to xls, extract tables from pdf to excel, convert pdf to excel free",
    heading: "Convert PDF to Excel",
    steps: [
      "Select or drop the PDF containing tables or rows of data.",
      "Click 'Convert to Excel' to parse and map the structural tabular data.",
      "Save the resulting spreadsheet (.xlsx) containing your clean dataset."
    ],
    faqs: [
      { question: "Can I extract multiple tables from one PDF?", answer: "Yes, PdfPix parses all tables across multiple pages and exports them to Excel sheets." },
      { question: "How safe is my spreadsheet data?", answer: "Your financial or analytical data remains 100% private because all parsing runs in your browser without external server transmission." },
      { question: "Are formulas converted?", answer: "PDFs only store raw text and coordinates, not formulas. The output will contain the exact numbers and text arranged in rows and columns." }
    ]
  },
  "word-to-pdf": {
    id: "word-to-pdf",
    title: "Word to PDF Converter - Convert DOC to PDF Free | PdfPix",
    description: "Convert Microsoft Word documents (DOC/DOCX) to professional PDF files online for free. Preserves layout, styling, and images. 100% secure in-browser conversion.",
    keywords: "word to pdf, convert word to pdf, docx to pdf, doc to pdf, convert doc to pdf online free, secure docx to pdf",
    heading: "Convert Word to PDF",
    steps: [
      "Upload your DOC or DOCX Word document.",
      "Click the 'Convert to PDF' button to convert it in your browser.",
      "Download the high-quality, read-only PDF file immediately."
    ],
    faqs: [
      { question: "Will my Word styling change when converting to PDF?", answer: "No. Our converter is designed to preserve your margins, tables, spacing, fonts, and images exactly as they look in Word." },
      { question: "Can I convert docx to PDF without Microsoft Office?", answer: "Yes, the conversion runs entirely within our application in your browser, requiring no external software." },
      { question: "Is my document secure?", answer: "Yes, your files are processed locally. No one else will ever see your documents." }
    ]
  },
  "ppt-to-pdf": {
    id: "ppt-to-pdf",
    title: "PowerPoint to PDF Converter - Convert PPT to PDF Free | PdfPix",
    description: "Convert PowerPoint slideshows (PPT/PPTX) to PDF online for free. Perfect representation of slides and assets. Local browser-based converter.",
    keywords: "powerpoint to pdf, convert ppt to pdf, pptx to pdf, convert slides to pdf free, ppt to pdf online converter",
    heading: "Convert PowerPoint to PDF",
    steps: [
      "Drag and drop your PowerPoint presentation (.ppt or .pptx) into the dropzone.",
      "Click 'Convert to PDF' to convert each slide into a PDF page.",
      "Download your print-ready PDF document."
    ],
    faqs: [
      { question: "Does the PDF retain slide transitions?", answer: "PDF is a static print format, so animations and slide transitions will not play, but the visual content of each slide is perfectly captured." },
      { question: "Is there a limit on slide counts?", answer: "No, you can convert presentations of any size or length." },
      { question: "Is this service safe to use for business slide decks?", answer: "Yes. Since the conversion is processed on your local device, confidential business decks are never exposed to external servers." }
    ]
  },
  "excel-to-pdf": {
    id: "excel-to-pdf",
    title: "Excel to PDF Converter - Convert XLS to PDF Free | PdfPix",
    description: "Convert Excel spreadsheets (XLS/XLSX) to PDF documents online for free. Maintain table structures, columns, and sheet layout. Safe in-browser conversion.",
    keywords: "excel to pdf, convert excel to pdf, xlsx to pdf, xls to pdf, excel to pdf online free, spreadsheet to pdf converter",
    heading: "Convert Excel to PDF",
    steps: [
      "Choose the Excel sheet you want to convert.",
      "Click 'Convert to PDF' to align and render the sheets.",
      "Download the PDF copy of your spreadsheets."
    ],
    faqs: [
      { question: "Will columns get cut off in the PDF?", answer: "The converter scales sheet columns to fit the PDF pages so your data stays legible without overflowing." },
      { question: "Can I convert multiple worksheets at once?", answer: "Yes, all sheets in the Excel workbook will be compiled into the final PDF document." },
      { question: "Is my spreadsheet data kept private?", answer: "Yes, all calculations and rendering are performed locally in your browser." }
    ]
  },
  "pdf-to-jpg": {
    id: "pdf-to-jpg",
    title: "PDF to JPG Converter - Extract Images from PDF Free | PdfPix",
    description: "Convert PDF pages to high-quality JPG images or extract all images contained inside a PDF. 100% free, secure, and runs locally in your browser.",
    keywords: "pdf to jpg, convert pdf to jpg, pdf to jpeg, extract images from pdf, pdf to image converter free, online pdf to jpg",
    heading: "Convert PDF to JPG",
    steps: [
      "Upload your PDF file.",
      "Choose whether you want to 'Convert entire pages' or 'Extract images only'.",
      "Click 'Convert to JPG' to process and download a zip file containing the images."
    ],
    faqs: [
      { question: "What is the difference between converting pages and extracting images?", answer: "'Convert entire pages' renders each PDF page as a full JPG image. 'Extract images' pulls out only the raw photographs or graphics embedded within the PDF." },
      { question: "Is the resolution of the exported images high?", answer: "Yes, we render pages at high DPI to ensure that text and graphics remain sharp and readable in the resulting JPGs." },
      { question: "Is this secure for private pictures or charts?", answer: "Yes, everything is converted locally in your browser, maintaining full security." }
    ]
  },
  "jpg-to-pdf": {
    id: "jpg-to-pdf",
    title: "JPG to PDF Converter - Convert Images to PDF Free | PdfPix",
    description: "Convert JPG and PNG images to PDF documents in seconds. Easily adjust margins, orientation, and order. Free online image to PDF converter.",
    keywords: "jpg to pdf, convert jpg to pdf, image to pdf, png to pdf, convert images to pdf online free, jpeg to pdf converter",
    heading: "Convert JPG to PDF",
    steps: [
      "Select your images (JPG, PNG, WebP) or drag them into the upload box.",
      "Configure your preferences like page orientation (portrait/landscape), margin sizes, and image order.",
      "Click 'Convert to PDF' to compile the images into a single PDF document."
    ],
    faqs: [
      { question: "Can I merge multiple images into one PDF?", answer: "Yes, you can upload multiple images, rearrange them, and compile them into a single multi-page PDF document." },
      { question: "What image formats are supported?", answer: "We support JPG, JPEG, PNG, WebP, and BMP images." },
      { question: "Is there a limit to the file size of the images?", answer: "No. Because images are converted locally, there is no file size limit except what your machine's hardware supports." }
    ]
  },
  "png-to-pdf": {
    id: "png-to-pdf",
    title: "PNG to PDF Converter - Convert PNG Images to PDF Free | PdfPix",
    description: "Convert PNG and WEBP images to PDF documents in seconds. Adjust orientation, margins, and page size. Free online image to PDF converter.",
    keywords: "png to pdf, convert png to pdf, image to pdf, webp to pdf, convert images to pdf online free, png to pdf converter",
    heading: "Convert PNG to PDF",
    steps: [
      "Select your PNG or WEBP images or drag them into the upload zone.",
      "Configure page orientation, size, and margin settings in the sidebar.",
      "Click 'Convert to PDF' to compile your images into a single PDF document."
    ],
    faqs: [
      { question: "Does PNG to PDF preserve transparency?", answer: "Yes, PNG transparency is maintained when embedding images into the PDF document." },
      { question: "What image formats are supported?", answer: "We support PNG, WEBP, and JPG images in this converter." },
      { question: "Can I rearrange images before converting?", answer: "Yes, drag and drop the image cards to set the exact page order you want in the final PDF." }
    ]
  },
  "image-to-pdf": {
    id: "image-to-pdf",
    title: "Image to PDF Converter - Convert Images to PDF Free | PdfPix",
    description: "Convert JPG, PNG, WEBP, GIF, BMP, and TIFF images to PDF documents online for free. Adjust orientation, margins, and page size. Complete local in-browser conversion.",
    keywords: "image to pdf, convert images to pdf, jpg to pdf, png to pdf, gif to pdf, webp to pdf, convert image to pdf free online",
    heading: "Convert Image to PDF",
    steps: [
      "Select your images (JPG, PNG, WEBP, GIF, BMP, TIFF) or drag them into the upload zone.",
      "Configure page orientation, page size, and margin settings in the sidebar panel.",
      "Rearrange or rotate individual images if needed, then click 'Convert to PDF!' to download the combined document."
    ],
    faqs: [
      { question: "What image formats can I convert to PDF?", answer: "We support JPG, JPEG, PNG, WEBP, GIF, BMP, and TIFF formats. Non-standard formats are processed securely in your browser and embedded seamlessly." },
      { question: "Can I combine different image formats into one PDF?", answer: "Yes, you can upload a mix of JPG, PNG, and other formats at once and combine them into a single PDF." },
      { question: "Is my privacy protected during image conversion?", answer: "Absolutely. All image processing, canvas operations, and PDF generation are executed locally in your browser. Your images are never sent to any server." }
    ]
  },
  rotate: {
    id: "rotate",
    title: "Rotate PDF Pages Online Free - Rotate PDFs | PdfPix",
    description: "Rotate PDF pages 90, 180, or 270 degrees in seconds. Free online PDF rotator tool that runs securely on your computer.",
    keywords: "rotate pdf, rotate pdf online, flip pdf pages, turn pdf page, free pdf rotator, rotate pdf files",
    heading: "Rotate PDF Pages",
    steps: [
      "Upload the PDF file that has pages in the wrong orientation.",
      "Select the pages and click the rotate icons to spin them left or right.",
      "Click 'Rotate PDF!' and save the corrected document."
    ],
    faqs: [
      { question: "Can I rotate only specific pages in a PDF?", answer: "Yes, you can select and rotate individual pages, or rotate all pages in the document simultaneously." },
      { question: "Does rotating modify the content of the PDF?", answer: "No, it only adjusts the page rotation metadata, leaving text, drawings, and images intact." },
      { question: "Is the rotation permanent?", answer: "Yes, once saved, the pages will open in the rotated orientation in all PDF readers." }
    ]
  },
  edit: {
    id: "edit",
    title: "Edit PDF Online - Free PDF Editor & Annotator | PdfPix",
    description: "Edit PDF files online for free. Add text, shapes, images, and highlight PDF pages. A complete browser-based PDF editor with no watermarks.",
    keywords: "edit pdf, pdf editor, edit pdf online free, annotate pdf, write on pdf, pdf editor online, free pdf annotator",
    heading: "Edit PDF Document",
    steps: [
      "Drag your PDF document into our online PDF editor.",
      "Use our toolbar to add text, insert shapes, draw freehand, highlight lines, or insert images.",
      "Click 'Apply Changes' or 'Save' to download your edited PDF document."
    ],
    faqs: [
      { question: "Is the editor really free with no watermarks?", answer: "Yes, PdfPix lets you edit your PDFs for free without adding any ugly brand watermarks to your files." },
      { question: "Can I type text directly on the PDF?", answer: "Yes! Simply select the Text tool, click anywhere on the page, and start typing." },
      { question: "Are my files uploaded when editing?", answer: "No. The editor runs entirely locally in your browser. Your document is processed on your device, ensuring maximum confidentiality." }
    ]
  },
  "remove-pages": {
    id: "remove-pages",
    title: "Remove PDF Pages Online Free - Delete PDF Pages | PdfPix",
    description: "Remove pages from a PDF document online for free. Delete unwanted pages and save a clean PDF instantly. Secure browser-only processor.",
    keywords: "remove pages from pdf, delete pdf pages, delete pages from pdf online, remove pdf pages free, crop pages pdf",
    heading: "Remove Pages from PDF",
    steps: [
      "Select the PDF file you want to edit.",
      "Hover over the pages and click the trash/delete icon on pages you want to remove.",
      "Click the 'Remove Pages!' button to generate and download the updated PDF file."
    ],
    faqs: [
      { question: "Can I undo page deletions before downloading?", answer: "Yes, you can undo page removal or select pages again before clicking the final export button." },
      { question: "Is my document secure while removing pages?", answer: "Yes, everything is executed locally. No server receives your PDF files." },
      { question: "Can I delete multiple pages at once?", answer: "Yes, simply click the delete icon on all pages you wish to discard." }
    ]
  },
  watermark: {
    id: "watermark",
    title: "Add Watermark to PDF Online Free - Protect PDFs | PdfPix",
    description: "Add image or text watermarks to your PDF documents online for free. Choose font, size, opacity, and positioning. Secure browser-based tool.",
    keywords: "add watermark to pdf, watermark pdf, insert watermark pdf, protect pdf with watermark, free online pdf watermark",
    heading: "Add Watermark to PDF",
    steps: [
      "Upload your PDF document.",
      "Choose 'Text Watermark' or 'Image Watermark' and type your text or upload a logo.",
      "Set your rotation, opacity, position, and page ranges, then click 'Add Watermark!' to download the stamped PDF."
    ],
    faqs: [
      { question: "Can I customize the position of the watermark?", answer: "Yes, you can place the watermark in any of the 9 grid positions, rotate it, and adjust the opacity." },
      { question: "Can I choose which pages are watermarked?", answer: "Yes, you can apply the watermark to all pages, only odd/even pages, or select custom page ranges." },
      { question: "Is my watermark logo secure?", answer: "Yes, since your images and PDFs never leave your machine, your logo and documents are perfectly protected." }
    ]
  },
  "page-numbers": {
    id: "page-numbers",
    title: "Add Page Numbers to PDF Online Free | PdfPix",
    description: "Add page numbers to PDF documents online for free. Choose placement, starting number, font, and format. Processing runs securely in-browser.",
    keywords: "add page numbers to pdf, number pdf pages, insert page numbers pdf, page numbering tool free, online pdf page numberer",
    heading: "Add Page Numbers",
    steps: [
      "Upload the PDF document you want to number.",
      "Select your starting number, margin offsets, text format, and placement (header/footer, left/center/right).",
      "Click 'Add Page Numbers!' to process and download the numbered PDF."
    ],
    faqs: [
      { question: "Can I skip the first page (cover page) when numbering?", answer: "Yes, you can customize the start page and specify page ranges to exclude the cover page from page numbering." },
      { question: "What formats can I choose for page numbers?", answer: "You can choose simple numbers (1, 2, 3), 'Page X of Y', or custom labels." },
      { question: "Is my document secure?", answer: "Yes, page numbering is applied inside your browser engine locally." }
    ]
  },
  unlock: {
    id: "unlock",
    title: "Unlock PDF - Remove PDF Password & Restrictions | PdfPix",
    description: "Remove password protection and unlock secured PDF files online. Free PDF password remover for editing, copying, and printing restrictions. Secure local execution.",
    keywords: "unlock pdf, remove pdf password, decrypt pdf, unlock pdf online, remove pdf security, free pdf password remover",
    heading: "Unlock PDF File",
    steps: [
      "Choose the password-protected PDF file.",
      "Enter the password if required (for owner/user passwords) to authorize decryption.",
      "Click 'Unlock PDF!' to strip the password lock and download the unrestricted PDF."
    ],
    faqs: [
      { question: "Can I unlock a PDF if I don't know the password?", answer: "If the PDF only has permissions/owner password restrictions (for copying/printing), we can unlock it instantly. If it is strongly encrypted with a user password, you must enter the password to decrypt it." },
      { question: "Is it legal to unlock password-protected PDFs?", answer: "You should only unlock files that you own or have explicit authorization to decrypt." },
      { question: "Are my passwords sent to your servers?", answer: "No. Everything, including password verification and decryption, is done in your browser locally. Your passwords never cross the network." }
    ]
  },
  protect: {
    id: "protect",
    title: "Protect PDF - Encrypt PDF with Password Online | PdfPix",
    description: "Encrypt and protect PDF documents with strong passwords online for free. Add encryption and restriction settings securely inside your browser.",
    keywords: "protect pdf, password protect pdf, encrypt pdf, lock pdf file, pdf security online free, secure pdf with password",
    heading: "Password Protect PDF",
    steps: [
      "Upload the PDF file you wish to secure.",
      "Enter and confirm a strong password.",
      "Click 'Protect PDF!' to encrypt the file with high-grade security and download it."
    ],
    faqs: [
      { question: "What level of encryption is used?", answer: "PdfPix utilizes robust industry-standard PDF encryption algorithms to secure your files." },
      { question: "Does this lock editing and printing?", answer: "Yes, password protection blocks unauthorized users from opening, editing, printing, or copying text from your PDF." },
      { question: "Will PdfPix store my password?", answer: "No. Since your file is encrypted locally in your browser, we have no access to your password or your files." }
    ]
  },
  organize: {
    id: "organize",
    title: "Organize PDF Pages - Reorder & Delete Pages Free | PdfPix",
    description: "Organize PDF document pages. Reorder, add, rotate, or delete pages easily. Manage and arrange PDFs online for free in your browser.",
    keywords: "organize pdf, reorder pdf pages, arrange pdf pages, delete pages from pdf, manage pdf files online, pdf page organizer",
    heading: "Organize PDF Document",
    steps: [
      "Drag and drop your PDF file.",
      "Rearrange the pages by dragging them around. Delete pages by clicking the trash icon, or rotate them.",
      "Click 'Organize PDF!' to save the new page arrangement."
    ],
    faqs: [
      { question: "Can I merge other PDFs while organizing pages?", answer: "Yes, you can add additional documents to your workspace and merge, rotate, and sort pages between them." },
      { question: "Is my document contents private?", answer: "Yes, all reordering, rotating, and rendering run locally on your own CPU via Web Assembly." },
      { question: "Can I recover a page I deleted by accident?", answer: "Yes, you can undo deletions before exporting the final file." }
    ]
  },
  crop: {
    id: "crop",
    title: "Crop PDF Online - Crop PDF Margins & Pages Free | PdfPix",
    description: "Crop PDF pages and margins online for free. Define custom crop areas or trim blank margins. Secure browser-based PDF cropping tool.",
    keywords: "crop pdf, crop pdf online, trim pdf margins, crop pdf pages, free pdf cropper, adjust pdf margins",
    heading: "Crop PDF Pages",
    steps: [
      "Select and upload the PDF file you want to crop.",
      "Draw a cropping box over the page or adjust custom margin offsets in the settings panel.",
      "Apply the crop and download your cropped PDF file."
    ],
    faqs: [
      { question: "Can I crop all pages in a PDF at once?", answer: "Yes, you can choose to apply the crop boundary to a single page, a custom page range, or the entire document." },
      { question: "Will cropping reduce my file quality?", answer: "No, cropping simply adjusts the view boundary box of the pages without compressing any images or text." },
      { question: "Is my private data secure?", answer: "Yes, the crop command is executed locally within your browser sandbox." }
    ]
  },
  sign: {
    id: "sign",
    title: "Sign PDF Online - Electronically Sign PDFs Free | PdfPix",
    description: "Fill and sign PDF documents online for free. Draw your signature, type it, or upload an image. Easy, fast, and 100% secure in-browser e-signing.",
    keywords: "sign pdf, e-sign pdf, sign pdf online, write signature on pdf, electronic signature pdf free, sign document online",
    heading: "Sign PDF Document",
    steps: [
      "Upload the document you need to sign.",
      "Create your signature by drawing, typing, or uploading a photo of your handwritten signature.",
      "Place, resize, and position the signature onto the PDF page, then download your signed PDF."
    ],
    faqs: [
      { question: "Are signatures created on PdfPix legally binding?", answer: "PdfPix generates electronic signatures. For many simple agreements, NDAs, and invoices, electronic signatures are legally valid. For high-security transactions, standard digital certificates may be required." },
      { question: "Is my signature image safe?", answer: "Yes, your signature is drawn and placed entirely client-side. We never store or upload your signature or document to any external server." },
      { question: "Can I add text and dates along with my signature?", answer: "Yes, our signing interface allows you to add initials, text boxes, dates, and checkmarks." }
    ]
  },
  repair: {
    id: "repair",
    title: "Repair PDF - Fix Corrupted or Damaged PDF Free | PdfPix",
    description: "Repair damaged, corrupted, or unreadable PDF files online for free. Recover data and rebuild PDF structures securely in your browser.",
    keywords: "repair pdf, fix corrupted pdf, recover pdf file, damaged pdf repair, pdf recovery tool online free",
    heading: "Repair PDF File",
    steps: [
      "Upload the corrupted or damaged PDF file.",
      "Click the 'Repair PDF!' button to start scanning and rebuilding the PDF document structure.",
      "Save the recovered PDF file to your device."
    ],
    faqs: [
      { question: "Can every corrupted PDF be repaired?", answer: "It depends on the severity of the corruption. If the structural metadata is slightly damaged, we can rebuild it. If the entire file is filled with null bytes, full recovery may not be possible." },
      { question: "Does repairing a PDF delete pages?", answer: "No, we try to recover and restore as many pages, tables, and images as possible." },
      { question: "Is this secure for business files?", answer: "Yes, the parsing and reconstruction run locally on your device." }
    ]
  },
  "html-to-pdf": {
    id: "html-to-pdf",
    title: "HTML to PDF Converter - Convert Web Pages to PDF Free | PdfPix",
    description: "Convert HTML files or website web pages to PDF files online for free. Clean rendering and formatting. Secure browser-based converter.",
    keywords: "html to pdf, convert html to pdf, convert webpage to pdf, website to pdf converter online, free html to pdf",
    heading: "Convert HTML to PDF",
    steps: [
      "Upload your HTML file or input a webpage link.",
      "Click 'Convert to PDF' to compile the layout.",
      "Download the rendered PDF document."
    ],
    faqs: [
      { question: "Are CSS styles preserved in the PDF?", answer: "Yes, our converter parses HTML layouts along with inline styles and external CSS stylesheets to maintain formatting." },
      { question: "Can I convert protected/login pages?", answer: "If the page requires cookies or active session states, you should save the page as an HTML file first, and then upload the HTML file here." },
      { question: "Are my HTML files processed securely?", answer: "Yes, all conversion is executed locally on your machine." }
    ]
  },
  "pdf-to-pdfa": {
    id: "pdf-to-pdfa",
    title: "PDF to PDF/A Converter - Long-term Archiving Free | PdfPix",
    description: "Convert standard PDF files to PDF/A format for ISO-compliant long-term archiving online for free. Fast and secure local browser conversion.",
    keywords: "pdf to pdfa, convert pdf to pdf/a, pdf/a archiving, iso compliant pdf, free pdf to pdfa converter",
    heading: "Convert PDF to PDF/A",
    steps: [
      "Upload your standard PDF file.",
      "Select your PDF/A compliance level (e.g., PDF/A-1b or PDF/A-2b).",
      "Click 'Convert to PDF/A' and download the archived output file."
    ],
    faqs: [
      { question: "Why should I convert to PDF/A?", answer: "PDF/A is an ISO-standardized version of the PDF format designed for the digital preservation of electronic documents, embedding all fonts and color spaces for longevity." },
      { question: "Does PDF/A look different?", answer: "Visually, the document will look exactly the same, but structural details are modified to guarantee accessibility and long-term storage readability." },
      { question: "Is this process secure?", answer: "Yes, compliance transformations are executed locally in the browser." }
    ]
  },
  redact: {
    id: "redact",
    title: "Redact PDF Online - Remove Sensitive Information Free | PdfPix",
    description: "Permanently redact and black out sensitive text, numbers, or images in your PDF online for free. Secure, browser-based redaction tool.",
    keywords: "redact pdf, black out pdf text, remove sensitive data pdf, redact document online free, secure pdf redaction",
    heading: "Redact PDF Document",
    steps: [
      "Upload the PDF document containing sensitive information.",
      "Draw black redaction boxes over text, columns, or images you wish to hide.",
      "Click 'Apply Redaction' to permanently delete underlying layers and download the secure file."
    ],
    faqs: [
      { question: "Does this just draw a black box or actually delete the text?", answer: "PdfPix permanently deletes the text and image bytes under the black box, ensuring that it cannot be copied, highlighted, or recovered." },
      { question: "Is my document secure while redacting?", answer: "Yes, since the redaction runs client-side, your unredacted documents never transit over the internet." },
      { question: "Can I redact images as well as text?", answer: "Yes, you can draw a redaction area over any section of the page, including photos and drawings." }
    ]
  },
  compare: {
    id: "compare",
    title: "Compare PDF Files Online - Find Differences Free | PdfPix",
    description: "Compare two PDF documents side by side to highlight visual or text differences online for free. Private in-browser document comparisons.",
    keywords: "compare pdf, compare pdf files, find differences in pdf, diff pdf online, pdf comparison tool free",
    heading: "Compare PDF Files",
    steps: [
      "Upload your original PDF (Version A) and modified PDF (Version B).",
      "Click 'Compare PDFs' to analyze.",
      "View side-by-side differences with highlighted changes and download the report."
    ],
    faqs: [
      { question: "How does the PDF comparison work?", answer: "Our tool checks text characters and layout alignments, highlighting additions in green and deletions in red." },
      { question: "Is my business data safe?", answer: "Yes, the comparison is calculated locally on your own machine." },
      { question: "What formats can be compared?", answer: "We compare standard PDF documents. For best results, compare documents derived from the same source." }
    ]
  },
  scan: {
    id: "scan",
    title: "Scan to PDF - Convert Document Scans to PDF Free | PdfPix",
    description: "Scan pages using your device camera and compile them into a clean PDF document online for free. Secure browser-based mobile scanner.",
    keywords: "scan to pdf, document scanner online, convert scan to pdf, scan papers with camera, free pdf scanner website",
    heading: "Scan to PDF Document",
    steps: [
      "Grant browser access to your device camera.",
      "Snap pictures of your paper documents page by page.",
      "Adjust borders, crop, rotate, and save the scanned pages as a clean PDF."
    ],
    faqs: [
      { question: "Can I scan multiple pages?", answer: "Yes, you can capture multiple images sequentially and combine them into one structured PDF file." },
      { question: "Are my camera shots uploaded to your servers?", answer: "No. The scanner processes your camera frames locally to compile the PDF. Your personal scans stay private." },
      { question: "Does it support border detection?", answer: "Yes, our scanner assists with page detection and cropping overlays." }
    ]
  },
  ocr: {
    id: "ocr",
    title: "OCR PDF Online - Convert Scans to Searchable PDF | PdfPix",
    description: "Recognize text in scanned PDFs and images online for free. Convert scans to searchable and selectable PDFs using OCR. Secure local processing.",
    keywords: "ocr pdf, optical character recognition pdf, extract text from pdf scan, convert scan to searchable pdf free",
    heading: "OCR PDF Document",
    steps: [
      "Upload your scanned PDF document or image file.",
      "Select the language of your document for high accuracy.",
      "Click 'Start OCR' to recognize text layers and download your searchable PDF."
    ],
    faqs: [
      { question: "What is OCR?", answer: "OCR stands for Optical Character Recognition. It detects text characters inside images and scanned pages, generating a searchable text layer." },
      { question: "Which languages are supported?", answer: "We support English, Spanish, French, German, and major international languages." },
      { question: "Is my document secure?", answer: "Yes, OCR computations are handled locally on your device." }
    ]
  },
  summarize: {
    id: "summarize",
    title: "AI PDF Summarizer - Summarize PDF Documents Free | PdfPix",
    description: "Summarize PDF documents using advanced AI technology. Get key insights, bullet points, and abstracts online for free. Secure browser-based processor.",
    keywords: "ai pdf summarizer, summarize pdf, get pdf summary online, pdf reader ai, summarize document free",
    heading: "AI PDF Summarizer",
    steps: [
      "Upload your PDF document.",
      "Select your summary style (bullet points, short abstract, or structured key takeaways).",
      "Click 'Summarize' to generate instant AI-powered insights."
    ],
    faqs: [
      { question: "How does the AI summarizer work?", answer: "The AI parses the textual content of your PDF, identifies primary paragraphs, and condenses them into logical takeaways." },
      { question: "Is there a page count limit?", answer: "We support documents up to a reasonable length depending on memory limits. For very long books, we recommend extracting key sections first." },
      { question: "Is my data privacy protected?", answer: "Yes, document extraction runs locally and the summaries are processed securely." }
    ]
  },
  translate: {
    id: "translate",
    title: "Translate PDF Online - Translate PDF to Any Language | PdfPix",
    description: "Translate your PDF files into Spanish, French, German, Chinese, or any language for free online. Preserves original layout. Secure browser-based tool.",
    keywords: "translate pdf, translate document, pdf translator online, convert pdf language free, translate pdf files online",
    heading: "Translate PDF File",
    steps: [
      "Upload your PDF file.",
      "Choose the target language you want to translate your document into.",
      "Click 'Translate PDF' to generate the translated document while keeping your design intact."
    ],
    faqs: [
      { question: "Will the PDF layout be preserved?", answer: "Yes, our translator maps target translations back onto original text coordinates, maintaining images and column grids." },
      { question: "Are all languages supported?", answer: "We support over 50 major international languages for translation." },
      { question: "Is my file confidential?", answer: "Yes, all parsing and positioning are computed on your device." }
    ]
  },
  forms: {
    id: "forms",
    title: "Fill & Edit PDF Forms Online Free - Form Filler | PdfPix",
    description: "Fill out and sign PDF forms online for free. Type text into fields, check boxes, and add your signature. Secure browser-based PDF form filler.",
    keywords: "fill pdf forms, pdf form filler, edit pdf forms online, write on pdf form free, digital form filler online",
    heading: "Fill PDF Forms",
    steps: [
      "Upload your interactive or static PDF form.",
      "Click on interactive text fields, checkmarks, or radio buttons to fill them out.",
      "Add signatures or extra text fields if needed, then save the completed form."
    ],
    faqs: [
      { question: "Does this support interactive form fields?", answer: "Yes, PdfPix detects native PDF interactive form fields, checkboxes, drop-downs, and text inputs." },
      { question: "Can I sign the form after filling it?", answer: "Yes, our signature tool is built right into the interface so you can fill and sign in one go." },
      { question: "Are my form inputs saved securely?", answer: "Yes, all data entry happens locally in your browser. No server captures your filled inputs." }
    ]
  },

  // Fallbacks for content pages
  about: {
    id: "about",
    title: "About Us - UTHAKKAN & Founder Ajmal U K | PdfPix",
    description: "Discover UTHAKKAN, the technology product brand by Ajmal U K behind PdfPix, and explore our ecosystem of AI tools, games, and digital products.",
    keywords: "uthakkan, ajmal u k, founder uthakkan, about pdfpix, tech startup kerala, toolpix, kallancop",
    heading: "About UTHAKKAN & PdfPix",
    steps: [],
    faqs: []
  },
  contact: {
    id: "contact",
    title: "Contact Us - PdfPix Support & Feedback",
    description: "Get in touch with the PdfPix team. Send support requests, feedback, feature suggestions, or business inquiries.",
    keywords: "contact pdfpix, support pdfpix, feedback, customer service",
    heading: "Contact Us",
    steps: [],
    faqs: []
  },
  pricing: {
    id: "pricing",
    title: "Simple Pricing - 100% Free Forever - PdfPix",
    description: "PdfPix is and will always be 100% free. No subscriptions, no registration, no limits. Find out how we keep our tools free and secure.",
    keywords: "pdfpix pricing, free pdf editor, free pdf tools, no subscription converter",
    heading: "Pricing Plans",
    steps: [],
    faqs: []
  },
  privacy: {
    id: "privacy",
    title: "Privacy Policy - Secure Local PDF Processing - PdfPix",
    description: "Read the PdfPix privacy policy. Learn how our browser-based local file conversion guarantees that your documents never leave your computer.",
    keywords: "privacy policy, data security, local processing, gdpr compliance",
    heading: "Privacy Policy",
    steps: [],
    faqs: []
  },
  terms: {
    id: "terms",
    title: "Terms of Service - PdfPix",
    description: "Read the Terms of Service for using PdfPix. Understand our free-to-use policies, local execution licenses, and user terms.",
    keywords: "terms of service, terms of use, legal agreement, user terms",
    heading: "Terms of Service",
    steps: [],
    faqs: []
  },
  sponsor: {
    id: "sponsor",
    title: "GitHub Sponsors - Support Open-Source | PdfPix",
    description: "Support our open-source milestones and sponsor our software development directly via GitHub Sponsors. Perfect for recurring and official project support.",
    keywords: "sponsor, github sponsors, open source support, support software creator, uthakkan, pdfpix development",
    heading: "GitHub Sponsors",
    steps: [],
    faqs: []
  },
  donate: {
    id: "donate",
    title: "Buy Me a Coffee - Micro-Donations | PdfPix",
    description: "Support our project with a flexible micro-contribution. Buy me a coffee to keep the development momentum going and our tools 100% free.",
    keywords: "donate, buy me a coffee, micro donation, support creator, support pdfpix",
    heading: "Buy Me a Coffee",
    steps: [],
    faqs: []
  },
  founder: {
    id: "founder",
    title: "Muhammed Ajmal U K - Founder Spotlight | PdfPix",
    description: "Meet Muhammed Ajmal U K, the software engineer and founder of UTHAKKAN behind PdfPix. Explore his digital portfolio, skills, and background.",
    keywords: "founder pdfpix, muhammed ajmal u k, uthakkan owner, kerala developer, toolpix creator, joyful builder",
    heading: "About the Founder",
    steps: [],
    faqs: []
  }
};

export function getMetadataForTool(id: string): Metadata {
  const data = seoData[id];

  if (!data) {
    return {
      title: `${SITE_NAME} | Free PDF Tools Online`,
      description:
        "PdfPix is a free, browser-based suite of PDF tools for merging, splitting, compressing, converting, and editing files.",
      metadataBase: new URL(SITE_URL),
    };
  }

  const pagePath = getPathForSeoId(id) ?? "/";
  const canonicalUrl = getCanonicalUrl(pagePath);

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: data.title,
      description: data.description,
      siteName: SITE_NAME,
      type: "website",
      url: canonicalUrl,
      images: [
        {
          url: SITE_OG_IMAGE,
          width: SITE_OG_IMAGE_WIDTH,
          height: SITE_OG_IMAGE_HEIGHT,
          alt: `${data.heading} on ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: [SITE_OG_IMAGE],
    },
  };
}
