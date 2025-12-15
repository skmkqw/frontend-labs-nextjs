import { addWordToDictionary } from "@/app/lib/dictionary";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type DictionaryFormProps = {
  customWords: string[];
  onAddWord: (word: string) => void;
};

export default function DictionaryForm({ customWords, onAddWord }: DictionaryFormProps) {
  const [customWordDraft, setCustomWordDraft] = useState("");

  const handleAddCustomWord = (event: FormEvent) => {
    event.preventDefault();
    if (!customWordDraft.trim()) {
      return;
    }
    const normalized = customWordDraft.trim().toUpperCase();
    onAddWord(normalized);
    addWordToDictionary(normalized);
    setCustomWordDraft("");
    toast.info(`Dodano słowo domowe: ${normalized}`);
  };

  return (
    <div className="h-full rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
      <h3 className="text-lg font-semibold">Słownik domowy</h3>
      <p className="text-sm text-zinc-500">
        Dodaj własne słowo, aby zaakceptować je w bieżącej partii.
      </p>
      <form onSubmit={handleAddCustomWord} className="mt-3 flex gap-2">
        <input
          type="text"
          value={customWordDraft}
          onChange={(event) => setCustomWordDraft(event.target.value.toUpperCase())}
          placeholder="np. POLSKA"
          className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm uppercase outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Dodaj
        </button>
      </form>
      {customWords.length ? (
        <p className="mt-2 text-xs text-zinc-500">
          Własne słowa: {customWords.join(", ")}
        </p>
      ) : null}
    </div>
  );
}
