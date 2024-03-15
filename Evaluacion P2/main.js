async function fetchToDoList() {
  try {
    const response = await fetch('http://jsonplaceholder.typicode.com/todos');
    return await response.json();
  } catch (error) {
    console.error('Error fetching to-do list:', error);
    return [];
  }
}

function displayTable(data, selectedProperties, displayStatusColumn) {
  const tableContainer = document.getElementById('tableContainer');
  tableContainer.innerHTML = '';

  const table = document.createElement('table');
  const headers = displayStatusColumn ? [...selectedProperties, 'Status'] : selectedProperties;
  table.innerHTML = `<tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>`;

  data.forEach(item => {
    const row = table.insertRow();
    headers.forEach(header => {
      const cell = row.insertCell();
      if (header === 'Status' && displayStatusColumn) {
        cell.textContent = item.completed ? 'Resolved' : 'Unresolved';
      } else {
        cell.textContent = item[header];
      }
    });
  });

  tableContainer.appendChild(table);
}

async function main() {
  const toDoList = await fetchToDoList();
  const dropdownOptions = document.getElementById('dropdownOptions');

  [
    "List of all tasks (only ID)",
    "List of all tasks (ID and Titles)",
    "List of unresolved tasks (ID and Title)",
    "List of resolved tasks (ID and Title)",
    "List of all tasks (ID and userID)",
    "List of resolved tasks (ID and userID)",
    "List of unresolved tasks (ID and userID)"
  ].forEach((option, index) => {
    const anchor = document.createElement('a');
    anchor.textContent = option;
    anchor.addEventListener('click', () => displayTableContent(index + 1));
    dropdownOptions.appendChild(anchor);
  });

  function displayTableContent(option) {
    let filteredList = toDoList;
    let displayStatusColumn = false;

    switch (option) {
      case 3:
        filteredList = toDoList.filter(item => !item.completed);
        displayStatusColumn = true;
        break;
      case 4:
        filteredList = toDoList.filter(item => item.completed);
        displayStatusColumn = true;
        break;
      case 6:
        filteredList = toDoList.filter(item => item.completed);
        displayStatusColumn = true;
        break;
      case 7:
        filteredList = toDoList.filter(item => !item.completed);
        displayStatusColumn = true;
        break;
      default:
        break;
    }

    const selectedProperties = getSelectedProperties(option);
    displayTable(filteredList, selectedProperties, displayStatusColumn);
  }

  function getSelectedProperties(option) {
    switch (option) {
      case 1:
        return ['id'];
      case 2:
      case 3:
      case 4:
        return ['id', 'title'];
      case 5:
      case 6:
      case 7:
        return ['id', 'userId'];
      default:
        return [];
    }
  }

  displayTable(toDoList, [], false);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

window.onload = main;