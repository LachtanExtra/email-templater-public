<template>
  <div class="items-container">
    <h1 class="page-title">📄 Your Templates</h1>

    <!-- Template Cards -->
    <div class="template-list">
      <div class="item-card" v-for="(template, index) in templates" :key="index">
        <h2>{{ template.title }}</h2>
        <p>{{ template.description }}</p>

        <div class="button-row">
          <RouterLink :to="`/templates/${template.id}/use`" class="use-btn">Use</RouterLink>
          <button class="edit-btn" @click="openEdit(template)">Edit</button>
        </div>

        <button class="delete-btn" @click="deleteTemplate(template.id)">Delete</button>
      </div>
    </div>

    <!-- Modal for creating a template -->
    <div class="modal" v-if="showCreate">
      <div class="modal-content">
        <h2>Create Template</h2>
        <form @submit.prevent="addTemplate">
          <input v-model="newTitle" placeholder="Title" required />
          <input v-model="newDescription" placeholder="Description" required />
          <QuillEditor
            v-model:content="newBody"
            content-type="html"
          />
          <p v-pre>To denote a variable, use {{varName}}</p>
          <div class="button-row">
            <button class="glow-btn" type="submit">➕ Save</button>
            <button class="delete-btn cancel" @click="showCreate = false" type="button">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal for editing a template -->
    <div class="modal" v-if="editingTemplate" :key="editingTemplate?.id">
      <div class="modal-content">
        <h2>Edit Template</h2>
        <form @submit.prevent="updateTemplate">
          <input v-model="editingTemplate.title" placeholder="Title" required />
          <input v-model="editingTemplate.description" placeholder="Description" required />
          <QuillEditor
            ref="editEditorRef"
            v-model:content="editBody"
            content-type="html"
          />
          <p v-pre>To denote a variable, use {{varName}}</p>
          <div class="button-row">
            <button class="glow-btn" type="submit">💾 Update</button>
            <button class="delete-btn cancel" @click="editingTemplate = null" type="button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    
    <div class="actions">
      <button class="create-btn" @click="showCreate = true">➕ Create New Template</button>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
  import { db } from '@/firebase';
  import { getAuth } from 'firebase/auth';
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  const templates = ref([]);
  const newTitle = ref('');
  const newDescription = ref('');
  const newBody = ref('');
  const showCreate = ref(false);
  const editingTemplate = ref(null);
  const auth = getAuth();
  const editEditorRef = ref(null);
  const editBody = ref('');

  onMounted(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(collection(db, 'templates'), where('uid', '==', user.uid));
        onSnapshot(q, (snapshot) => {
          templates.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
      }
    });
  });

  const extractVariables = (html) => {
    const matches = [...html.matchAll(/{{([a-zA-Z0-9_]+)}}/g)];
    return Array.from(new Set(matches.map(m => m[1])));
  };

  const addTemplate = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, 'templates'), {
      uid: user.uid,
      title: newTitle.value,
      description: newDescription.value,
      body: newBody.value,
      variables: extractVariables(newBody.value),
      createdAt: new Date()
    });

    newTitle.value = '';
    newDescription.value = '';
    newBody.value = '';
    showCreate.value = false;
  };

  const openEdit = (template) => {
    editingTemplate.value = { ...template };
    editBody.value = template.body || '';
  };

  const updateTemplate = async () => {
    const { id, title, description } = editingTemplate.value;
    const body = editBody.value;

    await updateDoc(doc(db, 'templates', id), {
      title,
      description,
      body,
      variables: extractVariables(body)
    });

    editingTemplate.value = null;
  };

  const deleteTemplate = async (id) => {
    await deleteDoc(doc(db, 'templates', id));
  };
</script>

<style scoped>
  .template-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
  }
</style>
