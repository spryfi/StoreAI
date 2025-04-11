import { Toaster } from '@/components/ui/toaster';
import TrendMonitor from '@/components/TrendMonitor';
import ProductGenerator from '@/components/ProductGenerator';
import Navigation from '@/components/Navigation';
import { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState("trends");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="min-h-screen pb-10 md:pl-64 transition-all duration-300">
        <main className="max-w-5xl mx-auto p-6 pt-16 md:pt-6">
          <h1 className="text-3xl font-bold mb-2 text-center">✨ AI Trend Monitor</h1>
          <p className="text-center text-muted-foreground mb-8">
            Track trending keywords and generate products from them
          </p>
          
          {activeTab === "trends" && <TrendMonitor />}
          {activeTab === "products" && <ProductGenerator />}
        </main>
      </div>
      
      <Toaster />
    </>
  );
}

export default App;