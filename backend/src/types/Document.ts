export interface Document {
  id: string;
  module: string;
  text: string;
}

export interface EmbeddedDocument extends Document {
  embedding: number[];
}

