import { Document } from '../types/Document';
import { config } from '../config';
import * as fs from 'fs';
import * as path from 'path';

export async function loadDataset(): Promise<Document[]> {
  const datasetPath = path.resolve(__dirname, '../../', config.datasetFile);
  
  if (!fs.existsSync(datasetPath)) {
    throw new Error(`Dataset file not found at ${datasetPath}`);
  }

  const fileContent = fs.readFileSync(datasetPath, 'utf-8');
  const documents: Document[] = JSON.parse(fileContent);
  
  return documents;
}


