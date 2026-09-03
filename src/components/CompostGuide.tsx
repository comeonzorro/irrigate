"use client";

import { useState } from "react";
import { COMPOST_METHODS } from "@/lib/compost/steps";

export function CompostGuide() {
  const [methodId, setMethodId] = useState(COMPOST_METHODS[0]?.id ?? "");
  const method = COMPOST_METHODS.find((m) => m.id === methodId) ?? COMPOST_METHODS[0];

  if (!method) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {COMPOST_METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethodId(m.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              m.id === methodId
                ? "bg-emerald-700 text-white"
                : "border border-emerald-200 bg-white text-emerald-800 hover:border-emerald-400"
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-white p-6">
        <h2 className="text-xl font-bold text-emerald-950">{method.name}</h2>
        <p className="mt-2 text-emerald-800">{method.description}</p>
        <p className="mt-1 text-sm text-emerald-600">
          Durée estimée : {method.durationWeeks}
        </p>

        <ol className="mt-8 space-y-6">
          {method.steps.map((step, index) => (
            <li key={step.id} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-emerald-900">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-emerald-800">
                  {step.description}
                </p>
                {step.tip ? (
                  <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    💡 {step.tip}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
