import Wizard from "./Wizard";

function App() {
  return (
    <div className="App">
      <section className="section">
        <div className="container">
          <h1 className="title">How Do I Sound?</h1>
          <p className="subtitle">
            Record and compare your microphone sources.
          </p>
          <Wizard />
        </div>
      </section>
    </div>
  );
}

export default App;
