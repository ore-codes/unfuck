import { useState } from 'preact/hooks';

interface ExampleCodeBlockProps {
  code: string;
  title: string;
  description: string;
  input?: string;
  output?: string;
  actualInput?: string;
}

export default function ExampleCodeBlock({
  code,
  title,
  description,
  input = "",
  output = "",
  actualInput,
}: ExampleCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const tryItOut = () => {
    // Store the code in localStorage so the main page can access it
    localStorage.setItem('brainfuck-example-code', code);
    localStorage.setItem('brainfuck-example-input', actualInput || input);
    window.location.href = '/';
  };

  return (
    <div class="bg-[#1a2e2a] rounded-2xl p-6">
      <h3 class="text-xl font-bold mb-3 text-[#7fffd4]">{title}</h3>
      <p class="mb-3 text-[#b2cfc7]">{description}</p>

      <div class="bg-[#0f1f1c] rounded-lg p-4 mb-3 overflow-x-auto">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs text-[#8ca39a]">Code:</span>
          <div class="flex gap-2">
            <button
              onClick={copyToClipboard}
              class="px-3 py-1 text-xs bg-[#25413d] text-white rounded hover:bg-[#2e5c54] transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={tryItOut}
              class="px-3 py-1 text-xs bg-primary text-bg rounded hover:brightness-110 transition-colors"
            >
              Try it out
            </button>
          </div>
        </div>
        <code class="text-[#7fffd4] font-mono text-sm break-all">{code}</code>
      </div>

      {input && (
        <p class="text-sm text-[#8ca39a] mb-1">
          <span class="text-[#b2cfc7]">Input:</span> {input}
        </p>
      )}
      {output && (
        <p class="text-sm text-[#8ca39a]">
          <span class="text-[#b2cfc7]">Output:</span> {output}
        </p>
      )}
    </div>
  );
} 