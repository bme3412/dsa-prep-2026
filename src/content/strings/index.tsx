import { PalindromeViz } from "../../visualizations/strings/PalindromeViz";
import { SubstringSearchViz } from "../../visualizations/strings/SubstringSearchViz";
import type { DataStructure } from "../../types";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
    {children}
  </p>
);

const CodeInline = ({ children }: { children: React.ReactNode }) => (
  <code
    className="text-xs px-1.5 py-0.5 rounded"
    style={{
      fontFamily: "var(--font-mono)",
      background: "var(--color-bg-tertiary)",
      color: "var(--color-accent)",
    }}
  >
    {children}
  </code>
);

export const stringsContent: DataStructure = {
  id: "strings",
  name: "Strings",
  icon: "\" \"",
  tagline:
    "Character arrays with special properties. Master palindromes, anagrams, substrings, and pattern matching.",
  description:
    "Strings combine array techniques with character-specific patterns. Master palindrome detection, anagram checking, and substring problems.",
  color: "amber",
  viewMode: "pattern-first",

  sections: [
    {
      id: "string-fundamentals",
      title: "Strings in interviews",
      subtitle: "Immutability, slicing costs, and character operations",
      content: (
        <>
          <Prose>
            Strings are immutable in Python and JavaScript — every modification
            creates a new string. This means concatenation in a loop is O(n²)
            total, not O(n). Use <CodeInline>join()</CodeInline> or{" "}
            <CodeInline>StringBuilder</CodeInline> patterns instead.
          </Prose>
          <Prose>
            Key operations: <CodeInline>ord('a')</CodeInline> gives ASCII value
            (97), <CodeInline>chr(97)</CodeInline> gives character.{" "}
            <CodeInline>s.lower()</CodeInline>,{" "}
            <CodeInline>s.isalnum()</CodeInline>,{" "}
            <CodeInline>s.split()</CodeInline> are O(n). Slicing{" "}
            <CodeInline>s[i:j]</CodeInline> creates a copy in O(j-i).
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`# Bad: O(n²) - creates new string each iteration
result = ""
for char in s:
    result += char  # New string allocated each time

# Good: O(n) - join at the end
chars = []
for char in s:
    chars.append(char)
result = "".join(chars)

# Or use list comprehension
result = "".join([char for char in s if char.isalnum()])`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "palindromes",
      title: "Palindrome patterns",
      subtitle: "Two pointers from ends, expand from center",
      content: (
        <>
          <Prose>
            A palindrome reads the same forwards and backwards. Two main
            approaches: <strong>two pointers from ends</strong> (check if string
            is palindrome) and <strong>expand from center</strong> (find
            palindromic substrings).
          </Prose>
          <PalindromeViz />
          <Prose>
            For "valid palindrome" problems, preprocess by filtering
            non-alphanumeric characters or handle them inline with{" "}
            <CodeInline>isalnum()</CodeInline>. For "longest palindromic
            substring", try expanding from each character (odd length) and each
            pair (even length).
          </Prose>
        </>
      ),
    },
    {
      id: "substring-search",
      title: "Substring & pattern matching",
      subtitle: "From naive O(nm) to KMP O(n+m)",
      content: (
        <>
          <Prose>
            Finding a pattern in text is a fundamental problem. The naive
            approach checks every position — O(n×m) worst case. For interviews,
            using <CodeInline>pattern in text</CodeInline> or{" "}
            <CodeInline>text.find(pattern)</CodeInline> is usually fine.
          </Prose>
          <SubstringSearchViz />
          <Prose>
            Advanced algorithms like <strong>KMP</strong> (Knuth-Morris-Pratt)
            precompute a "failure function" to avoid rechecking characters.{" "}
            <strong>Rabin-Karp</strong> uses rolling hashes for O(n+m) average
            case. Know these exist but rarely need to implement from scratch.
          </Prose>
        </>
      ),
    },
    {
      id: "anagrams",
      title: "Anagrams & character frequency",
      subtitle: "Counting characters is the key",
      content: (
        <>
          <Prose>
            Two strings are anagrams if they have the same character frequencies.
            Use a hashmap (or fixed-size array for lowercase letters) to count.
            Comparing sorted strings also works but is O(n log n) vs O(n).
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`from collections import Counter

# Method 1: Counter comparison - O(n)
def is_anagram(s, t):
    return Counter(s) == Counter(t)

# Method 2: Fixed array for lowercase - O(n)
def is_anagram_array(s, t):
    if len(s) != len(t):
        return False
    count = [0] * 26
    for c in s:
        count[ord(c) - ord('a')] += 1
    for c in t:
        count[ord(c) - ord('a')] -= 1
    return all(c == 0 for c in count)

# Method 3: Sorted comparison - O(n log n)
def is_anagram_sort(s, t):
    return sorted(s) == sorted(t)`}
            </pre>
          </div>
          <Prose>
            For "find all anagrams" or "group anagrams", use the sorted string
            or a tuple of character counts as a hashmap key.
          </Prose>
        </>
      ),
    },
    {
      id: "sliding-window-strings",
      title: "Sliding window on strings",
      subtitle: "Substrings with constraints",
      content: (
        <>
          <Prose>
            Many string problems involve finding substrings that satisfy certain
            conditions. Use a sliding window with a hashmap to track character
            counts. Expand the right pointer, then shrink from the left when
            constraints are violated.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`def min_window_substring(s, t):
    """Find minimum window in s containing all chars of t."""
    from collections import Counter

    need = Counter(t)
    have = {}
    required = len(need)
    formed = 0

    left = 0
    result = ""
    min_len = float('inf')

    for right, char in enumerate(s):
        # Expand window
        have[char] = have.get(char, 0) + 1
        if char in need and have[char] == need[char]:
            formed += 1

        # Contract window while valid
        while formed == required:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                result = s[left:right + 1]

            left_char = s[left]
            have[left_char] -= 1
            if left_char in need and have[left_char] < need[left_char]:
                formed -= 1
            left += 1

    return result`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "string-building",
      title: "String manipulation patterns",
      subtitle: "Reverse, rotate, encode, decode",
      content: (
        <>
          <Prose>
            Common operations: reverse words (split, reverse, join), rotate
            string (slicing or detect if B is substring of A+A), run-length
            encoding, and string compression. Always consider edge cases: empty
            strings, single characters, all same characters.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`# Reverse words in a string
def reverse_words(s):
    return " ".join(s.split()[::-1])

# Check if s2 is rotation of s1
def is_rotation(s1, s2):
    return len(s1) == len(s2) and s2 in s1 + s1

# Run-length encoding
def encode(s):
    if not s:
        return ""
    result = []
    count = 1
    for i in range(1, len(s)):
        if s[i] == s[i-1]:
            count += 1
        else:
            result.append(s[i-1] + str(count))
            count = 1
    result.append(s[-1] + str(count))
    return "".join(result)

# String compression (only if shorter)
def compress(s):
    encoded = encode(s)
    return encoded if len(encoded) < len(s) else s`}
            </pre>
          </div>
        </>
      ),
    },
  ],

  operations: [
    {
      name: "Access s[i]",
      average: "O(1)",
      worst: "O(1)",
      note: "Direct index access, like arrays.",
    },
    {
      name: "Slice s[i:j]",
      average: "O(j-i)",
      worst: "O(n)",
      note: "Creates new string. Copying takes time.",
    },
    {
      name: "Concatenation s + t",
      average: "O(n+m)",
      worst: "O(n+m)",
      note: "Creates new string. Avoid in loops.",
    },
    {
      name: "Search (in)",
      average: "O(n×m)",
      worst: "O(n×m)",
      note: "Naive substring search. Usually fast in practice.",
    },
    {
      name: "len(s)",
      average: "O(1)",
      worst: "O(1)",
      note: "Length stored as metadata.",
    },
    {
      name: "s.split()",
      average: "O(n)",
      worst: "O(n)",
      note: "Scans entire string.",
    },
    {
      name: "''.join(list)",
      average: "O(n)",
      worst: "O(n)",
      note: "Efficient way to build strings.",
    },
    {
      name: "sorted(s)",
      average: "O(n log n)",
      worst: "O(n log n)",
      note: "Returns sorted list of characters.",
    },
  ],

  patterns: [
    {
      id: "two-pointer-palindrome",
      name: "Two pointers for palindromes",
      tag: "Essential",
      tagColor: "teal",
      description:
        "Check palindrome with left and right pointers moving inward. Skip non-alphanumeric for 'valid palindrome' variants. O(n) time, O(1) space.",
      explanation: `Palindrome checking is the canonical two-pointer string problem. The insight is simple: a palindrome mirrors around its center, so characters at corresponding positions from both ends must match. Start pointers at both ends, compare, move inward, repeat until they meet.

The pattern adapts to different constraints. "Valid palindrome" ignores non-alphanumeric characters and case—add inner while loops to skip invalid characters before comparing. "Valid palindrome II" allows removing one character—when a mismatch occurs, try both possibilities (skip left or skip right) and check if either substring is a palindrome.

This O(n) time, O(1) space approach beats converting to list and reversing (O(n) space) or comparing s == s[::-1] (which creates a new string). For interview communication, the two-pointer approach is also more explicit about the logic and easier to extend to variants.`,
      triggers: "\"is palindrome\", \"check palindrome\", \"reads same forwards and backwards\", \"valid palindrome\", \"almost palindrome\"",
      code: `def is_palindrome(s):
    left, right = 0, len(s) - 1

    while left < right:
        # Skip non-alphanumeric (for valid palindrome)
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1

    return True

# Check if removing at most one char makes palindrome
def valid_palindrome_ii(s):
    def check(l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1
            r -= 1
        return True

    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            # Try skipping left or right
            return check(left + 1, right) or check(left, right - 1)
        left += 1
        right -= 1
    return True`,
      problems: [],
    },
    {
      id: "expand-center-palindrome",
      name: "Expand from center (longest palindrome)",
      tag: "Classic",
      tagColor: "accent",
      description:
        "For each position, expand outward while characters match. Check both odd (single center) and even (two-char center) lengths. O(n²) time.",
      explanation: `While checking if a string is a palindrome goes inward from ends, finding palindromic substrings goes outward from centers. Every palindrome has a center—either a single character (odd length) or a gap between two characters (even length). By trying each possible center and expanding while characters match, you find all palindromes.

For each center, expansion takes O(n) worst case (the entire string is a palindrome). With O(n) centers, total complexity is O(n²). This beats the O(n³) brute force of checking all O(n²) substrings with O(n) each.

The key implementation detail: handle both odd and even centers. For odd, start with left = right = i. For even, start with left = i, right = i + 1. The expansion logic is identical—just different starting points. Keep track of the longest palindrome found (for longest palindromic substring) or count valid palindromes (for palindromic substrings count).`,
      triggers: "\"longest palindromic substring\", \"count palindromic substrings\", \"find all palindromes\", \"palindrome centered at\"",
      code: `def longest_palindrome(s):
    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]

    result = ""
    for i in range(len(s)):
        # Odd length palindrome (single center)
        odd = expand(i, i)
        if len(odd) > len(result):
            result = odd

        # Even length palindrome (two-char center)
        even = expand(i, i + 1)
        if len(even) > len(result):
            result = even

    return result

# Count all palindromic substrings
def count_palindromes(s):
    count = 0
    for i in range(len(s)):
        # Odd length
        left = right = i
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
        # Even length
        left, right = i, i + 1
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
    return count`,
      problems: [],
    },
    {
      id: "char-frequency",
      name: "Character frequency counting",
      tag: "High frequency",
      tagColor: "green",
      description:
        "Count character occurrences with a hashmap or fixed-size array (26 for lowercase). Foundation for anagrams, permutations, and window problems.",
      explanation: `Character frequency is the string-specific application of the frequency counting pattern. The twist: when working with lowercase letters only, a fixed-size array of 26 elements (indexed by ord(c) - ord('a')) beats a hashmap in both speed and space. This micro-optimization appears frequently in string problems.

Anagram checking reduces to frequency comparison. Two strings are anagrams if and only if they have identical character frequencies. Counter equality handles this elegantly, but understanding the underlying comparison (same keys, same values) helps when you need variations like "can we make an anagram by removing k characters?"

The pattern chains with sliding windows. For "find all anagrams in a string," maintain a frequency map of the current window. When the window slides, increment the entering character's count and decrement the leaving character's count. Compare window frequency to target frequency—or use a "matches" counter to track how many characters have correct frequencies, avoiding repeated full comparisons.`,
      triggers: "\"anagram\", \"character frequency\", \"same characters\", \"permutation of\", \"first unique\", \"character count\"",
      code: `from collections import Counter

# Fixed array for lowercase letters
def char_count_array(s):
    count = [0] * 26
    for c in s:
        count[ord(c) - ord('a')] += 1
    return count

# Check anagram
def is_anagram(s, t):
    return Counter(s) == Counter(t)

# Group anagrams by frequency signature
def group_anagrams(strs):
    groups = {}
    for s in strs:
        # Use sorted tuple as key
        key = tuple(sorted(s))
        # Or use count tuple: tuple(char_count_array(s))
        if key not in groups:
            groups[key] = []
        groups[key].append(s)
    return list(groups.values())

# First unique character
def first_unique(s):
    count = Counter(s)
    for i, c in enumerate(s):
        if count[c] == 1:
            return i
    return -1`,
      problems: [],
    },
    {
      id: "sliding-window-string",
      name: "Sliding window with frequency map",
      tag: "Important",
      tagColor: "amber",
      description:
        "Maintain a window of characters with frequency tracking. Expand right, shrink left based on constraints. O(n) for most problems.",
      explanation: `String sliding window problems often require tracking character frequencies within the current window. The pattern combines array sliding window mechanics with hashmap-based frequency tracking. As the window moves, you update the frequency map incrementally: increment for entering characters, decrement (and delete if zero) for leaving characters.

"Longest substring without repeating characters" uses a hashmap to track last seen positions. When you encounter a repeat, jump the window start past the previous occurrence. The key subtlety: check if the previous occurrence is within the current window (last_seen[char] >= left) before jumping.

"Find all anagrams" uses a fixed-size window matching the target length. Compare the window's character frequency to the target's frequency. Optimization: instead of comparing entire Counter objects each step, track how many characters have matching counts. When matches equal the number of distinct characters in the target, you've found an anagram.`,
      triggers: "\"substring without repeating\", \"find anagrams\", \"minimum window substring\", \"longest substring with k distinct\", \"window containing all\"",
      code: `def length_of_longest_substring(s):
    """Longest substring without repeating characters."""
    seen = {}
    left = 0
    max_len = 0

    for right, char in enumerate(s):
        if char in seen and seen[char] >= left:
            left = seen[char] + 1
        seen[char] = right
        max_len = max(max_len, right - left + 1)

    return max_len

def find_anagrams(s, p):
    """Find all anagram start indices of p in s."""
    from collections import Counter

    if len(p) > len(s):
        return []

    p_count = Counter(p)
    window = Counter(s[:len(p)])
    result = []

    if window == p_count:
        result.append(0)

    for i in range(len(p), len(s)):
        # Add new char to window
        window[s[i]] += 1
        # Remove leftmost char from window
        left_char = s[i - len(p)]
        window[left_char] -= 1
        if window[left_char] == 0:
            del window[left_char]

        if window == p_count:
            result.append(i - len(p) + 1)

    return result`,
      problems: [],
    },
    {
      id: "string-builder",
      name: "Efficient string building",
      tag: "Essential",
      tagColor: "coral",
      description:
        "Avoid O(n²) concatenation by collecting characters in a list, then joining at the end. Critical for any problem that builds strings character by character.",
      explanation: `String immutability in Python and JavaScript creates a performance trap. Each concatenation (result += char) allocates a new string and copies all previous content. For n concatenations, you copy 1 + 2 + 3 + ... + n = O(n²) characters total.

The fix is simple: collect characters in a list, then join at the end. list.append is O(1) amortized. "".join(list) is O(n), copying each character exactly once. Total: O(n). This pattern should be automatic whenever you build strings incrementally.

The pattern extends to building with separators. Instead of result = result + separator + next_item (three allocations per iteration), use items.append(next_item) and separator.join(items) (one pass at the end). For complex formatting, consider f-strings or format() for readability, but for heavy iteration, list + join wins on performance.`,
      triggers: "\"build string\", \"concatenate\", \"construct string\", \"reverse string\", \"string compression\", \"modify characters\"",
      code: `# Bad: O(n²) due to string immutability
def build_bad(chars):
    result = ""
    for c in chars:
        result += c  # Creates new string each time
    return result

# Good: O(n) with list + join
def build_good(chars):
    result = []
    for c in chars:
        result.append(c)
    return "".join(result)

# Practical example: reverse words
def reverse_words(s):
    words = s.split()
    return " ".join(words[::-1])

# In-place style (for interviews asking "no extra space")
def reverse_string(s):
    """Reverse list of chars in-place."""
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1`,
      problems: [],
    },
    {
      id: "trie-prefix",
      name: "Trie for prefix operations",
      tag: "Advanced",
      tagColor: "accent",
      description:
        "A trie (prefix tree) stores strings with shared prefixes efficiently. O(m) search/insert where m is word length. Use for autocomplete, prefix matching, word dictionaries.",
      explanation: `A trie (prefix tree) organizes strings by their prefixes, sharing common prefixes in the tree structure. Each node represents a character position, with edges labeled by characters. A path from root to a node spells out a prefix; nodes marked as "end" indicate complete words.

The key advantage over a hashset is prefix operations. "Does any word start with X?" is O(m) in a trie—just follow the path. In a hashset, you'd need to check every word: O(n×m). For autocomplete ("give me all words starting with X"), traverse to X's node, then collect all words in that subtree.

Common applications: implementing dictionary with search and startsWith, word search II (find all dictionary words in a grid), and longest common prefix among strings. The trie also enables optimizations like early termination—if a prefix doesn't exist in the trie, no word with that prefix exists. In word search problems, this prunes dead-end paths immediately.`,
      triggers: "\"prefix search\", \"starts with\", \"autocomplete\", \"word dictionary\", \"implement trie\", \"word search\", \"longest common prefix\"",
      code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word):
        node = self._find_node(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._find_node(prefix) is not None

    def _find_node(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node

# Usage
trie = Trie()
trie.insert("apple")
trie.search("apple")    # True
trie.search("app")      # False
trie.starts_with("app") # True`,
      problems: [],
    },
  ],

  problems: [
    {
      id: "valid-palindrome",
      title: "Valid Palindrome",
      difficulty: "easy",
      description:
        "Given a string s, return true if it is a palindrome after converting all uppercase letters to lowercase and removing all non-alphanumeric characters.",
      examples: [
        {
          input: 's = "A man, a plan, a canal: Panama"',
          output: "true",
          explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
        {
          input: 's = "race a car"',
          output: "false",
          explanation: '"raceacar" is not a palindrome.',
        },
      ],
      starterCode: `function isPalindrome(s) {
  // Your solution here

}`,
      solution: `function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // Skip non-alphanumeric from left
    while (left < right && !isAlphanumeric(s[left])) {
      left++;
    }
    // Skip non-alphanumeric from right
    while (left < right && !isAlphanumeric(s[right])) {
      right--;
    }

    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

function isAlphanumeric(c) {
  return /[a-zA-Z0-9]/.test(c);
}`,
      hints: [
        "Use two pointers from opposite ends.",
        "Skip characters that aren't letters or numbers.",
        "Compare characters case-insensitively.",
        "Continue until pointers meet in the middle.",
      ],
      testCases: [
        {
          input: 'isPalindrome("A man, a plan, a canal: Panama")',
          expected: "true",
          description: "Classic palindrome with punctuation",
        },
        {
          input: 'isPalindrome("race a car")',
          expected: "false",
          description: "Not a palindrome",
        },
        {
          input: 'isPalindrome(" ")',
          expected: "true",
          description: "Empty after filtering",
        },
      ],
    },
    {
      id: "longest-palindromic-substring",
      title: "Longest Palindromic Substring",
      difficulty: "medium",
      description:
        "Given a string s, return the longest palindromic substring in s.",
      examples: [
        {
          input: 's = "babad"',
          output: '"bab" or "aba"',
          explanation: "Both are valid answers.",
        },
        {
          input: 's = "cbbd"',
          output: '"bb"',
        },
      ],
      starterCode: `function longestPalindrome(s) {
  // Your solution here

}`,
      solution: `function longestPalindrome(s) {
  if (s.length < 2) return s;

  let start = 0;
  let maxLen = 1;

  function expandFromCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const len = right - left + 1;
      if (len > maxLen) {
        start = left;
        maxLen = len;
      }
      left--;
      right++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    // Odd length palindrome
    expandFromCenter(i, i);
    // Even length palindrome
    expandFromCenter(i, i + 1);
  }

  return s.substring(start, start + maxLen);
}`,
      hints: [
        "Brute force: check all substrings O(n³). Can we do better?",
        "A palindrome expands equally from its center.",
        "Try each position as a center and expand outward.",
        "Handle both odd-length (single center) and even-length (two centers) cases.",
      ],
      testCases: [
        {
          input: '["bab", "aba"].includes(longestPalindrome("babad"))',
          expected: "true",
          description: "Multiple valid answers",
        },
        {
          input: 'longestPalindrome("cbbd")',
          expected: '"bb"',
          description: "Even length palindrome",
        },
        {
          input: 'longestPalindrome("a")',
          expected: '"a"',
          description: "Single character",
        },
      ],
    },
    {
      id: "longest-substring-no-repeat",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      description:
        "Given a string s, find the length of the longest substring without repeating characters.",
      examples: [
        {
          input: 's = "abcabcbb"',
          output: "3",
          explanation: 'The answer is "abc", with length 3.',
        },
        {
          input: 's = "bbbbb"',
          output: "1",
        },
        {
          input: 's = "pwwkew"',
          output: "3",
        },
      ],
      starterCode: `function lengthOfLongestSubstring(s) {
  // Your solution here

}`,
      solution: `function lengthOfLongestSubstring(s) {
  const seen = {}; // char -> last index
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // If char seen and within current window, move left past it
    if (seen[char] !== undefined && seen[char] >= left) {
      left = seen[char] + 1;
    }

    seen[char] = right;
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}`,
      hints: [
        "This is a sliding window problem.",
        "Track the last index where each character was seen.",
        "When you see a repeat, jump the window start past the previous occurrence.",
        "Only jump if the previous occurrence is within the current window.",
      ],
      testCases: [
        {
          input: 'lengthOfLongestSubstring("abcabcbb")',
          expected: "3",
          description: "Standard case",
        },
        {
          input: 'lengthOfLongestSubstring("bbbbb")',
          expected: "1",
          description: "All same characters",
        },
        {
          input: 'lengthOfLongestSubstring("pwwkew")',
          expected: "3",
          description: "Multiple valid substrings",
        },
        {
          input: 'lengthOfLongestSubstring("")',
          expected: "0",
          description: "Empty string",
        },
      ],
    },
    {
      id: "string-to-integer",
      title: "String to Integer (atoi)",
      difficulty: "medium",
      description:
        "Implement the myAtoi function, which converts a string to a 32-bit signed integer. Handle leading whitespace, optional sign, and overflow.",
      examples: [
        {
          input: 's = "42"',
          output: "42",
        },
        {
          input: 's = "   -42"',
          output: "-42",
          explanation: "Leading whitespace and negative sign.",
        },
        {
          input: 's = "4193 with words"',
          output: "4193",
          explanation: "Stops at non-digit.",
        },
      ],
      starterCode: `function myAtoi(s) {
  // Your solution here

}`,
      solution: `function myAtoi(s) {
  const INT_MAX = 2147483647;
  const INT_MIN = -2147483648;

  let i = 0;
  const n = s.length;

  // Skip leading whitespace
  while (i < n && s[i] === ' ') {
    i++;
  }

  if (i === n) return 0;

  // Check sign
  let sign = 1;
  if (s[i] === '+' || s[i] === '-') {
    sign = s[i] === '-' ? -1 : 1;
    i++;
  }

  // Parse digits
  let result = 0;
  while (i < n && s[i] >= '0' && s[i] <= '9') {
    const digit = s[i].charCodeAt(0) - '0'.charCodeAt(0);

    // Check overflow before adding
    if (result > Math.floor((INT_MAX - digit) / 10)) {
      return sign === 1 ? INT_MAX : INT_MIN;
    }

    result = result * 10 + digit;
    i++;
  }

  return sign * result;
}`,
      hints: [
        "Handle edge cases in order: whitespace, sign, digits, overflow.",
        "Stop parsing at the first non-digit character.",
        "Check for overflow BEFORE multiplying/adding to avoid actual overflow.",
        "32-bit signed integer range: [-2^31, 2^31 - 1].",
      ],
      testCases: [
        {
          input: 'myAtoi("42")',
          expected: "42",
          description: "Simple positive",
        },
        {
          input: 'myAtoi("   -42")',
          expected: "-42",
          description: "Whitespace and sign",
        },
        {
          input: 'myAtoi("4193 with words")',
          expected: "4193",
          description: "Stops at non-digit",
        },
        {
          input: 'myAtoi("-91283472332")',
          expected: "-2147483648",
          description: "Underflow clamping",
        },
      ],
    },
    {
      id: "group-anagrams",
      title: "Group Anagrams",
      difficulty: "medium",
      description:
        "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
      examples: [
        {
          input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
          output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        },
        {
          input: 'strs = [""]',
          output: '[[""]]',
        },
      ],
      starterCode: `function groupAnagrams(strs) {
  // Your solution here

}`,
      solution: `function groupAnagrams(strs) {
  const groups = {};

  for (const s of strs) {
    // Use sorted string as key
    const key = s.split('').sort().join('');

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(s);
  }

  return Object.values(groups);
}`,
      hints: [
        "Anagrams have the same characters, just rearranged.",
        "If you sort the characters of an anagram, you get the same string.",
        "Use the sorted string as a hashmap key.",
        "Alternative: use character count tuple as key for O(n) instead of O(n log n) per word.",
      ],
      testCases: [
        {
          input: 'groupAnagrams(["eat","tea","tan","ate","nat","bat"]).map(g => g.sort()).sort((a,b) => a[0].localeCompare(b[0]))',
          expected: JSON.stringify([["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]),
          description: "Standard grouping",
        },
        {
          input: 'groupAnagrams([""])',
          expected: '[[""]]',
          description: "Empty string",
        },
        {
          input: 'groupAnagrams(["a"])',
          expected: '[["a"]]',
          description: "Single character",
        },
      ],
    },
  ],
};
