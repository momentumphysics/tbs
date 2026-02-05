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

                // D1 has a strict statement limit of 1MB. We aim for < 900KB to be safe.
                const MAX_SIZE_BYTES = 900 * 1024;
                let quality = 0.5;
                const MAX_DIMENSION = 1600; // Start with a reasonable max dimension

                // Initial resize logic
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
                    ctx.drawImage(img, 0, 0, w, h);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            if (blob.size > MAX_SIZE_BYTES) {
                                // If still too big, scale down dimensions and reduce quality slightly
                                const newWidth = Math.round(w * 0.8);
                                const newHeight = Math.round(h * 0.8);
                                const newQuality = Math.max(0.3, q - 0.1);

                                console.log(`Image too big (${(blob.size / 1024).toFixed(2)}KB). Retrying at ${newWidth}x${newHeight}, Q=${newQuality.toFixed(2)}`);

                                if (newWidth < 300) { // Safety break
                                    reject(new Error("Unable to compress image below limit without destroying quality."));
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
