import { URL } from 'url';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
// Also check parent dir
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.log('DATABASE_URL is entirely missing from env.');
  process.exit(1);
}

try {
  const parsed = new URL(dbUrl);
  console.log(`Protocol: ${parsed.protocol}`);
  console.log(`Username exists: ${!!parsed.username}`);
  console.log(`Password exists: ${!!parsed.password}`);
  console.log(`Host: ${parsed.host}`);
  console.log(`Pathname: ${parsed.pathname}`);
  console.log(`Search params: ${parsed.search}`);
} catch (e) {
  console.log('Failed to parse DATABASE_URL as a standard URL:', e.message);
}
