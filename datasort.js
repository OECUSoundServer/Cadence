function sortTable(columnIndex) {
    const table = document.getElementById("albumTable");
    const rows = Array.from(table.getElementsByTagName("tr"));
    const isAscending = table.getAttribute("data-order") === "asc";
        
    rows.shift(); // Remove the header row
        
    rows.sort((a, b) => {
        const valueA = a.getElementsByTagName("td")[columnIndex].textContent;
        const valueB = b.getElementsByTagName("td")[columnIndex].textContent;

        return isAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    // Re-append the rows in the sorted order
    const sortedTable = document.createElement("tbody");
    sortedTable.appendChild(table.getElementsByTagName("tr")[0]); // Header row
    rows.forEach(row => sortedTable.appendChild(row));

    // Update the sorting order attribute
    table.setAttribute("data-order", isAscending ? "desc" : "asc");

    // Replace the table body with the sorted one
    table.replaceChild(sortedTable, table.getElementsByTagName("tbody")[0]);

    // Reapply alternating row colors
    applyAlternateRowColors();
}

function applyAlternateRowColors() {
    const table = document.getElementById("albumTable");
    const rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        
    for (let i = 0; i < rows.length; i++) {
        rows[i].style.backgroundColor = i % 2 === 0 ? "#f2f2f2" : "#fff";
    }
}

// Initialize the alternating row colors
applyAlternateRowColors();