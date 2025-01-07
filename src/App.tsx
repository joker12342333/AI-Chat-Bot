import React, { useState } from 'react';
import { FileUp, Loader2 } from 'lucide-react';
import { Message } from './types';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setIsPdfUploading(true);
      setIsLoading(true);

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsPdfUploaded(true);
        setMessages([
          {
            id: Date.now().toString(),
            content: 'PDF uploaded successfully! You can now ask questions about it.',
            role: 'assistant',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
    } finally {
      setIsPdfUploading(false);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: content }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div
          className="flex max-w-4xl mx-auto px-4 py-6 items-center cursor-pointer"
          onClick={() => {
            setMessages([]);
            setIsPdfUploaded(false);
          }}
        >
          <img className="h-10 w-10 mr-2" src="https://cdn-icons-png.flaticon.com/512/2040/2040946.png" alt="PDF icon" />
          <h1 className="text-2xl font-bold text-gray-900">Sachin's - PDF Chatbot</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {!isPdfUploaded ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="p-8 bg-white rounded-lg shadow-md text-center">
              {isPdfUploading ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Uploading PDF...</h2>
                    <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 animate-progress rounded-full"
                        style={{ animation: 'progress 2s ease-in-out infinite' }} />
                    </div>
                    <p className="text-sm text-gray-500">Please wait while we process your document</p>
                  </div>
                </div>
              ) : (
                <>
                  <FileUp className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Upload a PDF</h2>
                  <p className="text-gray-600 mb-4">Upload a PDF document to start chatting about its contents</p>
                  <label className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                    Choose PDF
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col h-[calc(100vh-200px)]">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-center">
                    <div className="animate-pulse text-gray-500">Processing...</div>
                  </div>
                )}
              </div>
              <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>
            <div className="text-center w-full">
              {isPdfUploaded && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => {
                      setMessages([]);
                      setIsPdfUploaded(false);
                    }}
                    className="inline-block px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Upload a new PDF?
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;