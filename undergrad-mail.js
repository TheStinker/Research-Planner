/* Gmail delivery for undergraduate weekly goals.
   Compose works without OAuth. Direct send uses a user-provided OAuth Web client ID,
   Google Identity Services, and the Gmail API. Tokens are never persisted. */
const UndergradMail = (() => {
  const CLIENT_KEY = 'researchPlanner.gmailOAuthClientId.v1';
  const SCOPE = 'https://www.googleapis.com/auth/gmail.send';
  let clientId = '';
  let busy = false;
  const field = id => document.getElementById(id);
  function emailFor(name) { return (state.undergradEmails || {})[name] || ''; }
  function validEmail(s) { return typeof s === 'string' && s.length <= 254 && /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/.test(s); }
  function canSend(name) { return Boolean(clientId && validEmail(emailFor(name))); }
  function show(message, error = false) {
    const status = field('undergradEmailStatus');
    status.textContent = message;
    status.classList.toggle('is-error', error);
  }
  function niceDate(iso) { return new Date(iso + 'T12:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }); }
  function currentTasks(name, week) {
    return (Array.isArray(state.assignments) ? state.assignments : []).filter(t => t.owner === name && t.week === week);
  }
  function messageFor(name, week) {
    const email = emailFor(name), tasks = currentTasks(name, week);
    if (!validEmail(email)) throw new Error('Save a valid email address for ' + name + ' before emailing.');
    if (!tasks.length) throw new Error('No goals are assigned to ' + name + ' for the selected week.');
    const lines = ['Hi ' + name + ',', '', 'Here are your research goals for the week of ' + niceDate(week) + ':', ''];
    tasks.forEach((task, index) => {
      lines.push((index + 1) + '. ' + task.title);
      const project = state.projects.find(p => p.id === task.projectId);
      if (project) lines.push('   Project: ' + project.title);
      if (task.due) lines.push('   Due: ' + niceDate(task.due));
      if (task.notes) lines.push('   Expected deliverable / notes: ' + task.notes.replace(/\r\n/g, '\n').replace(/\n/g, '\n   '));
      if (task.goals.length) {
        lines.push('   Small steps:');
        task.goals.forEach(goal => lines.push('   ' + (goal.done ? '[x]' : '[ ]') + ' ' + goal.text));
      }
      lines.push('');
    });
    lines.push('Please let me know if anything is unclear or if you run into a blocker.', '', 'Thanks,', 'Laura Mae');
    return { to: email, subject: 'Research goals | week of ' + niceDate(week), body: lines.join('\n'), count: tasks.length };
  }
  function compose(name, week) {
    try {
      const mail = messageFor(name, week);
      const url = 'https://mail.google.com/mail/?' + new URLSearchParams({ view: 'cm', fs: '1', to: mail.to, su: mail.subject, body: mail.body });
      if (url.length > 8000) throw new Error('This Gmail compose link is too long. Shorten the notes or use direct sending.');
      const tab = window.open(url, '_blank');
      if (tab) {
        tab.opener = null;
        show('Gmail opened for ' + name + '. Review the email and your sending account, then click Send in Gmail.');
      } else show('Your browser blocked Gmail. Allow pop-ups for this site and try again.', true);
    } catch (error) { show(error.message, true); }
  }
  function toBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return btoa(binary);
  }
  function encodeMime(mail) {
    if (!validEmail(mail.to)) throw new Error('Invalid recipient email.');
    const subject = '=?UTF-8?B?' + toBase64(mail.subject) + '?=';
    const text = toBase64(mail.body).match(/.{1,76}/g)?.join('\r\n') || '';
    const mime = ['To: ' + mail.to, 'Subject: ' + subject, 'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', text].join('\r\n');
    return toBase64(mime).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  async function deliver(token, mail, name) {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: encodeMime(mail) })
    });
    if (!response.ok) {
      let details = '';
      try { details = (await response.json()).error?.message || ''; } catch {}
      throw new Error('Gmail could not send this message (HTTP ' + response.status + '). ' + details);
    }
    const sent = await response.json();
    if (!sent.id) throw new Error('Gmail returned no message ID. Check your Sent folder before trying again.');
    show('Sent to ' + name + ' at ' + mail.to + ' using Gmail. Message ID: ' + sent.id);
  }
  function send(name, week) {
    if (busy) { show('Another Gmail send is already in progress.', true); return; }
    try {
      const mail = messageFor(name, week);
      if (!clientId) throw new Error('Configure your Google OAuth client ID under Optional: send directly first.');
      if (!window.google?.accounts?.oauth2) throw new Error('Google authorization is not loaded. Refresh the page and retry.');
      const approved = confirm('Send ' + mail.count + ' research goal(s) to ' + name + ' (' + mail.to + ')?\n\n' +
        'Subject: ' + mail.subject + '\n\nAfter Google authorization, this sends immediately from the account you select.');
      if (!approved) return;
      busy = true;
      show('Select your sending Google account in the authorization window.');
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPE,
        callback: async result => {
          try {
            if (result.error || !result.access_token || !google.accounts.oauth2.hasGrantedAllScopes(result, SCOPE))
              throw new Error('Google did not authorize Gmail sending. No message was sent.');
            show('Sending ' + name + '’s weekly goals…');
            await deliver(result.access_token, mail, name);
          } catch (error) { show(error.message || 'Gmail send failed.', true); }
          finally { busy = false; }
        },
        error_callback: () => {
          busy = false;
          show('Google authorization was closed or failed. No email was sent.', true);
        }
      });
      client.requestAccessToken({ prompt: 'select_account' });
    } catch (error) { busy = false; show(error.message, true); }
  }
  function saveEmails(event) {
    event.preventDefault();
    const ashley = field('undergradEmailAshley').value.trim();
    const jocelyn = field('undergradEmailJocelyn').value.trim();
    if ([ashley, jocelyn].some(value => value && !validEmail(value))) {
      show('Enter valid email addresses or leave a field empty.', true);
      return;
    }
    const next = clone(state);
    next.undergradEmails = { Ashley: ashley, Jocelyn: jocelyn };
    try {
      validate(next);
      commit(next, 'Undergrad addresses updated.');
      show('Saved email addresses in this browser. No messages were sent.');
    } catch (error) { show(error.message, true); }
  }
  function saveClient(event) {
    event.preventDefault();
    const value = field('gmailClientId').value.trim();
    if (value && !/^[\w-]+\.apps\.googleusercontent\.com$/.test(value)) {
      show('Enter a valid Google Web OAuth client ID ending in .apps.googleusercontent.com.', true);
      return;
    }
    try {
      if (value) localStorage.setItem(CLIENT_KEY, value);
      else localStorage.removeItem(CLIENT_KEY);
      clientId = value;
      UndergradTasks.render();
      show(value ? 'Gmail OAuth client ID saved locally. You can now authorize on Send directly.' : 'Removed the optional direct-send configuration.');
    } catch { show('Browser storage blocked. Cannot save the OAuth client ID.', true); }
  }
  function render() {
    for (const name of ['Ashley', 'Jocelyn']) {
      const input = field('undergradEmail' + name);
      if (input && document.activeElement !== input) input.value = emailFor(name);
    }
    const googleInput = field('gmailClientId');
    if (googleInput && document.activeElement !== googleInput) googleInput.value = clientId;
  }
  function initialize() {
    try { clientId = localStorage.getItem(CLIENT_KEY) || ''; } catch { clientId = ''; }
    field('undergradEmailForm').addEventListener('submit', saveEmails);
    field('gmailClientForm').addEventListener('submit', saveClient);
    render();
  }
  return { initialize, render, canSend, compose, send, messageFor, encodeMime };
})();
