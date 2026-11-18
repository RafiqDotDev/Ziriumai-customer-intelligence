import React from "react";
import { MessageSquare, Phone, MoreVertical, Send, ShieldCheck, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  channel: "sms" | "whatsapp" | "email";
  senderName?: string;
  recipientName: string;
  body: string;
  timestamp?: string;
  className?: string;
}

export function PhoneMockup({
  channel,
  senderName = "Spice Route Kitchen",
  recipientName,
  body,
  timestamp = "Today 11:15 AM",
  className,
}: PhoneMockupProps) {
  if (channel === "email") {
    return (
      <div
        className={cn(
          "w-full max-w-md mx-auto rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden text-left",
          className
        )}
      >
        <div className="bg-[#0F2A3A] px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#3EC6F2]" />
            <span className="text-xs font-semibold tracking-wide">Email Preview (Client Inbox)</span>
          </div>
          <span className="text-[11px] text-slate-300">Spice Route Kitchen</span>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50 text-xs text-slate-600 space-y-1">
          <div>
            <span className="font-semibold text-slate-900">From:</span> {senderName} &lt;vip@spiceroutekitchen.com&gt;
          </div>
          <div>
            <span className="font-semibold text-slate-900">To:</span> {recipientName}
          </div>
          <div>
            <span className="font-semibold text-slate-900">Subject:</span> A warm dining invitation from Spice Route
          </div>
        </div>

        <div className="p-5 text-sm text-slate-800 whitespace-pre-line leading-relaxed min-h-[160px]">
          {body}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" /> One-click unsubscribe included
          </span>
          <span>Verified Sender</span>
        </div>
      </div>
    );
  }

  const isWhatsApp = channel === "whatsapp";

  return (
    <div
      className={cn(
        "w-full max-w-[320px] mx-auto rounded-[36px] p-3.5 bg-slate-900 shadow-2xl border-4 border-slate-800",
        className
      )}
    >
      {/* Smartphone Speaker / Camera Notch */}
      <div className="relative mx-auto h-4 w-28 rounded-full bg-slate-800 mb-2 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2" />
        <div className="w-10 h-1 rounded-full bg-slate-700" />
      </div>

      {/* Screen Frame */}
      <div
        className={cn(
          "rounded-[26px] overflow-hidden text-left flex flex-col h-[400px]",
          isWhatsApp ? "bg-[#0b141a]" : "bg-slate-100"
        )}
      >
        {/* Chat Header */}
        <div
          className={cn(
            "px-3.5 py-2.5 flex items-center justify-between shrink-0 shadow-xs",
            isWhatsApp ? "bg-[#1f2c34] text-white" : "bg-white text-slate-900 border-b border-slate-200"
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                isWhatsApp ? "bg-[#00a884] text-white" : "bg-[#0E7C9B] text-white"
              )}
            >
              SR
            </div>
            <div>
              <div className="text-xs font-semibold leading-tight">{senderName}</div>
              <div className="text-[10px] text-emerald-500 font-medium">
                {isWhatsApp ? "Official Business Account" : "SMS Verified"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>

        {/* Message Bubble Body */}
        <div
          className={cn(
            "flex-1 p-3.5 overflow-y-auto flex flex-col justify-end space-y-2",
            isWhatsApp
              ? "bg-[#0b141a] bg-opacity-95"
              : "bg-slate-100"
          )}
        >
          {/* Timestamp chip */}
          <div className="text-center my-1">
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-full",
                isWhatsApp ? "bg-[#1f2c34] text-slate-400" : "bg-slate-200 text-slate-600"
              )}
            >
              {timestamp}
            </span>
          </div>

          {/* Bubble */}
          <div
            className={cn(
              "max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs relative",
              isWhatsApp
                ? "bg-[#005c4b] text-white rounded-tl-xs self-start"
                : "bg-white text-slate-900 rounded-tl-xs self-start border border-slate-200"
            )}
          >
            <p className="whitespace-pre-line">{body}</p>
            <div
              className={cn(
                "text-[9px] mt-1 text-right flex items-center justify-end gap-1",
                isWhatsApp ? "text-emerald-200" : "text-slate-400"
              )}
            >
              <span>11:15 AM</span>
              {isWhatsApp && <span>✓✓</span>}
            </div>
          </div>
        </div>

        {/* Fake Input Footer */}
        <div
          className={cn(
            "p-2.5 flex items-center gap-2 shrink-0 text-xs",
            isWhatsApp ? "bg-[#1f2c34] text-slate-400" : "bg-white border-t border-slate-200 text-slate-400"
          )}
        >
          <div
            className={cn(
              "flex-1 rounded-full px-3 py-1.5 text-[11px]",
              isWhatsApp ? "bg-[#2a3942] text-slate-300" : "bg-slate-100 text-slate-500"
            )}
          >
            Reply STOP to unsubscribe...
          </div>
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-white",
              isWhatsApp ? "bg-[#00a884]" : "bg-[#0E7C9B]"
            )}
          >
            <Send className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
