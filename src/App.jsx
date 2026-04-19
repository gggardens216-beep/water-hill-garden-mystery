import React, { useState, useEffect } from 'react';
import { Webcam } from 'react-webcam';

const stages = [
    { id: 1, question: 'What is the first task?', answer: 'Answer 1' },
    { id: 2, question: 'What is the second task?', answer: 'Answer 2' },
    // ... add all 9 stages  
    { id: 9, question: 'What is the ninth task?', answer: 'Answer 9' },
];

function App() {
    const [currentStage, setCurrentStage] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isCameraEnabled, setIsCameraEnabled] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentStage < stages.length) {
                setIsCameraEnabled(true);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [currentStage]);

    const handleNextStage = () => {
        if (userAnswer === stages[currentStage].answer) {
            setCurrentStage(currentStage + 1);
            setUserAnswer('');
            if (currentStage + 1 >= stages.length) {
                alert('Congratulations, you have completed the game!');
            }
        } else {
            alert('Try again!');
        }
    };

    return (
        <div>
            <h1>Water Hill Garden AR Mystery</h1>
            <h2>{stages[currentStage]?.question}</h2>
            {isCameraEnabled && <Webcam />}
            <input 
                type="text" 
                value={userAnswer} 
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here"
            />
            <button onClick={handleNextStage}>Submit Answer</button>
        </div>
    );
}

export default App;