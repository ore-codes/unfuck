import type { MemoryState } from '../lib/interpret';

interface MemoryVisualizationProps {
  memoryState: MemoryState;
  visibleCells?: number;
}

export default function MemoryVisualization({
  memoryState,
  visibleCells = 20
}: MemoryVisualizationProps) {
  const getVisibleMemoryCells = () => {
    const startIndex = Math.max(0, memoryState.dataPtr - Math.floor(visibleCells / 2));
    const endIndex = Math.min(memoryState.data.length, startIndex + visibleCells);

    const cells = [];
    for (let i = startIndex; i < endIndex; i++) {
      cells.push({
        index: i,
        value: memoryState.data[i],
        isCurrent: i === memoryState.dataPtr
      });
    }
    return cells;
  };

  const visibleCellsData = getVisibleMemoryCells();

  return (
    <div>
      <div class="font-bold text-xl mb-4">Memory Visualization</div>
      <div class="bg-[#1a2e2a] rounded-2xl p-6 flex flex-col gap-4">
        <div class="text-sm text-[#b2cfc7] mb-2">
          Current Pointer: <span class="text-green-500 font-bold">{memoryState.dataPtr}</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[#25413d]">
                <th class="text-left py-2 px-3 text-[#b2cfc7]">Cell</th>
                <th class="text-left py-2 px-3 text-[#b2cfc7]">Value</th>
                <th class="text-left py-2 px-3 text-[#b2cfc7]">ASCII</th>
                <th class="text-left py-2 px-3 text-[#b2cfc7]">Binary</th>
              </tr>
            </thead>
            <tbody>
              {visibleCellsData.map((cell) => (
                <tr
                  key={cell.index}
                  class={`border-b border-[#22322f] hover:bg-[#25413d] transition-colors ${cell.isCurrent ? 'bg-green-500/20 border-green-500' : ''
                    }`}
                >
                  <td class="py-2 px-3 font-mono">
                    <span class={cell.isCurrent ? 'text-green-500 font-bold' : 'text-white'}>
                      {cell.index}
                    </span>
                    {cell.isCurrent && <span class="text-green-500 ml-1">←</span>}
                  </td>
                  <td class="py-2 px-3 font-mono text-[#7fffd4]">
                    {cell.value}
                  </td>
                  <td class="py-2 px-3 font-mono text-[#8ca39a]">
                    {cell.value >= 32 && cell.value <= 126 ? String.fromCharCode(cell.value) : '·'}
                  </td>
                  <td class="py-2 px-3 font-mono text-xs text-[#8ca39a]">
                    {cell.value.toString(2).padStart(8, '0')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div class="text-xs text-[#8ca39a] mt-2">
          Showing cells {visibleCellsData[0]?.index || 0} - {visibleCellsData[visibleCellsData.length - 1]?.index || 0}
          (Total: 30,000 cells)
        </div>
      </div>
    </div>
  );
} 