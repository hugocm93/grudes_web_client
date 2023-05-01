
function Table({ columns, rows, onClick}) {
  return (
    <table onClick = {onClick}>
      <thead>
        <tr key = "1">
        {columns.map((column) => (<th key={column.name} >{column.name}</th>))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (<td key = {column.name}>{column.get(row)}</td>))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
