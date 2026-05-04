'use client';

// The big banner above the doors that responds to each pick.
// Renders a different micro-layout per feedback kind so the message
// is *visual*, not just a sentence to read.
export default function FeedbackPanel({ feedback, level }) {
  if (!feedback) {
    return (
      <div className="feedback feedback--idle">
        <div className="feedback__emoji" aria-hidden="true">🗺️</div>
        <div className="feedback__text">
          <div className="feedback__label">Pick a door to begin.</div>
          <div className="feedback__detail">{level.intro}</div>
        </div>
      </div>
    );
  }

  const color = feedback.color || '#1B1B3A';
  const style = { '--feedback-color': color };

  if (feedback.kind === 'direction' && feedback.key !== 'found') {
    return (
      <div className="feedback" style={style}>
        <div className="feedback__emoji" aria-hidden="true">👻</div>
        <div className="feedback__text">
          <div className="feedback__label">
            {feedback.key === 'left'
              ? <><span className="feedback__arrow">←</span> Treasure is to the LEFT</>
              : <>Treasure is to the RIGHT <span className="feedback__arrow">→</span></>}
          </div>
          <div className="feedback__detail">whispers the friendly ghost</div>
        </div>
      </div>
    );
  }

  if (feedback.kind === 'found') {
    return (
      <div className="feedback" style={style}>
        <div className="feedback__emoji" aria-hidden="true">💎</div>
        <div className="feedback__text">
          <div className="feedback__label">YOU FOUND IT!</div>
          <div className="feedback__detail">the gold is yours, brave hunter</div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback" style={style}>
      <div className="feedback__emoji" aria-hidden="true">{feedback.emoji}</div>
      <div className="feedback__text">
        <div className="feedback__label">{feedback.label}</div>
        <div className="feedback__detail">
          {feedback.kind === 'distance' && distanceHint(feedback.key)}
          {feedback.kind === 'empty' && 'Just dust and cobwebs in this one.'}
        </div>
      </div>
    </div>
  );
}

function distanceHint(key) {
  switch (key) {
    case 'blazing': return "you're practically on top of it!";
    case 'hot':     return 'getting really close...';
    case 'warm':    return 'you can feel it nearby.';
    case 'cool':    return 'a bit far. try elsewhere.';
    case 'cold':    return 'way off — try the other side.';
    default:        return '';
  }
}
