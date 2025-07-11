interface CodePositionIndicatorProps {
  code: string;
  currentPosition: number;
  isStepping: boolean;
}

export default function CodePositionIndicator({
  code,
  currentPosition,
  isStepping
}: CodePositionIndicatorProps) {
  if (!isStepping || currentPosition >= code.length) {
    return null;
  }

  const currentChar = code[currentPosition];
  const prevChars = code.slice(Math.max(0, currentPosition - 10), currentPosition);
  const nextChars = code.slice(currentPosition + 1, currentPosition + 11);

  return (
    <div class="bg-[#1a2e2a] rounded-2xl p-4 mb-4">
      <div class="text-sm text-[#b2cfc7] mb-2">Code Position</div>
      <div class="font-mono text-sm">
        <span class="text-[#8ca39a]">{prevChars}</span>
        <span class="bg-green-500 text-black px-1 rounded font-bold">{currentChar}</span>
        <span class="text-[#8ca39a]">{nextChars}</span>
      </div>
      <div class="text-xs text-[#8ca39a] mt-1">
        Position: {currentPosition + 1} / {code.length}
        {currentChar && ` (${currentChar})`}
      </div>
    </div>
  );
} 