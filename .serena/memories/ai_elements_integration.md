# AI Elements Integration

## Overview

The Next-Chat application has been migrated to use Vercel AI Elements components for improved performance and better user experience in AI chat interactions.

## Components Used

### Chat Interface Components

- **Conversation**: Main container for chat messages with automatic scrolling
- **ConversationContent**: Content wrapper for messages
- **ConversationScrollButton**: Auto-scroll button that appears when not at bottom
- **Message**: Individual message container with role-based styling
- **MessageContent**: Content wrapper for message parts
- **Response**: Optimized component for rendering AI response text with streaming support
- **Reasoning**: Collapsible component for displaying AI reasoning content

### Input Components

- **PromptInput**: Main form container for user input
- **PromptInputTextarea**: Auto-resizing textarea with keyboard shortcuts
- **PromptInputToolbar**: Container for input controls
- **PromptInputTools**: Left-aligned tools (model selector, etc.)
- **PromptInputSubmit**: Submit button with loading states

## Custom Components

### InputArea

A chat-specific wrapper around AI Elements input components located at `src/frontend/routes/main/chat/components/InputArea.tsx`. This component:

- Integrates with the chat hook (`useChat`)
- Provides imperative focus API through refs
- Handles chat-specific states (loading, disabled)
- Uses AI Elements `PromptInput`, `PromptInputTextarea`, and related components directly

## Key Benefits

1. **Performance**: Optimized for streaming AI responses
2. **Automatic Scrolling**: Smooth scroll-to-bottom behavior
3. **Better UX**: Loading states, visual indicators, keyboard shortcuts
4. **Accessibility**: Built-in ARIA support and keyboard navigation
5. **Consistent Styling**: Matches design system automatically
6. **Streaming Support**: Optimized for real-time content updates

## File Structure

```text
src/
├── components/
│   ├── ai-elements/          # AI Elements components
│   │   ├── conversation.tsx
│   │   ├── message.tsx
│   │   ├── prompt-input.tsx
│   │   ├── reasoning.tsx
│   │   ├── response.tsx
│   │   └── ...
│   ├── InputBox.tsx          # General purpose input component
│   └── ModelSelector.tsx    # AI model selection component
├── frontend/routes/main/
│   ├── page.tsx              # Uses InputBox for homepage input
│   └── chat/
│       ├── page.tsx          # Uses AI Elements for chat UI
│       └── components/
│           └── InputArea.tsx # Chat-specific input using AI Elements
```

## Migration Notes

- Replaced custom `AssistantMessage` and `UserMessage` components with AI Elements `Message` and `MessageContent`
- Migrated from custom scroll handling to `Conversation` component
- Replaced custom reasoning display with AI Elements `Reasoning` component
- Updated `InputArea` to use AI Elements `PromptInput` components directly
- Maintained backward compatibility with existing chat hooks and logic

## Usage Examples

### Chat Page

```tsx
<Conversation className="flex-1">
  <ConversationContent>
    {messages.map(message => (
      <Message key={message.id} from={message.role}>
        <MessageContent>
          <Response>{message.text}</Response>
        </MessageContent>
      </Message>
    ))}
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>;
```

### Input Areas

```tsx
// Chat-specific input (InputArea component)
<PromptInput onSubmit={handleSubmit}>
  <PromptInputTextarea
    value={input}
    onChange={e => setInput(e.target.value)}
    placeholder="Type your message..."
  />
  <PromptInputToolbar>
    <PromptInputTools>
      <ModelSelector />
    </PromptInputTools>
    <PromptInputSubmit status={status} />
  </PromptInputToolbar>
</PromptInput>;
```
