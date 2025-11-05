# SSH Contact Widget - Optional Web Enhancement

If you want to add a cool widget to your website showcasing the SSH contact form feature, here's a suggested implementation.

## Option 1: Simple CTA in Hero Section

Add to your Hero component (`src/components/Hero.tsx`):

```tsx
<div className="brutal-border p-6 bg-pc-paper">
  <h3 className="text-xl font-bold mb-2">Contact via Terminal</h3>
  <p className="text-pc-muted mb-4">SSH directly into my contact form:</p>
  <pre className="bg-black text-green-400 p-4 rounded font-mono">
    <code>$ ssh ssh.pcstyle.dev</code>
  </pre>
  <button
    onClick={() => navigator.clipboard.writeText('ssh ssh.pcstyle.dev')}
    className="mt-2 text-sm text-pc-cyan hover:underline"
  >
    Click to copy
  </button>
</div>
```

## Option 2: Animated Terminal Demo

Create a component that shows an animated typing effect:

```tsx
// src/components/SSHContactDemo.tsx
'use client';

import { useState, useEffect } from 'react';

export function SSHContactDemo() {
  const [text, setText] = useState('');
  const fullCommand = '$ ssh ssh.pcstyle.dev';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullCommand.length) {
        setText(fullCommand.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="brutal-border bg-black p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-white/50 text-sm">terminal</span>
      </div>
      <pre className="text-green-400 font-mono">
        {text}
        <span className="animate-pulse">_</span>
      </pre>
    </div>
  );
}
```

## Option 3: Contact Modal Enhancement

Update your existing `ContactModal.tsx` to include the SSH option:

```tsx
// Add this section to your ContactModal
<div className="space-y-4">
  <h3 className="text-xl font-bold">Multiple Ways to Reach Me</h3>

  <div className="brutal-border p-4">
    <h4 className="font-bold text-pc-cyan mb-2">🖥️ Terminal (Coolest Way)</h4>
    <code className="bg-black text-green-400 px-3 py-2 block rounded">
      ssh ssh.pcstyle.dev
    </code>
    <p className="text-sm text-pc-muted mt-2">
      Yes, you can SSH directly to a contact form!
    </p>
  </div>

  <div className="brutal-border p-4">
    <h4 className="font-bold text-pc-cyan mb-2">📧 Traditional</h4>
    <p>Email: adamkrupa@tuta.io</p>
    <p>Discord: @pcstyle</p>
  </div>
</div>
```

## Option 4: Badge/Footer Link

Add a small badge in your footer:

```tsx
// In your layout or footer component
<div className="flex items-center gap-2 text-sm">
  <span>Contact:</span>
  <code className="bg-black text-green-400 px-2 py-1 rounded font-mono text-xs">
    ssh ssh.pcstyle.dev
  </code>
</div>
```

## Option 5: Full Page Demo

Create a dedicated page at `/contact` or `/ssh`:

```tsx
// src/app/contact/page.tsx
export default function ContactPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contact Adam Krupa</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* SSH Method */}
          <div className="brutal-border p-6">
            <h2 className="text-2xl font-bold mb-4">
              🖥️ SSH Terminal Contact
            </h2>
            <p className="mb-4">
              The coolest way to contact me - directly from your terminal!
            </p>

            <div className="bg-black p-4 rounded mb-4">
              <code className="text-green-400 font-mono">
                $ ssh ssh.pcstyle.dev
              </code>
            </div>

            <h3 className="font-bold mb-2">What happens?</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>You SSH to my server</li>
              <li>Interactive terminal form appears</li>
              <li>Fill it out and press Enter</li>
              <li>I get your message instantly!</li>
            </ol>

            <video
              className="mt-4 w-full brutal-border"
              autoPlay
              loop
              muted
            >
              <source src="/ssh-demo.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Traditional Methods */}
          <div className="brutal-border p-6">
            <h2 className="text-2xl font-bold mb-4">
              Traditional Methods
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold">Email</h3>
                <a href="mailto:adamkrupa@tuta.io" className="text-pc-cyan">
                  adamkrupa@tuta.io
                </a>
              </div>

              <div>
                <h3 className="font-bold">Discord</h3>
                <p>@pcstyle</p>
              </div>

              <div>
                <h3 className="font-bold">GitHub</h3>
                <a
                  href="https://github.com/pc-style"
                  className="text-pc-cyan"
                >
                  @pc-style
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
```

## Social Media Post Template

When you launch, share it with this template:

```markdown
 I just built something cool!

You can now contact me directly from your terminal:

$ ssh ssh.pcstyle.dev

No joke - SSH into my website and fill out an interactive
terminal contact form. Built with Node.js, SSH2, and blessed.

The form submits to my Discord instantly.

Try it out! 🖥️

#terminal #ssh #webdev #nodejs #devtools
```

## GitHub README Badge

Add to your GitHub profile README:

```markdown
[![Contact via SSH](https://img.shields.io/badge/Contact-SSH%20Terminal-00e5ff?style=for-the-badge&logo=gnubash&logoColor=white)](ssh://ssh.pcstyle.dev)

## 📬 Unique Contact Method

```bash
ssh ssh.pcstyle.dev
```

Yes, you read that right - SSH directly to a contact form!
```

## Twitter/X Card Preview

When people share your site, make sure the OpenGraph image shows the terminal:

```tsx
// Update src/app/opengraph-image.tsx to include SSH info
// Add text like: "Contact me via SSH: ssh ssh.pcstyle.dev"
```

## Demo Video Script

Record a short video showing:

1. Open terminal
2. Type `ssh ssh.pcstyle.dev`
3. Show the beautiful ASCII art form
4. Fill out the form
5. Submit
6. Show Discord notification appearing

Upload to YouTube/Twitter and embed on your site.

---

## Implementation Priority

1. **Must Have:** Simple badge in footer or hero section
2. **Should Have:** Update ContactModal with SSH option
3. **Nice to Have:** Dedicated contact page
4. **Extra Cool:** Animated terminal demo
5. **Marketing:** Social media posts and demo video

---

Choose the option that fits your style and implement it! The SSH feature is cool enough on its own, but showcasing it properly will make it even better.
