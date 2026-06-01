"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Send, X } from "lucide-react"

export function AIAssistant() {
  const [showModal, setShowModal] = useState(false)

  const handleClick = () => {
    setShowModal(true)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="theme-card p-6 h-full cursor-pointer"
        onClick={handleClick}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            <MessageCircle className="h-5 w-5" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              AI Assistant
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Ask about Arpan
            </p>
          </div>
        </div>

        {/* Chat bubble */}
        <div 
          className="mb-4 p-3 rounded-lg border-l-2"
          style={{ 
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--accent)"
          }}
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {"Hello! I'm here to answer questions about Arpan's work."}
          </p>
        </div>

        {/* Input field */}
        <div 
          className="flex items-center gap-2 p-3 border"
          style={{ 
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-faint)",
            borderRadius: "var(--radius-theme)"
          }}
        >
          <input
            type="text"
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-muted)" }}
            readOnly
          />
          <Send className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
        </div>
      </motion.div>

      {/* Easter Egg Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" />
            
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 max-w-sm w-full p-6 border"
              style={{ 
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-faint)",
                borderRadius: "var(--radius-theme)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 p-1 transition-opacity hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="text-center">
                <p className="text-4xl mb-4">💸</p>
                <p className="font-display text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  No money for API credits right now!
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Check back later 😅
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
