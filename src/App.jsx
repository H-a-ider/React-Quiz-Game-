import Quiz from "./Quiz";
import "./index.css";
import { useState } from "react";

export default function App() {
  const [info, setInfo] = useState([]);
  let [quizVisibility, setQuizVisibility] = useState(true);

  function quizRender() {
    setQuizVisibility(quizVisibility ? false :false)
    fetch("https://opentdb.com/api.php?amount=5")
      .then((res) => res.json())
      .then((data) => {
        setInfo(data.results);
      });
  }

  function StartOption() {
    return (
      <div className="starting-text">
        <h1>Quizzical</h1>
        <h4>Some description if needed</h4>
        <button onClick={quizRender} className="start-quiz-btn">
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      {quizVisibility && <StartOption />}
      {<Quiz data={info} quizRender = {quizRender}/>} {/* Pass the array of results */}
    </div>
  );
}
