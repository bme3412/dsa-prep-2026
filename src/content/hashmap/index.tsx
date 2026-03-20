import { HashFunctionDemo } from "../../visualizations/hashmap/HashFunctionDemo";
import { BucketArrayViz } from "../../visualizations/hashmap/BucketArrayViz";
import { CollisionDemo } from "../../visualizations/hashmap/CollisionDemo";
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

export const hashmapContent: DataStructure = {
  id: "hashmap",
  name: "Hashmaps",
  icon: "#",
  tagline:
    "O(1) average-case lookups. The most important data structure for coding interviews.",
  description:
    "Master the hashmap patterns that appear in 40%+ of coding interviews. Learn when to use frequency counts, two-sum lookups, and seen-set tracking.",
  color: "accent",
  viewMode: "pattern-first",

  sections: [
    {
      id: "what-and-why",
      title: "What problem do hashmaps solve?",
      subtitle: "From O(n) scanning to O(1) direct access",
      content: (
        <>
          <Prose>
            Searching through an unsorted list for a value means checking every
            element one by one — that's O(n). With 5,000 stocks in a universe,
            looking up a single ticker means potentially 5,000 comparisons.
          </Prose>
          <Prose>
            Hashmaps solve this by converting your key into an array index using
            a <strong>hash function</strong>, so you can jump directly to where
            the data lives. Three components work together: a{" "}
            <strong>key</strong> (what you're looking up), a{" "}
            <strong>hash function</strong> (converts the key to an index), and a{" "}
            <strong>bucket array</strong> (where values actually live).
          </Prose>
        </>
      ),
    },
    {
      id: "hash-function",
      title: "The hash function",
      subtitle: "Converting keys into array indices",
      content: (
        <>
          <Prose>
            A hash function takes any input and produces a fixed-size integer.
            The modulo operator (%) then constrains that integer to a valid
            array index. Try hashing different tickers below to see how it
            works:
          </Prose>
          <HashFunctionDemo />
          <Prose>
            A good hash function distributes keys evenly across buckets. A bad
            one clusters keys together, causing collisions. Python's built-in{" "}
            <CodeInline>hash()</CodeInline> uses a sophisticated algorithm —
            for strings, it multiplies each character's value by a prime and
            accumulates. The simple sum shown above is for illustration.
          </Prose>
        </>
      ),
    },
    {
      id: "bucket-array",
      title: "The bucket array",
      subtitle: "Where your data actually lives",
      content: (
        <>
          <Prose>
            Under the hood, a hashmap is just an array. Each slot (bucket) can
            hold a key-value pair. The hash function determines which slot each
            pair goes into. Click on buckets below to see how insertions work:
          </Prose>
          <BucketArrayViz />
        </>
      ),
    },
    {
      id: "collisions",
      title: "Collisions & resolution",
      subtitle: "What happens when two keys hash to the same index",
      content: (
        <>
          <Prose>
            Since the bucket array has finite size, different keys will
            inevitably hash to the same index. This is a{" "}
            <strong>collision</strong>. There are two main strategies for
            handling them:
          </Prose>
          <CollisionDemo />
          <Prose>
            <strong>Chaining</strong> stores a linked list at each bucket.
            Colliding keys get appended to the list. Lookup walks the chain
            until it finds the matching key.
          </Prose>
          <Prose>
            <strong>Open addressing</strong> (linear probing) checks the next
            bucket when a collision occurs, continuing until an empty slot is
            found. Python's <CodeInline>dict</CodeInline> uses a version of
            this with more sophisticated probing.
          </Prose>
          <Prose>
            Collisions are why hashmaps are O(1) <em>average</em> case, not
            guaranteed. In the worst case (every key hashes to the same
            bucket), you're back to O(n). In practice with a good hash
            function and reasonable load factor, this almost never happens.
          </Prose>
        </>
      ),
    },
    {
      id: "load-factor",
      title: "Load factor & resizing",
      subtitle: "Why hashmaps stay fast as they grow",
      content: (
        <>
          <Prose>
            The <strong>load factor</strong> = number of entries / number of
            buckets. As it increases, collisions become more likely and
            performance degrades. Most implementations resize (typically
            doubling the bucket array) when the load factor exceeds a threshold
            — Python's dict resizes at ~⅔ full.
          </Prose>
          <Prose>
            Resizing is O(n) because every key must be rehashed to its new
            position in the larger array. But since resizing happens
            infrequently (each resize doubles capacity), the amortized cost of
            insertions remains O(1).
          </Prose>
        </>
      ),
    },
    {
      id: "python-dict",
      title: "Python's dict internals",
      subtitle: "What you're actually using in interviews",
      content: (
        <>
          <Prose>
            Python dicts (3.7+) preserve insertion order — this is guaranteed
            behavior, not an implementation detail. Keys must be hashable
            (immutable): <CodeInline>str</CodeInline>,{" "}
            <CodeInline>int</CodeInline>, <CodeInline>tuple</CodeInline>,{" "}
            <CodeInline>frozenset</CodeInline> work. Lists and sets cannot be
            keys.
          </Prose>
          <Prose>
            Key idioms to know: <CodeInline>d.get(key, default)</CodeInline>{" "}
            for safe lookups, <CodeInline>d.setdefault(key, [])</CodeInline>{" "}
            for initialize-if-missing, <CodeInline>Counter</CodeInline> from
            collections for frequency counting, and{" "}
            <CodeInline>defaultdict</CodeInline> for automatic default values.
          </Prose>
        </>
      ),
    },
  ],

  operations: [
    {
      name: "Insert",
      average: "O(1)",
      worst: "O(n)",
      note: "Hash key, place in bucket. O(n) if all keys collide.",
    },
    {
      name: "Lookup",
      average: "O(1)",
      worst: "O(n)",
      note: "Hash key, go directly to bucket.",
    },
    {
      name: "Delete",
      average: "O(1)",
      worst: "O(n)",
      note: "Hash key, remove from bucket.",
    },
    {
      name: "Search by value",
      average: "O(n)",
      worst: "O(n)",
      note: "Values aren't indexed — must scan all.",
    },
    {
      name: "key in dict",
      average: "O(1)",
      worst: "O(n)",
      note: "Same as lookup — checks key existence.",
    },
  ],

  patterns: [
    {
      id: "frequency-counting",
      name: "Frequency counting",
      tag: "Most common",
      tagColor: "teal",
      description:
        "Count how many times each element appears. Foundation for many other patterns. Use Counter or manual dict increment.",
      explanation: `Frequency counting is the bread and butter of hashmap problems. The core idea is simple: iterate through your data once, and for each element, either initialize its count to 1 or increment an existing count. This transforms questions about "how many" or "most/least frequent" into O(n) operations.

The pattern appears in disguise across many problems. "Find the majority element" is frequency counting plus a max lookup. "Check if two strings are anagrams" is comparing two frequency maps. "Find the first unique character" is frequency counting followed by a second pass to find count == 1.

Python's Counter from collections is syntactic sugar for this pattern—it's literally a dict subclass that counts. But understanding the manual version (using dict.get with a default) is essential because you'll need to modify it for variations like "count occurrences that satisfy a condition" or "track additional metadata per key."`,
      triggers: "\"how many times\", \"frequency\", \"count occurrences\", \"most common\", \"majority element\", \"anagram\", \"permutation\", \"duplicate count\"",
      code: `from collections import Counter

# Manual counting
freq = {}
for char in s:
    freq[char] = freq.get(char, 0) + 1

# Counter (same thing, cleaner)
freq = Counter(s)

# Check if two strings are anagrams
def is_anagram(s, t):
    return Counter(s) == Counter(t)`,
      problems: [],
    },
    {
      id: "complement-lookup",
      name: "Two Sum / complement lookup",
      tag: "Classic",
      tagColor: "accent",
      description:
        "Find pairs that satisfy a condition. Store what you've seen, check if the complement exists. The key insight: instead of checking every pair O(n²), use the hashmap to check complements in O(1).",
      explanation: `Two Sum is the quintessential hashmap problem because it perfectly demonstrates the paradigm shift from brute force to hash-based thinking. The naive approach—check every pair—is O(n²). But notice that for each element, you know exactly what partner you need: target - current. The question becomes "have I seen this partner before?" which is a perfect hashmap query.

This insight generalizes far beyond addition. Any time you're looking for pairs that satisfy some relationship, ask yourself: "Given one element, can I compute what its partner must be?" If yes, store elements as you go and query for partners. This works for differences (target - num), products (target / num if divisible), XOR complements, and more.

The pattern extends to k-sum problems. Three Sum reduces to "for each element, find a Two Sum in the remaining array." This is why Two Sum is considered foundational—it's a building block for an entire class of problems. The hashmap converts the inner loop from O(n) to O(1), dropping the total complexity by a factor of n.`,
      triggers: "\"pair\", \"two numbers that\", \"sum equals\", \"find complement\", \"difference equals\", \"Two Sum\", \"Three Sum\", \"target sum\"",
      code: `def two_sum(nums, target):
    seen = {}  # value → index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:      # O(1) lookup
            return [seen[complement], i]
        seen[num] = i               # Store for future`,
      problems: [],
    },
    {
      id: "grouping",
      name: "Grouping / bucketing",
      tag: "High frequency",
      tagColor: "amber",
      description:
        "Group elements by a shared property. Key = the grouping criterion, Value = list of elements that share it. The trick is choosing the right key.",
      explanation: `Grouping transforms a flat list into a structured collection based on shared properties. The hashmap key is the "signature" that defines group membership—elements with the same key belong together. The art is choosing the right key function.

For group anagrams, the key insight is that anagrams, when sorted, produce identical strings. So sorted("eat") = sorted("tea") = "aet". This becomes the grouping key. Alternative: use a tuple of character counts as the key, which is O(n) per word instead of O(n log n) for sorting.

This pattern generalizes: group points by quadrant (key = sign of x, sign of y), group timestamps by hour (key = timestamp // 3600), group strings by length (key = len(s)). The mental model is "project each element onto a simpler representation where equivalent things map to the same point." defaultdict(list) is your friend here—it auto-initializes empty lists, eliminating the if-key-not-in-dict boilerplate.`,
      triggers: "\"group by\", \"categorize\", \"bucket\", \"cluster\", \"anagram groups\", \"same [property]\", \"partition into\"",
      code: `from collections import defaultdict

# Group anagrams: sorted chars as key
def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())`,
      problems: [],
    },
    {
      id: "seen-set",
      name: "Seen set / deduplication",
      tag: "Essential",
      tagColor: "green",
      description:
        "Track what you've already processed. A set is a hashmap with no values — O(1) membership checks. Use when you need to detect duplicates or track visited states.",
      explanation: `A set is a hashmap stripped to its essence: it answers "have I seen this before?" in O(1). This simple question underlies a huge number of problems. Duplicate detection is the obvious one, but the pattern extends to cycle detection, visited tracking in graph traversals, and constraint checking.

The set's power comes from reducing a potentially O(n) scan to O(1). Without a set, checking if an element exists requires linear search. With a set, you pay O(n) total to build it once, then O(1) per query forever after. This amortization is key to understanding when sets help.

In graph problems, the "visited set" prevents infinite loops by tracking which nodes you've already explored. In sliding window problems, a set can track which elements are currently in the window. The pattern shifts from "have I ever seen this?" to "is this currently active?" depending on whether you add only (permanent memory) or add and remove (working memory).`,
      triggers: "\"contains duplicate\", \"already seen\", \"visited\", \"unique elements\", \"first occurrence\", \"cycle detection\", \"avoid repeating\"",
      code: `# Contains duplicate
def has_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:    # O(1) check
            return True
        seen.add(num)
    return False`,
      problems: [],
    },
    {
      id: "index-mapping",
      name: "Index / position mapping",
      tag: "Medium frequency",
      tagColor: "coral",
      description:
        "Remember where you saw something. Key = element, Value = index or position. Essential for sliding window and substring problems.",
      explanation: `Index mapping extends the "seen" pattern by remembering not just whether you've seen something, but where. This positional information enables a new class of optimizations, particularly in sliding window problems.

Consider "longest substring without repeating characters." The naive approach shrinks the window one character at a time when a repeat is found. But if you know the last position of the repeated character, you can jump directly past it. This transforms potential O(n²) shrinking into O(n) total.

The key insight is that the stored index answers: "if I need to exclude this element, where should my window start?" For sliding window problems, you often track last_seen[char] and compare it to your current window start. If the duplicate is outside your window (last_seen[char] < start), you can ignore it—it's already excluded. This "is it in my current window?" check is subtle but essential.`,
      triggers: "\"last position of\", \"index of previous\", \"sliding window with hashmap\", \"longest substring\", \"where did I last see\"",
      code: `# Longest substring without repeating chars
def length_of_longest(s):
    last_seen = {}      # char → last index
    start = 0
    max_len = 0
    for i, char in enumerate(s):
        if char in last_seen and last_seen[char] >= start:
            start = last_seen[char] + 1
        last_seen[char] = i
        max_len = max(max_len, i - start + 1)
    return max_len`,
      problems: [],
    },
    {
      id: "prefix-sum",
      name: "Prefix sum + hashmap",
      tag: "Advanced",
      tagColor: "coral",
      description:
        "Find subarrays with a target sum. Store running sums and check if (current_sum - target) was seen before. Transforms an O(n²) nested loop into O(n).",
      explanation: `This pattern combines prefix sums with complement lookup—it's Two Sum's sophisticated cousin. The key insight: the sum of subarray [i, j] equals prefix[j] - prefix[i-1]. So if you want subarrays summing to k, you need prefix[j] - prefix[i] = k, which means prefix[i] = prefix[j] - k.

This is exactly the Two Sum pattern applied to prefix sums. As you compute running sums, store each in a hashmap. At position j, check if (current_sum - k) exists in the map. If so, there's a subarray ending at j that sums to k, starting right after wherever that prefix sum occurred.

Why {0: 1} initialization? It handles subarrays starting at index 0. If current_sum equals k, you need prefix[i] = 0 to exist, meaning "the subarray from the start." This edge case trips up many people. The count value (not just presence) matters when the same prefix sum can occur multiple times—each occurrence represents a different valid starting point.`,
      triggers: "\"subarray sum equals\", \"contiguous sum\", \"number of subarrays\", \"cumulative sum target\", \"continuous subarray\"",
      code: `def subarray_sum(nums, k):
    prefix_count = {0: 1}  # sum → times seen
    curr_sum = 0
    result = 0
    for num in nums:
        curr_sum += num
        if curr_sum - k in prefix_count:
            result += prefix_count[curr_sum - k]
        prefix_count[curr_sum] = \\
            prefix_count.get(curr_sum, 0) + 1
    return result`,
      problems: [],
    },
  ],

  problems: [
    {
      id: "two-sum",
      title: "Two Sum",
      difficulty: "easy",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. Each input has exactly one solution, and you may not use the same element twice.",
      examples: [
        {
          input: "nums = [2, 7, 11, 15], target = 9",
          output: "[0, 1]",
          explanation: "nums[0] + nums[1] = 2 + 7 = 9",
        },
        {
          input: "nums = [3, 2, 4], target = 6",
          output: "[1, 2]",
        },
      ],
      starterCode: `function twoSum(nums, target) {
  // Your solution here
  
}`,
      solution: `function twoSum(nums, target) {
  const seen = {}; // value → index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (complement in seen) {
      return [seen[complement], i];
    }
    seen[nums[i]] = i;
  }
}`,
      hints: [
        "Brute force: check every pair with nested loops → O(n²). Can we do better?",
        "For each number, we know what its complement must be: target - current",
        "If we store each number we've seen in a hashmap, we can check for the complement in O(1)",
        "Key = number value, Value = its index. One pass through the array.",
      ],
      testCases: [
        {
          input: "twoSum([2, 7, 11, 15], 9)",
          expected: "[0,1]",
          description: "Basic case",
        },
        {
          input: "twoSum([3, 2, 4], 6)",
          expected: "[1,2]",
          description: "Non-adjacent pair",
        },
        {
          input: "twoSum([3, 3], 6)",
          expected: "[0,1]",
          description: "Duplicate values",
        },
      ],
    },
    {
      id: "valid-anagram",
      title: "Valid Anagram",
      difficulty: "easy",
      description:
        "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram uses all the original letters exactly once.",
      examples: [
        {
          input: 's = "anagram", t = "nagaram"',
          output: "true",
        },
        {
          input: 's = "rat", t = "car"',
          output: "false",
        },
      ],
      starterCode: `function isAnagram(s, t) {
  // Your solution here
  
}`,
      solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const freq = {};
  for (const c of s) {
    freq[c] = (freq[c] || 0) + 1;
  }
  for (const c of t) {
    if (!freq[c]) return false;
    freq[c]--;
  }
  return true;
}`,
      hints: [
        "If lengths differ, they can't be anagrams.",
        "Count character frequencies in one string.",
        "Then decrement for each character in the other string. If any count goes below zero, it's not an anagram.",
      ],
      testCases: [
        {
          input: 'isAnagram("anagram", "nagaram")',
          expected: "true",
          description: "Valid anagram",
        },
        {
          input: 'isAnagram("rat", "car")',
          expected: "false",
          description: "Not an anagram",
        },
        {
          input: 'isAnagram("", "")',
          expected: "true",
          description: "Empty strings",
        },
        {
          input: 'isAnagram("ab", "a")',
          expected: "false",
          description: "Different lengths",
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
          output: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
        },
      ],
      starterCode: `function groupAnagrams(strs) {
  // Your solution here
  
}`,
      solution: `function groupAnagrams(strs) {
  const groups = {};
  for (const s of strs) {
    // Sort characters as grouping key
    const key = s.split('').sort().join('');
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  }
  return Object.values(groups);
}`,
      hints: [
        "Anagrams have the same characters, just rearranged.",
        "If you sort the characters of an anagram, you get the same string.",
        "Use the sorted string as a hashmap key. All anagrams map to the same key.",
      ],
      testCases: [
        {
          input: 'groupAnagrams(["eat","tea","tan","ate","nat","bat"]).map(g => g.sort()).sort((a,b) => a[0].localeCompare(b[0]))',
          expected: JSON.stringify(
            [
              ["ate", "eat", "tea"],
              ["bat"],
              ["nat", "tan"],
            ]
          ),
          description: "Standard grouping",
        },
        {
          input: 'groupAnagrams([""])',
          expected: '[[""]]',
          description: "Single empty string",
        },
        {
          input: 'groupAnagrams(["a"])',
          expected: '[["a"]]',
          description: "Single character",
        },
      ],
    },
    {
      id: "contains-duplicate",
      title: "Contains Duplicate",
      difficulty: "easy",
      description:
        "Given an integer array nums, return true if any value appears at least twice in the array, and false if every element is distinct.",
      examples: [
        { input: "nums = [1, 2, 3, 1]", output: "true" },
        { input: "nums = [1, 2, 3, 4]", output: "false" },
      ],
      starterCode: `function containsDuplicate(nums) {
  // Your solution here
  
}`,
      solution: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}`,
      hints: [
        "Brute force: compare every pair → O(n²). Better approach?",
        "Use a Set — it's a hashmap with O(1) membership checks.",
        "As you iterate, check if the current number is already in the set.",
      ],
      testCases: [
        {
          input: "containsDuplicate([1, 2, 3, 1])",
          expected: "true",
          description: "Has duplicate",
        },
        {
          input: "containsDuplicate([1, 2, 3, 4])",
          expected: "false",
          description: "All unique",
        },
        {
          input: "containsDuplicate([])",
          expected: "false",
          description: "Empty array",
        },
      ],
    },
    {
      id: "top-k-frequent",
      title: "Top K Frequent Elements",
      difficulty: "medium",
      description:
        "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
      examples: [
        { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1, 2]" },
        { input: "nums = [1], k = 1", output: "[1]" },
      ],
      starterCode: `function topKFrequent(nums, k) {
  // Your solution here
  
}`,
      solution: `function topKFrequent(nums, k) {
  // Step 1: Count frequencies
  const freq = {};
  for (const n of nums) {
    freq[n] = (freq[n] || 0) + 1;
  }
  // Step 2: Bucket sort by frequency
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of Object.entries(freq)) {
    buckets[count].push(Number(num));
  }
  // Step 3: Collect top k from highest buckets
  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i]);
  }
  return result.slice(0, k);
}`,
      hints: [
        "First step: count the frequency of each element using a hashmap.",
        "Now you need the k most frequent. Sorting works but is O(n log n).",
        "Bucket sort trick: create an array where index = frequency, value = list of numbers with that frequency.",
        "Walk backwards from the highest frequency bucket, collecting until you have k elements.",
      ],
      testCases: [
        {
          input: "topKFrequent([1,1,1,2,2,3], 2).sort((a,b) => a-b)",
          expected: "[1,2]",
          description: "Top 2 frequent",
        },
        {
          input: "topKFrequent([1], 1)",
          expected: "[1]",
          description: "Single element",
        },
        {
          input: "topKFrequent([4,4,4,3,3,2,2,2,2,1], 2).sort((a,b) => a-b)",
          expected: "[2,4]",
          description: "Tied frequencies",
        },
      ],
    },
  ],
};
