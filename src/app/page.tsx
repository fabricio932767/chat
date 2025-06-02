import ChatContainer from '@/components/ChatContainer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-lg p-4 shadow-md">
        
        <ChatContainer />
      </div>
    </main>
  );
}
