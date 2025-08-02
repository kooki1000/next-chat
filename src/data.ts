export const dummyMessages = [
  {
    id: crypto.randomUUID(),
    role: "user" as const,
    parts: [
      {
        type: "text" as const,
        text: "Can you explain what React hooks are and give me some examples?",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "assistant" as const,
    parts: [
      {
        type: "reasoning" as const,
        text: "The user is asking about React hooks, which is a fundamental concept in modern React development. I should provide a clear explanation with practical examples to help them understand both the concept and implementation.",
        state: "done" as const,
      },
      {
        type: "text" as const,
        text: "React hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 as a way to write components without classes.\n\nHere are some commonly used hooks:\n\n**useState** - Manages component state:\n```jsx\nconst [count, setCount] = useState(0);\n```\n\n**useEffect** - Handles side effects:\n```jsx\nuseEffect(() => {\n  document.title = 'Count: ' + count;\n}, [count]);\n```\n\n**useContext** - Consumes context values:\n```jsx\nconst theme = useContext(ThemeContext);\n```\n\nHooks follow two main rules:\n1. Only call hooks at the top level of your function\n2. Only call hooks from React functions\n\nThey make components more reusable and easier to test compared to class components.",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "user" as const,
    parts: [
      {
        type: "text" as const,
        text: "That's helpful! Can you show me how to create a custom hook for fetching data?",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "assistant" as const,
    createdAt: new Date("2025-08-01T10:02:45.000Z"),
    parts: [
      {
        type: "reasoning" as const,
        text: "The user wants to learn about custom hooks, specifically for data fetching. This is a common use case. I should provide a practical example that demonstrates useState, useEffect, and proper error handling, along with TypeScript types for better clarity.",
      },
      {
        type: "text" as const,
        text: "Absolutely! Here's a custom hook for data fetching:"
          + "\n\n```typescript"
          + "\nimport { useState, useEffect } from 'react';"
          + "\n\ninterface UseFetchResult<T> {"
          + "\n  data: T | null;"
          + "\n  loading: boolean;"
          + "\n  error: string | null;"
          + "\n}"
          + "\n\nfunction useFetch<T>(url: string): UseFetchResult<T> {"
          + "\n  const [data, setData] = useState<T | null>(null);"
          + "\n  const [loading, setLoading] = useState(true);"
          + "\n  const [error, setError] = useState<string | null>(null);"
          + "\n\n  useEffect(() => {"
          + "\n    const fetchData = async () => {"
          + "\n      try {"
          + "\n        setLoading(true);"
          + "\n        setError(null);"
          + "\n        "
          + "\n        const response = await fetch(url);"
          + "\n        if (!response.ok) {"
          + "\n          throw new Error('HTTP error! status: ' + response.status);"
          + "\n        }"
          + "\n        "
          + "\n        const result = await response.json();"
          + "\n        setData(result);"
          + "\n      } catch (err) {"
          + "\n        setError(err instanceof Error ? err.message : 'An error occurred');"
          + "\n      } finally {"
          + "\n        setLoading(false);"
          + "\n      }"
          + "\n    };"
          + "\n\n    fetchData();"
          + "\n  }, [url]);"
          + "\n\n  return { data, loading, error };"
          + "\n}"
          + "\n```"
          + "\n\n**Usage example:**"
          + "\n```jsx"
          + "\nfunction UserProfile({ userId }: { userId: string }) {"
          + "\n  const { data: user, loading, error } = useFetch<User>('/api/users/' + userId);"
          + "\n\n  if (loading) return <div>Loading...</div>;"
          + "\n  if (error) return <div>Error: {error}</div>;"
          + "\n  if (!user) return <div>No user found</div>;"
          + "\n\n  return <div>Hello, {user.name}!</div>;"
          + "\n}"
          + "\n```"
          + "\n\nThis hook encapsulates the data fetching logic and can be reused across multiple components!",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "user" as const,
    createdAt: new Date("2025-08-01T10:05:00.000Z"),
    parts: [
      {
        type: "text" as const,
        text: "I'm building a Next.js app with TypeScript and I need to implement authentication. What's the best approach for handling user sessions and protecting routes?",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "assistant" as const,
    createdAt: new Date("2025-08-01T10:05:20.000Z"),
    parts: [
      {
        type: "reasoning" as const,
        text: "This is a comprehensive question about authentication in Next.js with TypeScript. I should cover multiple approaches including NextAuth.js (now Auth.js), middleware for route protection, and session management. I'll provide practical examples and explain the trade-offs of different approaches.",
      },
      {
        type: "text" as const,
        text: "Great question! For Next.js authentication with TypeScript, I recommend **Auth.js** (formerly NextAuth.js) as it's the most robust solution. Here's a comprehensive approach:\n\n## 1. Setup Auth.js\n\n```bash\nnpm install next-auth\n```\n\n```typescript\n// app/api/auth/[...nextauth]/route.ts\nimport NextAuth from 'next-auth'\nimport GoogleProvider from 'next-auth/providers/google'\nimport { NextAuthOptions } from 'next-auth'\n\nexport const authOptions: NextAuthOptions = {\n  providers: [\n    GoogleProvider({\n      clientId: process.env.GOOGLE_CLIENT_ID!,\n      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,\n    }),\n  ],\n  callbacks: {\n    session: async ({ session, token }) => {\n      if (session?.user) {\n        session.user.id = token.sub!;\n      }\n      return session;\n    },\n    jwt: async ({ user, token }) => {\n      if (user) {\n        token.sub = user.id;\n      }\n      return token;\n    },\n  },\n  session: {\n    strategy: 'jwt',\n  },\n};\n\nconst handler = NextAuth(authOptions);\nexport { handler as GET, handler as POST };\n```\n\n## 2. Middleware for Route Protection\n\n```typescript\n// middleware.ts\nimport { withAuth } from 'next-auth/middleware'\n\nexport default withAuth(\n  function middleware(req) {\n    // Add any additional middleware logic here\n  },\n  {\n    callbacks: {\n      authorized: ({ token }) => !!token,\n    },\n  }\n)\n\nexport const config = {\n  matcher: ['/dashboard/:path*', '/profile/:path*'],\n}\n```\n\n## 3. Session Provider Setup\n\n```tsx\n// app/layout.tsx\nimport { SessionProvider } from 'next-auth/react'\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode\n}) {\n  return (\n    <html>\n      <body>\n        <SessionProvider>\n          {children}\n        </SessionProvider>\n      </body>\n    </html>\n  )\n}\n```\n\n## 4. Using Sessions in Components\n\n```tsx\n// components/UserProfile.tsx\nimport { useSession, signIn, signOut } from 'next-auth/react'\n\nexport function UserProfile() {\n  const { data: session, status } = useSession()\n\n  if (status === 'loading') return <p>Loading...</p>\n\n  if (status === 'unauthenticated') {\n    return (\n      <>\n        <p>Not signed in</p>\n        <button onClick={() => signIn()}>Sign in</button>\n      </>\n    )\n  }\n\n  return (\n    <>\n      <p>Signed in as {session.user?.email}</p>\n      <button onClick={() => signOut()}>Sign out</button>\n    </>\n  )\n}\n```\n\nThis approach provides secure session management, easy social login integration, and built-in CSRF protection!",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "user" as const,
    createdAt: new Date("2025-08-01T10:08:15.000Z"),
    parts: [
      {
        type: "text" as const,
        text: "What about server-side session validation?",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "assistant" as const,
    createdAt: new Date("2025-08-01T10:08:25.000Z"),
    parts: [
      {
        type: "text" as const,
        text: "For server-side session validation in Next.js, you can use `getServerSession` from Auth.js:\n\n```typescript\n// app/api/protected/route.ts\nimport { getServerSession } from 'next-auth/next'\nimport { authOptions } from '../auth/[...nextauth]/route'\nimport { NextResponse } from 'next/server'\n\nexport async function GET() {\n  const session = await getServerSession(authOptions)\n  \n  if (!session) {\n    return new NextResponse('Unauthorized', { status: 401 })\n  }\n  \n  // Proceed with authenticated logic\n  return NextResponse.json({ \n    message: 'This is protected data',\n    user: session.user \n  })\n}\n```\n\n**For App Router pages:**\n```tsx\n// app/dashboard/page.tsx\nimport { getServerSession } from 'next-auth/next'\nimport { authOptions } from '../api/auth/[...nextauth]/route'\nimport { redirect } from 'next/navigation'\n\nexport default async function Dashboard() {\n  const session = await getServerSession(authOptions)\n  \n  if (!session) {\n    redirect('/api/auth/signin')\n  }\n  \n  return <div>Welcome to your dashboard, {session.user?.name}!</div>\n}\n```\n\nThis ensures authentication is checked before the page renders, providing better security and UX.",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "user" as const,
    createdAt: new Date("2025-08-01T10:10:00.000Z"),
    parts: [
      {
        type: "text" as const,
        text: "Perfect! This is exactly what I needed. Thank you for the detailed explanations and code examples.",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "assistant" as const,
    createdAt: new Date("2025-08-01T10:10:10.000Z"),
    parts: [
      {
        type: "reasoning" as const,
        text: "The user is expressing satisfaction with the help provided. I should acknowledge their thanks and offer continued assistance while keeping the response brief and friendly.",
      },
      {
        type: "text" as const,
        text: "You're very welcome! I'm glad I could help you get started with authentication in your Next.js app. The combination of Auth.js with TypeScript provides a solid foundation for secure user management.\n\nFeel free to ask if you run into any issues during implementation or if you need help with any other aspects of your project. Good luck with your app development!",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "user" as const,
    createdAt: new Date("2025-08-01T10:12:00.000Z"),
    parts: [
      {
        type: "text" as const,
        text: "Can you explain the quadratic formula and show me how to solve a quadratic equation?",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "assistant" as const,
    createdAt: new Date("2025-08-01T10:12:15.000Z"),
    parts: [
      {
        type: "text" as const,
        text: "The quadratic formula is used to solve quadratic equations of the form $ax^2 + bx + c = 0$.\n\n**The Quadratic Formula:**\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n**Example:** Let's solve $2x^2 + 5x - 3 = 0$\n\nHere, $a = 2$, $b = 5$, and $c = -3$.\n\nFirst, calculate the discriminant:\n$$\\Delta = b^2 - 4ac = 5^2 - 4(2)(-3) = 25 + 24 = 49$$\n\nSince $\\Delta > 0$, we have two real solutions:\n$$x = \\frac{-5 \\pm \\sqrt{49}}{2(2)} = \\frac{-5 \\pm 7}{4}$$\n\nTherefore:\n- $x_1 = \\frac{-5 + 7}{4} = \\frac{2}{4} = \\frac{1}{2}$\n- $x_2 = \\frac{-5 - 7}{4} = \\frac{-12}{4} = -3$\n\nThe solutions are $x = \\frac{1}{2}$ and $x = -3$.",
      },
    ],
  },

  {
    id: crypto.randomUUID(),
    role: "user" as const,
    createdAt: new Date("2025-08-01T10:14:30.000Z"),
    parts: [
      {
        type: "text" as const,
        text: "What about calculus? Can you show me how to find the derivative of a complex function?",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "assistant" as const,
    createdAt: new Date("2025-08-01T10:14:45.000Z"),
    parts: [
      {
        type: "reasoning" as const,
        text: "The user is asking about calculus derivatives. I should provide a comprehensive example using various differentiation rules including the chain rule, product rule, and basic derivatives.",
      },
      {
        type: "text" as const,
        text: "Let's find the derivative of a complex function using various differentiation rules!\n\n**Example:** Find $\\frac{d}{dx}\\left[e^{2x} \\cdot \\sin(3x^2 + 1)\\right]$\n\nWe'll use the **product rule**: $(uv)' = u'v + uv'$\n\nLet $u = e^{2x}$ and $v = \\sin(3x^2 + 1)$\n\n**Step 1:** Find $u'$\n$$u' = \\frac{d}{dx}[e^{2x}] = e^{2x} \\cdot 2 = 2e^{2x}$$\n\n**Step 2:** Find $v'$ using the chain rule\n$$v' = \\frac{d}{dx}[\\sin(3x^2 + 1)] = \\cos(3x^2 + 1) \\cdot \\frac{d}{dx}[3x^2 + 1] = \\cos(3x^2 + 1) \\cdot 6x$$\n\n**Step 3:** Apply the product rule\n$$\\frac{d}{dx}\\left[e^{2x} \\cdot \\sin(3x^2 + 1)\\right] = u'v + uv'$$\n\n$$= 2e^{2x} \\cdot \\sin(3x^2 + 1) + e^{2x} \\cdot 6x\\cos(3x^2 + 1)$$\n\n$$= e^{2x}\\left[2\\sin(3x^2 + 1) + 6x\\cos(3x^2 + 1)\\right]$$\n\n**Final Answer:**\n$$\\boxed{\\frac{d}{dx}\\left[e^{2x} \\cdot \\sin(3x^2 + 1)\\right] = e^{2x}\\left[2\\sin(3x^2 + 1) + 6x\\cos(3x^2 + 1)\\right]}$$",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "user" as const,
    createdAt: new Date("2025-08-01T10:16:00.000Z"),
    parts: [
      {
        type: "text" as const,
        text: "Can you explain the relationship between machine learning loss functions and optimization?",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "assistant" as const,
    createdAt: new Date("2025-08-01T10:16:20.000Z"),
    parts: [
      {
        type: "text" as const,
        text: "Great question! Loss functions are central to machine learning optimization. Let me break this down:\n\n## Loss Functions\n\nA loss function $L(\\theta)$ measures how well our model with parameters $\\theta$ performs:\n\n**Mean Squared Error (Regression):**\n$$L(\\theta) = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - f(x_i; \\theta))^2$$\n\n**Cross-Entropy Loss (Classification):**\n$$L(\\theta) = -\\frac{1}{n} \\sum_{i=1}^{n} \\sum_{j=1}^{k} y_{ij} \\log(p_{ij})$$\n\nwhere $p_{ij} = \\frac{e^{z_{ij}}}{\\sum_{l=1}^{k} e^{z_{il}}}$ (softmax)\n\n## Gradient Descent Optimization\n\nWe minimize the loss using gradient descent:\n$$\\theta_{t+1} = \\theta_t - \\alpha \\nabla L(\\theta_t)$$\n\nwhere $\\alpha$ is the learning rate and $\\nabla L(\\theta_t)$ is the gradient:\n$$\\nabla L(\\theta) = \\left[\\frac{\\partial L}{\\partial \\theta_1}, \\frac{\\partial L}{\\partial \\theta_2}, \\ldots, \\frac{\\partial L}{\\partial \\theta_d}\\right]^T$$\n\n## Backpropagation\n\nFor neural networks, we use the chain rule to compute gradients:\n$$\\frac{\\partial L}{\\partial w_{ij}^{(l)}} = \\frac{\\partial L}{\\partial a_j^{(l)}} \\cdot \\frac{\\partial a_j^{(l)}}{ \\partial z_j^{(l)}} \\cdot \\frac{\\partial z_j^{(l)}}{\\partial w_{ij}^{(l)}}$$\n\nwhere:\n- $w_{ij}^{(l)}$ is the weight from neuron $i$ to neuron $j$ in layer $l$\n- $z_j^{(l)} = \\sum_i w_{ij}^{(l)} a_i^{(l-1)} + b_j^{(l)}$ (pre-activation)\n- $a_j^{(l)} = \\sigma(z_j^{(l)})$ (post-activation)\n\n## Adam Optimizer\n\nA popular adaptive optimizer that combines momentum and RMSprop:\n\n$$m_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t$$\n$$v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2$$\n$$\\hat{m}_t = \\frac{m_t}{1-\\beta_1^t}, \\quad \\hat{v}_t = \\frac{v_t}{1-\\beta_2^t}$$\n$$\\theta_{t+1} = \\theta_t - \\frac{\\alpha}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$$\n\nThe beauty is that optimization algorithms find the minimum of $L(\\theta)$ automatically through these mathematical relationships!",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "user" as const,
    createdAt: new Date("2025-08-01T10:18:00.000Z"),
    parts: [
      {
        type: "text" as const,
        text: "Show me some linear algebra operations with matrices.",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    role: "assistant" as const,
    createdAt: new Date("2025-08-01T10:18:15.000Z"),
    parts: [
      {
        type: "text" as const,
        text: "Here are some essential linear algebra operations with matrices:\n\n## Matrix Operations\n\n**Matrix Multiplication:**\nFor matrices $A \\in \\mathbb{R}^{m \\times n}$ and $B \\in \\mathbb{R}^{n \\times p}$:\n$$(AB)_{ij} = \\sum_{k=1}^{n} A_{ik}B_{kj}$$\n\n**Example:**\n$$A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}, \\quad B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$$\n\n$$AB = \\begin{pmatrix} 1 \\cdot 5 + 2 \\cdot 7 & 1 \\cdot 6 + 2 \\cdot 8 \\\\ 3 \\cdot 5 + 4 \\cdot 7 & 3 \\cdot 6 + 4 \\cdot 8 \\end{pmatrix} = \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}$$\n\n## Eigenvalues and Eigenvectors\n\nFor a square matrix $A$, eigenvalues $\\lambda$ and eigenvectors $v$ satisfy:\n$$Av = \\lambda v$$\n\nThe characteristic equation is:\n$$\\det(A - \\lambda I) = 0$$\n\n**Example:** For $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 2 \\end{pmatrix}$\n\n$$\\det\\begin{pmatrix} 3-\\lambda & 1 \\\\ 0 & 2-\\lambda \\end{pmatrix} = (3-\\lambda)(2-\\lambda) = 0$$\n\nEigenvalues: $\\lambda_1 = 3$, $\\lambda_2 = 2$\n\n## Matrix Inverse\n\nFor a $2 \\times 2$ matrix:\n$$A^{-1} = \\frac{1}{\\det(A)} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$\n\nwhere $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ and $\\det(A) = ad - bc$\n\n## Singular Value Decomposition (SVD)\n\nAny matrix $A \\in \\mathbb{R}^{m \\times n}$ can be decomposed as:\n$$A = U\\Sigma V^T$$\n\nwhere:\n- $U \\in \\mathbb{R}^{m \\times m}$ (left singular vectors)\n- $\\Sigma \\in \\mathbb{R}^{m \\times n}$ (diagonal matrix of singular values)\n- $V \\in \\mathbb{R}^{n \\times n}$ (right singular vectors)\n\nThe singular values $\\sigma_i$ are related to eigenvalues:\n$$\\sigma_i = \\sqrt{\\lambda_i(A^TA)}$$\n\nSVD is fundamental in machine learning for dimensionality reduction and data analysis!",
      },
    ],
  },
];
