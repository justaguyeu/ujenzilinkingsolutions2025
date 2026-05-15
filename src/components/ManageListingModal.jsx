import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import useRegistrations from "../hooks/useRegistrations";

const ManageListingModal = ({ isOpen, onClose, registration }) => {
  const { deleteRegistration } = useRegistrations();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("confirm"); // "confirm" | "success"

  const handleDelete = () => {
    if (!pin.trim()) { setError("Please enter your PIN."); return; }
    const ok = deleteRegistration(registration.id, pin.trim());
    if (!ok) {
      setError("Incorrect PIN. Please try again.");
      return;
    }
    setStep("success");
  };

  const handleClose = () => {
    setPin("");
    setError("");
    setStep("confirm");
    onClose();
  };

  if (!registration) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/75 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative bg-n-8 w-full md:max-w-sm max-h-[80vh] overflow-y-auto
                       rounded-t-2xl md:rounded-2xl border border-n-6"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-n-5" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-n-6">
              <h2 className="text-lg font-bold text-n-1">Manage Listing</h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-n-7 flex items-center justify-center hover:bg-n-6 transition-colors"
              >
                <X className="w-4 h-4 text-n-1" />
              </button>
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                {step === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-6 gap-4"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                    <div>
                      <h3 className="text-lg font-bold text-n-1">Listing removed</h3>
                      <p className="text-n-3 text-sm mt-1">
                        <span className="text-color-1 font-semibold">{registration.name}</span>{" "}
                        has been deleted from the directory.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-full py-3 bg-color-1 text-n-8 font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Done
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <p className="text-n-3 text-sm">
                      You are about to delete{" "}
                      <span className="text-n-1 font-semibold">{registration.name}</span>.
                      Enter your PIN to confirm.
                    </p>

                    {/* PIN input */}
                    <div>
                      <div className={`flex items-center rounded-xl border transition-colors
                        ${error ? "border-red-500" : "border-n-5 focus-within:border-color-1"}`}
                      >
                        <Lock className="w-4 h-4 text-n-4 ml-3 flex-shrink-0" />
                        <input
                          type="password"
                          placeholder="Enter your PIN"
                          value={pin}
                          onChange={(e) => { setPin(e.target.value); setError(""); }}
                          className="w-full bg-transparent px-3 py-3 text-n-1 placeholder-n-5 text-sm focus:outline-none"
                        />
                      </div>
                      {error && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {error}
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleClose}
                        className="flex-1 py-3 border border-n-5 text-n-1 font-semibold rounded-xl
                                   hover:border-n-3 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl
                                   hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ManageListingModal;