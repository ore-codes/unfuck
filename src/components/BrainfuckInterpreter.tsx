import { useState, useEffect } from 'preact/hooks';
import { brainfuckInterpret, createInitialMemoryState, stepBrainfuck, type MemoryState } from '../lib/interpret';
import MemoryVisualization from './MemoryVisualization';
import CodePositionIndicator from './CodePositionIndicator';

export default function BrainfuckInterpreter() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isStepping, setIsStepping] = useState(false);
  const [memoryState, setMemoryState] = useState<MemoryState>(createInitialMemoryState());

  const runProgram = () => {
    try {
      if (!code.trim()) {
        alert('Please enter some Brainfuck code');
        return;
      }

      const result = brainfuckInterpret(code, input);
      setOutput(result);
      resetMemoryState();
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    }
  };

  const stepProgram = () => {
    if (!isStepping) {
      // Start stepping mode
      setMemoryState(createInitialMemoryState());
      setIsStepping(true);
    }

    if (memoryState.codePtr >= code.length) {
      // Program finished
      setOutput(memoryState.output);
      setIsStepping(false);
      return;
    }

    try {
      const newState = stepBrainfuck(code, input, memoryState);
      setMemoryState(newState);
    } catch (error) {
      alert('Error: ' + (error as Error).message);
      setIsStepping(false);
    }
  };

  const resetProgram = () => {
    setCode('');
    setInput('');
    setOutput('');
    setIsStepping(false);
    resetMemoryState();
  };

  const resetMemoryState = () => {
    setMemoryState(createInitialMemoryState());
  };

  useEffect(() => {
    const exampleCode = localStorage.getItem('brainfuck-example-code');
    const exampleInput = localStorage.getItem('brainfuck-example-input');

    if (exampleCode) {
      setCode(exampleCode);
      if (exampleInput) {
        setInput(exampleInput);
      }
      localStorage.removeItem('brainfuck-example-code');
      localStorage.removeItem('brainfuck-example-input');
    }
  }, []);

  return (
    <div class="min-h-screen flex flex-col">
      <main class="flex flex-col lg:flex-row flex-1 px-8 py-10 gap-12">
        <section class="flex-1 w-full lg:max-w-xl mx-auto flex flex-col gap-8">
          <div>
            <h1 class="text-3xl font-bold mb-4">Brainfuck Interpreter</h1>
            <textarea
              value={code}
              onInput={(e) => setCode((e.target as HTMLTextAreaElement).value)}
              class="input h-32 resize-none"
              placeholder="Enter your Brainfuck code here..."></textarea>
          </div>
          <div>
            <div class="font-bold mb-2 text-lg">Input</div>
            <input
              value={input}
              onInput={(e) => setInput((e.target as HTMLInputElement).value)}
              class="input"
              placeholder="Enter input for the program..."
            />
          </div>
          <div>
            <div class="font-bold mb-2 text-lg">Output</div>
            <div class="input h-32">{output}</div>
          </div>
          <div class="flex gap-4 mt-2">
            <button
              onClick={runProgram}
              class="w-full py-3 rounded-full text-lg font-bold bg-primary text-bg hover:brightness-110 transition"
            >Run</button
            >
            <button
              onClick={stepProgram}
              disabled={isStepping && memoryState.codePtr >= code.length}
              class={`w-full py-3 rounded-full text-lg font-bold transition ${isStepping && memoryState.codePtr >= code.length
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-[#25413d] text-white hover:bg-[#2e5c54]'
                }`}
            >{isStepping ? 'Continue' : 'Step'}</button
            >
            <button
              onClick={resetProgram}
              class="w-full py-3 rounded-full text-lg font-bold bg-[#25413d] text-white hover:bg-[#2e5c54] transition"
            >Reset</button
            >
          </div>
        </section>
        <aside class="lg:w-2xl flex flex-col gap-8">
          <CodePositionIndicator
            code={code}
            currentPosition={memoryState.codePtr}
            isStepping={isStepping}
          />
          <MemoryVisualization memoryState={memoryState} />
        </aside>
      </main>
    </div>
  );
} 