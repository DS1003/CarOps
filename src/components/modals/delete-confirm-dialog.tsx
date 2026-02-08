"use client";

import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}

export function DeleteConfirmDialog({ isOpen, onClose, onConfirm, title, description }: DeleteConfirmDialogProps) {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            showClose={false}
        >
            <div className="flex flex-col items-center text-center py-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-20 w-20 bg-rose-50 text-rose-500 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner"
                >
                    <Trash2 className="h-9 w-9" />
                </motion.div>
                <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3">Zone de Danger</h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-[280px]">{description}</p>
            </div>

            <DialogFooter className="mt-8">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="h-12 px-6 rounded-xl text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:bg-gray-50"
                >
                    Abandonner
                </Button>
                <Button
                    type="button"
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className="h-12 px-8 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-[0_10px_25px_-5px_rgba(225,29,72,0.4)] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    Confirmer la Suppression
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
