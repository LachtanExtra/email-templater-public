<template>
  <div class="use-template-container">
    <h1 class="page-title">📄 Using Template</h1>

    <section class="template-details" v-if="template">
      <h2>{{ template.title }}</h2>
      <p>{{ template.description }}</p>
      <div class="template-body" v-html="template.body" />
    </section>

    <section class="contacts-section">
      <h3>Add Contacts</h3>
      <select v-model="selectedContactId">
        <option disabled value="">Select a contact</option>
        <option v-for="contact in availableContacts" :key="contact.id" :value="contact.id">
          {{ contact.email }}
        </option>
      </select>
      <button @click="addContact" :disabled="!selectedContactId" class="create-btn">➕ Add Contact</button>

      <ul class="added-contacts">
        <li v-for="contact in selectedContacts" :key="contact.id">
          {{ contact.email }}
          <button @click="removeContact(contact.id)">Remove</button>
        </li>
      </ul>
    </section>

    <section class="variable-table-section" v-if="selectedContacts.length">
      <h3>Variable Comparison</h3>
      <table class="variable-table">
        <thead>
          <tr>
            <th>Variable</th>
            <th v-for="contact in selectedContacts" :key="contact.id">{{ contact.email }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="variable in template.variables" :key="variable">
            <td>{{ variable }}</td>
            <td v-for="contact in selectedContacts" :key="contact.id">
              {{ getVariableValue(contact, variable) || '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="actions">
      <button v-if="selectedContacts.length" class="create-btn" @click="showOutputPanel = true">
          📨 Generate personalized emails
      </button>
    </section>
  </div>

  <div v-if="showOutputPanel" class="output-overlay">
      <div class="output-content">
          <h2>📨 Generated Emails</h2>
          <div class="contact-panel" v-for="contact in selectedContacts" :key="contact.id">
          <h3>{{ contact.email }}</h3>
          <div class="assembled-body" v-html="assembleBody(template.body, contact.variables)"></div>
          <div class="button-row">
              <a
                  :href="generateMailto(contact)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="green-btn"
              >📨 Open Email App</a>

              <span class="copy-group">
                  <span v-if="copied[contact.id]" class="copy-check">✔️</span>
                  <button class="green-btn" @click="copyHtmlToClipboard(contact)">📋 Copy HTML</button>
              </span>
          </div>
          </div>
          <button class="glow-btn cancel" @click="showOutputPanel = false">Close</button>
      </div>
  </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { db } from '@/firebase';
  import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  
  const route = useRoute();
  const auth = getAuth();
  const template = ref(null);
  const availableContacts = ref([]);
  const selectedContacts = ref([]);
  const selectedContactId = ref('');
  const showOutputPanel = ref(false);
  const copied = ref({});
  
  onMounted(async () => {
    const user = auth.currentUser;
    if (!user) return;
  
    // Load template
    const docRef = doc(db, 'templates', route.params.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      template.value = docSnap.data();
    }
  
    // Load contacts
    const q = query(collection(db, 'contacts'), where('uid', '==', user.uid));
    const snapshot = await getDocs(q);
    availableContacts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
  
  const addContact = () => {
    const contact = availableContacts.value.find(c => c.id === selectedContactId.value);
    if (contact && !selectedContacts.value.find(c => c.id === contact.id)) {
      selectedContacts.value.push(contact);
    }
    selectedContactId.value = '';
  };
  
  const removeContact = (id) => {
    selectedContacts.value = selectedContacts.value.filter(c => c.id !== id);
  };
  
  const getVariableValue = (contact, variableName) => {
    const variable = (contact.variables || []).find(v => v.name === variableName);
    return variable?.value;
  };

  const assembleBody = (body, contactVars) => {
    return body.replace(/{{(\w+)}}/g, (_, varName) => {
      const match = contactVars.find(v => v.name === varName);
      return match?.value || '';
    });
  };

  const generateMailto = (contact) => {
    let html = assembleBody(template.value.body, contact.variables || []);

    html = html
      .replace(/<(p|div|h\d|li|br)[^>]*>/gi, '\n')
      .replace(/<\/[^>]+>/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\n{2,}/g, '\n')
      .trim();

    const subject = encodeURIComponent(template.value.title || 'Template Email');
    const message = encodeURIComponent(html);

    return `mailto:${contact.email}?subject=${subject}&body=${message}`;
  };

  const copyHtmlToClipboard = (contact) => {
    const html = assembleBody(template.value.body, contact.variables || []);
    navigator.clipboard.writeText(html).then(() => {
      copied.value[contact.id] = true;
      setTimeout(() => {
        copied.value[contact.id] = false;
      }, 2500);
    });
  };
</script>
  
<style scoped>
  .use-template-container {
      padding: 2rem;
      max-width: 960px;
      margin: auto;
      color: white;
  }

  .template-details {
      margin-bottom: 2rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
  }

  .template-details h2 {
      font-size: 1.5rem;
      color: hsla(105, 100%, 50%, 1);
      margin-bottom: 0.5rem;
  }

  .template-body {
      background: rgba(255, 255, 255, 0.05);
      padding: 1rem;
      border-radius: 5px;
      white-space: pre-line;
      margin-top: 0.5rem;
      color: #ccc;
  }

  .contacts-section {
      margin-bottom: 2rem;
  }

  .contacts-section h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: hsla(105, 100%, 50%, 1);
  }

  .contacts-section select {
      background: #1e1e1e;
      color: white;
      border: 1px solid #666;
      padding: 0.5rem;
      border-radius: 5px;
      margin-right: 1rem;
  }

  .contacts-section button {
      margin-top: 0.5rem;
  }

  .added-contacts {
      list-style: none;
      padding-left: 0;
      margin-top: 1rem;
  }

  .added-contacts li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .added-contacts button {
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      background: transparent;
      border: 1px solid hsla(0, 100%, 60%, 0.6);
      color: hsla(0, 100%, 70%, 1);
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s ease;
      margin-left: auto;
      width: auto;
      align-self: flex-end;
  }

  .added-contacts button:hover {
      background-color: hsla(0, 100%, 60%, 1);
      color: white;
      box-shadow: 0 0 12px hsla(0, 100%, 60%, 0.6), 0 0 24px hsla(0, 100%, 60%, 0.3);
      transform: translateY(-2px);
  }

  .variable-table-section {
      margin-top: 2rem;
  }

  .variable-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background-color: rgba(255, 255, 255, 0.05);
      color: white;
  }

  .variable-table th,
  .variable-table td {
      border: 1px solid #555;
      padding: 0.75rem;
      text-align: center;
  }

  .variable-table th {
      background-color: rgba(255, 255, 255, 0.08);
      color: hsla(105, 100%, 50%, 1);
  }

  .output-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.9);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow-y: auto;
    padding: 4rem 1rem;
  }

  .output-content {
    width: 100%;
    max-width: 900px;
    background: #1c1c1c;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 0 20px hsla(105, 100%, 50%, 0.4);
    color: white;
  }

  .contact-panel {
    margin-bottom: 2rem;
    border-bottom: 1px solid #444;
    padding-bottom: 1rem;
  }

  .assembled-body {
    background-color: rgba(255,255,255,0.05);
    padding: 1rem;
    border-radius: 6px;
    margin-top: 0.5rem;
    white-space: pre-line;
    color: #ccc;
  }

  .output-content .green-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    width: auto;
    padding: 0.4rem 0.75rem;
    min-width: max-content;
    max-width: 100%;
  }

  .copy-group {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .copy-check {
    color: hsla(105, 100%, 60%, 1);
    text-shadow: 0 0 6px hsla(105, 100%, 50%, 0.8),
                0 0 12px hsla(105, 100%, 50%, 0.4);
    font-size: 1rem;
    animation: fadeOut 2.5s ease forwards;
    margin-right: 0.3rem;
  }

  @keyframes fadeOut {
    0%   { opacity: 1; }
    90%  { opacity: 1; }
    100% { opacity: 0; }
  }
</style>