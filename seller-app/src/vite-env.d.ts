

interface ImportMetaEnv {
  readonly VITE_AUTH_SERVICE?: string;
  readonly VITE_PRODUCT_SERVICE?: string;
  readonly VITE_ORDER_SERVICE?: string;
  readonly VITE_CATEGORY_SERVICE?: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
