import { HashFunctionDemo } from "../../visualizations/hashmap/HashFunctionDemo";
import { BucketArrayViz } from "../../visualizations/hashmap/BucketArrayViz";
import { CollisionDemo } from "../../visualizations/hashmap/CollisionDemo";
import type { DataStructure } from "../../types";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
    {children}
  </p>
);

const Strong = ({ children }: { children: React.ReactNode }) => (
  <strong className="text-[var(--color-text-primary)] font-semibold">
    {children}
  </strong>
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

const KeyPoint = ({ children }: { children: React.ReactNode }) => (
  <div
    className="text-sm p-3 rounded-lg border-l-2 my-3"
    style={{
      background: "var(--color-accent-glow)",
      borderColor: "var(--color-accent)",
    }}
  >
    {children}
  </div>
);

const Callout = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div
    className="text-sm p-4 rounded-lg my-3"
    style={{ background: "var(--color-bg-tertiary)" }}
  >
    <p className="font-semibold text-[var(--color-text-primary)] mb-2">{title}</p>
    <div className="text-[var(--color-text-secondary)]">{children}</div>
  </div>
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
            element one by one — that's <Strong>O(n) linear time</Strong>. With 5,000 stocks in a universe,
            looking up a single ticker means potentially 5,000 comparisons. Do this for every trade in a day's volume, and you're looking at billions of operations.
          </Prose>
          <Prose>
            Hashmaps solve this by converting your key into an array index using
            a <Strong>hash function</Strong>, so you can jump directly to where
            the data lives. This transformation is the key insight: <Strong>instead of searching, you calculate</Strong>.
          </Prose>
          <KeyPoint>
            <Strong>The Core Tradeoff:</Strong> Hashmaps trade <Strong>space for time</Strong>. You use extra memory to store the hash table, but gain O(1) access. This is almost always worth it in interviews and real applications.
          </KeyPoint>
          <Prose>
            Three components work together: a <Strong>key</Strong> (what you're looking up, e.g., "AAPL"), a <Strong>hash function</Strong> (converts the key to an integer index), and a <Strong>bucket array</Strong> (the underlying array where values actually live).
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
            A hash function takes any input and produces a <Strong>fixed-size integer</Strong>.
            The modulo operator (%) then constrains that integer to a valid
            array index. Try hashing different tickers below to see how it
            works:
          </Prose>
          <HashFunctionDemo />
          <Prose>
            <Strong>Properties of a good hash function:</Strong>
          </Prose>
          <Callout title="Deterministic">
            The same input must always produce the same output. <CodeInline>hash("AAPL")</CodeInline> can't return different values on different calls — otherwise lookups would fail.
          </Callout>
          <Callout title="Uniform Distribution">
            Keys should spread evenly across buckets. A hash function that maps half your keys to the same bucket defeats the purpose — you're back to O(n) for those keys.
          </Callout>
          <Callout title="Fast to Compute">
            The hash function runs on every insert, lookup, and delete. If hashing takes O(n) time for a string of length n, your "O(1)" lookup is actually O(n).
          </Callout>
          <Prose>
            Python's built-in <CodeInline>hash()</CodeInline> uses a sophisticated algorithm —
            for strings, it multiplies each character's value by a prime and
            accumulates. The simple sum shown above is for illustration only. <Strong>Never implement your own hash function in production</Strong> — use language built-ins.
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
            Under the hood, a hashmap is just an array. Each slot (called a <Strong>bucket</Strong>) can
            hold a key-value pair. The hash function determines which slot each
            pair goes into. Click on buckets below to see how insertions work:
          </Prose>
          <BucketArrayViz />
          <Prose>
            <Strong>Why "bucket"?</Strong> Because each slot can potentially hold multiple items (when collisions occur). Think of each array position as a container that might hold several key-value pairs that happened to hash to the same index.
          </Prose>
          <KeyPoint>
            <Strong>Mental Model:</Strong> Think of a hashmap as a library. The hash function is like the Dewey Decimal System — it tells you exactly which shelf (bucket) to check. Instead of scanning every book, you go directly to the right location.
          </KeyPoint>
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
            inevitably hash to the same index. This is a <Strong>collision</Strong>. With a 10-bucket array, if you insert 11 items, at least two must share a bucket (pigeonhole principle). In practice, collisions happen much sooner due to the <Strong>birthday paradox</Strong>.
          </Prose>
          <CollisionDemo />
          <Prose>
            <Strong>Two main collision resolution strategies:</Strong>
          </Prose>
          <Callout title="Chaining (Separate Chaining)">
            Each bucket stores a <Strong>linked list</Strong> of all key-value pairs that hash to that index. On lookup, you hash to find the bucket, then walk the list comparing keys until you find a match. <Strong>Average chain length = load factor</Strong>.
          </Callout>
          <Callout title="Open Addressing (Linear Probing)">
            When a collision occurs, check the <Strong>next bucket</Strong>, and keep going until you find an empty slot. Lookup does the same — probe until you find the key or an empty slot. <Strong>Python's dict uses a variant of this</Strong> with more sophisticated probing.
          </Callout>
          <KeyPoint>
            <Strong>Why O(1) is "average case":</Strong> Collisions are why hashmaps are O(1) <em>average</em>, not guaranteed. In the worst case (every key hashes to the same bucket), you're back to O(n). But with a good hash function and reasonable load factor, the expected chain length is constant, so operations remain O(1) in practice.
          </KeyPoint>
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
            The <Strong>load factor</Strong> = number of entries / number of
            buckets. It measures how "full" the hashmap is. As load factor increases, collisions become more likely and performance degrades.
          </Prose>
          <Callout title="Load Factor Thresholds">
            Most implementations resize when load factor exceeds a threshold:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><Strong>Python dict:</Strong> resizes at ~⅔ full (0.67)</li>
              <li><Strong>Java HashMap:</Strong> resizes at 0.75</li>
              <li><Strong>Trade-off:</Strong> Lower threshold = more memory, fewer collisions. Higher threshold = less memory, more collisions.</li>
            </ul>
          </Callout>
          <Prose>
            <Strong>Resizing is O(n)</Strong> because every key must be rehashed to its new position in the larger array. The hash function uses modulo array-size, so a different array size means different bucket assignments.
          </Prose>
          <KeyPoint>
            <Strong>Amortized O(1):</Strong> Resizing happens infrequently because each resize doubles capacity. You pay O(n) occasionally, but spread across n insertions, each insertion "pays" O(1) on average. This is called <Strong>amortized analysis</Strong> — the same reasoning behind dynamic array (list) append being O(1).
          </KeyPoint>
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
            <Strong>Python dicts (3.7+) preserve insertion order</Strong> — this is guaranteed
            behavior, not an implementation detail. This means you can iterate over a dict and get keys in the order they were added.
          </Prose>
          <Callout title="Hashable Keys">
            Keys must be <Strong>hashable</Strong> (immutable):
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><Strong>Valid keys:</Strong> <CodeInline>str</CodeInline>, <CodeInline>int</CodeInline>, <CodeInline>float</CodeInline>, <CodeInline>tuple</CodeInline> (if contents are hashable), <CodeInline>frozenset</CodeInline></li>
              <li><Strong>Invalid keys:</Strong> <CodeInline>list</CodeInline>, <CodeInline>dict</CodeInline>, <CodeInline>set</CodeInline> — mutable objects can't be hashed because their hash would change if modified</li>
            </ul>
          </Callout>
          <Prose>
            <Strong>Essential dict idioms for interviews:</Strong>
          </Prose>
          <Callout title="Safe Lookups">
            <CodeInline>d.get(key, default)</CodeInline> returns default if key doesn't exist, avoiding KeyError. Compare: <CodeInline>d[key]</CodeInline> raises KeyError if key missing.
          </Callout>
          <Callout title="Initialize-if-Missing">
            <CodeInline>d.setdefault(key, [])</CodeInline> returns existing value or sets and returns default. Perfect for building lists-of-values.
          </Callout>
          <Callout title="Counter">
            <CodeInline>from collections import Counter</CodeInline> — a dict subclass designed for counting. <CodeInline>Counter("aab")</CodeInline> gives <CodeInline>{`{'a': 2, 'b': 1}`}</CodeInline>.
          </Callout>
          <Callout title="defaultdict">
            <CodeInline>from collections import defaultdict</CodeInline> — auto-initializes missing keys. <CodeInline>defaultdict(list)</CodeInline> means any missing key returns an empty list.
          </Callout>
        </>
      ),
    },
    {
      id: "when-to-use",
      title: "When to use (and not use) hashmaps",
      subtitle: "Recognizing the right tool for the job",
      content: (
        <>
          <Prose>
            <Strong>Use a hashmap when:</Strong>
          </Prose>
          <Callout title="Fast Lookup by Key">
            You need to quickly check existence or retrieve a value by some identifier. "Is this stock in our portfolio?" "What's the price of AAPL?"
          </Callout>
          <Callout title="Counting / Frequency">
            You need to count occurrences of items. "How many times does each character appear?" "What's the most common word?"
          </Callout>
          <Callout title="Grouping / Indexing">
            You need to group items by some property. "Group all anagrams together." "Index transactions by date."
          </Callout>
          <Callout title="Caching / Memoization">
            You want to avoid recomputing expensive results. Store input→output mappings for instant retrieval.
          </Callout>
          <Prose>
            <Strong>Don't use a hashmap when:</Strong>
          </Prose>
          <Callout title="You Need Ordering">
            Hashmaps don't maintain sorted order by key. If you need "all stocks between A and M" or "the 5 smallest values," use a <Strong>sorted array</Strong>, <Strong>BST</Strong>, or <Strong>heap</Strong>.
          </Callout>
          <Callout title="You Need Range Queries">
            "Find all values between 10 and 20" requires scanning the entire hashmap — O(n). A BST or sorted array does this in O(log n + k).
          </Callout>
          <Callout title="Memory is Extremely Tight">
            Hashmaps have overhead: load factor means ~30-50% of buckets are empty. Arrays are more memory-efficient for dense integer keys.
          </Callout>
          <KeyPoint>
            <Strong>Interview Signal:</Strong> If a problem mentions "sorted," "range," "k-th smallest/largest," or "next greater," a hashmap probably isn't the primary tool — but might still help as a supporting structure.
          </KeyPoint>
        </>
      ),
    },
    {
      id: "common-mistakes",
      title: "Common mistakes & pitfalls",
      subtitle: "Bugs that trip up even experienced developers",
      content: (
        <>
          <Callout title="Mutating While Iterating">
            <Strong>Bug:</Strong> Adding or removing keys while looping over a dict causes <CodeInline>RuntimeError: dictionary changed size during iteration</CodeInline>.
            <br /><Strong>Fix:</Strong> Iterate over a copy: <CodeInline>for k in list(d.keys())</CodeInline> or build a separate list of keys to remove.
          </Callout>
          <Callout title="Using Mutable Objects as Keys">
            <Strong>Bug:</Strong> Using a list as a dict key: <CodeInline>d[[1,2]] = "value"</CodeInline> raises <CodeInline>TypeError: unhashable type: 'list'</CodeInline>.
            <br /><Strong>Fix:</Strong> Convert to tuple: <CodeInline>d[tuple([1,2])] = "value"</CodeInline> or use <CodeInline>frozenset</CodeInline> for set-like keys.
          </Callout>
          <Callout title="Forgetting the Default in .get()">
            <Strong>Bug:</Strong> <CodeInline>d.get(key)</CodeInline> returns <CodeInline>None</CodeInline> if key missing, which can cause subtle bugs if you then do <CodeInline>d.get(key) + 1</CodeInline>.
            <br /><Strong>Fix:</Strong> Always specify default for arithmetic: <CodeInline>d.get(key, 0) + 1</CodeInline>.
          </Callout>
          <Callout title="Off-by-One in Two Sum Pattern">
            <Strong>Bug:</Strong> Adding current element to the map <em>before</em> checking for complement can cause false positives when target is 2x the element.
            <br /><Strong>Fix:</Strong> Always check for complement first, then add current element. Order matters!
          </Callout>
          <Callout title="Confusing == with 'in'">
            <Strong>Bug:</Strong> <CodeInline>if key == dict</CodeInline> checks if key equals the entire dict object.
            <br /><Strong>Fix:</Strong> <CodeInline>if key in dict</CodeInline> checks if key exists in dict.
          </Callout>
          <KeyPoint>
            <Strong>Debugging tip:</Strong> When your hashmap solution fails, print the map's contents at each step. Most bugs become obvious when you see the actual state.
          </KeyPoint>
        </>
      ),
    },
    {
      id: "interview-strategy",
      title: "Interview strategy for hashmap problems",
      subtitle: "How to approach these problems systematically",
      content: (
        <>
          <Prose>
            <Strong>Step 1: Recognize the pattern</Strong>
          </Prose>
          <Prose>
            Listen for these trigger phrases: "find pair," "count occurrences," "check if seen," "group by," "first unique," "subarray sum." Each maps to a specific hashmap pattern.
          </Prose>
          <Prose>
            <Strong>Step 2: Identify what's the key and what's the value</Strong>
          </Prose>
          <Prose>
            This is the critical design decision. Ask yourself: "What am I looking up?" (that's the key) and "What do I need to know about it?" (that's the value).
          </Prose>
          <Callout title="Common Key-Value Schemas">
            <ul className="list-disc list-inside space-y-1">
              <li><Strong>Two Sum:</Strong> key = value, value = index</li>
              <li><Strong>Frequency count:</Strong> key = element, value = count</li>
              <li><Strong>Grouping:</Strong> key = category/signature, value = list of items</li>
              <li><Strong>Seen tracking:</Strong> key = element, value = (none, use a set)</li>
              <li><Strong>Position tracking:</Strong> key = element, value = last index seen</li>
            </ul>
          </Callout>
          <Prose>
            <Strong>Step 3: Consider edge cases</Strong>
          </Prose>
          <Prose>
            Empty input, single element, all duplicates, negative numbers, zero as a key. Especially watch for the "element equals its own complement" case (e.g., target=6, array has 3 — can you use the same 3 twice?).
          </Prose>
          <Prose>
            <Strong>Step 4: State complexity clearly</Strong>
          </Prose>
          <Prose>
            Always mention: <Strong>Time: O(n)</Strong> for single pass, <Strong>Space: O(n)</Strong> for the hashmap in worst case. Interviewers love hearing you articulate the space-time tradeoff.
          </Prose>
          <KeyPoint>
            <Strong>Pro tip:</Strong> When stuck, ask yourself: "What if I could instantly answer 'have I seen X before?' for any X?" If that would help, you need a hashmap.
          </KeyPoint>
        </>
      ),
    },
  ],

  operations: [
    {
      name: "Insert / Update",
      average: "O(1)",
      worst: "O(n)",
      note: "Hash key, place in bucket. O(n) if all keys collide or resize triggers.",
    },
    {
      name: "Lookup",
      average: "O(1)",
      worst: "O(n)",
      note: "Hash key, go directly to bucket. O(n) if all keys in same bucket.",
    },
    {
      name: "Delete",
      average: "O(1)",
      worst: "O(n)",
      note: "Hash key, remove from bucket. Same collision caveat.",
    },
    {
      name: "Search by Value",
      average: "O(n)",
      worst: "O(n)",
      note: "Values aren't indexed — must scan all entries.",
    },
    {
      name: "key in dict",
      average: "O(1)",
      worst: "O(n)",
      note: "Same as lookup — checks key existence only.",
    },
    {
      name: "Iteration",
      average: "O(n)",
      worst: "O(n)",
      note: "Must visit every entry. Order is insertion order (Python 3.7+).",
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
      explanation: `**Frequency counting** is the bread and butter of hashmap problems. The core idea is simple: iterate through your data once, and for each element, either initialize its count to 1 or increment an existing count. This transforms questions about "how many" or "most/least frequent" into O(n) operations.

**The key insight:** You're trading O(1) space per unique element for instant frequency lookup. Without a hashmap, finding "how many times does X appear?" requires scanning the entire array — O(n) per query. With a frequency map, it's O(1).

**Pattern recognition triggers:**
- "how many times" / "count occurrences"
- "most common" / "least common"
- "majority element" (appears > n/2 times)
- "anagram" / "permutation" (same character frequencies)
- "find duplicates" / "elements that appear k times"

**Variations you'll encounter:**
1. **Simple counting:** Build map, query frequencies
2. **Compare two maps:** Anagram check (Counter(s) == Counter(t))
3. **Conditional counting:** Count only elements meeting criteria
4. **Running frequency:** Update counts as you process (sliding window)

**Python's Counter** from collections is syntactic sugar — it's literally a dict subclass. But understanding the manual version is essential for interviews where you need custom logic.`,
      triggers: "\"how many times\", \"frequency\", \"count occurrences\", \"most common\", \"majority element\", \"anagram\", \"permutation\", \"duplicate count\"",
      code: `from collections import Counter

# Manual counting (know this cold)
freq = {}
for char in s:
    freq[char] = freq.get(char, 0) + 1

# Counter (same thing, cleaner)
freq = Counter(s)

# Check if two strings are anagrams
def is_anagram(s, t):
    return Counter(s) == Counter(t)

# Find majority element (appears > n/2 times)
def majority_element(nums):
    freq = Counter(nums)
    for num, count in freq.items():
        if count > len(nums) // 2:
            return num`,
      problems: [],
    },
    {
      id: "complement-lookup",
      name: "Two Sum / complement lookup",
      tag: "Classic",
      tagColor: "accent",
      description:
        "Find pairs that satisfy a condition. Store what you've seen, check if the complement exists. The key insight: instead of checking every pair O(n²), use the hashmap to check complements in O(1).",
      explanation: `**Two Sum** is the quintessential hashmap problem because it perfectly demonstrates the paradigm shift from brute force to hash-based thinking.

**The naive approach:** Check every pair of elements — O(n²). For each element, scan the rest of the array for its complement.

**The key insight:** For each element, you know *exactly* what partner you need: target - current. The question becomes "have I seen this partner before?" which is a perfect hashmap query.

**The pattern:**
1. For each element, compute its complement (target - current)
2. Check if complement exists in hashmap (O(1))
3. If yes, found a pair. If no, add current element to hashmap
4. Continue

**Critical detail:** Add to the map *after* checking for complement, not before. Otherwise, if target=6 and current=3, you'd find 3 as its own complement!

**Why this generalizes:** Any time you're looking for pairs satisfying some relationship:
- Sum: complement = target - num
- Difference: complement = num ± target
- Product: complement = target / num (if divisible)
- XOR: complement = target ^ num

**Extension to k-Sum:** Three Sum reduces to "for each element, find a Two Sum in the remaining array." This is why Two Sum is foundational — it's a building block for an entire class of problems.`,
      triggers: "\"pair\", \"two numbers that\", \"sum equals\", \"find complement\", \"difference equals\", \"Two Sum\", \"Three Sum\", \"target sum\"",
      code: `def two_sum(nums, target):
    seen = {}  # value → index
    for i, num in enumerate(nums):
        complement = target - num
        # Check FIRST, then add (order matters!)
        if complement in seen:      # O(1) lookup
            return [seen[complement], i]
        seen[num] = i               # Store for future

    # No pair found
    return []

# Three Sum reduces to nested Two Sum
def three_sum(nums, target):
    nums.sort()
    result = []
    for i, num in enumerate(nums):
        # Skip duplicates
        if i > 0 and nums[i] == nums[i-1]:
            continue
        # Two Sum on remaining array
        two_sum_target = target - num
        # ... two pointer approach on sorted remainder`,
      problems: [],
    },
    {
      id: "grouping",
      name: "Grouping / bucketing",
      tag: "High frequency",
      tagColor: "amber",
      description:
        "Group elements by a shared property. Key = the grouping criterion, Value = list of elements that share it. The trick is choosing the right key.",
      explanation: `**Grouping** transforms a flat list into a structured collection based on shared properties. The hashmap key is the "signature" that defines group membership — elements with the same key belong together.

**The art is choosing the right key function.** This is where creativity matters:

**Group Anagrams example:**
- Observation: Anagrams, when sorted, produce identical strings
- Key function: sorted("eat") = sorted("tea") = "aet"
- Alternative: tuple of character counts — O(n) per word vs O(n log n) for sorting

**Common grouping keys:**
- **Sorted characters:** for anagram grouping
- **Character count tuple:** (count_a, count_b, ...) for anagram grouping
- **Modulo value:** group numbers by remainder (group by num % k)
- **String length:** group by len(s)
- **First character:** group alphabetically
- **Custom hash:** any property you can compute consistently

**The pattern:**
\`\`\`python
groups = defaultdict(list)  # Auto-initializes empty lists
for item in items:
    key = compute_key(item)  # Your grouping function
    groups[key].append(item)
return list(groups.values())
\`\`\`

**Why defaultdict?** It eliminates the "check if key exists, if not initialize" boilerplate. Without it, you'd need:
\`\`\`python
if key not in groups:
    groups[key] = []
groups[key].append(item)
\`\`\``,
      triggers: "\"group by\", \"categorize\", \"bucket\", \"cluster\", \"anagram groups\", \"same [property]\", \"partition into\"",
      code: `from collections import defaultdict

# Group anagrams: sorted chars as key
def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))  # or ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())

# Alternative: character count as key (faster for long strings)
def group_anagrams_v2(strs):
    groups = defaultdict(list)
    for s in strs:
        count = [0] * 26
        for c in s:
            count[ord(c) - ord('a')] += 1
        groups[tuple(count)].append(s)
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
      explanation: `**A set is a hashmap stripped to its essence:** it answers "have I seen this before?" in O(1). This simple question underlies a huge number of problems.

**Why sets matter:**
- Without a set: checking existence requires O(n) linear scan
- With a set: O(1) per check, O(n) total to build

**Two modes of operation:**

**1. Permanent memory (add-only):**
- Duplicate detection: "does this array contain duplicates?"
- First occurrence: "find the first character that appears only once"
- Visited tracking in graphs: "have I explored this node?"

**2. Working memory (add and remove):**
- Sliding window: "track elements currently in the window"
- Character set in substring: "longest substring without repeating characters"
- State tracking: "what values are currently active?"

**The pattern:**
\`\`\`python
seen = set()
for item in items:
    if item in seen:
        # Already processed this item
        handle_duplicate(item)
    else:
        seen.add(item)
\`\`\`

**Set vs Dict:**
- Use **set** when you only care about presence/absence
- Use **dict** when you also need associated data (count, index, etc.)

**Memory insight:** Sets use roughly the same memory as dicts (they're implemented similarly). The "no value" in a set is still a pointer internally.`,
      triggers: "\"contains duplicate\", \"already seen\", \"visited\", \"unique elements\", \"first occurrence\", \"cycle detection\", \"avoid repeating\"",
      code: `# Contains duplicate - the simplest set problem
def has_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:    # O(1) check
            return True
        seen.add(num)
    return False

# One-liner using set property
def has_duplicate_v2(nums):
    return len(nums) != len(set(nums))

# Find first unique character
def first_unique_char(s):
    freq = Counter(s)
    for i, c in enumerate(s):
        if freq[c] == 1:
            return i
    return -1

# Intersection of two arrays
def intersection(nums1, nums2):
    return list(set(nums1) & set(nums2))`,
      problems: [],
    },
    {
      id: "index-mapping",
      name: "Index / position mapping",
      tag: "Medium frequency",
      tagColor: "coral",
      description:
        "Remember where you saw something. Key = element, Value = index or position. Essential for sliding window and substring problems.",
      explanation: `**Index mapping** extends the "seen" pattern by remembering not just *whether* you've seen something, but *where*. This positional information enables a new class of optimizations.

**The key insight:** The stored index answers "if I need to exclude this element, where should my window start?"

**Classic application: Longest Substring Without Repeating Characters**

Naive approach: When you find a repeat, shrink window one character at a time — potentially O(n²).

Optimized approach: Jump directly past the previous occurrence of the repeated character — O(n).

**The pattern:**
\`\`\`python
last_seen = {}  # element → most recent index
start = 0       # current window start

for i, item in enumerate(items):
    if item in last_seen and last_seen[item] >= start:
        # Item is in current window — must shrink
        start = last_seen[item] + 1
    last_seen[item] = i  # Update position
    # Current window is [start, i]
\`\`\`

**Critical subtlety:** The condition \`last_seen[item] >= start\` checks if the previous occurrence is *in the current window*. If it's before the window start, we can ignore it — it's already excluded.

**Variations:**
- **First occurrence:** Store index only if not already present
- **All occurrences:** Store list of indices (for finding patterns)
- **Most recent:** Always overwrite (for sliding window)`,
      triggers: "\"last position of\", \"index of previous\", \"sliding window with hashmap\", \"longest substring\", \"where did I last see\"",
      code: `# Longest substring without repeating chars
def length_of_longest(s):
    last_seen = {}      # char → last index
    start = 0           # window start
    max_len = 0

    for i, char in enumerate(s):
        # If char in window, shrink window past it
        if char in last_seen and last_seen[char] >= start:
            start = last_seen[char] + 1

        last_seen[char] = i  # Update position
        max_len = max(max_len, i - start + 1)

    return max_len

# Example trace for "abcabcbb":
# i=0, char='a': window=[0,0], max=1
# i=1, char='b': window=[0,1], max=2
# i=2, char='c': window=[0,2], max=3
# i=3, char='a': 'a' at 0 >= start(0), start=1, window=[1,3], max=3
# i=4, char='b': 'b' at 1 >= start(1), start=2, window=[2,4], max=3
# ...`,
      problems: [],
    },
    {
      id: "prefix-sum",
      name: "Prefix sum + hashmap",
      tag: "Advanced",
      tagColor: "coral",
      description:
        "Find subarrays with a target sum. Store running sums and check if (current_sum - target) was seen before. Transforms an O(n²) nested loop into O(n).",
      explanation: `**This pattern combines prefix sums with complement lookup** — it's Two Sum's sophisticated cousin.

**The key insight:** The sum of subarray [i+1, j] equals prefix[j] - prefix[i].

So if you want subarrays summing to k:
- You need: prefix[j] - prefix[i] = k
- Rearranging: prefix[i] = prefix[j] - k
- This is exactly Two Sum on prefix sums!

**The pattern:**
\`\`\`python
prefix_count = {0: 1}  # sum → times seen
curr_sum = 0
result = 0

for num in nums:
    curr_sum += num
    complement = curr_sum - k
    if complement in prefix_count:
        result += prefix_count[complement]
    prefix_count[curr_sum] = prefix_count.get(curr_sum, 0) + 1

return result
\`\`\`

**Why {0: 1} initialization?**
This handles subarrays starting at index 0. If curr_sum equals k, you need prefix[i] = 0 to exist, meaning "the subarray from the beginning." Without this initialization, you'd miss these cases.

**Why store count, not just presence?**
The same prefix sum can occur multiple times. Each occurrence represents a different valid starting point for a subarray ending at the current position.

**Example:** nums = [1, -1, 1, 1, -1, 1], k = 2
- Multiple subarrays sum to 2
- The same prefix sum (e.g., 1) might appear multiple times
- Each creates different valid subarrays`,
      triggers: "\"subarray sum equals\", \"contiguous sum\", \"number of subarrays\", \"cumulative sum target\", \"continuous subarray\"",
      code: `def subarray_sum(nums, k):
    prefix_count = {0: 1}  # sum → times seen
    curr_sum = 0
    result = 0

    for num in nums:
        curr_sum += num

        # Check for complement (Two Sum logic)
        complement = curr_sum - k
        if complement in prefix_count:
            result += prefix_count[complement]

        # Add current sum to map
        prefix_count[curr_sum] = prefix_count.get(curr_sum, 0) + 1

    return result

# Trace for nums=[1,1,1], k=2:
# i=0: sum=1, complement=-1 (not found), map={0:1, 1:1}
# i=1: sum=2, complement=0 (found, count=1), result=1, map={0:1, 1:1, 2:1}
# i=2: sum=3, complement=1 (found, count=1), result=2, map={0:1, 1:1, 2:1, 3:1}
# Answer: 2 (subarrays [1,1] at indices [0,1] and [1,2])`,
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
      starterCode: `def two_sum(nums, target):
    # Your solution here
    pass`,
      solution: `def two_sum(nums, target):
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i`,
      hints: [
        "Brute force: check every pair with nested loops -> O(n²). Can we do better?",
        "For each number, we know what its complement must be: target - current",
        "If we store each number we've seen in a hashmap, we can check for the complement in O(1)",
        "Key = number value, Value = its index. One pass through the array.",
      ],
      testCases: [
        {
          input: "two_sum([2, 7, 11, 15], 9)",
          expected: "[0, 1]",
          description: "Basic case",
        },
        {
          input: "two_sum([3, 2, 4], 6)",
          expected: "[1, 2]",
          description: "Non-adjacent pair",
        },
        {
          input: "two_sum([3, 3], 6)",
          expected: "[0, 1]",
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
      starterCode: `def is_anagram(s, t):
    # Your solution here
    pass`,
      solution: `def is_anagram(s, t):
    if len(s) != len(t):
        return False
    freq = {}
    for c in s:
        freq[c] = freq.get(c, 0) + 1
    for c in t:
        if c not in freq or freq[c] == 0:
            return False
        freq[c] -= 1
    return True`,
      hints: [
        "If lengths differ, they can't be anagrams.",
        "Count character frequencies in one string.",
        "Then decrement for each character in the other string. If any count goes below zero, it's not an anagram.",
      ],
      testCases: [
        {
          input: 'is_anagram("anagram", "nagaram")',
          expected: "true",
          description: "Valid anagram",
        },
        {
          input: 'is_anagram("rat", "car")',
          expected: "false",
          description: "Not an anagram",
        },
        {
          input: 'is_anagram("", "")',
          expected: "true",
          description: "Empty strings",
        },
        {
          input: 'is_anagram("ab", "a")',
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
      starterCode: `def group_anagrams(strs):
    # Your solution here
    pass`,
      solution: `def group_anagrams(strs):
    from collections import defaultdict
    groups = defaultdict(list)
    for s in strs:
        # Sort characters as grouping key
        key = ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())`,
      hints: [
        "Anagrams have the same characters, just rearranged.",
        "If you sort the characters of an anagram, you get the same string.",
        "Use the sorted string as a hashmap key. All anagrams map to the same key.",
      ],
      testCases: [
        {
          input: 'len(group_anagrams(["eat","tea","tan","ate","nat","bat"]))',
          expected: "3",
          description: "Standard grouping - 3 groups",
        },
        {
          input: 'group_anagrams([""])',
          expected: '[[""]]',
          description: "Single empty string",
        },
        {
          input: 'group_anagrams(["a"])',
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
      starterCode: `def contains_duplicate(nums):
    # Your solution here
    pass`,
      solution: `def contains_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
      hints: [
        "Brute force: compare every pair -> O(n²). Better approach?",
        "Use a Set - it's a hashmap with O(1) membership checks.",
        "As you iterate, check if the current number is already in the set.",
      ],
      testCases: [
        {
          input: "contains_duplicate([1, 2, 3, 1])",
          expected: "true",
          description: "Has duplicate",
        },
        {
          input: "contains_duplicate([1, 2, 3, 4])",
          expected: "false",
          description: "All unique",
        },
        {
          input: "contains_duplicate([])",
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
      starterCode: `def top_k_frequent(nums, k):
    # Your solution here
    pass`,
      solution: `def top_k_frequent(nums, k):
    from collections import Counter
    # Step 1: Count frequencies
    freq = Counter(nums)
    # Step 2: Bucket sort by frequency
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, count in freq.items():
        buckets[count].append(num)
    # Step 3: Collect top k from highest buckets
    result = []
    for i in range(len(buckets) - 1, -1, -1):
        result.extend(buckets[i])
        if len(result) >= k:
            break
    return result[:k]`,
      hints: [
        "First step: count the frequency of each element using a hashmap.",
        "Now you need the k most frequent. Sorting works but is O(n log n).",
        "Bucket sort trick: create an array where index = frequency, value = list of numbers with that frequency.",
        "Walk backwards from the highest frequency bucket, collecting until you have k elements.",
      ],
      testCases: [
        {
          input: "sorted(top_k_frequent([1,1,1,2,2,3], 2))",
          expected: "[1, 2]",
          description: "Top 2 frequent",
        },
        {
          input: "top_k_frequent([1], 1)",
          expected: "[1]",
          description: "Single element",
        },
        {
          input: "sorted(top_k_frequent([4,4,4,3,3,2,2,2,2,1], 2))",
          expected: "[2, 4]",
          description: "Tied frequencies",
        },
      ],
    },
    {
      id: "subarray-sum-equals-k",
      title: "Subarray Sum Equals K",
      difficulty: "medium",
      description:
        "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k. A subarray is a contiguous non-empty sequence of elements.",
      examples: [
        { input: "nums = [1, 1, 1], k = 2", output: "2", explanation: "Subarrays [1,1] at indices 0-1 and 1-2" },
        { input: "nums = [1, 2, 3], k = 3", output: "2", explanation: "Subarrays [1,2] and [3]" },
      ],
      starterCode: `def subarray_sum(nums, k):
    # Your solution here
    pass`,
      solution: `def subarray_sum(nums, k):
    prefix_count = {0: 1}  # sum -> times seen
    curr_sum = 0
    result = 0
    for num in nums:
        curr_sum += num
        # Check if (curr_sum - k) was seen before
        if curr_sum - k in prefix_count:
            result += prefix_count[curr_sum - k]
        # Add current sum to map
        prefix_count[curr_sum] = prefix_count.get(curr_sum, 0) + 1
    return result`,
      hints: [
        "Brute force: check every subarray sum -> O(n²). Can we do O(n)?",
        "Key insight: sum of subarray [i,j] = prefix[j] - prefix[i-1]",
        "If we want sum = k, we need prefix[j] - prefix[i] = k, so prefix[i] = prefix[j] - k",
        "This is Two Sum on prefix sums! Store running sums, check for (current - k).",
      ],
      testCases: [
        {
          input: "subarray_sum([1, 1, 1], 2)",
          expected: "2",
          description: "Two subarrays sum to 2",
        },
        {
          input: "subarray_sum([1, 2, 3], 3)",
          expected: "2",
          description: "Subarrays [1,2] and [3]",
        },
        {
          input: "subarray_sum([1, -1, 0], 0)",
          expected: "3",
          description: "Multiple zero-sum subarrays",
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
        { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3.' },
        { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with length 1.' },
        { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with length 3.' },
      ],
      starterCode: `def length_of_longest_substring(s):
    # Your solution here
    pass`,
      solution: `def length_of_longest_substring(s):
    last_seen = {}  # char -> last index
    start = 0
    max_len = 0
    for i, char in enumerate(s):
        # If char in current window, shrink window
        if char in last_seen and last_seen[char] >= start:
            start = last_seen[char] + 1
        last_seen[char] = i
        max_len = max(max_len, i - start + 1)
    return max_len`,
      hints: [
        "Use sliding window: maintain a window with no repeating characters.",
        "When you see a repeat, you need to shrink the window. But shrinking one-by-one is slow.",
        "Store the last position of each character. Jump directly past the repeat.",
        "Key check: is the repeat actually in the current window? (last_seen[char] >= start)",
      ],
      testCases: [
        {
          input: 'length_of_longest_substring("abcabcbb")',
          expected: "3",
          description: "Standard case",
        },
        {
          input: 'length_of_longest_substring("bbbbb")',
          expected: "1",
          description: "All same characters",
        },
        {
          input: 'length_of_longest_substring("pwwkew")',
          expected: "3",
          description: "Repeat in middle",
        },
        {
          input: 'length_of_longest_substring("")',
          expected: "0",
          description: "Empty string",
        },
      ],
    },
  ],
};
