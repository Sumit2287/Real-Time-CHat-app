import { MessageSquare, ShieldCheck, Zap, Image } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 lg:p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Animated Hero Icon */}
        <div className="flex justify-center mb-2">
          <div className="relative group">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg group-hover:scale-105 transition-all">
              <MessageSquare className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 size-5 bg-emerald-500 rounded-full border-2 border-base-100 shadow-sm" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Welcome to Chatty!</h2>
          <p className="text-sm text-base-content/70">
            Select a contact from the sidebar to start a real-time conversation.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-base-300/60">
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-base-200/50 border border-base-300/40">
            <Zap className="size-5 text-amber-500" />
            <span className="text-xs font-semibold">Real-Time</span>
            <span className="text-[10px] text-base-content/50">Instant Sync</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-base-200/50 border border-base-300/40">
            <Image className="size-5 text-indigo-500" />
            <span className="text-xs font-semibold">Media</span>
            <span className="text-[10px] text-base-content/50">Image Uploads</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-base-200/50 border border-base-300/40">
            <ShieldCheck className="size-5 text-emerald-500" />
            <span className="text-xs font-semibold">Secure</span>
            <span className="text-[10px] text-base-content/50">JWT Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
