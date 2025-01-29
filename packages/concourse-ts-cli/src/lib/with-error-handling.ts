import VError from "verror";
import clean_stack from "clean-stack";

const traverse = (err: VError | Error, lines: string[] = []) => {
  lines.push(err.message);

  const cause = 'cause' in err ? err.cause() : null;

  if (cause) {
    traverse(cause, lines)
  } else {
    lines[lines.length - 1] += '\n';
    lines[lines.length - 1] += clean_stack(err.stack ?? '', {
      basePath: process.cwd(),
    }).split('\n').slice(1).join('\n');
  }

  return lines.join('\n\n');
};

export const with_error_handling = async (callback: () => Promise<void> | void) => {
  try {
    await callback();
  } catch (error) {
    if (error instanceof Error) {
      process.exitCode = 1;
      console.error(traverse(error));
    } else {
      process.exitCode = 2;
      console.error(error);
    }
  }
}
