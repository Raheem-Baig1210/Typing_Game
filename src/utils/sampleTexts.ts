export const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
  "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages.",
  "The Internet is a global system of interconnected computer networks that use the standard Internet protocol suite to link devices worldwide.",
  "Artificial intelligence is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by humans or animals.",
  "Typing speed is typically measured in words per minute (WPM). The average typing speed is around 40 WPM, while professional typists can reach speeds of 75-80 WPM.",
  "The keyboard is the primary text input device for computers. The QWERTY layout is the most common keyboard layout, named after the first six letters in the top row.",
  "Touch typing is a style of typing where you always use the same finger to press each specific key, without looking at the keyboard.",
  "Practice makes perfect. The more you type, the faster and more accurate you'll become. Regular practice is key to improving your typing skills.",
  "The first typewriter was invented in the 1860s, and the QWERTY keyboard layout was designed to prevent jamming of the mechanical keys.",
  "Ergonomic keyboards are designed to minimize muscle strain and reduce the risk of carpal tunnel syndrome and other repetitive strain injuries.",
];

export const getRandomText = (): string => {
  const randomIndex = Math.floor(Math.random() * sampleTexts.length);
  return sampleTexts[randomIndex];
};

export const getLongText = (): string => {
  // Combine multiple texts for a longer typing challenge
  const numTexts = 3;
  let result = '';
  
  for (let i = 0; i < numTexts; i++) {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    result += sampleTexts[randomIndex] + ' ';
  }
  
  return result.trim();
};

export const getParagraphText = (): string => {
  return `The art of typing quickly and accurately is a valuable skill in today's digital world. 
  Whether you're writing emails, coding, or chatting with friends, being able to type efficiently can save you time and reduce frustration. 
  The key to improving your typing speed is consistent practice and proper technique. 
  Start by positioning your fingers on the home row keys: A, S, D, F for your left hand, and J, K, L, ; for your right hand. 
  Your thumbs should rest on the space bar. From this position, you can reach any key on the keyboard with minimal movement. 
  As you practice, focus on accuracy first, then gradually increase your speed. 
  Remember, it's better to type slowly and correctly than to rush and make mistakes. 
  With regular practice, your muscle memory will develop, and you'll find yourself typing faster without even thinking about it.`;
};

export const getWordList = (count: number = 50): string[] => {
  const words = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
    "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
  ];
  
  const result: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    result.push(words[randomIndex]);
  }
  
  return result;
}; 