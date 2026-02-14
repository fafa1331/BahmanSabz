"use client"

/**
 * Dashboard Select Demo Page
 *
 * Demonstrates the AdvancedSelect component with grouped options.
 */

import { useState } from "react"
import { AdvancedSelect } from "@/components/ui/AdvancedSelect"
import type { SelectGroup } from "@/components/ui/AdvancedSelect"

const groups: SelectGroup[] = [
  {
    label: "Group A",
    options: Array.from({ length: 100 }, (_, i) => ({
      value: `a-${i}`,
      label: `Option A-${i + 1}`,
    })),
  },
  {
    label: "Group B",
    options: Array.from({ length: 100 }, (_, i) => ({
      value: `b-${i}`,
      label: `Option B-${i + 1}`,
    })),
  },
]

export default function SelectDemoPage() {
  const [values, setValues] = useState<string[]>([])

  return (
    <div className="p-10 max-w-md">
      <h1 className="text-xl font-bold mb-4">Advanced Select Demo</h1>
      <AdvancedSelect
        options={groups}
        value={values}
        onChange={setValues}
        placeholder="Select items..."
        virtualized
        maxHeight={350}
      />
      <p className="mt-4 text-sm text-gray-500">
        Selected: {values.length} items
      </p>
    </div>
  )
}
