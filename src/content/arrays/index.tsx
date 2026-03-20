import { SlidingWindowDemo } from "../../visualizations/arrays/SlidingWindowDemo";
import { TwoPointersDemo } from "../../visualizations/arrays/TwoPointersDemo";
import { PrefixSumViz } from "../../visualizations/arrays/PrefixSumViz";
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

export const arraysContent: DataStructure = {
  id: "arrays",
  name: "Arrays & Sliding Window",
  icon: "[]",
  tagline:
    "Master sequential data patterns. From two pointers to sliding windows, the building blocks of efficient algorithms.",
  description:
    "Arrays are the foundation of most coding problems. Learn the essential patterns: two pointers, sliding window, and prefix sums.",
  color: "teal",
  viewMode: "pattern-first",

  sections: [
    {
      id: "array-fundamentals",
      title: "Why arrays dominate interviews",
      subtitle: "Contiguous memory, O(1) access, and the patterns that emerge",
      content: (
        <>
          <Prose>
            Arrays store elements in contiguous memory, giving O(1) access by
            index. This simple property enables powerful patterns: sliding
            windows exploit contiguity, two pointers leverage sorted order, and
            prefix sums turn repeated range queries into single operations.
          </Prose>
          <Prose>
            In Python, <CodeInline>list</CodeInline> is a dynamic array (like C++
            vector or Java ArrayList). It automatically resizes, with amortized
            O(1) append. Slicing <CodeInline>arr[i:j]</CodeInline> creates a new
            list in O(j-i) time. Understanding these costs is crucial for
            optimizing interview solutions.
          </Prose>
        </>
      ),
    },
    {
      id: "sliding-window",
      title: "The sliding window pattern",
      subtitle: "Process subarrays without redundant work",
      content: (
        <>
          <Prose>
            A sliding window maintains a subset of elements as you traverse.
            Instead of recalculating from scratch at each position, you update
            incrementally: add the new element entering the window, remove the
            old element leaving. This transforms O(n*k) into O(n).
          </Prose>
          <SlidingWindowDemo />
          <Prose>
            <strong>Fixed-size windows</strong> have constant k. Examples:
            maximum sum of k consecutive elements, moving average. The window
            slides one position at a time.
          </Prose>
          <Prose>
            <strong>Variable-size windows</strong> expand and contract based on
            a condition. Examples: longest substring without repeating
            characters, minimum window containing all target characters. You
            expand until a condition is met, then contract until it breaks.
          </Prose>
        </>
      ),
    },
    {
      id: "two-pointers",
      title: "Two pointers technique",
      subtitle: "Reduce O(n^2) to O(n) with careful pointer movement",
      content: (
        <>
          <Prose>
            Two pointers work on sorted arrays or when the relationship between
            elements at different positions guides the search. By starting at
            opposite ends (or both at the beginning), you systematically
            eliminate possibilities in O(n) instead of checking all pairs.
          </Prose>
          <TwoPointersDemo />
          <Prose>
            Common variations: <strong>opposite ends</strong> (two sum in sorted
            array, container with most water), <strong>same direction</strong>{" "}
            (fast/slow for cycle detection, remove duplicates in-place),{" "}
            <strong>multiple arrays</strong> (merge sorted arrays).
          </Prose>
        </>
      ),
    },
    {
      id: "prefix-sum",
      title: "Prefix sums",
      subtitle: "Precompute for O(1) range queries",
      content: (
        <>
          <Prose>
            A prefix sum array stores cumulative sums:{" "}
            <CodeInline>prefix[i] = arr[0] + arr[1] + ... + arr[i-1]</CodeInline>.
            Any range sum becomes a simple subtraction:{" "}
            <CodeInline>sum(i,j) = prefix[j+1] - prefix[i]</CodeInline>.
          </Prose>
          <PrefixSumViz />
          <Prose>
            This pattern extends beyond sums: prefix XOR for range XOR queries,
            prefix products (with care for zeros), and prefix counts. The key
            insight is trading O(n) preprocessing for O(1) queries.
          </Prose>
        </>
      ),
    },
    {
      id: "kadanes-algorithm",
      title: "Kadane's algorithm",
      subtitle: "Maximum subarray sum in O(n)",
      content: (
        <>
          <Prose>
            Kadane's algorithm finds the maximum sum contiguous subarray using
            dynamic programming. At each position, decide: extend the previous
            subarray, or start fresh here? Track the local maximum and global
            maximum.
          </Prose>
          <Prose>
            The recurrence: <CodeInline>dp[i] = max(arr[i], dp[i-1] + arr[i])</CodeInline>.
            If extending the previous subarray would decrease the sum below the
            current element alone, start a new subarray. This greedy choice is
            optimal.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`def max_subarray(nums):
    max_current = max_global = nums[0]
    for num in nums[1:]:
        max_current = max(num, max_current + num)
        max_global = max(max_global, max_current)
    return max_global`}
            </pre>
          </div>
        </>
      ),
    },
  ],

  operations: [
    {
      name: "Access by index",
      average: "O(1)",
      worst: "O(1)",
      note: "Direct memory access. Arrays excel here.",
    },
    {
      name: "Search (unsorted)",
      average: "O(n)",
      worst: "O(n)",
      note: "Must scan linearly. Consider hashset for O(1).",
    },
    {
      name: "Search (sorted)",
      average: "O(log n)",
      worst: "O(log n)",
      note: "Binary search. Keep arrays sorted when possible.",
    },
    {
      name: "Insert at end",
      average: "O(1)*",
      worst: "O(n)",
      note: "Amortized O(1). Resize triggers O(n) copy.",
    },
    {
      name: "Insert at index",
      average: "O(n)",
      worst: "O(n)",
      note: "Must shift all subsequent elements.",
    },
    {
      name: "Delete",
      average: "O(n)",
      worst: "O(n)",
      note: "Shift elements to fill gap. Use swap-to-end trick when order doesn't matter.",
    },
  ],

  patterns: [
    {
      id: "fixed-sliding-window",
      name: "Fixed-size sliding window",
      tag: "High frequency",
      tagColor: "teal",
      description:
        "Process all contiguous subarrays of size k. Maintain window state incrementally: add incoming element, remove outgoing. O(n) total.",
      explanation: `The sliding window is fundamentally about avoiding redundant computation. If you need to compute something over every k-element window, the naive approach recalculates from scratch each time: O(n×k) total. But consecutive windows overlap significantly—they share k-1 elements. The insight is to maintain a running state that you update incrementally.

When the window slides one position right, exactly one element leaves (the leftmost) and one enters (the new rightmost). For sums, this means window_sum = window_sum - arr[i-k] + arr[i]. For max/min tracking, you need a more sophisticated structure (monotonic deque). For frequency maps, increment the new element's count and decrement the old.

The pattern requires careful initialization—compute the first window fully, then enter the sliding loop. Off-by-one errors are common: remember that when you're at index i in the sliding phase, the element leaving is at index i-k, and your window covers [i-k+1, i] inclusive. Draw out a small example if unsure.`,
      triggers: "\"maximum/minimum sum of k elements\", \"average of k\", \"fixed window size\", \"consecutive k elements\", \"rolling window\", \"every subarray of size k\"",
      code: `def max_sum_subarray(arr, k):
    # Initialize first window
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # Slide window: remove left, add right
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum`,
      problems: [],
    },
    {
      id: "variable-sliding-window",
      name: "Variable-size sliding window",
      tag: "Classic",
      tagColor: "accent",
      description:
        "Expand window until condition breaks, then shrink until it's restored. Track best window seen. Two pointers define window bounds.",
      explanation: `Variable-size windows solve optimization problems: find the longest/shortest subarray satisfying some constraint. The key insight is that these problems have a monotonic structure—if a window satisfies the constraint, smaller windows nested inside might too, but we want the extreme.

The pattern has two phases that alternate: expand (move right pointer) and contract (move left pointer). You expand until the constraint breaks, then contract until it's restored. At each valid state, update your answer. The right pointer visits each element once; the left pointer visits each element at most once. Total: O(n).

The constraint determines when to shrink. For "at most k distinct characters," shrink when you exceed k. For "minimum window containing all targets," expand until you have all targets, then shrink to find minimum size while still valid. The shrinking condition is the inverse of your goal—it kicks in when you've gone too far.`,
      triggers: "\"longest subarray where\", \"shortest subarray where\", \"minimum window containing\", \"at most k\", \"subarray with constraint\", \"maximum length substring\"",
      code: `def longest_substring_k_distinct(s, k):
    left = 0
    char_count = {}
    max_length = 0

    for right in range(len(s)):
        # Expand: add right char
        char_count[s[right]] = char_count.get(s[right], 0) + 1

        # Shrink: remove left chars until valid
        while len(char_count) > k:
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1

        max_length = max(max_length, right - left + 1)

    return max_length`,
      problems: [],
    },
    {
      id: "two-pointers-opposite",
      name: "Two pointers (opposite ends)",
      tag: "Essential",
      tagColor: "green",
      description:
        "Start at both ends of sorted array. Move pointers inward based on comparison to target. Eliminates O(n) possibilities per step.",
      explanation: `Two pointers from opposite ends exploit sorted order to eliminate many possibilities at once. When pointers start at the smallest and largest elements, the sum is easy to reason about: too small? The left element is the bottleneck, so move it right to something larger. Too large? Move right pointer left to something smaller.

The magic is that each pointer movement eliminates an entire row/column of the implicit search space. If sum(left, right) < target, then sum(left, anything <= right) < target too—all those pairs fail. You're not just ruling out one pair; you're ruling out all pairs involving the current left with anything to the right of right. This is why it's O(n) instead of O(n²).

The pattern requires sorted input or equivalent structure. Common applications: two sum in sorted array, container with most water (maximize area), trapping rainwater (process from both ends), valid palindrome (compare characters from ends). The key is identifying which pointer to move based on the comparison to your target or optimization goal.`,
      triggers: "\"sorted array\", \"pair in sorted\", \"two sum sorted\", \"maximize/minimize with two bounds\", \"container area\", \"inward from both ends\"",
      code: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1   # Need larger sum
        else:
            right -= 1  # Need smaller sum

    return []  # No solution`,
      problems: [],
    },
    {
      id: "prefix-sum-pattern",
      name: "Prefix sum for range queries",
      tag: "High frequency",
      tagColor: "amber",
      description:
        "Precompute cumulative sums to answer range queries in O(1). prefix[j+1] - prefix[i] gives sum from index i to j.",
      explanation: `Prefix sums embody a fundamental algorithmic trade-off: O(n) preprocessing for O(1) queries. When you'll answer many range sum queries on static data, this preprocessing cost is amortized across queries. The insight is that sum(i, j) = sum(0, j) - sum(0, i-1), and you can precompute all prefix sums in one pass.

The array has length n+1, where prefix[0] = 0 (sum of empty prefix) and prefix[i] = sum of first i elements. This 0-indexing elegance means sum(i, j) = prefix[j+1] - prefix[i]. The off-by-one here is deliberate and simplifies edge cases.

The pattern extends beyond sums. Prefix XOR gives range XOR. Prefix products work (carefully handle zeros). Prefix counts ("how many elements less than x up to position i") enable range frequency queries. 2D prefix sums extend to matrices, enabling O(1) rectangle sum queries after O(mn) preprocessing. The core insight is always the same: decompose what you need into a difference of prefix computations.`,
      triggers: "\"range sum\", \"subarray sum\", \"sum from i to j\", \"multiple queries\", \"static array queries\", \"cumulative sum\"",
      code: `def range_sum_queries(nums, queries):
    # Build prefix sum: O(n)
    prefix = [0]
    for num in nums:
        prefix.append(prefix[-1] + num)

    # Answer each query: O(1)
    results = []
    for i, j in queries:
        results.append(prefix[j + 1] - prefix[i])

    return results`,
      problems: [],
    },
    {
      id: "kadane-max-subarray",
      name: "Kadane's algorithm (max subarray)",
      tag: "Classic",
      tagColor: "coral",
      description:
        "Find maximum sum contiguous subarray. At each position: extend previous subarray or start fresh. Track local and global max.",
      explanation: `Kadane's algorithm is a masterclass in dynamic programming reduced to its simplest form. The recurrence is elegant: at each position, you either extend the best subarray ending at the previous position, or start a new subarray here. The decision is trivial—extend if it helps, restart if the previous sum is negative.

The key insight is tracking two things: max_current (best subarray ending exactly here) and max_global (best subarray seen anywhere). max_current can only extend or restart. max_global remembers the best across all positions. This separation lets you recover from negative regions while remembering past peaks.

Why does this work? Because the optimal subarray ends somewhere. By tracking the best subarray ending at each position, you're guaranteed to encounter the optimal one. And since extending a negative sum only hurts, the restart decision is always locally optimal. Greedy choices here align with global optimality—a beautiful property.`,
      triggers: "\"maximum sum subarray\", \"contiguous subarray\", \"largest sum\", \"best time to buy and sell\", \"maximum profit\", \"max contiguous\"",
      code: `def max_subarray(nums):
    max_current = max_global = nums[0]

    for num in nums[1:]:
        # Extend or restart?
        max_current = max(num, max_current + num)
        max_global = max(max_global, max_current)

    return max_global

# Variation: return indices
def max_subarray_indices(nums):
    max_current = max_global = nums[0]
    start = end = temp_start = 0

    for i, num in enumerate(nums[1:], 1):
        if num > max_current + num:
            max_current = num
            temp_start = i
        else:
            max_current = max_current + num

        if max_current > max_global:
            max_global = max_current
            start, end = temp_start, i

    return max_global, start, end`,
      problems: [],
    },
    {
      id: "in-place-modification",
      name: "In-place array modification",
      tag: "Medium frequency",
      tagColor: "amber",
      description:
        "Modify array without extra space using two pointers. One pointer reads, one writes. Common for removing elements or deduplication.",
      explanation: `In-place modification asks you to transform an array without allocating additional space proportional to input size. The read-write pointer technique is the workhorse pattern. The read pointer scans every element; the write pointer marks where the next "good" element should go.

The invariant is: everything to the left of write is your valid output. Elements are either copied to the write position (if they pass the filter) or skipped (if they don't). Since read >= write always, you never overwrite unread data. The final answer is the array's first write elements.

This pattern appears in many disguises. Remove duplicates: write if different from previous. Remove element: write if not target value. Move zeros: write non-zeros, then fill remaining with zeros. The key insight is separating the reading logic (always advance read) from the writing logic (conditionally advance write and copy). The same template adapts to different conditions.`,
      triggers: "\"in-place\", \"O(1) space\", \"remove duplicates\", \"remove element\", \"move zeros\", \"modify without extra space\", \"filter in place\"",
      code: `def remove_duplicates_sorted(nums):
    if not nums:
        return 0

    write = 1  # Position to write next unique

    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1

    return write  # New length

# Remove all occurrences of val
def remove_element(nums, val):
    write = 0
    for read in range(len(nums)):
        if nums[read] != val:
            nums[write] = nums[read]
            write += 1
    return write`,
      problems: [],
    },
  ],

  problems: [
    {
      id: "max-subarray",
      title: "Maximum Subarray",
      difficulty: "medium",
      description:
        "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      examples: [
        {
          input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
          output: "6",
          explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
        },
        {
          input: "nums = [1]",
          output: "1",
        },
        {
          input: "nums = [5,4,-1,7,8]",
          output: "23",
        },
      ],
      starterCode: `def max_subarray(nums):
    # Your solution here
    pass`,
      solution: `def max_subarray(nums):
    max_current = nums[0]
    max_global = nums[0]

    for i in range(1, len(nums)):
        # Extend previous subarray or start new?
        max_current = max(nums[i], max_current + nums[i])
        max_global = max(max_global, max_current)

    return max_global`,
      hints: [
        "Brute force: check all subarrays O(n^2). Can we do better?",
        "At each position, we either extend the previous subarray or start fresh.",
        "If the previous subarray sum is negative, starting fresh is always better.",
        "Track both the current subarray sum and the best seen so far.",
      ],
      testCases: [
        {
          input: "max_subarray([-2,1,-3,4,-1,2,1,-5,4])",
          expected: "6",
          description: "Standard case with mixed values",
        },
        {
          input: "max_subarray([1])",
          expected: "1",
          description: "Single element",
        },
        {
          input: "max_subarray([-1])",
          expected: "-1",
          description: "Single negative element",
        },
        {
          input: "max_subarray([5,4,-1,7,8])",
          expected: "23",
          description: "Entire array is the answer",
        },
      ],
    },
    {
      id: "best-time-buy-sell",
      title: "Best Time to Buy and Sell Stock",
      difficulty: "easy",
      description:
        "Given an array prices where prices[i] is the price of a stock on the ith day, return the maximum profit you can achieve. You may complete at most one transaction (buy one and sell one share). If no profit is possible, return 0.",
      examples: [
        {
          input: "prices = [7,1,5,3,6,4]",
          output: "5",
          explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
        },
        {
          input: "prices = [7,6,4,3,1]",
          output: "0",
          explanation: "No profitable transaction possible.",
        },
      ],
      starterCode: `def max_profit(prices):
    # Your solution here
    pass`,
      solution: `def max_profit(prices):
    min_price = float('inf')
    max_profit = 0

    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)

    return max_profit`,
      hints: [
        "We need to find max(prices[j] - prices[i]) where j > i.",
        "Track the minimum price seen so far as you iterate.",
        "At each day, the best profit is current price minus the minimum so far.",
        "This is essentially Kadane's algorithm on the difference array.",
      ],
      testCases: [
        {
          input: "max_profit([7,1,5,3,6,4])",
          expected: "5",
          description: "Standard case",
        },
        {
          input: "max_profit([7,6,4,3,1])",
          expected: "0",
          description: "Descending prices",
        },
        {
          input: "max_profit([1,2])",
          expected: "1",
          description: "Two elements",
        },
        {
          input: "max_profit([2,4,1])",
          expected: "2",
          description: "Best is not at end",
        },
      ],
    },
    {
      id: "arrays-longest-substring-no-repeat",
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
          explanation: 'The answer is "b", with length 1.',
        },
        {
          input: 's = "pwwkew"',
          output: "3",
          explanation: 'The answer is "wke", with length 3.',
        },
      ],
      starterCode: `def length_of_longest_substring(s):
    # Your solution here
    pass`,
      solution: `def length_of_longest_substring(s):
    last_seen = {}  # char -> last index
    start = 0
    max_len = 0

    for i, char in enumerate(s):
        # If char seen and within current window, shrink window
        if char in last_seen and last_seen[char] >= start:
            start = last_seen[char] + 1

        last_seen[char] = i
        max_len = max(max_len, i - start + 1)

    return max_len`,
      hints: [
        "This is a variable-size sliding window problem.",
        "Use a hashmap to track the last index where each character was seen.",
        "When you see a repeat, jump the window start past the previous occurrence.",
        "Be careful: only jump if the previous occurrence is within the current window.",
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
          description: "All same character",
        },
        {
          input: 'length_of_longest_substring("pwwkew")',
          expected: "3",
          description: "Multiple valid substrings",
        },
        {
          input: 'length_of_longest_substring("")',
          expected: "0",
          description: "Empty string",
        },
      ],
    },
    {
      id: "container-with-most-water",
      title: "Container With Most Water",
      difficulty: "medium",
      description:
        "Given n non-negative integers height[i] representing vertical lines at each position, find two lines that together with the x-axis form a container that holds the most water. Return the maximum area.",
      examples: [
        {
          input: "height = [1,8,6,2,5,4,8,3,7]",
          output: "49",
          explanation: "Lines at index 1 and 8 form a container with area min(8,7) * 7 = 49.",
        },
        {
          input: "height = [1,1]",
          output: "1",
        },
      ],
      starterCode: `def max_area(height):
    # Your solution here
    pass`,
      solution: `def max_area(height):
    left = 0
    right = len(height) - 1
    max_area = 0

    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_area = max(max_area, width * h)

        # Move the shorter line inward
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_area`,
      hints: [
        "Area = width * min(left_height, right_height).",
        "Start with maximum width (left=0, right=n-1).",
        "Moving inward decreases width. To potentially increase area, we need taller lines.",
        "Always move the pointer pointing to the shorter line. Why? Moving the taller one can only decrease or maintain the area.",
      ],
      testCases: [
        {
          input: "max_area([1,8,6,2,5,4,8,3,7])",
          expected: "49",
          description: "Standard case",
        },
        {
          input: "max_area([1,1])",
          expected: "1",
          description: "Two elements",
        },
        {
          input: "max_area([4,3,2,1,4])",
          expected: "16",
          description: "Symmetric heights",
        },
        {
          input: "max_area([1,2,1])",
          expected: "2",
          description: "Three elements",
        },
      ],
    },
    {
      id: "subarray-sum-equals-k",
      title: "Subarray Sum Equals K",
      difficulty: "medium",
      description:
        "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals k.",
      examples: [
        {
          input: "nums = [1,1,1], k = 2",
          output: "2",
          explanation: "Subarrays [1,1] at indices 0-1 and 1-2.",
        },
        {
          input: "nums = [1,2,3], k = 3",
          output: "2",
          explanation: "Subarrays [1,2] and [3].",
        },
      ],
      starterCode: `def subarray_sum(nums, k):
    # Your solution here
    pass`,
      solution: `def subarray_sum(nums, k):
    prefix_count = {0: 1}  # prefix sum -> count
    current_sum = 0
    count = 0

    for num in nums:
        current_sum += num

        # If (current_sum - k) was seen, those subarrays sum to k
        if current_sum - k in prefix_count:
            count += prefix_count[current_sum - k]

        # Record this prefix sum
        prefix_count[current_sum] = prefix_count.get(current_sum, 0) + 1

    return count`,
      hints: [
        "Brute force: check all subarrays O(n^2). Can we do better?",
        "Use prefix sums: sum(i,j) = prefix[j+1] - prefix[i].",
        "If prefix[j] - prefix[i] = k, then prefix[i] = prefix[j] - k.",
        "Store counts of prefix sums in a hashmap. At each position, check how many times (current_sum - k) was seen.",
      ],
      testCases: [
        {
          input: "subarray_sum([1,1,1], 2)",
          expected: "2",
          description: "Multiple subarrays",
        },
        {
          input: "subarray_sum([1,2,3], 3)",
          expected: "2",
          description: "Different length subarrays",
        },
        {
          input: "subarray_sum([1], 1)",
          expected: "1",
          description: "Single element equals k",
        },
        {
          input: "subarray_sum([1,-1,0], 0)",
          expected: "3",
          description: "Zero sum subarrays",
        },
      ],
    },
  ],
};
