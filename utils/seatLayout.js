// Generates a default seat layout (10 rows A–J, 16 seats per row)
function generateSeatLayout(rows = 10, seatsPerRow = 16) {
  const layout = [];
  const startCharCode = "A".charCodeAt(0);

  for (let i = 0; i < rows; i++) {
    const rowLetter = String.fromCharCode(startCharCode + i);
    for (let j = 1; j <= seatsPerRow; j++) {
      layout.push({
        seatNumber: `${rowLetter}${j}`,
        status: "available",
      });
    }
  }

  return layout;
}

module.exports = generateSeatLayout;