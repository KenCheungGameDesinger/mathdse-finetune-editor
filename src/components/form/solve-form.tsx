import React, { useState } from "react";
import MathInput from "../MathInput";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import JSONDataList from "../jsonDataList";

const SolveForm: React.FC = () => {
  const [mathQuestion, setMathQuestion] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [steps, setSteps] = useState<string[]>([""]);
  const [topic, setTopic] = useState("");
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Index for data browsing

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleReorder = (result: any) => {
    if (!result.destination) return;

    const reorderedSteps = Array.from(steps);
    const [moved] = reorderedSteps.splice(result.source.index, 1);
    reorderedSteps.splice(result.destination.index, 0, moved);

    setSteps(reorderedSteps);
  };

  const handleSubmit = () => {
    const newEntry = {
      messages: [
        {
          role: "system",
          content:
            "The assistant is a math tutor that provides clear and detailed solutions.",
        },
        {
          role: "user",
          content: mathQuestion,
        },
        {
          role: "assistant",
          content: {
            solution: {
              final_answer: finalAnswer,
              steps: steps,
              topic: topic,
            },
            success: true,
          },
        },
      ],
    };

    const updatedJsonData = [...jsonData, newEntry];
    setJsonData(updatedJsonData);
    setMathQuestion("");
    setFinalAnswer("");
    setSteps([]);
    setTopic("");
  };

  const handleDownload = () => {
    const file = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "math_questions.json";
    link.click();
  };

  const handleClear = () => {
    setMathQuestion("");
    setFinalAnswer("");
    setSteps([]);
    setTopic("");
    setJsonData([]);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(parsedData)) {
          setJsonData(parsedData);
        } else {
          alert("Invalid JSON format");
        }
      } catch (error) {
        alert("Error parsing JSON file");
      }
    };
    reader.readAsText(file);
  };

  // Handle browsing through the data
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < jsonData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Load data into inputs from current JSON entry
  const currentData = jsonData[currentIndex] || {};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Math Question JSON Generator</h1>

      {/* Upload file button */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          Upload JSON File:
        </label>
        <input
          type="file"
          accept=".json,.jsonl"
          onChange={handleFileUpload}
          className="w-full p-2 border rounded bg-white"
        />
      </div>

      {/* Format Fields */}
      <div className="mb-4">
        <label className="block text-lg font-medium">
          Math Question (LaTeX supported):
        </label>
        <MathInput
          value={currentData?.messages?.[1]?.content || mathQuestion}
          onChange={(val) => setMathQuestion(val)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-medium">
          Final Answer (LaTeX supported):
        </label>
        <MathInput
          value={
            currentData?.messages?.[2]?.content?.solution?.final_answer ||
            finalAnswer
          }
          onChange={(val) => setFinalAnswer(val)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-medium">Solution Steps:</label>
        <DragDropContext onDragEnd={handleReorder}>
          <Droppable droppableId="steps" direction="vertical">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {steps.map((step, index) => (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center mb-2"
                      >
                        <MathInput
                          value={step}
                          onChange={(val) =>
                            setSteps(
                              steps.map((s, i) => (i === index ? val : s))
                            )
                          }
                        />
                        <button
                          className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => handleRemoveStep(index)}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddStep}
        >
          Add Step
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-lg font-medium">Topic:</label>
        <input
          className="w-full p-2 border rounded mt-1"
          value={currentData?.messages?.[2]?.content?.solution?.topic || topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter the topic here..."
        />
      </div>

      <div className="flex space-x-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={handleDownload}
        >
          Download JSON
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>

      {/* Data Navigation */}
      <div className="mt-4">
        <button
          onClick={handlePrev}
          className="mr-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <span className="text-lg">{`<${currentIndex + 1}/${
          jsonData.length
        }>`}</span>
        <button
          onClick={handleNext}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      <div className="mt-6">
        <JSONDataList jsonData={jsonData} setJsonData={setJsonData} />
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold">Preview Generated JSON:</h2>
        <pre className="bg-gray-200 p-4 rounded mt-2 overflow-x-auto">
          {JSON.stringify(jsonData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default SolveForm;
