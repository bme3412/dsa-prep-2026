import { BubbleSortViz } from "../../visualizations/sorting/BubbleSortViz";
import { MergeSortViz } from "../../visualizations/sorting/MergeSortViz";
import { QuickSortViz } from "../../visualizations/sorting/QuickSortViz";
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

export const sortingContent: DataStructure = {
  id: "sorting",
  name: "Sorting Algorithms",
  icon: "↕",
  tagline:
    "From O(n²) basics to O(n log n) divide-and-conquer. Know when to use built-in sort vs custom comparators.",
  description:
    "Understand the tradeoffs between sorting algorithms and when to apply them. Master custom comparators and sorting-based problem strategies.",
  color: "coral",
  viewMode: "pattern-first",

  sections: [
    {
      id: "why-sorting-matters",
      title: "Why sorting dominates interviews",
      subtitle: "The foundation for binary search, merge operations, and efficient algorithms",
      content: (
        <>
          <Prose>
            Sorting transforms chaotic data into ordered data, enabling binary
            search (O(log n) lookups), two-pointer techniques, and efficient
            duplicate detection. Many problems that seem unrelated to sorting
            become trivial once the data is ordered.
          </Prose>
          <Prose>
            In interviews, you'll rarely implement a sorting algorithm from
            scratch. Instead, know: which algorithm Python's{" "}
            <CodeInline>sorted()</CodeInline> uses (Timsort), how to write
            custom comparators, and when sorting is the right preprocessing
            step. Time spent sorting (O(n log n)) often pays off in simpler
            O(n) main logic.
          </Prose>
        </>
      ),
    },
    {
      id: "quadratic-sorts",
      title: "O(n²) sorting: Bubble, Selection, Insertion",
      subtitle: "Simple but slow — know them for interviews, avoid in production",
      content: (
        <>
          <Prose>
            <strong>Bubble Sort</strong> repeatedly swaps adjacent elements if
            they're out of order. After each pass, the largest unsorted element
            "bubbles" to its final position. Simple but inefficient.
          </Prose>
          <BubbleSortViz />
          <Prose>
            <strong>Selection Sort</strong> finds the minimum element and swaps
            it to the front, then repeats for the remaining array. Always O(n²)
            regardless of input. <strong>Insertion Sort</strong> builds the
            sorted array one element at a time, inserting each new element into
            its correct position. Best for small arrays or nearly sorted data
            (O(n) best case).
          </Prose>
        </>
      ),
    },
    {
      id: "merge-sort",
      title: "Merge Sort",
      subtitle: "Divide, conquer, merge — guaranteed O(n log n)",
      content: (
        <>
          <Prose>
            Merge Sort recursively divides the array in half until single
            elements remain, then merges sorted halves back together. The merge
            step is key: two sorted arrays can be merged in O(n) by comparing
            front elements.
          </Prose>
          <MergeSortViz />
          <Prose>
            Merge Sort is <strong>stable</strong> (equal elements maintain
            relative order) and has guaranteed O(n log n) performance. The
            trade-off is O(n) extra space for the merge buffer. It's the
            algorithm of choice for linked lists (no random access needed) and
            external sorting (disk-based).
          </Prose>
        </>
      ),
    },
    {
      id: "quick-sort",
      title: "Quick Sort",
      subtitle: "Partition around a pivot — fastest in practice",
      content: (
        <>
          <Prose>
            Quick Sort picks a "pivot" element and partitions the array: elements
            less than pivot go left, greater go right. Then recursively sort
            each partition. Unlike Merge Sort, the work happens during
            partitioning, not merging.
          </Prose>
          <QuickSortViz />
          <Prose>
            Quick Sort is <strong>in-place</strong> (O(log n) stack space) and
            has excellent cache performance. Average case O(n log n), but worst
            case O(n²) with bad pivot choices (already sorted array, all equal
            elements). Use randomized pivot selection or median-of-three to
            avoid this.
          </Prose>
        </>
      ),
    },
    {
      id: "python-sorting",
      title: "Python's Timsort & custom sorting",
      subtitle: "What you'll actually use in interviews",
      content: (
        <>
          <Prose>
            Python uses <strong>Timsort</strong>, a hybrid of Merge Sort and
            Insertion Sort. It exploits existing order in data (runs of sorted
            elements) for O(n) best case. Always O(n log n) worst case, stable,
            and highly optimized. Use <CodeInline>sorted()</CodeInline> or{" "}
            <CodeInline>list.sort()</CodeInline> — don't implement your own.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`# Custom comparator with key function
intervals = [(1, 3), (2, 4), (0, 5)]

# Sort by end time
sorted(intervals, key=lambda x: x[1])
# [(1, 3), (2, 4), (0, 5)]

# Sort by start, then by end descending
sorted(intervals, key=lambda x: (x[0], -x[1]))

# Sort objects by attribute
sorted(users, key=lambda u: u.age)

# Multiple criteria
sorted(items, key=lambda x: (x.priority, x.date))`}
            </pre>
          </div>
          <Prose>
            The <CodeInline>key</CodeInline> function transforms each element
            before comparison. Return a tuple for multi-criteria sorting. Use
            negative values to reverse a specific criterion while keeping
            others ascending.
          </Prose>
        </>
      ),
    },
    {
      id: "special-sorts",
      title: "Linear time sorting",
      subtitle: "Counting Sort, Radix Sort — when O(n log n) isn't fast enough",
      content: (
        <>
          <Prose>
            <strong>Counting Sort</strong> counts occurrences of each value and
            reconstructs the sorted array. O(n + k) where k is the range of
            values. Only works for integers in a known, limited range.
          </Prose>
          <Prose>
            <strong>Radix Sort</strong> sorts by individual digits, from least
            to most significant. O(d × n) where d is the number of digits. Great
            for fixed-length integers or strings. Both are stable but not
            comparison-based — they exploit structure in the data.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`def counting_sort(arr, max_val):
    count = [0] * (max_val + 1)
    for x in arr:
        count[x] += 1

    result = []
    for val, cnt in enumerate(count):
        result.extend([val] * cnt)
    return result

# Example: sort ages (0-120)
ages = [25, 30, 25, 18, 45, 30]
sorted_ages = counting_sort(ages, 120)  # O(n)`}
            </pre>
          </div>
        </>
      ),
    },
  ],

  operations: [
    {
      name: "Bubble Sort",
      average: "O(n²)",
      worst: "O(n²)",
      note: "Simple, stable. O(n) for nearly sorted. Avoid for large n.",
    },
    {
      name: "Selection Sort",
      average: "O(n²)",
      worst: "O(n²)",
      note: "Always O(n²). Minimizes swaps. Not stable.",
    },
    {
      name: "Insertion Sort",
      average: "O(n²)",
      worst: "O(n²)",
      note: "O(n) best case. Stable. Good for small/nearly sorted arrays.",
    },
    {
      name: "Merge Sort",
      average: "O(n log n)",
      worst: "O(n log n)",
      note: "Stable, guaranteed. O(n) extra space.",
    },
    {
      name: "Quick Sort",
      average: "O(n log n)",
      worst: "O(n²)",
      note: "In-place, fastest in practice. Randomize pivot.",
    },
    {
      name: "Timsort (Python)",
      average: "O(n log n)",
      worst: "O(n log n)",
      note: "Hybrid merge+insertion. Stable. O(n) best case.",
    },
    {
      name: "Counting Sort",
      average: "O(n + k)",
      worst: "O(n + k)",
      note: "Linear time. Only for integers in range [0, k].",
    },
    {
      name: "Radix Sort",
      average: "O(d × n)",
      worst: "O(d × n)",
      note: "d = digits. Linear for fixed-width integers.",
    },
  ],

  patterns: [
    {
      id: "custom-comparator",
      name: "Custom comparator sorting",
      tag: "Essential",
      tagColor: "accent",
      description:
        "Sort by custom criteria using key functions. Return tuples for multi-criteria sorting. Use negative values to reverse specific criteria.",
      explanation: `Custom comparators are essential because real problems rarely sort by a single obvious field. The key function transforms each element into a "sort key" before comparison. Python sorts these keys, and elements follow.

For multi-criteria sorting, return a tuple. Python compares tuples lexicographically: first elements compared first, ties broken by second, and so on. This makes (priority, timestamp) sort by priority first, then timestamp. To reverse a specific criterion, negate numeric values: (priority, -timestamp) gives ascending priority but descending timestamp.

For complex comparisons that don't fit the key pattern, use cmp_to_key from functools. This adapts an old-style comparator (returning negative/zero/positive) to the key function interface. Know this exists but prefer key functions when possible—they're clearer and can be more efficient due to caching.`,
      triggers: "\"sort by\", \"custom order\", \"multiple criteria\", \"secondary sort\", \"order by X then Y\", \"rank by\"",
      code: `# Sort intervals by end time (greedy scheduling)
intervals.sort(key=lambda x: x[1])

# Sort by multiple criteria
# Primary: ascending priority
# Secondary: descending timestamp
events.sort(key=lambda e: (e.priority, -e.timestamp))

# Sort strings by length, then alphabetically
words.sort(key=lambda w: (len(w), w))

# Custom object sorting
from functools import cmp_to_key

def compare(a, b):
    if a.score != b.score:
        return b.score - a.score  # Descending
    return a.name < b.name  # Ascending

sorted(players, key=cmp_to_key(compare))`,
      problems: [],
    },
    {
      id: "sort-then-search",
      name: "Sort + Binary Search",
      tag: "High frequency",
      tagColor: "teal",
      description:
        "Sort once (O(n log n)), then binary search multiple times (O(log n) each). Worthwhile when you have many queries on static data.",
      explanation: `This pattern is about amortization. Sorting costs O(n log n) upfront, but binary search costs only O(log n) per query. If you have q queries on static data, total cost is O(n log n + q log n) instead of O(qn) with linear search. The breakeven point is roughly q = n / log n queries.

Python's bisect module handles binary search elegantly. bisect_left finds the leftmost insertion point (where the target would go to maintain sorted order). If arr[idx] == target, you found it. If not, the target doesn't exist but you know where it would be inserted—useful for "count elements less than X" or "find nearest element."

The pattern combines with other techniques. Two Sum on sorted arrays uses two pointers instead of hashmap. Merge intervals sorts by start time first. Finding median in data stream maintains sorted structure. Anytime you see "queries on unchanging data," consider sorting preprocessing.`,
      triggers: "\"multiple queries\", \"search in array\", \"find if exists\", \"count elements less than\", \"static data with lookups\", \"find nearest\"",
      code: `import bisect

def answer_queries(arr, queries):
    arr.sort()  # O(n log n) once

    results = []
    for target in queries:
        # O(log n) per query
        idx = bisect.bisect_left(arr, target)
        found = idx < len(arr) and arr[idx] == target
        results.append(found)

    return results

# Find insertion point to maintain sorted order
def find_position(sorted_arr, val):
    return bisect.bisect_left(sorted_arr, val)

# Count elements less than val
def count_less_than(sorted_arr, val):
    return bisect.bisect_left(sorted_arr, val)`,
      problems: [],
    },
    {
      id: "interval-scheduling",
      name: "Interval scheduling (sort by end)",
      tag: "Classic",
      tagColor: "green",
      description:
        "For non-overlapping interval problems, sort by end time. Greedy: always pick the interval that ends earliest. This maximizes room for future intervals.",
      explanation: `Interval scheduling appears constantly in interviews. The key insight is that the right sorting criterion depends on the problem type. For maximizing non-overlapping intervals, sort by end time. For merging overlapping intervals, sort by start time. For minimum resources to cover all intervals, sort by start with a heap tracking end times.

Why sort by end time for maximum non-overlapping? Greedy proof: choosing the earliest-ending interval leaves the most room for future intervals. Any other choice either ends later (reducing available time) or conflicts (forcing you to skip). The earliest-ending interval dominates all alternatives.

For minimum meeting rooms, the insight shifts. Sort by start time and track ongoing meetings with a min-heap of end times. When a new meeting starts, check if any room is free (earliest ending meeting ended). If so, reuse that room (pop and push new end). If not, add a room (just push). The heap size at any point is the concurrent meeting count.`,
      triggers: "\"non-overlapping\", \"meeting rooms\", \"intervals\", \"schedule\", \"merge intervals\", \"maximum events\", \"minimum resources\", \"overlapping\"",
      code: `def max_non_overlapping(intervals):
    # Sort by end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    last_end = float('-inf')

    for start, end in intervals:
        if start >= last_end:  # No overlap
            count += 1
            last_end = end

    return count

# Minimum meeting rooms (sort + heap)
import heapq

def min_meeting_rooms(intervals):
    intervals.sort(key=lambda x: x[0])  # Sort by start
    heap = []  # Track end times of ongoing meetings

    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heappop(heap)  # Room freed up
        heapq.heappush(heap, end)

    return len(heap)`,
      problems: [],
    },
    {
      id: "merge-sorted-arrays",
      name: "Merge sorted sequences",
      tag: "Medium frequency",
      tagColor: "amber",
      description:
        "Merge k sorted arrays/lists efficiently. Two-way merge is O(n). K-way merge uses a min-heap for O(n log k) total.",
      explanation: `Merging sorted sequences is the heart of merge sort and appears independently in problems involving multiple sorted sources. The two-way merge is fundamental: compare front elements, take the smaller, advance that pointer. Since both inputs are sorted, the output is sorted. O(n) where n is total elements.

K-way merge generalizes this. The naive approach—repeatedly find minimum among k fronts—is O(nk). A min-heap reduces this to O(n log k). The heap always contains one element from each non-exhausted array: the current front. Pop the minimum, add to result, push the next element from that array.

The heap entry must track which array and position the value came from, hence the tuple (value, array_idx, element_idx). When an array exhausts, you simply don't push anything new from it. This pattern is crucial for external sorting (merging sorted chunks from disk) and distributed systems (merging sorted streams).`,
      triggers: "\"merge sorted\", \"k sorted arrays\", \"merge k lists\", \"external sort\", \"combine sorted\", \"multiple sorted sources\"",
      code: `import heapq

def merge_two_sorted(arr1, arr2):
    result = []
    i = j = 0
    while i < len(arr1) and j < len(arr2):
        if arr1[i] <= arr2[j]:
            result.append(arr1[i])
            i += 1
        else:
            result.append(arr2[j])
            j += 1
    result.extend(arr1[i:])
    result.extend(arr2[j:])
    return result

def merge_k_sorted(arrays):
    # Min-heap: (value, array_idx, element_idx)
    heap = []
    for i, arr in enumerate(arrays):
        if arr:
            heapq.heappush(heap, (arr[0], i, 0))

    result = []
    while heap:
        val, arr_idx, elem_idx = heapq.heappop(heap)
        result.append(val)

        if elem_idx + 1 < len(arrays[arr_idx]):
            next_val = arrays[arr_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, arr_idx, elem_idx + 1))

    return result`,
      problems: [],
    },
    {
      id: "dutch-national-flag",
      name: "Dutch National Flag (3-way partition)",
      tag: "Classic",
      tagColor: "coral",
      description:
        "Partition array into three sections in single pass. Used in Quick Sort with duplicates (fat partition) and problems with three categories.",
      explanation: `The Dutch National Flag problem partitions an array into three sections using three pointers in a single pass. It's named after the Netherlands flag (red, white, blue = 0, 1, 2). The algorithm maintains invariants: [0, low) contains 0s, [low, mid) contains 1s, (high, end] contains 2s. Elements in [mid, high] are unprocessed.

The key insight is understanding what happens at each swap. When swapping with low, both low and mid advance because we know the swapped value (from the already-processed region) is correct. When swapping with high, we don't advance mid because the swapped value came from the unprocessed region—we need to check it.

This pattern generalizes to any three-category partition problem or to Quick Sort with many duplicates (fat partition). When the pivot appears many times, three-way partitioning handles the equal elements efficiently by grouping them in the middle. This improves worst-case performance on arrays with many duplicates.`,
      triggers: "\"sort colors\", \"three categories\", \"three-way partition\", \"0s, 1s, 2s\", \"Dutch National Flag\", \"three distinct values\"",
      code: `def sort_colors(nums):
    """Sort array of 0s, 1s, 2s in-place."""
    low = 0              # Next position for 0
    mid = 0              # Current element
    high = len(nums) - 1  # Next position for 2

    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # Don't increment mid — need to check swapped value

# Generalized: partition around pivot
def three_way_partition(nums, pivot):
    low = mid = 0
    high = len(nums) - 1

    while mid <= high:
        if nums[mid] < pivot:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == pivot:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`,
      problems: [],
    },
    {
      id: "topological-sort",
      name: "Topological sort (DAG ordering)",
      tag: "Important",
      tagColor: "accent",
      description:
        "Order nodes in a DAG so all edges point forward. Two approaches: Kahn's algorithm (BFS with in-degree) or DFS with post-order reversal.",
      explanation: `Topological sorting orders nodes in a directed acyclic graph (DAG) so that for every edge u→v, u appears before v. It models dependencies: prerequisites before courses, builds before deployments, imports before usage. Two classic approaches exist, each with unique benefits.

Kahn's algorithm (BFS) tracks in-degrees. Start with nodes having no incoming edges (in-degree 0)—they have no dependencies. Process these, removing their outgoing edges (decrement neighbors' in-degrees). Nodes reaching in-degree 0 can now be processed. If you process all n nodes, the graph is a valid DAG. If not, there's a cycle.

DFS-based topological sort uses post-order traversal reversed. After fully exploring a node's descendants, add the node to the result. Reverse at the end. Why does this work? A node is added only after all nodes reachable from it are added—ensuring it appears before them in the reversed output. Cycle detection uses three states: unvisited, visiting (currently in recursion stack), done.`,
      triggers: "\"course schedule\", \"prerequisites\", \"dependencies\", \"build order\", \"task scheduling\", \"directed acyclic\", \"ordering constraints\"",
      code: `from collections import deque, defaultdict

def topological_sort_kahn(n, edges):
    """Kahn's algorithm: BFS with in-degree tracking."""
    graph = defaultdict(list)
    in_degree = [0] * n

    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1

    queue = deque([i for i in range(n) if in_degree[i] == 0])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)

        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return result if len(result) == n else []  # Empty if cycle

def topological_sort_dfs(n, edges):
    """DFS approach: reverse post-order."""
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)

    visited = [0] * n  # 0: unvisited, 1: visiting, 2: done
    result = []

    def dfs(node):
        if visited[node] == 1:
            return False  # Cycle detected
        if visited[node] == 2:
            return True

        visited[node] = 1
        for neighbor in graph[node]:
            if not dfs(neighbor):
                return False
        visited[node] = 2
        result.append(node)
        return True

    for i in range(n):
        if visited[i] == 0:
            if not dfs(i):
                return []

    return result[::-1]`,
      problems: [],
    },
  ],

  problems: [
    {
      id: "merge-intervals",
      title: "Merge Intervals",
      difficulty: "medium",
      description:
        "Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      examples: [
        {
          input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
          output: "[[1,6],[8,10],[15,18]]",
          explanation: "Intervals [1,3] and [2,6] overlap, merge to [1,6].",
        },
        {
          input: "intervals = [[1,4],[4,5]]",
          output: "[[1,5]]",
          explanation: "Intervals [1,4] and [4,5] are adjacent, merge to [1,5].",
        },
      ],
      starterCode: `def merge(intervals):
    # Your solution here
    pass`,
      solution: `def merge(intervals):
    if len(intervals) <= 1:
        return intervals

    # Sort by start time
    intervals.sort(key=lambda x: x[0])

    result = [intervals[0]]

    for i in range(1, len(intervals)):
        current = intervals[i]
        last_merged = result[-1]

        if current[0] <= last_merged[1]:
            # Overlapping: extend the end
            last_merged[1] = max(last_merged[1], current[1])
        else:
            # Non-overlapping: add new interval
            result.append(current)

    return result`,
      hints: [
        "First step: sort intervals by start time.",
        "After sorting, overlapping intervals are adjacent.",
        "Two intervals overlap if the second starts before the first ends.",
        "When merging, take the maximum of both end times.",
      ],
      testCases: [
        {
          input: "merge([[1,3],[2,6],[8,10],[15,18]])",
          expected: "[[1, 6], [8, 10], [15, 18]]",
          description: "Standard overlapping case",
        },
        {
          input: "merge([[1,4],[4,5]])",
          expected: "[[1, 5]]",
          description: "Adjacent intervals",
        },
        {
          input: "merge([[1,4],[2,3]])",
          expected: "[[1, 4]]",
          description: "Fully contained interval",
        },
      ],
    },
    {
      id: "sort-colors",
      title: "Sort Colors",
      difficulty: "medium",
      description:
        "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red (0), white (1), and blue (2). You must solve this without using the library's sort function.",
      examples: [
        {
          input: "nums = [2,0,2,1,1,0]",
          output: "[0,0,1,1,2,2]",
        },
        {
          input: "nums = [2,0,1]",
          output: "[0,1,2]",
        },
      ],
      starterCode: `def sort_colors(nums):
    # Your solution here (modify in-place)
    pass`,
      solution: `def sort_colors(nums):
    low = 0       # Next position for 0
    mid = 0       # Current element
    high = len(nums) - 1  # Next position for 2

    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # Don't increment mid - need to check swapped value`,
      hints: [
        "This is the Dutch National Flag problem.",
        "Use three pointers: low (0s boundary), mid (current), high (2s boundary).",
        "0s go to the left, 2s go to the right, 1s stay in the middle.",
        "When swapping with high, don't increment mid - the swapped value needs checking.",
      ],
      testCases: [
        {
          input: "(lambda: (sort_colors(a := [2,0,2,1,1,0]), a)[1])()",
          expected: "[0, 0, 1, 1, 2, 2]",
          description: "Standard case",
        },
        {
          input: "(lambda: (sort_colors(a := [2,0,1]), a)[1])()",
          expected: "[0, 1, 2]",
          description: "Three elements",
        },
        {
          input: "(lambda: (sort_colors(a := [0]), a)[1])()",
          expected: "[0]",
          description: "Single element",
        },
      ],
    },
    {
      id: "kth-largest",
      title: "Kth Largest Element in an Array",
      difficulty: "medium",
      description:
        "Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in sorted order, not the kth distinct element.",
      examples: [
        {
          input: "nums = [3,2,1,5,6,4], k = 2",
          output: "5",
          explanation: "Sorted: [1,2,3,4,5,6]. 2nd largest is 5.",
        },
        {
          input: "nums = [3,2,3,1,2,4,5,5,6], k = 4",
          output: "4",
        },
      ],
      starterCode: `def find_kth_largest(nums, k):
    # Your solution here
    pass`,
      solution: `def find_kth_largest(nums, k):
    import heapq
    # Use a min-heap of size k
    # The top of heap will be the kth largest
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
      hints: [
        "Simple approach: sort and return nums[n-k]. O(n log n).",
        "Better: use a min-heap of size k. O(n log k).",
        "Even better: use Quick Select (partial Quick Sort). O(n) average.",
        "The kth largest is the (n-k)th element in sorted order.",
      ],
      testCases: [
        {
          input: "find_kth_largest([3,2,1,5,6,4], 2)",
          expected: "5",
          description: "Standard case",
        },
        {
          input: "find_kth_largest([3,2,3,1,2,4,5,5,6], 4)",
          expected: "4",
          description: "With duplicates",
        },
        {
          input: "find_kth_largest([1], 1)",
          expected: "1",
          description: "Single element",
        },
      ],
    },
    {
      id: "meeting-rooms-ii",
      title: "Meeting Rooms II",
      difficulty: "medium",
      description:
        "Given an array of meeting time intervals where intervals[i] = [start, end], return the minimum number of conference rooms required.",
      examples: [
        {
          input: "intervals = [[0,30],[5,10],[15,20]]",
          output: "2",
          explanation: "Meeting [0,30] conflicts with both others. Need 2 rooms.",
        },
        {
          input: "intervals = [[7,10],[2,4]]",
          output: "1",
          explanation: "No overlap, 1 room is enough.",
        },
      ],
      starterCode: `def min_meeting_rooms(intervals):
    # Your solution here
    pass`,
      solution: `def min_meeting_rooms(intervals):
    if not intervals:
        return 0

    # Extract and sort start/end times separately
    starts = sorted([i[0] for i in intervals])
    ends = sorted([i[1] for i in intervals])

    rooms = 0
    end_ptr = 0

    for i in range(len(starts)):
        # If a meeting starts before the earliest ending, need new room
        if starts[i] < ends[end_ptr]:
            rooms += 1
        else:
            # A room freed up
            end_ptr += 1

    return rooms`,
      hints: [
        "Think of it as tracking concurrent meetings at any point in time.",
        "Separate approach: extract all start and end times, sort them.",
        "Walk through sorted events: +1 room at start, -1 at end.",
        "Alternative: sort by start time, use a min-heap to track earliest end time.",
      ],
      testCases: [
        {
          input: "min_meeting_rooms([[0,30],[5,10],[15,20]])",
          expected: "2",
          description: "Overlapping meetings",
        },
        {
          input: "min_meeting_rooms([[7,10],[2,4]])",
          expected: "1",
          description: "Non-overlapping",
        },
        {
          input: "min_meeting_rooms([[1,5],[2,6],[3,7],[4,8]])",
          expected: "4",
          description: "All overlap",
        },
        {
          input: "min_meeting_rooms([])",
          expected: "0",
          description: "No meetings",
        },
      ],
    },
    {
      id: "largest-number",
      title: "Largest Number",
      difficulty: "medium",
      description:
        "Given a list of non-negative integers nums, arrange them such that they form the largest number and return it. The result may be very large, so return it as a string.",
      examples: [
        {
          input: "nums = [10,2]",
          output: '"210"',
          explanation: "210 > 102",
        },
        {
          input: "nums = [3,30,34,5,9]",
          output: '"9534330"',
        },
      ],
      starterCode: `def largest_number(nums):
    # Your solution here
    pass`,
      solution: `def largest_number(nums):
    from functools import cmp_to_key

    # Custom comparator: compare a+b vs b+a
    def compare(a, b):
        if a + b > b + a:
            return -1
        elif a + b < b + a:
            return 1
        return 0

    # Convert to strings and sort
    strs = [str(n) for n in nums]
    strs.sort(key=cmp_to_key(compare))

    # Handle edge case: all zeros
    if strs[0] == '0':
        return '0'

    return ''.join(strs)`,
      hints: [
        "We need a custom comparator to decide ordering.",
        "For two numbers a and b, compare 'ab' vs 'ba' as strings.",
        "If 'ab' > 'ba', then a should come before b.",
        "Edge case: if the largest number is '0', return '0' (not '000...').",
      ],
      testCases: [
        {
          input: "largest_number([10,2])",
          expected: '"210"',
          description: "Basic case",
        },
        {
          input: "largest_number([3,30,34,5,9])",
          expected: '"9534330"',
          description: "Multiple digits",
        },
        {
          input: "largest_number([0,0])",
          expected: '"0"',
          description: "All zeros",
        },
        {
          input: "largest_number([1])",
          expected: '"1"',
          description: "Single element",
        },
      ],
    },
  ],
};
