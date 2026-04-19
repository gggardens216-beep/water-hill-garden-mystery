import { Component, useEffect, useRef, useState } from 'react';
import { AlertCircle, Camera, CheckCircle2, Leaf, Trophy } from 'lucide-react';

const stages = [
  { id: 1, question: 'Which flower is famous for blooming in neat spring rows across garden beds?', answer: 'tulip' },
  { id: 2, question: 'Name the herb with a calming scent often planted near walkways and stone paths.', answer: 'lavender' },
  { id: 3, question: 'What climbing plant is known for wrapping elegant purple blooms around trellises?', answer: 'wisteria' },
  { id: 4, question: 'Which tree drops acorns that squirrels gather around the hill?', answer: 'oak' },
  { id: 5, question: 'What water feature do visitors cross by stepping stones in the center garden?', answer: 'pond' },
  { id: 6, question: 'Which bright flower turns to follow the sun throughout the day?', answer: 'sunflower' },
  { id: 7, question: 'What fragrant white flower is used in many evening garden ceremonies?', answer: 'jasmine' },
  { id: 8, question: 'Which evergreen plant is trimmed into topiary spirals by the main gate?', answer: 'boxwood' },
  { id: 9, question: 'What hidden object do you uncover after solving all Water Hill clues?', answer: 'golden seed' },
];

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto mt-8 max-w-xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Something went wrong. Please refresh and try again.
        </div>
      );
    }

    return this.props.children;
  }
}

function MysteryGame() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stage = stages[currentStageIndex];
  const isComplete = currentStageIndex >= stages.length;
  const progress = Math.min((currentStageIndex / stages.length) * 100, 100);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const enableCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraError('');
      setIsCameraEnabled(true);
    } catch (error) {
      const safeError = error instanceof Error ? `${error.name}: ${error.message}` : 'unknown error';
      console.error('Unable to enable camera:', safeError);
      setCameraError('Camera access was denied. You can still solve clues without it.');
    }
  };

  const disableCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraEnabled(false);
  };

  const handleNextStage = () => {
    if (!stage) {
      return;
    }

    const normalizedAnswer = userAnswer.trim().toLowerCase();
    const expectedAnswer = stage.answer.trim().toLowerCase();

    if (!normalizedAnswer) {
      setFeedback({ type: 'error', message: 'Please enter an answer before submitting.' });
      return;
    }

    if (normalizedAnswer === expectedAnswer) {
      setCurrentStageIndex((previousIndex) => previousIndex + 1);
      setUserAnswer('');
      setFeedback({ type: 'success', message: 'Correct! Moving to the next clue.' });
      return;
    }

    setFeedback({ type: 'error', message: 'Not quite right. Look around and try again.' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-stone-100 to-lime-50 px-4 py-8">
      <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-100">
        <div className="mb-6 flex items-center gap-3">
          <Leaf className="h-8 w-8 text-emerald-600" />
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">Water Hill Garden AR Mystery</h1>
            <p className="text-sm text-emerald-700">Solve all 9 clues to uncover the hidden treasure.</p>
          </div>
        </div>

        {isComplete ? (
          <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
            <Trophy className="mx-auto mb-2 h-10 w-10 text-amber-500" />
            <h2 className="text-xl font-semibold text-emerald-900">Mystery Solved!</h2>
            <p className="mt-2 text-emerald-700">You discovered the Golden Seed and completed all 9 stages.</p>
          </section>
        ) : (
          <>
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-emerald-900">
                <span>Stage {currentStageIndex + 1} of {stages.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-2 w-full rounded-full bg-emerald-100">
                <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <section className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <h2 className="mb-2 text-lg font-semibold text-stone-900">Clue {stage?.id}</h2>
              <p className="text-stone-700">{stage?.question ?? 'No clue available.'}</p>
            </section>

            <section className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-stone-700">
                  <Camera className="h-4 w-4" />
                  Camera
                </h3>
                {isCameraEnabled ? (
                  <button className="rounded-md bg-stone-700 px-3 py-1.5 text-sm text-white hover:bg-stone-800" onClick={disableCamera}>
                    Disable
                  </button>
                ) : (
                  <button className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700" onClick={enableCamera}>
                    Enable
                  </button>
                )}
              </div>
              {isCameraEnabled ? (
                <video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full rounded-lg border border-stone-200 bg-black/90 object-cover" />
              ) : (
                <div className="rounded-lg border border-dashed border-stone-300 bg-stone-100 p-6 text-center text-sm text-stone-600">
                  Enable the camera to scan your surroundings for hints.
                </div>
              )}
              {cameraError ? <p className="mt-2 text-sm text-amber-700">{cameraError}</p> : null}
            </section>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                value={userAnswer}
                onChange={(event) => setUserAnswer(event.target.value)}
                placeholder="Type your answer here"
                className="w-full rounded-lg border border-stone-300 px-4 py-2 outline-none ring-emerald-300 transition focus:ring"
              />
              <button onClick={handleNextStage} className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
                Submit Answer
              </button>
            </div>

            {feedback ? (
              <p className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-sm ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {feedback.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {feedback.message}
              </p>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <MysteryGame />
    </ErrorBoundary>
  );
}

export default App;
