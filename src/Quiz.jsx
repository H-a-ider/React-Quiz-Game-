import{ useEffect, useState } from "react";
import he from "he"; // Import the he library
import "./index.css";

export default function Quiz(props) {
  const { data, quizRender } = props;
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(data.length).fill(null));
  const [showScore, setShowScore] = useState(false);
  const [isAttemptedAll, setIsAttemptedAll] = useState(false);

  useEffect(() => {
    if (data.length > 0) {
      const allQuestions = data.map((item) => {
        // Decode the question, correct answer, and incorrect answers for each question
        const decodedQuestion = he.decode(item.question);
        const CorrectAnswer = he.decode(item.correct_answer);
        const IncorrectAnswers = item.incorrect_answers.map((answer) => he.decode(answer));

        // Combine the correct and incorrect answers, and shuffle them
        const answers = [CorrectAnswer, ...IncorrectAnswers];
        shuffleAnswers(answers);

        // Return the question and shuffled answers for each question
        return {
          question: decodedQuestion,
          answers: answers,
          correctAnswer: CorrectAnswer, // Store the correct answer for each question
        };
      });
      setShuffledQuestions(allQuestions);
      setSelectedAnswers(Array(data.length).fill(null)); // Initialize selected answers array
      setShowScore(false);
    }
  }, [data]);

  // Fisher-Yates (Knuth) shuffle algorithm to shuffle the answers array in place
  const shuffleAnswers = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  function handleAnswerClick(questionIndex, answerIndex) {
    // Create a new array of selected answers to avoid mutation
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(updatedSelectedAnswers);

    // Check if all questions are attempted
    if (updatedSelectedAnswers.every((selectedAnswer) => selectedAnswer !== null)) {
      setIsAttemptedAll(true);
    }
  }

  function handleCheckAnswers() {
    setShowScore(true);
  }

  function handlePlayAgain() {
    setIsAttemptedAll(false); // Reset the state to false
    quizRender(); // Call the quizRender function to fetch new questions
  }

  const calculateScore = () => {
    let correctCount = 0;
    selectedAnswers.forEach((selectedAnswer, index) => {
      if (selectedAnswer === null) return;
      const correctAnswerIndex = shuffledQuestions[index].answers.indexOf(shuffledQuestions[index].correctAnswer);
      if (selectedAnswer === correctAnswerIndex) {
        correctCount++;
      }
    });
    return correctCount;
  };

  return (
    <div className="my-quizes">
      {shuffledQuestions.map((question, questionIndex) => (
        <div key={questionIndex}>
          <h2>{question.question}</h2>
          {question.answers.map((answer, answerIndex) => (
            <h4
              key={answerIndex}
              className={
                showScore
                  ? answerIndex === shuffledQuestions[questionIndex].answers.indexOf(
                      shuffledQuestions[questionIndex].correctAnswer
                    )
                    ? "correct"
                    : selectedAnswers[questionIndex] === answerIndex
                    ? "wrong"
                    : ""
                  : selectedAnswers[questionIndex] === answerIndex
                  ? "clicked"
                  : ""
              }
              onClick={() => handleAnswerClick(questionIndex, answerIndex)}
            >
              {answer}
            </h4>
          ))}
        </div>
      ))}
      {!showScore && isAttemptedAll && (
        <button className="check-answer-btn" onClick={handleCheckAnswers}>
          Check answers
        </button>
      )}
      {showScore && (
        <div className="score">
          <h1>You scored {calculateScore()}/{data.length} correct answers</h1>
          <button onClick={handlePlayAgain}>Play again</button>
        </div>
      )}
    </div>
  );
}
