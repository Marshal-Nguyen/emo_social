import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">EmoSocial Test</h1>
      <p className="text-lg text-gray-700">
        If you can see this, the basic setup is working!
      </p>
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold">Next Steps:</h2>
        <ul className="list-disc list-inside mt-2">
          <li>Check console for any errors</li>
          <li>Verify Tailwind CSS is working</li>
          <li>Test component rendering</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
