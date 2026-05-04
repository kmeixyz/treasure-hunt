'use client';

// A single door. When tried, it changes color based on the feedback received.
// We keep the door's background color in CSS via a custom property so we can
// theme it with whatever the feedback color is (blue for cold, red for hot, etc).
export default function Door({ index, displayNumber, attempt, disabled, onOpen }) {
  const isTried = !!attempt;
  const isFound = attempt?.feedback?.kind === 'found';

  const style = isTried
    ? { '--door-tried-color': attempt.feedback.color || '#94A3B8' }
    : undefined;

  // What badge label do we show under each tried door?
  let badgeText = '';
  if (attempt) {
    if (attempt.feedback.kind === 'found') badgeText = 'TREASURE!';
    else if (attempt.feedback.kind === 'distance') badgeText = attempt.feedback.label;
    else if (attempt.feedback.kind === 'direction') {
      badgeText = attempt.feedback.key === 'left' ? '← LEFT' : (attempt.feedback.key === 'right' ? 'RIGHT →' : '');
    } else if (attempt.feedback.kind === 'empty') badgeText = 'EMPTY';
  }

  return (
    <div className="door-wrap">
      <button
        className={
          'door' +
          (isTried ? ' door--tried' : '') +
          (isFound ? ' door--found' : '')
        }
        style={style}
        disabled={disabled || isTried}
        onClick={() => onOpen(index)}
        aria-label={`Door ${displayNumber}` + (isTried ? `, ${badgeText || 'already tried'}` : '')}
      >
        {isTried && (
          <span className="door__overlay" aria-hidden="true">
            {attempt.feedback.emoji || '✕'}
          </span>
        )}
      </button>
      <span className="door__num">{displayNumber}</span>
      <span
        className={'door__badge' + (badgeText ? '' : ' door__badge--empty')}
        style={badgeText ? { background: attempt.feedback.color, color: attempt.feedback.kind === 'distance' && attempt.feedback.key === 'warm' ? '#1B1B3A' : '#FFF8EC' } : undefined}
      >
        {badgeText || '·'}
      </span>
    </div>
  );
}
