export function brainfuckInterpret(code: string, inputData: string = ""): { output: string; memoryState: MemoryState } {
  // Uses 30,000 memory cells, initialized to 0
  const data = new Uint8Array(30000);
  let dataPtr = 0;
  let codePtr = 0;
  const output: string[] = [];
  const inputList = inputData.split('').map(char => char.charCodeAt(0));
  let inputPtr = 0;

  // Main interpretation loop
  while (codePtr < code.length) {
    const command = code[codePtr];
    switch (command) {
      case '>':
        dataPtr++;
        if (dataPtr >= data.length) {
          console.warn("Warning: Data pointer exceeded initial tape size. Behavior might be undefined.");
        }
        break;
      case '<':
        dataPtr--;
        if (dataPtr < 0) {
          throw new Error("Data pointer went below zero.");
        }
        break;
      case '+':
        data[dataPtr] = (data[dataPtr] + 1) % 256;
        break;
      case '-':
        data[dataPtr] = (data[dataPtr] - 1 + 256) % 256;
        break;
      case '.':
        output.push(String.fromCharCode(data[dataPtr]));
        break;
      case ',':
        if (inputPtr < inputList.length) {
          data[dataPtr] = inputList[inputPtr];
          inputPtr++;
        } else {
          data[dataPtr] = 0;
        }
        break;
      case '[':
        if (data[dataPtr] === 0) {
          let openBrackets = 1;
          while (openBrackets > 0) {
            codePtr++;
            if (codePtr >= code.length) {
              throw new Error("Unmatched '[' bracket.");
            }
            if (code[codePtr] === '[') {
              openBrackets++;
            } else if (code[codePtr] === ']') {
              openBrackets--;
            }
          }
        }
        break;
      case ']':
        if (data[dataPtr] !== 0) {
          let closeBrackets = 1;
          while (closeBrackets > 0) {
            codePtr--;
            if (codePtr < 0) {
              throw new Error("Unmatched ']' bracket.");
            }
            if (code[codePtr] === ']') {
              closeBrackets++;
            } else if (code[codePtr] === '[') {
              closeBrackets--;
            }
          }
        }
        break;
      // Ignore any other characters in the code (Brainfuck convention)
    }
    codePtr++;
  }

  // Return both output and memory state
  return {
    output: output.join(''),
    memoryState: {
      data,
      dataPtr,
      codePtr,
      inputPtr,
      output: output.join('')
    }
  };
}

export interface MemoryState {
  data: Uint8Array;
  dataPtr: number;
  codePtr: number;
  inputPtr: number;
  output: string;
}

export function createInitialMemoryState(): MemoryState {
  return {
    data: new Uint8Array(30000),
    dataPtr: 0,
    codePtr: 0,
    inputPtr: 0,
    output: ''
  };
}

export function stepBrainfuck(
  code: string,
  input: string,
  memoryState: MemoryState
): MemoryState {
  const newState = {
    ...memoryState,
    data: new Uint8Array(memoryState.data) // Create a copy of the Uint8Array
  };

  if (newState.codePtr >= code.length) {
    return newState; // Program finished
  }

  const command = code[newState.codePtr];

  switch (command) {
    case '>':
      newState.dataPtr++;
      if (newState.dataPtr >= newState.data.length) {
        console.warn("Warning: Data pointer exceeded initial tape size.");
      }
      break;
    case '<':
      newState.dataPtr--;
      if (newState.dataPtr < 0) {
        throw new Error("Data pointer went below zero.");
      }
      break;
    case '+':
      newState.data[newState.dataPtr] = (newState.data[newState.dataPtr] + 1) % 256;
      break;
    case '-':
      newState.data[newState.dataPtr] = (newState.data[newState.dataPtr] - 1 + 256) % 256;
      break;
    case '.':
      newState.output += String.fromCharCode(newState.data[newState.dataPtr]);
      break;
    case ',':
      if (newState.inputPtr < input.length) {
        newState.data[newState.dataPtr] = input.charCodeAt(newState.inputPtr);
        newState.inputPtr++;
      } else {
        newState.data[newState.dataPtr] = 0;
      }
      break;
    case '[':
      if (newState.data[newState.dataPtr] === 0) {
        let openBrackets = 1;
        while (openBrackets > 0) {
          newState.codePtr++;
          if (newState.codePtr >= code.length) {
            throw new Error("Unmatched '[' bracket.");
          }
          if (code[newState.codePtr] === '[') {
            openBrackets++;
          } else if (code[newState.codePtr] === ']') {
            openBrackets--;
          }
        }
      }
      break;
    case ']':
      if (newState.data[newState.dataPtr] !== 0) {
        let closeBrackets = 1;
        while (closeBrackets > 0) {
          newState.codePtr--;
          if (newState.codePtr < 0) {
            throw new Error("Unmatched ']' bracket.");
          }
          if (code[newState.codePtr] === ']') {
            closeBrackets++;
          } else if (code[newState.codePtr] === '[') {
            closeBrackets--;
          }
        }
      }
      break;
  }

  newState.codePtr++;
  return newState;
} 