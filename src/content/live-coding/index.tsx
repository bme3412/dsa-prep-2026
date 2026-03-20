import { CodeBlock } from "../../components/CodeBlock";
import type { DataStructure } from "../../types";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] mb-3">
    {children}
  </p>
);

const Code = ({ children, language = "python" }: { children: string; language?: "python" | "typescript" | "javascript" }) => (
  <div className="my-4">
    <CodeBlock code={children.trim()} language={language} />
  </div>
);

const Callout = ({
  type,
  children,
}: {
  type: "tip" | "warning" | "insight";
  children: React.ReactNode;
}) => {
  const colors = {
    tip: { bg: "var(--color-green)", border: "var(--color-green)" },
    warning: { bg: "var(--color-coral)", border: "var(--color-coral)" },
    insight: { bg: "var(--color-teal)", border: "var(--color-teal)" },
  };
  const icons = { tip: "💡", warning: "⚠️", insight: "🔍" };
  return (
    <div
      className="rounded-lg p-4 my-4 text-sm"
      style={{
        background: `${colors[type].bg}15`,
        borderLeft: `3px solid ${colors[type].border}`,
      }}
    >
      <span className="mr-2">{icons[type]}</span>
      {children}
    </div>
  );
};

const MethodTable = ({ methods }: { methods: { name: string; desc: string; complexity: string }[] }) => (
  <div className="overflow-x-auto my-4">
    <table className="w-full text-xs">
      <thead>
        <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
          <th className="text-left py-2 px-3 font-semibold" style={{ color: "var(--color-text-primary)" }}>Method</th>
          <th className="text-left py-2 px-3 font-semibold" style={{ color: "var(--color-text-primary)" }}>Description</th>
          <th className="text-left py-2 px-3 font-semibold" style={{ color: "var(--color-text-primary)" }}>Time</th>
        </tr>
      </thead>
      <tbody>
        {methods.map((m, i) => (
          <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
            <td className="py-2 px-3 font-mono" style={{ color: "var(--color-accent)" }}>{m.name}</td>
            <td className="py-2 px-3" style={{ color: "var(--color-text-secondary)" }}>{m.desc}</td>
            <td className="py-2 px-3 font-mono" style={{ color: "var(--color-teal)" }}>{m.complexity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const liveCodingContent: DataStructure = {
  id: "live-coding",
  name: "Live Coding",
  icon: "⚡",
  tagline: "Python patterns and utilities for timed coding tests",
  description:
    "Master the essential Python patterns and built-in methods for HackerRank, CoderPad, and phone screen interviews. Focus on speed, correctness, and clear communication.",
  color: "green",
  viewMode: "pattern-first",

  sections: [
    // ==================== SECTION 1: STRATEGY ====================
    {
      id: "strategy",
      title: "Live Coding Strategy",
      subtitle: "Time management and communication under pressure",
      content: (
        <>
          <Prose>
            Live coding interviews test more than algorithms — they test how you think, communicate, and handle pressure. The difference between passing and failing often comes down to process, not just code correctness.
          </Prose>

          <Callout type="tip">
            <strong>The 45-Minute Framework:</strong> 5 min understand → 10 min plan → 20 min code → 10 min test/optimize
          </Callout>

          <Prose>
            <strong>Step 1: Understand (5 min)</strong> — Before writing any code, clarify the problem completely. Ask about input constraints (size, range, sorted?), edge cases (empty input, duplicates, negative numbers?), and expected output format. Restate the problem in your own words to confirm understanding.
          </Prose>

          <Prose>
            <strong>Step 2: Plan (10 min)</strong> — Walk through your approach verbally before coding. Identify the pattern (two pointers? sliding window? hashmap?). Discuss time/space complexity. The interviewer wants to see your thought process, not just a working solution.
          </Prose>

          <Prose>
            <strong>Step 3: Code (20 min)</strong> — Write clean, readable code. Use descriptive variable names. Talk through what you're doing as you code. Don't optimize prematurely — get a working solution first.
          </Prose>

          <Prose>
            <strong>Step 4: Test (10 min)</strong> — Trace through your code with a simple example. Then test edge cases: empty input, single element, all same values, maximum size. Fix bugs incrementally.
          </Prose>

          <Callout type="warning">
            <strong>When stuck:</strong> (1) Simplify — solve a smaller version first. (2) Brute force — O(n²) that works beats O(n) that doesn't. (3) Talk it out — your thought process matters even if you don't finish.
          </Callout>

          <Prose>
            <strong>Clarifying Questions Checklist:</strong>
          </Prose>
          <Code>{`
# Always ask:
# 1. Input size? (affects time complexity choice)
# 2. Input sorted? (enables binary search, two pointers)
# 3. Duplicates allowed? (affects set vs list choice)
# 4. Negative numbers? (affects sum problems)
# 5. Return format? (indices vs values, list vs count)
# 6. Modify in-place or return new? (space constraints)
`}</Code>
        </>
      ),
    },

    // ==================== SECTION 2: PYTHON SPEED TIPS ====================
    {
      id: "python-tips",
      title: "Python Speed Tips",
      subtitle: "Built-in shortcuts that save precious minutes",
      content: (
        <>
          <Prose>
            Python's standard library has powerful one-liners that can replace 10+ lines of code. Knowing these saves time and reduces bugs. Here are the most interview-relevant shortcuts:
          </Prose>

          <Code>{`
# List comprehensions — filter and transform in one line
squares = [x**2 for x in range(10)]
evens = [x for x in nums if x % 2 == 0]
pairs = [(i, j) for i in range(3) for j in range(3)]

# Dictionary comprehensions
freq = {c: s.count(c) for c in set(s)}  # char frequency
index_map = {v: i for i, v in enumerate(arr)}  # value to index

# Set comprehensions
unique_lengths = {len(word) for word in words}
`}</Code>

          <Prose>
            <strong>Unpacking and multiple assignment</strong> — Swap without temp, unpack tuples, and use starred expressions:
          </Prose>

          <Code>{`
# Swap two values
a, b = b, a

# Unpack with *
first, *middle, last = [1, 2, 3, 4, 5]  # first=1, middle=[2,3,4], last=5

# Multiple assignment
x = y = z = 0  # all three point to 0
`}</Code>

          <Prose>
            <strong>Essential built-in functions:</strong>
          </Prose>

          <MethodTable methods={[
            { name: "enumerate(arr)", desc: "Iterate with index", complexity: "O(1) per item" },
            { name: "zip(a, b)", desc: "Pair elements from two lists", complexity: "O(1) per pair" },
            { name: "sorted(arr, key=...)", desc: "Sort with custom key", complexity: "O(n log n)" },
            { name: "reversed(arr)", desc: "Iterate in reverse (iterator)", complexity: "O(1)" },
            { name: "any(iterable)", desc: "True if any element truthy", complexity: "O(n) worst" },
            { name: "all(iterable)", desc: "True if all elements truthy", complexity: "O(n) worst" },
            { name: "sum(arr)", desc: "Sum all elements", complexity: "O(n)" },
            { name: "min/max(arr)", desc: "Find min/max value", complexity: "O(n)" },
          ]} />

          <Callout type="insight">
            <strong>Gotcha:</strong> <code>sorted()</code> returns a new list, while <code>list.sort()</code> sorts in-place and returns None. Don't do <code>arr = arr.sort()</code> — you'll get None!
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 3: STRING PATTERNS ====================
    {
      id: "strings",
      title: "String Patterns",
      subtitle: "Manipulation, comparison, and transformation",
      content: (
        <>
          <Prose>
            Strings are immutable in Python — every "modification" creates a new string. This affects both your approach and complexity analysis. For repeated concatenation, use <code>list.append()</code> + <code>"".join()</code> instead of <code>+=</code>.
          </Prose>

          <MethodTable methods={[
            { name: "s.split(sep)", desc: "Split into list by separator", complexity: "O(n)" },
            { name: '"".join(list)', desc: "Join list into string", complexity: "O(n)" },
            { name: "s.strip()", desc: "Remove leading/trailing whitespace", complexity: "O(n)" },
            { name: "s.replace(old, new)", desc: "Replace all occurrences", complexity: "O(n)" },
            { name: "s[::-1]", desc: "Reverse string", complexity: "O(n)" },
            { name: "s.lower() / s.upper()", desc: "Case conversion", complexity: "O(n)" },
            { name: "s.isalnum() / isdigit()", desc: "Character type check", complexity: "O(n)" },
            { name: "ord(c) / chr(n)", desc: "Char ↔ ASCII code", complexity: "O(1)" },
          ]} />

          <Code>{`
# Palindrome check — two pointers
def is_palindrome(s: str) -> bool:
    s = s.lower()
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
`}</Code>

          <Code>{`
# Anagram check — Counter comparison
from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)

# Or without Counter:
def is_anagram_alt(s: str, t: str) -> bool:
    return sorted(s) == sorted(t)  # O(n log n)
`}</Code>

          <Code>{`
# Character frequency — the Counter pattern
from collections import Counter

s = "abracadabra"
freq = Counter(s)  # Counter({'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1})
freq.most_common(2)  # [('a', 5), ('b', 2)]

# Manual frequency counting:
freq = {}
for c in s:
    freq[c] = freq.get(c, 0) + 1
`}</Code>

          <Callout type="tip">
            <strong>String building pattern:</strong> Avoid <code>result += char</code> in a loop — it's O(n²). Use <code>chars = []</code>, <code>chars.append(char)</code>, then <code>"".join(chars)</code>.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 4: ARRAY PATTERNS ====================
    {
      id: "arrays",
      title: "Array Patterns",
      subtitle: "Two pointers, prefix sums, and in-place operations",
      content: (
        <>
          <Prose>
            Arrays (Python lists) are the foundation of most coding problems. The key techniques are two pointers, prefix sums, and in-place modification for O(1) space.
          </Prose>

          <MethodTable methods={[
            { name: "arr.append(x)", desc: "Add to end", complexity: "O(1) amortized" },
            { name: "arr.pop()", desc: "Remove from end", complexity: "O(1)" },
            { name: "arr.pop(0)", desc: "Remove from start", complexity: "O(n) — use deque!" },
            { name: "arr.insert(i, x)", desc: "Insert at index", complexity: "O(n)" },
            { name: "arr[::2]", desc: "Every other element", complexity: "O(n)" },
            { name: "arr[::-1]", desc: "Reversed copy", complexity: "O(n)" },
            { name: "arr.sort()", desc: "In-place sort", complexity: "O(n log n)" },
            { name: "sorted(arr)", desc: "Return sorted copy", complexity: "O(n log n)" },
          ]} />

          <Code>{`
# Two pointers — opposite ends (sorted array)
def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    left, right = 0, len(nums) - 1
    while left < right:
        curr_sum = nums[left] + nums[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return []
`}</Code>

          <Code>{`
# In-place reversal — O(1) space
def reverse_in_place(arr: list) -> None:
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
`}</Code>

          <Code>{`
# Prefix sum — O(1) range queries after O(n) preprocessing
def build_prefix_sum(nums: list[int]) -> list[int]:
    prefix = [0]
    for num in nums:
        prefix.append(prefix[-1] + num)
    return prefix

# Sum of nums[i:j] = prefix[j] - prefix[i]
prefix = build_prefix_sum([1, 2, 3, 4, 5])
range_sum = prefix[4] - prefix[1]  # sum of [2, 3, 4] = 9
`}</Code>

          <Code>{`
# Kadane's algorithm — maximum subarray sum
def max_subarray(nums: list[int]) -> int:
    max_sum = curr_sum = nums[0]
    for num in nums[1:]:
        curr_sum = max(num, curr_sum + num)
        max_sum = max(max_sum, curr_sum)
    return max_sum
`}</Code>

          <Callout type="warning">
            <strong>Gotcha:</strong> <code>arr.pop(0)</code> is O(n) because all elements shift. For frequent front removals, use <code>collections.deque</code> with <code>popleft()</code> which is O(1).
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 5: HASHMAP PATTERNS ====================
    {
      id: "hashmap",
      title: "HashMap Patterns",
      subtitle: "Counter, grouping, and complement lookup",
      content: (
        <>
          <Prose>
            Hashmaps (Python dicts) provide O(1) average-case lookup. The key patterns are frequency counting, grouping by key, and complement lookup (Two Sum pattern).
          </Prose>

          <MethodTable methods={[
            { name: "d.get(k, default)", desc: "Get with default value", complexity: "O(1)" },
            { name: "d.setdefault(k, v)", desc: "Get or set default", complexity: "O(1)" },
            { name: "d.items()", desc: "Key-value pairs iterator", complexity: "O(1)" },
            { name: "k in d", desc: "Check key exists", complexity: "O(1)" },
            { name: "Counter(arr)", desc: "Frequency count", complexity: "O(n)" },
            { name: "defaultdict(list)", desc: "Auto-initialize lists", complexity: "O(1)" },
          ]} />

          <Code>{`
# Two Sum — complement lookup pattern
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
`}</Code>

          <Code>{`
# Group anagrams — group by sorted key
from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))  # or "".join(sorted(s))
        groups[key].append(s)
    return list(groups.values())
`}</Code>

          <Code>{`
# Frequency counting with Counter
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    freq = Counter(nums)
    return [num for num, _ in freq.most_common(k)]

# Counter arithmetic
c1 = Counter("aab")  # Counter({'a': 2, 'b': 1})
c2 = Counter("abb")  # Counter({'b': 2, 'a': 1})
c1 + c2  # Counter({'a': 3, 'b': 3})
c1 - c2  # Counter({'a': 1}) — only positive counts kept
`}</Code>

          <Callout type="insight">
            <strong>Pattern recognition:</strong> If you need O(1) lookup, think hashmap. If you need to "find pair that sums to X", think complement lookup. If you need counts, think Counter.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 6: SLIDING WINDOW ====================
    {
      id: "sliding-window",
      title: "Sliding Window",
      subtitle: "Contiguous subarray/substring problems",
      content: (
        <>
          <Prose>
            Sliding window is the go-to pattern for contiguous subarray or substring problems. There are two variants: <strong>fixed-size</strong> (window size k) and <strong>variable-size</strong> (expand until invalid, shrink until valid).
          </Prose>

          <Callout type="tip">
            <strong>Triggers:</strong> "contiguous subarray", "substring", "window of size k", "maximum/minimum with constraint"
          </Callout>

          <Code>{`
# Fixed-size window — max sum of k elements
def max_sum_k(nums: list[int], k: int) -> int:
    # Initialize window
    window_sum = sum(nums[:k])
    max_sum = window_sum

    # Slide window
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]  # add right, remove left
        max_sum = max(max_sum, window_sum)

    return max_sum
`}</Code>

          <Code>{`
# Variable-size window — longest substring without repeating characters
def length_of_longest_substring(s: str) -> int:
    char_index = {}  # char -> last seen index
    max_length = 0
    left = 0

    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1  # shrink window
        char_index[char] = right
        max_length = max(max_length, right - left + 1)

    return max_length
`}</Code>

          <Code>{`
# Variable-size window — minimum window containing all characters
from collections import Counter

def min_window(s: str, t: str) -> str:
    if not t or not s:
        return ""

    need = Counter(t)
    have = {}
    have_count, need_count = 0, len(need)
    result = ""
    left = 0

    for right, char in enumerate(s):
        # Expand window
        have[char] = have.get(char, 0) + 1
        if char in need and have[char] == need[char]:
            have_count += 1

        # Shrink window while valid
        while have_count == need_count:
            if not result or (right - left + 1) < len(result):
                result = s[left:right + 1]

            left_char = s[left]
            have[left_char] -= 1
            if left_char in need and have[left_char] < need[left_char]:
                have_count -= 1
            left += 1

    return result
`}</Code>
        </>
      ),
    },

    // ==================== SECTION 7: BINARY SEARCH ====================
    {
      id: "binary-search",
      title: "Binary Search",
      subtitle: "O(log n) search and the bisect module",
      content: (
        <>
          <Prose>
            Binary search halves the search space each iteration, giving O(log n) time on sorted data. Python's <code>bisect</code> module provides optimized implementations.
          </Prose>

          <MethodTable methods={[
            { name: "bisect_left(arr, x)", desc: "Leftmost position for x", complexity: "O(log n)" },
            { name: "bisect_right(arr, x)", desc: "Rightmost position for x", complexity: "O(log n)" },
            { name: "insort(arr, x)", desc: "Insert maintaining sort", complexity: "O(n)" },
          ]} />

          <Code>{`
# Standard binary search template
def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = left + (right - left) // 2  # avoid overflow
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1  # not found
`}</Code>

          <Code>{`
# Using bisect for insertion point
from bisect import bisect_left, bisect_right

arr = [1, 3, 3, 3, 5, 7]

# Find leftmost occurrence
def first_occurrence(arr, target):
    i = bisect_left(arr, target)
    if i < len(arr) and arr[i] == target:
        return i
    return -1

# Find rightmost occurrence
def last_occurrence(arr, target):
    i = bisect_right(arr, target) - 1
    if i >= 0 and arr[i] == target:
        return i
    return -1

# Count occurrences
def count_occurrences(arr, target):
    return bisect_right(arr, target) - bisect_left(arr, target)
`}</Code>

          <Code>{`
# Binary search on answer — find minimum capacity to ship in D days
def ship_within_days(weights: list[int], days: int) -> int:
    def can_ship(capacity: int) -> bool:
        current_load = 0
        days_needed = 1
        for w in weights:
            if current_load + w > capacity:
                days_needed += 1
                current_load = 0
            current_load += w
        return days_needed <= days

    left, right = max(weights), sum(weights)
    while left < right:
        mid = (left + right) // 2
        if can_ship(mid):
            right = mid
        else:
            left = mid + 1
    return left
`}</Code>

          <Callout type="insight">
            <strong>Binary search on answer:</strong> When asked to "minimize the maximum" or "find the smallest X such that...", binary search on the answer space.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 8: STACK & QUEUE ====================
    {
      id: "stack-queue",
      title: "Stack & Queue",
      subtitle: "LIFO/FIFO operations and monotonic patterns",
      content: (
        <>
          <Prose>
            Stacks (LIFO) and queues (FIFO) are fundamental for traversals and matching problems. Use Python lists for stacks and <code>collections.deque</code> for queues.
          </Prose>

          <MethodTable methods={[
            { name: "stack.append(x)", desc: "Push to stack", complexity: "O(1)" },
            { name: "stack.pop()", desc: "Pop from stack", complexity: "O(1)" },
            { name: "stack[-1]", desc: "Peek top", complexity: "O(1)" },
            { name: "deque.append(x)", desc: "Add to right", complexity: "O(1)" },
            { name: "deque.popleft()", desc: "Remove from left", complexity: "O(1)" },
            { name: "deque.appendleft(x)", desc: "Add to left", complexity: "O(1)" },
          ]} />

          <Code>{`
# Valid parentheses
def is_valid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in pairs:
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
        else:
            stack.append(char)

    return len(stack) == 0
`}</Code>

          <Code>{`
# Monotonic stack — next greater element
def next_greater_element(nums: list[int]) -> list[int]:
    result = [-1] * len(nums)
    stack = []  # indices

    for i, num in enumerate(nums):
        while stack and nums[stack[-1]] < num:
            idx = stack.pop()
            result[idx] = num
        stack.append(i)

    return result
`}</Code>

          <Code>{`
# BFS with deque
from collections import deque

def bfs(graph: dict, start: int) -> list[int]:
    visited = set([start])
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order
`}</Code>

          <Callout type="tip">
            <strong>Monotonic stack pattern:</strong> When you need "next greater/smaller element" or "span problems", think monotonic stack. Maintain a stack where elements are always increasing or decreasing.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 9: SORTING TRICKS ====================
    {
      id: "sorting",
      title: "Sorting Tricks",
      subtitle: "Custom keys, intervals, and comparisons",
      content: (
        <>
          <Prose>
            Python's <code>sorted()</code> and <code>list.sort()</code> use Timsort — O(n log n) guaranteed. The <code>key</code> parameter is your best friend for custom sorting.
          </Prose>

          <Code>{`
# Sort by custom key
intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]

# Sort by start time
intervals.sort(key=lambda x: x[0])

# Sort by end time (for greedy scheduling)
intervals.sort(key=lambda x: x[1])

# Multi-level: sort by start, then by end descending
intervals.sort(key=lambda x: (x[0], -x[1]))
`}</Code>

          <Code>{`
# Merge intervals
def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []

    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for start, end in intervals[1:]:
        if start <= merged[-1][1]:  # overlapping
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])

    return merged
`}</Code>

          <Code>{`
# Custom comparator (rare, but useful for complex sorting)
from functools import cmp_to_key

def largest_number(nums: list[int]) -> str:
    def compare(x, y):
        if x + y > y + x:
            return -1  # x should come first
        elif x + y < y + x:
            return 1
        return 0

    strs = [str(n) for n in nums]
    strs.sort(key=cmp_to_key(compare))

    result = "".join(strs)
    return "0" if result[0] == "0" else result
`}</Code>

          <Callout type="warning">
            <strong>Gotcha:</strong> For descending numeric sort, you can use <code>-x</code> in the key. But for strings, negate doesn't work — use <code>reverse=True</code> or <code>cmp_to_key</code>.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 10: HEAP PATTERNS ====================
    {
      id: "heap",
      title: "Heap Patterns",
      subtitle: "Top-K, merge K, and running statistics",
      content: (
        <>
          <Prose>
            Python's <code>heapq</code> provides a min-heap. For a max-heap, negate values. Heaps are perfect for "K largest/smallest" and streaming problems.
          </Prose>

          <MethodTable methods={[
            { name: "heappush(h, x)", desc: "Push item", complexity: "O(log n)" },
            { name: "heappop(h)", desc: "Pop smallest", complexity: "O(log n)" },
            { name: "heapify(arr)", desc: "Transform list to heap", complexity: "O(n)" },
            { name: "nlargest(k, arr)", desc: "K largest elements", complexity: "O(n log k)" },
            { name: "nsmallest(k, arr)", desc: "K smallest elements", complexity: "O(n log k)" },
          ]} />

          <Code>{`
import heapq

# Top K frequent elements
def top_k_frequent(nums: list[int], k: int) -> list[int]:
    from collections import Counter
    freq = Counter(nums)

    # Use min-heap of size k for O(n log k)
    return heapq.nlargest(k, freq.keys(), key=freq.get)
`}</Code>

          <Code>{`
# Max heap trick — negate values
import heapq

max_heap = []
heapq.heappush(max_heap, -5)
heapq.heappush(max_heap, -3)
heapq.heappush(max_heap, -7)

largest = -heapq.heappop(max_heap)  # 7
`}</Code>

          <Code>{`
# Merge K sorted lists
import heapq

def merge_k_lists(lists: list[list[int]]) -> list[int]:
    heap = []

    # Initialize with first element of each list
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))  # (value, list_idx, element_idx)

    result = []
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)

        # Push next element from same list
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))

    return result
`}</Code>

          <Callout type="insight">
            <strong>K largest vs K smallest:</strong> For K largest, use a min-heap of size K (pop when size exceeds K). For K smallest, use max-heap of size K. This gives O(n log k) instead of O(n log n).
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 11: GRAPH ESSENTIALS ====================
    {
      id: "graphs",
      title: "Graph Essentials",
      subtitle: "BFS, DFS, and topological sort templates",
      content: (
        <>
          <Prose>
            Graph problems appear frequently and follow predictable patterns. Represent graphs as adjacency lists using <code>defaultdict(list)</code>. Choose BFS for shortest path, DFS for connectivity/cycles.
          </Prose>

          <Code>{`
from collections import defaultdict, deque

# Build adjacency list from edge list
def build_graph(edges: list[list[int]], directed: bool = False) -> dict:
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        if not directed:
            graph[v].append(u)
    return graph
`}</Code>

          <Code>{`
# BFS — shortest path / level order
def bfs_shortest_path(graph: dict, start: int, end: int) -> int:
    if start == end:
        return 0

    visited = set([start])
    queue = deque([(start, 0)])  # (node, distance)

    while queue:
        node, dist = queue.popleft()

        for neighbor in graph[node]:
            if neighbor == end:
                return dist + 1
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))

    return -1  # no path
`}</Code>

          <Code>{`
# DFS — connected components / flood fill
def count_components(n: int, edges: list[list[int]]) -> int:
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = set()
    count = 0

    def dfs(node: int) -> None:
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)

    for node in range(n):
        if node not in visited:
            dfs(node)
            count += 1

    return count
`}</Code>

          <Code>{`
# Topological sort — Kahn's algorithm (BFS)
def topological_sort(n: int, prerequisites: list[list[int]]) -> list[int]:
    graph = defaultdict(list)
    in_degree = [0] * n

    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1

    queue = deque([i for i in range(n) if in_degree[i] == 0])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return order if len(order) == n else []  # empty if cycle
`}</Code>
        </>
      ),
    },

    // ==================== SECTION 12: DP STARTERS ====================
    {
      id: "dp",
      title: "DP Starters",
      subtitle: "1D and 2D dynamic programming patterns",
      content: (
        <>
          <Prose>
            Dynamic programming breaks down into: (1) define state, (2) write recurrence, (3) set base cases, (4) determine build order. Start with recursion + memoization, then optimize to iterative if needed.
          </Prose>

          <Code>{`
# 1D DP — Climbing stairs (Fibonacci pattern)
def climb_stairs(n: int) -> int:
    if n <= 2:
        return n

    prev, curr = 1, 2
    for _ in range(3, n + 1):
        prev, curr = curr, prev + curr

    return curr
`}</Code>

          <Code>{`
# 1D DP — House robber (take or skip)
def house_robber(nums: list[int]) -> int:
    if len(nums) <= 2:
        return max(nums) if nums else 0

    # dp[i] = max profit robbing houses 0..i
    prev2, prev1 = nums[0], max(nums[0], nums[1])

    for i in range(2, len(nums)):
        curr = max(prev1, prev2 + nums[i])  # skip or take
        prev2, prev1 = prev1, curr

    return prev1
`}</Code>

          <Code>{`
# 2D DP — Unique paths (grid traversal)
def unique_paths(m: int, n: int) -> int:
    # dp[i][j] = number of ways to reach (i, j)
    dp = [[1] * n for _ in range(m)]

    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]

    return dp[m-1][n-1]
`}</Code>

          <Code>{`
# LCS — Longest Common Subsequence
def longest_common_subsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    # dp[i][j] = LCS of text1[:i] and text2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]
`}</Code>

          <Callout type="tip">
            <strong>DP intuition:</strong> If the problem has overlapping subproblems (same smaller problems solved repeatedly) and optimal substructure (optimal solution uses optimal sub-solutions), DP likely applies.
          </Callout>
        </>
      ),
    },
  ],

  // ==================== OPERATIONS TABLE ====================
  operations: [
    { name: "String: split, join, [::-1]", time: "O(n)", space: "O(n)", note: "Strings are immutable — modifications create new strings" },
    { name: "List: append, pop", time: "O(1)", space: "O(1)", note: "Amortized O(1) for append due to array resizing" },
    { name: "List: sort", time: "O(n log n)", space: "O(n)", note: "Timsort uses O(n) auxiliary space" },
    { name: "Dict: get, set, in", time: "O(1) avg", space: "O(1)", note: "O(n) worst case with hash collisions" },
    { name: "Heap: push, pop", time: "O(log n)", space: "O(1)", note: "heapify is O(n), not O(n log n)" },
    { name: "Deque: append, popleft", time: "O(1)", space: "O(1)", note: "Use deque for queue operations, not list" },
    { name: "Binary search: bisect", time: "O(log n)", space: "O(1)", note: "Requires sorted input" },
    { name: "Set: add, in, &, |", time: "O(1) / O(min)", space: "O(n)", note: "Intersection is O(min(m, n))" },
  ],

  // ==================== PATTERNS ====================
  patterns: [
    {
      id: "two-pointers",
      name: "Two Pointers",
      tag: "Core",
      tagColor: "accent",
      description: "Use two indices to traverse array from opposite ends or same direction",
      explanation: `The **two pointers** technique uses two indices that move through an array based on certain conditions. The most common variants are: (1) **opposite ends** — start at both ends and move inward, useful for sorted arrays and palindromes; (2) **same direction** — fast and slow pointers, useful for cycle detection and removing duplicates; (3) **two arrays** — one pointer per array, useful for merging sorted arrays.

This pattern reduces O(n²) brute force to O(n) by eliminating redundant comparisons. The key insight is that pointer movement decisions can eliminate entire classes of solutions at once.`,
      triggers: "sorted array, palindrome, pair with sum, remove duplicates, container with water, merge sorted",
      code: `# Opposite ends — two sum in sorted array
def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    left, right = 0, len(nums) - 1
    while left < right:
        curr = nums[left] + nums[right]
        if curr == target:
            return [left, right]
        elif curr < target:
            left += 1
        else:
            right -= 1
    return []

# Same direction — remove duplicates in-place
def remove_duplicates(nums: list[int]) -> int:
    if not nums:
        return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1
    return write`,
    },
    {
      id: "sliding-window",
      name: "Sliding Window",
      tag: "Core",
      tagColor: "accent",
      description: "Maintain a window over contiguous elements, expanding and shrinking as needed",
      explanation: `**Sliding window** maintains a contiguous subarray or substring and slides it across the input. Two variants: (1) **fixed-size** — window of exactly k elements, slide by adding right and removing left; (2) **variable-size** — expand window until constraint violated, then shrink until valid again.

Variable-size windows typically track window state in a hashmap. The outer loop expands (moves right pointer), while an inner loop shrinks (moves left pointer). This gives O(n) time since each element is added and removed at most once.`,
      triggers: "contiguous subarray, substring, window of size k, maximum/minimum with constraint, at most k distinct",
      code: `# Variable-size — longest substring with at most k distinct chars
def longest_k_distinct(s: str, k: int) -> int:
    from collections import defaultdict

    char_count = defaultdict(int)
    max_length = 0
    left = 0

    for right, char in enumerate(s):
        char_count[char] += 1

        while len(char_count) > k:
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1

        max_length = max(max_length, right - left + 1)

    return max_length`,
    },
    {
      id: "hashmap-lookup",
      name: "HashMap Lookup",
      tag: "Essential",
      tagColor: "green",
      description: "Use dict for O(1) complement lookup, frequency counting, or grouping",
      explanation: `**HashMap lookup** converts O(n) linear search to O(1) by pre-computing and storing values. Three main patterns: (1) **complement lookup** — store values seen so far, check if complement exists (Two Sum); (2) **frequency counting** — use Counter or manual dict to count occurrences; (3) **grouping** — use dict to group elements by some key (group anagrams by sorted string).

The trade-off is O(n) extra space. For interview problems, this is almost always acceptable. Counter from collections is particularly useful — it supports arithmetic operations and most_common().`,
      triggers: "two sum, find pair, frequency count, group by, first unique, most common",
      code: `from collections import Counter, defaultdict

# Complement lookup — Two Sum
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
    return []

# Group by — anagrams
def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        groups[tuple(sorted(s))].append(s)
    return list(groups.values())`,
    },
    {
      id: "binary-search",
      name: "Binary Search",
      tag: "Essential",
      tagColor: "green",
      description: "Halve search space each iteration for O(log n) on sorted data",
      explanation: `**Binary search** requires sorted data and halves the search space each iteration. Beyond basic element search, the pattern applies to "binary search on answer" — when asked to minimize the maximum or find the smallest value satisfying a condition, binary search the answer space.

Use Python's bisect module for cleaner code: bisect_left finds the leftmost position, bisect_right finds the rightmost. For "first occurrence" use bisect_left, for "last occurrence" use bisect_right - 1.`,
      triggers: "sorted array, search, first/last occurrence, minimize maximum, smallest x such that",
      code: `from bisect import bisect_left, bisect_right

# Standard binary search
def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Count occurrences using bisect
def count(arr: list[int], target: int) -> int:
    return bisect_right(arr, target) - bisect_left(arr, target)`,
    },
    {
      id: "monotonic-stack",
      name: "Monotonic Stack",
      tag: "Pattern",
      tagColor: "teal",
      description: "Stack maintaining increasing/decreasing order for next greater/smaller problems",
      explanation: `A **monotonic stack** maintains elements in sorted order (increasing or decreasing). When a new element violates the order, pop elements until order is restored. Each popped element's "answer" is the current element.

Use increasing monotonic stack for "next greater element" — pop smaller elements when you see a larger one. Use decreasing for "next smaller element". The key insight: each element is pushed and popped at most once, giving O(n) total time.`,
      triggers: "next greater, next smaller, span, largest rectangle, daily temperatures",
      code: `# Next greater element
def next_greater(nums: list[int]) -> list[int]:
    result = [-1] * len(nums)
    stack = []  # indices

    for i, num in enumerate(nums):
        while stack and nums[stack[-1]] < num:
            result[stack.pop()] = num
        stack.append(i)

    return result

# Daily temperatures — days until warmer
def daily_temperatures(temps: list[int]) -> list[int]:
    result = [0] * len(temps)
    stack = []

    for i, temp in enumerate(temps):
        while stack and temps[stack[-1]] < temp:
            prev = stack.pop()
            result[prev] = i - prev
        stack.append(i)

    return result`,
    },
    {
      id: "prefix-sum",
      name: "Prefix Sum",
      tag: "Pattern",
      tagColor: "teal",
      description: "Precompute cumulative sums for O(1) range sum queries",
      explanation: `**Prefix sum** precomputes cumulative sums so that any range sum becomes a single subtraction. prefix[i] = sum(arr[0:i]), so sum(arr[i:j]) = prefix[j] - prefix[i].

The pattern extends to 2D (prefix rectangles), prefix XOR, prefix product, and more. Build the prefix array in O(n), then answer unlimited range queries in O(1) each. Often combined with hashmap for "subarray sum equals k" problems.`,
      triggers: "range sum, subarray sum equals k, contiguous sum, cumulative",
      code: `# Build prefix sum
def prefix_sum(nums: list[int]) -> list[int]:
    prefix = [0]
    for num in nums:
        prefix.append(prefix[-1] + num)
    return prefix

# Range sum query
# sum(nums[i:j]) = prefix[j] - prefix[i]

# Subarray sum equals k (using hashmap)
def subarray_sum(nums: list[int], k: int) -> int:
    prefix_counts = {0: 1}
    count = curr_sum = 0

    for num in nums:
        curr_sum += num
        count += prefix_counts.get(curr_sum - k, 0)
        prefix_counts[curr_sum] = prefix_counts.get(curr_sum, 0) + 1

    return count`,
    },
    {
      id: "backtracking",
      name: "Backtracking",
      tag: "Pattern",
      tagColor: "amber",
      description: "Build solutions incrementally, backtrack when constraint violated",
      explanation: `**Backtracking** builds solutions incrementally, abandoning paths that violate constraints ("pruning"). The template: (1) check if current state is a solution, (2) iterate through choices, (3) make choice, recurse, undo choice.

Common applications: subsets, permutations, combinations, N-Queens, Sudoku. The key is identifying what constitutes a "choice" at each step and when to prune. Time complexity is often exponential, but pruning significantly reduces practical runtime.`,
      triggers: "all subsets, all permutations, all combinations, generate all, n-queens, sudoku",
      code: `# Subsets — include or exclude each element
def subsets(nums: list[int]) -> list[list[int]]:
    result = []

    def backtrack(start: int, path: list[int]):
        result.append(path[:])  # add current subset
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return result

# Permutations — try each remaining element
def permutations(nums: list[int]) -> list[list[int]]:
    result = []

    def backtrack(path: list[int], remaining: set):
        if not remaining:
            result.append(path[:])
            return
        for num in list(remaining):
            path.append(num)
            remaining.remove(num)
            backtrack(path, remaining)
            path.pop()
            remaining.add(num)

    backtrack([], set(nums))
    return result`,
    },
    {
      id: "bfs-shortest",
      name: "BFS for Shortest Path",
      tag: "Graph",
      tagColor: "coral",
      description: "Level-order traversal guarantees shortest path in unweighted graphs",
      explanation: `**BFS** explores nodes level by level, which guarantees the shortest path in unweighted graphs. Use a deque (not list!) for O(1) popleft. Track visited nodes in a set to avoid cycles.

For shortest path, track distance with each node in the queue. For "minimum steps to reach target", BFS gives the answer when you first reach the target. BFS also works for level-order tree traversal and multi-source shortest path (start queue with all sources).`,
      triggers: "shortest path, minimum steps, level order, unweighted graph, word ladder",
      code: `from collections import deque

# BFS shortest path
def shortest_path(graph: dict, start: int, end: int) -> int:
    if start == end:
        return 0

    visited = {start}
    queue = deque([(start, 0)])

    while queue:
        node, dist = queue.popleft()
        for neighbor in graph.get(node, []):
            if neighbor == end:
                return dist + 1
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))

    return -1

# Grid BFS — number of islands
def num_islands(grid: list[list[str]]) -> int:
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def bfs(r: int, c: int):
        queue = deque([(r, c)])
        grid[r][c] = '0'  # mark visited
        while queue:
            r, c = queue.popleft()
            for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                    grid[nr][nc] = '0'
                    queue.append((nr, nc))

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                bfs(r, c)
                count += 1

    return count`,
    },
  ],

  // ==================== PROBLEMS ====================
  problems: [
    {
      id: "two-sum",
      title: "Two Sum",
      difficulty: "easy",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      examples: [
        { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
        { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]" },
      ],
      starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your code here
    pass`,
      solution: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      hints: [
        "For each number, what value would you need to find to reach the target?",
        "How can you check if you've seen that value before in O(1) time?",
        "Use a hashmap to store number → index as you iterate",
      ],
      testCases: [
        { input: "[2, 7, 11, 15], 9", expected: "[0, 1]" },
        { input: "[3, 2, 4], 6", expected: "[1, 2]" },
        { input: "[3, 3], 6", expected: "[0, 1]" },
      ],
    },
    {
      id: "valid-anagram",
      title: "Valid Anagram",
      difficulty: "easy",
      description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram uses all original letters exactly once.",
      examples: [
        { input: 's = "anagram", t = "nagaram"', output: "true" },
        { input: 's = "rat", t = "car"', output: "false" },
      ],
      starterCode: `def is_anagram(s: str, t: str) -> bool:
    # Your code here
    pass`,
      solution: `def is_anagram(s: str, t: str) -> bool:
    from collections import Counter
    return Counter(s) == Counter(t)`,
      hints: [
        "What defines an anagram? Same characters with same frequencies",
        "Counter from collections can count character frequencies",
        "Alternatively, sorting both strings should yield the same result",
      ],
      testCases: [
        { input: '"anagram", "nagaram"', expected: "True" },
        { input: '"rat", "car"', expected: "False" },
        { input: '"a", "a"', expected: "True" },
      ],
    },
    {
      id: "reverse-string",
      title: "Reverse String In-Place",
      difficulty: "easy",
      description: "Write a function that reverses a string in-place. The input is given as a list of characters. You must do this by modifying the input list in-place with O(1) extra memory.",
      examples: [
        { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
        { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
      ],
      starterCode: `def reverse_string(s: list[str]) -> None:
    # Modify s in-place
    pass`,
      solution: `def reverse_string(s: list[str]) -> None:
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1`,
      hints: [
        "Use two pointers starting at opposite ends",
        "Swap characters at left and right pointers",
        "Move pointers toward each other until they meet",
      ],
      testCases: [
        { input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
        { input: '["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]' },
        { input: '["a"]', expected: '["a"]' },
      ],
    },
    {
      id: "container-with-most-water",
      title: "Container With Most Water",
      difficulty: "medium",
      description: "Given n non-negative integers representing vertical lines at position i with height[i], find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water.",
      examples: [
        { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Lines at indices 1 and 8 form container with area 7 * 7 = 49" },
        { input: "height = [1,1]", output: "1" },
      ],
      starterCode: `def max_area(height: list[int]) -> int:
    # Your code here
    pass`,
      solution: `def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0

    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)

        # Move the shorter line inward
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_water`,
      hints: [
        "Area = width × min(left_height, right_height)",
        "Start with widest container (left=0, right=n-1)",
        "Moving the shorter line might find a taller one; moving the taller line can only decrease area",
      ],
      testCases: [
        { input: "[1,8,6,2,5,4,8,3,7]", expected: "49" },
        { input: "[1,1]", expected: "1" },
        { input: "[4,3,2,1,4]", expected: "16" },
      ],
    },
    {
      id: "longest-substring-without-repeat",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      description: "Given a string s, find the length of the longest substring without repeating characters.",
      examples: [
        { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3' },
        { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with length 1' },
        { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with length 3' },
      ],
      starterCode: `def length_of_longest_substring(s: str) -> int:
    # Your code here
    pass`,
      solution: `def length_of_longest_substring(s: str) -> int:
    char_index = {}
    max_length = 0
    left = 0

    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        char_index[char] = right
        max_length = max(max_length, right - left + 1)

    return max_length`,
      hints: [
        "Use sliding window with two pointers",
        "Track last seen index of each character",
        "When you see a repeat, move left pointer past the previous occurrence",
      ],
      testCases: [
        { input: '"abcabcbb"', expected: "3" },
        { input: '"bbbbb"', expected: "1" },
        { input: '"pwwkew"', expected: "3" },
        { input: '""', expected: "0" },
      ],
    },
    {
      id: "group-anagrams",
      title: "Group Anagrams",
      difficulty: "medium",
      description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
      examples: [
        { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
        { input: 'strs = [""]', output: '[[""]]' },
      ],
      starterCode: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    # Your code here
    pass`,
      solution: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    from collections import defaultdict

    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)

    return list(groups.values())`,
      hints: [
        "Anagrams have the same characters — what's a canonical form?",
        "Sorted string can be a key: sorted('eat') == sorted('tea')",
        "Use defaultdict(list) to group strings by their sorted key",
      ],
      testCases: [
        { input: '["eat","tea","tan","ate","nat","bat"]', expected: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
        { input: '[""]', expected: '[[""]]' },
        { input: '["a"]', expected: '[["a"]]' },
      ],
    },
    {
      id: "merge-intervals",
      title: "Merge Intervals",
      difficulty: "medium",
      description: "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return an array of the non-overlapping intervals.",
      examples: [
        { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Intervals [1,3] and [2,6] overlap, merge to [1,6]" },
        { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]", explanation: "Intervals [1,4] and [4,5] are adjacent (touching)" },
      ],
      starterCode: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Your code here
    pass`,
      solution: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []

    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for start, end in intervals[1:]:
        if start <= merged[-1][1]:  # overlapping
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])

    return merged`,
      hints: [
        "Sort intervals by start time first",
        "Two intervals overlap if second.start <= first.end",
        "When merging, take the max of both end times",
      ],
      testCases: [
        { input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" },
        { input: "[[1,4],[4,5]]", expected: "[[1,5]]" },
        { input: "[[1,4],[0,4]]", expected: "[[0,4]]" },
      ],
    },
    {
      id: "product-except-self",
      title: "Product of Array Except Self",
      difficulty: "medium",
      description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i]. You must solve it in O(n) time without using division.",
      examples: [
        { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
        { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
      ],
      starterCode: `def product_except_self(nums: list[int]) -> list[int]:
    # Your code here
    pass`,
      solution: `def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [1] * n

    # Left pass: result[i] = product of all elements to the left
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]

    # Right pass: multiply by product of all elements to the right
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]

    return result`,
      hints: [
        "Product except self = (product of all left) × (product of all right)",
        "First pass: compute prefix products from left",
        "Second pass: multiply by suffix products from right",
      ],
      testCases: [
        { input: "[1,2,3,4]", expected: "[24,12,8,6]" },
        { input: "[-1,1,0,-3,3]", expected: "[0,0,9,0,0]" },
        { input: "[2,3]", expected: "[3,2]" },
      ],
    },
  ],
};
