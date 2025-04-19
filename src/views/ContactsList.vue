<template>
  <div class="contacts-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Contacts</h1>
      <b-button variant="primary" @click="showNewContactModal = true">
        Add Contact
      </b-button>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <b-form-input
        v-model="search"
        placeholder="Search contacts..."
        @input="filterContacts"
      ></b-form-input>
    </div>

    <!-- Contacts Table -->
    <b-table
      :items="filteredContacts"
      :fields="fields"
      striped
      hover
      responsive
    >
      <template #cell(actions)="{ item }">
        <div class="d-flex gap-2">
          <b-button
            variant="outline-primary"
            size="sm"
            @click="viewContact(item)"
          >
            View
          </b-button>
          <b-button
            variant="outline-danger"
            size="sm"
            @click="confirmDelete(item)"
          >
            Delete
          </b-button>
        </div>
      </template>
    </b-table>

    <!-- New Contact Modal -->
    <b-modal
      v-model="showNewContactModal"
      title="New Contact"
      @ok="createContact"
      @hidden="resetForm"
    >
      <b-form>
        <b-form-group label="Full Name">
          <b-form-input v-model="newContact.fn" required></b-form-input>
        </b-form-group>
        <b-form-group label="Email">
          <b-form-input
            v-model="newContact.email"
            type="email"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Phone">
          <b-form-input
            v-model="newContact.tel"
            type="tel"
          ></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>

    <!-- Delete Confirmation Modal -->
    <b-modal
      v-model="showDeleteModal"
      title="Confirm Delete"
      @ok="deleteContact"
    >
      <p>Are you sure you want to delete {{ selectedContact?.displayName }}?</p>
    </b-modal>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'ContactsList',

  setup() {
    const store = useStore()
    const router = useRouter()
    
    const search = ref('')
    const showNewContactModal = ref(false)
    const showDeleteModal = ref(false)
    const selectedContact = ref(null)
    
    const newContact = ref({
      fn: '',
      email: '',
      tel: ''
    })

    const fields = [
      { key: 'displayName', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'tel', label: 'Phone' },
      { key: 'actions', label: 'Actions' }
    ]

    const contacts = computed(() => store.getters['contacts/getContacts'])
    
    const filteredContacts = computed(() => {
      if (!search.value) return contacts.value
      
      const searchLower = search.value.toLowerCase()
      return contacts.value.filter(contact => {
        return contact.displayName.toLowerCase().includes(searchLower) ||
               (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
               (contact.tel && contact.tel.includes(searchLower))
      })
    })

    const resetForm = () => {
      newContact.value = {
        fn: '',
        email: '',
        tel: ''
      }
    }

    const createContact = async () => {
      try {
        await store.dispatch('contacts/createContact', newContact.value)
        showNewContactModal.value = false
        resetForm()
      } catch (error) {
        console.error('Failed to create contact:', error)
      }
    }

    const viewContact = (contact) => {
      router.push({
        name: 'contact-details',
        params: { id: contact.uid }
      })
    }

    const confirmDelete = (contact) => {
      selectedContact.value = contact
      showDeleteModal.value = true
    }

    const deleteContact = async () => {
      if (!selectedContact.value) return
      
      try {
        await store.dispatch('contacts/deleteContact', selectedContact.value.uid)
        showDeleteModal.value = false
        selectedContact.value = null
      } catch (error) {
        console.error('Failed to delete contact:', error)
      }
    }

    return {
      search,
      showNewContactModal,
      showDeleteModal,
      selectedContact,
      newContact,
      fields,
      filteredContacts,
      resetForm,
      createContact,
      viewContact,
      confirmDelete,
      deleteContact
    }
  }
}
</script>

<style scoped>
.contacts-list {
  padding: 20px;
}

.gap-2 {
  gap: 0.5rem;
}
</style>