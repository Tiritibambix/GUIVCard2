<template>
  <div class="contact-details" v-if="contact">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>{{ contact.displayName }}</h1>
      <div class="d-flex gap-2">
        <b-button
          variant="primary"
          @click="$router.push({ name: 'contact-edit', params: { id: contact.uid }})"
        >
          Edit
        </b-button>
        <b-button variant="outline-danger" @click="confirmDelete">
          Delete
        </b-button>
      </div>
    </div>

    <b-card>
      <b-row>
        <b-col md="6">
          <dl class="row">
            <dt class="col-sm-3">Full Name</dt>
            <dd class="col-sm-9">{{ contact.displayName }}</dd>

            <template v-if="contact.email">
              <dt class="col-sm-3">Email</dt>
              <dd class="col-sm-9">
                <a :href="'mailto:' + contact.email">{{ contact.email }}</a>
              </dd>
            </template>

            <template v-if="contact.tel">
              <dt class="col-sm-3">Phone</dt>
              <dd class="col-sm-9">
                <a :href="'tel:' + contact.tel">{{ contact.tel }}</a>
              </dd>
            </template>

            <template v-if="contact.raw">
              <template v-for="prop in additionalProperties" :key="prop.name">
                <dt class="col-sm-3">{{ formatPropertyName(prop.name) }}</dt>
                <dd class="col-sm-9">{{ prop.value }}</dd>
              </template>
            </template>
          </dl>
        </b-col>
      </b-row>
    </b-card>

    <!-- Delete Confirmation Modal -->
    <b-modal
      v-model="showDeleteModal"
      title="Confirm Delete"
      @ok="deleteContact"
    >
      <p>Are you sure you want to delete {{ contact.displayName }}?</p>
    </b-modal>
  </div>
  <div v-else class="text-center mt-4">
    <p>Contact not found</p>
    <b-button variant="primary" @click="$router.push({ name: 'contacts' })">
      Back to Contacts
    </b-button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const EXCLUDED_PROPERTIES = ['version', 'fn', 'n', 'email', 'tel', 'uid']

export default {
  name: 'ContactDetails',
  
  props: {
    id: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const store = useStore()
    const router = useRouter()
    const showDeleteModal = ref(false)

    const contact = computed(() => 
      store.getters['contacts/getContactByUid'](props.id)
    )

    const additionalProperties = computed(() => {
      if (!contact.value?.raw) return []
      
      return contact.value.raw.getAllProperties()
        .filter(prop => !EXCLUDED_PROPERTIES.includes(prop.name))
        .map(prop => ({
          name: prop.name,
          value: prop.getValues().join(', ')
        }))
    })

    const formatPropertyName = (name) => {
      return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    }

    const confirmDelete = () => {
      showDeleteModal.value = true
    }

    const deleteContact = async () => {
      try {
        await store.dispatch('contacts/deleteContact', props.id)
        router.push({ name: 'contacts' })
      } catch (error) {
        console.error('Failed to delete contact:', error)
      }
    }

    return {
      contact,
      additionalProperties,
      showDeleteModal,
      formatPropertyName,
      confirmDelete,
      deleteContact
    }
  }
}
</script>

<style scoped>
.contact-details {
  padding: 20px;
}

.gap-2 {
  gap: 0.5rem;
}

dt {
  font-weight: bold;
}

dd {
  margin-bottom: 0.5rem;
}
</style>