// =============================================
// AdvancedSelect Type Definitions
// =============================================

/** A single selectable option */
export interface SelectOption {
  /** Unique identifier for the option */
  value: string;
  /** Display label for the option */
  label: string;
  /** If true, the option cannot be selected */
  disabled?: boolean;
}

/** A group of options with a header */
export interface SelectGroup {
  /** Group display label */
  label: string;
  /** Options belonging to this group */
  options: SelectOption[];
}

/** Props for the AdvancedSelect component */
export interface AdvancedSelectProps {
  /** Array of options or grouped options */
  options: SelectOption[] | SelectGroup[];
  /** Currently selected values (controlled) */
  value: string[];
  /** Callback when selection changes */
  onChange: (values: string[]) => void;
  /** Placeholder text when nothing is selected */
  placeholder?: string;
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Enable virtualization for large lists */
  virtualized?: boolean;
  /** Height of each item for virtualization (in px) */
  itemHeight?: number;
  /** Max height of dropdown list (in px) */
  maxHeight?: number;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** Custom class name for the container */
  className?: string;
}

/** Helper to check if options are grouped */
export function isGroupedOptions(
  options: SelectOption[] | SelectGroup[]
): options is SelectGroup[] {
  return options.length > 0 && "options" in options[0];
}
