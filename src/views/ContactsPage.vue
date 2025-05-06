<template>
  <div class="items-container">
    <h1 class="page-title">👥 Your Contacts</h1>

    <!-- Contact Cards -->
    <div class="contact-list">
      <div class="item-card" v-for="(contact) in contacts" :key="contact.id">
        <h2>{{ contact.email }}</h2>
        <div class="button-row">
          <button class="edit-btn" @click="openEdit(contact)">Edit</button>
        </div>
        <button class="delete-btn" @click="deleteContact(contact.id)">Delete</button>
      </div>
    </div>

    <!-- Modal for creating a new contact -->
    <div class="modal" v-if="showCreate">
      <div class="modal-content">
        <h2>Create Contact</h2>
        <form @submit.prevent="addContact">
          <input v-model="newEmail" placeholder="Email" required />
          <h3>Variables</h3>
          <div v-for="(variable, idx) in newVariables" :key="idx" class="variable-item">
            <label type="varName">Name</label>
            <input v-model="variable.name" placeholder="Variable Name" required type="varName"/>
            <label type="varValue">Value</label>
            <input v-model="variable.value" placeholder="Variable Value" required type="varValue"/>
            <button type="button" class="remove-btn" @click="removeNewVariable(idx)">Remove</button>
          </div>
          <button type="button" class="add-variable-btn" @click="addNewVariable">➕ Add Variable</button>
          <div class="button-row">
            <button class="glow-btn" type="submit">➕ Save</button>
            <button class="glow-btn cancel" @click="showCreate = false" type="button">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal for editing an existing contact -->
    <div class="modal" v-if="editingContact" :key="editingContact.id">
      <div class="modal-content">
        <h2>Edit Contact</h2>
        <form @submit.prevent="updateContact">
          <input v-model="editingContact.email" placeholder="Email" required />
          <h3>Variables</h3>
          <div v-for="(variable, idx) in editingContact.variables" :key="idx" class="variable-item">
            <label type="varName">Name</label>
            <input v-model="variable.name" placeholder="Variable Name" required type="varName"/>
            <label type="varValue">Value</label>
            <input v-model="variable.value" placeholder="Variable Value" required type="varValue"/>
            <button type="button" class="remove-btn" @click="removeEditVariable(idx)">Remove</button>
          </div>
          <button type="button" class="add-variable-btn" @click="addEditVariable">➕ Add Variable</button>
          <div class="button-row">
            <button class="glow-btn" type="submit">💾 Update</button>
            <button class="delete-btn cancel" @click="editingContact = null" type="button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    <div class="actions">
      <button class="create-btn" @click="showCreate = true">➕ Add New Contact</button>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
  import { db } from '@/firebase';
  import { getAuth } from 'firebase/auth';

  const contacts = ref([]);
  const newEmail = ref('');
  const newVariables = ref([]);
  const showCreate = ref(false);
  const editingContact = ref(null);
  const auth = getAuth();

  onMounted(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(collection(db, 'contacts'), where('uid', '==', user.uid));
        onSnapshot(q, (snapshot) => {
          contacts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
      }
    });
  });

  const addNewVariable = () => {
    newVariables.value.push({ name: '', value: '' });
  };

  const removeNewVariable = (idx) => {
    newVariables.value.splice(idx, 1);
  };

  const addContact = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, 'contacts'), {
      uid: user.uid,
      email: newEmail.value,
      variables: newVariables.value,
      createdAt: new Date()
    });

    newEmail.value = '';
    newVariables.value = [];
    showCreate.value = false;
  };

  const openEdit = (contact) => {
    editingContact.value = { ...contact, variables: contact.variables || [] };
  };

  const addEditVariable = () => {
    editingContact.value.variables.push({ name: '', value: '' });
  };

  const removeEditVariable = (idx) => {
    editingContact.value.variables.splice(idx, 1);
  };

  const updateContact = async () => {
    const { id, ...data } = editingContact.value;
    await updateDoc(doc(db, 'contacts', id), data);
    editingContact.value = null;
  };

  const deleteContact = async (id) => {
    await deleteDoc(doc(db, 'contacts', id));
  };
</script>

<style scoped>
  .contact-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .remove-btn {
    border-color: hsla(0, 100%, 60%, 0.6);
    color: hsla(0, 100%, 70%, 1);
    margin-bottom: 1rem;
  }

  .remove-btn:hover {
    background-color: hsla(0, 100%, 60%, 1);
    color: white;
  }
</style>
