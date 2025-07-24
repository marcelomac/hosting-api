import path from 'path';

export function debugLog(
  variableName: string,
  variableValue: any,
  showThis?: boolean,
): void {
  const debug = process.env.DEBUG === 'true' ? true : false;

  if (debug || showThis) {
    console.log('-'.repeat(50));

    const stack = new Error().stack;
    if (!stack) {
      console.log('Stack trace is not available');
      return;
    }

    const value =
      typeof variableValue === 'object' && variableValue !== null
        ? `${JSON.stringify(variableValue, null, 2)}`
        : variableValue;

    const stackLines = stack.split('\n');
    // The first line is the error message, the second line is the current function
    // The third line is the caller of the current function
    const callerLine = stackLines[2];

    // Extract the file path, line number and column number from the caller line
    const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
    if (match && match[1] && match[2] && match[3]) {
      const fullPath = match[1];
      const lineNumber = match[2];
      const columnNumber = match[3];
      const relativePath = path.relative(process.cwd(), fullPath);
      console.log(
        `${variableName}: ${value} - ${relativePath} (line: ${lineNumber}, column: ${columnNumber})`,
      );
    } else {
      console.log(
        `${variableName}: ${variableValue} - Could not determine the file path from the stack trace`,
      );
    }
  }
}
