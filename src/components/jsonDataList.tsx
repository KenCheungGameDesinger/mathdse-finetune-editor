import React, { useState } from "react";

// JSONDataList 组件定义
const JSONDataList = ({
  jsonData,
  setJsonData,
}: {
    jsonData: { id: number; content: string }[];
    setJsonData: React.Dispatch<
      React.SetStateAction<{ id: number; content: string }[]>
    >;
  }) => {
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);

  // 处理复选框变化
  const handleCheckboxChange = (index: number) => {
    if (selectedEntries.includes(index)) {
      setSelectedEntries(selectedEntries.filter((i) => i !== index));
    } else {
      setSelectedEntries([...selectedEntries, index]);
    }
  };

  // 删除选中条目
  const handleDeleteSelected = () => {
    const filteredData = jsonData.filter(
      (_, index) => !selectedEntries.includes(index)
    );
    setJsonData(filteredData);
    setSelectedEntries([]);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Created Entry</h2>
      <ul className="bg-gray-200 p-4 rounded mt-2">
        {jsonData.map((entry, index: number) => (
          <li key={index} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedEntries.includes(index)}
              onChange={() => handleCheckboxChange(index)}
              className="mr-2"
            />
            <pre className="bg-white p-2 rounded flex-1 overflow-x-auto">
              {JSON.stringify(entry, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
      <button
        onClick={handleDeleteSelected}
        disabled={selectedEntries.length === 0}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
      >
        删除选中
      </button>
    </div>
  );
};

export default JSONDataList;