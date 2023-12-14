import { signal, useSignalEffect  } from '@preact/signals-react';
import PizzaList from './PizzaList';


const API_URL = "http://localhost:3000/pizzas";
const headers = {
    Accept: "application/json",
    'Content-Type': "application/json"
};

const fetchPizzaData = async () => {

    console.log('fetching...')
    const response = await fetch(API_URL);

    const myData = await response.json();

    if(myData) {
        return  myData;
    } else {
        return [];
    }
  };

//   create and export signal
  export const data = signal(await fetchPizzaData());
  export const apiError = signal({});
  



const term = "Pizza";

function Pizza() {

    useSignalEffect(()=> console.log("EFF: ", data));
  
  const handleCreate = async(item) => {
    // Simulate creating item on API
    fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({name: item.name, description: item.description}),
    })
    .then(response => response.json())
    .then(async(returnedItem) => data.value = [...await fetchPizzaData()])
    .catch(err => apiError.value = err);

    const newValues = await fetchPizzaData();
    data.value = [...newValues];
  };

  const handleUpdate = async(item) => {
    // Simulate updating item on API

    fetch(`${API_URL}/${item.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(item)
    })
    .then(response => response.json())
    .then(async (returnedItem)=> {
        data.value = [...await fetchPizzaData()];
    })
    .catch(err => apiError.value = err);
  };

  const handleDelete = async (item) => {

    fetch(`${API_URL}/${item.id}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify(item)
    })
    .then(response => response.json())
    .then(async(returnedItem)=> {
        data.value = [...await fetchPizzaData()];
    })
    .catch(err => apiError.value = err);
  };

  return (
    <div>
      <PizzaList
        name={term}
        // data={data}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Pizza;