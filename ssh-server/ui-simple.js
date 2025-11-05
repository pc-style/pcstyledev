// Simple ANSI-based UI without blessed (more reliable for SSH)

const ASCII_ART = `
\x1b[36m╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██████╗  ██████╗███████╗████████╗██╗   ██╗██╗     ███████╗ ║
║   ██╔══██╗██╔════╝██╔════╝╚══██╔══╝╚██╗ ██╔╝██║     ██╔════╝ ║
║   ██████╔╝██║     ███████╗   ██║    ╚████╔╝ ██║     █████╗   ║
║   ██╔═══╝ ██║     ╚════██║   ██║     ╚██╔╝  ██║     ██╔══╝   ║
║   ██║     ╚██████╗███████║   ██║      ██║   ███████╗███████╗ ║
║   ╚═╝      ╚═════╝╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚══════╝ ║
║                                                               ║
║                  Terminal Contact Form v1.0                  ║
║                     https://pcstyle.dev                      ║
╚═══════════════════════════════════════════════════════════════╝\x1b[0m

`;

const INSTRUCTIONS = `
\x1b[33mFill out the form below. Press Enter after each field, Ctrl+C to exit.\x1b[0m

`;

export async function createContactForm(stream, onSubmit) {
  const formData = {
    message: '',
    name: '',
    email: '',
    discord: '',
    phone: '',
    facebook: '',
  };

  let currentField = 'message';
  let buffer = '';

  // Clear screen and show header
  stream.write('\x1b[2J\x1b[H'); // Clear screen
  stream.write(ASCII_ART);
  stream.write(INSTRUCTIONS);

  const fields = [
    { key: 'message', label: '\x1b[35m* Message\x1b[0m (required, max 2000 chars)', required: true },
    { key: 'name', label: '\x1b[36mName\x1b[0m (optional)' },
    { key: 'email', label: '\x1b[36mEmail\x1b[0m (optional)' },
    { key: 'discord', label: '\x1b[36mDiscord\x1b[0m (optional)' },
    { key: 'phone', label: '\x1b[36mPhone\x1b[0m (optional)' },
    { key: 'facebook', label: '\x1b[36mFacebook\x1b[0m (optional)' },
  ];

  let fieldIndex = 0;

  function showPrompt() {
    const field = fields[fieldIndex];
    stream.write(`\r\n${field.label}: `);
  }

  function showError(message) {
    stream.write(`\r\n\x1b[31m✗ ${message}\x1b[0m\r\n`);
  }

  function showSuccess(message) {
    stream.write(`\r\n\x1b[32m✓ ${message}\x1b[0m\r\n`);
  }

  async function processInput(line) {
    const field = fields[fieldIndex];
    const value = line.trim();

    // Store the value
    formData[field.key] = value;

    // Move to next field
    fieldIndex++;

    if (fieldIndex < fields.length) {
      // Show next prompt
      showPrompt();
    } else {
      // All fields collected, validate and submit
      stream.write('\r\n\x1b[33mSubmitting...\x1b[0m\r\n');

      // Validate
      if (!formData.message || formData.message.length === 0) {
        showError('Message is required!');
        stream.write('\r\nPress Enter to exit...');
        stream.once('data', () => stream.end());
        return;
      }

      if (formData.message.length > 2000) {
        showError('Message too long (max 2000 characters)!');
        stream.write('\r\nPress Enter to exit...');
        stream.once('data', () => stream.end());
        return;
      }

      // Submit
      const success = await onSubmit(formData);

      if (success) {
        showSuccess('Message sent successfully! Thanks for reaching out.');
        stream.write('\r\nDisconnecting in 3 seconds...\r\n');
        setTimeout(() => stream.end(), 3000);
      } else {
        showError('Failed to send message. Please try again later.');
        stream.write('\r\nPress Enter to exit...');
        stream.once('data', () => stream.end());
      }
    }
  }

  // Show first prompt
  showPrompt();

  // Handle input
  stream.on('data', async (data) => {
    const char = data.toString();

    // Handle Ctrl+C
    if (char === '\x03') {
      stream.write('\r\n\x1b[33mGoodbye!\x1b[0m\r\n');
      stream.end();
      return;
    }

    // Handle Enter
    if (char === '\r' || char === '\n') {
      const line = buffer;
      buffer = '';
      stream.write('\r\n');
      await processInput(line);
      return;
    }

    // Handle Backspace
    if (char === '\x7f' || char === '\x08') {
      if (buffer.length > 0) {
        buffer = buffer.slice(0, -1);
        stream.write('\b \b'); // Erase character
      }
      return;
    }

    // Regular character
    if (char >= ' ' && char <= '~') {
      buffer += char;
      stream.write(char); // Echo character
    }
  });

  return { stream };
}
