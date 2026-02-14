"use client";

// =============================================
// AdvancedSelect Component
// A feature-rich dropdown select built with:
// - Headless UI (Listbox) for accessibility
// - Tailwind CSS for styling
// - @tanstack/react-virtual for virtualization
// =============================================

import { useState, useMemo, useRef, Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type {
  AdvancedSelectProps,
  SelectOption,
  SelectGroup,
} from "./types";
import { isGroupedOptions } from "./types";

/**
 * AdvancedSelect - A professional multi-select dropdown
 *
 * Features:
 * - Search/filter items
 * - Multi-select with checkboxes
 * - Grouped items with headers
 * - Select All / Deselect All
 * - Shows count of selected items
 * - Virtualized rendering for 10,000+ items
 */
export function AdvancedSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  searchable = true,
  searchPlaceholder = "Search...",
  virtualized = false,
  itemHeight = 40,
  maxHeight = 300,
  disabled = false,
  className = "",
}: AdvancedSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // ---- Flatten grouped options for processing ----
  const flatOptions = useMemo<SelectOption[]>(() => {
    if (isGroupedOptions(options)) {
      return options.flatMap((group) => group.options);
    }
    return options as SelectOption[];
  }, [options]);

  // ---- Filter options based on search ----
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (isGroupedOptions(options)) {
      if (!query) return options;
      return options
        .map((group) => ({
          ...group,
          options: group.options.filter((opt) =>
            opt.label.toLowerCase().includes(query)
          ),
        }))
        .filter((group) => group.options.length > 0);
    }

    if (!query) return options;
    return (options as SelectOption[]).filter((opt) =>
      opt.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // ---- Build flat list for virtualization ----
  type VirtualItem =
    | { type: "group"; label: string }
    | { type: "option"; option: SelectOption };

  const virtualItems = useMemo<VirtualItem[]>(() => {
    if (isGroupedOptions(filteredData as SelectOption[] | SelectGroup[])) {
      const items: VirtualItem[] = [];
      for (const group of filteredData as SelectGroup[]) {
        items.push({ type: "group", label: group.label });
        for (const opt of group.options) {
          items.push({ type: "option", option: opt });
        }
      }
      return items;
    }
    return (filteredData as SelectOption[]).map((opt) => ({
      type: "option" as const,
      option: opt,
    }));
  }, [filteredData]);

  // ---- Filtered flat options (for select all) ----
  const filteredFlatOptions = useMemo(() => {
    return virtualItems
      .filter((item): item is VirtualItem & { type: "option" } => item.type === "option")
      .map((item) => item.option)
      .filter((opt) => !opt.disabled);
  }, [virtualItems]);

  // ---- Virtualizer ----
  const rowVirtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => listRef.current,
    estimateSize: (index) =>
      virtualItems[index].type === "group" ? 32 : itemHeight,
    overscan: 10,
  });

  // ---- Handlers ----
  const toggleOption = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const selectAll = () => {
    const allValues = filteredFlatOptions.map((opt) => opt.value);
    const merged = new Set([...value, ...allValues]);
    onChange(Array.from(merged));
  };

  const deselectAll = () => {
    const filteredValues = new Set(filteredFlatOptions.map((opt) => opt.value));
    onChange(value.filter((v) => !filteredValues.has(v)));
  };

  const isAllSelected =
    filteredFlatOptions.length > 0 &&
    filteredFlatOptions.every((opt) => value.includes(opt.value));

  // ---- Display text ----
  const displayText = useMemo(() => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const found = flatOptions.find((opt) => opt.value === value[0]);
      return found?.label || value[0];
    }
    return `${value.length} items selected`;
  }, [value, flatOptions, placeholder]);

  // ---- Render option row ----
  const renderOption = (option: SelectOption) => {
    const isSelected = value.includes(option.value);
    return (
      <ListboxOption
        key={option.value}
        value={option.value}
        disabled={option.disabled}
        as={Fragment}
      >
        {({ focus }) => (
          <div
            className={`
              flex items-center gap-3 px-3 cursor-pointer select-none
              ${focus ? "bg-teal-50 dark:bg-teal-900/30" : ""}
              ${option.disabled ? "opacity-40 cursor-not-allowed" : ""}
            `}
            style={{ height: `${itemHeight}px` }}
            onClick={(e) => {
              e.preventDefault();
              if (!option.disabled) toggleOption(option.value);
            }}
          >
            {/* Checkbox */}
            <div
              className={`
                shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors
                ${
                  isSelected
                    ? "bg-teal-500 border-teal-500 text-white"
                    : "border-gray-300 dark:border-gray-600"
                }
              `}
            >
              {isSelected && (
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="truncate text-sm text-gray-800 dark:text-gray-200">
              {option.label}
            </span>
          </div>
        )}
      </ListboxOption>
    );
  };

  // ---- Render group header ----
  const renderGroupHeader = (label: string) => (
    <div
      className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 sticky top-0"
      style={{ height: "32px", lineHeight: "32px" }}
    >
      {label}
    </div>
  );

  return (
    <Listbox
      value={value}
      onChange={() => {}}
      multiple
      disabled={disabled}
    >
      <div className={`relative ${className}`}>
        {/* Trigger Button */}
        <ListboxButton
          className={`
            w-full flex items-center justify-between gap-2 px-4 py-2.5
            bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
            rounded-lg shadow-sm text-left
            hover:border-teal-400 dark:hover:border-teal-500
            focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-150
          `}
        >
          <span
            className={`truncate text-sm ${
              value.length === 0
                ? "text-gray-400 dark:text-gray-500"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {displayText}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {value.length > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full">
                {value.length}
              </span>
            )}
            {/* Chevron */}
            <svg
              className="w-4 h-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </ListboxButton>

        {/* Dropdown Panel */}
        <ListboxOptions
          className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden focus:outline-none"
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 text-gray-800 dark:text-gray-200 placeholder-gray-400"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Select All / Deselect All */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button
              type="button"
              className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                selectAll();
              }}
            >
              Select All
            </button>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button
              type="button"
              className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                deselectAll();
              }}
            >
              Deselect All
            </button>
            <span className="ml-auto text-xs text-gray-400">
              {filteredFlatOptions.length} items
            </span>
          </div>

          {/* Options List */}
          {filteredFlatOptions.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              No items found
            </div>
          ) : virtualized ? (
            /* Virtualized List */
            <div
              ref={listRef}
              style={{ maxHeight: `${maxHeight}px`, overflow: "auto" }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const item = virtualItems[virtualRow.index];
                  return (
                    <div
                      key={virtualRow.index}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {item.type === "group"
                        ? renderGroupHeader(item.label)
                        : renderOption(item.option)}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Normal List */
            <div style={{ maxHeight: `${maxHeight}px`, overflow: "auto" }}>
              {isGroupedOptions(
                filteredData as SelectOption[] | SelectGroup[]
              ) ? (
                (filteredData as SelectGroup[]).map((group) => (
                  <div key={group.label}>
                    {renderGroupHeader(group.label)}
                    {group.options.map((opt) => renderOption(opt))}
                  </div>
                ))
              ) : (
                (filteredData as SelectOption[]).map((opt) =>
                  renderOption(opt)
                )
              )}
            </div>
          )}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
