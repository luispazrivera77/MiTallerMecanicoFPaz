:root {
  --negro: #000;
  --gris: #444;
  --blanco: #fff;
  --rojo: #e53935;
  --azul: #1e88e5;
}

body {
  font-family: Arial, sans-serif;
  background-color: var(--negro);
  color: var(--blanco);
  margin: 0;
}

header {
  background: var(--gris);
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  margin: 0;
  color: var(--azul);
}

button {
  background: var(--azul);
  color: var(--blanco);
  border: 1px solid var(--blanco);
  padding: 6px 12px;
  cursor: pointer;
}

button:hover {
  background: var(--rojo);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid var(--gris);
  padding: 5px;
  text-align: center;
  background-color: var(--negro);
  color: var(--blanco);
}

input[type="text"], input[type="date"], input[type="file"] {
  width: 100%;
  box-sizing: border-box;
  background-color: var(--blanco);
  color: var(--negro);
  border: 1px solid var(--gris);
}

.actions {
  margin-top: 10px;
  text-align: center;
}
