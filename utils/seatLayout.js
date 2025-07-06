// Generates a default seat layout (e.g., 5 rows A–E, 10 seats per row)
function generateSeatLayout(rows = 5, seatsPerRow = 10) {
    const layout = [];
    const startCharCode = "A".charCodeAt(0); // 65
  
    for (let i = 0; i < rows; i++) {
      const rowLetter = String.fromCharCode(startCharCode + i);
      for (let j = 1; j <= seatsPerRow; j++) {
        layout.push({
          seatNumber: `${rowLetter}${j}`,
          status: "available"
        });
      }
    }
  
    return layout;
  }
  
  module.exports = generateSeatLayout;
  