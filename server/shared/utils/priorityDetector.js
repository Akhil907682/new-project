const detectPriority = (description) => {
  if (!description || description.length < 5) return 'Low';
  
  const desc = description.toLowerCase();
  let score = 0;

  const weights = {
    high: [
      'fire', 'emergency', 'medical', 'short circuit', 'smoke', 'explosion',
      'gas leak', 'broken glass', 'safety', 'danger', 'urgent', 'critical',
      'stolen', 'theft', 'burglary', 'injury', 'unconscious', 'flood',
      'trapped', 'elevator', 'electric shock', 'burning', 'bleeding'
    ],
    medium: [
      'broken', 'leak', 'water', 'electricity', 'internet', 'wifi', 'light',
      'fan', 'plumbing', 'clogged', 'drain', 'lock', 'key', 'flickering',
      'noise', 'loud', 'smell', 'broken window', 'damaged', 'messy', 'dirty'
    ],
    low: [
      'cleaning', 'dusty', 'bulb', 'furniture', 'chair', 'desk', 'cosmetic',
      'paint', 'scratch', 'slow', 'request', 'inquiry', 'general'
    ]
  };

  // Check for high weight terms
  for (const word of weights.high) {
    if (desc.includes(word)) score += 10;
  }

  // Check for medium weight terms
  for (const word of weights.medium) {
    if (desc.includes(word)) score += 5;
  }

  // Check for low weight terms
  for (const word of weights.low) {
    if (desc.includes(word)) score += 1;
  }

  // Basic Sentiment/Urgency boosters
  if (desc.includes('!!!') || desc.includes('asap') || desc.includes('now')) score += 3;

  if (score >= 10) return 'High';
  if (score >= 5) return 'Medium';
  return 'Low';
};

module.exports = { detectPriority };

