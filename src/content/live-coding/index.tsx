import { CodeBlock } from "../../components/CodeBlock";
import type { DataStructure } from "../../types";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] mb-4">
    {children}
  </p>
);

const Code = ({ children }: { children: string }) => (
  <div className="my-4">
    <CodeBlock code={children.trim()} language="python" />
  </div>
);

const Callout = ({
  type,
  title,
  children,
}: {
  type: "tip" | "warning" | "example";
  title?: string;
  children: React.ReactNode;
}) => {
  const colors = {
    tip: { bg: "var(--color-green)", border: "var(--color-green)" },
    warning: { bg: "var(--color-coral)", border: "var(--color-coral)" },
    example: { bg: "var(--color-accent)", border: "var(--color-accent)" },
  };
  const icons = { tip: "💡", warning: "⚠️", example: "🔍" };
  return (
    <div
      className="rounded-lg p-4 my-4 text-sm"
      style={{
        background: `${colors[type].bg}10`,
        borderLeft: `3px solid ${colors[type].border}`,
      }}
    >
      {title && (
        <p className="font-semibold mb-2" style={{ color: colors[type].border }}>
          {icons[type]} {title}
        </p>
      )}
      <div style={{ color: "var(--color-text-secondary)" }}>{children}</div>
    </div>
  );
};

const FunctionCard = ({ name, syntax, description, example }: {
  name: string;
  syntax: string;
  description: string;
  example: string;
}) => (
  <div className="border border-[var(--color-border)] rounded-lg p-4 my-3">
    <div className="flex items-center gap-2 mb-2">
      <code className="text-sm font-semibold px-2 py-0.5 rounded" style={{
        background: "var(--color-accent-glow)",
        color: "var(--color-accent)"
      }}>
        {name}
      </code>
    </div>
    <p className="text-xs text-[var(--color-text-muted)] mb-2">{syntax}</p>
    <p className="text-sm text-[var(--color-text-secondary)] mb-3">{description}</p>
    <CodeBlock code={example.trim()} language="python" />
  </div>
);

