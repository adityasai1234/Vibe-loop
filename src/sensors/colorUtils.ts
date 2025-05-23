import ColorThief from "color-thief-browser";

/** Returns [r,g,b] dominant colour */
export async function getDominantRGB(imageUrl: string): Promise<[number, number, number]> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  
  // Convert relative URLs to absolute URLs
  const absoluteUrl = imageUrl.startsWith('http') ? imageUrl : 
    imageUrl.startsWith('/') ? `${window.location.origin}${imageUrl}` : 
    `${window.location.origin}/${imageUrl}`;
  
  img.src = absoluteUrl;
  await img.decode();

  const thief = new ColorThief();
  return thief.getColor(img) as [number, number, number];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  } else s = 0;
  return [h, s, l];
}

/** Blend raw RGB with mood tag to produce final CSS gradient */
export function gradientFrom(rgb: [number, number, number], mood = ""): string {
  let [h, s, l] = rgbToHsl(...rgb);      // h 0–360
  // simple hue/brightness tweak by mood
  if (/edm/i.test(mood)) h = (h + 40) % 360;          // push to neon
  if (/lo-fi|chill/i.test(mood)) l = Math.min(l + 0.1, 1); // warmer
  const color1 = `hsl(${h}deg ${Math.round(s*100)}% ${Math.round(l*70)}%)`;
  const color2 = `hsl(${h}deg ${Math.round(s*100)}% ${Math.round(l*30)}%)`;
  return `linear-gradient(135deg, ${color1}, ${color2})`;
}
