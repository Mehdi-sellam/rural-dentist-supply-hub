import React from 'react';

const App = () => {
  console.log('App component is rendering');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-4">
          🦷 DentGo - Test Page
        </h1>
        <p className="text-lg text-foreground mb-4">
          If you can see this styled text, CSS is loading correctly!
        </p>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Test Components</h2>
          <p className="text-muted-foreground">
            This is a test to see if the basic styling is working.
          </p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded mt-4 hover:bg-primary/90">
            Test Button
          </button>
        </div>
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Current time: {new Date().toLocaleString()}</p>
          <p>CSS should be working if you see proper styling above.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
