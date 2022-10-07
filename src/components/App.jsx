import { Component } from 'react';
import { nanoid } from 'nanoid'
import ContactList from './ContactList/ContactList';
import Filter from './Filter/Filter';
import Message from './Message/Message';
import FormEl from './Form/Form';
import Modal from './Modal/Modal';
// import Gets from './GET/Get';
import axios from 'axios';
import Select from 'react-select';

axios.defaults.baseURL = 'https://api.thedogapi.com/v1';
axios.defaults.headers.common['x-api-key'] = process.env.REACT_APP_API_KEY;

export default class App extends Component {

state = {
  contacts: [],
  filter: '',
  showModal: false,
  breeds: [],
  dog: null,
  selectedBreed: null,
}


    handlerSubmit = ({ name, number }) => {
    const nameToRegistr = name;
    if (this.findDuplicateName(nameToRegistr)) {
      alert('Такий контакт вже існує');
      return;
    } 
    this.addContact(nameToRegistr, number);
};

    addContact = (name, number) => {
    const contact = {
      id: nanoid(),
      name,
      number,
    };
    this.setState(({ contacts }) => ({
      contacts: [contact, ...contacts],
    }));
  };

  deleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

   filteredContacts = () => {
    const { contacts, filter } = this.state;
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(filter.toLowerCase)
    );
  };


    visibleContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.includes(normalizedFilter)
    );
  };
  
    onFilterChange = e => {
    this.setState({ filter: e.currentTarget.value });
  };

    findDuplicateName = name => {
    const { contacts } = this.state;
    return contacts.find(item => item.name.toLowerCase() === name);
  };

  togleModal = () => {
  this.setState(({showModal}) => ({
    showModal: !showModal,
  }))
};

async componentDidMount() {
    try {
        const response = await axios.get('/breeds',); 
        this.setState({breeds: response.data});
    } catch (error) {}
}

async componentDidUpdate(_, prevState) {
  if (prevState.selectedBreed !== this.state.selectedBreed) {
    this.fetchDog();
  }
}

buildOptions = () => {
return this.state.breeds.map(breed => ({value: breed.id, label: breed.name}));
}

handleChangeBreed = async option => {
   this.setState({selectedBreed: option.value})
}

fetchDog = async () => {
   try {
    const response = await axios.get('/images/search', {params: {breed_id: this.setState.selectedBreed,}});
    this.setState({dog: response.data[0]});
  } catch (error) {}
  
};


    render() {
    const { contacts, filter, showModal } = this.state;
    const newVisibleContacts = this.visibleContacts();
    const options = this.buildOptions();
    const {dog} = this.state;

  return (
 <div>
  <button type='button' onClick={this.togleModal}>Відкрити модалку</button>
  {showModal && (<Modal onClose={this.togleModal}>
    <h1>Контент модалки (Чілдрен)</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    <button type='button' onClick={this.togleModal}>Закрити модалку</button></Modal>)}
    <div>
    <Select options={options} onChange={this.handleChangeBreed} />
    {dog && (
    <div>
      <img src={dog.url} width="400" />
      <button onClick={this.fetchDog} >Показати інше шображення</button>
      </div>)}
      </div>
        <Message Message="Phonebook" />
        <FormEl onSubmit={this.handlerSubmit} />
        <Filter
          Message="Find contacts by name"
          value={filter}
          onChange={this.onFilterChange}
        />
        {contacts.length > 0 && (
          <ContactList
            Message="Contacts"
            contacts={newVisibleContacts}
            onDeleteContact={this.deleteContact}
          />
        )}
      </div>
  )
};

};