export const liveCodingContent: DataStructure = {
  id: "live-coding",
  name: "Live Coding",
  icon: "⚡",
  tagline: "Python essentials for timed coding interviews",
  description:
    "A walkthrough of Python's most useful functions, methods, and patterns for solving coding problems quickly and correctly under time pressure.",
  color: "green",
  viewMode: "pattern-first",

  sections: [
    // ==================== SECTION 1: OVERVIEW ====================
    {
      id: "overview",
      title: "The Live Coding Mindset",
      subtitle: "How to approach timed coding problems",
      content: (
        <>
          <Prose>
            Live coding interviews aren't just about knowing algorithms — they test your ability to think clearly under pressure, communicate your approach, and write clean code quickly. The key is having a mental toolkit of Python patterns that you can reach for instinctively.
          </Prose>

          <Prose>
            This module walks you through Python's most powerful built-in functions and methods. For each one, you'll see what it does, when to use it, and a real example of how it solves a coding problem. The goal is that when you see a problem, you'll immediately recognize which tools to reach for.
          </Prose>

          <Callout type="tip" title="The 5-Minute Rule">
            Before writing any code, spend 5 minutes understanding the problem. Ask clarifying questions: What's the input size? Are there edge cases? What should I return? Restate the problem in your own words. This prevents you from solving the wrong problem.
          </Callout>

          <Prose>
            <strong>What we'll cover:</strong> We'll start with Python's essential built-in functions, then move to string and list methods, dictionaries, the collections module, and finally show how these combine to solve common interview patterns.
          </Prose>
        </>
      ),
    },

    // ==================== SECTION 2: BUILT-IN FUNCTIONS ====================
    {
      id: "builtins",
      title: "Essential Built-in Functions",
      subtitle: "The functions you'll use in almost every problem",
      content: (
        <>
          <Prose>
            Python's built-in functions are your first line of attack. These are globally available — no imports needed — and they're optimized for performance. Knowing these well means you can solve many problems in just a few lines.
          </Prose>

          <FunctionCard
            name="len()"
            syntax="len(sequence) → int"
            description="Returns the number of items in a sequence (string, list, dict, set). This is O(1) for all built-in types — Python stores the length, it doesn't count."
            example={`
# Check if empty
if len(arr) == 0:  # or just: if not arr:
    return []

# Get last element safely
last = arr[-1] if len(arr) > 0 else None

# Common pattern: iterate with index
for i in range(len(arr)):
    print(f"Index {i}: {arr[i]}")
`}
          />

          <FunctionCard
            name="sum()"
            syntax="sum(iterable, start=0) → number"
            description="Adds all items in an iterable. The optional start parameter lets you add to an existing total. Great for quick totals without writing loops."
            example={`
nums = [1, 2, 3, 4, 5]

total = sum(nums)  # 15

# Sum with condition using generator
even_sum = sum(x for x in nums if x % 2 == 0)  # 6

# Sum of absolute values
abs_sum = sum(abs(x) for x in [-1, 2, -3])  # 6

# Problem: Check if array can be split into equal halves
def can_split_equal(arr):
    total = sum(arr)
    if total % 2 != 0:
        return False
    # ... find subset that sums to total // 2
`}
          />

          <FunctionCard
            name="min() / max()"
            syntax="min(iterable) or min(a, b, ...) → smallest item"
            description="Find the smallest or largest item. With the key parameter, you can compare by a computed value — extremely powerful for finding 'best' items by some criteria."
            example={`
nums = [3, 1, 4, 1, 5]

smallest = min(nums)  # 1
largest = max(nums)   # 5

# With key function - find shortest string
words = ["apple", "pie", "a", "banana"]
shortest = min(words, key=len)  # "a"

# Find person with highest score
people = [("Alice", 85), ("Bob", 92), ("Carol", 78)]
top_scorer = max(people, key=lambda p: p[1])  # ("Bob", 92)

# Problem: Find closest value to target
def closest_to(arr, target):
    return min(arr, key=lambda x: abs(x - target))
`}
          />

          <FunctionCard
            name="sorted()"
            syntax="sorted(iterable, key=None, reverse=False) → list"
            description="Returns a NEW sorted list. Unlike list.sort(), this works on any iterable and doesn't modify the original. The key parameter is where the magic happens."
            example={`
nums = [3, 1, 4, 1, 5]
sorted_nums = sorted(nums)  # [1, 1, 3, 4, 5] - original unchanged

# Sort strings by length
words = ["banana", "pie", "apple"]
by_length = sorted(words, key=len)  # ["pie", "apple", "banana"]

# Sort tuples by second element, descending
pairs = [(1, 'b'), (2, 'a'), (3, 'c')]
by_second = sorted(pairs, key=lambda x: x[1])  # [(2,'a'), (1,'b'), (3,'c')]

# Multi-level sort: by length, then alphabetically
words = ["cat", "apple", "bat", "dog"]
result = sorted(words, key=lambda w: (len(w), w))
# ["bat", "cat", "dog", "apple"]

# Problem: Sort intervals by start time
intervals = [[1,3], [2,6], [8,10]]
sorted_intervals = sorted(intervals, key=lambda x: x[0])
`}
          />

          <FunctionCard
            name="enumerate()"
            syntax="enumerate(iterable, start=0) → iterator of (index, item)"
            description="When you need both the index AND the value while iterating. This is more Pythonic than using range(len(arr)) and accessing arr[i]."
            example={`
fruits = ["apple", "banana", "cherry"]

# Instead of this:
for i in range(len(fruits)):
    print(i, fruits[i])

# Do this:
for i, fruit in enumerate(fruits):
    print(i, fruit)

# Start counting from 1
for rank, name in enumerate(["Alice", "Bob"], start=1):
    print(f"#{rank}: {name}")

# Problem: Find indices of all target values
def find_all_indices(arr, target):
    return [i for i, val in enumerate(arr) if val == target]
`}
          />

          <FunctionCard
            name="zip()"
            syntax="zip(iter1, iter2, ...) → iterator of tuples"
            description="Pairs up elements from multiple iterables. Stops at the shortest one. Perfect for iterating over two lists in parallel or creating dictionaries from two lists."
            example={`
names = ["Alice", "Bob", "Carol"]
scores = [85, 92, 78]

# Iterate in parallel
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# Create dictionary from two lists
name_to_score = dict(zip(names, scores))
# {"Alice": 85, "Bob": 92, "Carol": 78}

# Unzip (transpose) with *
pairs = [(1, 'a'), (2, 'b'), (3, 'c')]
nums, letters = zip(*pairs)
# nums = (1, 2, 3), letters = ('a', 'b', 'c')

# Problem: Check if two strings are equal character by character
def compare_chars(s1, s2):
    return all(c1 == c2 for c1, c2 in zip(s1, s2)) and len(s1) == len(s2)
`}
          />

          <FunctionCard
            name="any() / all()"
            syntax="any(iterable) → bool / all(iterable) → bool"
            description="any() returns True if ANY element is truthy. all() returns True if ALL elements are truthy. These short-circuit — they stop as soon as the answer is known."
            example={`
nums = [0, 1, 2, 3]

any(nums)  # True (1, 2, 3 are truthy)
all(nums)  # False (0 is falsy)

# Check if any number is negative
has_negative = any(x < 0 for x in nums)

# Check if all strings are non-empty
words = ["hello", "world", ""]
all_non_empty = all(words)  # False

# Problem: Check if any two elements sum to target
def has_pair_with_sum(arr, target):
    seen = set()
    return any((target - x) in seen or not seen.add(x) for x in arr)
    # Note: set.add returns None (falsy), so "or not seen.add(x)" always continues
`}
          />

          <FunctionCard
            name="reversed()"
            syntax="reversed(sequence) → iterator"
            description="Returns an iterator that yields items in reverse order. More memory-efficient than slicing [::-1] for large sequences since it doesn't create a copy."
            example={`
nums = [1, 2, 3, 4, 5]

# Iterate in reverse
for x in reversed(nums):
    print(x)  # 5, 4, 3, 2, 1

# Convert to list if needed
rev_list = list(reversed(nums))

# For strings, you need to join
s = "hello"
rev_string = "".join(reversed(s))  # "olleh"
# Or just use slicing: s[::-1]

# Problem: Check palindrome
def is_palindrome(s):
    return s == s[::-1]
    # or: return all(a == b for a, b in zip(s, reversed(s)))
`}
          />

          <FunctionCard
            name="map() / filter()"
            syntax="map(func, iterable) → iterator / filter(func, iterable) → iterator"
            description="map applies a function to every item. filter keeps only items where the function returns True. Often list comprehensions are clearer, but these are useful for simple transformations."
            example={`
nums = [1, 2, 3, 4, 5]

# map: apply function to all
squares = list(map(lambda x: x**2, nums))  # [1, 4, 9, 16, 25]
# Equivalent: [x**2 for x in nums]

# filter: keep matching items
evens = list(filter(lambda x: x % 2 == 0, nums))  # [2, 4]
# Equivalent: [x for x in nums if x % 2 == 0]

# map with multiple iterables
sums = list(map(lambda a, b: a + b, [1, 2], [10, 20]))  # [11, 22]

# Convert strings to ints
str_nums = ["1", "2", "3"]
int_nums = list(map(int, str_nums))  # [1, 2, 3]
`}
          />
        </>
      ),
    },

    // ==================== SECTION 3: STRING METHODS ====================
    {
      id: "strings",
      title: "String Methods",
      subtitle: "Manipulating and analyzing text",
      content: (
        <>
          <Prose>
            Strings are immutable in Python — every "modification" creates a new string. This matters for performance: if you're building a string character by character, use a list and join at the end, not repeated concatenation.
          </Prose>

          <Prose>
            Here are the string methods you'll reach for most often in coding interviews:
          </Prose>

          <FunctionCard
            name="split() / join()"
            syntax="str.split(sep) → list / sep.join(list) → str"
            description="split breaks a string into a list. join combines a list into a string. These are inverses of each other and incredibly common."
            example={`
s = "hello world python"

words = s.split()  # ["hello", "world", "python"] - splits on whitespace
words = s.split(" ")  # same, explicit space

# Split on specific character
csv = "a,b,c,d"
parts = csv.split(",")  # ["a", "b", "c", "d"]

# Join back together
"-".join(parts)  # "a-b-c-d"
"".join(parts)   # "abcd" - no separator

# Problem: Reverse words in a sentence
def reverse_words(s):
    return " ".join(s.split()[::-1])

reverse_words("hello world")  # "world hello"
`}
          />

          <FunctionCard
            name="strip() / lstrip() / rstrip()"
            syntax="str.strip(chars) → str"
            description="Remove leading/trailing whitespace (or specified characters). Essential for cleaning user input or parsing data."
            example={`
s = "  hello world  "

s.strip()   # "hello world" - both ends
s.lstrip()  # "hello world  " - left only
s.rstrip()  # "  hello world" - right only

# Remove specific characters
"...hello...".strip(".")  # "hello"
"xxhelloxx".strip("x")    # "hello"

# Problem: Clean and compare strings
def clean_compare(s1, s2):
    return s1.strip().lower() == s2.strip().lower()
`}
          />

          <FunctionCard
            name="replace()"
            syntax="str.replace(old, new, count) → str"
            description="Replace all occurrences of a substring. The optional count limits replacements. Returns a new string."
            example={`
s = "hello world"

s.replace("world", "python")  # "hello python"
s.replace("l", "L")           # "heLLo worLd"
s.replace("l", "L", 1)        # "heLlo world" - only first

# Remove all spaces
"h e l l o".replace(" ", "")  # "hello"

# Problem: Compress string (basic)
def simple_compress(s):
    return s.replace("  ", " ")  # collapse double spaces
`}
          />

          <FunctionCard
            name="find() / index() / count()"
            syntax="str.find(sub) → int / str.count(sub) → int"
            description="find returns the index of first occurrence (-1 if not found). index is similar but raises ValueError. count returns number of occurrences."
            example={`
s = "hello hello"

s.find("lo")     # 3 (first occurrence)
s.find("xyz")    # -1 (not found)
s.index("lo")    # 3 (raises ValueError if not found)

s.count("l")     # 4
s.count("hello") # 2

# Problem: Check if substring exists
def contains(s, sub):
    return s.find(sub) != -1
    # or just: return sub in s
`}
          />

          <FunctionCard
            name="startswith() / endswith()"
            syntax="str.startswith(prefix) → bool"
            description="Check if string starts/ends with a given prefix/suffix. Can also check multiple options by passing a tuple."
            example={`
filename = "report.pdf"

filename.endswith(".pdf")      # True
filename.startswith("report")  # True

# Check multiple extensions
filename.endswith((".pdf", ".doc", ".txt"))  # True

# Problem: Filter files by extension
def get_python_files(files):
    return [f for f in files if f.endswith(".py")]
`}
          />

          <FunctionCard
            name="isalpha() / isdigit() / isalnum()"
            syntax="str.isalpha() → bool"
            description="Check character types. isalpha = letters only, isdigit = numbers only, isalnum = letters or numbers. Useful for validation and filtering."
            example={`
"hello".isalpha()   # True
"hello1".isalpha()  # False

"123".isdigit()     # True
"12.3".isdigit()    # False (dot isn't a digit)

"hello123".isalnum()  # True
"hello 123".isalnum() # False (space isn't alphanumeric)

# Problem: Clean string to alphanumeric only
def clean_string(s):
    return "".join(c for c in s if c.isalnum())

clean_string("Hello, World! 123")  # "HelloWorld123"

# Problem: Valid palindrome (ignore non-alphanumeric)
def is_valid_palindrome(s):
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]
`}
          />

          <FunctionCard
            name="lower() / upper() / title()"
            syntax="str.lower() → str"
            description="Case conversion. lower() and upper() are essential for case-insensitive comparisons."
            example={`
"Hello World".lower()  # "hello world"
"Hello World".upper()  # "HELLO WORLD"
"hello world".title()  # "Hello World"

# Case-insensitive comparison
def same_word(a, b):
    return a.lower() == b.lower()

same_word("Hello", "HELLO")  # True
`}
          />

          <FunctionCard
            name="ord() / chr()"
            syntax="ord(char) → int / chr(int) → char"
            description="Convert between characters and their ASCII/Unicode values. Useful for character arithmetic and encoding problems."
            example={`
ord('a')  # 97
ord('A')  # 65
ord('0')  # 48

chr(97)  # 'a'
chr(65)  # 'A'

# Character arithmetic
def next_char(c):
    return chr(ord(c) + 1)

next_char('a')  # 'b'

# Problem: Check if letters are consecutive
def is_consecutive(s):
    return all(ord(s[i+1]) - ord(s[i]) == 1 for i in range(len(s)-1))

is_consecutive("abc")  # True
is_consecutive("acd")  # False
`}
          />
        </>
      ),
    },

    // ==================== SECTION 4: LIST METHODS ====================
    {
      id: "lists",
      title: "List Methods & Slicing",
      subtitle: "Working with arrays efficiently",
      content: (
        <>
          <Prose>
            Lists are Python's workhorse data structure. Understanding their methods and time complexities is crucial — for example, append is O(1) but insert at the beginning is O(n) because everything shifts.
          </Prose>

          <FunctionCard
            name="append() / extend()"
            syntax="list.append(item) / list.extend(iterable)"
            description="append adds ONE item to the end (O(1)). extend adds ALL items from an iterable. A common mistake is using append when you mean extend."
            example={`
nums = [1, 2, 3]

nums.append(4)      # [1, 2, 3, 4]
nums.append([5, 6]) # [1, 2, 3, 4, [5, 6]] - adds list as single item!

nums = [1, 2, 3]
nums.extend([4, 5]) # [1, 2, 3, 4, 5] - adds each item

# Equivalent ways to extend:
nums += [6, 7]      # [1, 2, 3, 4, 5, 6, 7]
nums = nums + [8]   # Creates new list (less efficient)
`}
          />

          <FunctionCard
            name="pop() / remove()"
            syntax="list.pop(index) → item / list.remove(value)"
            description="pop removes and returns item at index (default: last). remove deletes first occurrence of a value. pop(-1) is O(1), pop(0) is O(n)."
            example={`
nums = [1, 2, 3, 4, 5]

nums.pop()    # returns 5, list is now [1, 2, 3, 4]
nums.pop(0)   # returns 1, list is now [2, 3, 4] - O(n)!

nums = [1, 2, 3, 2, 1]
nums.remove(2)  # [1, 3, 2, 1] - removes FIRST 2 only

# For O(1) removal from front, use collections.deque
from collections import deque
d = deque([1, 2, 3])
d.popleft()  # O(1)
`}
          />

          <FunctionCard
            name="insert()"
            syntax="list.insert(index, item)"
            description="Insert item at a specific position. This is O(n) because items after must shift. For frequent insertions, consider a different data structure."
            example={`
nums = [1, 3, 4]
nums.insert(1, 2)  # [1, 2, 3, 4] - insert 2 at index 1

# Insert at beginning (slow - O(n))
nums.insert(0, 0)  # [0, 1, 2, 3, 4]

# For many insertions, build a new list instead
# Instead of:
for item in items_to_insert:
    nums.insert(0, item)  # O(n²) total!

# Do:
nums = items_to_insert[::-1] + nums  # O(n)
`}
          />

          <FunctionCard
            name="index() / count()"
            syntax="list.index(value) → int / list.count(value) → int"
            description="index finds position of first occurrence (raises ValueError if missing). count returns number of occurrences. Both are O(n)."
            example={`
nums = [1, 2, 3, 2, 1]

nums.index(2)   # 1 (first occurrence)
nums.count(2)   # 2

# Safe index check
def safe_index(arr, val):
    try:
        return arr.index(val)
    except ValueError:
        return -1

# Or use: val in arr before calling index
`}
          />

          <FunctionCard
            name="sort() vs sorted()"
            syntax="list.sort(key, reverse) vs sorted(list, key, reverse)"
            description="sort() modifies the list in-place and returns None. sorted() returns a new list. Common mistake: x = list.sort() gives you None!"
            example={`
nums = [3, 1, 4, 1, 5]

# In-place sort
nums.sort()  # nums is now [1, 1, 3, 4, 5], returns None
result = nums.sort()  # result is None! Common bug.

# New sorted list
nums = [3, 1, 4, 1, 5]
new_list = sorted(nums)  # [1, 1, 3, 4, 5], nums unchanged

# Reverse sort
nums.sort(reverse=True)  # [5, 4, 3, 1, 1]
sorted(nums, reverse=True)

# Custom key
words = ["banana", "pie", "apple"]
words.sort(key=len)  # ["pie", "apple", "banana"]
`}
          />

          <FunctionCard
            name="Slicing"
            syntax="list[start:end:step]"
            description="Extract portions of a list. The slice creates a new list. This is one of Python's most powerful features."
            example={`
nums = [0, 1, 2, 3, 4, 5]

nums[1:4]    # [1, 2, 3] - indices 1, 2, 3
nums[:3]     # [0, 1, 2] - first 3
nums[3:]     # [3, 4, 5] - from index 3 to end
nums[-2:]    # [4, 5] - last 2
nums[:-2]    # [0, 1, 2, 3] - all except last 2

nums[::2]    # [0, 2, 4] - every other element
nums[1::2]   # [1, 3, 5] - every other, starting at 1
nums[::-1]   # [5, 4, 3, 2, 1, 0] - reversed

# Slice assignment
nums[1:3] = [10, 20]  # [0, 10, 20, 3, 4, 5]

# Problem: Rotate array by k positions
def rotate(arr, k):
    k = k % len(arr)  # handle k > len
    return arr[-k:] + arr[:-k]

rotate([1, 2, 3, 4, 5], 2)  # [4, 5, 1, 2, 3]
`}
          />

          <FunctionCard
            name="List Comprehensions"
            syntax="[expression for item in iterable if condition]"
            description="The Pythonic way to transform and filter lists in one line. Master these — they're cleaner and often faster than loops."
            example={`
nums = [1, 2, 3, 4, 5]

# Transform
squares = [x**2 for x in nums]  # [1, 4, 9, 16, 25]

# Filter
evens = [x for x in nums if x % 2 == 0]  # [2, 4]

# Transform + filter
even_squares = [x**2 for x in nums if x % 2 == 0]  # [4, 16]

# Nested loops
pairs = [(x, y) for x in [1, 2] for y in [3, 4]]
# [(1, 3), (1, 4), (2, 3), (2, 4)]

# 2D list (matrix)
matrix = [[0] * 3 for _ in range(3)]  # 3x3 zeros
# NOT: [[0] * 3] * 3  - creates shared references!

# Flatten nested list
nested = [[1, 2], [3, 4], [5]]
flat = [x for sublist in nested for x in sublist]  # [1, 2, 3, 4, 5]
`}
          />
        </>
      ),
    },

    // ==================== SECTION 5: DICTIONARIES ====================
    {
      id: "dicts",
      title: "Dictionary Methods",
      subtitle: "Key-value storage with O(1) lookup",
      content: (
        <>
          <Prose>
            Dictionaries are hash tables — they give you O(1) average-case lookup, insertion, and deletion. When you need to "remember" values you've seen, count frequencies, or group items, reach for a dictionary.
          </Prose>

          <FunctionCard
            name="get()"
            syntax="dict.get(key, default) → value"
            description="Retrieve a value without risking KeyError. Returns the default (None if not specified) when key is missing. This is safer than dict[key]."
            example={`
scores = {"Alice": 85, "Bob": 92}

scores["Alice"]     # 85
scores["Carol"]     # KeyError!
scores.get("Carol") # None
scores.get("Carol", 0)  # 0 (custom default)

# Common pattern: count with get
def count_chars(s):
    counts = {}
    for c in s:
        counts[c] = counts.get(c, 0) + 1
    return counts

count_chars("hello")  # {'h': 1, 'e': 1, 'l': 2, 'o': 1}
`}
          />

          <FunctionCard
            name="setdefault()"
            syntax="dict.setdefault(key, default) → value"
            description="Get a key's value, but if missing, set it to default first. Perfect for building dict-of-lists without checking existence."
            example={`
groups = {}

# Without setdefault (verbose)
if "fruits" not in groups:
    groups["fruits"] = []
groups["fruits"].append("apple")

# With setdefault (one line)
groups.setdefault("vegetables", []).append("carrot")

# Problem: Group anagrams
def group_anagrams(words):
    groups = {}
    for word in words:
        key = "".join(sorted(word))
        groups.setdefault(key, []).append(word)
    return list(groups.values())
`}
          />

          <FunctionCard
            name="keys() / values() / items()"
            syntax="dict.keys() / dict.values() / dict.items()"
            description="Get views of dictionary contents. items() returns (key, value) pairs — essential for iterating over dictionaries."
            example={`
scores = {"Alice": 85, "Bob": 92, "Carol": 78}

list(scores.keys())    # ["Alice", "Bob", "Carol"]
list(scores.values())  # [85, 92, 78]
list(scores.items())   # [("Alice", 85), ("Bob", 92), ("Carol", 78)]

# Iterate over both keys and values
for name, score in scores.items():
    print(f"{name}: {score}")

# Find key with max value
best = max(scores.items(), key=lambda x: x[1])  # ("Bob", 92)

# Or more directly:
best_name = max(scores, key=scores.get)  # "Bob"
`}
          />

          <FunctionCard
            name="Dictionary Comprehensions"
            syntax="{key: value for item in iterable}"
            description="Create dictionaries in one line. Works like list comprehensions but produces a dict."
            example={`
# Create dict from two lists
names = ["Alice", "Bob"]
scores = [85, 92]
d = {name: score for name, score in zip(names, scores)}
# {"Alice": 85, "Bob": 92}

# Square numbers as values
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Filter while creating
d = {k: v for k, v in scores.items() if v >= 80}

# Swap keys and values
inverted = {v: k for k, v in d.items()}

# Problem: Character to index mapping
def char_to_index(s):
    return {c: i for i, c in enumerate(s)}
`}
          />

          <Callout type="example" title="Two Sum with Dictionary">
            The classic example of using a dictionary for O(1) lookup:
          </Callout>

          <Code>{`
def two_sum(nums, target):
    """Find two indices that sum to target."""
    seen = {}  # value -> index

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

    return []

# Without dictionary: O(n²) - check every pair
# With dictionary: O(n) - single pass
`}</Code>
        </>
      ),
    },

    // ==================== SECTION 6: COLLECTIONS MODULE ====================
    {
      id: "collections",
      title: "The collections Module",
      subtitle: "Specialized containers for common patterns",
      content: (
        <>
          <Prose>
            The collections module provides specialized container types that solve common problems more elegantly than basic dicts and lists. Counter, defaultdict, and deque are the ones you'll use most.
          </Prose>

          <FunctionCard
            name="Counter"
            syntax="from collections import Counter"
            description="A dictionary subclass for counting. Automatically handles missing keys, supports arithmetic operations, and has useful methods like most_common()."
            example={`
from collections import Counter

# Count occurrences
s = "abracadabra"
counts = Counter(s)  # Counter({'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1})

counts['a']  # 5
counts['z']  # 0 (missing keys return 0, not KeyError)

# Most common elements
counts.most_common(2)  # [('a', 5), ('b', 2)]

# Counter arithmetic
c1 = Counter("aab")  # Counter({'a': 2, 'b': 1})
c2 = Counter("abb")  # Counter({'b': 2, 'a': 1})

c1 + c2  # Counter({'a': 3, 'b': 3})
c1 - c2  # Counter({'a': 1}) - only keeps positive counts

# Problem: Check anagram
def is_anagram(s1, s2):
    return Counter(s1) == Counter(s2)

# Problem: Top K frequent elements
def top_k_frequent(nums, k):
    return [x for x, _ in Counter(nums).most_common(k)]
`}
          />

          <FunctionCard
            name="defaultdict"
            syntax="from collections import defaultdict"
            description="A dict that auto-creates missing values. Specify a factory function (list, int, set) and never worry about KeyError again."
            example={`
from collections import defaultdict

# Auto-create lists
groups = defaultdict(list)
groups["fruits"].append("apple")  # No need to check if key exists
groups["fruits"].append("banana")
# defaultdict(list, {'fruits': ['apple', 'banana']})

# Auto-create counters
counts = defaultdict(int)  # int() returns 0
for char in "hello":
    counts[char] += 1  # No need for .get() or checking

# Auto-create sets
graph = defaultdict(set)
graph[1].add(2)
graph[1].add(3)
graph[2].add(1)

# Problem: Group words by length
def group_by_length(words):
    groups = defaultdict(list)
    for word in words:
        groups[len(word)].append(word)
    return dict(groups)
`}
          />

          <FunctionCard
            name="deque"
            syntax="from collections import deque"
            description="Double-ended queue with O(1) operations on both ends. Use this when you need to add/remove from the front — list.pop(0) is O(n)!"
            example={`
from collections import deque

q = deque([1, 2, 3])

# O(1) operations on both ends
q.append(4)      # [1, 2, 3, 4] - add to right
q.appendleft(0)  # [0, 1, 2, 3, 4] - add to left
q.pop()          # returns 4, deque is [0, 1, 2, 3]
q.popleft()      # returns 0, deque is [1, 2, 3]

# Rotate
q.rotate(1)   # [3, 1, 2] - rotate right
q.rotate(-1)  # [1, 2, 3] - rotate left

# Bounded deque (sliding window)
recent = deque(maxlen=3)
for i in range(5):
    recent.append(i)
# deque is [2, 3, 4] - oldest items auto-removed

# Problem: BFS template
def bfs(start, end, get_neighbors):
    queue = deque([start])
    visited = {start}

    while queue:
        node = queue.popleft()  # O(1)!
        if node == end:
            return True
        for neighbor in get_neighbors(node):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return False
`}
          />
        </>
      ),
    },

    // ==================== SECTION 7: PANDAS ESSENTIALS ====================
    {
      id: "pandas",
      title: "Pandas Essentials",
      subtitle: "Data manipulation for coding interviews",
      content: (
        <>
          <Prose>
            Pandas is Python's data manipulation library, built on NumPy. While not always available in coding interviews, many HackerRank-style tests (especially for data/ML roles) allow it. Knowing a few key operations can dramatically simplify data processing problems.
          </Prose>

          <Callout type="tip" title="When to Use Pandas">
            If the problem involves tabular data, CSV parsing, grouping/aggregating, or complex filtering — and pandas is available — it can turn a 50-line solution into 5 lines.
          </Callout>

          <FunctionCard
            name="DataFrame Creation"
            syntax="pd.DataFrame(data, columns=[...])"
            description="DataFrames are 2D labeled data structures (like a spreadsheet). Create from dicts, lists of dicts, or lists of lists. Each column is a Series."
            example={`
import pandas as pd

# From dict (column-oriented)
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Carol'],
    'age': [25, 30, 35],
    'score': [85, 92, 78]
})

# From list of dicts (row-oriented)
data = [{'name': 'Alice', 'age': 25}, {'name': 'Bob', 'age': 30}]
df = pd.DataFrame(data)

# Access column
df['name']        # Series: ['Alice', 'Bob', 'Carol']
df.name           # Same thing

# Access multiple columns
df[['name', 'score']]  # DataFrame subset
`}
          />

          <FunctionCard
            name="Selecting & Filtering"
            syntax="df[condition] / df.loc[rows, cols] / df.iloc[row_idx, col_idx]"
            description="Filter rows with boolean conditions. Use loc for label-based indexing, iloc for integer positions. Chaining conditions uses & (and) and | (or) with parentheses."
            example={`
# Boolean filtering
df[df['age'] > 25]           # Rows where age > 25
df[df['name'] == 'Alice']    # Rows where name is Alice

# Multiple conditions (need parentheses!)
df[(df['age'] > 25) & (df['score'] >= 80)]

# loc: label-based
df.loc[0, 'name']            # First row, name column
df.loc[:, ['name', 'age']]   # All rows, specific columns
df.loc[df['age'] > 25, 'name']  # Names where age > 25

# iloc: integer position
df.iloc[0]          # First row
df.iloc[0:2]        # First two rows
df.iloc[:, 0]       # First column

# Problem: Find high performers
high_performers = df[df['score'] >= 90]['name'].tolist()
`}
          />

          <FunctionCard
            name="groupby() + Aggregations"
            syntax="df.groupby(column).agg(func)"
            description="Split data into groups, apply a function, combine results. The most powerful pandas operation for interview problems."
            example={`
sales = pd.DataFrame({
    'product': ['A', 'B', 'A', 'B', 'A'],
    'region': ['East', 'East', 'West', 'West', 'East'],
    'amount': [100, 150, 200, 120, 80]
})

# Sum by product
sales.groupby('product')['amount'].sum()
# product
# A    380
# B    270

# Multiple aggregations
sales.groupby('product')['amount'].agg(['sum', 'mean', 'count'])

# Group by multiple columns
sales.groupby(['product', 'region'])['amount'].sum()

# Named aggregations (cleaner output)
sales.groupby('product').agg(
    total=('amount', 'sum'),
    avg=('amount', 'mean'),
    n=('amount', 'count')
)

# Problem: Find product with highest total sales
top_product = sales.groupby('product')['amount'].sum().idxmax()
`}
          />

          <FunctionCard
            name="apply() & transform()"
            syntax="df.apply(func) / df['col'].apply(func)"
            description="Apply custom functions to rows, columns, or elements. Use apply for element-wise or row/column-wise operations. Transform preserves the original shape."
            example={`
df = pd.DataFrame({'x': [1, 2, 3], 'y': [4, 5, 6]})

# Apply to column (element-wise)
df['x_squared'] = df['x'].apply(lambda v: v ** 2)

# Apply to each row (axis=1)
df['sum'] = df.apply(lambda row: row['x'] + row['y'], axis=1)

# Apply with named function
def categorize_score(score):
    if score >= 90: return 'A'
    elif score >= 80: return 'B'
    else: return 'C'

df['grade'] = df['score'].apply(categorize_score)

# Transform: returns same-length Series (good for group operations)
df['score_normalized'] = df.groupby('category')['score'].transform(
    lambda x: (x - x.mean()) / x.std()
)
`}
          />

          <FunctionCard
            name="Useful One-Liners"
            syntax="Common operations"
            description="These patterns come up frequently in data manipulation problems."
            example={`
import pandas as pd

# Read CSV
df = pd.read_csv('data.csv')

# Drop duplicates
df.drop_duplicates()
df.drop_duplicates(subset=['name'])  # Based on specific columns

# Handle missing values
df.dropna()                 # Remove rows with any NaN
df.fillna(0)                # Fill NaN with 0
df['col'].fillna(df['col'].mean())  # Fill with mean

# Sort
df.sort_values('score', ascending=False)
df.sort_values(['region', 'score'])  # Multi-column sort

# Value counts (frequency)
df['category'].value_counts()

# Merge DataFrames (SQL-style join)
pd.merge(df1, df2, on='id')           # Inner join
pd.merge(df1, df2, on='id', how='left')  # Left join

# Pivot table
df.pivot_table(values='amount', index='region', columns='product', aggfunc='sum')

# Quick stats
df.describe()  # count, mean, std, min, max, quartiles
df['col'].nunique()  # Number of unique values
`}
          />

          <Callout type="warning" title="Performance Note">
            Pandas is optimized for batch operations. Avoid iterating with for loops — use vectorized operations (df['col'] * 2) or apply() instead. A loop over 1M rows can be 100x slower than a vectorized operation.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 8: COMMON PATTERNS ====================
    {
      id: "patterns",
      title: "Putting It Together: Common Patterns",
      subtitle: "How these tools combine to solve real problems",
      content: (
        <>
          <Prose>
            Now let's see how these functions and methods combine into patterns you'll use repeatedly. Each pattern below solves a category of problems — recognize the pattern, and you have a template to follow.
          </Prose>

          <Callout type="example" title="Pattern: Frequency Count">
            Use Counter or a dict to count occurrences. Many problems reduce to "count things, then answer a question about counts."
          </Callout>

          <Code>{`
from collections import Counter

# Are two strings anagrams?
def is_anagram(s, t):
    return Counter(s) == Counter(t)

# Find most frequent element
def most_frequent(nums):
    return Counter(nums).most_common(1)[0][0]

# Find first unique character
def first_unique(s):
    counts = Counter(s)
    for i, c in enumerate(s):
        if counts[c] == 1:
            return i
    return -1
`}</Code>

          <Callout type="example" title="Pattern: Two Pointers">
            Use two indices moving toward each other (or in the same direction) to avoid nested loops.
          </Callout>

          <Code>{`
# Palindrome check
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

# Two sum in sorted array
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        current = nums[left] + nums[right]
        if current == target:
            return [left, right]
        elif current < target:
            left += 1
        else:
            right -= 1
    return []

# Remove duplicates in-place (sorted array)
def remove_duplicates(nums):
    if not nums:
        return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1
    return write
`}</Code>

          <Callout type="example" title="Pattern: Sliding Window">
            Maintain a window over the array, expanding and contracting based on conditions.
          </Callout>

          <Code>{`
# Maximum sum subarray of size k
def max_sum_k(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum

    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]  # slide window
        max_sum = max(max_sum, window_sum)

    return max_sum

# Longest substring without repeating characters
def longest_unique(s):
    seen = {}
    left = max_len = 0

    for right, char in enumerate(s):
        if char in seen and seen[char] >= left:
            left = seen[char] + 1
        seen[char] = right
        max_len = max(max_len, right - left + 1)

    return max_len
`}</Code>

          <Callout type="example" title="Pattern: Hash Set for O(1) Lookup">
            When you need to check "have I seen this before?", use a set.
          </Callout>

          <Code>{`
# Find duplicate
def has_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False

# Or simply:
def has_duplicate_simple(nums):
    return len(nums) != len(set(nums))

# Find intersection of two arrays
def intersection(nums1, nums2):
    return list(set(nums1) & set(nums2))

# Find missing number (0 to n)
def missing_number(nums):
    full_set = set(range(len(nums) + 1))
    return (full_set - set(nums)).pop()
`}</Code>

          <Callout type="example" title="Pattern: Sorting + Greedy">
            Sort the input first, then make greedy choices.
          </Callout>

          <Code>{`
# Merge overlapping intervals
def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])  # sort by start
    merged = [intervals[0]]

    for start, end in intervals[1:]:
        if start <= merged[-1][1]:  # overlapping
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])

    return merged

# Meeting rooms (can attend all?)
def can_attend_all(intervals):
    intervals.sort()
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:
            return False
    return True
`}</Code>
        </>
      ),
    },
  ],

  // ==================== OPERATIONS CHEAT SHEET ====================
  operations: [
    {
      name: "len()",
      note: "O(1)",
      useCase: "Get size of any collection. Python pre-computes length, so it's instant even for huge lists. Use for edge case checks, loop bounds, and validation.",
      example: `# Edge case guard
if len(nums) == 0:
    return None

# Loop with index access
for i in range(len(arr)):
    print(i, arr[i])

# Pythonic empty check (preferred)
if not arr:  # same as len(arr) == 0
    return []`,
    },
    {
      name: "sum() / min() / max()",
      note: "O(n)",
      useCase: "Quick aggregations without writing loops. The key= parameter is powerful—use it to find min/max by a computed value (like finding shortest string or highest score).",
      example: `total = sum(prices)  # basic sum

# Conditional sum with generator
even_sum = sum(x for x in nums if x % 2 == 0)

# Find by criteria using key=
shortest = min(words, key=len)
top_scorer = max(students, key=lambda s: s[1])

# Find closest value to target
closest = min(arr, key=lambda x: abs(x - target))`,
    },
    {
      name: "sorted()",
      note: "O(n log n)",
      useCase: "Returns a NEW sorted list—original unchanged. Works on any iterable. The key= parameter lets you sort by computed values. Use for interval problems, custom ordering.",
      example: `# Sort intervals by start time
sorted(intervals, key=lambda x: x[0])

# Sort strings by length
sorted(words, key=len)

# Multi-level: by length, then alphabetically
sorted(words, key=lambda w: (len(w), w))

# Descending order
sorted(nums, reverse=True)`,
    },
    {
      name: "list.sort()",
      note: "O(n log n)",
      useCase: "Sorts IN PLACE and returns None (not the sorted list!). Use when you don't need the original order. Common bug: assigning result of sort().",
      example: `# Correct usage
nums = [3, 1, 4]
nums.sort()  # modifies nums in place
print(nums)  # [1, 3, 4]

# COMMON BUG - sort() returns None!
result = nums.sort()  # result is None!

# If you need the sorted list as return value:
return sorted(nums)  # creates new list`,
    },
    {
      name: "list.append()",
      note: "O(1) amortized",
      useCase: "Add ONE item to end. Use for building result lists and stack operations (LIFO). Use extend() to add multiple items. Common gotcha: append adds the object itself, not its contents.",
      example: `# Build result list
result = []
for x in data:
    if condition(x):
        result.append(x)

# Stack pattern (LIFO)
stack = []
stack.append(1)  # push
stack.pop()      # pop

# GOTCHA: append vs extend
arr = [1, 2]
arr.append([3, 4])  # [1, 2, [3, 4]] - list as element!
arr.extend([3, 4])  # [1, 2, 3, 4] - adds each item`,
    },
    {
      name: "list.pop()",
      note: "O(1) end / O(n) front",
      useCase: "Remove and return item at index (default: last). pop() from end is O(1), but pop(0) is O(n) because all elements shift. Use deque for queue operations.",
      example: `# Stack: pop from end - O(1)
stack = [1, 2, 3]
top = stack.pop()  # 3

# Queue: pop from front - O(n) SLOW!
queue = [1, 2, 3]
first = queue.pop(0)  # shifts all elements!

# Better: use deque for O(1) queue ops
from collections import deque
q = deque([1, 2, 3])
first = q.popleft()  # O(1)`,
    },
    {
      name: "list.insert(i, x)",
      note: "O(n)",
      useCase: "Insert at specific position. O(n) because elements must shift. Avoid repeated insert(0, x) in loops—that's O(n²). Use deque.appendleft() or build list then reverse.",
      example: `# Insert at position
arr = [1, 3, 4]
arr.insert(1, 2)  # [1, 2, 3, 4]

# AVOID in loop - O(n²) total!
for x in items:
    arr.insert(0, x)  # each insert is O(n)

# Better: append then reverse
for x in items:
    arr.append(x)
arr.reverse()  # single O(n) operation`,
    },
    {
      name: "dict[key] / in dict",
      note: "O(1) average",
      useCase: "Hash table lookup—instant regardless of size. Use for memoization, counting, value mapping, and the classic Two Sum pattern. Use .get(key, default) to avoid KeyError.",
      example: `# Two Sum pattern
seen = {}  # value -> index
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:  # O(1) lookup
        return [seen[complement], i]
    seen[num] = i

# Counting pattern
counts = {}
for x in items:
    counts[x] = counts.get(x, 0) + 1`,
    },
    {
      name: "set.add() / in set",
      note: "O(1) average",
      useCase: "Hash table for membership testing. Use for duplicate detection, tracking visited nodes in BFS/DFS, and set operations (intersection, union, difference).",
      example: `# Duplicate detection
seen = set()
for num in nums:
    if num in seen:  # O(1) lookup
        return True  # found duplicate
    seen.add(num)

# Set operations
a = {1, 2, 3}
b = {2, 3, 4}
a & b  # {2, 3} intersection
a | b  # {1, 2, 3, 4} union
a - b  # {1} difference`,
    },
    {
      name: "deque.popleft()",
      note: "O(1)",
      useCase: "Double-ended queue with O(1) operations on both ends. Essential for BFS (queue), and sliding window with maxlen. Unlike list.pop(0), this is actually fast.",
      example: `from collections import deque

# BFS template
queue = deque([start])
visited = {start}
while queue:
    node = queue.popleft()  # O(1)!
    for neighbor in get_neighbors(node):
        if neighbor not in visited:
            visited.add(neighbor)
            queue.append(neighbor)

# Sliding window with auto-eviction
window = deque(maxlen=3)  # keeps last 3`,
    },
    {
      name: "Counter()",
      note: "O(n)",
      useCase: "Count frequencies in one line. Missing keys return 0 (no KeyError). Has useful methods: most_common(k), and supports arithmetic between Counters. Perfect for anagram checks.",
      example: `from collections import Counter

# Frequency count
counts = Counter("abracadabra")
# Counter({'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1})

# Anagram check
Counter(s1) == Counter(s2)

# Top K frequent
Counter(nums).most_common(k)

# Missing keys return 0
counts['z']  # 0, no KeyError!

# Counter arithmetic
Counter("aab") - Counter("ab")  # Counter({'a': 1})`,
    },
    {
      name: "str.split() / join()",
      note: "O(n)",
      useCase: "Convert between strings and lists. split() parses input, join() builds output. IMPORTANT: Use join() for string building—concatenation with += in a loop is O(n²).",
      example: `# Parse space-separated input
words = line.split()
nums = [int(x) for x in line.split()]

# Reverse words in sentence
' '.join(s.split()[::-1])

# Build string efficiently
# BAD - O(n²) creates new string each time
s = ""
for word in words:
    s += word

# GOOD - O(n) single allocation
s = ''.join(words)`,
    },
  ],

  // ==================== PATTERNS ====================
  patterns: [
    {
      id: "counter-pattern",
      name: "Frequency Counting with Counter",
      tag: "Essential",
      tagColor: "green",
      description: "Count occurrences of elements using Counter from collections",
      explanation: `**Counter** is your go-to for any problem involving frequency counts. It's a dictionary subclass that returns 0 for missing keys and supports arithmetic operations between counters.

Use Counter when you need to: count character frequencies, find most/least common elements, check if two collections have the same elements (anagrams), or compare frequency distributions.`,
      triggers: "frequency, count, anagram, most common, least common, histogram",
      code: `from collections import Counter

# Basic counting
freq = Counter("aabbc")  # {'a': 2, 'b': 2, 'c': 1}

# Most common k elements
freq.most_common(2)  # [('a', 2), ('b', 2)]

# Anagram check
Counter("listen") == Counter("silent")  # True

# Subtract counts
Counter("aab") - Counter("ab")  # Counter({'a': 1})`,
    },
    {
      id: "two-pointers-pattern",
      name: "Two Pointers",
      tag: "Essential",
      tagColor: "green",
      description: "Use two indices moving through an array to avoid nested loops",
      explanation: `**Two pointers** reduces O(n²) brute force to O(n) by intelligently moving indices. Common variants: opposite ends (start/end moving inward), same direction (slow/fast), or one pointer per array.

Use when: array is sorted, you're looking for pairs with some property, or you need to partition/modify in-place.`,
      triggers: "sorted array, pair sum, palindrome, container, remove duplicates, partition",
      code: `# Template: opposite ends
def two_pointer_opposite(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        # Check condition with arr[left] and arr[right]
        # Move left++ or right-- based on result
        pass

# Template: same direction (fast/slow)
def two_pointer_same(arr):
    slow = 0
    for fast in range(len(arr)):
        if some_condition(arr[fast]):
            arr[slow] = arr[fast]
            slow += 1
    return slow`,
    },
    {
      id: "sliding-window-pattern",
      name: "Sliding Window",
      tag: "Essential",
      tagColor: "green",
      description: "Maintain a window over contiguous elements, sliding it across the array",
      explanation: `**Sliding window** efficiently processes contiguous subarrays by maintaining a "window" that slides right. Fixed-size windows add one element and remove one. Variable-size windows expand until invalid, then shrink.

Use when: problem involves contiguous subarray/substring, mentions "window", or asks for max/min with some constraint.`,
      triggers: "contiguous, subarray, substring, window, consecutive, at most k",
      code: `# Fixed-size window
def fixed_window(arr, k):
    window = sum(arr[:k])
    result = window
    for i in range(k, len(arr)):
        window += arr[i] - arr[i-k]  # add right, remove left
        result = max(result, window)
    return result

# Variable-size window (expand/shrink)
def variable_window(s):
    left = 0
    window = {}
    result = 0
    for right in range(len(s)):
        # expand: add s[right] to window
        while invalid_condition:
            # shrink: remove s[left] from window
            left += 1
        result = max(result, right - left + 1)
    return result`,
    },
    {
      id: "hashset-pattern",
      name: "Hash Set for Lookup",
      tag: "Core",
      tagColor: "accent",
      description: "Use a set for O(1) membership testing",
      explanation: `When you need to answer "have I seen this?" in O(1), use a set. Sets are backed by hash tables and provide constant-time add and lookup operations.

Common uses: duplicate detection, finding intersections, checking if complement exists.`,
      triggers: "duplicate, seen before, exists, intersection, complement",
      code: `# Duplicate check
def has_duplicate(nums):
    return len(nums) != len(set(nums))

# Two sum with set
def has_pair_sum(nums, target):
    seen = set()
    for num in nums:
        if target - num in seen:
            return True
        seen.add(num)
    return False

# Intersection
common = set(list1) & set(list2)`,
    },
    {
      id: "sort-greedy-pattern",
      name: "Sort + Greedy",
      tag: "Core",
      tagColor: "accent",
      description: "Sort input first, then make greedy decisions",
      explanation: `Many problems become simple after sorting. Once sorted, you can make greedy choices (always pick the smallest/largest that satisfies your constraint) and prove they lead to optimal solutions.

Use when: intervals (sort by start/end), scheduling, merging, or when order doesn't affect the answer.`,
      triggers: "intervals, merge, schedule, meetings, greedy, optimal order",
      code: `# Merge intervals
def merge(intervals):
    intervals.sort()  # sort by start
    result = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= result[-1][1]:
            result[-1][1] = max(result[-1][1], end)
        else:
            result.append([start, end])
    return result`,
    },
  ],

  // ==================== PROBLEMS ====================
  problems: [
    {
      id: "two-sum",
      title: "Two Sum",
      difficulty: "easy",
      description: "Given an array of integers nums and an integer target, return indices of two numbers that add up to target.",
      examples: [
        { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
      ],
      starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Use a dictionary for O(1) lookup
    pass`,
      solution: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      hints: [
        "For each number, what value would complete the target?",
        "Use a dictionary to store numbers you've seen",
        "Check if complement exists before adding current number",
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
      description: "Given two strings s and t, return true if t is an anagram of s (uses same letters same number of times).",
      examples: [
        { input: 's = "anagram", t = "nagaram"', output: "true" },
        { input: 's = "rat", t = "car"', output: "false" },
      ],
      starterCode: `def is_anagram(s: str, t: str) -> bool:
    # Use Counter for frequency comparison
    pass`,
      solution: `def is_anagram(s: str, t: str) -> bool:
    from collections import Counter
    return Counter(s) == Counter(t)`,
      hints: [
        "Anagrams have the same character frequencies",
        "Counter makes frequency comparison easy",
      ],
      testCases: [
        { input: '"anagram", "nagaram"', expected: "True" },
        { input: '"rat", "car"', expected: "False" },
      ],
    },
    {
      id: "longest-substring",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      description: "Find the length of the longest substring without repeating characters.",
      examples: [
        { input: 's = "abcabcbb"', output: "3", explanation: 'Answer is "abc"' },
        { input: 's = "bbbbb"', output: "1" },
      ],
      starterCode: `def length_of_longest_substring(s: str) -> int:
    # Use sliding window with a set or dict
    pass`,
      solution: `def length_of_longest_substring(s: str) -> int:
    seen = {}
    left = max_len = 0

    for right, char in enumerate(s):
        if char in seen and seen[char] >= left:
            left = seen[char] + 1
        seen[char] = right
        max_len = max(max_len, right - left + 1)

    return max_len`,
      hints: [
        "Use sliding window - expand right, shrink left when needed",
        "Track last seen index of each character",
        "When you see a repeat, move left past previous occurrence",
      ],
      testCases: [
        { input: '"abcabcbb"', expected: "3" },
        { input: '"bbbbb"', expected: "1" },
        { input: '"pwwkew"', expected: "3" },
      ],
    },
    {
      id: "merge-intervals",
      title: "Merge Intervals",
      difficulty: "medium",
      description: "Given an array of intervals, merge all overlapping intervals.",
      examples: [
        { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      ],
      starterCode: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Sort first, then merge greedily
    pass`,
      solution: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])

    return merged`,
      hints: [
        "Sort intervals by start time first",
        "Two intervals overlap if second.start <= first.end",
        "When merging, take max of both end times",
      ],
      testCases: [
        { input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" },
        { input: "[[1,4],[4,5]]", expected: "[[1,5]]" },
      ],
    },
    {
      id: "group-anagrams",
      title: "Group Anagrams",
      difficulty: "medium",
      description: "Group strings that are anagrams of each other together.",
      examples: [
        { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      ],
      starterCode: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    # Use sorted string as dictionary key
    pass`,
      solution: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    from collections import defaultdict

    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)

    return list(groups.values())`,
      hints: [
        "Anagrams have the same sorted form",
        "Use sorted string as dictionary key",
        "defaultdict(list) avoids key existence checks",
      ],
      testCases: [
        { input: '["eat","tea","tan","ate","nat","bat"]', expected: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
        { input: '[""]', expected: '[[""]]' },
      ],
    },
  ],
};
