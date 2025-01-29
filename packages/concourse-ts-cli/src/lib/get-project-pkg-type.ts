import path from 'node:path';
import VError from 'verror';

export const get_project_pkg_type = async (tsconfig_path?: string): Promise<string | null> => {
  const project_root = tsconfig_path ? path.dirname(tsconfig_path) : process.cwd();
  const package_json_path = path.resolve(project_root, 'package.json');

  try {
    const package_json = await import(package_json_path);

    if (!package_json.type) {
      throw new VError('The project must have a "type" field in its package.json');
    }

    return package_json.type;
  } catch (error) {
    if (error instanceof Error) {
      throw new VError(error, `Cannot determine package type: "${package_json_path}"`);
    }

    throw new VError(error, `Failed to read package.json: ${package_json_path}`);
  }
}
