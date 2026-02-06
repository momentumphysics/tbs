/**
 * Compresses an image file to AVIF format with strict size limit (to fit D1's 1MB limit).
 * @param {File} file - The original image file.
 * @returns {Promise<File>} - A promise that resolves to the compressed AVIF file.
 */
export const compressImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Picflow Style: High Quality Web Optimization
                // Limit: 1MB (D1 Constraint)
                const MAX_SIZE_BYTES = 900 * 1024; // 900KB safety margin

                // Picflow recommends 3840px (4K) for high-res web display
                const MAX_DIMENSION = 3840;
                let quality = 0.85; // Start with high quality

                // 1. Smart Initial Resize (Downscale to 4K if huge, keeps ratio)
                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    const ratio = width / height;
                    if (width > height) {
                        width = MAX_DIMENSION;
                        height = Math.round(width / ratio);
                    } else {
                        height = MAX_DIMENSION;
                        width = Math.round(height * ratio);
                    }
                }

                const attemptCompression = (w, h, q) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    // Use 'high' quality for image smoothing (Picflow standard)
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, w, h);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            if (blob.size > MAX_SIZE_BYTES) {
                                console.log(`Image too big (${(blob.size / 1024).toFixed(2)}KB). Optimization needed.`);

                                // Smart Optimization Strategy:
                                // 1. Reduce quality down to a reasonable "Good" level (0.6)
                                // 2. If that fails, reduce resolution but BOOST quality back up
                                // This technique favors "Crisp & Smaller" over "Blurry & Big"

                                let newQuality = q;
                                let newWidth = w;
                                let newHeight = h;

                                if (q > 0.6) {
                                    // Step 1: Reduce quality
                                    newQuality = q - 0.1;
                                } else {
                                    // Step 2: Quality is at limit, Resize to maintain sharpness
                                    newWidth = Math.round(w * 0.8); // 20% reduction
                                    newHeight = Math.round(h * 0.8);
                                    newQuality = 0.85; // Reset quality to High for the new size
                                }

                                console.log(`Retrying at ${newWidth}x${newHeight}, Q=${newQuality.toFixed(2)}`);

                                if (newWidth < 300) {
                                    reject(new Error("Unable to compress image below limit."));
                                } else {
                                    attemptCompression(newWidth, newHeight, newQuality);
                                }
                            } else {
                                // Success
                                console.log(`Compression success: ${(blob.size / 1024).toFixed(2)}KB`);
                                const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".avif", {
                                    type: 'image/avif',
                                    lastModified: Date.now()
                                });
                                resolve(newFile);
                            }
                        } else {
                            // Fallback to WebP if AVIF fails
                            canvas.toBlob((blobWebp) => {
                                if (blobWebp && blobWebp.size <= MAX_SIZE_BYTES) {
                                    const newFileWebp = new File([blobWebp], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                                        type: 'image/webp',
                                        lastModified: Date.now()
                                    });
                                    resolve(newFileWebp);
                                } else {
                                    // Simple fallback if even webp is huge (unlikely with reduction loop) or fails
                                    reject(new Error('Image compression failed or too large'));
                                }
                            }, 'image/webp', 0.5);
                        }
                    }, 'image/avif', q);
                };

                attemptCompression(width, height, quality);
            };

            img.onerror = (err) => reject(err);
        };

        reader.onerror = (err) => reject(err);
    });
};
