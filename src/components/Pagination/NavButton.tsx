import React from 'react';

export interface NavButtonProps
  extends React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  /**
   * Function to trigger on navigation. Replaces the default click behavior
   * @returns void
   */
  onNavigate: () => void;

  /**
   * Component to wrap
   */
  children: React.ReactNode;

  /**
   * **⚠️ Deprecation Notice ⚠️**
   *
   * _This prop will be removed in v2. Anchor-based rendering will become the default behavior._
   *
   * If true, renders as <a>, <button> otherwise
   * @default false
   */
  useAnchors: boolean;

  /**
   * URL to be set. Required if useAnchors = true
   */
  href?: string;

  /**
   * Identifier for tests
   */
  testId?: string;
}

// Returns true for clicks that should fall through to native browser behavior
// (open in new tab/window): non-primary button or any modifier key held.
function isModifiedClick(e: React.MouseEvent): boolean {
  return e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
}

/**
 * Wraps an element with either <button> or <a> tag
 * Defaults to <button/> if useAnchors = false or href = undefined
 */
export function NavButton({
  useAnchors = false,
  href,
  onNavigate,
  testId,
  children,
  className,
  ...htmlAttributes
}: NavButtonProps) {
  if (useAnchors) {
    return (
      <a
        href={href}
        className={className}
        onClick={(e) => {
          if (isModifiedClick(e)) return;

          e.preventDefault();
          onNavigate();
        }}
        data-testid={testId}
        {...htmlAttributes}>
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onNavigate}
      type='button'
      data-testid={testId}
      className={className}
      {...htmlAttributes}>
      {children}
    </button>
  );
}
