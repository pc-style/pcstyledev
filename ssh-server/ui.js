import blessed from 'neo-blessed';

const ASCII_ART = `
  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  │   ██████╗  ██████╗███████╗████████╗██╗   ██╗██╗     ███████╗
  │   ██╔══██╗██╔════╝██╔════╝╚══██╔══╝╚██╗ ██╔╝██║     ██╔════╝
  │   ██████╔╝██║     ███████╗   ██║    ╚████╔╝ ██║     █████╗
  │   ██╔═══╝ ██║     ╚════██║   ██║     ╚██╔╝  ██║     ██╔══╝
  │   ██║     ╚██████╗███████║   ██║      ██║   ███████╗███████╗
  │   ╚═╝      ╚═════╝╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚══════╝
  │                                                            │
  │                  terminal contact • v1.0                  │
  │                    → pcstyle.dev                          │
  └────────────────────────────────────────────────────────────┘
`;

export function createContactForm(stream, onSubmit) {
  const screen = blessed.screen({
    smartCSR: true,
    input: stream,
    output: stream,
    autoPadding: true,
    warnings: false,
    fullUnicode: true,
  });

  // Header
  const header = blessed.box({
    top: 0,
    left: 'center',
    width: 64,
    height: 13,
    content: ASCII_ART,
    tags: true,
    style: {
      fg: 'cyan',
      bold: true,
    },
  });

  // Instructions
  const instructions = blessed.box({
    top: 13,
    left: 'center',
    width: 80,
    height: 1,
    content: '{center}{gray-fg}tab to navigate • enter to submit • ctrl+c to exit{/}{/center}',
    tags: true,
  });

  // Form container
  const form = blessed.form({
    top: 15,
    left: 'center',
    width: 80,
    height: 30,
    keys: true,
    vi: true,
  });

  const formData = {
    message: '',
    name: '',
    email: '',
    discord: '',
    phone: '',
    facebook: '',
  };

  // Helper function to create labeled input
  function createInput(label, top, key, required = false) {
    const labelBox = blessed.text({
      top: top,
      left: 0,
      width: 16,
      height: 1,
      content: `${required ? '→' : ' '} ${label}`,
      style: {
        fg: required ? 'magenta' : 'gray',
        bold: required,
      },
    });

    const input = blessed.textarea({
      top: top,
      left: 16,
      width: 64,
      height: key === 'message' ? 5 : 1,
      keys: true,
      mouse: true,
      inputOnFocus: true,
      border: {
        type: 'line',
      },
      style: {
        fg: 'white',
        bg: 'black',
        border: {
          fg: 'gray',
        },
        focus: {
          fg: 'white',
          bg: 'black',
          border: {
            fg: 'cyan',
          },
        },
      },
    });

    input.key(['enter'], () => {
      if (key !== 'message') {
        // For single-line inputs, move to next field on Enter
        form.focusNext();
      }
    });

    input.on('submit', (value) => {
      formData[key] = value ? value.trim() : '';
    });

    input.on('keypress', () => {
      formData[key] = input.getValue().trim();
    });

    form.append(labelBox);
    form.append(input);

    return input;
  }

  // Create all form fields
  const messageInput = createInput('message', 0, 'message', true);
  const nameInput = createInput('name', 7, 'name');
  const emailInput = createInput('email', 9, 'email');
  const discordInput = createInput('discord', 11, 'discord');
  const phoneInput = createInput('phone', 13, 'phone');
  const facebookInput = createInput('facebook', 15, 'facebook');

  // Submit button
  const submitButton = blessed.button({
    top: 19,
    left: 'center',
    width: 24,
    height: 3,
    content: '→ SEND MESSAGE',
    align: 'center',
    valign: 'middle',
    keys: true,
    mouse: true,
    border: {
      type: 'line',
    },
    style: {
      fg: 'black',
      bg: 'magenta',
      bold: true,
      border: {
        fg: 'magenta',
      },
      focus: {
        bg: 'cyan',
        fg: 'black',
        border: {
          fg: 'cyan',
        },
      },
    },
  });

  submitButton.on('press', async () => {
    if (!formData.message || formData.message.length === 0) {
      showMessage(screen, 'Message is required', 'red');
      return;
    }

    if (formData.message.length > 2000) {
      showMessage(screen, 'Message too long (max 2000 chars)', 'red');
      return;
    }

    // Call the submit handler
    submitButton.setContent('→ SENDING...');
    screen.render();

    const success = await onSubmit(formData);

    if (success) {
      showMessage(screen, 'Message sent! I\'ll get back to you soon.', 'green');
      setTimeout(() => {
        screen.destroy();
        stream.end();
      }, 3000);
    } else {
      submitButton.setContent('→ SEND MESSAGE');
      showMessage(screen, 'Failed to send. Please try again.', 'red');
      screen.render();
    }
  });

  form.append(submitButton);

  // Character counter for message
  const charCounter = blessed.box({
    top: 6,
    left: 16,
    width: 64,
    height: 1,
    content: '{right}{gray-fg}0 / 2000{/}{/right}',
    tags: true,
  });

  messageInput.on('keypress', () => {
    const length = messageInput.getValue().length;
    const color = length > 2000 ? 'red' : length > 1500 ? 'yellow' : 'gray';
    charCounter.setContent(`{right}{${color}-fg}${length} / 2000{/}{/right}`);
    screen.render();
  });

  form.append(charCounter);

  // Append all to screen
  screen.append(header);
  screen.append(instructions);
  screen.append(form);

  // Focus first input
  messageInput.focus();

  // Handle exit
  screen.key(['C-c'], () => {
    screen.destroy();
    stream.end();
  });

  // Enable form navigation
  screen.key(['tab'], () => {
    form.focusNext();
  });

  screen.key(['S-tab'], () => {
    form.focusPrevious();
  });

  // Initial render
  screen.render();

  return screen;
}

function showMessage(screen, message, type) {
  const colors = {
    red: 'red',
    green: 'cyan',
    yellow: 'yellow',
  };

  const icons = {
    red: '✗',
    green: '✓',
    yellow: '!',
  };

  const color = colors[type] || colors.green;
  const icon = icons[type] || icons.green;

  const msgBox = blessed.box({
    top: 'center',
    left: 'center',
    width: 60,
    height: 5,
    content: `{center}{bold}${icon} ${message}{/bold}{/center}`,
    tags: true,
    border: {
      type: 'line',
    },
    style: {
      fg: color,
      bold: true,
      border: {
        fg: color,
      },
    },
  });

  screen.append(msgBox);
  msgBox.focus();
  screen.render();

  setTimeout(() => {
    screen.remove(msgBox);
    screen.render();
  }, 3000);
}
