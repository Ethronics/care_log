import {
  useRef,
  useState,
  useEffect,
  useId,
  useMemo,
  useCallback,
  type KeyboardEvent,
} from 'react'
import styles from './SearchableSelect.module.css'

export interface SearchableSelectOption {
  id: string
  label: string
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  id?: string
  'aria-label'?: string
  /** Allow clearing selection (e.g. "All"). If true, one option can have id "". */
  allowEmpty?: boolean
  emptyLabel?: string
  className?: string
  /** Max height of dropdown list (px). Default 280. */
  listMaxHeight?: number
}

const DEFAULT_LIST_MAX_HEIGHT = 280

function filterOptions(options: SearchableSelectOption[], query: string): SearchableSelectOption[] {
  const q = query.trim().toLowerCase()
  if (!q) return options
  return options.filter((o) => o.label.toLowerCase().includes(q))
}

export function SearchableSelect({
  options,
  value,
  onChange,
  label,
  placeholder = 'Search or select…',
  id: idProp,
  'aria-label': ariaLabel,
  allowEmpty = false,
  emptyLabel = 'All',
  className = '',
  listMaxHeight = DEFAULT_LIST_MAX_HEIGHT,
}: SearchableSelectProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const effectiveOptions = useMemo(() => {
    const list = allowEmpty
      ? [{ id: '', label: emptyLabel }, ...options]
      : options
    return filterOptions(list, searchQuery)
  }, [options, searchQuery, allowEmpty, emptyLabel])

  const selectedOption = useMemo(() => {
    if (allowEmpty && value === '') return { id: '', label: emptyLabel }
    return options.find((o) => o.id === value)
  }, [options, value, allowEmpty, emptyLabel])

  const displayLabel = selectedOption?.label ?? (allowEmpty && value === '' ? emptyLabel : '')

  const openDropdown = useCallback(() => {
    setIsOpen(true)
    setSearchQuery('')
    setHighlightedIndex(0)
    setTimeout(() => searchInputRef.current?.focus(), 0)
  }, [])

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setSearchQuery('')
  }, [])

  const selectValue = useCallback(
    (id: string) => {
      onChange(id)
      closeDropdown()
    },
    [onChange, closeDropdown]
  )

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closeDropdown])

  useEffect(() => {
    if (!isOpen || effectiveOptions.length === 0) return
    setHighlightedIndex((i) => Math.min(i, effectiveOptions.length - 1))
  }, [isOpen, searchQuery, effectiveOptions.length])

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        openDropdown()
      }
      return
    }
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        closeDropdown()
        break
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((i) => (i < effectiveOptions.length - 1 ? i + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((i) => (i > 0 ? i - 1 : effectiveOptions.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (effectiveOptions[highlightedIndex]) {
          selectValue(effectiveOptions[highlightedIndex].id)
        }
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (!isOpen || !listRef.current) return
    const el = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [highlightedIndex, isOpen])

  return (
    <div
      ref={containerRef}
      id={id}
      className={`${styles.wrapper} ${className}`.trim()}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label htmlFor={`${id}-trigger`} className={styles.label}>
          {label}
        </label>
      )}
      <button
        type="button"
        id={`${id}-trigger`}
        className={styles.trigger}
        onClick={openDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel ?? label ?? 'Choose an option'}
        aria-controls={isOpen ? `${id}-listbox` : undefined}
      >
        <span className={styles.triggerText}>
          {displayLabel || placeholder}
        </span>
        <span className={styles.chevron} aria-hidden>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      {isOpen && (
        <div className={styles.dropdown} role="presentation">
          <div className={styles.searchWrap}>
            <input
              ref={searchInputRef}
              type="search"
              className={styles.searchInput}
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  closeDropdown()
                  return
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setHighlightedIndex((i) => (i < effectiveOptions.length - 1 ? i + 1 : 0))
                  return
                }
                if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setHighlightedIndex((i) => (i > 0 ? i - 1 : effectiveOptions.length - 1))
                  return
                }
                if (e.key === 'Enter' && effectiveOptions[highlightedIndex]) {
                  e.preventDefault()
                  selectValue(effectiveOptions[highlightedIndex].id)
                }
              }}
              aria-label="Filter options"
              autoComplete="off"
            />
          </div>
          <ul
            id={`${id}-listbox`}
            ref={listRef}
            className={styles.list}
            role="listbox"
            aria-label={ariaLabel ?? label ?? 'Options'}
            style={{ maxHeight: listMaxHeight }}
          >
            {effectiveOptions.length === 0 ? (
              <li className={styles.noResults}>No matches</li>
            ) : (
              effectiveOptions.map((opt, idx) => (
                <li
                  key={opt.id === '' ? '__empty__' : opt.id}
                  data-index={idx}
                  role="option"
                  aria-selected={value === opt.id}
                  className={`${styles.option} ${highlightedIndex === idx ? styles.optionHighlighted : ''}`}
                  onClick={() => selectValue(opt.id)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  {opt.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
