import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
import Input from "./Input";
import FlashcardGrid from "./FlashcardGrid";
import { TextEffect } from "./magicui/TextEffect";
import SparklesText from "@/components/magicui/sparkles-text";
import { FaGithub } from "react-icons/fa";

const COLORS_TOP = ["#00BFFF", "#1E90FF"];
const TEXT_MIN_LENGTH = 10;
const TEXT_MAX_LENGTH = 1000;
const IMAGE_MAX_SIZE = 5 * 1024 * 1024;

export const Home = () => {
  const color = useMotionValue(COLORS_TOP[0]);
  const [quiz, setQuiz] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  const handleMessageChange = (e) => {
    setQuiz(e.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (quiz.length < TEXT_MIN_LENGTH || quiz.length > TEXT_MAX_LENGTH) {
      setError(
        `Text input must be between ${TEXT_MIN_LENGTH} - ${TEXT_MAX_LENGTH} characters.`
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quiz }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        const formattedFlashcards = data.map((item) => ({
          id: item.id,
          question: item.question,
          options: item.options,
          correctAnswer: item.correctAnswer,
        }));

        setFlashcards(formattedFlashcards);
        setError(null);
      } else {
        throw new Error(`Unexpected content type: ${contentType}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        "An error occurred while generating the quiz. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    setShowQuiz(true);
    setButtonVisible(false);
  };

  return (
    <>
      <motion.section
        style={{
          backgroundImage,
        }}
        className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
      >
        <a
          href="https://github.com/Panth1823/FlashGenie"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
        >
          <FaGithub size={24} />
        </a>
        <div className="flex flex-col gap-20 mx-auto">
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h1 className="max-w-3xl text-center text-xl font-medium leading-tight text-transparent sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight text-white flex flex-col gap-3">
              <TextEffect per="char" preset="fade">
                Flip, Learn, and Level up with
              </TextEffect>
              <SparklesText
                text="AI-Powered Flashcards"
                className=" text-[#10d8e6]"
              />
            </h1>
            {buttonVisible && (
              <motion.button
                style={{
                  border,
                  boxShadow,
                }}
                whileHover={{
                  scale: 1.015,
                }}
                whileTap={{
                  scale: 0.985,
                }}
                onClick={handleButtonClick}
                className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
              >
                Try It Free
                <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
              </motion.button>
            )}
          </div>
          <div className="absolute inset-0 z-0">
            <Canvas>
              <Stars radius={50} count={2500} factor={4} fade speed={2} />
            </Canvas>
          </div>
          {loading ? (
            <div className="text-center mt-4">
              <p>Generating ...</p>
            </div>
          ) : showQuiz ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="z-50"
              >
                <Input
                  quiz={quiz}
                  handleMessageChange={handleMessageChange}
                  submitHandler={submitHandler}
                  error={error}
                  loading={loading}
                  setFlashcards={setFlashcards}
                />
                {flashcards.length > 0 && (
                  <FlashcardGrid
                    flashcards={flashcards}
                    score={score}
                    setScore={setScore}
                  />
                )}
              </motion.div>
            </>
          ) : null}
        </div>
      </motion.section>
    </>
  );
};
