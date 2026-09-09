import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const SQLCMD_ARGS = [
  '-S', 'DESKTOP-S6VR4T8\\SQLEXPRESS',
  '-U', 'sa',
  '-P', 'Megustaelplay4',
  '-d', 'efluvio',
  '-y', '0',
  '-Y', '0'
];

function cleanSqlOutput(output) {
  const lines = output.trim().split('\n');
  const jsonLines = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      jsonLines.push(trimmed);
    }
  }
  return jsonLines.join('').trim();
}

export const queryJSON = async (sqlQuery) => {
  const cleanQuery = sqlQuery.replace(/;\s*$/, '');
  const wrapped = `SET QUOTED_IDENTIFIER ON; SET NOCOUNT ON; ${cleanQuery} FOR JSON PATH, INCLUDE_NULL_VALUES`;
  try {
    const { stdout } = await execFileAsync('sqlcmd', [...SQLCMD_ARGS, '-Q', wrapped], {
      maxBuffer: 1024 * 1024 * 20,
      encoding: 'utf8'
    });

    const cleaned = cleanSqlOutput(stdout);
    if (!cleaned || cleaned === 'NULL' || cleaned === '') {
      return [];
    }

    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Error executing queryJSON:', error.message);
    const out = error.stdout || 'No stdout';
    const err = error.stderr || 'No stderr';
    console.error('Stderr:', err);
    console.error('Stdout:', out);
    throw error;
  }
};

export const executeSQL = async (sqlStatement) => {
  try {
    const wrapped = `SET QUOTED_IDENTIFIER ON; SET NOCOUNT ON;\n${sqlStatement}`;
    const { stdout } = await execFileAsync('sqlcmd', [...SQLCMD_ARGS, '-Q', wrapped], {
      maxBuffer: 1024 * 1024 * 20,
      encoding: 'utf8'
    });
    return stdout.trim();
  } catch (error) {
    console.error('Error executing executeSQL:', error.message);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const res = await queryJSON('SELECT @@SERVERNAME as server, DB_NAME() as db');
    return { ok: true, data: res[0] };
  } catch (e) {
    return { ok: false, error: e.message };
  }
};
