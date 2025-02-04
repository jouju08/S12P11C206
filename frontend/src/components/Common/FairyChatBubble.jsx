export default function FairyChatBubble({ children }) {
  return (
    <div
      className="w-[287px] h-[116px] text-text-first service-bold3 text-center justify-center items-center inline-flex"
      style={{
        backgroundImage: "url('/common/fairy-chat-bubble.png')",
      }}>
      {children}
    </div>
  );
}
