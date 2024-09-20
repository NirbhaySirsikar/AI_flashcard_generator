import { useState } from "react";
import CardFlip from "react-card-flip";

const Flashcard = ({ question, options, correctAnswer, updateScore }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleOptionClick = (option) => {
    if (!answered) {
      setSelectedOption(option);
      setAnswered(true);
      updateScore(option === correctAnswer);
    }
  };

  return (
    <div className="max-w-lg w-full p-4">
      <div className="card rounded-xl overflow-hidden cursor-pointer">
        <CardFlip isFlipped={isFlipped}>
          <div
            className="card-front bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center text-lg font-semibold py-24 px-8"
            onClick={handleClick}
          >
            {question}
          </div>
          <div
            className="card-back bg-gradient-to-r from-amber-500 to-pink-500 text-white flex flex-col items-center justify-center py-24 px-8"
            onClick={handleClick}
          >
            {options && options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`p-2 m-1 rounded cursor-pointer ${
                  selectedOption === option
                    ? option === correctAnswer
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-gray-700"
                } ${answered && option !== selectedOption ? "opacity-50" : ""}`}
              >
                {option}
              </div>
            ))}
            {selectedOption && (
              <div className="mt-2">
                {selectedOption === correctAnswer ? "Correct!" : "Incorrect. The correct answer is: " + correctAnswer}
              </div>
            )}
          </div>
        </CardFlip>
      </div>
    </div>
  );
};

export default Flashcard;
