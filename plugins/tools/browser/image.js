export const supportsWebp = (function () {
  try {
    return document.createElement('canvas').
      toDataURL('image/webp', 0.1)
      .indexOf('data:image/webp') === 0;
  } catch (err) {
    return false;
  }
})();
