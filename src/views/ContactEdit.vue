<template>
  <div class="contact-edit" v-if="contact">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Edit Contact</h1>
      <div class="d-flex gap-2">
        <b-button variant="primary" @click="saveContact">Save</b-button>
        <b-button 
          variant="outline-secondary" 
          @click="$router.push({ name: 'contact-details', params: { id: contact.uid }})"
        >
          Cancel
        </b-button>
      </div>
    </div>

    <b-card>
      <b-form @submit.prevent="saveContact">
        <b-form-group label="Full Name" label-for="fullName">
          <b-form-input
            id="fullName"
            v-model="formData.fn"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Email" label-for="email">
          <b-form-input
            id="email"
            v-model="formData.email"
            type="email"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Phone" label-for="phone">
          <b-form-input
            id="phone"
            v-model="formData.tel"
            type="tel"
          ></b-form-input>
        </b-form-group>

        <!-- Additional Properties -->
        <template v-if="contact.raw">
          <div v-for="prop in additionalProperties" :key="prop.name">
            <b-form-group :label="formatPropertyName(prop.name)" :label-for="prop.name">
              <b-form-input
                :id="prop.name"
                v-model="formData[prop.name]"
              ></b-form-input>
            </b-form-group>
          </div>
        </template>

        <!-- Add Property Button -->
        <div class="mt-4">
          <b-button
            variant="outline-primary"
            @click="showAddPropertyModal = true"
          >
            Add Property
          </b-button>
        </div>
      </b-form>
    </b-card>

    <!-- Add Property Modal -->
    <b-modal
      v-model="showAddPropertyModal"
      title="Add Property"
      @ok="addProperty"
    >
      <b-form>
        <b-form-group label="Property Name">
          <b-form-select
            v-model="newProperty.name"
            :options="availableProperties"
          ></b-form-select>
        </b-form-group>
        <b-form-group label="Value">
          <b-form-input v-model="newProperty.value"></b-form-input>
        </b-form-group>
      </b-form>
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
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ICAL from 'ical.js'

const EXCLUDED_PROPERTIES = ['version', 'uid']
const AVAILABLE_PROPERTIES = [
  'title',
  'org',
  'note',
  'url',
  'nickname',
  'bday',
  'anniversary',
  'gender',
  'adr',
  'categories'
]

export default {
  name: 'ContactEdit',
  
  props: {
    id: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const store = useStore()
    const router = useRouter()
    const showAddPropertyModal = ref(false)
    const formData = ref({})
    const newProperty = ref({
      name: '',
      value: ''
    })

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

    const availableProperties = computed(() => {
      const existingProps = additionalProperties.value.map(p => p.name)
      return AVAILABLE_PROPERTIES.filter(p => !existingProps.includes(p))
    })

    onMounted(() => {
      if (contact.value) {
        // Initialize form data with contact values
        formData.value = {
          fn: contact.value.displayName,
          email: contact.value.email,
          tel: contact.value.tel
        }

        // Add additional properties
        additionalProperties.value.forEach(prop => {
          formData.value[prop.name] = prop.value
        })
      }
    })

    const formatPropertyName = (name) => {
      return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    }

    const addProperty = () => {
      if (newProperty.value.name && newProperty.value.value) {
        formData.value[newProperty.value.name] = newProperty.value.value
        showAddPropertyModal.value = false
        newProperty.value = { name: '', value: '' }
      }
    }

    const saveContact = async () => {
      try {
        await store.dispatch('contacts/updateContact', {
          uid: props.id,
          updates: formData.value
        })
        router.push({
          name: 'contact-details',
          params: { id: props.id }
        })
      } catch (error) {
        console.error('Failed to update contact:', error)
      }
    }

    return {
      contact,
      formData,
      additionalProperties,
      showAddPropertyModal,
      newProperty,
      availableProperties,
      formatPropertyName,
      addProperty,
      saveContact
    }
  }
}
</script>

<style scoped>
.contact-edit {
  padding: 20px;
}

.gap-2 {
  gap: 0.5rem;
}
</style>