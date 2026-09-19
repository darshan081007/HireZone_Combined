import JSZip from 'jszip';

export async function generateStudentPortalZip(): Promise<Blob> {
  try {
    const response = await fetch('/api/export-project-zip');
    if (response.ok) {
      return await response.blob();
    }
  } catch (serverZipErr) {
    console.warn('Server zip endpoint unreachable, generating client bundle:', serverZipErr);
  }

  // Fallback in-memory bundle
  const zip = new JSZip();
  const root = zip.folder('HireZone_Student_Final');
  if (!root) throw new Error('Could not initialize zip folder');

  root.file(
    'package.json',
    JSON.stringify(
      {
        name: 'hirezone-student-portal',
        version: '1.0.0',
        private: true,
        type: 'module',
        scripts: {
          dev: 'tsx server.ts',
          build: 'vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs',
          start: 'node dist/server.cjs',
          lint: 'tsc --noEmit',
        },
        dependencies: {
          '@google/genai': '^2.4.0',
          '@supabase/supabase-js': '^2.49.1',
          cors: '^2.8.5',
          dotenv: '^17.2.3',
          express: '^4.21.2',
          'lucide-react': '^0.546.0',
          motion: '^12.23.24',
          react: '^19.0.1',
          'react-dom': '^19.0.1',
          vite: '^6.2.3',
        },
        devDependencies: {
          '@tailwindcss/vite': '^4.1.14',
          '@types/cors': '^2.8.17',
          '@types/express': '^4.17.21',
          '@types/node': '^22.14.0',
          '@vitejs/plugin-react': '^5.0.4',
          esbuild: '^0.25.0',
          tailwindcss: '^4.1.14',
          tsx: '^4.21.0',
          typescript: '~5.8.2',
        },
      },
      null,
      2
    )
  );

  root.file(
    '.env.example',
    `# GEMINI_API_KEY: Required for AI evaluation of descriptive submissions
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase PostgreSQL Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

PORT=3000
`
  );

  root.file(
    'SETUP.md',
    `# HIREZONE — Student Portal Setup Guide (Windows PowerShell)

## 1. Prerequisites
- Node.js 18+ (LTS)
- npm 9+
- Windows 10/11 with PowerShell

## 2. Quick Start Commands
\`\`\`powershell
# In PowerShell, enter the unzipped project folder:
cd .\\HireZone_Student_Final

# Install dependencies
npm install

# Set up environment variables
Copy-Item .env.example .env

# Start development fullstack server (Express + Vite)
npm run dev
\`\`\`
Visit http://localhost:3000 in your browser!
`
  );

  const supabaseFolder = root.folder('supabase');
  if (supabaseFolder) {
    supabaseFolder.file(
      'schema.sql',
      `-- See root project supabase/schema.sql for the complete 12-table PostgreSQL schema for Student, Recruiter, and Government portals.`
    );
  }

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename = 'HireZone_Student_Final.zip') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
