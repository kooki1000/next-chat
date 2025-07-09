interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export const staticMessages: Message[] = [
  {
    _id: "1",
    role: "user",
    content: "How does AI work?",
    createdAt: new Date("2024-01-15T10:30:00"),
  },
  {
    _id: "2",
    role: "assistant",
    content: `That's a fantastic question, and it's a field that's constantly evolving! At its core, Artificial Intelligence (AI) aims to enable machines to perform tasks that typically require human intelligence. This involves a lot of different techniques and approaches, but I can give you a general overview.

Think of it like this:

**1. Data, Data, Data!**

AI models learn from vast amounts of data. This data can be anything from images, text, audio recordings, or even numerical statistics. Just like a human learns from experience, an AI learns from the patterns and relationships it finds within this data.

**2. Learning from Patterns (Machine Learning):**

The most common way AI learns is through something called **Machine Learning (ML)**. Instead of being explicitly programmed for every single scenario, ML algorithms are designed to learn from data and improve their performance over time. There are several types of machine learning:

• **Supervised Learning:** This is like learning with a teacher. The AI is given data where the correct answers (labels) are already provided. For example, if you want an AI to identify cats in pictures, you'd feed it thousands of pictures, some labeled "cat" and some labeled "not cat." The AI learns to associate features in the images with the "cat" label.

• **Unsupervised Learning:** This is like learning without a teacher. The AI is given unlabeled data and has to find patterns and structures on its own. For instance, it might group similar customers together based on their purchasing behavior, even though no one told it what groups of customers exist.

• **Reinforcement Learning:** This is like learning through trial and error, often in a game-like environment. The AI tries different actions and gets rewards or penalties based on the outcomes. Over time, it learns which actions lead to the best results.`,
    createdAt: new Date("2024-01-15T10:31:00"),
  },
  {
    _id: "3",
    role: "user",
    content: "Can you explain neural networks in simple terms?",
    createdAt: new Date("2024-01-15T10:35:00"),
  },
  {
    _id: "4",
    role: "assistant",
    content: `Neural networks are one of the most important concepts in AI, and I'll break them down in simple terms.

**Think of Your Brain**

Neural networks are inspired by how our brains work. In your brain, you have billions of neurons (brain cells) that are connected to each other. When you see something, like a cat, information flows through these connected neurons, and somehow your brain recognizes "that's a cat!"

**Artificial Neural Networks**

An artificial neural network tries to mimic this process, but much simpler:

**1. Artificial Neurons (Nodes)**
- Instead of brain cells, we have "artificial neurons" or "nodes"
- Each node receives information, processes it, and passes it along
- Think of each node as a tiny decision-maker

**2. Layers**
- Nodes are organized in layers:
  - **Input Layer**: Receives the raw data (like pixel values of an image)
  - **Hidden Layers**: Process and transform the data (this is where the "magic" happens)
  - **Output Layer**: Gives the final answer (like "this is a cat")

**3. Connections and Weights**
- Nodes in different layers are connected to each other
- Each connection has a "weight" - think of it as how important that connection is
- Strong connections have high weights, weak connections have low weights

**A Simple Example**

Let's say you want to recognize handwritten numbers:

1. **Input**: You feed in an image of a handwritten "7"
2. **Processing**: The network looks at patterns in the pixels through its hidden layers
3. **Output**: It says "I'm 95% confident this is a 7"

**Learning Process**

The network learns by adjusting these connection weights:
- When it gets something wrong, it adjusts the weights to do better next time
- When it gets something right, it reinforces those weight patterns
- After seeing thousands of examples, it gets really good at recognizing patterns

**Why "Deep" Learning?**

When neural networks have many hidden layers (like 10, 50, or even 100+ layers), we call it "deep learning." More layers allow the network to recognize more complex patterns - like understanding not just shapes, but faces, objects, or even language.

It's like having a very sophisticated pattern-matching system that gets better with practice!`,
    createdAt: new Date("2024-01-15T10:36:00"),
  },
];
