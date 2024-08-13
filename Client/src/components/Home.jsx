import { useState } from "react";
import CardFlip from "react-card-flip";

const Flashcard = ({ question, answer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="max-w-lg w-full p-4">
      <div className="card rounded-lg overflow-hidden bg-white">
        <CardFlip isFlipped={isFlipped}>
          <div
            className="card-front bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center text-lg font-semibold py-24 px-8"
            onClick={handleClick}
          >
            {question}
          </div>
          <div
            className="card-back bg-gradient-to-r from-amber-500 to-pink-500 text-white flex items-center justify-center py-24 px-8"
            onClick={handleClick}
          >
            <div className="text-lg font-semibold">{answer}</div>
          </div>
        </CardFlip>
      </div>
    </div>
  );
};

const Home = () => {
  const [quiz, setQuiz] = useState("");
  const [response, setResponse] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);

  const handleMessageChange = (e) => {
    setQuiz(e.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quiz }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.flashcards && Array.isArray(data.flashcards)) {
        setFlashcards(data.flashcards);
        setError(null);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while generating the quiz.");
    }
  };

  return (
    <div className="pt-20">
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 shadow-2xl">
        <div className="flex flex-wrap items-center mx-auto p-4">
          <a href="/" className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8 mr-3"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              AI Flashcard
            </span>
          </a>
          <div className="flex md:order-2"></div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"></ul>
          </div>
        </div>
      </nav>

      <div className="flex justify-center items-center pt-10">
        <div className="w-1/2 px-4 border-2 rounded-xl bg-slate-900 h-auto shadow-2xl">
          <form onSubmit={submitHandler}>
            <div className="flex items-center pt-5">
              <textarea
                type="text"
                value={quiz}
                onChange={handleMessageChange}
                className="block p-2.5 w-full text-sm text-white font-mono h-20 bg-gray-50 rounded-lg border dark:bg-gray-700"
                placeholder="Enter your text here..."
                required
              />
            </div>
            <div className="flex justify-center pt-5">
              <button className="relative inline-flex items-center justify-center p-0.5 mb-4 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                <span className="relative p-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Generate
                </span>
              </button>
            </div>
          </form>
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </div>
      </div>

      <div className="pt-5 grid grid-cols-3 gap-4">
        {flashcards.map((flashcard) => (
          <Flashcard
            key={flashcard.id}
            question={flashcard.question}
            answer={flashcard.answer}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
