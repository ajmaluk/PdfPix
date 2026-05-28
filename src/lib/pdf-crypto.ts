"use client";

async function getKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await (crypto.subtle.importKey as any)(
    "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
  );
  return (crypto.subtle.deriveKey as any)(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptPDF(
  pdfBytes: ArrayBuffer,
  password: string
): Promise<Blob> {
  const salt = new Uint8Array(crypto.getRandomValues(new Uint8Array(16)));
  const iv = new Uint8Array(crypto.getRandomValues(new Uint8Array(12)));
  const key = await getKey(password, salt);
  const encrypted = await (crypto.subtle.encrypt as any)(
    { name: "AES-GCM", iv }, key, pdfBytes
  );
  const header = new Uint8Array([0x50, 0x44, 0x46, 0x58]);
  const enc = new Uint8Array(encrypted);
  const combined = new Uint8Array(header.length + salt.length + iv.length + enc.length);
  combined.set(header, 0);
  combined.set(salt, header.length);
  combined.set(iv, header.length + salt.length);
  combined.set(enc, header.length + salt.length + iv.length);
  return new Blob([combined], { type: "application/octet-stream" });
}

export async function decryptPDF(
  data: ArrayBuffer,
  password: string
): Promise<ArrayBuffer> {
  const bytes = new Uint8Array(data);
  const header = bytes.slice(0, 4);
  if (header[0] !== 0x50 || header[1] !== 0x44 || header[2] !== 0x46 || header[3] !== 0x58) {
    throw new Error("Invalid encrypted PDF format");
  }
  const salt = new Uint8Array(bytes.slice(4, 20));
  const iv = new Uint8Array(bytes.slice(20, 32));
  const encrypted = bytes.slice(32);
  const key = await getKey(password, salt);
  const decrypted = await (crypto.subtle.decrypt as any)(
    { name: "AES-GCM", iv }, key, encrypted
  );
  return decrypted;
}
