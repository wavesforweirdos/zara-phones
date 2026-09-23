// Shapes returned by the API (GET /products and GET /products/:id)

export interface PhoneSummary {
  id: string;
  brand: string;
  name: string;
  basePrice: number;
  imageUrl: string;
}

export interface Swatch {
  name: string;
  hexCode: string;
}

export interface ColorOption extends Swatch {
  imageUrl: string;
}

export interface StorageOption {
  capacity: string;
  price: number;
}

export interface PhoneSpecs {
  screen?: string;
  resolution?: string;
  processor?: string;
  mainCamera?: string;
  selfieCamera?: string;
  battery?: string;
  os?: string;
  screenRefreshRate?: string;
}

export interface PhoneDetail extends PhoneSummary {
  description: string;
  rating: number;
  specs: PhoneSpecs;
  colorOptions: ColorOption[];
  storageOptions: StorageOption[];
  similarProducts: PhoneSummary[];
}
