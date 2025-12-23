
export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DetectedProduct {
  id: string;
  label: string;
  box: BoundingBox;
  shoppingUrl: string;
  confidence: number;
}

export interface DetectionResult {
  products: DetectedProduct[];
}
