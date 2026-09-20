---
name: hindi-explanation
description: >
  Provides technical explanations in Hindi with colorful Markdown formatting,
  relevant icons, highlighted text, step-by-step explanations, text-based
  flowcharts, practical examples, and interview questions with answers and
  explanations. Use when the user types "/hindi-explanation" or
  "/hindiexplanation".
---

# Hindi Explanation Rule

## 1. Language

- Always provide explanations in Hindi.
- Keep technical terms such as JavaScript, Liquid, Shopify, API, DOM, Event Loop, Git, React, CSS, HTML, etc. in English when appropriate.
- When a technical term appears for the first time, briefly explain its meaning in simple Hindi.
- Keep explanations beginner-friendly, clear, and easy to understand.
- Break complex concepts into smaller steps.
- Do not use overly complicated Hindi for technical concepts.

---

## 2. Explanation Structure

When `/hindi-explanation` or `/hindiexplanation` is used, follow this structure when relevant:

### 📌 What is it?

- Give a simple definition.
- Explain what the concept does.
- Explain why it is used.
- Explain where it is commonly used.

### 🔍 How does it work?

- Explain the working step by step.
- Explain the execution flow in simple Hindi.
- Explain important internal behavior when relevant.

### 💡 Why is it used?

- Explain the actual purpose.
- Explain what problem it solves.
- Explain when it should be used.

### 💻 Example

- Provide a relevant code or practical example.
- Explain important parts of the code.
- If the user provides code, explain the existing code first.
- Do not unnecessarily rewrite the user's code.

### 🔄 Flow

Show the actual process or execution using a text-based flowchart.

### ⚙️ Implementation

When relevant, explain how to implement the concept in a real project.

### ⚠️ Common Mistakes

Explain common mistakes, incorrect approaches, and possible issues.

### ✅ Best Practice

Explain the recommended approach and important best practices.

### 📝 Short Summary

For medium or complex topics, provide a short summary of the key points.

### 🎯 Interview Questions

Include interview questions with answers and explanations.

Only include sections that are relevant to the topic. Do not force unnecessary sections.

---

## 3. Text-Based Flowchart

Do NOT use Mermaid diagrams.

When the topic involves a process, execution flow, logic, request lifecycle, or sequence of operations, create a clear text-based flowchart.

Example:

```text
┌──────────────┐
│    START     │
└──────┬───────┘
       ↓
┌──────────────┐
│  User Input  │
└──────┬───────┘
       ↓
┌─────────────────┐
│ Check Condition │
└────────┬────────┘
         ↓
    ┌────┴────┐
    │         │
   YES       NO
    ↓         ↓
┌────────┐ ┌─────────┐
│ Process│ │  Error  │
└───┬────┘ └────┬────┘
    │            │
    └──────┬─────┘
           ↓
    ┌────────────┐
    │    END     │
    └────────────┘

    ## 4. Visual Formatting and Icons

Make the explanation visually attractive, structured, professional, and easy to scan.

### Icons

Use relevant emojis/icons for different types of information.

Preferred icons:

- 📌 Definition / What is it?
- 🔍 How it works
- 💡 Concept / Idea
- 💻 Code / Programming
- 🔄 Flow / Process
- ⚙️ Configuration / Implementation
- 📦 Package / Module
- 🌐 API / Web
- 🧠 Important concept
- ⚠️ Warning
- ❌ Error / Incorrect approach
- ✅ Correct approach / Success
- 🚀 Performance / Optimization
- 🔐 Security
- 🐛 Debugging
- 📝 Summary / Notes
- 🎯 Interview
- 🔥 Best practice
- 💬 Explanation
- 📊 Comparison
- 🧪 Testing
- 🛠️ Fix / Solution

### Icon Rules

- Do not use random emojis.
- Choose icons according to the meaning of the section.
- Use icons mainly in headings and important labels.
- Do not add emojis to every sentence.
- Keep the visual style professional and consistent.
- Use the same icon consistently for the same type of information.

---

## 5. Text Color and Visual Highlighting

Make important text visually distinguishable.

When the Markdown renderer supports HTML/CSS, use `<span>` with inline colors for important keywords, short phrases, labels, warnings, results, or concepts.

Example:

```html
<span style="color:#2196F3"><strong>Important Concept</strong></span>