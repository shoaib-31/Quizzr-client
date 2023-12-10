import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { toggleQuiz } from "../reducers/quizReducer";
import { questions, quizInfo } from "./quizData";
import Countdown from "react-countdown-now";
import Stopwatch from "../assets/stopwatch.svg";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();
  const { duration } = quizInfo;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const temp = [];
  for (let i = 0; i < questions.length; i++) {
    temp.push(null);
  }
  const [answers, setAnswers] = useState(temp);
  const dispatch = useDispatch();

  const handleNext = () => {
    setCurrentQuestion((prevQuestion) =>
      prevQuestion < questions.length - 1 ? prevQuestion + 1 : prevQuestion
    );
  };

  const handlePrevious = () => {
    setCurrentQuestion((prevQuestion) =>
      prevQuestion > 0 ? prevQuestion - 1 : prevQuestion
    );
  };

  const handleClear = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = null;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
  };

  const handleTimerComplete = () => {
    console.log("Timer completed!");
    handleSubmit();
    navigate("/submitted");
  };
  const [endTime, setEndTime] = useState(Date.now() + duration * 60 * 1000);

  useEffect(() => {
    dispatch(toggleQuiz());
    return () => {
      dispatch(toggleQuiz());
    };
  }, [dispatch]);

  return (
    <Main>
      <QuesIndex>
        {currentQuestion + 1}/{questions.length}
      </QuesIndex>
      <Question>{questions[currentQuestion].question}</Question>
      <Options>
        {questions[currentQuestion].options.map((option, index) => {
          return (
            <StyledLabel key={index}>
              <Option
                type="radio"
                name={`Option-${index + 1}`}
                value={option}
                checked={answers[currentQuestion] === option}
                onChange={() => {
                  const updatedAnswers = [...answers];
                  updatedAnswers[currentQuestion] = option;
                  setAnswers(updatedAnswers);
                }}
              />
              {questions[currentQuestion].options[index]}
            </StyledLabel>
          );
        })}
      </Options>
      <CountdownContainer>
        <Countdown
          date={endTime}
          onComplete={handleTimerComplete}
          renderer={({ hours, minutes, seconds }) => (
            <Timer>
              <img
                style={{ width: "2rem", height: "2rem" }}
                src={Stopwatch}
                alt="Stopwatch"
              />
              &nbsp;
              {hours > 0 && `${hours}:`}
              {`${minutes}:${seconds}`}
            </Timer>
          )}
        />
      </CountdownContainer>
      <ButtonContainer>
        <Button onClick={handleClear}>Clear</Button>
        <Button onClick={handlePrevious} disabled={currentQuestion === 0}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentQuestion === questions.length - 1}
        >
          Next
        </Button>
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      </ButtonContainer>
    </Main>
  );
};
const Timer = styled.div`
  font-size: 1.2rem;
  color: #000000;
  font-weight: 700;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  background-color: #e0d8fa;
  padding: 0.5rem;
  border-radius: 5px;
`;
const Question = styled.div`
  font-size: 2rem;
  margin: 1rem 0;
`;
const QuesIndex = styled.div`
  font-size: 1.5rem;
  background-color: #c4c4c4;
  width: fit-content;
  padding: 0.5rem;
  border-radius: 5px;
`;
const Options = styled.div`
  display: flex;
  flex-direction: column;
`;
const Option = styled.input`
  margin: 0.5rem 0;
`;
const StyledLabel = styled.label`
  font-size: 1.2rem;
  font-family: "Roboto", sans-serif;
  margin: 0.5rem 0;
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 1rem;
`;
const Main = styled.div`
  background-color: white;
  width: 50%;
  margin: auto;
  padding: 2rem;
  border-radius: 1rem 0 0 1rem;
  height: 90%;
  position: relative;
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #636363;
    border-radius: 3px;
    &:hover {
      background-color: #8f8f8f;
    }
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;

const CountdownContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  width: 95%;
  position: absolute;
  bottom: 2rem;
`;

const Button = styled.button`
  background-color: #4735ce;
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1rem;
  &:hover {
    background-color: #3626b1;
  }
  &:disabled {
    background-color: #a3a3a3;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #28a745;
  &:hover {
    background-color: #218838;
  }
`;

export default Quiz;
