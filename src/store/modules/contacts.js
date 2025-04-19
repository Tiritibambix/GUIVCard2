import ICAL from 'ical.js'
import { v4 as uuid } from 'uuid'

export default {
  namespaced: true,

  state: {
    contacts: [],
    addressBooks: [],
    selectedAddressBook: null
  },

  mutations: {
    SET_CONTACTS(state, contacts) {
      state.contacts = contacts
    },
    SET_ADDRESSBOOKS(state, addressBooks) {
      state.addressBooks = addressBooks
    },
    SET_SELECTED_ADDRESSBOOK(state, addressBook) {
      state.selectedAddressBook = addressBook
    },
    ADD_CONTACT(state, contact) {
      state.contacts.push(contact)
    },
    UPDATE_CONTACT(state, updatedContact) {
      const index = state.contacts.findIndex(c => c.uid === updatedContact.uid)
      if (index !== -1) {
        state.contacts.splice(index, 1, updatedContact)
      }
    },
    DELETE_CONTACT(state, uid) {
      state.contacts = state.contacts.filter(c => c.uid !== uid)
    },
    CLEAR_CONTACTS(state) {
      state.contacts = []
      state.addressBooks = []
      state.selectedAddressBook = null
    }
  },

  actions: {
    async initializeContacts({ commit, rootGetters }) {
      const client = rootGetters['auth/client']
      if (!client) return

      try {
        // Fetch address books
        const addressBooks = await client.fetchAddressBooks()
        commit('SET_ADDRESSBOOKS', addressBooks)

        if (addressBooks.length > 0) {
          const defaultAddressBook = addressBooks[0]
          commit('SET_SELECTED_ADDRESSBOOK', defaultAddressBook)

          // Fetch vCards from the default address book
          const vCards = await client.fetchVCards({ addressBook: defaultAddressBook })
          
          // Parse vCards into contacts
          const contacts = vCards.map(vCard => {
            const jCard = ICAL.parse(vCard.data)
            const vCardObj = new ICAL.Component(jCard)
            
            return {
              uid: vCardObj.getFirstPropertyValue('uid') || uuid(),
              addressBookUrl: defaultAddressBook.url,
              etag: vCard.etag,
              data: vCard.data,
              displayName: vCardObj.getFirstPropertyValue('fn'),
              email: vCardObj.getFirstPropertyValue('email'),
              tel: vCardObj.getFirstPropertyValue('tel'),
              raw: vCardObj
            }
          })

          commit('SET_CONTACTS', contacts)
        }
      } catch (error) {
        console.error('Failed to initialize contacts:', error)
        throw error
      }
    },

    async createContact({ commit, state, rootGetters }, contactData) {
      const client = rootGetters['auth/client']
      if (!client || !state.selectedAddressBook) return

      try {
        // Create vCard
        const vCard = new ICAL.Component(['vcard', [], []])
        vCard.addPropertyWithValue('version', '4.0')
        vCard.addPropertyWithValue('uid', uuid())
        Object.entries(contactData).forEach(([key, value]) => {
          if (value) vCard.addPropertyWithValue(key.toLowerCase(), value)
        })

        // Save to server
        const response = await client.createVCard({
          addressBook: state.selectedAddressBook,
          filename: `${vCard.getFirstPropertyValue('uid')}.vcf`,
          data: vCard.toString()
        })

        const contact = {
          uid: vCard.getFirstPropertyValue('uid'),
          addressBookUrl: state.selectedAddressBook.url,
          etag: response.etag,
          data: vCard.toString(),
          displayName: contactData.fn,
          email: contactData.email,
          tel: contactData.tel,
          raw: vCard
        }

        commit('ADD_CONTACT', contact)
        return contact
      } catch (error) {
        console.error('Failed to create contact:', error)
        throw error
      }
    },

    async updateContact({ commit, state, rootGetters }, { uid, updates }) {
      const client = rootGetters['auth/client']
      if (!client || !state.selectedAddressBook) return

      const contact = state.contacts.find(c => c.uid === uid)
      if (!contact) return

      try {
        const vCard = contact.raw.clone()
        Object.entries(updates).forEach(([key, value]) => {
          if (value !== undefined) {
            vCard.updatePropertyWithValue(key.toLowerCase(), value)
          }
        })

        await client.updateVCard({
          addressBook: state.selectedAddressBook,
          filename: `${uid}.vcf`,
          data: vCard.toString(),
          etag: contact.etag
        })

        const updatedContact = {
          ...contact,
          data: vCard.toString(),
          displayName: vCard.getFirstPropertyValue('fn'),
          email: vCard.getFirstPropertyValue('email'),
          tel: vCard.getFirstPropertyValue('tel'),
          raw: vCard
        }

        commit('UPDATE_CONTACT', updatedContact)
        return updatedContact
      } catch (error) {
        console.error('Failed to update contact:', error)
        throw error
      }
    },

    async deleteContact({ commit, state, rootGetters }, uid) {
      const client = rootGetters['auth/client']
      if (!client || !state.selectedAddressBook) return

      const contact = state.contacts.find(c => c.uid === uid)
      if (!contact) return

      try {
        await client.deleteVCard({
          addressBook: state.selectedAddressBook,
          filename: `${uid}.vcf`
        })

        commit('DELETE_CONTACT', uid)
      } catch (error) {
        console.error('Failed to delete contact:', error)
        throw error
      }
    },

    clearContacts({ commit }) {
      commit('CLEAR_CONTACTS')
    }
  },

  getters: {
    getContacts: state => state.contacts,
    getAddressBooks: state => state.addressBooks,
    getSelectedAddressBook: state => state.selectedAddressBook,
    getContactByUid: state => uid => state.contacts.find(c => c.uid === uid)
  }
}