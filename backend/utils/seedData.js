const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Note = require('../models/Note');

dotenv.config();

const SAMPLE_CATEGORIES = [
  { name: 'Programming', color: '#4F46E5', icon: 'Code', description: 'Core programming languages, syntax, and logic' },
  { name: 'Database', color: '#10B981', icon: 'Database', description: 'SQL, NoSQL, schema design, and indexing' },
  { name: 'Web Development', color: '#2563EB', icon: 'Globe', description: 'Frontend, backend, REST APIs, and modern frameworks' },
  { name: 'AI & Machine Learning', color: '#8B5CF6', icon: 'Cpu', description: 'Machine learning, neural networks, and AI algorithms' },
  { name: 'Computer Science', color: '#06B6D4', icon: 'Terminal', description: 'Core computing concepts and system architectures' },
  { name: 'Mathematics', color: '#F59E0B', icon: 'Calculator', description: 'Linear algebra, calculus, and discrete mathematics' },
  { name: 'Personal', color: '#EC4899', icon: 'User', description: 'Personal goals, study schedules, and project ideas' },
  { name: 'Other', color: '#64748B', icon: 'Folder', description: 'Miscellaneous documentation and reference guides' },
];

const SAMPLE_NOTES = [
  {
    title: 'Python Basics & Core Data Types',
    category: 'Programming',
    tags: ['Python', 'Basics', 'Syntax', 'Programming'],
    favorite: true,
    content: `## Python Fundamentals

Python is a high-level, interpreted, dynamically-typed programming language focused on code readability and developer velocity.

### Built-in Data Types:
- **Numeric**: \`int\`, \`float\`, \`complex\`
- **Sequence**: \`list\` (mutable), \`tuple\` (immutable), \`range\`
- **Mapping**: \`dict\` (key-value hash table)
- **Set**: \`set\` (unordered, unique elements), \`frozenset\`
- **Boolean**: \`True\`, \`False\`

\`\`\`python
# List Comprehension Example
squares = [x**2 for x in range(10) if x % 2 == 0]
print(f"Even squares: {squares}")

# Dictionary comprehension
word_lens = {word: len(word) for word in ["python", "saas", "notes"]}
print(word_lens)
\`\`\`

### Key Best Practices:
1. Always follow PEP 8 style guide.
2. Use context managers (\`with open(...) as f:\`) for safe resource handling.
3. Leverage type hints for large codebases.`,
  },
  {
    title: 'Java OOP Concepts & Principles',
    category: 'Programming',
    tags: ['Java', 'OOP', 'Inheritance', 'Polymorphism'],
    favorite: true,
    content: `## The Four Pillars of Object-Oriented Programming

Java is built fundamentally around object-oriented paradigms.

### 1. Encapsulation
Bundling data (variables) and methods that operate on that data into a single unit (class), while restricting direct access using access modifiers:
- \`private\`: accessible only within class
- \`protected\`: accessible in package & subclasses
- \`public\`: accessible everywhere

### 2. Abstraction
Hiding internal implementation details and showing only necessary features via **Abstract Classes** and **Interfaces**.

### 3. Inheritance
Mechanism where one class acquires properties and behaviors of a parent class (\`extends\` keyword). Promotes code reusability.

### 4. Polymorphism
Ability of an object to take many forms:
- **Compile-time (Static)**: Method Overloading
- **Runtime (Dynamic)**: Method Overriding (\`@Override\`)

\`\`\`java
public abstract class Shape {
    abstract double calculateArea();
}

public class Circle extends Shape {
    private final double radius;
    public Circle(double radius) { this.radius = radius; }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}
\`\`\``,
  },
  {
    title: 'DBMS Normalization & Relational Design',
    category: 'Database',
    tags: ['DBMS', 'SQL', 'Normalization', 'Relational'],
    favorite: false,
    content: `## Database Normalization Guide

Normalization organizes columns and tables in a relational database to minimize redundancy and eliminate insertion, update, and deletion anomalies.

### Normal Forms Hierarchy:
1. **1NF (First Normal Form)**:
   - Each column must contain atomic (indivisible) values.
   - Each record must be unique (primary key).
   - No repeating groups.

2. **2NF (Second Normal Form)**:
   - Must already be in 1NF.
   - Eliminate partial functional dependencies (all non-key attributes must depend on the whole primary key).

3. **3NF (Third Normal Form)**:
   - Must already be in 2NF.
   - Eliminate transitive dependencies (non-prime attributes must not depend on other non-prime attributes: *A -> B, B -> C*).

4. **BCNF (Boyce-Codd Normal Form)**:
   - Stricter version of 3NF. For every functional dependency *X -> Y*, *X* must be a super key.

> **Key Rule of Thumb**: "The key, the whole key, and nothing but the key, so help me Codd."`,
  },
  {
    title: 'React Hooks Deep Dive',
    category: 'Web Development',
    tags: ['React', 'Hooks', 'Frontend', 'JavaScript'],
    favorite: true,
    content: `## Modern React State & Side Effects

Hooks let functional components manage state, side effects, context, and DOM references without writing class components.

### Core Hooks:
- \`useState\`: local state management
- \`useEffect\`: lifecycle side effects (fetching data, subscriptions, timers)
- \`useContext\`: consumes values from React Context Provider
- \`useReducer\`: complex state logic following redux-like actions
- \`useMemo\`: memoizes expensive computed values
- \`useCallback\`: memoizes callback functions to prevent unnecessary child re-renders
- \`useRef\`: persists mutable values across renders without causing re-render, or accesses DOM nodes

\`\`\`jsx
import React, { useState, useEffect, useMemo } from 'react';

export function NoteFilter({ notes, initialCategory }) {
  const [category, setCategory] = useState(initialCategory);

  const filtered = useMemo(() => {
    return category === 'All' 
      ? notes 
      : notes.filter(n => n.category === category);
  }, [notes, category]);

  useEffect(() => {
    document.title = \`SmartNotes (\${filtered.length} notes)\`;
  }, [filtered]);

  return <div>Found {filtered.length} notes</div>;
}
\`\`\``,
  },
  {
    title: 'Node.js Architecture & Event Loop',
    category: 'Web Development',
    tags: ['Node.js', 'EventLoop', 'Backend', 'Async'],
    favorite: false,
    content: `## How Node.js Handles Asynchronous Concurrency

Node.js is a runtime environment built on Google Chrome's V8 JavaScript engine. It uses an **event-driven, non-blocking I/O model** that makes it lightweight and efficient.

### The Single-Threaded Event Loop
Although JavaScript execution is single-threaded, Node delegates heavy operations (file system I/O, DNS lookup, crypto) to the **libuv thread pool** (default 4 threads).

### Event Loop Phases (in order of execution):
1. **Timers**: executes callbacks scheduled by \`setTimeout\` and \`setInterval\`.
2. **Pending Callbacks**: executes I/O callbacks deferred to the next loop iteration.
3. **Idle, Prepare**: internal use only.
4. **Poll**: retrieves new I/O events; executes I/O-related callbacks.
5. **Check**: executes \`setImmediate()\` callbacks.
6. **Close Callbacks**: handles socket and resource closures (\`socket.on('close', ...)\`).

> **Pro Tip**: \`process.nextTick()\` fires immediately before the event loop continues, bypassing the normal queue order!`,
  },
  {
    title: 'Machine Learning Basics: Supervised vs Unsupervised',
    category: 'AI & Machine Learning',
    tags: ['MachineLearning', 'AI', 'Algorithms', 'DataScience'],
    favorite: true,
    content: `## Foundational Machine Learning Paradigms

Machine learning allows systems to learn from data patterns and make predictions without being explicitly programmed.

### 1. Supervised Learning
The model is trained on **labeled dataset** (input features $X$ paired with ground truth $Y$).
- **Regression**: Predicting continuous numerical values (e.g., house prices, temperature). Algorithms: Linear Regression, Ridge, Random Forest Regressor.
- **Classification**: Predicting discrete category labels (e.g., Spam vs Not Spam). Algorithms: Logistic Regression, Support Vector Machines (SVM), Decision Trees, Naive Bayes.

### 2. Unsupervised Learning
The model identifies hidden structures in **unlabeled data** without guidance.
- **Clustering**: Grouping similar datapoints (K-Means, DBSCAN, Hierarchical Clustering).
- **Dimensionality Reduction**: Compressing feature dimensions while preserving variance (PCA, t-SNE).

### 3. Reinforcement Learning
An agent learns optimal decision policy through **trial and error**, receiving rewards or penalties in an interactive environment (Q-Learning, PPO).`,
  },
  {
    title: 'Computer Networks: The OSI vs TCP/IP Model',
    category: 'Computer Science',
    tags: ['Networking', 'OSI', 'TCP', 'Protocols'],
    favorite: false,
    content: `## Network Communication Architecture

Computer networks rely on layered protocol stacks to enable interoperable communication between diverse systems worldwide.

### OSI 7-Layer Reference Model:
7. **Application**: HTTP, HTTPS, FTP, DNS, SMTP, SSH
6. **Presentation**: Data formatting, encryption (TLS/SSL), compression
5. **Session**: Manages dialogue and sessions (NetBIOS, RPC)
4. **Transport**: End-to-end communication, flow & error control (**TCP**, **UDP**)
3. **Network**: Logical addressing and routing across subnets (**IPv4**, **IPv6**, ICMP)
2. **Data Link**: Physical addressing (MAC addresses), frame creation, error detection (Ethernet, Wi-Fi)
1. **Physical**: Transmission of raw bitstreams over media (cables, radio frequencies, optical fiber)

### TCP vs UDP Breakdown:
- **TCP (Transmission Control Protocol)**: Connection-oriented, 3-way handshake (SYN, SYN-ACK, ACK), guaranteed delivery, ordered, flow-controlled.
- **UDP (User Datagram Protocol)**: Connectionless, no handshake, low latency, ideal for video streaming, VoIP, and gaming.`,
  },
  {
    title: 'Operating Systems: Process vs Thread & CPU Scheduling',
    category: 'Computer Science',
    tags: ['OS', 'Processes', 'Threads', 'Scheduling'],
    favorite: false,
    content: `## Operating System Core Concepts

The Operating System acts as an intermediary between computer hardware and user applications.

### Process vs Thread:
| Metric | Process | Thread |
| :--- | :--- | :--- |
| **Definition** | Program in active execution | Lightweight unit of execution within a process |
| **Address Space** | Isolated virtual memory space | Shares memory and resources of parent process |
| **Context Switching** | High overhead | Low overhead, fast switching |
| **Communication** | IPC (pipes, sockets, shared memory) | Direct memory access (requires synchronization/locks) |

### Common CPU Scheduling Algorithms:
1. **FCFS (First-Come, First-Served)**: Non-preemptive, susceptible to Convoy Effect.
2. **SJF (Shortest Job First)**: Optimal average waiting time, but requires knowing burst time in advance.
3. **Round Robin (RR)**: Preemptive scheduling with a fixed time quantum; optimal for time-sharing systems.
4. **Priority Scheduling**: Can lead to starvation (solved using **Aging**).`,
  },
  {
    title: 'Essential SQL Queries & Optimization Cheatsheet',
    category: 'Database',
    tags: ['SQL', 'Queries', 'Optimization', 'PostgreSQL'],
    favorite: true,
    content: `## Master SQL Queries for Production

SQL (Structured Query Language) is the industry standard for declaring queries in relational database management systems.

### Essential Advanced Queries:

\`\`\`sql
-- Window Function: Rank notes by length within each category
SELECT 
  id, 
  title, 
  category, 
  LENGTH(content) AS char_count,
  DENSE_RANK() OVER (PARTITION BY category ORDER BY LENGTH(content) DESC) as rank_in_cat
FROM notes
WHERE is_deleted = false;

-- Common Table Expression (CTE) with Aggregation
WITH CategoryStats AS (
  SELECT category, COUNT(*) AS total, SUM(CASE WHEN favorite THEN 1 ELSE 0 END) AS favs
  FROM notes
  GROUP BY category
)
SELECT * FROM CategoryStats WHERE total >= 2;
\`\`\`

### Indexing & Performance Best Practices:
1. **B-Tree Indexes**: Default index suitable for equality and range queries.
2. **Compound Indexes**: Order columns by equality filter first, then range filter.
3. **Avoid \`SELECT *\`**: Only retrieve the columns required by the client.
4. Use \`EXPLAIN ANALYZE\` to diagnose query execution plans.`,
  },
  {
    title: 'Data Structures: Hash Tables, Trees & Graphs',
    category: 'Programming',
    tags: ['DataStructures', 'Algorithms', 'Trees', 'Graphs'],
    favorite: true,
    content: `## Core Data Structures and Big-O Complexity

Choosing the correct data structure directly impacts memory footprint and algorithmic runtime performance.

### 1. Hash Table
- **Average Time Complexity**: Search $O(1)$, Insert $O(1)$, Delete $O(1)$.
- **Collision Resolution**: Separate Chaining (Linked lists / Red-black trees), Open Addressing (Linear probing, Quadratic probing, Double hashing).

### 2. Binary Search Tree (BST) & AVL Tree
- **BST**: Left child < root < Right child. Degenerates to $O(n)$ if sorted inputs inserted.
- **AVL / Red-Black Tree**: Self-balancing BST guaranteeing $O(\\log n)$ search, insert, and delete.

### 3. Graph Representations
- **Adjacency Matrix**: $V \\times V$ 2D array. Fast edge lookup $O(1)$, high space $O(V^2)$.
- **Adjacency List**: Array of linked lists/vectors. Space efficient $O(V + E)$, standard for sparse graphs.

### Traversals:
- **BFS (Breadth-First Search)**: Uses a Queue ($O(V + E)$). Finds shortest path in unweighted graphs.
- **DFS (Depth-First Search)**: Uses recursion/Stack ($O(V + E)$). Topological sorting and cycle detection.`,
  },
];

const seedDatabaseIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already contains users. Skipping auto-seed.');
      return;
    }

    console.log('[Seed] Initializing database with demo user, categories, and college notes...');

    // 1. Create Demo User
    const demoUser = await User.create({
      name: 'Alex Morgan',
      email: 'demo@smartnotes.com',
      password: 'password123',
      role: 'Computer Science Student',
      bio: 'B.Tech CSE student passionate about full-stack engineering, algorithms, and AI.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    });

    console.log(`[Seed] Created Demo User: ${demoUser.email} (password: password123)`);

    // 2. Create Categories
    const categoriesToInsert = SAMPLE_CATEGORIES.map((cat) => ({
      ...cat,
      user: demoUser._id,
    }));
    await Category.insertMany(categoriesToInsert);
    console.log(`[Seed] Created ${categoriesToInsert.length} categories.`);

    // 3. Create Sample Notes
    const notesToInsert = SAMPLE_NOTES.map((note) => ({
      ...note,
      user: demoUser._id,
      isDeleted: false,
    }));
    await Note.insertMany(notesToInsert);
    console.log(`[Seed] Created ${notesToInsert.length} rich sample notes.`);
    console.log('[Seed] Initial database setup completed successfully!');
  } catch (error) {
    console.error('[Seed Error]:', error.message);
  }
};

// Standalone execution if run via CLI: node utils/seedData.js
if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    // Force re-seed: clean demo user and re-create
    try {
      const demoUser = await User.findOne({ email: 'demo@smartnotes.com' });
      if (demoUser) {
        await Note.deleteMany({ user: demoUser._id });
        await Category.deleteMany({ user: demoUser._id });
        await User.deleteOne({ _id: demoUser._id });
        console.log('[Seed] Cleaned existing demo user data.');
      }
      await seedDatabaseIfEmpty();
      console.log('[Seed] Standalone seed completed.');
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
}

module.exports = { seedDatabaseIfEmpty, SAMPLE_CATEGORIES, SAMPLE_NOTES };
