// Inventory Management System for Stock Subtraction
function convertToMilligrams(stock) {
  return (
    stock.tons * 1e9 +
    stock.kilograms * 1e6 +
    stock.grams * 1e3 +
    stock.milligrams
  );
}

// Convert milligrams back to stock object
function convertToStock(milligrams) {
  const stock = {};
  stock.tons = Math.floor(milligrams / 1e9);
  milligrams %= 1e9;
  stock.kilograms = Math.floor(milligrams / 1e6);
  milligrams %= 1e6;
  stock.grams = Math.floor(milligrams / 1e3);
  stock.milligrams = milligrams % 1e3;
  return stock;
}

// updateStock function to handle stock updates
function updateStock(initialStock, sold) {
  const stock = { ...initialStock };

  let totalSoldMilligrams = convertToMilligrams(sold);
  let totalStockMilligrams = convertToMilligrams(stock);

  const remainingMilligrams = totalStockMilligrams - totalSoldMilligrams;
  if (remainingMilligrams < 0) {
    throw new Error("Not enough stock available");
  }

  const updatedStock = convertToStock(remainingMilligrams);
  return updatedStock;
}

/*******************************************/
/*******************************************/
/* TEST CASE */
/*******************************************/
/*******************************************/

testBasicSubtraction();
testNoSale();
testSoldEverything();
testSoldMoreThanStock();
testSubtract500Grams();

function assertEqual(actual, expected, message) {
  const actualString = JSON.stringify(actual);
  const expectedString = JSON.stringify(expected);
  if (actualString === expectedString) {
    console.log(`✅ ${message}`);
  } else {
    console.error(`❌ ${message}`);
    console.error(`   Expected: ${expectedString}`);
    console.error(`   Actual:   ${actualString}`);
  }
}

// Test Case 1: Basic Subtraction
function testBasicSubtraction() {
  const initialStock = { tons: 1, kilograms: 0, grams: 0, milligrams: 0 };
  const sold = { tons: 0, kilograms: 500, grams: 500, milligrams: 500 };

  console.log("\n=== Test Case 1: Basic Subtraction ===");
  console.log("Initial Stock:", initialStock);
  console.log("Sold:", sold);

  const updatedStock = updateStock(initialStock, sold);

  console.log("Updated Stock:", updatedStock);
  const expectedStock = {
    tons: 0,
    kilograms: 499,
    grams: 499,
    milligrams: 500,
  };

  console.log("Expected Stock:", expectedStock);

  assertEqual(updatedStock, expectedStock, "Basic subtraction should work");
}

// Test Case 2: No sale (no change)
function testNoSale() {
  const initialStock = { tons: 1, kilograms: 1, grams: 1, milligrams: 1 };
  const sold = { tons: 0, kilograms: 0, grams: 0, milligrams: 0 };

  console.log("\n=== Test Case 2: No Sale ===");
  console.log("Initial Stock:", initialStock);
  console.log("Sold:", sold);

  const updatedStock = updateStock(initialStock, sold);

  console.log("Updated Stock:", updatedStock);
  const expectedStock = initialStock;
  console.log("Expected Stock:", expectedStock);

  assertEqual(
    updatedStock,
    expectedStock,
    "No sale should keep stock unchanged",
  );
}

// Test Case 3: Sold everything (stock zero)
function testSoldEverything() {
  const initialStock = { tons: 0, kilograms: 1, grams: 0, milligrams: 0 };
  const sold = { tons: 0, kilograms: 1, grams: 0, milligrams: 0 };

  console.log("\n=== Test Case 3: Sold Everything ===");
  console.log("Initial Stock:", initialStock);
  console.log("Sold:", sold);

  const updatedStock = updateStock(initialStock, sold);

  console.log("Updated Stock:", updatedStock);

  const expectedStock = { tons: 0, kilograms: 0, grams: 0, milligrams: 0 };
  console.log("Expected Stock:", expectedStock);
  assertEqual(
    updatedStock,
    expectedStock,
    "Sold everything should leave stock at zero",
  );
}

// Test Case 4: Sold more than stock (should throw)
function testSoldMoreThanStock() {
  const initialStock = { tons: 0, kilograms: 1, grams: 0, milligrams: 0 };
  const sold = { tons: 0, kilograms: 2, grams: 0, milligrams: 0 };

  console.log("\n=== Test Case 4: Sold More Than Available ===");
  console.log("Initial Stock:", initialStock);
  console.log("Sold:", sold);

  let errorCaught = false;
  try {
    const updatedStock = updateStock(initialStock, sold);
    console.log("Updated Stock:", updatedStock);
  } catch (e) {
    errorCaught = true;
    console.log("Error:", e.message);
    assertEqual(
      e.message,
      "Not enough stock available",
      "Should throw when sold more than available",
    );
  }
  if (!errorCaught) {
    console.error(
      "❌ Should have thrown an error when sold more than available",
    );
  } else {
    console.log("✅ Sold more than available throws an error");
  }
}

// Test Case 5: Subtracting 500 grams from 1 ton
function testSubtract500Grams() {
  const initialStock = { tons: 1, kilograms: 0, grams: 0, milligrams: 0 };
  const sold = { tons: 0, kilograms: 0, grams: 500, milligrams: 0 };

  console.log("\n=== Test Case 5: Subtract 500 grams from 1 ton ===");
  console.log("Initial Stock:", initialStock);
  console.log("Sold:", sold);

  const updatedStock = updateStock(initialStock, sold);

  console.log("Updated Stock:", updatedStock);

  const expectedStock = { tons: 0, kilograms: 999, grams: 500, milligrams: 0 };
  console.log("Expected Stock:", expectedStock);

  assertEqual(updatedStock, expectedStock, "Subtracting 500 grams should work");
}
